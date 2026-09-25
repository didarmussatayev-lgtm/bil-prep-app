import "server-only";
import { prisma } from "@/lib/prisma";
import { hasPendingFigure, parseFigures } from "@/lib/content/types";

export type TopicRow = {
  id: string;
  title: string;
  learned: boolean;
  practiceTotal: number; // задач type=open
  practiceSolved: number; // из них решено верно
  testTotal: number; // вопросов type=test_choice
};
export type SectionRow = { id: string; title: string; topics: TopicRow[] };

export type Status = "not_started" | "in_progress" | "done" | "empty";

export const learnStatus = (t: TopicRow): Status => (t.learned ? "done" : "not_started");

export function practiceStatus(t: TopicRow): Status {
  if (t.practiceTotal === 0) return "empty";
  if (t.practiceSolved === 0) return "not_started";
  return t.practiceSolved >= t.practiceTotal ? "done" : "in_progress";
}

export function getSubjectBySlug(slug: string) {
  return prisma.subject.findUnique({ where: { slug }, select: { id: true, name: true, slug: true } });
}

export function listSubjects() {
  return prisma.subject.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

/** Оглавление предмета (разделы → темы) с прогрессом конкретного ученика. */
export async function getCourseTree(subjectId: string, userId: string): Promise<SectionRow[]> {
  const sections = await prisma.section.findMany({
    where: { subjectId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      topics: { orderBy: { order: "asc" }, select: { id: true, title: true } },
    },
  });

  const topicIds = sections.flatMap((s) => s.topics.map((t) => t.id));

  const [allTasks, solvedRows, progressRows] = await Promise.all([
    // groupBy не умеет фильтровать по содержимому JSON, поэтому считаем сами —
    // задачи с ещё не готовым рисунком (kind="placeholder") в счётчики не входят:
    // они и так скрыты от ученика (см. practice/[topicId]/page.tsx, lib/student/tests.ts).
    prisma.task.findMany({
      where: { topicId: { in: topicIds } },
      select: { topicId: true, type: true, imageParamsJson: true },
    }),
    prisma.taskResult.findMany({
      where: { userId, correct: true, task: { topicId: { in: topicIds }, type: "open" } },
      select: { task: { select: { topicId: true } } },
    }),
    prisma.progress.findMany({
      where: { userId, topicId: { in: topicIds }, learnedAt: { not: null } },
      select: { topicId: true },
    }),
  ]);

  const practiceTotal = new Map<string, number>();
  const testTotal = new Map<string, number>();
  for (const t of allTasks) {
    if (hasPendingFigure(parseFigures(t.imageParamsJson))) continue;
    const m = t.type === "open" ? practiceTotal : testTotal;
    m.set(t.topicId, (m.get(t.topicId) ?? 0) + 1);
  }
  const solved = new Map<string, number>();
  for (const r of solvedRows) {
    solved.set(r.task.topicId, (solved.get(r.task.topicId) ?? 0) + 1);
  }
  const learned = new Set(progressRows.map((p) => p.topicId));

  return sections.map((s) => ({
    id: s.id,
    title: s.title,
    topics: s.topics.map((t) => ({
      id: t.id,
      title: t.title,
      learned: learned.has(t.id),
      practiceTotal: practiceTotal.get(t.id) ?? 0,
      practiceSolved: solved.get(t.id) ?? 0,
      testTotal: testTotal.get(t.id) ?? 0,
    })),
  }));
}

export const flattenTopics = (sections: SectionRow[]) => sections.flatMap((s) => s.topics);

/**
 * Общий % курса = (изученные темы + верно решённые задачи) / (все темы + все задачи).
 * Тесты в процент не входят — их результаты показываются отдельно.
 */
export function summarize(sections: SectionRow[]) {
  let topics = 0, learned = 0, tasks = 0, solved = 0;
  for (const t of flattenTopics(sections)) {
    topics += 1;
    if (t.learned) learned += 1;
    tasks += t.practiceTotal;
    solved += t.practiceSolved;
  }
  const units = topics + tasks;
  return { topics, learned, tasks, solved, percent: units ? Math.round(((learned + solved) / units) * 100) : 0 };
}

export async function getOverallProgress(userId: string) {
  const subjects = await prisma.subject.findMany({ select: { id: true } });
  const trees = await Promise.all(subjects.map((s) => getCourseTree(s.id, userId)));
  return summarize(trees.flat());
}
