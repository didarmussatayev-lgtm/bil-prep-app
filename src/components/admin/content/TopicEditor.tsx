"use client";
import { useEffect, useRef, useState } from "react";
import { ExplanationView } from "@/components/student/ExplanationView";
import { parseExplanation } from "@/lib/content/types";
import { api } from "./api";
import { TasksPanel } from "./TasksPanel";

type Topic = { id: string; sectionId: string; title: string; order: number; hidden: boolean; explanationContent: unknown };

// Вставки для телефона: набирать ::: и ### на мобильной клавиатуре неудобно.
const SNIPPETS: [string, string][] = [
  ["Заголовок", "### Заголовок\n"],
  ["Правило", ":::rule Правило\nТекст правила\n:::\n"],
  ["Запомни", ":::remember\nТекст\n:::\n"],
  ["Лайфхак", ":::tip\nТекст\n:::\n"],
  ["Ловушка", ":::warn\nТекст\n:::\n"],
  ["Пример", ":::example Пример\nУсловие\n---\nРешение\n:::\n"],
  ["Проверь себя", ":::check\nВопрос\n---\nОтвет\n:::\n"],
  ["Алгоритм", ":::steps Алгоритм\n1. Шаг\n2. Шаг\n:::\n"],
  ["Список", "- пункт\n- пункт\n"],
  ["Дробь", "{1/2}"],
];

export function TopicEditor({ id, onDirty, onChanged, onClose, onDelete }: {
  id: string; onDirty: (d: boolean) => void; onChanged: () => void; onClose: () => void; onDelete: (title: string, tasks: number) => void;
}) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"text" | "tasks">("text");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");
  const [taskCount, setTaskCount] = useState(0);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    api("topics", "GET", undefined, id).then((t: Topic) => {
      setTopic(t); setTitle(t.title);
      // объяснение хранится строкой Markdown; если вдруг массив блоков — не затираем, показываем JSON
      setText(typeof t.explanationContent === "string" ? t.explanationContent : t.explanationContent ? JSON.stringify(t.explanationContent, null, 2) : "");
    }).catch((e) => setError(e.message));
  }, [id]);

  const dirty = !!topic && (title !== topic.title || text !== (typeof topic.explanationContent === "string" ? topic.explanationContent : topic.explanationContent ? JSON.stringify(topic.explanationContent, null, 2) : ""));
  useEffect(() => { onDirty(dirty); }, [dirty, onDirty]);

  async function save() {
    if (!topic) return;
    setState("saving"); setError("");
    try {
      // массив блоков (старый формат) сохраняем как массив, а не как строку JSON
      let content: unknown = text;
      if (typeof topic.explanationContent !== "string" && topic.explanationContent) content = JSON.parse(text);
      const t = await api("topics", "PUT", { sectionId: topic.sectionId, title: title.trim(), order: topic.order, explanationContent: content }, id);
      setTopic(t); setTitle(t.title); setState("saved"); onChanged();
    } catch (e) { setError((e as Error).message); setState("idle"); }
  }

  async function toggleHidden() {
    if (!topic) return;
    try { const t = await api("topics", "PATCH", { hidden: !topic.hidden }, id); setTopic({ ...topic, hidden: t.hidden }); onChanged(); }
    catch (e) { setError((e as Error).message); }
  }

  function insert(snippet: string) {
    const el = area.current;
    if (!el) return setText(text + snippet);
    const { selectionStart: a, selectionEnd: b } = el;
    const needBreak = a > 0 && !text.slice(0, a).endsWith("\n") && snippet.includes("\n") ? "\n" : "";
    setText(text.slice(0, a) + needBreak + snippet + text.slice(b));
    requestAnimationFrame(() => { el.focus(); const pos = a + needBreak.length + snippet.length; el.setSelectionRange(pos, pos); });
  }

  if (error && !topic) return <p className="err">{error}</p>;
  if (!topic) return <p className="muted">Загрузка…</p>;

  return (
    <div>
      <div className="row">
        <button className="sm" onClick={onClose}>← К дереву</button>
        <span className="grow" />
        <label className="switch">
          <input type="checkbox" checked={!topic.hidden} onChange={toggleHidden} />
          {topic.hidden ? "Скрыта от учеников" : "Показывается ученикам"}
        </label>
      </div>
      <label htmlFor="ttitle">Название темы</label>
      <input id="ttitle" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", fontWeight: 600 }} />

      <div className="subtabs" role="tablist" style={{ marginTop: 12 }}>
        <button role="tab" aria-selected={tab === "text"} className={tab === "text" ? "on" : ""} onClick={() => setTab("text")}>Объяснение</button>
        <button role="tab" aria-selected={tab === "tasks"} className={tab === "tasks" ? "on" : ""} onClick={() => setTab("tasks")}>Задачи{taskCount ? ` (${taskCount})` : ""}</button>
      </div>

      {tab === "text" && (
        <>
          <div className="seg" role="tablist" style={{ marginBottom: 8 }}>
            <button role="tab" aria-selected={mode === "edit"} className={mode === "edit" ? "on" : ""} onClick={() => setMode("edit")}>Текст</button>
            <button role="tab" aria-selected={mode === "preview"} className={mode === "preview" ? "on" : ""} onClick={() => setMode("preview")}>Как увидит ученик</button>
          </div>
          {mode === "edit" ? (
            <>
              <div className="snippets" aria-label="Быстрые вставки">
                {SNIPPETS.map(([l, s]) => <button key={l} className="sm" onClick={() => insert(s)}>{l}</button>)}
              </div>
              <textarea ref={area} value={text} onChange={(e) => { setText(e.target.value); setState("idle"); }} aria-label="Текст объяснения" style={{ minHeight: 360 }} />
              <p className="muted" style={{ fontSize: 13 }}>Формат: <code>###</code> заголовок, <code>**жирный**</code>, <code>{"{1/2}"}</code> дробь, блоки <code>:::rule … :::</code>. Подробнее — docs/content-format.md.</p>
            </>
          ) : (
            <div className="preview">
              {text.trim() ? <ExplanationView blocks={parseExplanation(text)} /> : <p className="muted">Объяснение пока пустое.</p>}
            </div>
          )}
        </>
      )}
      {tab === "tasks" && <TasksPanel topicId={id} onCount={setTaskCount} onChanged={onChanged} />}

      {error && <p className="err" role="alert">{error}</p>}
      <div className="row savebar" style={{ marginTop: 14 }}>
        <button className="primary" onClick={save} disabled={!dirty || state === "saving"}>{state === "saving" ? "Сохраняем…" : "Сохранить"}</button>
        {dirty && <span className="tag warn">есть несохранённые правки</span>}
        {!dirty && state === "saved" && <span className="ok" role="status">Сохранено</span>}
        <span className="grow" />
        <button className="danger sm" onClick={() => onDelete(topic.title, taskCount)}>Удалить тему</button>
      </div>
    </div>
  );
}
