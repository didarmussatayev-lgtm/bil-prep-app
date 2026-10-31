/**
 * Английский (НИШ): тема пишется ОДИН раз сразу на двух языках пояснений (ru + kk), а сами задания — на английском,
 * поэтому условие и варианты общие, а «решение» двуязычное. Из EngTopic строятся:
 *   toSeed(t) → SeedTopic (русский слой, как у Естествознания);
 *   toKk(t)   → KkTopic   (казахский слой).
 * Правила ответов: в «Закрепить тему» — text (одно английское слово/форма), seq (несколько пропусков по порядку),
 * set (номера верных предложений), int. Тест — choice A–D/E. Английские ответы одинаковы для ru и kk учеников.
 */
import type { Ans, Figure, SeedTask, SeedTopic } from "../../types";
import { dec, int, seq, set, text } from "../../types";
import type { KkTopic } from "../kk";

export type Bi = { ru: string; kk: string };

export type EngTask = {
  n: string;
  /** Условие — по-английски (общее для ru и kk). */
  q: string;
  ans?: Ans;
  choice?: { options: string[]; correct: "A" | "B" | "C" | "D" | "E" };
  sol: Bi;
  figure?: Figure | Figure[];
};

export type EngTopic = {
  code: string;
  title: Bi;
  explanation: Bi;
  practice: EngTask[];
  test: EngTask[];
};

/** Открытое задание: одно английское слово/форма. */
export const fill = (n: string, q: string, answer: string, ru: string, kk: string): EngTask => ({ n, q, ans: text(answer), sol: { ru: `Ответ: ${answer}. ${ru}`, kk: `Жауабы: ${answer}. ${kk}` } });
/** Несколько пропусков по порядку: ответы через пробел. */
export const fills = (n: string, q: string, answers: string[], ru: string, kk: string): EngTask => ({ n, q, ans: seq(...answers), sol: { ru: `Ответ: ${answers.join(" ")}. ${ru}`, kk: `Жауабы: ${answers.join(" ")}. ${kk}` } });
/** Номера верных вариантов (порядок не важен). */
export const pick = (n: string, q: string, nums: number[], ru: string, kk: string): EngTask => ({ n, q, ans: set(...nums), sol: { ru: `Ответ: ${nums.join(" ")}. ${ru}`, kk: `Жауабы: ${nums.join(" ")}. ${kk}` } });
/** Правильный порядок номеров (seq). */
export const order = (n: string, q: string, nums: number[], ru: string, kk: string): EngTask => ({ n, q, ans: seq(...nums), sol: { ru: `Порядок: ${nums.join(" ")}. ${ru}`, kk: `Реті: ${nums.join(" ")}. ${kk}` } });
/** Число (сколько …). */
export const count = (n: string, q: string, v: number, ru: string, kk: string): EngTask => ({ n, q, ans: int(v), sol: { ru: `Ответ: ${v}. ${ru}`, kk: `Жауабы: ${v}. ${kk}` } });

/** Десятичное число. */
export const decnum = (n: string, q: string, v: number, ru: string, kk: string): EngTask => ({ n, q, ans: dec(v), sol: { ru: `Ответ: ${String(v).replace(".", ",")}. ${ru}`, kk: `Жауабы: ${String(v).replace(".", ",")}. ${kk}` } });

/** Тестовый вопрос: правильный вариант — ПЕРВЫЙ в списке (при загрузке варианты перемешиваются по кругу, см. NIS_SHUFFLE). */
export const mc = (n: string, q: string, options: string[], ru: string, kk: string): EngTask => ({ n, q, choice: { options, correct: "A" }, sol: { ru, kk } });

/** Таблица слов EN | ҚАЗАҚША | РУССКИЙ в виде блока :::figure. rows: [en, kk, ru]. */
export function vocab(title: Bi, rows: [string, string, string][]): Bi {
  const mk = (head: string[], cap: string) => `:::figure ${JSON.stringify({ kind: "table", caption: cap, rows: [head, ...rows.map(([en, kk, ru]) => [en, kk, ru])] })}\n:::`;
  const head = ["English", "Қазақша", "Русский"];
  return { ru: mk(head, title.ru), kk: mk(head, title.kk) };
}

export const joinBi = (...parts: Bi[]): Bi => ({ ru: parts.map((p) => p.ru).join("\n\n"), kk: parts.map((p) => p.kk).join("\n\n") });

const toSeedTask = (t: EngTask, lang: "ru"): SeedTask => ({ n: t.n, q: t.q, ans: t.ans, choice: t.choice, solution: t.sol[lang], figure: t.figure });

export function toSeed(t: EngTopic): SeedTopic {
  return {
    code: t.code,
    title: t.title.ru,
    explanation: t.explanation.ru,
    practice: t.practice.map((x) => toSeedTask(x, "ru")),
    test: t.test.map((x) => toSeedTask(x, "ru")),
    pending: [],
  };
}

export function toKk(t: EngTopic): KkTopic {
  const tasks: NonNullable<KkTopic["tasks"]> = {};
  for (const x of t.practice) tasks[`p:${x.n}`] = { question: x.q, solution: x.sol.kk };
  for (const x of t.test) tasks[`t:${x.n}`] = { question: x.q, options: x.choice?.options, solution: x.sol.kk };
  return { title: t.title.kk, explanation: t.explanation.kk, tasks };
}
