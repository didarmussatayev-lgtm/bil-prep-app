"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/lib/i18n/client";
import ui from "./ui.module.css";

/** Запуск пробного варианта: «Экзамен» (с таймером) или «Тренировка» (без таймера). */
export function StartPaperButtons({ subject, paperId, timed }: { subject: string; paperId: string; timed: boolean }) {
  const router = useRouter();
  const t = useT();
  const [busy, setBusy] = useState<"exam" | "practice" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function start(mode: "exam" | "practice") {
    setBusy(mode);
    setError(null);
    try {
      const res = await fetch("/api/tests/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, scope: "paper", paperId, mode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error ?? t("Не удалось начать тест")); setBusy(null); return; }
      router.push(`/bil/${subject}/test/${data.id}`);
    } catch {
      setError(t("Нет связи с сервером. Повторите позже."));
      setBusy(null);
    }
  }

  return (
    <div>
      <div className={ui.actions}>
        {timed && <button className={ui.btn} onClick={() => start("exam")} disabled={!!busy}>{busy === "exam" ? t("Готовим вопросы…") : t("Начать экзамен")}</button>}
        <button className={timed ? ui.btnGhost : ui.btn} onClick={() => start("practice")} disabled={!!busy}>{busy === "practice" ? t("Готовим вопросы…") : t("Тренировка без таймера")}</button>
      </div>
      {error && <p className={ui.error} role="alert">{error}</p>}
    </div>
  );
}
