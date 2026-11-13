import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { extendAccess } from "@/lib/payments/service";

const schema = z.object({
  login: z.string().trim().toLowerCase().min(1),
  months: z.number().int().min(1).max(36),
  amount: z.number().int().min(0).max(10_000_000).default(0),
  note: z.string().trim().max(200).optional(),
  freeAccess: z.boolean().optional(),
});

// POST /api/admin/payments/grant — ручное продление (оплата переводом, подарок). Пишется как платёж method=manual.
export async function POST(req: Request) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Укажите логин и число месяцев (1–36)" }, { status: 400 });
  const u = await prisma.user.findUnique({ where: { login: parsed.data.login }, select: { id: true, role: true } });
  if (!u || u.role !== "student") return NextResponse.json({ error: "Ученик не найден" }, { status: 404 });
  await prisma.payment.create({
    data: { userId: u.id, months: parsed.data.months, amount: parsed.data.amount, method: "manual", status: "paid", paidAt: new Date(), note: parsed.data.note || "Вручную админом" },
  });
  const { accessUntil } = await extendAccess(u.id, parsed.data.months);
  if (parsed.data.freeAccess !== undefined) await prisma.user.update({ where: { id: u.id }, data: { freeAccess: parsed.data.freeAccess } });
  return NextResponse.json({ ok: true, accessUntil });
}
