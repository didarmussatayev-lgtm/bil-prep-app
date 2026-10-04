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
  /** Пять чисел/символов вокруг центра — "Связь между числами и фигурами" в логике.
   *  Любая позиция может быть "?" (неизвестное, которое должен найти ученик). */
  | { kind: "cross"; top: number | string; left: number | string; center: number | string; right: number | string; bottom: number | string; caption?: string }
  /** N чисел по кругу через равные промежутки, по часовой стрелке с 12 часов. Любой элемент может быть "?". */
  | { kind: "circle_numbers"; values: (number | string)[]; caption?: string }
  /** Цепочка фигур (кружков/квадратов/шестигранников) со стрелками между ними, каждая со своим числом. Любой элемент может быть "?". */
  | { kind: "chain"; cells: (number | string)[]; shape?: "circle" | "square" | "hexagon"; caption?: string }
  /** Прямоугольник с подписанными сторонами (ширина/высота) — для задач на периметр/площадь.
   *  color — индекс цвета заливки (0-5, см. палитру в Figure.tsx), необязателен. */
  | { kind: "rectangle"; width?: number | string; height?: number | string; names?: string; color?: number; caption?: string }
  /** Квадрат с подписанной стороной. */
  | { kind: "square"; side?: number | string; names?: string; color?: number; caption?: string }
  /** Треугольник с тремя подписанными сторонами. Если right задан (любое из "A"|"B"|"C" — просто флаг "прямоугольный"), рисуется прямоугольный треугольник, где a,b — катеты, c — гипотенуза. Если right не задан — обычный треугольник: a — основание, b и c — боковые стороны. */
  | { kind: "triangle"; a?: number | string; b?: number | string; c?: number | string; right?: "A" | "B" | "C"; names?: string; color?: number; caption?: string }
  /** Круг с подписанным радиусом и/или диаметром. square="in" рисует вписанный в круг квадрат (вершины на окружности);
   *  square="out" рисует квадрат, описанный вокруг круга (круг вписан в квадрат). */
  | { kind: "circle_measure"; radius?: number | string; diameter?: number | string; square?: "in" | "out"; color?: number; caption?: string }
  /** Произвольная прямоугольная ("ступенчатая") фигура — контур задаётся последовательностью ходов
   *  (как черепашья графика), начиная из произвольной точки и возвращаясь в неё же последним сегментом.
   *  dir — направление (R/L/U/D), len — длина в условных клетках (для пропорций рисунка, не обязана совпадать с подписанным числом), label — текст подписи на этой стороне (необязателен). */
  | { kind: "path_shape"; moves: { dir: "R" | "L" | "U" | "D"; len: number; label?: string }[]; color?: number; caption?: string }
  /** Прямоугольный параллелепипед в псевдо-3D с подписанными шириной/высотой/глубиной.
   *  units=[x,y,z] — вместо подписей размеров рисует сетку единичных кубиков на трёх видимых гранях (для задач "из скольки кубиков состоит фигура"). */
  /** Универсальный «холст» для повторения рисунков учебника: примитивы в клетках (x вправо, y вниз).
   *  items: rect{x,y,w,h,fill?,dash?,label?} | poly{pts,fill?,dash?,open?} | line{x1,y1,x2,y2,dash?,color?} | circle{cx,cy,r,fill?,dash?}
   *  | sector{cx,cy,r,a0,a1,fill?} | arc{cx,cy,r,a0,a1,color?,w?} | path{d,fill?,dash?,color?,w?} (d: абсолютные M/L/A/Z в клетках) (углы в градусах, 0° — вверх, по часовой) | right{x,y,dx?,dy?} (значок прямого угла) | text{x,y,s,anchor?,color?,size?}.
   *  fill — индекс палитры 0-5, hex-строка или null (без заливки). scale — пикселей на клетку (26 по умолчанию). */
  | { kind: "scene"; width: number; height: number; items: Record<string, unknown>[]; scale?: number; color?: number; caption?: string }
  | { kind: "box3d"; width?: number | string; height?: number | string; depth?: number | string; units?: [number, number, number]; color?: number; caption?: string }
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
 
