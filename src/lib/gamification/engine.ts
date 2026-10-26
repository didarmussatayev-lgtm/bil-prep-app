import "server-only";
import { prisma } from "@/lib/prisma";
import { sectionFilter } from "@/lib/student/access";
import { queueAchievementNotification } from "@/lib/telegram";
import {
  ACHIEVEMENTS, BOOK_DONE, DAILY_GOAL, LEVEL_UP, NOTIFY_LEVELS, POINTS, TZ, XP, levelFromXp, type AchDef,
} from "./config";

/* ───────── дни и серия ───────── */

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
export const dayKey = (d: Date) => dayFmt.format(d); // YYYY-MM-DD по времени Алматы
const shift = (key: string, days: number) => dayKey(new Date(new Date(key + "T12:00:00Z").getTime() + days * 86_400_000));
const diffDays = (a: string, b: string) => Math.round((new Date(a + "T12:00:00Z").getTime() - new Date(b + "T12:00:00Z").getTime()) / 86_400_000);

/** Очки по дням: задача 1, тема 5, тест 5 (по времени Алматы). */
export async function loadDays(userId: string): Promise<Map<string, number>> {
  const rows = await prisma.$queryRaw<{ d: string; pts: number }[]>`
    SELECT d::text AS d, SUM(w)::int AS pts FROM (
      SELECT (created_at AT TIME ZONE ${TZ})::date AS d, ${POINTS.task} AS w FROM task_attempts WHERE user_id = ${userId}
      UNION ALL SELECT (finished_at AT TIME ZONE ${TZ})::date, ${POINTS.test} FROM test_attempts WHERE user_id = ${userId} AND finished_at IS NOT NULL
      UNION ALL SELECT (learned_at AT TIME ZONE ${TZ})::date, ${POINTS.topic} FROM progress WHERE user_id = ${userId} AND learned_at IS NOT NULL
    ) x GROUP BY d`;
  return new Map(rows.map((r) => [r.d, r.pts]));
}

/**
 * Серия: подряд идущие дни, в которых набрана дневная цель. Сегодняшний день ещё не закончился — его отсутствие серию не рвёт.
 * «Щит»: один пропущенный день прощается, но не чаще раза в 7 дней (если до и после него были занятия).
 */
export function computeStreak(days: Map<string, number>, today = dayKey(new Date())) {
  const ok = (k: string) => (days.get(k) ?? 0) >= DAILY_GOAL;
  let cursor = ok(today) ? today : shift(today, -1);
  let streak = 0;
  let sinceForgive = 99;
  for (let guard = 0; guard < 400; guard++) {
    if (ok(cursor)) { streak += 1; sinceForgive += 1; cursor = shift(cursor, -1); continue; }
    if (streak > 0 && sinceForgive >= 7 && ok(shift(cursor, -1))) { sinceForgive = 0; cursor = shift(cursor, -1); continue; }
    break;
  }
  return { streak, todayPoints: days.get(today) ?? 0, atRisk: streak > 0 && !ok(today) };
}

/* ───────── XP и уровень ───────── */

export async function totalXp(userId: string) {
  return (await prisma.xpEvent.aggregate({ where: { userId }, _sum: { xp: true } }))._sum.xp ?? 0;
}

/** Начисляет XP один раз на (kind, ref). Возвращает, сколько реально начислено (0 — уже было). */
async function award(userId: string, kind: string, ref: string, xp: number): Promise<number> {
  if (xp <= 0) return 0;
  const r = await prisma.xpEvent.createMany({ data: [{ userId, kind, ref, xp }], skipDuplicates: true });
  return r.count ? xp : 0;
}

/* ───────── достижения ───────── */

export type Earned = { key: string; icon: string; title: { ru: string; kk: string }; desc: { ru: string; kk: string } };

async function bookTitles() {
  const { listBooks } = await import("@/lib/student/access");
  return new Map((await listBooks()).map((b) => [b.key, b.title]));
}

