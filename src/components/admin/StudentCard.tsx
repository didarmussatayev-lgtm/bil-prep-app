"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AccessEditor } from "./AccessEditor";
import { WeakList } from "./Reports";
import { ago, call, ConfirmDialog, fmtDateTime, Pct } from "./common";

type Topic = { id: string; title: string; learned: boolean; practiceSolved: number; practiceTotal: number; lastAttemptAt: string | null };
type Detail = {
  user: { id: string; login: string; createdAt: string; online: boolean; lastActiveAt: string | null; restricted: boolean; books: string[] };
  summary: { topics: number; learned: number; tasks: number; solved: number; percent: number } | undefined;
  sections: { id: string; title: string; level: number; closed: boolean; topics: Topic[] }[];
  attempts: { id: string; scope: string; score: number; total: number; percent: number; finishedAt: string; title: string | null; weak: string[] }[];
  practiceMistakes: { taskId: string; number: string | null; topic: string; question: string; attempts: number; date: string }[];
  testMistakes: { taskId: string; topic: string; question: string; mine: string | null; correct: string | null; date: string }[];
  help: { id: string; note: string | null; status: "open" | "resolved"; autoResolved: boolean; createdAt: string; number: string | null; topic: string; question: string }[];
};

const TABS = [
  ["progress", "Прогресс"], ["weak", "Слабые места"], ["tests", "Тесты"], ["mistakes", "Ошибки"], ["help", "Не смог решить"], ["access", "Доступ"],
] as const;
const SCOPE: Record<string, string> = { topic: "Тест по теме", section: "Тест по разделу", full: "Сборный тест" };

export function StudentCard({ id, initialTab }: { id: string; initialTab: string }) {
  const router = useRouter();
  const [d, setD] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(TABS.some(([k]) => k === initialTab) ? initialTab : "progress");

  const load = useCallback(() => call(`/api/admin/students/${id}/detail`).then(setD).catch((e) => setError(e.message)), [id]);
  useEffect(() => { void load(); }, [load]);

  if (error) return <p className="err">{error}</p>;
  if (!d) return <p className="muted">Загрузка…</p>;
  const openHelp = d.help.filter((h) => h.status === "open").length;

  return (
    <>
      <p style={{ margin: "0 0 8px" }}><Link href="/admin/students">← Все ученики</Link></p>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="head" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={`dot ${d.user.online ? "on" : ""}`} />
          <h1 style={{ margin: 0 }}>{d.user.login}</h1>
        </div>
        <div className="meta" style={{ margin: "4px 0 10px" }}>
          <span>Заходил: {ago(d.user.lastActiveAt)}</span>
          <span>Создан: {new Date(d.user.createdAt).toLocaleDateString("ru-RU")}</span>
        </div>
        {d.summary && (
          <>
            <Pct value={d.summary.percent} />
            <p className="muted" style={{ margin: "6px 0 0" }}>Тем: {d.summary.learned} из {d.summary.topics} · задач: {d.summary.solved} из {d.summary.tasks}</p>
          </>
        )}
      </div>

      <div className="subtabs" role="tablist">
        {TABS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>
            {label}{k === "help" && openHelp > 0 ? ` (${openHelp})` : ""}
          </button>
        ))}
      </div>

      {tab === "progress" && <ProgressTab d={d} />}
      {tab === "weak" && <WeakTab id={id} />}
      {tab === "tests" && <TestsTab d={d} />}
      {tab === "mistakes" && <MistakesTab d={d} />}
      {tab === "help" && <HelpTab d={d} reload={load} />}
      {tab === "access" && (
        <>
          <h2 style={{ marginTop: 0 }}>Доступ к книгам</h2>
          <AccessEditor studentId={id} />
          <Account d={d} onDeleted={() => router.push("/admin/students")} reload={load} />
        </>
      )}
    </>
  );
}

