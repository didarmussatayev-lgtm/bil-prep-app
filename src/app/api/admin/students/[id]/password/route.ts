import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, generatePassword } from "@/lib/admin";
import { hashPassword } from "@/lib/auth/password";
import { revokeUserSessions } from "@/lib/auth/session";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id } = await params;
  const user = await prisma.user.findFirst({ where: { id, role: "student" } });
  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });
  const password = generatePassword();
  await prisma.user.update({ where: { id }, data: { passwordHash: await hashPassword(password) } });
  await revokeUserSessions(id, "password_reset"); // старый пароль → выход везде
  return NextResponse.json({ login: user.login, password });
}
