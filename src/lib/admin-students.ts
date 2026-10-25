import { prisma } from "@/lib/prisma";
import { SHARED_DEVICES_THRESHOLD, SHARED_KICKS_THRESHOLD } from "@/lib/auth/config";
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
  devices7: number; // разных устройств за 7 дней
  kicks7: number; // входов за 7 дней, оборвавших чужую сессию
  shared: boolean; // подозрение на общий аккаунт
};

/** Все ученики с прогрессом и активностью — фиксированное число запросов, не зависит от их количества. */
export async function loadStudents(): Promise<StudentRow[]> {
  const [users, helps, logins] = await Promise.all([
    prisma.user.findMany({
      where: { role: "student" },
      select: {
        id: true, login: true, createdAt: true, restrictAccess: true,
        bookAccess: { select: { subjectId: true, level: true } },
        sessions: { where: { revoked: false, expiresAt: { gt: new Date() } }, select: { id: true }, take: 1 },
      },
    }),
    prisma.helpRequest.groupBy({ by: ["userId"], where: { status: "open" }, _count: true }),
    prisma.loginEvent.findMany({ where: { createdAt: { gte: new Date(Date.now() - 7 * 86_400_000) } }, select: { userId: true, device: true, kicked: true } }),
  ]);
  const devicesBy = new Map<string, Set<string>>();
  const kicksBy = new Map<string, number>();
  for (const l of logins) {
    devicesBy.set(l.userId, (devicesBy.get(l.userId) ?? new Set()).add(l.device));
    if (l.kicked > 0) kicksBy.set(l.userId, (kicksBy.get(l.userId) ?? 0) + 1);
  }
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
    devices7: devicesBy.get(u.id)?.size ?? 0,
    kicks7: kicksBy.get(u.id) ?? 0,
    shared: (devicesBy.get(u.id)?.size ?? 0) >= SHARED_DEVICES_THRESHOLD || (kicksBy.get(u.id) ?? 0) >= SHARED_KICKS_THRESHOLD,
  }));
}

export const isInactive = (s: StudentRow, now = Date.now()) =>
  now - (s.lastActiveAt ?? s.createdAt).getTime() >= INACTIVE_DAYS * 86_400_000;
