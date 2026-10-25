import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SUBJECT_LEVELS } from "@/lib/student/progress";

/**
 * Доступ ученика к материалам. «Книга» = (предмет, Section.level).
 * Админы и ученики с restrictAccess=false видят всё.
 */
export type Book = { subjectId: string; level: number };
export type Access = { restricted: boolean; books: Book[] };

export const bookKey = (b: Book) => `${b.subjectId}:${b.level}`;

export const getAccess = cache(async (userId: string): Promise<Access> => {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, restrictAccess: true, bookAccess: { select: { subjectId: true, level: true } } },
  });
  if (!u) return { restricted: true, books: [] };
  if (u.role === "admin" || !u.restrictAccess) return { restricted: false, books: [] };
  return { restricted: true, books: u.bookAccess };
});

/** Условие для Section: пусто для неограниченных, иначе только открытые книги. */
export function sectionWhereFor(a: Access): Prisma.SectionWhereInput {
  if (!a.restricted) return {};
  if (a.books.length === 0) return { id: { in: [] } };
  return { OR: a.books.map((b) => ({ subjectId: b.subjectId, level: b.level })) };
}

export async function sectionFilter(userId: string) {
  return sectionWhereFor(await getAccess(userId));
}

export const allowedLevels = (a: Access, subjectId: string): number[] | undefined =>
  a.restricted ? a.books.filter((b) => b.subjectId === subjectId).map((b) => b.level) : undefined;

/** Какие из задач доступны ученику (для проверки попыток тестов целиком). */
export async function accessibleTaskIds(userId: string, ids: string[]): Promise<Set<string>> {
  const filter = await sectionFilter(userId);
  const rows = await prisma.task.findMany({
    where: { id: { in: ids }, topic: { section: filter } },
    select: { id: true },
  });
  return new Set(rows.map((r) => r.id));
}

/** Список всех книг (для админки): предметы × уровни, в которых есть разделы. */
export async function listBooks() {
  const rows = await prisma.section.findMany({
    distinct: ["subjectId", "level"],
    select: { subjectId: true, level: true, subject: { select: { name: true, slug: true, order: true } } },
  });
  const perSubject = new Map<string, number>();
  for (const r of rows) perSubject.set(r.subjectId, (perSubject.get(r.subjectId) ?? 0) + 1);
  return rows
    .map((r) => {
      const fixed = SUBJECT_LEVELS[r.subject.slug]?.find((l) => l.level === r.level)?.title;
      const title = fixed ?? (perSubject.get(r.subjectId)! > 1 ? `${r.subject.name} ${r.level}` : r.subject.name);
      return { key: bookKey(r), subjectId: r.subjectId, level: r.level, title, order: r.subject.order };
    })
    .sort((a, b) => a.order - b.order || a.level - b.level)
    .map(({ order: _o, ...b }) => b);
}

/** Разбор ключей книг «subjectId:level» из запроса админки; неизвестные ключи отбрасываются. */
export async function parseBookKeys(keys: unknown): Promise<Book[] | null> {
  if (!Array.isArray(keys)) return null;
  const known = new Map((await listBooks()).map((b) => [b.key, { subjectId: b.subjectId, level: b.level }]));
  const out = new Map<string, Book>();
  for (const k of keys) {
    const b = typeof k === "string" ? known.get(k) : undefined;
    if (b) out.set(bookKey(b), b);
  }
  return [...out.values()];
}

/** Полная замена доступа ученика. restrict=false — открыто всё (список книг очищается). */
export function setStudentAccess(userId: string, restrict: boolean, books: Book[]) {
  return prisma.$transaction([
    prisma.userBookAccess.deleteMany({ where: { userId } }),
    prisma.user.update({ where: { id: userId }, data: { restrictAccess: restrict } }),
    ...(restrict
      ? [prisma.userBookAccess.createMany({ data: books.map((b) => ({ userId, subjectId: b.subjectId, level: b.level })) })]
      : []),
  ]);
}
