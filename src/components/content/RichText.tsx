import ui from "@/components/student/ui.module.css";

/**
 * ШАГ 6: заменить реализацию — полноценный разбор дробей (числитель над знаменателем)
 * и формул (KaTeX) вместо «сырого» {a/b} на экране. Сигнатура должна остаться: { text: string }.
 *
 * Пока что: строки текста как абзацы + инлайновый **жирный** (seed использует его для
 * "**Решение:**" и т.п. — без этого он показывался бы со звёздочками буквально).
 * {a/b} и {w a/b} намеренно оставлены как есть — их разбор в виджет дроби это и есть шаг 6.
 */
function renderInline(line: string, keyPrefix: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== "");
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    ),
  );
}

export function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className={ui.richText}>
      {lines.map((line, i) => (
        <p key={i} style={{ margin: i === 0 ? 0 : "0.5em 0 0" }}>
          {renderInline(line, `l${i}`)}
        </p>
      ))}
    </div>
  );
}
