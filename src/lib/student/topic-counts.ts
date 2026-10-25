import { prisma } from "@/lib/prisma";
import { hasPendingFigure, parseFigures } from "@/lib/content/types";

/**
 * Пересчитывает Topic.practiceCount / testCount. Задачи с ещё не готовым рисунком
 * (kind="placeholder") не считаются — они скрыты от учеников.
 * Без topicIds — все темы. Вызывать после любой правки задач (seed, админка контента).
 */
export async function recalcTopicCounts(topicIds?: string[]) {
  const tasks = await prisma.task.findMany({
    where: topicIds ? { topicId: { in: topicIds } } : {},
    select: { topicId: true, type: true, imageParamsJson: true },
  });
  const counts = new Map<string, { p: number; t: number }>();
  for (const t of tasks) {
    if (hasPendingFigure(parseFigures(t.imageParamsJson))) continue;
    const c = counts.get(t.topicId) ?? { p: 0, t: 0 };
    if (t.type === "open") c.p += 1;
    else c.t += 1;
    counts.set(t.topicId, c);
  }
  const topics = await prisma.topic.findMany({
    where: topicIds ? { id: { in: topicIds } } : {},
    select: { id: true, practiceCount: true, testCount: true },
  });
  const changed = topics.filter((t) => {
    const c = counts.get(t.id) ?? { p: 0, t: 0 };
    return t.practiceCount !== c.p || t.testCount !== c.t;
  });
  // по темам с одинаковыми значениями — один updateMany
  const groups = new Map<string, string[]>();
  for (const t of changed) {
    const c = counts.get(t.id) ?? { p: 0, t: 0 };
    const k = `${c.p}:${c.t}`;
    groups.set(k, [...(groups.get(k) ?? []), t.id]);
  }
  await prisma.$transaction(
    [...groups].map(([k, ids]) => {
      const [p, t] = k.split(":").map(Number);
      return prisma.topic.updateMany({ where: { id: { in: ids } }, data: { practiceCount: p, testCount: t } });
    }),
  );
}

let verified = false;

/** Самовосстановление: если после деплоя есть темы без посчитанных счётчиков — считаем один раз. */
export async function ensureTopicCounts() {
  if (verified) return;
  if ((await prisma.topic.count({ where: { practiceCount: null } })) > 0) await recalcTopicCounts();
  verified = true;
}
