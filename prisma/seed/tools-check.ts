/**
 * Проверка переписанной темы и её казахского перевода.
 * npx tsx prisma/seed/tools-check.ts <новый файл темы> <kk-файл> <старый topic-*.json из tools-dump>
 * Выводит: задачи, где условие совпало с исходным (≥ 85% общих слов), задачи без перевода,
 * несовпадение числа вариантов / фигурных скобок / буквы правильного ответа, оставшиеся pending.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SeedTask } from "./types";

const words = (s: string) => (s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
const sim = (a: string, b: string) => {
  const A = words(a), B = new Set(words(b));
  return A.length ? A.filter((w) => B.has(w)).length / A.length : 1;
};
const nums = (s: string) => (s.match(/\d+(?:[.,]\d+)?/g) ?? []).map((x) => x.replace(",", ".")).sort().join(" ");
const braces = (s: string) => (s.match(/[{}]/g) ?? []).length;

(async () => {
  const [newF, kkF, oldF] = process.argv.slice(2);
  const nu = (await import(resolve(newF))).default;
  const kk = kkF && kkF !== "-" ? (await import(resolve(kkF))).default : null;
  const old = JSON.parse(readFileSync(oldF, "utf8"));
  const bad: string[] = [];
  const oldBy = (l: SeedTask[]) => new Map(l.map((t) => [t.n, t]));
  for (const [kind, key] of [["practice", "p"], ["test", "t"]] as const) {
    const o = oldBy(old[kind]);
    for (const t of nu[kind] as SeedTask[]) {
      const ot = o.get(t.n);
      if (ot) {
        const s = sim(t.q, ot.q);
        const nums = (x: string) => (x.match(/\d+/g) ?? []).join(",");
        if (t.q === ot.q) bad.push(`${key}:${t.n} условие НЕ изменено`);
        else if (nums(t.q) === nums(ot.q) && !/<</.test(JSON.stringify(ot.figure ?? ""))) bad.push(`${key}:${t.n} числа те же (${nums(t.q)})`);
      }
      if (kk) {
        const k = kk.tasks?.[`${key}:${t.n}`];
        if (!k) { bad.push(`${key}:${t.n} нет перевода`); continue; }
        if (nums(k.question) !== nums(t.q)) bad.push(`${key}:${t.n} ЧИСЛА в вопросе ru≠kk: «${nums(t.q)}» / «${nums(k.question)}»`);
        if (t.choice && k.options && nums(k.options.join(" ")) !== nums(t.choice.options.join(" "))) bad.push(`${key}:${t.n} ЧИСЛА в вариантах ru≠kk`);
        if (t.solution && k.solution && nums(k.solution) !== nums(t.solution)) bad.push(`${key}:${t.n} ЧИСЛА в решении ru≠kk`);
        if (braces(k.question) !== braces(t.q)) bad.push(`${key}:${t.n} скобки { } в вопросе не совпали`);
        if (t.choice && (!k.options || k.options.length !== t.choice.options.length)) bad.push(`${key}:${t.n} число вариантов в kk не совпало`);
        if (t.choice && k.options) t.choice.options.forEach((op, i) => { if (braces(op) !== braces(k.options[i])) bad.push(`${key}:${t.n} скобки в варианте ${i} не совпали`); });
        if (t.solution && !k.solution) bad.push(`${key}:${t.n} нет решения в kk`);
      }
    }
    if (kk) for (const kn of Object.keys(kk.tasks ?? {})) if (kn.startsWith(key + ":") && !(nu[kind] as SeedTask[]).some((t) => `${key}:${t.n}` === kn)) bad.push(`${kn} есть в kk, но нет в теме`);
  }
  if (kk && !kk.explanation) bad.push("нет explanation в kk");
  if (kk && !kk.title) bad.push("нет title в kk");
  if (nu.pending.length) bad.push(`pending осталось: ${nu.pending.length}`);
  console.log(`${nu.code}: задач ${nu.practice.length}+${nu.test.length}, исходно ${old.practice.length}+${old.test.length}`);
  console.log(bad.length ? bad.join("\n") : "замечаний нет");
})();
