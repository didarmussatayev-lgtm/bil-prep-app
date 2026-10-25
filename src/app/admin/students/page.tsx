"use client";
import Link from "next/link";
import { BookPicker, useBooks } from "@/components/admin/books";
import { useCallback, useEffect, useState } from "react";

type Student = { id: string; login: string; createdAt: string; online: boolean; progressPct: number; restricted: boolean; books: string[] };
type Creds = { login: string; password: string; what: string };

async function call(url: string, method = "GET", body?: unknown) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(typeof data.error === "string" ? data.error : "Ошибка запроса");
  return data;
}

export default function StudentsPage() {
  const [list, setList] = useState<Student[]>([]);
  const [login, setLogin] = useState("");
  const [creds, setCreds] = useState<Creds | null>(null);
  const [error, setError] = useState("");
  const books = useBooks();
  const [newBooks, setNewBooks] = useState<string[] | null>(null); // null = все книги (по умолчанию)
  const [picked, setPicked] = useState<string[]>([]);
  const [bulkBook, setBulkBook] = useState("");
  const [info, setInfo] = useState("");
  const chosen = newBooks ?? books.map((b) => b.key);
  const bookTitle = (k: string) => books.find((b) => b.key === k)?.title ?? k;

  const load = useCallback(() => call("/api/admin/students").then(setList).catch((e) => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);

  async function run(fn: () => Promise<void>) {
    setError("");
    try { await fn(); await load(); } catch (e) { setError((e as Error).message); }
  }

  return (
    <>
      <h1>Ученики</h1>
      {creds && (
        <div className="notice" role="status">
          {creds.what} <b>{creds.login}</b>. Пароль: <code>{creds.password}</code>
          <div className="muted">Пароль виден только сейчас — скопируйте его и передайте ученику.</div>
        </div>
      )}
      {error && <p className="err" role="alert">{error}</p>}
      <form className="row" onSubmit={(e) => { e.preventDefault(); run(async () => {
        const c = await call("/api/admin/students", "POST", { login, books: newBooks });
        setCreds({ login: c.login, password: c.password, what: "Создан ученик" }); setLogin(""); setNewBooks(null);
      }); }}>
        <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логин нового ученика" aria-label="Логин" required />
        <button className="primary" type="submit">Создать ученика</button>
      </form>
      <div className="muted">Книги нового ученика:</div>
      <BookPicker books={books} value={chosen} onChange={setNewBooks} />
      <div className="scroll"><table>
        <thead><tr><th aria-label="Выбор"><input type="checkbox" aria-label="Выбрать всех" checked={list.length > 0 && picked.length === list.length} onChange={(e) => setPicked(e.target.checked ? list.map((s) => s.id) : [])} /></th><th>Логин</th><th>Доступ</th><th>Прогресс</th><th>Сессия</th><th>Действия</th></tr></thead>
        <tbody>
          {list.map((s) => (
            <tr key={s.id}>
              <td><input type="checkbox" aria-label={`Выбрать ${s.login}`} checked={picked.includes(s.id)} onChange={() => setPicked((p) => (p.includes(s.id) ? p.filter((x) => x !== s.id) : [...p, s.id]))} /></td>
              <td><Link href={`/admin/students/${s.id}`}>{s.login}</Link></td>
              <td>{s.restricted ? <span className="tag">{s.books.length ? s.books.map(bookTitle).join(", ") : "нет книг"}</span> : <span className="muted">всё</span>}</td>
              <td><div className="bar" title={`${s.progressPct}%`}><i style={{ width: `${s.progressPct}%` }} /></div></td>
              <td><span className={`dot ${s.online ? "on" : ""}`} />{s.online ? "активна" : "нет"}</td>
              <td className="row" style={{ margin: 0 }}>
                <button onClick={() => run(async () => {
                  const c = await call(`/api/admin/students/${s.id}/password`, "POST");
                  setCreds({ login: c.login, password: c.password, what: "Новый пароль для" });
                })}>Сбросить пароль</button>
                <button disabled={!s.online} onClick={() => run(() => call(`/api/admin/students/${s.id}/logout`, "POST"))}>Разлогинить</button>
                <button className="danger" onClick={() => confirm(`Удалить ученика ${s.login} вместе с прогрессом?`) && run(() => call(`/api/admin/students/${s.id}`, "DELETE"))}>Удалить</button>
              </td>
            </tr>
          ))}
          {!list.length && <tr><td colSpan={7} className="muted">Учеников пока нет. Введите логин выше — пароль сгенерируется автоматически.</td></tr>}
        </tbody>
      </table></div>
      {picked.length > 0 && (
        <div className="card bulk" role="region" aria-label="Массовые действия">
          <b>Выбрано: {picked.length}</b>
          <div className="row" style={{ margin: "8px 0 0" }}>
            <select value={bulkBook} onChange={(e) => setBulkBook(e.target.value)} aria-label="Книга">
              <option value="">Книга…</option>
              {books.map((b) => <option key={b.key} value={b.key}>{b.title}</option>)}
            </select>
            {(["add", "only"] as const).map((mode) => (
              <button key={mode} disabled={!bulkBook} onClick={() => run(async () => {
                const r = await call("/api/admin/students/access-bulk", "POST", { studentIds: picked, book: bulkBook, mode });
                setInfo(`Обновлено: ${r.updated}${r.skipped ? `. Пропущено (у них и так открыто всё): ${r.skipped}` : ""}`);
                setPicked([]);
              })}>{mode === "add" ? "Добавить книгу" : "Только эта книга"}</button>
            ))}
            <button onClick={() => setPicked([])}>Снять выбор</button>
          </div>
        </div>
      )}
      {info && <p role="status">{info}</p>}
    </>
  );
}
