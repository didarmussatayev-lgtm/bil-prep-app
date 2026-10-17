/**
 * Казахский перевод контента (необязательный слой поверх русского seed).
 * Всё пишется в колонку i18n как { kk: {..., reviewed: false} } — русский оригинал не меняется.
 * Нет записи → ученик с казахским интерфейсом видит русский текст.
 *
 * Ключи задач: "p:<n>" (закрепление) и "t:<n>" (тест) — как в slug задачи.
 */
import type { Figure } from "../../types";
import m3_13 from "./math-3/3.13";
import m3_1 from "./math-3/3.1";
import m3_2 from "./math-3/3.2";
import m3_3 from "./math-3/3.3";
import m3_4 from "./math-3/3.4";
import m3_5 from "./math-3/3.5";
import m3_6 from "./math-3/3.6";
import m3_7 from "./math-3/3.7";
import m3_8 from "./math-3/3.8";
import m3_9 from "./math-3/3.9";
import m3_10 from "./math-3/3.10";
import m3_11 from "./math-3/3.11";
import m3_12 from "./math-3/3.12";
import m2_1 from "./math-2/2.1";
import m2_2 from "./math-2/2.2";
import m2_3 from "./math-2/2.3";
import m2_4 from "./math-2/2.4";
import m2_5 from "./math-2/2.5";
import m2_6 from "./math-2/2.6";
import m2_1_1 from "./math2-1/1.1";
import m2_1_2 from "./math2-1/1.2";
import m2_1_3 from "./math2-1/1.3";
import m2_1_4 from "./math2-1/1.4";
import m2_1_5 from "./math2-1/1.5";
import m2_1_6 from "./math2-1/1.6";
import m2_1_7 from "./math2-1/1.7";
import m2_1_8 from "./math2-1/1.8";
import m2_1_9 from "./math2-1/1.9";
import m2_1_10 from "./math2-1/1.10";
import m2_1_11 from "./math2-1/1.11";
import m2_1_12 from "./math2-1/1.12";
import m2_1_13 from "./math2-1/1.13";
import m2_1_14 from "./math2-1/1.14";
import m2_1_15 from "./math2-1/1.15";
import m2_2_1 from "./math2-2/2.1";
import m2_2_2 from "./math2-2/2.2";
import m2_2_3 from "./math2-2/2.3";
import m2_2_4 from "./math2-2/2.4";
import m2_2_5 from "./math2-2/2.5";
import m2_2_6 from "./math2-2/2.6";
import m2_2_7 from "./math2-2/2.7";
import m2_2_8 from "./math2-2/2.8";
import m2_2_9 from "./math2-2/2.9";
import m2_2_10 from "./math2-2/2.10";
import m2_2_11 from "./math2-2/2.11";
import m2_2_12 from "./math2-2/2.12";
import m2_2_13 from "./math2-2/2.13";
import m2_2_14 from "./math2-2/2.14";
import m2_2_15 from "./math2-2/2.15";
import m2_2_16 from "./math2-2/2.16";
import m2_2_17 from "./math2-2/2.17";
import m2_2_18 from "./math2-2/2.18";
import m2_2_19 from "./math2-2/2.19";
import m2_2_20 from "./math2-2/2.20";
import m2_2_21 from "./math2-2/2.21";
import m2_3_1 from "./math2-3/3.1";
import m2_3_2 from "./math2-3/3.2";
import m2_3_3 from "./math2-3/3.3";
import m2_3_4 from "./math2-3/3.4";
import m2_3_5 from "./math2-3/3.5";
import m1_1 from "./math-1/1.1";
import m1_2 from "./math-1/1.2";
import m1_3 from "./math-1/1.3";
import m1_4 from "./math-1/1.4";
import m1_5 from "./math-1/1.5";
import m1_6 from "./math-1/1.6";
import m1_7 from "./math-1/1.7";
import m1_8 from "./math-1/1.8";
import m1_9 from "./math-1/1.9";
import m1_10 from "./math-1/1.10";
import m1_11 from "./math-1/1.11";
import m1_12 from "./math-1/1.12";
import m1_13 from "./math-1/1.13";
import m3_1_1 from "./math3-1/1.1";
import m3_1_2 from "./math3-1/1.2";
import m3_1_3 from "./math3-1/1.3";
import m3_1_4 from "./math3-1/1.4";
import m3_1_5 from "./math3-1/1.5";
import m3_1_6 from "./math3-1/1.6";
import m3_1_7 from "./math3-1/1.7";
import m3_1_8 from "./math3-1/1.8";
import m3_1_9 from "./math3-1/1.9";
import m3_1_10 from "./math3-1/1.10";
import m3_1_11 from "./math3-1/1.11";
import m3_1_12 from "./math3-1/1.12";
import m3_1_13 from "./math3-1/1.13";
import m3_2_1 from "./math3-2/2.1";
import m3_2_2 from "./math3-2/2.2";
import m3_2_3 from "./math3-2/2.3";
import m3_2_4 from "./math3-2/2.4";
import m3_2_5 from "./math3-2/2.5";
import m3_2_6 from "./math3-2/2.6";

export type KkTask = { question: string; options?: string[]; solution?: string; /** рисунок с казахскими подписями (если в нём есть текст) */ figure?: Figure | Figure[] };
export type KkTopic = { title: string; explanation?: string; tasks?: Record<string, KkTask> };

