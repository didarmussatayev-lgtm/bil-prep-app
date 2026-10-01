/**
 * Проверка файла темы (topic-N-M.ts) ПЕРЕД тем, как его подключать в seed —
 * ловит типичные ошибки формата у контента, сгенерированного ИИ (Gemini/NotebookLM),
 * до того, как они попадут в базу.
 *
 * Запуск (без установки зависимостей проекта — файлы темы не тянут ничего, кроме ./types):
 *   npx tsx prisma/seed/validate.ts prisma/seed/data/math/section-1/topic-1-4.ts
 */
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import type { Figure, SeedTask, SeedTopic } from "./types";

type Level = "error" | "warn";
const issues: { level: Level; where: string; message: string }[] = [];
const err = (where: string, message: string) => issues.push({ level: "error", where, message });
const warn = (where: string, message: string) => issues.push({ level: "warn", where, message });

const FIGURE_KINDS = new Set(["fraction_bar", "circle", "grid", "number_line", "table", "cross", "circle_numbers", "chain", "placeholder"]);
const LETTERS = ["A", "B", "C", "D", "E"];

function checkFigure(where: string, f: Figure) {
  if (!f || typeof f !== "object" || typeof (f as any).kind !== "string") {
    err(where, "рисунок без kind или не объект");
    return;
  }
  if (!FIGURE_KINDS.has(f.kind)) {
    err(where, `неизвестный kind рисунка "${f.kind}" (допустимо: ${[...FIGURE_KINDS].join(", ")})`);
    return;
  }
  if (f.kind === "fraction_bar" || f.kind === "circle") {
    if (!Number.isInteger(f.parts) || f.parts < 1) err(where, `${f.kind}: parts должно быть целым ≥ 1`);
    if (!Array.isArray(f.shaded)) err(where, `${f.kind}: shaded должен быть массивом`);
    else for (const i of f.shaded) if (!Number.isInteger(i) || i < 0 || i >= f.parts) err(where, `${f.kind}: shaded содержит индекс ${i} вне диапазона [0, ${f.parts - 1}]`);
  } else if (f.kind === "grid") {
    if (!Number.isInteger(f.rows) || f.rows < 1) err(where, "grid: rows должно быть целым ≥ 1");
    if (!Number.isInteger(f.cols) || f.cols < 1) err(where, "grid: cols должно быть целым ≥ 1");
    if (!Array.isArray(f.shaded)) err(where, "grid: shaded должен быть массивом пар [строка,столбец]");
    else
      for (const cell of f.shaded) {
        if (!Array.isArray(cell) || cell.length !== 2) { err(where, `grid: shaded содержит не пару [r,c]: ${JSON.stringify(cell)}`); continue; }
        const [r, c] = cell;
        if (r < 0 || r >= f.rows || c < 0 || c >= f.cols) err(where, `grid: клетка [${r},${c}] вне сетки ${f.rows}×${f.cols}`);
      }
  } else if (f.kind === "number_line") {
    if (typeof f.from !== "number" || typeof f.to !== "number" || f.from >= f.to) err(where, "number_line: from/to должны быть числами, from < to");
    if (!Number.isInteger(f.divisions) || f.divisions < 1) err(where, "number_line: divisions должно быть целым ≥ 1");
    if (!Array.isArray(f.marks)) err(where, "number_line: marks должен быть массивом");
    else
      for (const m of f.marks) {
        const v = Array.isArray(m.at) ? m.at[0] / m.at[1] : m.at;
        if (typeof v !== "number" || Number.isNaN(v)) err(where, `number_line: метка at=${JSON.stringify(m.at)} не число`);
        else if (v < f.from || v > f.to) warn(where, `number_line: метка ${v} вне диапазона [${f.from}, ${f.to}]`);
      }
  } else if (f.kind === "table") {
    if (!Array.isArray(f.rows) || !f.rows.every((r) => Array.isArray(r))) err(where, "table: rows должен быть массивом массивов строк");
  } else if (f.kind === "placeholder") {
    if (!f.description || typeof f.description !== "string") warn(where, "placeholder: не помешало бы description — что нарисовано в книге");
  } else if (f.kind === "circle_numbers") {
    if (!Array.isArray(f.values) || f.values.length < 2) err(where, "circle_numbers: values должен быть массивом из ≥2 элементов");
  } else if (f.kind === "chain") {
    if (!Array.isArray(f.cells) || f.cells.length < 2) err(where, "chain: cells должен быть массивом из ≥2 элементов");
    if (f.shape && !["circle", "square", "hexagon"].includes(f.shape)) err(where, `chain: неизвестная форма "${f.shape}" (circle|square|hexagon)`);
  } else if (f.kind === "cross") {
    for (const key of ["top", "left", "center", "right", "bottom"] as const) {
      const v = (f as any)[key];
      if (v === undefined || v === null || v === "") err(where, `cross: позиция "${key}" пустая — нужно число или "?"`);
    }
  }
}

