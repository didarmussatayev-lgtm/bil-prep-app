"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBooks } from "./books";
import { call, Pct } from "./common";
import { PdfButtons } from "./PdfButtons";
import { StudentPicker } from "./StudentPicker";

type Weak = { topicId: string; title: string; bookTitle: string; percent: number; testC: number; testT: number; prS: number; prA: number; students?: number; weakStudents?: number; help: number };
type Flag = { taskId: string; number: string | null; question: string; topic: string; bookTitle: string; students: number; open: number; test: number; practice: number };
export type Week = { week: string; tests: number; avgPercent: number | null; activeStudents: number; help: number; tasks: number; solved: number; learned: number };

const TABS = [["weak", "Слабые места"], ["tasks", "Сложные задачи"], ["weeks", "Динамика"]] as const;

export function WeakList({ rows, perStudent }: { rows: Weak[]; perStudent: boolean }) {
  if (!rows.length) return <p className="card muted">Слабых тем не найдено: данных пока мало или все темы выше порога.</p>;
  return (
    <div className="stack grid2">
      {rows.map((w) => (
        <div key={w.topicId} className="card">
          <div className="head" style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <b>{w.title}</b>
            <span className={`tag ${w.percent < 40 ? "bad" : "warn"}`}>{w.percent}%</span>
          </div>
          <Pct value={w.percent} />
          <div className="meta" style={{ marginTop: 6 }}>
            <span>{w.bookTitle}</span>
            {w.testT > 0 && <span>тесты {w.testC}/{w.testT}</span>}
            {w.prA > 0 && <span>задачи {w.prS}/{w.prA}</span>}
            {!perStudent && w.weakStudents !== undefined && <span>слабо у {w.weakStudents} из {w.students} уч.</span>}
            {w.help > 0 && <span className="tag bad">«не смог»: {w.help}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Reports() {
  const books = useBooks();
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("weak");
  const [book, setBook] = useState("");
  const [student, setStudent] = useState<{ id: string; login: string } | null>(null);
  const [days, setDays] = useState(0);
  // данные хранятся вместе с вкладкой, для которой загружены: при переключении старый ответ не подставляется в чужой отчёт
  const [loaded, setLoaded] = useState<{ tab: string; data: unknown } | null>(null);
  const data = loaded?.tab === tab ? loaded.data : null;
  const [error, setError] = useState("");

  useEffect(() => {
    setLoaded(null);
    const p = new URLSearchParams({ type: tab, book, userId: student?.id ?? "", days: String(days) });
    call(`/api/admin/reports?${p}`).then((d) => { setLoaded({ tab, data: d }); setError(""); }).catch((e) => setError(e.message));
  }, [tab, book, student, days]);

  return (
    <>
      <div className="card" style={{ marginBottom: 14 }}>
        <b>PDF-отчёт по ученику</b>
        <div className="row" style={{ margin: "8px 0 0" }}>
          <StudentPicker value={student} onChange={setStudent} />
        </div>
        {!student && <p className="muted" style={{ margin: "4px 0 0", fontSize: 14 }}>Выберите ученика, затем язык и скачайте PDF. Выбранный ученик также фильтрует отчёты ниже.</p>}
        <PdfButtons studentId={student?.id ?? null} />
      </div>
      <div className="subtabs" role="tablist">
        {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      <div className="row">
        {tab !== "weeks" && (
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Период">
            <option value={0}>За всё время</option>
            <option value={7}>Последние 7 дней</option>
            <option value={30}>Последние 30 дней</option>
            <option value={90}>Последние 90 дней</option>
          </select>
        )}
        <select value={book} onChange={(e) => setBook(e.target.value)} aria-label="Книга">
          <option value="">Все книги</option>{books.map((b) => <option key={b.key} value={b.key}>{b.title}</option>)}
        </select>
      </div>
      {error && <p className="err" role="alert">{error}</p>}
      {!data && !error && <p className="muted">Считаем…</p>}

      {data && tab === "weak" && (
        <>
          <p className="muted">Темы, где верных ответов меньше 60% (тесты и задачи закрепления вместе; нужно хотя бы несколько ответов).{student ? "" : " Сверху самые слабые у всех учеников."}</p>
          <WeakList rows={data as Weak[]} perStudent={!!student} />
          {days > 0 && <p className="muted" style={{ fontSize: 13 }}>За период в задачах закрепления считаются все попытки, а не задачи: так видно, как ученик решает сейчас, а не по итогам с начала занятий.</p>}
        </>
      )}
      {data && tab === "tasks" && (
        (data as Flag[]).length === 0 ? <p className="card muted">Заявок «Не смог решить» пока нет.</p> : (
          <div className="stack">
            <p className="muted" style={{ margin: 0 }}>Задачи, которые ученики отмечают чаще всего.</p>
            {(data as Flag[]).map((f) => (
              <div key={f.taskId} className="card">
                <div className="head" style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span className="muted">{f.topic}</span>
                  <span className="tag bad">{f.students} уч.</span>
                </div>
                <div>{f.number ? <b>№{f.number}. </b> : null}{f.question}</div>
                <div className="meta" style={{ marginTop: 4 }}>
                  <span>{f.bookTitle}</span><span>ждут разбора: {f.open}</span><span>тест {f.test} · закрепление {f.practice}</span>
                </div>
              </div>
            ))}
            <Link href="/admin/help">Перейти к разбору →</Link>
          </div>
        )
      )}
      {data && tab === "weeks" && <Weeks rows={(data as { rows: Week[] }).rows} logStart={(data as { logStart: string | null }).logStart} />}
    </>
  );
}

export function Weeks({ rows, logStart }: { rows: Week[]; logStart: string | null }) {
  const max = Math.max(1, ...rows.map((r) => r.tasks));
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
  return (
    <div className="stack">
      <p className="muted" style={{ margin: 0 }}>
        Последние 12 недель (с понедельника). Полоса — сколько задач закрепления проверено за неделю: тёмная часть верные, светлая неверные.
        {logStart ? ` Подробная история задач ведётся с ${new Date(logStart).toLocaleDateString("ru-RU")}, раньше — только тесты и изученные темы.` : " Подробная история задач начнёт копиться, когда ученики начнут решать."}
      </p>
      {rows.map((r) => (
        <div key={r.week} className="card">
          <div className="head" style={{ display: "flex", justifyContent: "space-between" }}><b>с {fmt(r.week)}</b><span className="muted">активных: {r.activeStudents}</span></div>
          <div className="bar stacked" aria-label={`Задач: ${r.tasks}, верных: ${r.solved}`}>
            <i style={{ width: `${(r.solved / max) * 100}%` }} />
            <i className="soft" style={{ width: `${((r.tasks - r.solved) / max) * 100}%` }} />
          </div>
          <div className="meta" style={{ marginTop: 6 }}>
            <span>задач: {r.tasks} (верных {r.solved})</span>
            <span>тем изучено: {r.learned}</span>
            <span>тестов: {r.tests}{r.avgPercent === null ? "" : ` · ср. ${r.avgPercent}%`}</span>
            <span>заявок: {r.help}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
