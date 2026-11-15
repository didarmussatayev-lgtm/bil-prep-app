import "server-only";
import { cache } from "react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SUBJECT_LEVELS } from "@/lib/student/progress";
import { paywallEnabled } from "@/lib/payments/config";

/**
 * Доступ ученика к материалам. «Книга» = (предмет, Section.level).
 * Админы и ученики с restrictAccess=false видят всё.
 */
export type Book = { subjectId: string; level: number };
export type Access = { restricted: boolean; books: Book[]; /** демо: открыты только эти темы */ topicIds?: string[] };

export const bookKey = (b: Book) => `${b.subjectId}:${b.level}`;

// Демо-темы: по одной на предмет — первая тема (по порядку разделов) с теорией, задачами закрепления и тестовыми вопросами.
let demoCache: { at: number; ids: string[] } | null = null;
export async function demoTopicIds(): Promise<string[]> {
  if (demoCache && Date.now() - demoCache.at < 5 * 60_000) return demoCache.ids;
  const rows = await prisma.topic.findMany({
    where: {
      hidden: false,
      NOT: { explanationContent: { equals: Prisma.DbNull } },
      AND: [{ tasks: { some: { type: "open", hidden: false } } }, { tasks: { some: { type: "test_choice", hidden: false } } }],
    },
    orderBy: [{ section: { order: "asc" } }, { order: "asc" }],
    select: { id: true, section: { select: { subjectId: true } } },
  });
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const r of rows) if (!seen.has(r.section.subjectId)) { seen.add(r.section.subjectId); ids.push(r.id); }
  demoCache = { at: Date.now(), ids };
  return ids;
}

export const getAccess = cache(async (userId: string): Promise<Access> => {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, isDemo: true, restrictAccess: true, freeAccess: true, accessUntil: true, bookAccess: { select: { subjectId: true, level: true } } },
  });
  if (!u) return { restricted: true, books: [] };
  if (u.role === "admin") return { restricted: false, books: [] };
  if (u.isDemo) return { restricted: true, books: [], topicIds: await demoTopicIds() };
  // Платный доступ: без оплаты и без бесплатного доступа не открыто ничего (страницы покажут «Доступ не открыт»)
  if (paywallEnabled() && !u.freeAccess && !(u.accessUntil && u.accessUntil.getTime() > Date.now())) return { restricted: true, books: [] };
  if (!u.restrictAccess) return { restricted: false, books: [] };
  return { restricted: true, books: u.bookAccess };
});

/** Условие для Section: пусто для неограниченных, иначе только открытые книги. */
export function sectionWhereFor(a: Access): Prisma.SectionWhereInput {
  if (!a.restricted) return {};
  if (a.topicIds) return { topics: { some: { id: { in: a.topicIds } } } };
  if (a.books.length === 0) return { id: { in: [] } };
  return { OR: a.books.map((b) => ({ subjectId: b.subjectId, level: b.level })) };
}

export async function sectionFilter(userId: string) {
  return sectionWhereFor(await getAccess(userId));
}

/** Ограничение по темам (только демо): подмешивается как `AND: [await topicFilter(id)]` рядом с sectionFilter. */
export async function topicFilter(userId: string): Promise<Prisma.TopicWhereInput> {
  const a = await getAccess(userId);
  return a.topicIds ? { id: { in: a.topicIds } } : {};
}

export const allowedLevels = (a: Access, subjectId: string): number[] | undefined =>
  a.restricted && !a.topicIds ? a.books.filter((b) => b.subjectId === subjectId).map((b) => b.level) : undefined;

/** Какие из задач доступны ученику (для проверки попыток тестов целиком). */
export async function accessibleTaskIds(userId: string, ids: string[]): Promise<Set<string>> {
  const [filter, tf] = [await sectionFilter(userId), await topicFilter(userId)];
  const rows = await prisma.task.findMany({
    where: { id: { in: ids }, topic: { section: filter, AND: [tf] } },
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
