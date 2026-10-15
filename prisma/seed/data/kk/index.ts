/**
 * Казахский перевод контента (необязательный слой поверх русского seed).
 * Всё пишется в колонку i18n как { kk: {..., reviewed: false} } — русский оригинал не меняется.
 * Нет записи → ученик с казахским интерфейсом видит русский текст.
 *
 * Ключи задач: "p:<n>" (закрепление) и "t:<n>" (тест) — как в slug задачи.
 */
import type { Figure } from "../../types";
import m1_1 from "./math-1/1.1";
import m1_2 from "./math-1/1.2";
import m1_3 from "./math-1/1.3";
import m1_4 from "./math-1/1.4";
import m1_6 from "./math-1/1.6";
import m1_7 from "./math-1/1.7";
import m1_8 from "./math-1/1.8";
import m1_9 from "./math-1/1.9";
import m1_10 from "./math-1/1.10";
import m1_11 from "./math-1/1.11";
import m1_12 from "./math-1/1.12";
import m1_13 from "./math-1/1.13";

export type KkTask = { question: string; options?: string[]; solution?: string; /** рисунок с казахскими подписями (если в нём есть текст) */ figure?: Figure | Figure[] };
export type KkTopic = { title: string; explanation?: string; tasks?: Record<string, KkTask> };

export const KK_SUBJECTS: Record<string, { name: string }> = {
  math: { name: "Математика" },
  logic: { name: "Логика" },
};

/** slug раздела → название */
export const KK_SECTIONS: Record<string, { title: string }> = {
  "math-1": { title: "I бөлім. Бөлшектер, пайыздар және пропорциялар" },
};

/** "<slug раздела>.<код темы>" → перевод темы */
export const KK_TOPICS: Record<string, KkTopic> = {
  "math-1.1.1": m1_1,
  "math-1.1.2": m1_2,
  "math-1.1.3": m1_3,
  "math-1.1.4": m1_4,
  "math-1.1.6": m1_6,
  "math-1.1.7": m1_7,
  "math-1.1.8": m1_8,
  "math-1.1.9": m1_9,
  "math-1.1.10": m1_10,
  "math-1.1.11": m1_11,
  "math-1.1.12": m1_12,
  "math-1.1.13": m1_13,
};
