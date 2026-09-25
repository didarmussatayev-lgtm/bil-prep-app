"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ui from "./ui.module.css";

export function StartTestButton({
  subject,
  scope,
  sectionId,
  topicId,
  label,
  disabled,
}: {
  subject: string;
  scope: "topic" | "section" | "full";
  sectionId?: string;
  topicId?: string;
  label: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/tests/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, scope, sectionId, topicId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Не удалось начать тест");
        setBusy(false);
        return;
      }
      router.push(`/bil/${subject}/test/${data.id}`);
    } catch {
      setError("Нет связи с сервером. Повторите позже.");
      setBusy(false);
    }
  }

  return (
    <div>
      <button className={ui.btn} onClick={start} disabled={disabled || busy}>
        {busy ? "Готовим вопросы…" : label}
      </button>
      {error && <p className={ui.error} role="alert">{error}</p>}
    </div>
  );
}
