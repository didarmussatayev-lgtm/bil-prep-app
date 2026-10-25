"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/client";
import ui from "@/components/student/ui.module.css";

export type HelpSource = { source: "practice" } | { source: "test"; attemptId: string };

/**
 * «Не смог решить»: отметка уходит админу на разбор при встрече.
 * Общая для закрепления (TaskCard) и тестов (TestRunner, TestResult).
 */
export function HelpFlag({
  taskId,
  from,
  initiallyFlagged = false,
  hidden = false,
  onChange,
}: {
  taskId: string;
  from: HelpSource;
  initiallyFlagged?: boolean;
  hidden?: boolean; // например, задача уже решена: кнопку не показываем
  onChange?: (flagged: boolean) => void;
}) {
  const t = useT();
  const [flag, setFlag] = useState<"none" | "form" | "sending" | "sent">(initiallyFlagged ? "sent" : "none");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function send() {
    setFlag("sending");
    setError("");
    try {
      const res = await fetch(`/api/tasks/${taskId}/help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, ...from }),
      });
      if (!res.ok) throw new Error();
      setFlag("sent");
      onChange?.(true);
    } catch {
      setError(t("Не получилось отправить, попробуйте ещё раз"));
      setFlag("form");
    }
  }

  async function cancel() {
    setError("");
    try {
      const res = await fetch(`/api/tasks/${taskId}/help`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setFlag("none");
      setNote("");
      onChange?.(false);
    } catch {
      setError(t("Не получилось снять отметку"));
    }
  }

  if (hidden) return null;
  return (
    <>
      {flag === "none" && (
        <button type="button" className={ui.linkButton} onClick={() => setFlag("form")}>
          {t("🙋 Не смог решить")}
        </button>
      )}
      {(flag === "form" || flag === "sending") && (
        <div className={ui.helpBox}>
          <strong>{t("Отправить задачу на разбор")}</strong>
          <p className={ui.muted}>{t("Преподаватель разберёт её с вами при встрече. Можно коротко написать, что не получилось.")}</p>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} placeholder={t("Что не получилось? (необязательно)")} aria-label={t("Что не получилось")} />
          <div className={ui.answerActions}>
            <button type="button" className={ui.btn} onClick={send} disabled={flag === "sending"}>
              {flag === "sending" ? t("Отправляем…") : t("Отправить")}
            </button>
            <button type="button" className={ui.linkButton} onClick={() => setFlag("none")} disabled={flag === "sending"}>{t("Отмена")}</button>
            {error && <span className={`${ui.feedback} ${ui.feedbackErr}`}>{error}</span>}
          </div>
        </div>
      )}
      {flag === "sent" && (
        <p className={ui.helpFlag}>
          {t("✋ Отмечено — разберём на встрече.")}{" "}
          <button type="button" className={ui.linkButton} onClick={cancel}>{t("Снять отметку")}</button>
          {error && <span className={`${ui.feedback} ${ui.feedbackErr}`}> {error}</span>}
        </p>
      )}
    </>
  );
}
