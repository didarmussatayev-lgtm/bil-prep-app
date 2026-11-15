import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { planSchema } from "@/lib/payments/schemas";

// PATCH /api/admin/plans/:id — правка тарифа (старые платежи хранят свою копию суммы и срока)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const parsed = planSchema.partial().safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  const plan = await prisma.plan.update({ where: { id: (await params).id }, data: parsed.data }).catch(() => null);
  return plan ? NextResponse.json(plan) : NextResponse.json({ error: "Тариф не найден" }, { status: 404 });
}