export const KK_SUBJECTS: Record<string, { name: string }> = {
  math: { name: "Математика" },
  logic: { name: "Логика" },
};

/** slug раздела → название */
export const KK_SECTIONS: Record<string, { title: string }> = {
  "math2-1": { title: "I бөлім. Бүтін сандар" },
  "math2-2": { title: "II бөлім. Рационал сандар" },
  "math2-3": { title: "III бөлім. 1–2 кітапты қайталау" },
  "math-3": { title: "III бөлім. Ұзындық, периметр, аудан және көлем" },
  "math-2": { title: "II бөлім. Дәреже, бөлінгіштік, ЕҮОБ және ЕКОЕ" },
  "math-1": { title: "I бөлім. Бөлшектер, пайыздар және пропорциялар" },
  "math3-1": { title: "Математика 3. 1-бөлім" },
  "math3-2": { title: "Математика 3. 2-бөлім — Қайталауға арналған тесттер" },
};

/** "<slug раздела>.<код темы>" → перевод темы */
export const KK_TOPICS: Record<string, KkTopic> = {
  "math2-1.1.1": m2_1_1,
  "math2-1.1.2": m2_1_2,
  "math2-1.1.3": m2_1_3,
  "math2-1.1.4": m2_1_4,
  "math2-1.1.5": m2_1_5,
  "math2-1.1.6": m2_1_6,
  "math2-1.1.7": m2_1_7,
  "math2-1.1.8": m2_1_8,
  "math2-1.1.9": m2_1_9,
  "math2-1.1.10": m2_1_10,
  "math2-1.1.11": m2_1_11,
  "math2-1.1.12": m2_1_12,
  "math2-1.1.13": m2_1_13,
  "math2-1.1.14": m2_1_14,
  "math2-1.1.15": m2_1_15,
  "math2-2.2.1": m2_2_1,
  "math2-2.2.2": m2_2_2,
  "math2-2.2.3": m2_2_3,
  "math2-2.2.4": m2_2_4,
  "math2-2.2.5": m2_2_5,
  "math2-2.2.6": m2_2_6,
  "math2-2.2.7": m2_2_7,
  "math2-2.2.8": m2_2_8,
  "math2-2.2.9": m2_2_9,
  "math2-2.2.10": m2_2_10,
  "math2-2.2.11": m2_2_11,
  "math2-2.2.12": m2_2_12,
  "math2-2.2.13": m2_2_13,
  "math2-2.2.14": m2_2_14,
  "math2-2.2.15": m2_2_15,
  "math2-2.2.16": m2_2_16,
  "math2-2.2.17": m2_2_17,
  "math2-2.2.18": m2_2_18,
  "math2-2.2.19": m2_2_19,
  "math2-2.2.20": m2_2_20,
  "math2-2.2.21": m2_2_21,
  "math2-3.3.1": m2_3_1,
  "math2-3.3.2": m2_3_2,
  "math2-3.3.3": m2_3_3,
  "math2-3.3.4": m2_3_4,
  "math2-3.3.5": m2_3_5,
  "math-3.3.1": m3_1,
  "math-3.3.2": m3_2,
  "math-3.3.3": m3_3,
  "math-3.3.4": m3_4,
  "math-3.3.5": m3_5,
  "math-3.3.6": m3_6,
  "math-3.3.7": m3_7,
  "math-3.3.8": m3_8,
  "math-3.3.9": m3_9,
  "math-3.3.10": m3_10,
  "math-3.3.11": m3_11,
  "math-3.3.12": m3_12,
  "math-3.3.13": m3_13,
  "math-2.2.1": m2_1,
  "math-2.2.2": m2_2,
  "math-2.2.3": m2_3,
  "math-2.2.4": m2_4,
  "math-2.2.5": m2_5,
  "math-2.2.6": m2_6,
  "math-1.1.1": m1_1,
  "math-1.1.2": m1_2,
  "math-1.1.3": m1_3,
  "math-1.1.4": m1_4,
  "math-1.1.5": m1_5,
  "math-1.1.6": m1_6,
  "math-1.1.7": m1_7,
  "math-1.1.8": m1_8,
  "math-1.1.9": m1_9,
  "math-1.1.10": m1_10,
  "math-1.1.11": m1_11,
  "math-1.1.12": m1_12,
  "math-1.1.13": m1_13,
  "math3-1.1.1": m3_1_1,
  "math3-1.1.2": m3_1_2,
  "math3-1.1.3": m3_1_3,
  "math3-1.1.4": m3_1_4,
  "math3-1.1.5": m3_1_5,
  "math3-1.1.6": m3_1_6,
  "math3-1.1.7": m3_1_7,
  "math3-1.1.8": m3_1_8,
  "math3-1.1.9": m3_1_9,
  "math3-1.1.10": m3_1_10,
  "math3-1.1.11": m3_1_11,
  "math3-1.1.12": m3_1_12,
  "math3-1.1.13": m3_1_13,
  "math3-2.2.1": m3_2_1,
  "math3-2.2.2": m3_2_2,
  "math3-2.2.3": m3_2_3,
  "math3-2.2.4": m3_2_4,
  "math3-2.2.5": m3_2_5,
  "math3-2.2.6": m3_2_6,
};
