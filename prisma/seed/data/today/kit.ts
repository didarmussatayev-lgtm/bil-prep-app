import type { EngTask } from "../eng/kit";

/** Задача пробника TODAY: условие ru/kk, варианты (общие, если kk не задан), верная буква, разбор ru/kk. */
export const M = (
  n: string, qRu: string, qKk: string, opts: string[], correct: "A" | "B" | "C" | "D", solRu: string, solKk: string, optsKk?: string[],
): EngTask => ({ n, q: qRu, choice: { options: opts, correct }, sol: { ru: solRu, kk: solKk }, kk: { q: qKk, options: optsKk ?? opts } });

const QT_LEG_RU = ["A — значение в колонке A больше", "B — значение в колонке B больше", "C — значения равны между собой", "D — недостаточно информации"];
const QT_LEG_KK = ["A — A бағанындағы мән үлкен", "B — B бағанындағы мән үлкен", "C — мәндер өзара тең", "D — ақпарат жеткіліксіз"];
/** Количественные характеристики: колонки A и B, ответ — A/B/C/D по легенде. */
export const QT = (
  n: number, aRu: string, aKk: string, bRu: string, bKk: string, correct: "A" | "B" | "C" | "D", solRu: string, solKk: string, commonRu?: string, commonKk?: string,
): EngTask => ({
  n: String(n),
  q: `${commonRu ? commonRu + "\n\n" : ""}**Колонка A:** ${aRu}\n\n**Колонка B:** ${bRu}`,
  choice: { options: QT_LEG_RU, correct },
  sol: { ru: solRu, kk: solKk },
  kk: { q: `${commonKk ? commonKk + "\n\n" : ""}**A бағаны:** ${aKk}\n\n**B бағаны:** ${bKk}`, options: QT_LEG_KK },
});

/** Циклически сдвигает варианты ответов (чтобы верные буквы не шли подряд); пропускает «числовые» и порядковые варианты. */
export function rotate(tasks: EngTask[]): EngTask[] {
  const L = ["A", "B", "C", "D"] as const;
  return tasks.map((t, i) => {
    const o = t.choice?.options;
    if (!o || o.length !== 4 || o.every((x) => /^[\d\s,.;−-]+$/.test(x)) || /^\d(, \d)+$/.test(o[0])) return t;
    const k = (i * 3 + 1) % 4; // сдвиг
    const rot = (a: string[]) => a.map((_, j) => a[(j - k + 4) % 4]);
    const oldIdx = L.indexOf(t.choice!.correct as "A");
    const newIdx = (oldIdx + k) % 4;
    return { ...t, choice: { options: rot(o), correct: L[newIdx] }, kk: t.kk ? { ...t.kk, options: rot(t.kk.options) } : undefined, sol: t.sol };
  });
}

const SENT = /(?<=[.!?…»])\s+|\n+/;
const toks = (s: string) => (s.toLowerCase().match(/[a-zа-яёәіңғүұқөһ]{4,}/gi) ?? []).map((w) => w.slice(0, 5));

/**
 * Расширяет разбор текстовых вопросов (русский, казахский, английский): находит в тексте предложение, которое
 * лучше всего подтверждает верный вариант, и добавляет его цитатой + пояснение, почему остальные варианты неверны.
 * Вызывать ПОСЛЕ rotate(), чтобы буквы были итоговыми.
 */
export function enrich(tasks: EngTask[]): EngTask[] {
  let passage = "";
  return tasks.map((t) => {
    const c = t.choice;
    if (!c) return t;
    let stem = t.q;
    const m = t.q.match(/^\*\*(Text \d+|Текст \d+|\d+-мәтін)[^\n]*\*\*[\s\S]*?(?=\n\n\*\*\d+\.)/);
    if (m) { passage = m[0]; stem = t.q.slice(m[0].length); }
    if (!passage) return t;
    const body = passage.replace(/^\*\*[^\n]*\*\*\n?/, "");
    const L = ["A", "B", "C", "D"];
    const opt = c.options[L.indexOf(c.correct)] ?? "";
    const ot = new Set(toks(opt)); const st = new Set(toks(stem));
    let best = ""; let score = 0;
    for (const s of body.split(SENT).map((x) => x.trim()).filter((x) => x.length > 12)) {
      const tk = toks(s); let sc = 0;
      for (const w of tk) { if (ot.has(w)) sc += 2; else if (st.has(w)) sc += 0.5; }
      if (sc > score) { score = sc; best = s; }
    }
    const others = L.filter((x) => x !== c.correct).slice(0, c.options.length - 1).join(", ");
    const quote = score >= 2 ? best.replace(/\*\*/g, "") : "";
    const ru = `${t.sol.ru}${quote ? ` Опора в тексте: «${quote}».` : ""} Варианты ${others} в тексте не подтверждаются или противоречат ему.`;
    const kk = `${t.sol.kk}${quote ? ` Мәтіннен дәлел: «${quote}».` : ""} ${others} нұсқалары мәтінмен расталмайды немесе оған қайшы келеді.`;
    return { ...t, sol: { ru, kk } };
  });
}

/** Выравнивает распределение верных букв A–D: переставляет верный вариант на наименее частую букву.
 *  Пропускает вопросы, где порядок вариантов значим (последовательности, «только I», «все/ни один» и т. п.) и где разбор ссылается на буквы. */
export function balance(tasks: EngTask[]): EngTask[] {
  const L = ["A", "B", "C", "D"] as const;
  const fixedOpt = /^[\d\s,.;−-]+$|^(\d|I{1,3})(, | and | и )|only|both|all of|none of|^все\b|^ни |^только|барлығы|жауабы жоқ|^и |^оба|^верн|^II|^I\b/i;
  const eligible = (t: EngTask) => {
    const o = t.choice?.options;
    if (!o || o.length !== 4) return false;
    if (o.some((x) => fixedOpt.test(x.trim()))) return false;
    if (/\b[A-D]\)|вариант[а-я]* [A-D]\b|[Оо]твет[: ]+[A-D]\b|\b[A-D] (нұсқа|вариант)/.test(t.sol.ru + t.sol.kk)) return false;
    return true;
  };
  const cnt: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  tasks.forEach((t) => { if (!eligible(t)) cnt[t.choice!.correct]++; });
  return tasks.map((t, i) => {
    if (!eligible(t)) return t;
    const order = [...L].sort((a, b) => cnt[a] - cnt[b] || ((L.indexOf(a) - i) % 4 + 4) % 4 - ((L.indexOf(b) - i) % 4 + 4) % 4);
    const target = order[0]; cnt[target]++;
    const from = L.indexOf(t.choice!.correct as "A"), to = L.indexOf(target);
    if (from === to) return t;
    const sw = (a: string[]) => { const r = [...a]; [r[from], r[to]] = [r[to], r[from]]; return r; };
    return { ...t, choice: { options: sw(t.choice!.options), correct: target }, kk: t.kk ? { ...t.kk, options: sw(t.kk.options) } : undefined };
  });
}
