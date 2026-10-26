import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Lang } from "@/lib/i18n/config";
import { pick } from "@/lib/i18n/content";
import { bookKey, listBooks, sectionFilter } from "@/lib/student/access";
import { WEAK_THRESHOLD_PERCENT, type BreakdownRow } from "@/lib/student/tests";

/** Минимум «наблюдений» (вопросов теста + задач закрепления с попыткой), чтобы тему можно назвать слабой. */
export const MIN_SAMPLE = 3;

type Stat = { testC: number; testT: number; prA: number; prS: number };
const pct = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
const statPct = (s: Stat) => pct(s.testC + s.prS, s.testT + s.prA);
const sample = (s: Stat) => s.testT + s.prA;

/**
 * Статистика «ученик × тема»: верные/всего в тестах (TestAttempt.breakdown) и
 * решено/пробовал в закреплении (TaskResult.correct, attempts>0). Процент по теме — общий по обоим источникам.
 */
export async function collectStats(userIds?: string[], since?: Date) {
  // За период практику берём из журнала попыток (по каждой проверке ответа), за всё время — из итогов TaskResult,
  // куда попали и данные до появления журнала.
  const practiceQuery = since
    ? prisma.$queryRaw<{ user_id: string; topic_id: string; attempted: number; solved: number }[]>`
      SELECT a.user_id, a.topic_id, COUNT(*)::int AS attempted, (COUNT(*) FILTER (WHERE a.correct))::int AS solved
      FROM task_attempts a JOIN users u ON u.id = a.user_id
      WHERE a.created_at >= ${since} AND u.role = 'student'
        ${userIds ? Prisma.sql`AND a.user_id IN (${Prisma.join(userIds)})` : Prisma.empty}
      GROUP BY a.user_id, a.topic_id`
    : null;
  const [attempts, rows] = await Promise.all([
    prisma.testAttempt.findMany({
      where: { finishedAt: since ? { gte: since } : { not: null }, ...(userIds ? { userId: { in: userIds } } : { user: { role: "student" } }) },
      select: { userId: true, breakdown: true },
    }),
    practiceQuery ??
    prisma.$queryRaw<{ user_id: string; topic_id: string; attempted: number; solved: number }[]>`
      SELECT r.user_id, t.topic_id, COUNT(*)::int AS attempted, (COUNT(*) FILTER (WHERE r.correct))::int AS solved
      FROM task_results r JOIN tasks t ON t.id = r.task_id JOIN users u ON u.id = r.user_id
      WHERE r.attempts > 0 AND t.type = 'open' AND u.role = 'student'
        ${userIds ? Prisma.sql`AND r.user_id IN (${Prisma.join(userIds)})` : Prisma.empty}
      GROUP BY r.user_id, t.topic_id`,
  ]);
  const stats = new Map<string, Stat>();
  const get = (u: string, t: string) => {
    const k = `${u}|${t}`;
    let s = stats.get(k);
    if (!s) stats.set(k, (s = { testC: 0, testT: 0, prA: 0, prS: 0 }));
    return s;
  };
  for (const a of attempts)
    for (const b of (a.breakdown ?? []) as BreakdownRow[]) {
      const s = get(a.userId, b.topicId);
      s.testC += b.correct;
      s.testT += b.total;
    }
  for (const r of rows) {
    const s = get(r.user_id, r.topic_id);
    s.prA += r.attempted;
    s.prS += r.solved;
  }
  return stats;
}

async function topicMeta() {
  const topics = await prisma.topic.findMany({
    select: { id: true, title: true, section: { select: { title: true, level: true, subjectId: true, subject: { select: { slug: true } } } } },
  });
  const books = new Map((await listBooks()).map((b) => [b.key, b.title]));
  return new Map(
    topics.map((t) => {
      const key = bookKey({ subjectId: t.section.subjectId, level: t.section.level });
      return [t.id, { id: t.id, title: t.title, book: key, bookTitle: books.get(key) ?? "", subjectSlug: t.section.subject.slug }];
    }),
  );
}

export type WeakRow = {
  topicId: string; title: string; bookTitle: string; percent: number;
  testC: number; testT: number; prS: number; prA: number; students?: number; weakStudents?: number; help: number;
};

/** Слабые темы одного ученика (userId) или всех учеников сразу; можно ограничить книгой. */
export const sinceDays = (days?: number) => (days && days > 0 ? new Date(Date.now() - days * 86_400_000) : undefined);

