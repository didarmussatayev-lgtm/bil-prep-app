"use client";
import { useEffect, useState } from "react";
import { call } from "./common";

/** Статус уведомлений в Telegram и кнопка «Проверить» (после смены токена или chat id). */
export function TelegramStatus() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { call("/api/admin/telegram").then((d) => setConfigured(d.configured)).catch(() => setConfigured(false)); }, []);
  if (configured === null) return null;
  async function test() {
    setBusy(true); setMsg("");
    try { await call("/api/admin/telegram", "POST"); setMsg("Сообщение отправлено — проверьте Telegram."); }
    catch (e) { setMsg(`Не получилось: ${(e as Error).message}`); }
    setBusy(false);
  }
  return (
    <div className="card" style={{ marginTop: 18 }}>
      <b>🔔 Уведомления в Telegram: {configured ? <span className="ok">подключены</span> : <span className="err">не настроены</span>}</b>
      <p className="muted" style={{ margin: "4px 0 8px", fontSize: 14 }}>
        {configured ? "Новые заявки «Не смог решить» приходят в чат (несколько подряд от одного ученика — одним сообщением)." : "Задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в переменных окружения Railway."}
      </p>
      {configured && <button className="sm" onClick={test} disabled={busy}>{busy ? "Отправляем…" : "Отправить тестовое сообщение"}</button>}
      {msg && <p role="status" style={{ margin: "8px 0 0" }}>{msg}</p>}
    </div>
  );
}
