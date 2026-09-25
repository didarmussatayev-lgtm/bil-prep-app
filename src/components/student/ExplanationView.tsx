import { Figure } from "@/components/content/Figure";
import { RichText } from "@/components/content/RichText";
import type { ExplanationBlock } from "@/lib/content/types";
import ui from "./ui.module.css";

export function ExplanationView({ blocks }: { blocks: ExplanationBlock[] }) {
  if (blocks.length === 0) {
    return <p className={ui.callout}>Объяснение к этой теме пока не добавлено.</p>;
  }

  return (
    <div className={ui.prose}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return <h2 key={i}>{b.text}</h2>;
          case "paragraph":
            return <RichText key={i} text={b.text} />;
          case "list":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}><RichText text={it} /></li>
                ))}
              </ul>
            );
          case "rule":
            return (
              <div key={i} className={ui.rule}>
                {b.title && <p className={ui.exampleTitle}>{b.title}</p>}
                <RichText text={b.text} />
              </div>
            );
          case "example":
            return (
              <div key={i} className={ui.example}>
                <p className={ui.exampleTitle}>{b.title ?? "Пример"}</p>
                <RichText text={b.text} />
                {b.solution && (
                  <div className={ui.solution}>
                    <RichText text={b.solution} />
                  </div>
                )}
              </div>
            );
          case "figure":
            return (
              <figure key={i} style={{ margin: 0 }}>
                <Figure spec={b.figure} />
                {b.caption && <figcaption className={ui.muted}>{b.caption}</figcaption>}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
