/** Эталонный ответ. Компактная запись для авторинга; в БД превращается в answerType + correctAnswerJson. */
export type Ans =
  | { t: "int"; v: number }
  | { t: "dec"; v: number }
  | { t: "frac"; n: number; d: number }
  | { t: "mixed"; w: number; n: number; d: number };

export const int = (v: number): Ans => ({ t: "int", v });
export const dec = (v: number): Ans => ({ t: "dec", v });
export const frac = (n: number, d: number): Ans => ({ t: "frac", n, d });
export const mixed = (w: number, n: number, d: number): Ans => ({ t: "mixed", w, n, d });

/** Параметры рисунков → параметрические SVG-компоненты (пункт 6). */
export type Figure =
  | { kind: "fraction_bar"; parts: number; shaded: number[]; caption?: string }
  | { kind: "circle"; parts: number; shaded: number[]; caption?: string }
  | { kind: "grid"; rows: number; cols: number; shaded: [number, number][]; caption?: string }
  | { kind: "number_line"; from: number; to: number; divisions: number; marks: { at: number | [number, number]; label?: string }[]; caption?: string }
  | { kind: "table"; rows: string[][]; caption?: string }
  /** Рисунок ещё не построен: задача сохранена, но скрыта от учеников, пока placeholder не заменят. */
  | { kind: "placeholder"; description: string };

export type SeedTask = {
  /** Номер как в книге: "1a", "7". Для тестов — номер вопроса. */
  n: string;
  q: string;
  /** Открытый ответ */
  ans?: Ans;
  /** Выбор из вариантов A–E (буква = позиция в options) */
  choice?: { options: string[]; correct: "A" | "B" | "C" | "D" | "E" };
  solution?: string;
  figure?: Figure | Figure[];
  /** Что проверить человеку (ответ определён по сканy неуверенно / в книге неточность) */
  review?: string;
};

export type Pending = { page: number; n: string; why: string };

export type SeedTopic = {
  /** "1.1" */
  code: string;
  title: string;
  /** Markdown + разметка дробей {a/b}, {w a/b} + блоки :::figure {json} */
  explanation: string;
  practice: SeedTask[];
  test: SeedTask[];
  /** Задания книги, которые пока НЕ загружены (и почему) */
  pending: Pending[];
};
