import { prisma } from "@/lib/prisma";
import { hasPendingFigure, parseFigures } from "@/lib/content/types";

// Реальная модель (шаг 5) не хранит Progress.status/score — считаем то же самое,
// что видит ученик на своей странице (lib/student/progress.ts), но по всем студентам сразу.
export async function getStats() {
  const week = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const [students, topics, allTasks, progressRows, resultRows, activeSessions, progressActive, testActive, testAgg] =
    await Promise.all([
      prisma.user.count({ where: { role: "student" } }),
      prisma.topic.count(),
      prisma.task.findMany({ where: { type: "open" }, select: { id: true, topicId: true, imageParamsJson: true } }),
      prisma.progress.findMany({ where: { learnedAt: { not: null } }, select: { userId: true, topicId: true } }),
      prisma.taskResult.findMany({ where: { correct: true }, select: { userId: true, taskId: true } }),
      prisma.session.count({ where: { revoked: false, expiresAt: { gt: new Date() } } }),
      prisma.progress.findMany({ where: { lastAttemptAt: { gte: week } }, select: { userId: true }, distinct: ["userId"] }),
      prisma.testAttempt.findMany({ where: { finishedAt: { gte: week } }, select: { userId: true }, distinct: ["userId"] }),
      prisma.testAttempt.aggregate({ where: { finishedAt: { not: null } }, _count: true, _sum: { score: true, total: true } }),
    ]);

  // Задачи с ещё не готовым рисунком не в счёт — они скрыты и от учеников.
  const visibleTasks = allTasks.filter((t) => !hasPendingFigure(parseFigures(t.imageParamsJson)));
  const tasksByTopic = new Map<string, number>();
  for (const t of visibleTasks) tasksByTopic.set(t.topicId, (tasksByTopic.get(t.topicId) ?? 0) + 1);
  const taskTopic = new Map(visibleTasks.map((t) => [t.id, t.topicId]));

  const possibleUnits = students * (topics + [...tasksByTopic.values()].reduce((a, b) => a + b, 0));
  const learnedUnits = progressRows.length;
  const solvedUnits = resultRows.filter((r) => taskTopic.has(r.taskId)).length;

  const activeIds = new Set([...progressActive, ...testActive].map((r) => r.userId));

  // Самые сложные темы — по доле верно решённых задач закрепления (а не Progress.score, которого нет).
  const solvedByTopic = new Map<string, Set<string>>(); // topicId -> distinct userIds решили верно ≥1 задачу
  for (const r of resultRows) {
    const topicId = taskTopic.get(r.taskId);
    if (!topicId) continue;
    if (!solvedByTopic.has(topicId)) solvedByTopic.set(topicId, new Set());
    solvedByTopic.get(topicId)!.add(r.userId);
  }
  const topicRows = await prisma.topic.findMany({ select: { id: true, title: true } });
  const title = new Map(topicRows.map((t) => [t.id, t.title]));
  const hardestTopics = [...tasksByTopic.entries()]
    .map(([topicId, total]) => {
      // Средний % верных = (решённых задач суммарно по всем ученикам) / (макс. возможных = всего задач × учеников с попытками)
      const solvers = solvedByTopic.get(topicId)?.size ?? 0;
      const avgScore = students ? Math.round((solvers / students) * 100) : 0;
      return { topicId, title: title.get(topicId) ?? "—", avgScore, students: solvers, total };
    })
    .filter((t) => t.total > 0)
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 10);

  const avgTestScore =
    testAgg._sum.total && testAgg._sum.total > 0 ? Math.round(((testAgg._sum.score ?? 0) / testAgg._sum.total) * 100) : null;

  return {
    students,
    activeSessions,
    activeLast7Days: activeIds.size,
    avgCourseProgressPct: possibleUnits ? Math.round(((learnedUnits + solvedUnits) / possibleUnits) * 100) : 0,
    testAttempts: testAgg._count,
    avgTestScore,
    hardestTopics,
  };
}
