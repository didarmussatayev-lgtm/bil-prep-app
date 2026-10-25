"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TaskContent } from "@/components/tasks/TaskContent";
import { hasPendingFigure, parseFigures, parseOptions } from "@/lib/content/types";
import { ConfirmDialog } from "../common";
import { api } from "./api";

type Task = {
  id: string; type: "test_choice" | "open"; number: string | null; order: number; hidden: boolean; question: string; options: unknown;
  correctOption: string | null; answerType: string | null; correctAnswerJson: any; allowUnreduced: boolean; solutionText: string | null; imageParamsJson: unknown;
};

const ANSWER_TYPES: [string, string, string][] = [
  ["integer", "Целое число", '{"value": 5}'], ["decimal", "Десятичная дробь", '{"value": 2.5}'],
  ["fraction", "Обыкновенная дробь", '{"num": 1, "denom": 2}'], ["mixed", "Смешанное число", '{"whole": 1, "num": 1, "denom": 6}'],
  ["sequence", "Порядок (A B C)", '{"items": ["B", "A", "C"]}'], ["set", "Набор чисел", '{"items": ["5", "6"]}'], ["text", "Текст / выражение", '{"text": "2x+1"}'],
];

const plain = (q: string, n = 90) => { const s = q.replace(/\{([^{}]*)\}/g, "$1").replace(/\s+/g, " "); return s.length > n ? s.slice(0, n) + "…" : s; };

function answerOf(t: Task): string {
  const a = t.correctAnswerJson;
  if (t.type === "test_choice") return t.correctOption ?? "—";
  if (!a) return "—";
  switch (t.answerType) {
    case "fraction": return `${a.num}/${a.denom}`;
    case "mixed": return `${a.whole} ${a.num}/${a.denom}`;
    case "sequence": return (a.items ?? []).join(" ");
    case "set": return (a.items ?? []).join(", ");
    case "text": return String(a.text ?? "");
    default: return String(a.value ?? "—").replace(".", ",");
  }
}

type Form = { type: "test_choice" | "open"; question: string; options: string; correctOption: string; answerType: string; correctAnswerJson: string; allowUnreduced: boolean; solutionText: string; imageParamsJson: string };
const EMPTY: Form = { type: "test_choice", question: "", options: "", correctOption: "A", answerType: "integer", correctAnswerJson: "", allowUnreduced: false, solutionText: "", imageParamsJson: "" };

