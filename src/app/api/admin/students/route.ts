import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, generatePassword } from "@/lib/admin";
import { hashPassword } from "@/lib/auth/password";
import { isInactive, loadStudents } from "@/lib/admin-students";
import { bookKey, parseBookKeys, setStudentAccess } from "@/lib/student/access";

// GET /api/admin/students?q=&book=&activity=all|inactive|never|online&progress=all|low|mid|high&sort=new|name|progress|activity&page=1
// Поиск, фильтры, сортировка и пагинация — на сервере (учеников 100+).
const PAGE_SIZE = 20;

export async function GET(req: Request) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const sp = new URL(req.url).searchParams;
  const q = (sp.get("q") ?? "").trim().toLowerCase();
  const book = sp.get("book") ?? "";
  const activity = sp.get("activity") ?? "all";
  const progress = sp.get("progress") ?? "all";
  const sort = sp.get("sort") ?? "new";
  const page = Math.max(1, Number(sp.get("page")) || 1);

  let rows = await loadStudents();
  if (q) rows = rows.filter((s) => s.login.includes(q));
  if (book) rows = rows.filter((s) => !s.restricted || s.books.includes(book));
  if (activity === "inactive") rows = rows.filter((s) => isInactive(s));
  if (activity === "never") rows = rows.filter((s) => !s.lastActiveAt);
  if (activity === "shared") rows = rows.filter((s) => s.shared);
  if (activity === "online") rows = rows.filter((s) => s.online);
  if (progress === "low") rows = rows.filter((s) => s.progressPct < 30);
  if (progress === "mid") rows = rows.filter((s) => s.progressPct >= 30 && s.progressPct < 70);
  if (progress === "high") rows = rows.filter((s) => s.progressPct >= 70);

  const ts = (d: Date | null) => d?.getTime() ?? 0;
  rows.sort(
    sort === "name" ? (a, b) => a.login.localeCompare(b.login)
    : sort === "progress" ? (a, b) => a.progressPct - b.progressPct
    : sort === "activity" ? (a, b) => ts(a.lastActiveAt) - ts(b.lastActiveAt)
    : (a, b) => ts(b.createdAt) - ts(a.createdAt),
  );

  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const cur = Math.min(page, pages);
  return NextResponse.json({ items: rows.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE), total, page: cur, pages });
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
