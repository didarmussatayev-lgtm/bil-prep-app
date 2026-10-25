"use client";
import { useEffect, useState } from "react";
import { BookPicker, useBooks } from "./books";

/** Доступ ученика к книгам: «Открыто всё» / «Только выбранные книги». */
export function AccessEditor({ studentId }: { studentId: string }) {
  const books = useBooks();
  const [restricted, setRestricted] = useState(false);
  const [sel, setSel] = useState<string[]>([]);
  const [state, setState] = useState<"loading" | "idle" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    fetch(`/api/admin/students/${studentId}/access`).then((r) => r.json()).then((d) => {
      setRestricted(d.restricted); setSel(d.books); setState("idle");
    }).catch(() => setState("error"));
  }, [studentId]);

  async function save() {
    setState("saving");
    const r = await fetch(`/api/admin/students/${studentId}/access`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ restricted, books: sel }),
    });
    setState(r.ok ? "saved" : "error");
  }

  if (state === "loading") return <p className="muted">Загрузка…</p>;
  return (
    <div className="card">
      <div className="seg" role="radiogroup" aria-label="Доступ к материалам">
        <button type="button" role="radio" aria-checked={!restricted} className={!restricted ? "on" : ""} onClick={() => { setRestricted(false); setState("idle"); }}>Открыто всё</button>
        <button type="button" role="radio" aria-checked={restricted} className={restricted ? "on" : ""} onClick={() => { setRestricted(true); setState("idle"); }}>Только выбранные книги</button>
      </div>
      {restricted && (
        <>
          <BookPicker books={books} value={sel} onChange={(v) => { setSel(v); setState("idle"); }} />
          {sel.length === 0 && <p className="err">Ни одна книга не выбрана — ученик ничего не увидит.</p>}
        </>
      )}
      <div className="row" style={{ marginTop: 12, marginBottom: 0 }}>
        <button className="primary" onClick={save} disabled={state === "saving"}>{state === "saving" ? "Сохраняем…" : "Сохранить доступ"}</button>
        {state === "saved" && <span role="status" style={{ color: "var(--ok)" }}>Сохранено</span>}
        {state === "error" && <span className="err" role="alert">Не удалось сохранить</span>}
      </div>
    </div>
  );
}
