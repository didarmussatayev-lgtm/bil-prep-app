import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const schema = z.object({
  key: z.string().trim().min(1).max(40).regex(/^[\w-]+$/),
  title: z.string().trim().min(1).max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET() {
  const g = await requireAdmin(); if (g.error) return g.error;
  const rows = await prisma.examTarget.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(rows.map((r) => ({ id: r.id, key: r.key, title: r.title, date: r.date.toISOString().slice(0, 10) })));
}

// PUT { key, title, date } — создать или обновить экзамен по ключу ("bil", позже "nis", "rfmsh"…)
export async function PUT(req: Request) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Укажите название и дату" }, { status: 400 });
  const date = new Date(p.data.date + "T00:00:00Z");
  await prisma.examTarget.upsert({ where: { key: p.data.key }, update: { title: p.data.title, date }, create: { key: p.data.key, title: p.data.title, date } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const key = new URL(req.url).searchParams.get("key") ?? "";
  await prisma.examTarget.deleteMany({ where: { key } });
  return NextResponse.json({ ok: true });
}
