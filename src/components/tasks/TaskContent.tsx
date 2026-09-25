import { Figure } from "@/components/content/Figure";
import { RichText } from "@/components/content/RichText";
import type { FigureSpec } from "@/lib/content/types";

/** Условие задачи: текст + (если есть) рисунок(и). Без хуков — можно использовать и на сервере, и на клиенте. */
export function TaskContent({ question, figures }: { question: string; figures: FigureSpec[] }) {
  return (
    <div>
      <RichText text={question} />
      {figures.map((f, i) => (
        <Figure key={i} spec={f} />
      ))}
    </div>
  );
}
