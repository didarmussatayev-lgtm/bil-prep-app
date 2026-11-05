import type { EngTask } from "../eng/kit";

/** Задача пробника TODAY: условие ru/kk, варианты (общие, если kk не задан), верная буква, разбор ru/kk. */
export const M = (
  n: string, qRu: string, qKk: string, opts: string[], correct: "A" | "B" | "C" | "D", solRu: string, solKk: string, optsKk?: string[],
): EngTask => ({ n, q: qRu, choice: { options: opts, correct }, sol: { ru: solRu, kk: solKk }, kk: { q: qKk, options: optsKk ?? opts } });

const QT_LEG_RU = ["A — значение в колонке A больше", "B — значение в колонке B больше", "C — значения равны между собой", "D — недостаточно информации"];
const QT_LEG_KK = ["A — A бағанындағы мән үлкен", "B — B бағанындағы мән үлкен", "C — мәндер өзара тең", "D — ақпарат жеткіліксіз"];
/** Количественные характеристики: колонки A и B, ответ — A/B/C/D по легенде. */
export const QT = (
  n: number, aRu: string, aKk: string, bRu: string, bKk: string, correct: "A" | "B" | "C" | "D", solRu: string, solKk: string, commonRu?: string, commonKk?: string,
): EngTask => ({
  n: String(n),
  q: `${commonRu ? commonRu + "\n\n" : ""}**Колонка A:** ${aRu}\n\n**Колонка B:** ${bRu}`,
  choice: { options: QT_LEG_RU, correct },
  sol: { ru: solRu, kk: solKk },
  kk: { q: `${commonKk ? commonKk + "\n\n" : ""}**A бағаны:** ${aKk}\n\n**B бағаны:** ${bKk}`, options: QT_LEG_KK },
});

/** Циклически сдвигает варианты ответов (чтобы верные буквы не шли подряд); пропускает «числовые» и порядковые варианты. */
export function rotate(tasks: EngTask[]): EngTask[] {
  const L = ["A", "B", "C", "D"] as const;
  return tasks.map((t, i) => {
    const o = t.choice?.options;
    if (!o || o.length !== 4 || o.every((x) => /^[\d\s,.;−-]+$/.test(x)) || /^\d(, \d)+$/.test(o[0])) return t;
    const k = (i * 3 + 1) % 4; // сдвиг
    const rot = (a: string[]) => a.map((_, j) => a[(j - k + 4) % 4]);
    const oldIdx = L.indexOf(t.choice!.correct as "A");
    const newIdx = (oldIdx + k) % 4;
    return { ...t, choice: { options: rot(o), correct: L[newIdx] }, kk: t.kk ? { ...t.kk, options: rot(t.kk.options) } : undefined, sol: t.sol };
  });
}