/** :::figure {json} внутри explanation — та же валидация JSON, что делает parseExplanation() на сайте. */
function checkExplanationFigures(explanation: string) {
  const lines = explanation.split("\n");
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith(":::figure")) return;
    const jsonPart = trimmed.slice(":::figure".length).trim();
    try {
      const parsed = JSON.parse(jsonPart);
      if (!parsed || typeof parsed.kind !== "string") {
        err(`explanation, строка ${i + 1}`, ":::figure — распарсился, но нет строкового поля kind");
      } else {
        checkFigure(`explanation, строка ${i + 1}`, parsed);
      }
    } catch (e) {
      err(`explanation, строка ${i + 1}`, `:::figure — невалидный JSON (${(e as Error).message}): ${jsonPart.slice(0, 80)}`);
    }
  });
  // Незакрытые фигурные скобки {a/b} — типичная ошибка при ручной правке сгенерированного текста.
  const braceBalance = (explanation.match(/\{/g)?.length ?? 0) - (explanation.match(/\}/g)?.length ?? 0);
  if (braceBalance !== 0) warn("explanation", `не совпадает число { и } — возможно, незакрытая дробь {a/b} (баланс ${braceBalance})`);
}

function checkAns(where: string, ans: NonNullable<SeedTask["ans"]>) {
  if (ans.t === "int") { if (!Number.isFinite(ans.v)) err(where, "int: v не число"); }
  else if (ans.t === "dec") { if (!Number.isFinite(ans.v)) err(where, "dec: v не число"); }
  else if (ans.t === "frac") {
    if (!Number.isFinite(ans.n) || !Number.isFinite(ans.d)) err(where, "frac: n/d не числа");
    else if (ans.d === 0) err(where, "frac: знаменатель 0");
    else if (Math.abs(ans.n) >= Math.abs(ans.d)) warn(where, `frac: |${ans.n}| ≥ |${ans.d}| — это неправильная дробь, возможно нужен mixed()`);
  } else if (ans.t === "mixed") {
    if (!Number.isFinite(ans.w) || !Number.isFinite(ans.n) || !Number.isFinite(ans.d)) err(where, "mixed: w/n/d не числа");
    else if (ans.d === 0) err(where, "mixed: знаменатель 0");
    else if (Math.abs(ans.n) >= Math.abs(ans.d)) warn(where, `mixed: дробная часть {${ans.n}/${ans.d}} неправильная — числитель должен быть меньше знаменателя`);
  } else {
    err(where, `неизвестный тип ответа "${(ans as any).t}"`);
  }
}

