import type { EngTask } from "../eng/kit";

/** Задача пробника TODAY: условие ru/kk, варианты (общие, если kk не задан), верная буква, разбор ru/kk. */
export const M = (
  n: string, qRu: string, qKk: string, opts: string[], correct: "A" | "B" | "C" | "D", solRu: string, solKk: string, optsKk?: string[],
): EngTask => ({ n, q: qRu, choice: { options: opts, correct }, sol: { ru: solRu, kk: solKk }, kk: { q: qKk, options: optsKk ?? opts } });
