import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { getLastActive } from "@/lib/admin-students";
import { describeKey, getSummary } from "@/lib/gamification/engine";
import { paceForAll } from "@/lib/admin-activity";
import { bookKey, getAccess, sectionWhereFor } from "@/lib/student/access";
import { getProgressForUsers } from "@/lib/student/progress";
import type { BreakdownRow } from "@/lib/student/tests";

const plain = (q: string) => q.replace(/\{([^{}]*)\}/g, "$1").slice(0, 200);

// Всё для карточки ученика одним запросом: прогресс по темам, тесты, ошибки, заявки «Не смог решить».
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id } = await params;
  const user = await prisma.user.findFirst({
    where: { id, role: "student" },
    select: {
      id: true, login: true, createdAt: true, restrictAccess: true,
      bookAccess: { select: { subjectId: true, level: true } },
      sessions: { where: { revoked: false, expiresAt: { gt: new Date() } }, select: { id: true }, take: 1 },
    },
  });
  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });

  const access = await getAccess(id);
  const openSections = new Set(
    (await prisma.section.findMany({ where: sectionWhereFor(access), select: { id: true } })).map((s) => s.id),
  );

  const [sections, progressRows, solvedRows, attempts, practiceMistakes, helps, overall, active, logins] = await Promise.all([
    prisma.section.findMany({
      orderBy: [{ subject: { order: "asc" } }, { order: "asc" }],
      select: {
        id: true, title: true, level: true,
        topics: { orderBy: { order: "asc" }, select: { id: true, title: true, practiceCount: true } },
      },
    }),
    prisma.progress.findMany({ where: { userId: id }, select: { topicId: true, learnedAt: true, lastAttemptAt: true } }),
    prisma.$queryRaw<{ topic_id: string; n: number }[]>`
      SELECT t.topic_id, COUNT(*)::int AS n FROM task_results r JOIN tasks t ON t.id = r.task_id
      WHERE r.user_id = ${id} AND r.correct AND t.type = 'open' GROUP BY t.topic_id`,
    prisma.testAttempt.findMany({
      where: { userId: id, finishedAt: { not: null } },
      orderBy: { finishedAt: "desc" },
      take: 30,
      select: { id: true, scope: true, sectionId: true, topicId: true, questionIds: true, answers: true, score: true, total: true, finishedAt: true, breakdown: true },
    }),
    prisma.taskResult.findMany({
      where: { userId: id, correct: false, attempts: { gt: 0 }, task: { type: "open" } },
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: { attempts: true, updatedAt: true, task: { select: { id: true, number: true, question: true, topic: { select: { title: true } } } } },
    }),
    prisma.helpRequest.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, note: true, status: true, autoResolved: true, createdAt: true, task: { select: { number: true, question: true, topic: { select: { title: true } } } } },
    }),
    getProgressForUsers([id]),
    getLastActive([id]),
    prisma.loginEvent.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 40, select: { id: true, ip: true, device: true, kicked: true, createdAt: true } }),
  ]);

  const byTopic = new Map(progressRows.map((p) => [p.topicId, p]));
  const solved = new Map(solvedRows.map((r) => [r.topic_id, r.n]));
  const sectionTitle = new Map(sections.map((s) => [s.id, s.title]));

  // Ошибки в тестах: неверные ответы в последних 10 завершённых попытках
  const recent = attempts.slice(0, 10);
  const recentIds = [...new Set(recent.flatMap((a) => a.questionIds as string[]))];
  const taskRows = await prisma.task.findMany({
    where: { id: { in: recentIds } },
    select: { id: true, question: true, correctOption: true, topic: { select: { title: true } } },
  });
  const taskById = new Map(taskRows.map((t) => [t.id, t]));
  const testMistakes = recent.flatMap((a) =>
    (a.questionIds as string[]).flatMap((tid) => {
      const t = taskById.get(tid);
      const mine = (a.answers as Record<string, string>)[tid];
      if (!t || (mine && mine === t.correctOption)) return [];
      return [{ taskId: tid, topic: t.topic.title, question: plain(t.question), mine: mine ?? null, correct: t.correctOption, date: a.finishedAt }];
    }),
  ).slice(0, 60);

  return NextResponse.json({
    user: {
      id: user.id, login: user.login, createdAt: user.createdAt,
      online: user.sessions.length > 0,
      lastActiveAt: active.get(id) ?? null,
      restricted: user.restrictAccess,
      books: user.bookAccess.map(bookKey),
    },
    summary: overall.get(id),
    gamification: await (async () => {
      const g = await getSummary(id);
      const items = (await Promise.all(g.achievements.filter((a) => !a.key.startsWith("lvl:")).map(async (a) => {
        const d = await describeKey(a.key);
        return d ? { key: a.key, icon: d.icon, title: d.title.ru, desc: d.desc.ru, earnedAt: a.earnedAt } : null;
      }))).filter((x) => x !== null);
      return { xp: g.xp, level: g.level, streak: g.streak, atRisk: g.atRisk, todayPoints: g.todayPoints, goal: g.goal, items };
    })(),
    pace: (await paceForAll()).get(id) ?? { recent: 0, prevAvg: 0, slowing: false },
    logins: logins.map((l) => ({ id: l.id, ip: l.ip, device: l.device, kicked: l.kicked > 0, createdAt: l.createdAt })),
    sharedSignals: (() => {
      const week = logins.filter((l) => l.createdAt.getTime() > Date.now() - 7 * 86_400_000);
      return { devices: new Set(week.map((l) => l.device)).size, kicks: week.filter((l) => l.kicked > 0).length, ips: new Set(week.map((l) => l.ip)).size };
    })(),
    sections: sections.map((s) => ({
      id: s.id, title: s.title, level: s.level, closed: !openSections.has(s.id),
      topics: s.topics.map((t) => ({
        id: t.id, title: t.title,
        learned: !!byTopic.get(t.id)?.learnedAt,
        practiceSolved: solved.get(t.id) ?? 0,
        practiceTotal: t.practiceCount ?? 0,
        lastAttemptAt: byTopic.get(t.id)?.lastAttemptAt ?? null,
      })),
    })),
    attempts: attempts.map((a) => ({
      id: a.id, scope: a.scope, score: a.score ?? 0, total: a.total, finishedAt: a.finishedAt,
      percent: a.total ? Math.round(((a.score ?? 0) / a.total) * 100) : 0,
      title: a.scope === "section" ? sectionTitle.get(a.sectionId ?? "") ?? null : null,
      weak: ((a.breakdown ?? []) as BreakdownRow[]).filter((b) => b.total && (b.correct / b.total) * 100 < 60).map((b) => b.title),
    })),
    practiceMistakes: practiceMistakes.map((r) => ({ taskId: r.task.id, number: r.task.number, topic: r.task.topic.title, question: plain(r.task.question), attempts: r.attempts, date: r.updatedAt })),
    testMistakes,
    help: helps.map((h) => ({ id: h.id, note: h.note, status: h.status, autoResolved: h.autoResolved, createdAt: h.createdAt, number: h.task.number, topic: h.task.topic.title, question: plain(h.task.question) })),
  });
}