function checkTask(where: string, t: SeedTask) {
  if (!t.n || typeof t.n !== "string") err(where, "нет номера n (как в книге)");
  if (!t.q || typeof t.q !== "string") err(where, "нет текста условия q");
  const hasAns = t.ans !== undefined;
  const hasChoice = t.choice !== undefined;
  if (hasAns === hasChoice) err(where, hasAns ? "заданы и ans, и choice одновременно — должно быть что-то одно" : "не задано ни ans, ни choice");
  if (hasAns) checkAns(where, t.ans!);
  if (hasChoice) {
    const { options, correct } = t.choice!;
    if (!Array.isArray(options) || options.length < 2 || options.length > 5) err(where, `choice: options должно быть 2–5 штук, сейчас ${options?.length ?? 0}`);
    else {
      const idx = LETTERS.indexOf(correct);
      if (idx === -1 || idx >= options.length) err(where, `choice: correct="${correct}" не соответствует ни одному из ${options.length} вариантов`);
    }
    const braceBalance = options?.reduce((s, o) => s + (o.match(/\{/g)?.length ?? 0) - (o.match(/\}/g)?.length ?? 0), 0) ?? 0;
    if (braceBalance !== 0) warn(where, "choice: не совпадает число { и } в вариантах ответа");
  }
  if (t.figure) {
    const figures = Array.isArray(t.figure) ? t.figure : [t.figure];
    figures.forEach((f, i) => checkFigure(`${where}, рисунок ${i + 1}`, f));
  }
  const braceBalance = (t.q.match(/\{/g)?.length ?? 0) - (t.q.match(/\}/g)?.length ?? 0);
  if (braceBalance !== 0) warn(where, "в условии не совпадает число { и } — возможно, незакрытая дробь {a/b}");
}

function checkDuplicateNumbers(where: string, tasks: SeedTask[]) {
  const seen = new Map<string, number>();
  tasks.forEach((t) => seen.set(t.n, (seen.get(t.n) ?? 0) + 1));
  for (const [n, count] of seen) if (count > 1) err(where, `номер "${n}" встречается ${count} раза`);
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Использование: npx tsx prisma/seed/validate.ts <путь-к-topic-файлу.ts>");
    process.exit(1);
  }
  const mod = await import(pathToFileURL(resolve(filePath)).href);
  const topic: SeedTopic = mod.default;
  if (!topic) { err("файл", "нет export default"); printAndExit(); return; }

  if (!/^\d+(\.\d+)?$/.test(topic.code ?? "")) err("code", `ожидался формат "1.4" (математика) или "1" (логика, плоские главы), получено ${JSON.stringify(topic.code)}`);
  if (!topic.title) err("title", "пусто");
  if (!topic.explanation || topic.explanation.trim().length < 20) err("explanation", "пусто или подозрительно коротко");
  else checkExplanationFigures(topic.explanation);

  if (!Array.isArray(topic.practice)) err("practice", "должен быть массивом");
  else {
    topic.practice.forEach((t, i) => checkTask(`practice[${i}] (№${t?.n ?? "?"})`, t));
    checkDuplicateNumbers("practice", topic.practice);
    if (topic.practice.some((t) => t.choice)) warn("practice", "в «Задачах» есть задание с выбором — обычно там открытый ответ (ans), выбор — в test[]");
  }
  if (!Array.isArray(topic.test)) err("test", "должен быть массивом");
  else {
    topic.test.forEach((t, i) => checkTask(`test[${i}] (№${t?.n ?? "?"})`, t));
    checkDuplicateNumbers("test", topic.test);
    if (topic.test.some((t) => t.ans)) warn("test", "в «Тесте» есть задание с открытым ответом — обычно там только выбор (choice)");
  }
  if (!Array.isArray(topic.pending)) warn("pending", "должен быть массивом (можно пустым [])");

  printAndExit();
}

function printAndExit() {
  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warn");
  for (const i of issues) console.log(`${i.level === "error" ? "❌" : "⚠️ "} [${i.where}] ${i.message}`);
  console.log(`\n${errors.length} ошибок, ${warnings.length} предупреждений.`);
  if (errors.length === 0) console.log("Формат в порядке — ошибки, если есть, только смысловые (проверить по книге).");
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Не удалось загрузить файл:", e);
  process.exit(1);
});
