import "server-only";
import { prisma } from "@/lib/prisma";
import { getLang } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import { sectionFilter } from "@/lib/student/access";
import { Prisma } from "@prisma/client";
import { ensureTopicCounts } from "@/lib/student/topic-counts";

export type TopicRow = {
  id: string;
  title: string;
  learned: boolean;
  practiceTotal: number; // задач type=open
  practiceSolved: number; // из них решено верно
  testTotal: number; // вопросов type=test_choice
};
export type SectionRow = { id: string; title: string; level: number; topics: TopicRow[] };

/** Уровни по предметам: у математики 4 уровня («Математика 1–4»), у остальных предметов — плоский список разделов. */
export const SUBJECT_LEVELS: Record<string, { level: number; title: string }[]> = {
  math: [1, 2, 3, 4].map((level) => ({ level, title: `Математика ${level}` })),
  grade5: [1, 2].map((level) => ({ level, title: `Математика ${level}` })),
};

export type Status = "not_started" | "in_progress" | "done" | "empty";

export const learnStatus = (t: TopicRow): Status => (t.learned ? "done" : "not_started");

export function practiceStatus(t: TopicRow): Status {
  if (t.practiceTotal === 0) return "empty";
  if (t.practiceSolved === 0) return "not_started";
  return t.practiceSolved >= t.practiceTotal ? "done" : "in_progress";
}

export async function getSubjectBySlug(slug: string) {
  const [lang, s] = await Promise.all([
    getLang(),
    prisma.subject.findUnique({ where: { slug }, select: { id: true, name: true, slug: true, i18n: true } }),
  ]);
  return s && { id: s.id, slug: s.slug, name: pick(s.i18n, lang, "name", s.name) };
}

export async function listSubjects() {
  const [lang, rows] = await Promise.all([
    getLang(),
    prisma.subject.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true, slug: true, i18n: true } }),
  ]);
  return rows.map((s) => ({ id: s.id, slug: s.slug, name: pick(s.i18n, lang, "name", s.name) }));
}

/** Оглавление предмета (разделы → темы) с прогрессом конкретного ученика. */
export async function getCourseTree(subjectId: string, userId: string): Promise<SectionRow[]> {
  const [lang, access] = await Promise.all([getLang(), sectionFilter(userId), ensureTopicCounts()]);
  const sections = await prisma.section.findMany({
    where: { subjectId, ...access },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      level: true,
      i18n: true,
      topics: { where: { hidden: false }, orderBy: { order: "asc" }, select: { id: true, title: true, i18n: true, practiceCount: true, testCount: true } },
    },
  });

  const topicIds = sections.flatMap((s) => s.topics.map((t) => t.id));

  const [solvedRows, progressRows] = await Promise.all([
    prisma.$queryRaw<{ topic_id: string; n: number }[]>`
      SELECT t.topic_id, COUNT(*)::int AS n
      FROM task_results r JOIN tasks t ON t.id = r.task_id
      WHERE r.user_id = ${userId} AND r.correct AND t.type = 'open' AND t.topic_id IN (${Prisma.join(topicIds.length ? topicIds : [""])})
      GROUP BY t.topic_id`,
    prisma.progress.findMany({
      where: { userId, topicId: { in: topicIds }, learnedAt: { not: null } },
      select: { topicId: true },
    }),
  ]);
  const solved = new Map(solvedRows.map((r) => [r.topic_id, r.n]));
  const learned = new Set(progressRows.map((p) => p.topicId));

  return sections.map((s) => ({
    id: s.id,
    title: pick(s.i18n, lang, "title", s.title),
    level: s.level,
    topics: s.topics.map((t) => ({
      id: t.id,
      title: pick(t.i18n, lang, "title", t.title),
      learned: learned.has(t.id),
      practiceTotal: t.practiceCount ?? 0,
      practiceSolved: solved.get(t.id) ?? 0,
      testTotal: t.testCount ?? 0,
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

export type Overall = ReturnType<typeof summarize>;

/**
 * Общий прогресс сразу многих учеников — несколькими запросами вместо дерева на каждого.
 * Считает только по открытым ученику книгам (как getCourseTree + summarize).
 */
export async function getProgressForUsers(userIds: string[]): Promise<Map<string, Overall>> {
  const out = new Map<string, Overall>();
  if (userIds.length === 0) return out;
  await ensureTopicCounts();
  const [topics, users, learnedRows, solvedRows] = await Promise.all([
    prisma.topic.findMany({
      where: { hidden: false },
      select: { id: true, practiceCount: true, section: { select: { subjectId: true, level: true } } },
    }),
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, role: true, restrictAccess: true, bookAccess: { select: { subjectId: true, level: true } } },
    }),
    prisma.progress.findMany({
      where: { userId: { in: userIds }, learnedAt: { not: null } },
      select: { userId: true, topicId: true },
    }),
    prisma.$queryRaw<{ user_id: string; topic_id: string; n: number }[]>`
      SELECT r.user_id, t.topic_id, COUNT(*)::int AS n
      FROM task_results r JOIN tasks t ON t.id = r.task_id
      WHERE r.correct AND t.type = 'open' AND r.user_id IN (${Prisma.join(userIds)})
      GROUP BY r.user_id, t.topic_id`,
  ]);

  const learnedBy = new Map<string, Set<string>>();
  for (const r of learnedRows) learnedBy.set(r.userId, (learnedBy.get(r.userId) ?? new Set()).add(r.topicId));
  const solvedBy = new Map<string, Map<string, number>>();
  for (const r of solvedRows) {
    const m = solvedBy.get(r.user_id) ?? new Map<string, number>();
    m.set(r.topic_id, r.n);
    solvedBy.set(r.user_id, m);
  }

  for (const u of users) {
    const open = u.role === "admin" || !u.restrictAccess ? null : new Set(u.bookAccess.map((b) => `${b.subjectId}:${b.level}`));
    let nTopics = 0, learned = 0, tasks = 0, solved = 0;
    for (const t of topics) {
      if (open && !open.has(`${t.section.subjectId}:${t.section.level}`)) continue;
      nTopics += 1;
      if (learnedBy.get(u.id)?.has(t.id)) learned += 1;
      tasks += t.practiceCount ?? 0;
      solved += solvedBy.get(u.id)?.get(t.id) ?? 0;
    }
    const units = nTopics + tasks;
    out.set(u.id, { topics: nTopics, learned, tasks, solved, percent: units ? Math.round(((learned + solved) / units) * 100) : 0 });
  }
  return out;
}

export async function getOverallProgress(userId: string) {
  return (await getProgressForUsers([userId])).get(userId) ?? summarize([]);
}
