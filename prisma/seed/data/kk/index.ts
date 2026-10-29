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
import m4_1_1 from "./math4-1/1.1";
import m4_1_2 from "./math4-1/1.2";
import m4_1_3 from "./math4-1/1.3";
import m4_1_4 from "./math4-1/1.4";
import m4_1_5 from "./math4-1/1.5";
import m4_1_6 from "./math4-1/1.6";
import m4_1_7 from "./math4-1/1.7";
import m4_1_8 from "./math4-1/1.8";
import m4_1_9 from "./math4-1/1.9";
import m4_1_10 from "./math4-1/1.10";
import m4_1_11 from "./math4-1/1.11";
import m4_1_12 from "./math4-1/1.12";
import m4_1_13 from "./math4-1/1.13";
import m4_1_14 from "./math4-1/1.14";
import m4_1_15 from "./math4-1/1.15";
import m4_1_16 from "./math4-1/1.16";
import m4_1_17 from "./math4-1/1.17";
import m4_1_18 from "./math4-1/1.18";
import m4_1_19 from "./math4-1/1.19";
import m4_2_1 from "./math4-2/2.1";
import m4_2_2 from "./math4-2/2.2";
import m4_2_3 from "./math4-2/2.3";
import m4_2_4 from "./math4-2/2.4";
import m4_2_5 from "./math4-2/2.5";
import m4_2_6 from "./math4-2/2.6";
import m4_2_7 from "./math4-2/2.7";
import m4_2_8 from "./math4-2/2.8";
import m4_2_9 from "./math4-2/2.9";
import lg1_1 from "./logic-1/1";
import lg1_2 from "./logic-1/2";
import lg1_3 from "./logic-1/3";
import lg1_4 from "./logic-1/4";
import lg1_5 from "./logic-1/5";
import lg1_6 from "./logic-1/6";
import lg2_7 from "./logic-2/7";
import lg2_8 from "./logic-2/8";
import lg2_9 from "./logic-2/9";
import lg2_10 from "./logic-2/10";
import lg2_11 from "./logic-2/11";
import lg2_12 from "./logic-2/12";
import lg2_13 from "./logic-2/13";
import lg2_14 from "./logic-2/14";
import lg2_15 from "./logic-2/15";
import lg2_16 from "./logic-2/16";
import lg2_17 from "./logic-2/17";
import lg2_18 from "./logic-2/18";
import lg3_19 from "./logic-3/19";
import lg3_20 from "./logic-3/20";
import lg3_21 from "./logic-3/21";
import lg3_22 from "./logic-3/22";
import lg3_23 from "./logic-3/23";
import lg3_24 from "./logic-3/24";
import lg3_25 from "./logic-3/25";
import lg3_26 from "./logic-3/26";

export type KkTask = { question: string; options?: string[]; solution?: string; /** рисунок с казахскими подписями (если в нём есть текст) */ figure?: Figure | Figure[] };
export type KkTopic = { title: string; explanation?: string; tasks?: Record<string, KkTask> };

export const KK_SUBJECTS: Record<string, { name: string }> = {
  math: { name: "Математика" },
  logic: { name: "Логика" },
  grade5: { name: "5-сынып" },
};

/** slug раздела → название */
export const KK_SECTIONS: Record<string, { title: string }> = {
  "math2-1": { title: "Математика 2. I бөлім. Бүтін сандар" },
  "math2-2": { title: "Математика 2. II бөлім. Рационал сандар" },
  "math2-3": { title: "Математика 2. III бөлім. 1–2 кітапты қайталау" },
  "math-3": { title: "Математика 1. III бөлім. Ұзындық, периметр, аудан және көлем" },
  "math-2": { title: "Математика 1. II бөлім. Дәреже, бөлінгіштік, ЕҮОБ және ЕКОЕ" },
  "math-1": { title: "Математика 1. I бөлім. Бөлшектер, пайыздар және пропорциялар" },
  "math3-1": { title: "Математика 3. 1-бөлім" },
  "math3-2": { title: "Математика 3. 2-бөлім — Қайталауға арналған тесттер" },
  "math4-1": { title: "Математика 4. 1-бөлім" },
  "math4-2": { title: "Математика 4. 2-бөлім — Қайталау және тесттер" },
  "g5-1-4": { title: "Математика 1. 4-тарау. Ондық бөлшектер" },
  "g5-1-5": { title: "Математика 1. 5-тарау. Мәтінді есептер, тізбектер, жиындар, пайыз" },
  "logic-1": { title: "Сандар, әріптер және кестелер" },
  "logic-2": { title: "Фигуралар" },
  "logic-3": { title: "Логикалық есептер және кодтар" },
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
  "math4-1.1.1": m4_1_1,
  "math4-1.1.2": m4_1_2,
  "math4-1.1.3": m4_1_3,
  "math4-1.1.4": m4_1_4,
  "math4-1.1.5": m4_1_5,
  "math4-1.1.6": m4_1_6,
  "math4-1.1.7": m4_1_7,
  "math4-1.1.8": m4_1_8,
  "math4-1.1.9": m4_1_9,
  "math4-1.1.10": m4_1_10,
  "math4-1.1.11": m4_1_11,
  "math4-1.1.12": m4_1_12,
  "math4-1.1.13": m4_1_13,
  "math4-1.1.14": m4_1_14,
  "math4-1.1.15": m4_1_15,
  "math4-1.1.16": m4_1_16,
  "math4-1.1.17": m4_1_17,
  "math4-1.1.18": m4_1_18,
  "math4-1.1.19": m4_1_19,
  "math4-2.2.1": m4_2_1,
  "math4-2.2.2": m4_2_2,
  "math4-2.2.3": m4_2_3,
  "math4-2.2.4": m4_2_4,
  "math4-2.2.5": m4_2_5,
  "math4-2.2.6": m4_2_6,
  "math4-2.2.7": m4_2_7,
  "math4-2.2.8": m4_2_8,
  "math4-2.2.9": m4_2_9,
  "logic-1.1": lg1_1,
  "logic-1.2": lg1_2,
  "logic-1.3": lg1_3,
  "logic-1.4": lg1_4,
  "logic-1.5": lg1_5,
  "logic-1.6": lg1_6,
  "logic-2.7": lg2_7,
  "logic-2.8": lg2_8,
  "logic-2.9": lg2_9,
  "logic-2.10": lg2_10,
  "logic-2.11": lg2_11,
  "logic-2.12": lg2_12,
  "logic-2.13": lg2_13,
  "logic-2.14": lg2_14,
  "logic-2.15": lg2_15,
  "logic-2.16": lg2_16,
  "logic-2.17": lg2_17,
  "logic-2.18": lg2_18,
  "logic-3.19": lg3_19,
  "logic-3.20": lg3_20,
  "logic-3.21": lg3_21,
  "logic-3.22": lg3_22,
  "logic-3.23": lg3_23,
  "logic-3.24": lg3_24,
  "logic-3.25": lg3_25,
  "logic-3.26": lg3_26,
};
