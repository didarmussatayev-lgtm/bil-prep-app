"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicTask } from "@/lib/content/types";
import ui from "@/components/student/ui.module.css";
import { TaskCard } from "./TaskCard";

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
  </svg>
);

/**
 * Упражнения темы: одна задача на экране, снизу закреплённая панель с номерами.
 * Все карточки смонтированы (скрыты через hidden), поэтому введённый ответ и открытое решение
 * не теряются при переключении. Номер текущей задачи хранится в #hash — обновление страницы его сохраняет.
 */
export function PracticeRunner({
  tasks,
  solvedIds,
  flaggedIds,
}: {
  tasks: PublicTask[];
  solvedIds: string[];
  flaggedIds: string[];
}) {
  const [current, setCurrent] = useState(0);
  const [solved, setSolved] = useState(() => new Set(solvedIds));
  const [flagged, setFlagged] = useState(() => new Set(flaggedIds));
  const stripRef = useRef<HTMLDivElement>(null);
  const total = tasks.length;

  const go = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      setCurrent(next);
      try {
        history.replaceState(null, "", `#${next + 1}`);
      } catch {}
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [total],
  );

  // восстановить позицию из #hash
  useEffect(() => {
    const n = parseInt(window.location.hash.slice(1), 10);
    if (Number.isFinite(n) && n >= 1 && n <= total) setCurrent(n - 1);
  }, [total]);

  // держим активный номер по центру ленты
  useEffect(() => {
    const strip = stripRef.current;
    const el = strip?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!strip || !el) return;
    strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [current]);

  // стрелки на клавиатуре (не мешаем вводу в поля)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowLeft") go(current - 1);
      if (e.key === "ArrowRight") go(current + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, go]);

  const markSolved = (id: string) => setSolved((s) => new Set(s).add(id));
  const setFlag = (id: string, on: boolean) =>
    setFlagged((s) => {
      const n = new Set(s);
      if (on) n.add(id);
      else n.delete(id);
      return n;
    });

  const percent = total === 0 ? 0 : Math.round((solved.size / total) * 100);

  return (
    <div className={ui.practice}>
      <div className={ui.practiceStat}>
        <span>Решено {solved.size} из {total}</span>
        <div className={ui.bar} role="progressbar" aria-label="Решено задач" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
          <div className={`${ui.barFill} ${ui.barFillOk}`} style={{ width: `${percent}%` }} />
        </div>
      </div>

      {tasks.map((t, i) => (
        <div key={t.id} hidden={i !== current}>
          <TaskCard
            index={i + 1}
            task={t}
            solved={solved.has(t.id)}
            flagged={flagged.has(t.id)}
            onSolved={() => markSolved(t.id)}
            onFlagChange={(on) => setFlag(t.id, on)}
          />
        </div>
      ))}

      <nav className={ui.navDock} aria-label="Номера задач">
        <div className={ui.navInner}>
          <button type="button" className={ui.navArrow} onClick={() => go(current - 1)} disabled={current === 0} aria-label="Предыдущая задача">
            <Arrow dir="left" />
          </button>

          <div className={ui.navStrip} ref={stripRef}>
            {tasks.map((t, i) => {
              const cls = [
                ui.navChip,
                solved.has(t.id) ? ui.navChipSolved : "",
                flagged.has(t.id) && !solved.has(t.id) ? ui.navChipFlag : "",
                i === current ? ui.navChipCurrent : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <button
                  key={t.id}
                  type="button"
                  className={cls}
                  onClick={() => go(i)}
                  aria-current={i === current ? "true" : undefined}
                  aria-label={`Задача ${i + 1}${solved.has(t.id) ? ", решена" : ""}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className={`${ui.navArrow} ${ui.navArrowPrimary}`}
            onClick={() => go(current + 1)}
            disabled={current === total - 1}
            aria-label="Следующая задача"
          >
            <Arrow dir="right" />
          </button>
        </div>
      </nav>
    </div>
  );
}
