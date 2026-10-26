import { prisma } from "@/lib/prisma";

/** Дата, с которой ведётся журнал попыток по задачам (до неё помесячных данных по закреплению нет). */
export async function activityLogStart(): Promise<Date | null> {
  return (await prisma.taskAttempt.aggregate({ _min: { createdAt: true } }))._min.createdAt;
}

export type Pace = { recent: number; prevAvg: number; slowing: boolean };

// Условные «действия»: попытка задачи = 1, завершённый тест = 10, изученная тема = 5.
const W_TEST = 10, W_TOPIC = 5;

/**
 * Темп учеников: действия за последние 7 дней против среднего за предыдущие 3 недели.
 * «Снизил темп» — раньше занимался заметно (в среднем от 10 «действий» в неделю), а сейчас меньше половины от этого.
 */
export async function paceForAll(): Promise<Map<string, Pace>> {
  const rows = await prisma.$queryRaw<{ user_id: string; recent: boolean; n: number }[]>`
    SELECT user_id, (t >= now() - interval '7 days') AS recent, SUM(w)::int AS n FROM (
      SELECT user_id, created_at AS t, 1 AS w FROM task_attempts WHERE created_at >= now() - interval '28 days'
      UNION ALL SELECT user_id, finished_at, ${W_TEST} FROM test_attempts WHERE finished_at >= now() - interval '28 days'
      UNION ALL SELECT user_id, learned_at, ${W_TOPIC} FROM progress WHERE learned_at >= now() - interval '28 days'
    ) x GROUP BY 1, 2`;
  const by = new Map<string, { recent: number; prev: number }>();
  for (const r of rows) {
    const e = by.get(r.user_id) ?? { recent: 0, prev: 0 };
    if (r.recent) e.recent += r.n; else e.prev += r.n;
    by.set(r.user_id, e);
  }
  return new Map([...by].map(([id, e]) => {
    const prevAvg = Math.round(e.prev / 3);
    return [id, { recent: e.recent, prevAvg, slowing: prevAvg >= 10 && e.recent < prevAvg * 0.5 }];
  }));
}
