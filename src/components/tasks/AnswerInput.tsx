"use client";

import ui from "@/components/student/ui.module.css";

export type AnswerDraft = Record<string, string>;

/**
 * Виджет ввода ответа: форма зависит от answerType (см. Task.answerType) —
 * отдельные поля, а не голое текстовое поле. draft хранит "сырой" текст полей,
 * приведение к числам и сборка JSON для /api/tasks/:id/check — в TaskCard.
 * Enter в любом поле — отправка (onSubmit); invalid подсвечивает поля красным после неверного ответа.
 */
export function AnswerInput({
  answerType,
  value,
  onChange,
  onSubmit,
  disabled,
  invalid,
}: {
  answerType: "integer" | "decimal" | "fraction" | "mixed";
  value: AnswerDraft;
  onChange: (v: AnswerDraft) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const field = (key: string, label: string, opts: { mode?: "numeric" | "decimal"; cls?: string; autoFocus?: boolean } = {}) => (
    <input
      key={key}
      className={[ui.answerBox, opts.cls, invalid ? ui.answerBoxBad : ""].filter(Boolean).join(" ")}
      inputMode={opts.mode ?? "numeric"}
      autoComplete="off"
      value={value[key] ?? ""}
      onChange={(e) => onChange({ ...value, [key]: e.target.value })}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit?.();
      }}
      disabled={disabled}
      aria-label={label}
      title={label}
    />
  );

  const fraction = (
    <div className={ui.fractionInput}>
      {field("num", "Числитель")}
      <div className={ui.fractionBar} />
      {field("denom", "Знаменатель")}
    </div>
  );

  if (answerType === "integer") return <div className={ui.answerRow}>{field("value", "Ответ")}</div>;
  if (answerType === "decimal")
    return <div className={ui.answerRow}>{field("value", "Ответ (десятичная дробь)", { mode: "decimal", cls: ui.answerBoxWide })}</div>;
  if (answerType === "fraction") return <div className={ui.answerRow}>{fraction}</div>;

  return (
    <div className={ui.answerRow}>
      {field("whole", "Целая часть", { cls: ui.answerBoxWhole })}
      {fraction}
    </div>
  );
}
