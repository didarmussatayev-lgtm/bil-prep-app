"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Data = {
  user: { id: string; login: string };
  topics: {
    id: string; title: string; learned: boolean;
    practiceSolved: number; practiceTotal: number;
    status: "empty" | "not_started" | "in_progress" | "done";
    lastAttemptAt: string | null;
  }[];
  attempts: { id: string; scope: string; score: number | null; total: number; percent: number; takenAt: string | null }[];
};
const STATUS: Record<string, string> = { empty: "нет задач", not_started: "не начато", in_progress: "в процессе", done: "пройдено" };
const SCOPE: Record<string, string> = { topic: "по теме", section: "по разделу", full: "сборный" };
const fmt = (d: string | null) => (d ? new Date(d).toLocaleString("ru-RU") : "—");

// Next.js 14: в клиентских компонентах params приходит обычным объектом, а не Promise
// (в отличие от серверных страниц этого репозитория, где params — Promise, — см. соседние
// server components, где params awaited перед деструктуризацией).
export default function StudentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`/api/admin/students/${id}/progress`).then(async (r) => (r.ok ? setData(await r.json()) : setError("Ученик не найден")));
  }, [id]);

  if (error) return <p className="err">{error}</p>;
  if (!data) return <p className="muted">Загрузка…</p>;
  const learnedCount = data.topics.filter((t) => t.learned).length;

  return (
    <>
      <p><Link href="/admin/students">← Все ученики</Link></p>
      <h1>{data.user.login}</h1>
      <p className="muted">Изучено тем: {learnedCount} из {data.topics.length}</p>
      <h2>Темы</h2>
      <div className="scroll"><table>
        <thead><tr><th>Тема</th><th>Изучена</th><th>Закрепление</th><th>Статус</th><th>Последняя попытка</th></tr></thead>
        <tbody>{data.topics.map((t) => (
          <tr key={t.id}>
            <td>{t.title}</td>
            <td>{t.learned ? "да" : "нет"}</td>
            <td>{t.practiceTotal ? `${t.practiceSolved} из ${t.practiceTotal}` : "—"}</td>
            <td>{STATUS[t.status] ?? t.status}</td>
            <td>{fmt(t.lastAttemptAt)}</td>
          </tr>
        ))}</tbody>
      </table></div>
      <h2>Тесты</h2>
      <div className="scroll"><table>
        <thead><tr><th>Дата</th><th>Вид</th><th>Результат</th></tr></thead>
        <tbody>
          {data.attempts.map((a) => (
            <tr key={a.id}><td>{fmt(a.takenAt)}</td><td>{SCOPE[a.scope] ?? a.scope}</td><td>{a.score ?? 0} из {a.total} ({a.percent}%)</td></tr>
          ))}
          {!data.attempts.length && <tr><td colSpan={3} className="muted">Тестов ещё не было.</td></tr>}
        </tbody>
      </table></div>
    </>
  );
}
