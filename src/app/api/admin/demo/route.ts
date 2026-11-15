import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { hashPassword } from "@/lib/auth/password";
import { DEMO_LOGIN, DEMO_PASSWORD } from "@/lib/site-info";

// POST /api/admin/demo — создаёт (или сбрасывает) демо-аккаунт student/student:
// по одной теме, закреплению и тесту на предмет, один вход на всех, пароль менять нельзя.
export async function POST() {
  const g = await requireAdmin(); if (g.error) return g.error;
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const data = { passwordHash, role: "student" as const, isDemo: true, freeAccess: true, restrictAccess: false };
  const existing = await prisma.user.findUnique({ where: { login: DEMO_LOGIN }, select: { id: true, role: true, isDemo: true } });
  if (existing && !existing.isDemo) {
    return NextResponse.json({ error: `Логин «${DEMO_LOGIN}» уже занят обычным учеником. Переименуйте его и повторите.` }, { status: 409 });
  }
  const u = existing
    ? await prisma.user.update({ where: { id: existing.id }, data })
    : await prisma.user.create({ data: { login: DEMO_LOGIN, ...data } });
  await prisma.userBookAccess.deleteMany({ where: { userId: u.id } });
  return NextResponse.json({ ok: true, login: DEMO_LOGIN, password: DEMO_PASSWORD });
}
