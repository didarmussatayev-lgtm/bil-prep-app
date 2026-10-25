import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

type Ctx = { params: Promise<{ id: string; noteId: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id, noteId } = await params;
  const text = String((await req.json().catch(() => null))?.text ?? "").trim().slice(0, 4000);
  if (!text) return NextResponse.json({ error: "Заметка пустая" }, { status: 400 });
  const res = await prisma.studentNote.updateMany({ where: { id: noteId, userId: id }, data: { text } });
  return res.count ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 });
}

export async function DELETE(_: Request, { params }: Ctx) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id, noteId } = await params;
  const res = await prisma.studentNote.deleteMany({ where: { id: noteId, userId: id } });
  return res.count ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 });
}