/** Описание достижения по ключу (включая динамические «книга пройдена» и «уровень N»). */
export async function describeKey(key: string): Promise<Earned | null> {
  const def = ACHIEVEMENTS.find((a) => a.key === key);
  if (def) return { key, icon: def.icon, title: { ru: def.ru, kk: def.kk }, desc: { ru: def.descRu, kk: def.descKk } };
  if (key.startsWith(LEVEL_UP)) {
    const n = Number(key.slice(LEVEL_UP.length));
    return { key, icon: "⭐", title: { ru: `Уровень ${n}`, kk: `${n}-деңгей` }, desc: { ru: "Новый уровень!", kk: "Жаңа деңгей!" } };
  }
  if (key.startsWith(BOOK_DONE)) {
    const name = (await bookTitles()).get(key.slice(BOOK_DONE.length)) ?? "";
    return { key, icon: "🎓", title: { ru: `Книга пройдена: ${name}`, kk: `Кітап өтілді: ${name}` }, desc: { ru: "Изучены все темы книги", kk: "Кітаптың барлық тақырыбы оқылды" } };
  }
  return null;
}

async function bookStats(userId: string) {
  const [topics, learned] = await Promise.all([
    prisma.topic.findMany({ where: { hidden: false }, select: { id: true, section: { select: { subjectId: true, level: true } } } }),
    prisma.progress.findMany({ where: { userId, learnedAt: { not: null } }, select: { topicId: true } }),
  ]);
  const done = new Set(learned.map((l) => l.topicId));
  const per = new Map<string, { total: number; done: number }>();
  for (const t of topics) {
    const k = `${t.section.subjectId}:${t.section.level}`;
    const e = per.get(k) ?? { total: 0, done: 0 };
    e.total += 1; if (done.has(t.id)) e.done += 1;
    per.set(k, e);
  }
  return per;
}

/**
 * Проверяет все условия и выдаёт недостающие достижения (+XP, +повышение уровня). Идемпотентна.
 * Вызывать после событий: первое верное решение, тема изучена, тест завершён, дневная цель набрана.
 */
