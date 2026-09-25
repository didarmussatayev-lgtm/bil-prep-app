"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Student = { id: string; login: string; createdAt: string; online: boolean; progressPct: number };
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
        const c = await call("/api/admin/students", "POST", { login });
        setCreds({ login: c.login, password: c.password, what: "Создан ученик" }); setLogin("");
      }); }}>
        <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логин нового ученика" aria-label="Логин" required />
        <button className="primary" type="submit">Создать ученика</button>
      </form>
      <div className="scroll"><table>
        <thead><tr><th>Логин</th><th>Прогресс</th><th>Сессия</th><th>Действия</th></tr></thead>
        <tbody>
          {list.map((s) => (
            <tr key={s.id}>
              <td><Link href={`/admin/students/${s.id}`}>{s.login}</Link></td>
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
          {!list.length && <tr><td colSpan={4} className="muted">Учеников пока нет. Введите логин выше — пароль сгенерируется автоматически.</td></tr>}
        </tbody>
      </table></div>
    </>
  );
}
