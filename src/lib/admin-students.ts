import { prisma } from "@/lib/prisma";
import { bookKey } from "@/lib/student/access";
import { getProgressForUsers } from "@/lib/student/progress";

export const INACTIVE_DAYS = 3;

/** Последняя активность учеников: вход, попытка по теме/задаче или начатый тест. */
export async function getLastActive(userIds: string[]): Promise<Map<string, Date>> {
  const where = { userId: { in: userIds } };
  const [s, p, t] = await Promise.all([
    prisma.session.groupBy({ by: ["userId"], where, _max: { createdAt: true } }),
    prisma.progress.groupBy({ by: ["userId"], where, _max: { lastAttemptAt: true } }),
    prisma.testAttempt.groupBy({ by: ["userId"], where, _max: { startedAt: true } }),
  ]);
  const out = new Map<string, Date>();
  const put = (id: string, d: Date | null | undefined) => {
    if (d && (!out.get(id) || d > out.get(id)!)) out.set(id, d);
  };
  s.forEach((r) => put(r.userId, r._max.createdAt));
  p.forEach((r) => put(r.userId, r._max.lastAttemptAt));
  t.forEach((r) => put(r.userId, r._max.startedAt));
  return out;
}

export type StudentRow = {
  id: string;
  login: string;
  createdAt: Date;
  online: boolean;
  lastActiveAt: Date | null;
  progressPct: number;
  restricted: boolean;
  books: string[];
  openHelp: number;
};

/** Все ученики с прогрессом и активностью — фиксированное число запросов, не зависит от их количества. */
export async function loadStudents(): Promise<StudentRow[]> {
  const [users, helps] = await Promise.all([
    prisma.user.findMany({
      where: { role: "student" },
      select: {
        id: true, login: true, createdAt: true, restrictAccess: true,
        bookAccess: { select: { subjectId: true, level: true } },
        sessions: { where: { revoked: false, expiresAt: { gt: new Date() } }, select: { id: true }, take: 1 },
      },
    }),
    prisma.helpRequest.groupBy({ by: ["userId"], where: { status: "open" }, _count: true }),
  ]);
  const ids = users.map((u) => u.id);
  const [progress, active] = await Promise.all([getProgressForUsers(ids), getLastActive(ids)]);
  const helpBy = new Map(helps.map((h) => [h.userId, h._count]));
  return users.map((u) => ({
    id: u.id,
    login: u.login,
    createdAt: u.createdAt,
    online: u.sessions.length > 0,
    lastActiveAt: active.get(u.id) ?? null,
    progressPct: progress.get(u.id)?.percent ?? 0,
    restricted: u.restrictAccess,
    books: u.bookAccess.map(bookKey),
    openHelp: helpBy.get(u.id) ?? 0,
  }));
}

export const isInactive = (s: StudentRow, now = Date.now()) =>
  now - (s.lastActiveAt ?? s.createdAt).getTime() >= INACTIVE_DAYS * 86_400_000;
