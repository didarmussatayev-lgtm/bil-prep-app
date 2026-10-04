import type { Figure, Pending, SeedTask, SeedTopic } from "./types";

/**
 * Накладка на тему: добавляет/заменяет рисунки, вставляет новые задачи и подменяет pending.
 * Базовый файл темы (topic-N-M.ts) остаётся нетронутым; индекс раздела импортирует результат applyOverlay.
 */
export type Overlay = {
  /** n задачи закрепления → новый рисунок (или массив рисунков). Заменяет figure у существующей задачи. */
  practiceFigures?: Record<string, Figure | Figure[]>;
  /** то же для test[] */
  testFigures?: Record<string, Figure | Figure[]>;
  /** Новые задачи; after — n задачи, после которой вставить (null — в конец). */
  addPractice?: { after: string | null; task: SeedTask }[];
  addTest?: { after: string | null; task: SeedTask }[];
  /** Полная замена pending (если не задано — pending базы не меняется). */
  pending?: Pending[];
};

function insertAfter(list: SeedTask[], items: { after: string | null; task: SeedTask }[], where: string) {
  const out = [...list];
  for (const { after, task } of items) {
    if (out.some((t) => t.n === task.n)) throw new Error(`overlay: ${where} «${task.n}» уже существует`);
    if (after === null) { out.push(task); continue; }
    const i = out.findIndex((t) => t.n === after);
    if (i < 0) throw new Error(`overlay: ${where}: не найдена задача «${after}» для вставки «${task.n}»`);
    out.splice(i + 1, 0, task);
  }
  return out;
}

function setFigures(list: SeedTask[], figs: Record<string, Figure | Figure[]> | undefined, where: string) {
  if (!figs) return list;
  const known = new Set(list.map((t) => t.n));
  for (const n of Object.keys(figs)) if (!known.has(n)) throw new Error(`overlay: ${where}: нет задачи «${n}» для замены рисунка`);
  return list.map((t) => (figs[t.n] ? { ...t, figure: figs[t.n] } : t));
}

export function applyOverlay(base: SeedTopic, ov: Overlay): SeedTopic {
  const practice = insertAfter(setFigures(base.practice, ov.practiceFigures, "practice"), ov.addPractice ?? [], "practice");
  const test = insertAfter(setFigures(base.test, ov.testFigures, "test"), ov.addTest ?? [], "test");
  return { ...base, practice, test, pending: ov.pending ?? base.pending };
}
