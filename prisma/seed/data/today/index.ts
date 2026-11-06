/**
 * Комплексное пробное «TODAY»: смешанные тесты по всем предметам на время, с разбором.
 * Источник: «Сборник тестов для подготовки к НИШ» (Образовательный центр TODAY, 6 тестов × 5 предметов).
 * Тексты переписаны: имена и числа изменены, ответы пересчитаны; разбор (ru/kk) написан для каждого вопроса.
 * Сейчас загружен Тест 1: все пять разделов (40+60+20+20+20).
 */
import type { SeedTopic } from "../../types";
import type { KkTopic } from "../kk";
import { EngTopic, toKk, toSeed } from "../eng/kit";
import type { EngPaper } from "../eng/papers";
import { T01_MATH } from "./t01-math";
import { T01_QUANT } from "./t01-quant";
import { T01_RUS } from "./t01-rus";
import { T01_KAZ } from "./t01-kaz";
import { T01_ENG } from "./t01-eng";
import { T02_MATH } from "./t02-math";
import { T02_QUANT } from "./t02-quant";
import { T02_RUS } from "./t02-rus";
import { T02_KAZ } from "./t02-kaz";
import { T02_ENG } from "./t02-eng";
import { T03_MATH } from "./t03-math";
import { T03_QUANT } from "./t03-quant";
import { T03_RUS, T03_KAZ, T03_ENG } from "./t03-verbal";
import { T04_MATH } from "./t04-math";
import { T04_QUANT } from "./t04-quant";
import { T04_RUS, T04_KAZ, T04_ENG } from "./t04-verbal";
import { T05_MATH } from "./t05-math";
import { T05_QUANT } from "./t05-quant";
import { T05_RUS, T05_KAZ, T05_ENG } from "./t05-verbal";
import { T06_MATH } from "./t06-math";
import { T06_QUANT } from "./t06-quant";
import { T06_RUS, T06_KAZ, T06_ENG } from "./t06-verbal";
import { rotate as rot, enrich } from "./kit";
const rotate = (t: EngPaper["questions"]) => enrich(rot(t));

/** Сквозная нумерация внутри варианта: математика 1–40, количественные 41–100, русский 101–120, казахский 121–140, английский 141–160. */
const shift = (ts: EngPaper["questions"], from: number) => ts.map((t, i) => ({ ...t, n: String(from + i) }));

const t11: EngTopic = {
  code: "1.1",
  title: { ru: "Как проходить комплексное пробное", kk: "Кешенді сынақтан қалай өту керек" },
  explanation: {
    ru: `### Формат
Тест идёт **на время**, предметы подряд: математика, количественные характеристики, русский, казахский, английский. После сдачи доступен **разбор** каждого вопроса.

:::steps Как работать
1. Сначала решайте то, что видите сразу; сложное помечайте и возвращайтесь.
2. Следите за временем: на математику — не больше трети общего времени.
3. После сдачи разберите каждую ошибку по разбору.
:::`,
    kk: `### Формат
Тест **уақытқа** өтеді, пәндер қатарынан: математика, сандық сипаттамалар, орыс, қазақ, ағылшын тілі. Тапсырғаннан кейін әр сұрақтың **талдауы** қолжетімді.

:::steps Қалай жұмыс істеу керек
1. Алдымен бірден көрінетінін шешіңіз; қиынын белгілеп, кейін оралыңыз.
2. Уақытты қадағалаңыз: математикаға жалпы уақыттың үштен бірінен артық жұмсамаңыз.
3. Тапсырғаннан кейін әр қатені талдау бойынша қарап шығыңыз.
:::`,
  },
  practice: [],
  test: [],
};

export const TODAY_BOOK_1 = { slug: "today-1", title: "Комплексное пробное TODAY", level: 1, order: 1, topics: [t11].map(toSeed) as SeedTopic[] };
export const TODAY_KK_TOPICS: Record<string, KkTopic> = { "today-1.1.1": toKk(t11) };

export const TODAY_PAPERS: EngPaper[] = [
  { slug: "nis-today-test-01", number: 1, title: { ru: "Тест 1", kk: "1-тест" }, timeMinutes: 180, group: "training", fixed: true, questions: [...T01_MATH, ...shift(T01_QUANT, 41), ...enrich(T01_RUS), ...enrich(T01_KAZ), ...enrich(T01_ENG)] },
  { slug: "nis-today-test-02", number: 2, title: { ru: "Тест 2", kk: "2-тест" }, timeMinutes: 180, group: "training", fixed: true, questions: [...T02_MATH, ...shift(T02_QUANT, 41), ...enrich(T02_RUS), ...enrich(T02_KAZ), ...enrich(T02_ENG)] },
  { slug: "nis-today-test-03", number: 3, title: { ru: "Тест 3", kk: "3-тест" }, timeMinutes: 180, group: "training", fixed: true, questions: [...T03_MATH, ...shift(T03_QUANT, 41), ...rotate(T03_RUS), ...rotate(T03_KAZ), ...rotate(T03_ENG)] },
  { slug: "nis-today-test-04", number: 4, title: { ru: "Тест 4", kk: "4-тест" }, timeMinutes: 180, group: "training", fixed: true, questions: [...T04_MATH, ...shift(T04_QUANT, 41), ...rotate(T04_RUS), ...rotate(T04_KAZ), ...rotate(T04_ENG)] },
  { slug: "nis-today-test-05", number: 5, title: { ru: "Тест 5", kk: "5-тест" }, timeMinutes: 180, group: "training", fixed: true, questions: [...T05_MATH, ...shift(T05_QUANT, 41), ...rotate(T05_RUS), ...rotate(T05_KAZ), ...rotate(T05_ENG)] },
  { slug: "nis-today-test-06", number: 6, title: { ru: "Тест 6", kk: "6-тест" }, timeMinutes: 180, group: "training", fixed: true, questions: [...T06_MATH, ...shift(T06_QUANT, 41), ...rotate(T06_RUS), ...rotate(T06_KAZ), ...rotate(T06_ENG)] },
];
