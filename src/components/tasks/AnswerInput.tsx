"use client";

import ui from "@/components/student/ui.module.css";

export type AnswerDraft = Record<string, string>;

/**
 * Виджет ввода ответа: форма зависит от answerType (см. Task.answerType) —
 * отдельные поля, а не голое текстовое поле. draft хранит "сырой" текст полей,
 * приведение к числам и сборка JSON для /api/tasks/:id/check — в TaskCard.
 */
export function AnswerInput({
  answerType,
  value,
  onChange,
  disabled,
}: {
  answerType: "integer" | "decimal" | "fraction" | "mixed";
  value: AnswerDraft;
  onChange: (v: AnswerDraft) => void;
  disabled?: boolean;
}) {
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, [key]: e.target.value });

  const field = (key: string, placeholder: string, inputMode: "numeric" | "decimal" = "numeric") => (
    <input
      key={key}
      className={ui.answerBox}
      inputMode={inputMode}
      placeholder={placeholder}
      value={value[key] ?? ""}
      onChange={set(key)}
      disabled={disabled}
      aria-label={placeholder}
    />
  );

  const fraction = (numKey: string, denomKey: string) => (
    <div className={ui.fractionInput}>
      {field(numKey, "числ.")}
      <div className={ui.fractionBar} />
      {field(denomKey, "знам.")}
    </div>
  );

  if (answerType === "integer") return <div className={ui.answerRow}>{field("value", "число")}</div>;

  if (answerType === "decimal") return <div className={ui.answerRow}>{field("value", "0,0", "decimal")}</div>;

  if (answerType === "fraction") return <div className={ui.answerRow}>{fraction("num", "denom")}</div>;

  // mixed
  return (
    <div className={ui.answerRow}>
      {field("whole", "цел.")}
      <span className={ui.muted} style={{ margin: 0 }}>и</span>
      {fraction("num", "denom")}
    </div>
  );
}
