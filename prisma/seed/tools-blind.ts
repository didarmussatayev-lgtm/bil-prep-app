/**
 * Слепая проверка ответов: tools-blind.ts dump <файл темы> <out.json>  — условия БЕЗ ответов и решений;
 *                          tools-blind.ts cmp  <файл темы> <answers.json> — сверка ответов проверяющего с эталоном.
 * Формат ответов: {"p:1a": "3" | "2/5" | "1 3/4" | "0,75" | "B 4 7" | "B" ...}, для теста — буква.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Ans, SeedTask } from "./types";

const fmt = (a: Ans): string =>
  a.t === "int" ? String(a.v) : a.t === "dec" ? String(a.v) : a.t === "frac" ? `${a.n}/${a.d}` : a.t === "mixed" ? `${a.w} ${a.n}/${a.d}` : a.t === "seq" ? a.items.join(" ") : a.t === "set" ? [...a.items].sort().join(" ") : a.s;
const norm = (s: string) => s.replace(/,/g, ".").replace(/\s+/g, " ").trim().toLowerCase();
const toNum = (s: string) => { const m = s.match(/^(?:(\d+) )?(\d+)\/(\d+)$/); return m ? (m[1] ? +m[1] : 0) + +m[2] / +m[3] : Number(s); };

(async () => {
  const [mode, file, third] = process.argv.slice(2);
  const t = (await import(resolve(file))).default;
  const all: [string, SeedTask][] = [...t.practice.map((x: SeedTask) => ["p:" + x.n, x]), ...t.test.map((x: SeedTask) => ["t:" + x.n, x])];
  if (mode === "dump") {
    const out = all.map(([k, x]) => ({
      id: k, q: x.q, ...(x.choice ? { options: x.choice.options } : { answerType: x.ans!.t }),
      ...(x.figure ? { figure: x.figure } : {}),
    }));
    writeFileSync(third, JSON.stringify(out, null, 1));
    console.log(out.length, "задач");
  } else {
    const got = JSON.parse(readFileSync(third, "utf8")) as Record<string, string>;
    let ok = 0, skip = 0; const bad: string[] = [];
    for (const [k, x] of all) {
      const g = got[k];
      if (g === undefined || g === null || /^skip/i.test(String(g))) { skip++; continue; }
      const exp = x.choice ? x.choice.correct : fmt(x.ans!);
      const srt = (v: string) => (x.ans?.t === "set" ? norm(v).split(" ").sort().join(" ") : norm(v));
      const eq = srt(String(g)) === srt(exp) || (x.ans && ["int", "dec", "frac", "mixed"].includes(x.ans.t) && Math.abs(toNum(norm(String(g))) - toNum(norm(exp))) < 1e-9);
      if (eq) ok++; else bad.push(`${k}: эталон «${exp}», проверяющий «${g}»`);
    }
    console.log(`совпало ${ok}, пропущено ${skip}, расхождений ${bad.length}`);
    console.log(bad.join("\n"));
  }
})();
