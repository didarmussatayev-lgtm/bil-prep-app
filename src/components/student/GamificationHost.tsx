"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLang, useT } from "@/lib/i18n/client";
import styles from "./gami.module.css";

type Item = { also?: string[]; key: string; icon: string; title: { ru: string; kk: string }; desc: { ru: string; kk: string } };
type State = { enabled: boolean; xp: number; level: number; streak: number; atRisk: boolean; unseen: Item[] };

/** Событие «что-то изменилось» — шлётся после проверки задачи, изучения темы, завершения теста. */
export const refreshGamification = () => window.dispatchEvent(new Event("gami:refresh"));

/** Чип «серия · уровень» в шапке и поздравления о новых достижениях (показываются по очереди). */
export function GamificationHost() {
  const t = useT();
  const lang = useLang();
  const [s, setS] = useState<State | null>(null);
  const [queue, setQueue] = useState<Item[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/gamification", { cache: "no-store" });
      if (!res.ok) return;
      const d: State = await res.json();
      setS(d);
      if (d.unseen?.length) setQueue((q) => [...q, ...d.unseen.filter((u) => !q.some((x) => x.key === u.key))]);
    } catch { /* офлайн — просто без чипа */ }
  }, []);

  useEffect(() => {
    void load();
    window.addEventListener("gami:refresh", load);
    return () => window.removeEventListener("gami:refresh", load);
  }, [load]);

  async function dismiss() {
    const [first, ...rest] = queue;
    setQueue(rest);
    if (first) await fetch("/api/gamification/seen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keys: [first.key, ...(first.also ?? [])] }) }).catch(() => {});
  }

  if (!s?.enabled) return null;
  const cur = queue[0];
  const isLevel = cur?.key.startsWith("lvl:");
  return (
    <>
      <Link href="/achievements" className={styles.chip} aria-label={t("Достижения")}>
        <span>🔥 {s.streak}</span>
        <span>⭐ {s.level}</span>
      </Link>
      {cur && createPortal(
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={t("Новое достижение!")} onClick={dismiss}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.bigIcon} aria-hidden="true">{cur.icon}</div>
            <p className={styles.kicker}>{isLevel ? t("Новый уровень!") : t("Новое достижение!")}</p>
            <h2 className={styles.title}>{cur.title[lang]}</h2>
            <p className={styles.desc}>{cur.desc[lang]}</p>
            {!isLevel && <span className={styles.xpBadge}>+50 XP</span>}
            <div><button type="button" autoFocus onClick={dismiss} style={{ minHeight: 48, padding: "0 28px", borderRadius: 12, border: 0, background: "var(--accent)", color: "var(--on-accent)", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>{t("Ура!")}</button></div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
