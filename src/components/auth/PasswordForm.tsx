"use client";

import { useState } from "react";
import ui from "@/components/student/ui.module.css";
import { useT } from "@/lib/i18n/client";

export function PasswordForm({ minLen }: { minLen: number }) {
  const t = useT();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (next.length < minLen) return setError(t("Новый пароль: не короче {n} символов", { n: minLen }));
    if (next !== again) return setError(t("Пароли не совпадают"));
    setState("busy");
    try {
      const res = await fetch("/api/auth/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current, next }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error ?? t("Не удалось сменить пароль")); setState("idle"); return; }
      setCurrent(""); setNext(""); setAgain("");
      setState("done");
    } catch {
      setError(t("Нет связи с сервером. Проверьте интернет и повторите."));
      setState("idle");
    }
  }

  const field = (id: string, label: string, value: string, set: (v: string) => void, auto: string) => (
    <label className={ui.field} htmlFor={id} style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", marginBottom: 4 }}>{label}</span>
      <input id={id} type="password" value={value} onChange={(e) => set(e.target.value)} autoComplete={auto} required
        style={{ width: "100%", minHeight: 48, padding: "8px 12px", fontSize: 16, borderRadius: 10, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)" }} />
    </label>
  );

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      {field("cur", t("Текущий пароль"), current, setCurrent, "current-password")}
      {field("new", t("Новый пароль"), next, setNext, "new-password")}
      {field("again", t("Повторите новый пароль"), again, setAgain, "new-password")}
      {error && <p role="alert" style={{ color: "var(--bad)" }}>{error}</p>}
      {state === "done" && <p role="status" style={{ color: "var(--ok)" }}>{t("Пароль изменён. На других устройствах войдите заново.")}</p>}
      <button type="submit" className={ui.btn} disabled={state === "busy"}>{state === "busy" ? t("Сохраняем…") : t("Сменить пароль")}</button>
    </form>
  );
}
