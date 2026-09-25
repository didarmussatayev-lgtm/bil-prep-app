// Контракты контента. Файл без server-only — используется и на клиенте.
// ExplanationBlock — формат, в который в итоге разбирается Topic.explanationContent:
// либо это уже готовый ExplanationBlock[] (JSON), либо строка Markdown, как её кладёт
// seed-скрипт (шаг 4) — см. docs/content-format.md. parseExplanation() понимает оба варианта.

export type FigureSpec = { kind: string } & Record<string, unknown>;

export type ChoiceOption = { key: string; text: string };

export type ExplanationBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "rule"; title?: string; text: string } // правило / определение
  | { type: "example"; title?: string; text: string; solution?: string }
  | { type: "figure"; figure: FigureSpec; caption?: string };

/** Задача в том виде, в каком её можно отдавать в браузер: БЕЗ ответа и решения. */
export type PublicTask = {
  id: string;
  topicId: string;
  type: "test_choice" | "open";
  question: string;
  options: ChoiceOption[] | null;
  /** Только для type="open" — какой виджет ввода показать. Сам эталон на клиент не уходит. */
  answerType: "integer" | "decimal" | "fraction" | "mixed" | null;
  /** Ноль, один или несколько рисунков к условию (см. docs/content-format.md — Task.figure может быть массивом). */
  figures: FigureSpec[];
};

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];

function safeParseJsonObject(json: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * explanationContent разбирается в блоки. Понимает:
 *  - готовый ExplanationBlock[] (если в базе уже лежит JSON-массив);
 *  - Markdown, который пишет seed (шаг 4): `### ` — заголовок, `:::figure {json}` —
 *    рисунок отдельной строкой, пустая строка — разделитель абзацев, всё остальное — текст
 *    абзаца (внутристрочный `**жирный**` разбирает RichText).
 */
export function parseExplanation(raw: unknown): ExplanationBlock[] {
  if (Array.isArray(raw)) return raw as ExplanationBlock[];
  if (typeof raw !== "string" || !raw.trim()) return [];

  const blocks: ExplanationBlock[] = [];
  let buf: string[] = [];
  const flushParagraph = () => {
    const text = buf.join("\n").trim();
    if (text) blocks.push({ type: "paragraph", text });
    buf = [];
  };

  for (const rawLine of raw.split("\n")) {
    const line = rawLine.trim();
    if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "heading", text: line.slice(4).trim() });
    } else if (line.startsWith(":::figure")) {
      const figure = safeParseJsonObject(line.slice(":::figure".length).trim());
      if (figure && typeof figure.kind === "string") {
        flushParagraph();
        const { caption, ...spec } = figure as FigureSpec & { caption?: string };
        blocks.push({ type: "figure", figure: spec as FigureSpec, caption });
      } else {
        buf.push(rawLine); // не похоже на валидный рисунок — оставляем как обычный текст
      }
    } else if (line === "") {
      flushParagraph();
    } else {
      buf.push(rawLine);
    }
  }
  flushParagraph();
  return blocks;
}

/**
 * options хранится как string[] (позиция в массиве = буква A, B, C…), так его пишут
 * и seed (шаг 4), и форма админки (шаг 7). {key,text}[] тоже поддерживается для совместимости.
 */
export function parseOptions(raw: unknown): ChoiceOption[] {
  if (!Array.isArray(raw)) return [];
  if (raw.every((o) => typeof o === "string")) {
    return (raw as string[]).map((text, i) => ({ key: LETTERS[i] ?? String(i + 1), text }));
  }
  return raw.filter(
    (o): o is ChoiceOption =>
      !!o && typeof o === "object" && typeof (o as ChoiceOption).key === "string" && typeof (o as ChoiceOption).text === "string",
  );
}

/**
 * imageParamsJson может быть одним рисунком ({kind:...}), массивом рисунков,
 * или (для обратной совместимости) обёрнут как {figures:[...]}. Всегда возвращает массив.
 */
export function parseFigures(raw: unknown): FigureSpec[] {
  if (!raw || typeof raw !== "object") return [];
  const isFigure = (v: unknown): v is FigureSpec => !!v && typeof v === "object" && typeof (v as FigureSpec).kind === "string";

  if (Array.isArray(raw)) return raw.filter(isFigure);
  if (isFigure(raw)) return [raw];
  const wrapped = (raw as { figures?: unknown }).figures;
  if (Array.isArray(wrapped)) return wrapped.filter(isFigure);
  return [];
}

/** Рисунок ещё не сделан (kind="placeholder") — задачу с таким рисунком скрываем от учеников. */
export function hasPendingFigure(figures: FigureSpec[]): boolean {
  return figures.some((f) => f.kind === "placeholder");
}

export function toPublicTask(row: {
  id: string;
  topicId: string;
  type: string;
  question: string;
  options: unknown;
  answerType?: string | null;
  imageParamsJson: unknown;
}): PublicTask {
  return {
    id: row.id,
    topicId: row.topicId,
    type: row.type === "open" ? "open" : "test_choice",
    question: row.question,
    options: row.type === "open" ? null : parseOptions(row.options),
    answerType:
      row.type === "open" && (row.answerType === "integer" || row.answerType === "decimal" || row.answerType === "fraction" || row.answerType === "mixed")
        ? row.answerType
        : null,
    figures: parseFigures(row.imageParamsJson),
  };
}
