"use client";

import { useRef } from "react";
import ui from "@/components/student/ui.module.css";
import { useT } from "@/lib/i18n/client";

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
  answerType: "integer" | "decimal" | "fraction" | "mixed" | "sequence" | "set" | "text";
  value: AnswerDraft;
  onChange: (v: AnswerDraft) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const t = useT();
  // На телефонах цифровая клавиатура часто без «−» (iOS): отдельная кнопка меняет знак у поля, где стоит курсор.
  const focusKey = useRef<string>("");
  const numeric = answerType === "integer" || answerType === "decimal" || answerType === "fraction" || answerType === "mixed";
  const firstKey = answerType === "integer" || answerType === "decimal" ? "value" : answerType === "fraction" ? "num" : "whole";
  const toggleMinus = () => {
    const key = focusKey.current || firstKey;
    const cur = (value[key] ?? "").replace(/[−–—]/g, "-");
    onChange({ ...value, [key]: cur.startsWith("-") ? cur.slice(1) : "-" + cur });
  };
  const field = (key: string, label: string, opts: { mode?: "numeric" | "decimal"; cls?: string; autoFocus?: boolean } = {}) => (
    <input
      key={key}
      className={[ui.answerBox, opts.cls, invalid ? ui.answerBoxBad : ""].filter(Boolean).join(" ")}
      inputMode={opts.mode ?? (answerType === "sequence" || answerType === "set" || answerType === "text" ? "text" : "numeric")}
      autoComplete="off"
      value={value[key] ?? ""}
      onFocus={() => (focusKey.current = key)}
      onChange={(e) => onChange({ ...value, [key]: e.target.value.replace(/[−–—]/g, "-") })}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit?.();
      }}
      disabled={disabled}
      aria-label={t(label)}
      title={t(label)}
    />
  );

  const fraction = (
    <div className={ui.fractionInput}>
      {field("num", "Числитель")}
      <div className={ui.fractionBar} />
      {field("denom", "Знаменатель")}
    </div>
  );

  // Порядок / набор / короткий текст — одно широкое поле (разбор в TaskCard.draftToAnswer).
  if (answerType === "sequence" || answerType === "set" || answerType === "text")
    return (
      <div className={ui.answerRow}>
        {field("text", answerType === "text" ? "Ответ (выражение)" : answerType === "set" ? "Ответ (числа через пробел)" : "Ответ (по порядку через пробел)", {
          mode: undefined,
          cls: ui.answerBoxWide,
        })}
      </div>
    );

  const minusBtn = numeric && (
    <button type="button" className={ui.minusBtn} onMouseDown={(e) => e.preventDefault()} onClick={toggleMinus} disabled={disabled} aria-label={t("Поставить или убрать минус")} title={t("Минус")}>
      −
    </button>
  );

  if (answerType === "integer") return <div className={ui.answerRow}>{field("value", "Ответ")}{minusBtn}</div>;
  if (answerType === "decimal")
    return <div className={ui.answerRow}>{field("value", "Ответ (десятичная дробь)", { mode: "decimal", cls: ui.answerBoxWide })}{minusBtn}</div>;
  if (answerType === "fraction") return <div className={ui.answerRow}>{minusBtn}{fraction}</div>;

  return (
    <div className={ui.answerRow}>
      {minusBtn}
      {field("whole", "Целая часть", { cls: ui.answerBoxWhole })}
      {fraction}
    </div>
  );
}
