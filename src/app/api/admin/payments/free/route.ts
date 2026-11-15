import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// POST /api/admin/payments/free {login, free} — бесплатный доступ ученику включить/выключить (работает при PAYWALL_ENABLED=true)
export async function POST(req: Request) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const parsed = z.object({ login: z.string().trim().toLowerCase().min(1), free: z.boolean() }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Укажите логин" }, { status: 400 });
  const res = await prisma.user.updateMany({ where: { login: parsed.data.login, role: "student" }, data: { freeAccess: parsed.data.free } });
  return res.count ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Ученик не найден" }, { status: 404 });
}
