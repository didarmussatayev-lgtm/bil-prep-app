"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { call } from "./common";

type Paper = { id: string; slug: string; title: string; group: string; year: number | null; hidden: boolean; subject: string; minutes: number | null; questions: number; attempts: number; avgScore: number | null };

/** Пробные варианты: загрузка из файлов репозитория, скрыть/показать, время экзамена. */
export function PapersAdmin() {
  const [rows, setRows] = useState<Paper[] | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => call("/api/admin/papers").then(setRows).catch((e) => setMsg(e.message)), []);
  useEffect(() => { void load(); }, [load]);

  async function importAll() {
    setBusy(true); setMsg("");
    try {
      const r: { subject: string; papers: number; questions: number; problems: string[] }[] = await call("/api/admin/papers/import", "POST");
      setMsg(r.length ? r.map((x) => `${x.subject}: вариантов ${x.papers}, вопросов ${x.questions}${x.problems.length ? `, проблем ${x.problems.length}: ${x.problems.slice(0, 3).join("; ")}` : ""}`).join(" · ") : "Файлов для загрузки не найдено.");
      await load();
    } catch (e) { setMsg((e as Error).message); }
    setBusy(false);
  }
  async function patch(id: string, body: object) {
    try { await call(`/api/admin/papers/${id}`, "PATCH", body); await load(); } catch (e) { setMsg((e as Error).message); }
  }

  return (
    <>
      <p style={{ margin: "0 0 8px" }}><Link href="/admin/content">← Контент</Link></p>
      <h1>Пробные варианты</h1>
      <p className="muted">Тренировочные и прошлогодние варианты: фиксированные вопросы, таймер, общий балл. Файлы лежат в репозитории (`data/exams`, `public/exams`), кнопка ниже загружает или обновляет их. Скрытие варианта при повторной загрузке сохраняется.</p>
      <div className="row"><button className="primary" onClick={importAll} disabled={busy}>{busy ? "Загружаем…" : "Загрузить варианты из файлов"}</button></div>
      {msg && <p role="status">{msg}</p>}
      {rows?.length === 0 && <p className="card muted">Вариантов пока нет. Нажмите «Загрузить варианты из файлов».</p>}
      <div className="stack grid2">
        {rows?.map((p) => (
          <div key={p.id} className="card" style={{ opacity: p.hidden ? 0.65 : 1 }}>
            <div className="head" style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <b>{p.subject}: {p.title}{p.year ? ` · ${p.year}` : ""}</b>
              <span className="tag">{p.group === "past" ? "прошлогодний" : "тренировочный"}</span>
            </div>
            <div className="meta" style={{ margin: "4px 0 8px" }}>
              <span>вопросов {p.questions}</span>
              <span>пройден {p.attempts} раз{p.avgScore !== null ? `, средний балл ${Math.round(p.avgScore)}` : ""}</span>
              {p.hidden && <span className="tag warn">скрыт</span>}
            </div>
            <div className="row" style={{ margin: 0 }}>
              <label style={{ margin: 0 }} htmlFor={`min-${p.id}`}>Время, мин:</label>
              <input id={`min-${p.id}`} type="number" min={5} max={600} defaultValue={p.minutes ?? ""} placeholder="без таймера" style={{ width: 110 }}
                onBlur={(e) => { const v = e.target.value.trim(); const n = v === "" ? null : Number(v); if (n !== p.minutes) void patch(p.id, { minutes: n }); }} />
              <button className="sm" onClick={() => patch(p.id, { hidden: !p.hidden })}>{p.hidden ? "Показать" : "Скрыть"}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