export async function weakTopics(opts: { userId?: string; book?: string; days?: number }): Promise<WeakRow[]> {
  const since = sinceDays(opts.days);
  const [stats, meta, helps] = await Promise.all([
    collectStats(opts.userId ? [opts.userId] : undefined, since),
    topicMeta(),
    prisma.helpRequest.groupBy({ by: ["taskId"], where: { ...(opts.userId ? { userId: opts.userId } : {}), ...(since ? { createdAt: { gte: since } } : {}) }, _count: true }),
  ]);
  const taskTopic = new Map(
    (await prisma.task.findMany({ where: { id: { in: helps.map((h) => h.taskId) } }, select: { id: true, topicId: true } })).map((t) => [t.id, t.topicId]),
  );
  const helpBy = new Map<string, number>();
  for (const h of helps) {
    const t = taskTopic.get(h.taskId);
    if (t) helpBy.set(t, (helpBy.get(t) ?? 0) + h._count);
  }

  type Acc = Stat & { students: number; weakStudents: number };
  const byTopic = new Map<string, Acc>();
  for (const [k, s] of stats) {
    const topicId = k.split("|")[1];
    const m = meta.get(topicId);
    if (!m || (opts.book && m.book !== opts.book)) continue;
    const a = byTopic.get(topicId) ?? { testC: 0, testT: 0, prA: 0, prS: 0, students: 0, weakStudents: 0 };
    a.testC += s.testC; a.testT += s.testT; a.prA += s.prA; a.prS += s.prS;
    if (sample(s) > 0) a.students += 1;
    if (sample(s) >= MIN_SAMPLE && statPct(s) < WEAK_THRESHOLD_PERCENT) a.weakStudents += 1;
    byTopic.set(topicId, a);
  }
  const need = opts.userId ? MIN_SAMPLE : MIN_SAMPLE * 2;
  return [...byTopic]
    // у всех учеников: слабая в целом ИЛИ слабая как минимум у четверти тех, кто её проходил
    .filter(([, a]) => sample(a) >= need && (statPct(a) < WEAK_THRESHOLD_PERCENT || (!opts.userId && a.students >= 3 && a.weakStudents / a.students >= 0.25)))
    .map(([id, a]) => ({
      topicId: id, title: meta.get(id)!.title, bookTitle: meta.get(id)!.bookTitle, percent: statPct(a),
      testC: a.testC, testT: a.testT, prS: a.prS, prA: a.prA,
      ...(opts.userId ? {} : { students: a.students, weakStudents: a.weakStudents }),
      help: helpBy.get(id) ?? 0,
    }))
    .sort((a, b) => (b.weakStudents ?? 0) / (b.students || 1) - (a.weakStudents ?? 0) / (a.students || 1) || a.percent - b.percent)
    .slice(0, 40);
}

/** Для ученика: его слабые темы только из открытых ему книг (страница теста и главная). */
export async function studentWeakTopics(userId: string, opts: { subjectSlug?: string; lang?: Lang } = {}) {
  const [stats, meta, open] = await Promise.all([
    collectStats([userId]),
    topicMeta(),
    prisma.topic.findMany({ where: { section: await sectionFilter(userId) }, select: { id: true } }),
  ]);
  const openIds = new Set(open.map((t) => t.id));
  const top = [...stats]
    .map(([k, s]) => ({ topicId: k.split("|")[1], s }))
    .filter(({ topicId, s }) => openIds.has(topicId) && (!opts.subjectSlug || meta.get(topicId)?.subjectSlug === opts.subjectSlug) && sample(s) >= MIN_SAMPLE && statPct(s) < WEAK_THRESHOLD_PERCENT)
    .sort((a, b) => statPct(a.s) - statPct(b.s))
    .slice(0, 6);
  const titles = new Map(
    (await prisma.topic.findMany({ where: { id: { in: top.map((t) => t.topicId) } }, select: { id: true, title: true, i18n: true } })).map((t) => [t.id, t]),
  );
  return top.map(({ topicId, s }) => {
    const t = titles.get(topicId)!;
    return { topicId, title: pick(t.i18n, opts.lang ?? "ru", "title", t.title), subjectSlug: meta.get(topicId)!.subjectSlug, percent: statPct(s) };
  });
}

export type FlaggedRow = {
  taskId: string; number: string | null; question: string; topic: string; bookTitle: string; students: number; open: number; test: number; practice: number;
};

