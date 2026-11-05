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
