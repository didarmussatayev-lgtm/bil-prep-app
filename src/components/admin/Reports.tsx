"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBooks } from "./books";
import { call, Pct } from "./common";
import { StudentPicker } from "./StudentPicker";

type Weak = { topicId: string; title: string; bookTitle: string; percent: number; testC: number; testT: number; prS: number; prA: number; students?: number; weakStudents?: number; help: number };
type Flag = { taskId: string; number: string | null; question: string; topic: string; bookTitle: string; students: number; open: number; test: number; practice: number };
type Week = { week: string; tests: number; avgPercent: number | null; activeStudents: number; help: number };

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
  const [data, setData] = useState<unknown[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setData(null);
    const p = new URLSearchParams({ type: tab, book, userId: student?.id ?? "" });
    call(`/api/admin/reports?${p}`).then((d) => { setData(d); setError(""); }).catch((e) => setError(e.message));
  }, [tab, book, student]);

  return (
    <>
      <div className="subtabs" role="tablist">
        {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      <div className="row">
        <select value={book} onChange={(e) => setBook(e.target.value)} aria-label="Книга">
          <option value="">Все книги</option>{books.map((b) => <option key={b.key} value={b.key}>{b.title}</option>)}
        </select>
        <StudentPicker value={student} onChange={setStudent} />
      </div>
      {error && <p className="err" role="alert">{error}</p>}
      {!data && !error && <p className="muted">Считаем…</p>}

      {data && tab === "weak" && (
        <>
          <p className="muted">Темы, где верных ответов меньше 60% (тесты и задачи закрепления вместе; нужно хотя бы несколько ответов).{student ? "" : " Сверху самые слабые у всех учеников."}</p>
          <WeakList rows={data as Weak[]} perStudent={!!student} />
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
      {data && tab === "weeks" && <Weeks rows={data as Week[]} />}
    </>
  );
}

function Weeks({ rows }: { rows: Week[] }) {
  const max = Math.max(1, ...rows.map((r) => r.activeStudents));
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
  return (
    <div className="stack">
      <p className="muted" style={{ margin: 0 }}>Последние 8 недель (с понедельника). Фильтр по книге учитывает только тесты по теме и разделу.</p>
      {rows.map((r) => (
        <div key={r.week} className="card">
          <div className="head" style={{ display: "flex", justifyContent: "space-between" }}><b>с {fmt(r.week)}</b><span className="muted">активных: {r.activeStudents}</span></div>
          <div className="bar" aria-hidden="true"><i style={{ width: `${(r.activeStudents / max) * 100}%` }} /></div>
          <div className="meta" style={{ marginTop: 6 }}>
            <span>тестов: {r.tests}</span>
            <span>средний балл: {r.avgPercent === null ? "—" : `${r.avgPercent}%`}</span>
            <span>заявок: {r.help}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
