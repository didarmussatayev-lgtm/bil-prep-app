"use client";
import { useEffect, useState } from "react";
import { call } from "./common";

type S = { id: string; login: string };

/** Выбор одного ученика поиском по логину (учеников 100+, выпадающий список не годится). */
export function StudentPicker({ value, onChange }: { value: S | null; onChange: (s: S | null) => void }) {
  const [q, setQ] = useState("");
  const [found, setFound] = useState<S[]>([]);
  useEffect(() => {
    if (!q.trim()) { setFound([]); return; }
    const t = setTimeout(() => call(`/api/admin/students?q=${encodeURIComponent(q.trim())}&sort=name`).then((d) => setFound(d.items.slice(0, 6))).catch(() => {}), 250);
    return () => clearTimeout(t);
  }, [q]);
  if (value) return <button className="chip on" onClick={() => onChange(null)} aria-label={`Сбросить ученика ${value.login}`}>{value.login} ✕</button>;
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ученик: поиск по логину" aria-label="Ученик" style={{ width: "100%" }} />
      {found.length > 0 && (
        <div className="card" style={{ position: "absolute", zIndex: 5, left: 0, right: 0, top: "100%", padding: 6 }}>
          {found.map((s) => <button key={s.id} className="sm" style={{ display: "block", width: "100%", textAlign: "left", border: 0 }} onClick={() => { onChange(s); setQ(""); setFound([]); }}>{s.login}</button>)}
        </div>
      )}
    </div>
  );
}
