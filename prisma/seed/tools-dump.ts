/**
 * Служебный инструмент: выгружает собранную тему (база + overlay) в JSON для переписывания.
 * npx tsx prisma/seed/tools-dump.ts <модуль раздела относительно prisma/seed/data> <экспорт> <код темы> <папка вывода>
 * Рисунки kind=scene/image заменяются ссылками F["<p|t>:<n>"] и выносятся в <папка>/figs-<код>.json.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { SeedTask } from "./types";

(async () => {
  const [mod, exp, code, out] = process.argv.slice(2);
  const m = await import("./data/" + mod);
  const sec = m[exp];
  const topic = sec.topics.find((t: any) => t.code === code);
  if (!topic) throw new Error("нет темы " + code);
  const kept: Record<string, unknown> = {};
  const strip = (list: SeedTask[], p: string) =>
    list.map((t) => {
      const figs = t.figure ? (Array.isArray(t.figure) ? t.figure : [t.figure]) : [];
      if (!figs.some((f) => f.kind === "scene" || f.kind === "image")) return t;
      kept[`${p}:${t.n}`] = t.figure;
      return { ...t, figure: `<<F:${p}:${t.n}>>` };
    });
  const view = { ...topic, practice: strip(topic.practice, "p"), test: strip(topic.test, "t") };
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, `topic-${code}.json`), JSON.stringify(view, null, 1));
  if (Object.keys(kept).length) {
    const dir = join(__dirname, "data", mod, "figs");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${code}.ts`), `import type { Figure } from "../../../../types";\n\n/** Сохранённые рисунки темы ${code} (ключ: "p:<n>" — закрепление, "t:<n>" — тест). */\nexport const F: Record<string, Figure | Figure[]> = ${JSON.stringify(kept)};\n`);
  }
  console.log(code, "задач:", topic.practice.length, "+", topic.test.length, "сохранённых рисунков:", Object.keys(kept).length, "pending:", topic.pending.length);
})();
