import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, generatePassword } from "@/lib/admin";
import { hashPassword } from "@/lib/auth/password";
import { getOverallProgress } from "@/lib/student/progress";
import { bookKey, parseBookKeys, setStudentAccess } from "@/lib/student/access";

export async function GET() {
  const g = await requireAdmin(); if (g.error) return g.error;
  const users = await prisma.user.findMany({
    where: { role: "student" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, login: true, createdAt: true, restrictAccess: true,
      bookAccess: { select: { subjectId: true, level: true } },
      sessions: { where: { revoked: false, expiresAt: { gt: new Date() } }, select: { id: true } },
    },
  });
  // Общий % курса — та же формула, что видит сам ученик на главной (lib/student/progress.ts).
  const withProgress = await Promise.all(
    users.map(async (u) => ({
      id: u.id, login: u.login, createdAt: u.createdAt,
      online: u.sessions.length > 0,
      restricted: u.restrictAccess,
      books: u.bookAccess.map(bookKey),
      progressPct: (await getOverallProgress(u.id)).percent,
    })),
  );
  return NextResponse.json(withProgress);
}

// Логины хранятся в нижнем регистре (см. step3-auth-README, п. 4) — приводим при создании.
const createSchema = z.object({
  login: z.string().trim().min(3).max(32).regex(/^[\w.-]+$/).transform((v) => v.toLowerCase()),
});

export async function POST(req: Request) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const raw = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Логин: 3–32 символа, буквы/цифры/._-" }, { status: 400 });
  if (await prisma.user.findUnique({ where: { login: parsed.data.login } }))
    return NextResponse.json({ error: "Такой логин уже есть" }, { status: 409 });
  const password = generatePassword();
  const user = await prisma.user.create({
    data: { login: parsed.data.login, passwordHash: await hashPassword(password), role: "student" },
  });
  // books не передан — открыто всё; передан массив — только эти книги
  const books = await parseBookKeys(raw?.books);
  if (books) await setStudentAccess(user.id, true, books);
  // Пароль показываем админу один раз — в базе остаётся только хэш
  return NextResponse.json({ id: user.id, login: user.login, password }, { status: 201 });
}
