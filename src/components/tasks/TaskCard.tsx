"use client";

import { useState } from "react";
import type { PublicTask } from "@/lib/content/types";
import { RichText, renderRichInline } from "@/components/content/RichText";
import { useT } from "@/lib/i18n/client";
import ui from "@/components/student/ui.module.css";
import { AnswerInput, type AnswerDraft } from "./AnswerInput";
import { TaskContent } from "./TaskContent";

type Num = number | null;
const toNum = (s: string | undefined): Num => {
  if (s === undefined || s.trim() === "") return null;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : null;
};

/** Собирает JSON эталонной формы из "сырых" полей виджета — или null, если что-то не заполнено/не число. */
/** Разбивает «B A C» / «8 9 10» / «B, A; C» / «B>A>C» на элементы (запятая между цифрами = десятичная запятая). Та же логика, что splitItems на сервере. */
const splitItems = (raw: string): string[] =>
  raw
    .split(/[;\s>]+|,(?!\d)/)
    .map((x) => x.trim())
    .filter(Boolean);

function draftToAnswer(answerType: NonNullable<PublicTask["answerType"]>, draft: AnswerDraft): Record<string, unknown> | null {
  if (answerType === "sequence" || answerType === "set") {
    const items = splitItems(draft.text ?? "");
    return items.length === 0 ? null : { items };
  }
  if (answerType === "text") {
    const text = (draft.text ?? "").trim();
    return text === "" ? null : { text };
  }
  if (answerType === "integer" || answerType === "decimal") {
    const value = toNum(draft.value);
    return value === null ? null : { value };
  }
  if (answerType === "fraction") {
    const num = toNum(draft.num);
    const denom = toNum(draft.denom);
    return num === null || denom === null || denom === 0 ? null : { num, denom };
  }
  const whole = toNum(draft.whole);
  const num = toNum(draft.num);
  const denom = toNum(draft.denom);
  return whole === null || num === null || denom === null || denom === 0 ? null : { whole, num, denom };
}

