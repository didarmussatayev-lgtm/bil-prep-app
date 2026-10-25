"use client";

import { Figure } from "@/components/content/Figure";
import { RichText, renderRichInline } from "@/components/content/RichText";
import type { CalloutKind, ExplanationBlock } from "@/lib/content/types";
import { useT } from "@/lib/i18n/client";
import ui from "./ui.module.css";

const CALLOUT_META: Record<CalloutKind, { icon: string; title: string; cls: string }> = {
  rule: { icon: "📐", title: "Правило", cls: ui.cRule },
  tip: { icon: "💡", title: "Лайфхак", cls: ui.cTip },
  warn: { icon: "⚠️", title: "Осторожно, ловушка", cls: ui.cWarn },
  remember: { icon: "📌", title: "Запомни", cls: ui.cRemember },
  check: { icon: "🎯", title: "Проверь себя", cls: ui.cCheck },
  fun: { icon: "✨", title: "Интересно", cls: ui.cFun },
  steps: { icon: "🪜", title: "Алгоритм", cls: ui.cSteps },
  example: { icon: "✏️", title: "Пример", cls: ui.cExample },
};

function Blocks({ blocks }: { blocks: ExplanationBlock[] }) {
  const t = useT();
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return <h2 key={i}>{b.text}</h2>;
          case "paragraph":
            return <RichText key={i} text={b.text} />;
          case "list": {
            const items = b.items.map((it, j) => (
              <li key={j}>{renderRichInline(it, `li${i}-${j}`)}</li>
            ));
            return b.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
          }
          case "callout": {
            const meta = CALLOUT_META[b.kind];
            const answer = b.answer && b.answer.length > 0 ? <Blocks blocks={b.answer} /> : null;
            return (
              <aside key={i} className={`${ui.callBox} ${meta.cls}`}>
                <p className={ui.callTitle}>
                  <span aria-hidden="true">{meta.icon}</span> {b.title ?? t(meta.title)}
                </p>
                <div className={ui.callBody}><Blocks blocks={b.children} /></div>
                {answer && b.kind === "check" && (
                  <details className={ui.spoiler}>
                    <summary>{t("Показать ответ")}</summary>
                    <div className={ui.callBody}>{answer}</div>
                  </details>
                )}
                {answer && b.kind === "example" && <div className={`${ui.solution} ${ui.callBody}`}>{answer}</div>}
              </aside>
            );
          }
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
                <p className={ui.exampleTitle}>{b.title ?? t("Пример")}</p>
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
                {b.caption && <figcaption className={ui.muted}>{renderRichInline(b.caption, `fc${i}`)}</figcaption>}
              </figure>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export function ExplanationView({ blocks }: { blocks: ExplanationBlock[] }) {
  const t = useT();
  if (blocks.length === 0) {
    return <p className={ui.callout}>{t("Объяснение к этой теме пока не добавлено.")}</p>;
  }
  return (
    <div className={ui.prose}>
      <Blocks blocks={blocks} />
    </div>
  );
}
