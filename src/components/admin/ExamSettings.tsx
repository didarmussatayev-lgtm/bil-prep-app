"use client";
import { useCallback, useEffect, useState } from "react";
import { call, ConfirmDialog } from "./common";

type Exam = { id: string; key: string; title: string; date: string };

/** Даты экзаменов для обратного отсчёта у учеников + разовое начисление XP за прошлую работу. */
export function ExamSettings() {
  const [exams, setExams] = useState<Exam[] | null>(null);
  const [title, setTitle] = useState("БИЛ");
  const [key, setKey] = useState("bil");
  const [date, setDate] = useState("");
  const [msg, setMsg] = useState("");
  const [del, setDel] = useState<Exam | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => call("/api/admin/exams").then(setExams).catch(() => setExams([])), []);
  useEffect(() => { void load(); }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try { await call("/api/admin/exams", "PUT", { key: key.trim().toLowerCase(), title, date }); setDate(""); await load(); }
    catch (err) { setMsg((err as Error).message); }
  }
  async function backfill() {
    setBusy(true); setMsg("");
    try { const r = await call("/api/admin/gamification", "POST"); setMsg(`Готово: учеников ${r.students}, начислено записей XP ${r.xpRows}, достижений ${r.achievements}.`); }
    catch (err) { setMsg((err as Error).message); }
    setBusy(false);
  }

  return (
    <div className="card" style={{ marginTop: 18 }}>
      <b>⏳ Экзамены (обратный отсчёт у учеников)</b>
      {exams?.length === 0 && <p className="muted" style={{ margin: "6px 0" }}>Дат пока нет — отсчёт не показывается.</p>}
      {exams?.map((x) => (
        <div key={x.id} className="row" style={{ margin: "8px 0 0" }}>
          <span className="grow">{x.title} — {new Date(x.date).toLocaleDateString("ru-RU")}</span>
          <button className="sm danger" onClick={() => setDel(x)}>Удалить</button>
        </div>
      ))}
      <form onSubmit={save} className="row" style={{ margin: "10px 0 0" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название, например БИЛ" aria-label="Название экзамена" required style={{ width: 150 }} />
        <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="код" aria-label="Код экзамена (латиницей)" required style={{ width: 90 }} title="Код: bil, nis, rfmsh. Один код — одна дата." />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Дата экзамена" required />
        <button className="primary" type="submit">Сохранить</button>
      </form>
      <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "14px 0" }} />
      <b>🏆 Баллы за прошлое</b>
      <p className="muted" style={{ margin: "4px 0 8px", fontSize: 14 }}>Один раз после запуска геймификации: начислить XP и достижения за уже решённые задачи, темы и тесты. Повторный запуск безопасен, ученикам и Telegram ничего не отправляется.</p>
      <button className="sm" onClick={backfill} disabled={busy}>{busy ? "Считаем…" : "Начислить за прошлое"}</button>
      {msg && <p role="status" style={{ margin: "8px 0 0" }}>{msg}</p>}
      {del && <ConfirmDialog title={`Удалить дату «${del.title}»?`} text="Обратный отсчёт у учеников пропадёт." confirmLabel="Удалить"
        onCancel={() => setDel(null)} onConfirm={() => { const x = del; setDel(null); void call(`/api/admin/exams?key=${encodeURIComponent(x.key)}`, "DELETE").then(load); }} />}
    </div>
  );
}
