"use client";

import { useState } from "react";
import type { PublicTask } from "@/lib/content/types";
import { RichText } from "@/components/content/RichText";
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
function draftToAnswer(answerType: NonNullable<PublicTask["answerType"]>, draft: AnswerDraft): Record<string, number> | null {
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

export function TaskCard({ index, task, solved }: { index: number; task: PublicTask; solved: boolean }) {
  const [draft, setDraft] = useState<AnswerDraft>({});
  const [status, setStatus] = useState<"idle" | "checking" | "correct" | "wrong">(solved ? "correct" : "idle");
  const [error, setError] = useState("");
  const [solution, setSolution] = useState<{ solutionText: string; answer: string | null } | null>(null);
  const [solutionLoading, setSolutionLoading] = useState(false);

  const canAnswer = task.type === "open" && !!task.answerType;

  async function submit() {
    if (!canAnswer) return;
    const answer = draftToAnswer(task.answerType!, draft);
    if (!answer) {
      setError("Заполните ответ полностью");
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
        setError(data.error ?? "Не получилось проверить ответ");
        setStatus("idle");
        return;
      }
      setStatus(data.correct ? "correct" : "wrong");
    } catch {
      setError("Нет связи с сервером");
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

  return (
    <article className={ui.taskCard}>
      <div className={ui.taskHead}>
        <span>Задача {index}</span>
        {status === "correct" && <span className={`${ui.badge} ${ui.badgeDone}`}>Решена</span>}
      </div>

      <TaskContent question={task.question} figures={task.figures} />

      {canAnswer ? (
        <div className={ui.answerBlock}>
          <AnswerInput answerType={task.answerType!} value={draft} onChange={setDraft} disabled={status === "correct"} />
          {error && <p className={ui.error}>{error}</p>}
          {status === "wrong" && <p className={ui.error}>Неверно, попробуйте ещё раз.</p>}
          {status === "correct" && <p className={ui.okMsg}>Верно!</p>}
          {status !== "correct" && (
            <button className={ui.btnGhost} onClick={submit} disabled={status === "checking"}>
              {status === "checking" ? "Проверяем…" : "Проверить"}
            </button>
          )}
        </div>
      ) : (
        <p className={ui.muted}>Тип ответа для этой задачи ещё не задан в контенте — проверить нельзя.</p>
      )}

      {solution ? (
        <div className={ui.solution}>
          {solution.answer && (
            <p>
              <strong>Ответ:</strong> {solution.answer}
            </p>
          )}
          {solution.solutionText && <RichText text={solution.solutionText} />}
        </div>
      ) : (
        <button className={ui.linkButton} onClick={revealSolution} disabled={solutionLoading}>
          {solutionLoading ? "Загрузка…" : "Показать решение"}
        </button>
      )}
    </article>
  );
}