function ProgressTab({ d }: { d: Detail }) {
  return (
    <div className="stack">
      {d.sections.map((s) => (
        <details key={s.id} className="card" open={!s.closed && s.topics.some((t) => t.learned || t.practiceSolved > 0)}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>
            {s.title} {s.closed && <span className="tag">закрыто</span>}
            <span className="muted" style={{ fontWeight: 400 }}> · {s.topics.filter((t) => t.learned).length}/{s.topics.length}</span>
          </summary>
          <div className="stack" style={{ marginTop: 10, opacity: s.closed ? 0.55 : 1 }}>
            {s.topics.map((t) => (
              <div key={t.id} style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
                <div>{t.title}</div>
                <div className="meta">
                  <span className={t.learned ? "ok" : ""}>{t.learned ? "✓ изучена" : "не изучена"}</span>
                  <span>{t.practiceTotal ? `задач ${t.practiceSolved}/${t.practiceTotal}` : "задач нет"}</span>
                  {t.lastAttemptAt && <span>{ago(t.lastAttemptAt)}</span>}
                </div>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function TestsTab({ d }: { d: Detail }) {
  if (!d.attempts.length) return <p className="card muted">Тестов ещё не было.</p>;
  return (
    <div className="stack">
      {d.attempts.map((a) => (
        <div key={a.id} className="card">
          <div className="head" style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <b>{a.title ?? SCOPE[a.scope] ?? a.scope}</b>
            <span className={`tag ${a.percent >= 60 ? "good" : "bad"}`}>{a.score} из {a.total} · {a.percent}%</span>
          </div>
          <div className="meta"><span>{fmtDateTime(a.finishedAt)}</span></div>
          {a.weak.length > 0 && <p style={{ margin: "6px 0 0" }}><span className="muted">Слабые темы: </span>{a.weak.join("; ")}</p>}
        </div>
      ))}
    </div>
  );
}

function MistakesTab({ d }: { d: Detail }) {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>Закрепление: не решены</h2>
      {d.practiceMistakes.length === 0 ? <p className="card muted">Нерешённых задач с попытками нет.</p> : (
        <div className="stack">
          {d.practiceMistakes.map((m) => (
            <div key={m.taskId} className="card">
              <div className="muted">{m.topic}</div>
              <div>{m.number ? <b>№{m.number}. </b> : null}{m.question}</div>
              <div className="meta" style={{ marginTop: 4 }}><span className="tag bad">попыток: {m.attempts}</span><span>{ago(m.date)}</span></div>
            </div>
          ))}
        </div>
      )}
      <h2>Тесты: неверные ответы (последние 10 тестов)</h2>
      {d.testMistakes.length === 0 ? <p className="card muted">Ошибок нет.</p> : (
        <div className="stack">
          {d.testMistakes.map((m, i) => (
            <div key={m.taskId + i} className="card">
              <div className="muted">{m.topic}</div>
              <div>{m.question}</div>
              <div className="meta" style={{ marginTop: 4 }}>
                <span className="tag bad">ответил: {m.mine ?? "нет ответа"}</span>
                <span className="tag good">верно: {m.correct}</span>
                <span>{fmtDateTime(m.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function HelpTab({ d, reload }: { d: Detail; reload: () => void }) {
  const [err, setErr] = useState("");
  async function set(id: string, status: "open" | "resolved") {
    try { await call(`/api/admin/help/${id}`, "PATCH", { status }); reload(); } catch (e) { setErr((e as Error).message); }
  }
  if (!d.help.length) return <p className="card muted">Заявок «Не смог решить» нет.</p>;
  return (
    <div className="stack">
      {err && <p className="err">{err}</p>}
      {d.help.map((h) => (
        <div key={h.id} className="card">
          <div className="head" style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <span className="muted">{h.topic}</span>
            <span className={`tag ${h.status === "open" ? "warn" : "good"}`}>{h.status === "open" ? "ждёт разбора" : h.autoResolved ? "решил сам" : "разобрано"}</span>
          </div>
          <div>{h.number ? <b>№{h.number}. </b> : null}{h.question}</div>
          {h.note && <p className="muted" style={{ margin: "4px 0" }}>«{h.note}»</p>}
          <div className="row" style={{ margin: "8px 0 0" }}>
            <span className="muted grow">{fmtDateTime(h.createdAt)}</span>
            {h.status === "open"
              ? <button className="primary sm" onClick={() => set(h.id, "resolved")}>Разобрано</button>
              : <button className="sm" onClick={() => set(h.id, "open")}>Вернуть</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Account({ d, onDeleted, reload }: { d: Detail; onDeleted: () => void; reload: () => void }) {
  const [creds, setCreds] = useState<{ password: string } | null>(null);
  const [confirm, setConfirm] = useState<"password" | "delete" | null>(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const run = async (fn: () => Promise<void>) => { setErr(""); try { await fn(); } catch (e) { setErr((e as Error).message); } };

  return (
    <>
      <h2>Аккаунт</h2>
      {creds && (
        <div className="notice" role="status">
          Новый пароль для <b>{d.user.login}</b>: <code>{creds.password}</code>
          <div className="muted">Виден только сейчас — скопируйте и передайте ученику.</div>
          <div className="row" style={{ margin: "8px 0 0" }}>
            <button onClick={() => navigator.clipboard?.writeText(`Логин: ${d.user.login}\nПароль: ${creds.password}`)}>Копировать</button>
            <button onClick={() => setCreds(null)}>Закрыть</button>
          </div>
        </div>
      )}
      {err && <p className="err" role="alert">{err}</p>}
      {msg && <p className="ok" role="status">{msg}</p>}
      <div className="stack">
        <button onClick={() => setConfirm("password")}>Сбросить пароль</button>
        <button disabled={!d.user.online} onClick={() => run(async () => { await call(`/api/admin/students/${d.user.id}/logout`, "POST"); setMsg("Ученик вышел из сессии"); reload(); })}>
          Выйти из сессии{d.user.online ? "" : " (сессии нет)"}
        </button>
        <button className="danger" onClick={() => setConfirm("delete")}>Удалить ученика</button>
      </div>
      {confirm === "password" && (
        <ConfirmDialog title="Сбросить пароль?" text="Старый пароль перестанет работать, ученик выйдет на всех устройствах. Новый пароль покажем один раз." confirmLabel="Сбросить"
          onCancel={() => setConfirm(null)}
          onConfirm={() => { setConfirm(null); void run(async () => { const c = await call(`/api/admin/students/${d.user.id}/password`, "POST"); setCreds({ password: c.password }); reload(); }); }} />
      )}
      {confirm === "delete" && (
        <ConfirmDialog title={`Удалить ${d.user.login}?`} text="Вместе с учеником удалятся весь прогресс, результаты тестов и заявки. Это нельзя отменить." confirmLabel="Удалить навсегда"
          onCancel={() => setConfirm(null)}
          onConfirm={() => { setConfirm(null); void run(async () => { await call(`/api/admin/students/${d.user.id}`, "DELETE"); onDeleted(); }); }} />
      )}
    </>
  );
}

function WeakTab({ id }: { id: string }) {
  const [rows, setRows] = useState<Parameters<typeof WeakList>[0]["rows"] | null>(null);
  useEffect(() => { call(`/api/admin/reports?type=weak&userId=${id}`).then(setRows).catch(() => setRows([])); }, [id]);
  if (!rows) return <p className="muted">Считаем…</p>;
  return (
    <>
      <p className="muted" style={{ marginTop: 0 }}>Темы, где верных ответов меньше 60% (тесты и закрепление вместе).</p>
      <WeakList rows={rows} perStudent />
    </>
  );
}
