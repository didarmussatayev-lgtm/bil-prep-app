"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookPicker, useBooks } from "./books";
import { ago, call, Pct } from "./common";

type Student = {
  id: string; login: string; online: boolean; lastActiveAt: string | null; progressPct: number;
  restricted: boolean; books: string[]; openHelp: number; shared: boolean; devices7: number; kicks7: number; slowing: boolean; paceRecent: number; pacePrev: number;
};
type Page = { items: Student[]; total: number; page: number; pages: number };
type Creds = { login: string; password: string };

export function StudentsView({ initial }: { initial: { activity: string; progress: string; book: string } }) {
  const books = useBooks();
  const [q, setQ] = useState("");
  const [book, setBook] = useState(initial.book);
  const [activity, setActivity] = useState(initial.activity);
  const [progress, setProgress] = useState(initial.progress);
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page | null>(null);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [bulkBook, setBulkBook] = useState("");
  const [info, setInfo] = useState("");
  // создание
  const [login, setLogin] = useState("");
  const [newBooks, setNewBooks] = useState<string[] | null>(null); // null = все книги
  const [creds, setCreds] = useState<Creds | null>(null);
  const bookTitle = (k: string) => books.find((b) => b.key === k)?.title ?? k;

  // поиск не дёргает сервер на каждую букву
  const [qDebounced, setQDebounced] = useState("");
  useEffect(() => { const t = setTimeout(() => setQDebounced(q), 250); return () => clearTimeout(t); }, [q]);
  useEffect(() => { setPage(1); }, [qDebounced, book, activity, progress, sort]);

  const seq = useRef(0);
  const load = useCallback(async () => {
    const n = ++seq.current;
    const p = new URLSearchParams({ q: qDebounced, book, activity, progress, sort, page: String(page) });
    try {
      const d = await call(`/api/admin/students?${p}`);
      if (n === seq.current) { setData(d); setError(""); }
    } catch (e) { if (n === seq.current) setError((e as Error).message); }
  }, [qDebounced, book, activity, progress, sort, page]);
  useEffect(() => { void load(); }, [load]);

  const chosen = newBooks ?? books.map((b) => b.key);
  const items = data?.items ?? [];
  const allOnPage = items.length > 0 && items.every((s) => picked.includes(s.id));
  const filtered = !!(q || book || activity !== "all" || progress !== "all");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const c = await call("/api/admin/students", "POST", { login, books: newBooks });
      setCreds({ login: c.login, password: c.password });
      setLogin(""); setNewBooks(null);
      await load();
    } catch (err) { setError((err as Error).message); }
  }

  async function bulk(mode: "add" | "only") {
    try {
      const r = await call("/api/admin/students/access-bulk", "POST", { studentIds: picked, book: bulkBook, mode });
      setInfo(`Обновлено: ${r.updated}${r.skipped ? `. Пропущено (у них и так открыто всё): ${r.skipped}` : ""}`);
      setPicked([]);
      await load();
    } catch (err) { setError((err as Error).message); }
  }

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>Ученики{data ? ` · ${data.total}` : ""}</h1>
      </div>

      {creds && (
        <div className="notice" role="status">
          Создан ученик <b>{creds.login}</b>. Пароль: <code>{creds.password}</code>
          <div className="muted">Пароль виден только сейчас — скопируйте и передайте ученику.</div>
          <div className="row" style={{ margin: "8px 0 0" }}>
            <button onClick={() => navigator.clipboard?.writeText(`Логин: ${creds.login}\nПароль: ${creds.password}`)}>Копировать</button>
            <button onClick={() => setCreds(null)}>Закрыть</button>
          </div>
        </div>
      )}
      {error && <p className="err" role="alert">{error}</p>}

      <details className="card" style={{ marginBottom: 12 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, minHeight: 28 }}>＋ Новый ученик</summary>
        <form onSubmit={create}>
          <label htmlFor="newlogin">Логин (3–32 символа: буквы, цифры, . _ -)</label>
          <input id="newlogin" value={login} onChange={(e) => setLogin(e.target.value)} required style={{ width: "100%" }} autoCapitalize="none" />
          <label>Какие книги открыть</label>
          <BookPicker books={books} value={chosen} onChange={setNewBooks} />
          <button className="primary" type="submit" style={{ width: "100%" }}>Создать</button>
        </form>
      </details>

      <div className="row">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по логину" aria-label="Поиск по логину" />
      </div>
      <div className="filters">
        <select value={book} onChange={(e) => setBook(e.target.value)} aria-label="Книга">
          <option value="">Все книги</option>
          {books.map((b) => <option key={b.key} value={b.key}>{b.title}</option>)}
        </select>
        <select value={activity} onChange={(e) => setActivity(e.target.value)} aria-label="Активность">
          <option value="all">Любая активность</option>
          <option value="online">Сейчас в сети</option>
          <option value="inactive">Не заходили 3+ дня</option>
          <option value="never">Ни разу не занимались</option>
          <option value="slowing">Снизили темп</option>
          <option value="shared">Подозрение на общий аккаунт</option>
        </select>
        <select value={progress} onChange={(e) => setProgress(e.target.value)} aria-label="Прогресс">
          <option value="all">Любой прогресс</option>
          <option value="low">Меньше 30%</option>
          <option value="mid">30–70%</option>
          <option value="high">От 70%</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Сортировка">
          <option value="new">Сначала новые</option>
          <option value="name">По логину</option>
          <option value="progress">Меньше прогресс — выше</option>
          <option value="activity">Давно не заходили — выше</option>
        </select>
        {filtered && <button className="sm" onClick={() => { setQ(""); setBook(""); setActivity("all"); setProgress("all"); }}>Сбросить</button>}
      </div>

      {items.length > 0 && (
        <label className="row" style={{ margin: "0 0 8px", color: "var(--ink)", fontSize: 15 }}>
          <input type="checkbox" checked={allOnPage} onChange={(e) => setPicked(e.target.checked ? [...new Set([...picked, ...items.map((s) => s.id)])] : picked.filter((id) => !items.some((s) => s.id === id)))} />
          Выбрать всех на странице
        </label>
      )}

      <div className="stack grid2">
        {items.map((s) => (
          <div key={s.id} className="card" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <input type="checkbox" aria-label={`Выбрать ${s.login}`} checked={picked.includes(s.id)} onChange={() => setPicked((p) => (p.includes(s.id) ? p.filter((x) => x !== s.id) : [...p, s.id]))} style={{ marginTop: 4 }} />
            <Link href={`/admin/students/${s.id}`} className="item grow" style={{ minWidth: 0 }}>
              <div className="head">
                <span className={`dot ${s.online ? "on" : ""}`} title={s.online ? "в сети" : "не в сети"} />
                <b>{s.login}</b>
                {s.openHelp > 0 && <span className="tag bad">заявок: {s.openHelp}</span>}
                {s.slowing && <span className="tag warn" title={`За 7 дней: ${s.paceRecent} действий, раньше в среднем ${s.pacePrev} в неделю`}>снизил темп</span>}
                {s.shared && <span className="tag warn" title={`За 7 дней: устройств ${s.devices7}, перехватов сессии ${s.kicks7}`}>общий аккаунт?</span>}
              </div>
              <Pct value={s.progressPct} />
              <div className="meta" style={{ marginTop: 6 }}>
                <span>{ago(s.lastActiveAt)}</span>
                {s.restricted && !s.books.length
                  ? <span className="tag warn" title="Доступ не открыт — откройте книги в карточке ученика">нет доступа</span>
                  : <span>{s.restricted ? s.books.map(bookTitle).join(", ") : "все книги"}</span>}
              </div>
            </Link>
          </div>
        ))}
      </div>
      {data && items.length === 0 && (
        <p className="card muted">{filtered ? "Никого не найдено. Попробуйте изменить фильтры." : "Учеников пока нет. Откройте «Новый ученик» выше — пароль сгенерируется сам."}</p>
      )}

      {data && data.pages > 1 && (
        <div className="pager">
          <button onClick={() => setPage(page - 1)} disabled={page <= 1}>← Назад</button>
          <span className="muted">{data.page} из {data.pages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page >= data.pages}>Дальше →</button>
        </div>
      )}

      {info && <p role="status" className="ok">{info}</p>}
      {picked.length > 0 && (
        <div className="card bulk" role="region" aria-label="Массовые действия">
          <b>Выбрано: {picked.length}</b>
          <div className="row" style={{ margin: "8px 0 0" }}>
            <select value={bulkBook} onChange={(e) => setBulkBook(e.target.value)} aria-label="Книга для выдачи">
              <option value="">Книга…</option>
              {books.map((b) => <option key={b.key} value={b.key}>{b.title}</option>)}
            </select>
            <button disabled={!bulkBook} onClick={() => bulk("add")}>Добавить книгу</button>
            <button disabled={!bulkBook} onClick={() => bulk("only")}>Только эта книга</button>
            <button onClick={() => setPicked([])}>Снять выбор</button>
          </div>
        </div>
      )}
    </>
  );
}