export function TaskCard({
  index,
  task,
  solved,
  flagged = false,
  onSolved,
  onFlagChange,
}: {
  index: number;
  task: PublicTask;
  solved: boolean;
  flagged?: boolean;
  onSolved?: () => void;
  onFlagChange?: (flagged: boolean) => void;
}) {
  const t = useT();
  const [draft, setDraft] = useState<AnswerDraft>({});
  const [status, setStatus] = useState<"idle" | "checking" | "correct" | "wrong">(solved ? "correct" : "idle");
  const [error, setError] = useState("");
  const [solution, setSolution] = useState<{ solutionText: string; answer: string | null } | null>(null);
  const [solutionLoading, setSolutionLoading] = useState(false);
  // «Не смог решить»: отметка уходит админу на разбор при встрече
  const [flag, setFlag] = useState<"none" | "form" | "sending" | "sent">(flagged && !solved ? "sent" : "none");
  const [note, setNote] = useState("");
  const [flagError, setFlagError] = useState("");

  const canAnswer = task.type === "open" && !!task.answerType;

  async function submit() {
    if (!canAnswer) return;
    const answer = draftToAnswer(task.answerType!, draft);
    if (!answer) {
      setError(t("Заполните ответ полностью"));
      return;
    }
    setError("");
    setStatus("checking");
    try {
      const res = await fetch(`/api/tasks/${task.id}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? t("Не получилось проверить ответ"));
        setStatus("idle");
        return;
      }
      setStatus(data.correct ? "correct" : "wrong");
      if (data.correct) {
        setFlag("none"); // верное решение закрывает заявку на сервере
        onSolved?.();
        onFlagChange?.(false);
      }
    } catch {
      setError(t("Нет связи с сервером"));
      setStatus("idle");
    }
  }

  async function revealSolution() {
    if (solution || solutionLoading) return;
    setSolutionLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/solution`);
      const data = await res.json().catch(() => ({}));
      if (res.ok) setSolution(data);
    } finally {
      setSolutionLoading(false);
    }
  }

  async function sendHelp() {
    setFlag("sending");
    setFlagError("");
    try {
      const res = await fetch(`/api/tasks/${task.id}/help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw new Error();
      setFlag("sent");
      onFlagChange?.(true);
    } catch {
      setFlagError(t("Не получилось отправить, попробуйте ещё раз"));
      setFlag("form");
    }
  }

  async function cancelHelp() {
    setFlagError("");
    try {
      const res = await fetch(`/api/tasks/${task.id}/help`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setFlag("none");
      setNote("");
      onFlagChange?.(false);
    } catch {
      setFlagError(t("Не получилось снять отметку"));
    }
  }

  const hint: Record<NonNullable<PublicTask["answerType"]>, string> = {
    integer: t("Введите целое число"),
    decimal: t("Введите десятичную дробь (можно с запятой)"),
    fraction: t("Введите дробь: числитель и знаменатель"),
    mixed: t("Введите смешанное число: целая часть, числитель, знаменатель"),
    sequence: t("Введите ответ по порядку через пробел (например: B A C)"),
    set: t("Введите все подходящие числа через пробел (например: 5 6 7)"),
    text: t("Введите ответ выражением"),
  };

  const cardCls = [ui.taskCard, status === "correct" ? ui.taskCardOk : status === "wrong" ? ui.taskCardBad : ""].filter(Boolean).join(" ");

  return (
    <article className={cardCls}>
      <div className={ui.taskHead}>
        <span>{t("Задача {n}", { n: index })}</span>
        {status === "correct" && <span className={`${ui.badge} ${ui.badgeDone}`}>{t("Решена")}</span>}
      </div>

      <TaskContent question={task.question} figures={task.figures} />

      {canAnswer ? (
        <div className={ui.answerBlock}>
          <p className={ui.answerLabel}>{t("Ваш ответ")} · {hint[task.answerType!]}</p>
          <div className={ui.answerLine}>
            <AnswerInput
              answerType={task.answerType!}
              value={draft}
              onChange={(v) => {
                setDraft(v);
                if (status === "wrong") setStatus("idle");
                if (error) setError("");
              }}
              onSubmit={submit}
              disabled={status === "correct"}
              invalid={status === "wrong"}
            />
            {status !== "correct" && (
              <button className={ui.btn} onClick={submit} disabled={status === "checking"}>
                {status === "checking" ? t("Проверяем…") : t("Проверить")}
              </button>
            )}
          </div>
          <div className={ui.answerActions}>
            {status === "correct" && <span className={`${ui.feedback} ${ui.feedbackOk}`}>{t("✓ Верно! Отличная работа")}</span>}
            {status === "wrong" && <span className={`${ui.feedback} ${ui.feedbackBad}`}>{t("✗ Пока неверно — попробуйте ещё раз")}</span>}
            {error && <span className={`${ui.feedback} ${ui.feedbackErr}`}>{error}</span>}
          </div>
        </div>
      ) : (
        <p className={ui.muted}>{t("Тип ответа для этой задачи ещё не задан в контенте — проверить нельзя.")}</p>
      )}

      {solution ? (
        <div className={ui.solutionPanel}>
          {solution.answer && (
            <p>
              <strong>{t("Ответ")}:</strong> {renderRichInline(["integer", "decimal", "fraction", "mixed"].includes(task.answerType ?? "") && solution.answer.includes("/") ? `{${solution.answer}}` : solution.answer, "ans")}
            </p>
          )}
          {solution.solutionText && <RichText text={solution.solutionText} />}
        </div>
      ) : (
        <button className={ui.linkButton} onClick={revealSolution} disabled={solutionLoading}>
          {solutionLoading ? t("Загрузка…") : t("💡 Показать решение")}
        </button>
      )}

      {status !== "correct" && flag === "none" && (
        <button className={ui.linkButton} onClick={() => setFlag("form")}>
          {t("🙋 Не смог решить")}
        </button>
      )}
      {flag === "form" || flag === "sending" ? (
        <div className={ui.helpBox}>
          <strong>{t("Отправить задачу на разбор")}</strong>
          <p className={ui.muted}>{t("Преподаватель разберёт её с вами при встрече. Можно коротко написать, что не получилось.")}</p>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} placeholder={t("Что не получилось? (необязательно)")} aria-label={t("Что не получилось")} />
          <div className={ui.answerActions}>
            <button className={ui.btn} onClick={sendHelp} disabled={flag === "sending"}>
              {flag === "sending" ? t("Отправляем…") : t("Отправить")}
            </button>
            <button className={ui.linkButton} onClick={() => setFlag("none")} disabled={flag === "sending"}>{t("Отмена")}</button>
            {flagError && <span className={`${ui.feedback} ${ui.feedbackErr}`}>{flagError}</span>}
          </div>
        </div>
      ) : null}
      {flag === "sent" && (
        <p className={ui.helpFlag}>
          {t("✋ Отмечено — разберём на встрече.")}{" "}
          <button className={ui.linkButton} onClick={cancelHelp}>{t("Снять отметку")}</button>
          {flagError && <span className={`${ui.feedback} ${ui.feedbackErr}`}> {flagError}</span>}
        </p>
      )}
    </article>
  );
}
