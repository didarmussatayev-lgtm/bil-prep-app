"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RichText } from "@/components/content/RichText";
import { TaskContent } from "@/components/tasks/TaskContent";
import { parseFigures, parseOptions } from "@/lib/content/types";
import { useBooks } from "./books";
import { call, fmtDateTime } from "./common";

type Row = {
  id: string; note: string | null; source: "practice" | "test"; status: "open" | "resolved"; autoResolved: boolean; createdAt: string;
  user: { id: string; login: string };
  task: {
    id: string; number: string | null; question: string; type: "open" | "test_choice"; answerType: string | null; correctAnswerJson: any;
    options: unknown; correctOption: string | null; solutionText: string | null; imageParamsJson: unknown;
    topic: { id: string; title: string; section: { title: string; level: number; subjectId: string } };
  };
};

/** Эталонный ответ — админу, чтобы быстро свериться при разборе. */
function answerText(t: Row["task"]): string {
  const a = t.correctAnswerJson;
  if (t.type === "test_choice") return t.correctOption ?? "—";
  if (!a) return "—";
  switch (t.answerType) {
    case "integer": case "decimal": return String(a.value).replace(".", ",");
    case "fraction": return `${a.num}/${a.denom}`;
    case "mixed": return `${a.whole} ${a.num}/${a.denom}`;
    case "sequence": return (a.items ?? []).join(" ");
    case "set": return (a.items ?? []).join(", ");
    case "text": return String(a.text ?? "");
    default: return "—";
  }
}

function Request({ r, picked, toggle, showUser, showTopic }: { r: Row; picked: boolean; toggle: () => void; showUser: boolean; showTopic: boolean }) {
  const options = r.task.type === "test_choice" ? parseOptions(r.task.options) : [];
  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 12, display: "flex", gap: 12 }}>
      <input type="checkbox" aria-label="Выбрать заявку" checked={picked} onChange={toggle} style={{ marginTop: 2 }} />
      <div className="grow" style={{ minWidth: 0 }}>
        <div className="meta" style={{ marginBottom: 4 }}>
          {showUser && <Link href={`/admin/students/${r.user.id}`}><b>{r.user.login}</b></Link>}
          {showTopic && <span>{r.task.topic.title}</span>}
          <span className="tag">{r.source === "test" ? "Тест" : "Закрепление"}</span>
          <span>{fmtDateTime(r.createdAt)}</span>
          {r.status === "resolved" && <span className="tag good">{r.autoResolved ? "решил сам" : "разобрано"}</span>}
        </div>
        {r.task.number && <b>№{r.task.number}</b>}
        <TaskContent question={r.task.question} figures={parseFigures(r.task.imageParamsJson)} />
        {r.note && <p className="card" style={{ margin: "8px 0", padding: "8px 12px" }}><span className="muted">Ученик пишет: </span>{r.note}</p>}
        <details style={{ marginTop: 6 }}>
          <summary style={{ cursor: "pointer", minHeight: 32 }}>Ответ и решение: <b>{answerText(r.task)}</b></summary>
          {options.length > 0 && (
            <ul style={{ margin: "8px 0", paddingLeft: 0, listStyle: "none" }}>
              {options.map((o) => (
                <li key={o.key} className={o.key === r.task.correctOption ? "ok" : ""}><b>{o.key}.</b> <RichText text={o.text} /></li>
              ))}
            </ul>
          )}
          {r.task.solutionText ? <RichText text={r.task.solutionText} /> : <p className="muted">Решение для этой задачи не заполнено.</p>}
        </details>
      </div>
    </div>
  );
}

