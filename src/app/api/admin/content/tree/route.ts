import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { bookKey, listBooks } from "@/lib/student/access";

/** Дерево контента для редактора: предмет → книга (уровень) → раздел → тема, со счётчиками задач. */
export async function GET() {
  const g = await requireAdmin(); if (g.error) return g.error;
  const [subjects, sections, taskCounts, books] = await Promise.all([
    prisma.subject.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
    prisma.section.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true, subjectId: true, title: true, level: true, order: true,
        topics: { orderBy: { order: "asc" }, select: { id: true, title: true, order: true, hidden: true, explanationContent: true } },
      },
    }),
    prisma.task.groupBy({ by: ["topicId", "type", "hidden"], _count: true }),
    listBooks(),
  ]);
  const counts = new Map<string, { practice: number; test: number; hiddenTasks: number }>();
  for (const c of taskCounts) {
    const e = counts.get(c.topicId) ?? { practice: 0, test: 0, hiddenTasks: 0 };
    if (c.type === "open") e.practice += c._count; else e.test += c._count;
    if (c.hidden) e.hiddenTasks += c._count;
    counts.set(c.topicId, e);
  }
  const bookTitle = new Map(books.map((b) => [b.key, b.title]));
  return NextResponse.json({
    subjects: subjects.map((s) => ({
      id: s.id,
      name: s.name,
      books: [...new Set(sections.filter((x) => x.subjectId === s.id).map((x) => x.level))].sort().map((level) => ({
        level,
        title: bookTitle.get(bookKey({ subjectId: s.id, level })) ?? `${s.name} ${level}`,
        sections: sections.filter((x) => x.subjectId === s.id && x.level === level).map((x) => ({
          id: x.id, title: x.title, order: x.order,
          topics: x.topics.map((t) => ({
            id: t.id, title: t.title, order: t.order, hidden: t.hidden,
            empty: !String(t.explanationContent ?? "").trim(),
            ...(counts.get(t.id) ?? { practice: 0, test: 0, hiddenTasks: 0 }),
          })),
        })),
      })),
    })),
  });
}
