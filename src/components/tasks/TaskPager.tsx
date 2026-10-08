"use client";

import { useState } from "react";
import type { PublicTask } from "@/lib/content/types";
import ui from "@/components/student/ui.module.css";
import { TaskCard } from "./TaskCard";

export type PagerItem = { task: PublicTask; solved: boolean; flagged: boolean };

/**
 * Закрепление: показывается одна задача, остальные — в сетке номеров.
 * Номер решённой задачи окрашивается (зелёный), нерешённые остаются обычными, текущая — с рамкой.
 * Все карточки остаются в DOM (скрыты), поэтому недописанные ответы не пропадают при переключении.
 */
export function TaskPager({ items }: { items: PagerItem[] }) {
  const [solvedIds, setSolvedIds] = useState<Set<string>>(() => new Set(items.filter((i) => i.solved).map((i) => i.task.id)));
  const firstOpen = items.findIndex((i) => !i.solved);
  const [current, setCurrent] = useState(firstOpen === -1 ? 0 : firstOpen);

  const total = items.length;
  const solvedCount = solvedIds.size;

  return (
    <div>
      <p className={ui.lead}>
        Решено задач: {solvedCount} из {total}. Выберите номер задачи.
      </p>

      <nav className={ui.pager} aria-label="Номера задач">
        {items.map((it, i) => {
          const cls = [ui.pagerNum, solvedIds.has(it.task.id) ? ui.pagerNumDone : "", i === current ? ui.pagerNumCur : ""].filter(Boolean).join(" ");
          return (
            <button
              key={it.task.id}
              type="button"
              className={cls}
              onClick={() => setCurrent(i)}
              aria-current={i === current ? "true" : undefined}
              title={solvedIds.has(it.task.id) ? `Задача ${i + 1} — решена` : `Задача ${i + 1}`}
            >
              {i + 1}
            </button>
          );
        })}
      </nav>

      {items.map((it, i) => (
        <div key={it.task.id} hidden={i !== current}>
          <TaskCard
            index={i + 1}
            task={it.task}
            solved={it.solved}
            flagged={it.flagged}
            onSolved={() => setSolvedIds((prev) => new Set(prev).add(it.task.id))}
          />
        </div>
      ))}

      <div className={ui.actions}>
        <button type="button" className={ui.btn} onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
          ← Предыдущая
        </button>
        <button type="button" className={ui.btn} onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))} disabled={current === total - 1}>
          Следующая →
        </button>
      </div>
    </div>
  );
}
