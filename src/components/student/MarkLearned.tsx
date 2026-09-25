"use client";

import Link from "next/link";
import { useState } from "react";
import ui from "./ui.module.css";

export function MarkLearned({
  topicId,
  initiallyLearned,
  practiceHref,
  nextHref,
}: {
  topicId: string;
  initiallyLearned: boolean;
  practiceHref: string;
  nextHref: string | null;
}) {
  const [learned, setLearned] = useState(initiallyLearned);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mark() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/topics/${topicId}/learned`, { method: "POST" });
      if (!res.ok) throw new Error();
      setLearned(true);
    } catch {
      setError("Не удалось сохранить. Проверьте соединение и повторите.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={ui.lessonFooter}>
      {learned ? (
        <strong>Тема изучена</strong>
      ) : (
        <>
          <strong>Дочитали до конца?</strong>
          <p className={ui.muted}>Отметьте тему изученной — она появится в вашем прогрессе.</p>
        </>
      )}

      <div className={ui.actions}>
        {!learned && (
          <button className={ui.btn} onClick={mark} disabled={busy}>
            {busy ? "Сохраняем…" : "Отметить изученной"}
          </button>
        )}
        {learned && (
          <Link href={practiceHref} className={ui.btn}>Закрепить тему</Link>
        )}
        {learned && nextHref && (
          <Link href={nextHref} className={ui.btnGhost}>Следующая тема</Link>
        )}
      </div>
      {error && <p className={ui.error} role="alert">{error}</p>}
    </div>
  );
}
