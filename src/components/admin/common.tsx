"use client";
import { useEffect, useRef } from "react";

/** fetch к админскому API: JSON туда и обратно, при ошибке бросает Error с текстом сервера. */
export async function call(url: string, method = "GET", body?: unknown) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(typeof data.error === "string" ? data.error : "Ошибка запроса");
  return data;
}

const DAY = 86_400_000;
/** «сегодня», «вчера», «5 дн. назад», «не заходил» — для карточек на телефоне. */
export function ago(iso: string | null | undefined): string {
  if (!iso) return "не заходил";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / DAY);
  if (days <= 0) return "сегодня";
  if (days === 1) return "вчера";
  return `${days} дн. назад`;
}
export const fmtDateTime = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";

export function Pct({ value }: { value: number }) {
  return (
    <div className="pct" title={`${value}%`}>
      <div className="bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${value}%` }} /></div>
      <span>{value}%</span>
    </div>
  );
}

/** Подтверждение опасных действий: на телефоне — «шторка» снизу, на компьютере — по центру. */
export function ConfirmDialog({ title, text, confirmLabel, onConfirm, onCancel }: {
  title: string; text: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onCancel]);
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="dialog" role="alertdialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <p className="muted">{text}</p>
        <div className="row">
          <button ref={ref} onClick={onCancel}>Отмена</button>
          <button className="danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