export function TasksPanel({ topicId, onCount, onChanged }: { topicId: string; onCount: (n: number) => void; onChanged: () => void }) {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "test_choice" | "hidden">("all");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [del, setDel] = useState<Task | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => api("tasks", "GET", undefined, undefined, `?topicId=${topicId}`).then((d: Task[]) => { setTasks(d); onCount(d.length); }).catch((e) => setError(e.message)), [topicId, onCount]);
  useEffect(() => { void load(); }, [load]);

  const shown = useMemo(() => (tasks ?? []).filter((t) => filter === "all" || (filter === "hidden" ? t.hidden : t.type === filter)), [tasks, filter]);
  const guard = async (fn: () => Promise<unknown>) => { setError(""); try { await fn(); await load(); onChanged(); } catch (e) { setError((e as Error).message); } };

  function edit(t: Task) {
    setEditing(t.id);
    setForm({
      type: t.type, question: t.question, options: parseOptions(t.options).map((o) => o.text).join("\n"), correctOption: t.correctOption ?? "A",
      answerType: t.answerType ?? "integer", correctAnswerJson: t.correctAnswerJson ? JSON.stringify(t.correctAnswerJson) : "",
      allowUnreduced: t.allowUnreduced, solutionText: t.solutionText ?? "", imageParamsJson: t.imageParamsJson ? JSON.stringify(t.imageParamsJson) : "",
    });
  }

  async function save() {
    await guard(async () => {
      const choice = form.type === "test_choice";
      const json = (s: string, what: string) => { if (!s.trim()) return undefined; try { return JSON.parse(s); } catch { throw new Error(`${what}: некорректный JSON`); } };
      const body = {
        topicId, type: form.type, question: form.question,
        options: choice ? form.options.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        correctOption: choice ? form.correctOption : null,
        answerType: choice ? null : form.answerType,
        correctAnswerJson: choice ? undefined : json(form.correctAnswerJson, "Эталон"),
        allowUnreduced: choice ? undefined : form.allowUnreduced,
        solutionText: form.solutionText,
        imageParamsJson: json(form.imageParamsJson, "Рисунок"),
        ...(editing === "new" ? { order: Math.max(0, ...(tasks ?? []).map((t) => t.order)) + 1 } : {}),
      };
      if (editing === "new") await api("tasks", "POST", body); else await api("tasks", "PUT", body, editing!);
      setEditing(null); setForm(EMPTY);
    });
  }

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });

  if (!tasks) return <p className="muted">{error || "Загрузка…"}</p>;

  return (
    <>
      <div className="filters" role="tablist">
        {([["all", "Все"], ["open", "Закрепление"], ["test_choice", "Тесты"], ["hidden", "Скрытые"]] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={filter === k} className={`sm ${filter === k ? "primary" : ""}`} onClick={() => setFilter(k)}>
            {l} ({k === "all" ? tasks.length : tasks.filter((t) => (k === "hidden" ? t.hidden : t.type === k)).length})
          </button>
        ))}
        <button className="sm primary" onClick={() => { setEditing("new"); setForm(EMPTY); }}>＋ Новая задача</button>
      </div>
      {error && <p className="err" role="alert">{error}</p>}

      {editing && (
        <div className="card" style={{ marginBottom: 12 }}>
          <h2 style={{ marginTop: 0 }}>{editing === "new" ? "Новая задача" : "Редактирование задачи"}</h2>
          <label>Тип</label>
          <select value={form.type} onChange={set("type")} style={{ width: "100%" }}><option value="test_choice">Тест с вариантами A–E</option><option value="open">Открытый ответ</option></select>
          <label>Условие</label>
          <textarea value={form.question} onChange={set("question")} />
          {form.question.trim() && <div className="preview" style={{ minHeight: 0, marginTop: 6 }}><TaskContent question={form.question} figures={safeFigures(form.imageParamsJson)} /></div>}
          {form.type === "test_choice" ? (
            <>
              <label>Варианты (по одному в строке, по порядку A, B, C…)</label>
              <textarea value={form.options} onChange={set("options")} />
              <label>Правильный вариант</label>
              <select value={form.correctOption} onChange={set("correctOption")}>{"ABCDE".split("").map((l) => <option key={l}>{l}</option>)}</select>
            </>
          ) : (
            <>
              <label>Тип ответа</label>
              <select value={form.answerType} onChange={set("answerType")} style={{ width: "100%" }}>{ANSWER_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
              <label>Эталон (JSON), например {ANSWER_TYPES.find(([k]) => k === form.answerType)?.[2]}</label>
              <textarea value={form.correctAnswerJson} onChange={set("correctAnswerJson")} />
              <label className="switch"><input type="checkbox" checked={form.allowUnreduced} onChange={set("allowUnreduced")} /> Засчитывать несокращённую дробь</label>
            </>
          )}
          <label>Решение</label>
          <textarea value={form.solutionText} onChange={set("solutionText")} />
          <label>Параметры рисунка (JSON, необязательно)</label>
          <textarea value={form.imageParamsJson} onChange={set("imageParamsJson")} />
          <div className="row" style={{ marginTop: 10, marginBottom: 0 }}>
            <button className="primary" onClick={save}>{editing === "new" ? "Добавить задачу" : "Сохранить задачу"}</button>
            <button onClick={() => { setEditing(null); setForm(EMPTY); }}>Отмена</button>
          </div>
        </div>
      )}

      {shown.length === 0 ? <p className="card muted">Задач нет.</p> : (
        <table className="rt">
          <thead><tr><th>№</th><th>Тип</th><th>Условие</th><th>Ответ</th><th>Действия</th></tr></thead>
          <tbody>
            {shown.map((t, i) => (
              <tr key={t.id} style={t.hidden ? { opacity: 0.6 } : undefined}>
                <td data-label="№">{t.number ?? i + 1}</td>
                <td><span className="tag">{t.type === "test_choice" ? "тест" : "закрепление"}</span>{t.hidden && <span className="tag warn"> скрыта</span>}{hasPendingFigure(parseFigures(t.imageParamsJson)) && <span className="tag bad"> ждёт рисунка</span>}</td>
                <td>{plain(t.question)}</td>
                <td data-label="Ответ"><code>{answerOf(t)}</code></td>
                <td>
                  <div className="row" style={{ margin: 0 }}>
                    <button className="sm" onClick={() => edit(t)}>Изменить</button>
                    <button className="sm" onClick={() => guard(() => api("tasks", "PATCH", { hidden: !t.hidden }, t.id))}>{t.hidden ? "Показать" : "Скрыть"}</button>
                    <button className="sm danger" onClick={() => setDel(t)}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {del && (
        <ConfirmDialog title="Удалить задачу?" text={`«${plain(del.question, 70)}» исчезнет у всех учеников вместе с их результатами и заявками «Не смог решить». Если нужно просто убрать задачу — лучше «Скрыть».`} confirmLabel="Удалить задачу"
          onCancel={() => setDel(null)} onConfirm={() => { const d = del; setDel(null); void guard(() => api("tasks", "DELETE", undefined, d.id)); }} />
      )}
    </>
  );
}

function safeFigures(json: string) { try { return json.trim() ? parseFigures(JSON.parse(json)) : []; } catch { return []; } }
