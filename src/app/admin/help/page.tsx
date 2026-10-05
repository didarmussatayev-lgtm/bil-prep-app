"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Row = {
  id: string;
  note: string | null;
  status: "open" | "resolved";
  autoResolved: boolean;
  createdAt: string;
  resolvedAt: string | null;
  user: { id: string; login: string };
  task: {
    id: string;
    number: string | null;
    question: string;
    answerType: string | null;
    correctAnswerJson: any;
    topic: { title: string; section: { title: string; level: number } };
  };
};

async function call(url: string, method = "GET", body?: unknown) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(typeof data.error === "string" ? data.error : "Ошибка запроса");
  return data;
}

/** Эталонный ответ — админу, чтобы быстро свериться при разборе. */
function answerText(t: Row["task"]): string {
  const a = t.correctAnswerJson;
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

const plain = (q: string) => q.replace(/\{([^{}]*)\}/g, "$1");
const fmt = (iso: string) => new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export default function HelpPage() {
  const [status, setStatus] = useState<"open" | "resolved" | "all">("open");
  const [student, setStudent] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => call(`/api/admin/help?status=${status}`).then(setRows).catch((e) => setError(e.message)), [status]);
  useEffect(() => { load(); }, [load]);

  async function setRowStatus(id: string, s: "open" | "resolved") {
    setError("");
    try { await call(`/api/admin/help/${id}`, "PATCH", { status: s }); await load(); } catch (e) { setError((e as Error).message); }
  }

  const students = Array.from(new Map(rows.map((r) => [r.user.id, r.user.login])).entries());
  const shown = student ? rows.filter((r) => r.user.id === student) : rows;

  return (
    <>
      <h1>Разобрать на встрече</h1>
      <p className="muted">Задачи, которые ученики отметили кнопкой «Не смог решить».</p>
      {error && <p className="err" role="alert">{error}</p>}
      <div className="row">
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} aria-label="Статус">
          <option value="open">Ждут разбора</option>
          <option value="resolved">Разобранные</option>
          <option value="all">Все</option>
        </select>
        <select value={student} onChange={(e) => setStudent(e.target.value)} aria-label="Ученик">
          <option value="">Все ученики</option>
          {students.map(([id, login]) => <option key={id} value={id}>{login}</option>)}
        </select>
        <span className="muted">{shown.length} шт.</span>
      </div>
      <div className="scroll"><table>
        <thead><tr><th>Ученик</th><th>Задача</th><th>Заметка ученика</th><th>Ответ</th><th>Когда</th><th></th></tr></thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.id}>
              <td><Link href={`/admin/students/${r.user.id}`}>{r.user.login}</Link></td>
              <td>
                <div className="muted">{r.task.topic.section.title} · {r.task.topic.title}</div>
                <div>{r.task.number ? <b>№{r.task.number}. </b> : null}{plain(r.task.question).slice(0, 220)}</div>
              </td>
              <td>{r.note ?? <span className="muted">—</span>}</td>
              <td><code>{answerText(r.task)}</code></td>
              <td>
                {fmt(r.createdAt)}
                {r.status === "resolved" && <div className="muted">{r.autoResolved ? "решил сам" : "разобрано"}</div>}
              </td>
              <td>
                {r.status === "open"
                  ? <button className="primary" onClick={() => setRowStatus(r.id, "resolved")}>Разобрано</button>
                  : <button onClick={() => setRowStatus(r.id, "open")}>Вернуть</button>}
              </td>
            </tr>
          ))}
          {!shown.length && <tr><td colSpan={6} className="muted">{status === "open" ? "Нерешённых заявок нет." : "Ничего не найдено."}</td></tr>}
        </tbody>
      </table></div>
    </>
  );
}
