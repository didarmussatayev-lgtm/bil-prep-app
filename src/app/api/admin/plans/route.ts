import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { planSchema } from "@/lib/payments/schemas";

// POST /api/admin/plans — новый тариф
export async function POST(req: Request) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const parsed = planSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Название, месяцы (1–36) и цена от 100 ₸" }, { status: 400 });
  const order = ((await prisma.plan.aggregate({ _max: { order: true } }))._max.order ?? 0) + 1;
  const plan = await prisma.plan.create({ data: { ...parsed.data, order } });
  return NextResponse.json(plan, { status: 201 });
}