export async function evaluate(userId: string, opts: { silent?: boolean } = {}): Promise<{ newKeys: string[]; level: number; leveledUp: boolean }> {
  const [days, learnedN, solvedN, tests, fixedN, books, have, user] = await Promise.all([
    loadDays(userId),
    prisma.progress.count({ where: { userId, learnedAt: { not: null } } }),
    prisma.taskResult.count({ where: { userId, correct: true } }),
    prisma.$queryRaw<{ n: number; best: number }[]>`
      SELECT COUNT(*)::int AS n, COALESCE(MAX(score * 100 / NULLIF(total, 0)), 0)::int AS best
      FROM test_attempts WHERE user_id = ${userId} AND finished_at IS NOT NULL`,
    prisma.helpRequest.count({ where: { userId, autoResolved: true } }),
    bookStats(userId),
    prisma.userAchievement.findMany({ where: { userId }, select: { key: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { login: true, role: true } }),
  ]);
  if (!user || user.role !== "student") return { newKeys: [], level: 1, leveledUp: false };

  const { streak } = computeStreak(days);
  const active = [...days].filter(([, p]) => p > 0).map(([d]) => d).sort();
  const last = active[active.length - 1], prev = active[active.length - 2];
  const today = dayKey(new Date());
  const comeback = !!(last && prev && diffDays(last, prev) >= 8 && diffDays(today, last) <= 1);
  const t = tests[0] ?? { n: 0, best: 0 };

  const earnedNow = new Set<string>();
  const add = (cond: boolean, key: string) => { if (cond) earnedNow.add(key); };
  add(learnedN >= 1, "first_topic"); add(learnedN >= 10, "topics_10"); add(learnedN >= 50, "topics_50");
  add(solvedN >= 10, "tasks_10"); add(solvedN >= 100, "tasks_100"); add(solvedN >= 500, "tasks_500");
  add(streak >= 3, "streak_3"); add(streak >= 7, "streak_7"); add(streak >= 30, "streak_30");
  add(t.n >= 1, "test_first"); add(t.best >= 80, "test_80"); add(t.best >= 90, "test_90"); add(t.best >= 100, "test_perfect");
  add(fixedN >= 1, "fix_mistake"); add(comeback, "comeback");
  for (const [k, b] of books) add(b.total >= 3 && b.done >= b.total, BOOK_DONE + k);

  const haveKeys = new Set(have.map((h) => h.key));
  const fresh = [...earnedNow].filter((k) => !haveKeys.has(k));
  const newKeys: string[] = [];
  if (fresh.length) {
    const r = await prisma.userAchievement.createMany({ data: fresh.map((key) => ({ userId, key })), skipDuplicates: true });
    if (r.count) {
      newKeys.push(...fresh);
      for (const k of fresh) await award(userId, "achievement", k, XP.achievement);
    }
  }

  // повышение уровня (ключи lvl:N, чтобы показать поздравление)
  const xp = await totalXp(userId);
  const { level } = levelFromXp(xp);
  const lvlKeys = [...haveKeys].filter((k) => k.startsWith(LEVEL_UP)).map((k) => Number(k.slice(LEVEL_UP.length)));
  const prevLevel = Math.max(1, ...lvlKeys);
  const levelKeys: string[] = [];
  for (let n = prevLevel + 1; n <= level; n++) levelKeys.push(LEVEL_UP + n);
  if (levelKeys.length) {
    await prisma.userAchievement.createMany({ data: levelKeys.map((key) => ({ userId, key })), skipDuplicates: true });
    newKeys.push(...levelKeys);
  }

  // учителю — о заметных событиях (пачкой, чтобы не слать по одному)
  const notify: string[] = [];
  for (const k of newKeys) {
    const def: AchDef | undefined = ACHIEVEMENTS.find((a) => a.key === k);
    if (def?.notify) notify.push(`${def.icon} ${def.ru}`);
    else if (k.startsWith(BOOK_DONE)) notify.push(`🎓 ${(await describeKey(k))?.title.ru}`);
    else if (k.startsWith(LEVEL_UP) && NOTIFY_LEVELS(Number(k.slice(LEVEL_UP.length)))) notify.push(`⭐ ${(await describeKey(k))?.title.ru}`);
  }
  if (notify.length && !opts.silent) queueAchievementNotification(userId, user.login, notify);

  // награда за достижение могла поднять уровень — повторим один раз
  if (newKeys.some((k) => !k.startsWith(LEVEL_UP)) && levelFromXp(await totalXp(userId)).level > level) {
    const again = await evaluate(userId, opts);
    newKeys.push(...again.newKeys);
    return { newKeys, level: again.level, leveledUp: true };
  }
  return { newKeys, level, leveledUp: levelKeys.length > 0 };
}

/* ───────── события ───────── */

export async function onTaskChecked(userId: string, taskId: string, opts: { correct: boolean; firstCorrect: boolean; fixedFlag: boolean }) {
  let gained = 0;
  if (opts.firstCorrect) gained += await award(userId, "task", taskId, XP.task);
  if (opts.fixedFlag) gained += await award(userId, "fix", taskId, XP.fix);
  // вызываем проверку достижений, когда что-то могло измениться: новый балл, либо ровно в момент набора дневной цели
  const days = opts.firstCorrect || opts.fixedFlag ? null : await loadDays(userId);
  const hitGoal = days ? (days.get(dayKey(new Date())) ?? 0) === DAILY_GOAL : false;
  const res = opts.firstCorrect || opts.fixedFlag || hitGoal ? await evaluate(userId) : null;
  return { gained, newKeys: res?.newKeys ?? [] };
}

export async function onTopicLearned(userId: string, topicId: string) {
  const gained = await award(userId, "topic", topicId, XP.topic);
  const res = await evaluate(userId);
  return { gained, newKeys: res.newKeys };
}

export async function onTestFinished(userId: string, attemptId: string, score: number, total: number) {
  const pct = total ? (score * 100) / total : 0;
  const xp = score * XP.testPerCorrect + (pct >= 90 ? XP.test90 : pct >= 80 ? XP.test80 : 0);
  const gained = await award(userId, "test", attemptId, xp);
  const res = await evaluate(userId);
  return { gained, newKeys: res.newKeys };
}

/* ───────── сводка для интерфейса ───────── */

export async function getSummary(userId: string) {
  const [xp, days, earned, exams, topics, learned] = await Promise.all([
    totalXp(userId),
    loadDays(userId),
    prisma.userAchievement.findMany({ where: { userId }, orderBy: { earnedAt: "desc" }, select: { key: true, earnedAt: true, seenAt: true } }),
    prisma.examTarget.findMany({ orderBy: { date: "asc" } }),
    (async () => prisma.topic.count({ where: { hidden: false, section: await sectionFilter(userId) } }))(),
    prisma.progress.count({ where: { userId, learnedAt: { not: null } } }),
  ]);
  const lv = levelFromXp(xp);
  const { streak, todayPoints, atRisk } = computeStreak(days);
  const today = dayKey(new Date());
  const left = Math.max(0, topics - learned);
  return {
    xp, level: lv.level, levelFrom: lv.from, levelTo: lv.to, levelInto: lv.into, levelNeed: lv.need,
    streak, atRisk, todayPoints, goal: DAILY_GOAL,
    achievements: earned.map((e) => ({ key: e.key, earnedAt: e.earnedAt, seen: !!e.seenAt })),
    exams: exams
      .map((e) => ({ id: e.id, key: e.key, title: e.title, date: dayKey(e.date), daysLeft: diffDays(dayKey(e.date), today) }))
      .filter((e) => e.daysLeft >= 0)
      .map((e) => ({ ...e, topicsLeft: left, topicsPerWeek: e.daysLeft > 0 ? Math.ceil((left / e.daysLeft) * 7 * 10) / 10 : left })),
  };
}

export type Summary = Awaited<ReturnType<typeof getSummary>>;

/**
 * Разовое начисление за уже сделанное (до появления геймификации): XP за решённые задачи, изученные темы и тесты,
 * затем достижения. Повторный запуск безопасен (XpEvent уникален). Поздравления для таких достижений помечаются просмотренными,
 * учителю в Telegram ничего не уходит.
 */
export async function backfill(userId: string) {
  const [solved, learned, tests, fixed] = await Promise.all([
    prisma.taskResult.findMany({ where: { userId, correct: true }, select: { taskId: true } }),
    prisma.progress.findMany({ where: { userId, learnedAt: { not: null } }, select: { topicId: true } }),
    prisma.testAttempt.findMany({ where: { userId, finishedAt: { not: null } }, select: { id: true, score: true, total: true } }),
    prisma.helpRequest.findMany({ where: { userId, autoResolved: true }, select: { taskId: true } }),
  ]);
  const rows = [
    ...solved.map((s) => ({ userId, kind: "task", ref: s.taskId, xp: XP.task })),
    ...learned.map((l) => ({ userId, kind: "topic", ref: l.topicId, xp: XP.topic })),
    ...fixed.map((f) => ({ userId, kind: "fix", ref: f.taskId, xp: XP.fix })),
    ...tests.map((t) => {
      const pct = t.total ? ((t.score ?? 0) * 100) / t.total : 0;
      return { userId, kind: "test", ref: t.id, xp: (t.score ?? 0) * XP.testPerCorrect + (pct >= 90 ? XP.test90 : pct >= 80 ? XP.test80 : 0) };
    }),
  ].filter((r) => r.xp > 0);
  const created = await prisma.xpEvent.createMany({ data: rows, skipDuplicates: true });
  const res = await evaluate(userId, { silent: true });
  await prisma.userAchievement.updateMany({ where: { userId, seenAt: null }, data: { seenAt: new Date() } });
  return { xpRows: created.count, achievements: res.newKeys.length };
}
