import type { SeedTopic } from "../../types";
import type { KkTopic } from "../kk";
import { EngTopic, toKk, toSeed } from "./kit";
import { PAPERS_DATA } from "./papers";
import a01 from "./a/a01"; import a02 from "./a/a02"; import a03 from "./a/a03"; import a04 from "./a/a04"; import a05 from "./a/a05";
import a06 from "./a/a06"; import a07 from "./a/a07"; import a08 from "./a/a08"; import a09 from "./a/a09"; import a10 from "./a/a10";
import a11 from "./a/a11"; import a12 from "./a/a12"; import a13 from "./a/a13"; import a14 from "./a/a14"; import a15 from "./a/a15";
import b01 from "./b/b01"; import b02 from "./b/b02"; import b03 from "./b/b03"; import b04 from "./b/b04";
import b05 from "./b/b05"; import b06 from "./b/b06"; import b07 from "./b/b07"; import b08 from "./b/b08";

const BOOK_1: EngTopic[] = [a01, a02, a03, a04, a05, a06, a07, a08, a09, a10, a11, a12, a13, a14, a15];
const BOOK_2: EngTopic[] = [b01, b02, b03, b04, b05, b06, b07, b08];

export const ENG_BOOK_1 = {
  slug: "en-1",
  title: "Английский 1. Базовый курс (Book 1)",
  level: 1,
  order: 1,
  topics: BOOK_1.map(toSeed) as SeedTopic[],
};

export const ENG_BOOK_2 = {
  slug: "en-2",
  title: "Английский 2. Экзамен НИШ",
  level: 2,
  order: 2,
  topics: BOOK_2.map(toSeed) as SeedTopic[],
};

/** Казахский слой: ключ = `${slug раздела}.${код темы}` (как slug темы в БД). */
export const ENG_KK_TOPICS: Record<string, KkTopic> = Object.fromEntries([
  ...BOOK_1.map((t) => [`en-1.${t.code}`, toKk(t)] as const),
  ...BOOK_2.map((t) => [`en-2.${t.code}`, toKk(t)] as const),
]);

/**
 * Пробные варианты: правильный вариант в данных — первый, при сборке его циклически сдвигают, чтобы буквы A–D встречались поровну.
 * Одна и та же перестановка для всех языков (варианты общие, английские).
 */
export const ENG_PAPERS = PAPERS_DATA.map((p) => ({
  ...p,
  questions: p.questions.map((q, i) => {
    const opts = q.choice!.options;
    const to = (i + p.number) % opts.length;
    const rest = opts.slice(1);
    rest.splice(to, 0, opts[0]);
    return { ...q, choice: { options: rest, correct: "ABCDE"[to] as "A" | "B" | "C" | "D" | "E" } };
  }),
}));
