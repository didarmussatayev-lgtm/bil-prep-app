import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { bookKey, parseBookKeys, setStudentAccess } from "@/lib/student/access";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id } = await params;
  const u = await prisma.user.findFirst({
    where: { id, role: "student" },
    select: { restrictAccess: true, bookAccess: { select: { subjectId: true, level: true } } },
  });
  if (!u) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ restricted: u.restrictAccess, books: u.bookAccess.map(bookKey) });
}

// PUT { restricted: boolean, books: ["subjectId:level", ...] }
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (typeof body?.restricted !== "boolean") return NextResponse.json({ error: "Неверные параметры" }, { status: 400 });
  if (!(await prisma.user.findFirst({ where: { id, role: "student" }, select: { id: true } })))
    return NextResponse.json({ error: "not found" }, { status: 404 });
  const books = (await parseBookKeys(body.books)) ?? [];
  await setStudentAccess(id, body.restricted, books);
  return NextResponse.json({ ok: true });
}
