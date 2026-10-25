import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { parseBookKeys } from "@/lib/student/access";

/**
 * Массовое действие над выбранными учениками. POST { studentIds, book: "subjectId:level", mode }
 *  - "add":  добавить книгу ученикам с ограниченным доступом (у тех, кому открыто всё, ничего не меняется — skipped);
 *  - "only": оставить ученику только эту книгу.
 */
export async function POST(req: Request) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const body = await req.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.studentIds) ? body.studentIds.filter((x: unknown) => typeof x === "string") : [];
  const mode = body?.mode;
  const book = (await parseBookKeys([body?.book]))?.[0];
  if (!ids.length || !book || (mode !== "add" && mode !== "only"))
    return NextResponse.json({ error: "Выберите учеников и книгу" }, { status: 400 });

  const students = await prisma.user.findMany({
    where: { id: { in: ids }, role: "student" },
    select: { id: true, restrictAccess: true },
  });
  const target = mode === "only" ? students : students.filter((s) => s.restrictAccess);
  const data = target.map((s) => ({ userId: s.id, subjectId: book.subjectId, level: book.level }));

  await prisma.$transaction([
    ...(mode === "only"
      ? [
          prisma.userBookAccess.deleteMany({ where: { userId: { in: target.map((s) => s.id) } } }),
          prisma.user.updateMany({ where: { id: { in: target.map((s) => s.id) } }, data: { restrictAccess: true } }),
        ]
      : []),
    prisma.userBookAccess.createMany({ data, skipDuplicates: true }),
  ]);
  return NextResponse.json({ updated: target.length, skipped: students.length - target.length });
}
