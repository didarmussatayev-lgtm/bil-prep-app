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
import { rotate } from "./kit";

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
  { slug: "nis-today-test-01", number: 1, title: { ru: "Тест 1", kk: "1-тест" }, timeMinutes: 180, group: "training", fixed: true, questions: [...T01_MATH, ...shift(T01_QUANT, 41), ...T01_RUS, ...T01_KAZ, ...T01_ENG] },
  { slug: "nis-today-test-02", number: 2, title: { ru: "Тест 2", kk: "2-тест" }, timeMinutes: 180, group: "training", fixed: true, questions: [...T02_MATH, ...shift(T02_QUANT, 41), ...rotate(T02_RUS), ...rotate(T02_KAZ), ...rotate(T02_ENG)] },
];
