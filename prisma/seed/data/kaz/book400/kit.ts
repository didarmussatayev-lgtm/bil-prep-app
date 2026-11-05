import { ex } from "../../eng/kit";
import type { EngPaper } from "../../eng/papers";

type L = "A" | "B" | "C" | "D" | "E";
/** Вариант из сборника «Қазақ тілі» (Сағидолда, Дүйсембай, 2017): тексты: {id: «заголовок\nтекст»}, вопрос: [n, id текста|0, вопрос, варианты]; ключ — отдельной строкой. */
export function paper(number: number, texts: Record<string, string>, qs: [number, string | 0, string, string[]][], key: string): EngPaper {
  const shown = new Set<string>();
  return {
    slug: `nis-kazakh-collection-${String(number).padStart(2, "0")}`, number: number + 10, title: { ru: `Сборник: вариант ${number}`, kk: `Жинақ: ${number}-нұсқа` },
    timeMinutes: 40, group: "training", fixed: true,
    questions: qs.map(([n, tid, q, opts]) => {
      let text = "";
      if (tid) { text = shown.has(tid) ? `(${tid}-мәтін) ` : `**${tid}-мәтін**\n${texts[tid]}\n\n`; shown.add(tid); }
      const letter = key[n - 1].toUpperCase() as L;
      return ex(String(n), `${text}**${n}. ${q}**`, opts, letter);
    }),
  };
}
