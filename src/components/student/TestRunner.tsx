"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { TaskContent } from "@/components/tasks/TaskContent";
import { RichText } from "@/components/content/RichText";
import type { PublicTask } from "@/lib/content/types";
import ui from "./ui.module.css";

const jsonHeaders = { "Content-Type": "application/json" };

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TestRunner({
  attemptId,
  questions,
  initialAnswers,
  deadlineAt,
  serverNow,
}: {
  attemptId: string;
  questions: PublicTask[];
  initialAnswers: Record<string, string>;
  deadlineAt: string | null;
  serverNow: string;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState(initialAnswers);
  const answersRef = useRef(initialAnswers);
  const chain = useRef<Promise<void>>(Promise.resolve());
  const finishing = useRef(false);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [left, setLeft] = useState<number | null>(null);

  // Ответы сохраняются последовательно, каждый раз отправляется полная карта — порядок не ломается.
  const persist = useCallback(() => {
    chain.current = chain.current.then(async () => {
      try {
        const res = await fetch(`/api/tests/attempts/${attemptId}`, {
          method: "PUT",
          headers: jsonHeaders,
          body: JSON.stringify({ answers: answersRef.current }),
        });
        if (res.status === 409) router.refresh(); // время вышло или тест уже завершён
        setSaveError(!res.ok && res.status !== 409);
      } catch {
        setSaveError(true);
      }
    });
    return chain.current;
  }, [attemptId, router]);

  function choose(taskId: string, key: string) {
    const next = { ...answersRef.current, [taskId]: key };
    answersRef.current = next;
    setAnswers(next);
    void persist();
  }

  const finish = useCallback(async () => {
    if (finishing.current) return;
    finishing.current = true;
    setBusy(true);
    setFinishError(null);
    await chain.current;
    try {
      const res = await fetch(`/api/tests/attempts/${attemptId}/finish`, { method: "POST" });
      if (!res.ok && res.status !== 409) throw new Error();
      router.refresh(); // страница увидит finishedAt и покажет результат
    } catch {
      finishing.current = false;
      setBusy(false);
      setFinishError("Не удалось завершить тест. Ответы сохранены — повторите попытку.");
    }
  }, [attemptId, router]);

  // Таймер. Считаем по времени сервера (поправка на часы устройства).
  useEffect(() => {
    if (!deadlineAt) return;
    const offset = new Date(serverNow).getTime() - Date.now();
    const end = new Date(deadlineAt).getTime();
    const tick = () => {
      const ms = end - (Date.now() + offset);
      setLeft(Math.max(0, Math.ceil(ms / 1000)));
      if (ms <= 0) void finish();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadlineAt, serverNow, finish]);

  const answered = Object.keys(answers).length;
  const unanswered = questions.length - answered;

  function onFinishClick() {
    if (unanswered > 0 && !window.confirm(`Без ответа осталось вопросов: ${unanswered}. Завершить тест?`)) return;
    void finish();
  }

  return (
    <div>
      <div className={ui.testBar}>
        <span className={ui.testBarInfo}>Отвечено: {answered} из {questions.length}</span>
        {left !== null && (
          <span className={`${ui.timer} ${left <= 300 ? ui.timerLow : ""}`} aria-label="Осталось времени">
            {fmt(left)}
          </span>
        )}
        <button className={ui.btn} onClick={onFinishClick} disabled={busy}>
          {busy ? "Считаем…" : "Завершить тест"}
        </button>
      </div>

      {saveError && (
        <p className={ui.error} role="alert">
          Ответы не сохраняются — проверьте соединение. Выбранное ещё раз отправится при следующем выборе.
        </p>
      )}
      {finishError && <p className={ui.error} role="alert">{finishError}</p>}

      {questions.map((q, i) => (
        <fieldset key={q.id} className={ui.question}>
          <legend className={ui.questionNum}>Вопрос {i + 1}</legend>
          <TaskContent question={q.question} figures={q.figures} />
          <div className={ui.options}>
            {(q.options ?? []).map((o) => (
              <label key={o.key} className={ui.option}>
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === o.key}
                  onChange={() => choose(q.id, o.key)}
                />
                <span>
                  <span className={ui.optKey}>{o.key}.</span>
                  <RichText text={o.text} />
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