export function HelpTriage() {
  const books = useBooks();
  const [status, setStatus] = useState<"open" | "resolved" | "all">("open");
  const [view, setView] = useState<"student" | "topic">("student");
  const [source, setSource] = useState("");
  const [book, setBook] = useState("");
  const [student, setStudent] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => call(`/api/admin/help?status=${status}`).then((d) => { setRows(d); setPicked([]); setError(""); }).catch((e) => setError(e.message)), [status]);
  useEffect(() => { void load(); }, [load]);

  async function setMany(ids: string[], s: "open" | "resolved") {
    try { await call("/api/admin/help", "PATCH", { ids, status: s }); await load(); } catch (e) { setError((e as Error).message); }
  }

  const students = useMemo(() => [...new Map((rows ?? []).map((r) => [r.user.id, r.user.login]))].sort((a, b) => a[1].localeCompare(b[1])), [rows]);
  const shown = (rows ?? []).filter(
    (r) => (!source || r.source === source) && (!student || r.user.id === student) && (!book || `${r.task.topic.section.subjectId}:${r.task.topic.section.level}` === book),
  );
  const groups = useMemo(() => {
    const m = new Map<string, { key: string; title: string; href?: string; rows: Row[] }>();
    for (const r of shown) {
      const k = view === "student" ? r.user.id : r.task.topic.id;
      const g = m.get(k) ?? { key: k, title: view === "student" ? r.user.login : r.task.topic.title, href: view === "student" ? `/admin/students/${r.user.id}` : undefined, rows: [] };
      g.rows.push(r);
      m.set(k, g);
    }
    return [...m.values()].sort((a, b) => b.rows.length - a.rows.length);
  }, [shown, view]);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const openIds = (rs: Row[]) => rs.filter((r) => r.status === "open").map((r) => r.id);

  return (
    <>
      <h1>Разбор заявок</h1>
      {error && <p className="err" role="alert">{error}</p>}
      <div className="seg" role="tablist" style={{ marginBottom: 10 }}>
        {([["open", "Ждут разбора"], ["resolved", "Разобранные"], ["all", "Все"]] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={status === k} className={status === k ? "on" : ""} onClick={() => setStatus(k)}>{l}</button>
        ))}
      </div>
      <div className="seg" role="tablist" style={{ marginBottom: 10 }}>
        <button role="tab" aria-selected={view === "student"} className={view === "student" ? "on" : ""} onClick={() => setView("student")}>По ученикам</button>
        <button role="tab" aria-selected={view === "topic"} className={view === "topic" ? "on" : ""} onClick={() => setView("topic")}>По темам</button>
      </div>
      <div className="filters">
        <select value={source} onChange={(e) => setSource(e.target.value)} aria-label="Источник">
          <option value="">Закрепление и тесты</option><option value="practice">Только закрепление</option><option value="test">Только тесты</option>
        </select>
        <select value={book} onChange={(e) => setBook(e.target.value)} aria-label="Книга">
          <option value="">Все книги</option>{books.map((b) => <option key={b.key} value={b.key}>{b.title}</option>)}
        </select>
        <select value={student} onChange={(e) => setStudent(e.target.value)} aria-label="Ученик">
          <option value="">Все ученики</option>{students.map(([id, login]) => <option key={id} value={id}>{login}</option>)}
        </select>
      </div>

      {rows === null && !error && <p className="muted">Загрузка…</p>}
      {rows && <p className="muted">Заявок: {shown.length}</p>}
      <div className="stack">
        {groups.map((g) => {
          const ids = openIds(g.rows);
          return (
            <section key={g.key} className="card" aria-label={g.title}>
              <div className="row" style={{ marginBottom: 0 }}>
                <h2 style={{ margin: 0 }} className="grow">{g.href ? <Link href={g.href}>{g.title}</Link> : g.title} <span className="muted" style={{ fontWeight: 400 }}>· {g.rows.length}</span></h2>
                {ids.length > 0 && <button className="sm primary" onClick={() => setMany(ids, "resolved")}>Всё разобрано ({ids.length})</button>}
              </div>
              {g.rows.map((r) => (
                <Request key={r.id} r={r} picked={picked.includes(r.id)} toggle={() => toggle(r.id)} showUser={view === "topic"} showTopic={view === "student"} />
              ))}
            </section>
          );
        })}
      </div>
      {rows && shown.length === 0 && <p className="card muted">{status === "open" ? "Нерешённых заявок нет 🎉" : "Ничего не найдено."}</p>}

      {picked.length > 0 && (
        <div className="card bulk" role="region" aria-label="Массовые действия">
          <b>Выбрано: {picked.length}</b>
          <div className="row" style={{ margin: "8px 0 0" }}>
            <button className="primary" onClick={() => setMany(picked, "resolved")}>Разобрано</button>
            <button onClick={() => setMany(picked, "open")}>Вернуть в работу</button>
            <button onClick={() => setPicked([])}>Снять выбор</button>
          </div>
        </div>
      )}
    </>
  );
}