/** Задачи, которые чаще всего отмечают «Не смог решить» (все статусы). */
export async function flaggedTasks(opts: { book?: string; userId?: string; days?: number }): Promise<FlaggedRow[]> {
  const since = sinceDays(opts.days);
  const [reqs, meta] = await Promise.all([
    prisma.helpRequest.findMany({
      where: { ...(opts.userId ? { userId: opts.userId } : {}), ...(since ? { createdAt: { gte: since } } : {}) },
      select: { taskId: true, status: true, source: true, task: { select: { number: true, question: true, topicId: true } } },
    }),
    topicMeta(),
  ]);
  const by = new Map<string, FlaggedRow>();
  for (const r of reqs) {
    const m = meta.get(r.task.topicId);
    if (!m || (opts.book && m.book !== opts.book)) continue;
    const row = by.get(r.taskId) ?? {
      taskId: r.taskId, number: r.task.number, question: r.task.question.replace(/\{([^{}]*)\}/g, "$1").slice(0, 160),
      topic: m.title, bookTitle: m.bookTitle, students: 0, open: 0, test: 0, practice: 0,
    };
    row.students += 1; // заявка уникальна для пары ученик+задача
    if (r.status === "open") row.open += 1;
    if (r.source === "test") row.test += 1; else row.practice += 1;
    by.set(r.taskId, row);
  }
  return [...by.values()].sort((a, b) => b.students - a.students || b.open - a.open).slice(0, 30);
}

export type WeekRow = { week: string; tests: number; avgPercent: number | null; activeStudents: number; help: number; tasks: number; solved: number; learned: number };

const WEEKS = 12;
const weekStart = (d: Date) => {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7)); // понедельник
  return x;
};

/** Динамика по неделям: пройдено тестов, средний балл, активные ученики, новые заявки. */
export async function weeklyDynamics(opts: { book?: string; userId?: string }): Promise<WeekRow[]> {
  const since = weekStart(new Date(Date.now() - (WEEKS - 1) * 7 * 86_400_000));
  const userWhere = opts.userId ? { userId: opts.userId } : { user: { role: "student" as const } };
  const [attempts, sessions, helps, meta, sections, taskLog, learnedRows] = await Promise.all([
    prisma.testAttempt.findMany({
      where: { ...userWhere, startedAt: { gte: since } },
      select: { userId: true, scope: true, sectionId: true, topicId: true, startedAt: true, finishedAt: true, score: true, total: true },
    }),
    prisma.session.findMany({ where: { ...userWhere, createdAt: { gte: since } }, select: { userId: true, createdAt: true } }),
    prisma.helpRequest.findMany({ where: { ...userWhere, createdAt: { gte: since } }, select: { createdAt: true, task: { select: { topicId: true } } } }),
    topicMeta(),
    prisma.section.findMany({ select: { id: true, level: true, subjectId: true } }),
    prisma.taskAttempt.findMany({ where: { ...userWhere, createdAt: { gte: since } }, select: { userId: true, topicId: true, correct: true, createdAt: true } }),
    prisma.progress.findMany({ where: { ...userWhere, learnedAt: { gte: since } }, select: { userId: true, topicId: true, learnedAt: true } }),
  ]);
  const sectionBook = new Map(sections.map((s) => [s.id, bookKey(s)]));
  const inBook = (a: (typeof attempts)[number]) =>
    !opts.book || (a.scope === "section" ? sectionBook.get(a.sectionId ?? "") === opts.book : a.scope === "topic" && meta.get(a.topicId ?? "")?.book === opts.book);

  const weeks = Array.from({ length: WEEKS }, (_, i) => {
    const d = new Date(since); d.setUTCDate(d.getUTCDate() + i * 7);
    return { key: d.toISOString().slice(0, 10), tests: 0, score: 0, total: 0, active: new Set<string>(), help: 0, tasks: 0, solved: 0, learned: 0 };
  });
  const slot = (d: Date) => weeks[Math.floor((weekStart(d).getTime() - since.getTime()) / (7 * 86_400_000))];
  for (const a of attempts) {
    if (!inBook(a)) continue;
    slot(a.startedAt)?.active.add(a.userId);
    if (a.finishedAt) {
      const w = slot(a.finishedAt);
      if (w) { w.tests += 1; w.score += a.score ?? 0; w.total += a.total; }
    }
  }
  for (const a of taskLog) {
    if (opts.book && meta.get(a.topicId)?.book !== opts.book) continue;
    const w = slot(a.createdAt);
    if (!w) continue;
    w.tasks += 1; if (a.correct) w.solved += 1; w.active.add(a.userId);
  }
  for (const l of learnedRows) {
    if (opts.book && meta.get(l.topicId)?.book !== opts.book) continue;
    const w = l.learnedAt ? slot(l.learnedAt) : undefined;
    if (w) { w.learned += 1; w.active.add(l.userId); }
  }
  if (!opts.book) for (const s of sessions) slot(s.createdAt)?.active.add(s.userId);
  for (const h of helps) if (!opts.book || meta.get(h.task.topicId)?.book === opts.book) { const w = slot(h.createdAt); if (w) w.help += 1; }
  return weeks.map((w) => ({ week: w.key, tests: w.tests, avgPercent: w.total ? pct(w.score, w.total) : null, activeStudents: w.active.size, help: w.help, tasks: w.tasks, solved: w.solved, learned: w.learned }));
}
