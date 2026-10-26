"use client";

import Link from "next/link";
import { useState } from "react";
import { refreshGamification } from "./GamificationHost";
import { useT } from "@/lib/i18n/client";
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
  const t = useT();
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
      refreshGamification();
    } catch {
      setError(t("Не удалось сохранить. Проверьте соединение и повторите."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={ui.lessonFooter}>
      {learned ? (
        <strong>{t("Тема изучена")}</strong>
      ) : (
        <>
          <strong>{t("Дочитали до конца?")}</strong>
          <p className={ui.muted}>{t("Отметьте тему изученной — она появится в вашем прогрессе.")}</p>
        </>
      )}

      <div className={ui.actions}>
        {!learned && (
          <button className={ui.btn} onClick={mark} disabled={busy}>
            {busy ? t("Сохраняем…") : t("Отметить изученной")}
          </button>
        )}
        {learned && (
          <Link href={practiceHref} className={ui.btn}>{t("Закрепить тему")}</Link>
        )}
        {learned && nextHref && (
          <Link href={nextHref} className={ui.btnGhost}>{t("Следующая тема")}</Link>
        )}
      </div>
      {error && <p className={ui.error} role="alert">{error}</p>}
    </div>
  );
}
