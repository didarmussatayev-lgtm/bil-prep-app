import { prisma } from "@/lib/prisma";
import { getProgressForUsers } from "@/lib/student/progress";

/** Сводка для верха страницы «Отчёты». Слабые темы и сложные задачи — в lib/admin-reports.ts. */
export async function getStats() {
  const week = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const [students, activeSessions, progressActive, testActive, testAgg] = await Promise.all([
    prisma.user.findMany({ where: { role: "student" }, select: { id: true } }),
    prisma.session.count({ where: { revoked: false, expiresAt: { gt: new Date() } } }),
    prisma.progress.findMany({ where: { lastAttemptAt: { gte: week } }, select: { userId: true }, distinct: ["userId"] }),
    prisma.testAttempt.findMany({ where: { finishedAt: { gte: week } }, select: { userId: true }, distinct: ["userId"] }),
    prisma.testAttempt.aggregate({ where: { finishedAt: { not: null } }, _count: true, _sum: { score: true, total: true } }),
  ]);
  const progress = await getProgressForUsers(students.map((s) => s.id));
  const pcts = students.map((s) => progress.get(s.id)?.percent ?? 0);
  const activeIds = new Set([...progressActive, ...testActive].map((r) => r.userId));

  return {
    students: students.length,
    activeSessions,
    activeLast7Days: activeIds.size,
    avgCourseProgressPct: pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0,
    testAttempts: testAgg._count,
    avgTestScore:
      testAgg._sum.total && testAgg._sum.total > 0 ? Math.round(((testAgg._sum.score ?? 0) / testAgg._sum.total) * 100) : null,
  };
}
