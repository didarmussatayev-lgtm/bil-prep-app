"use client";
import { useCallback, useEffect, useState } from "react";

type Subject = { id: string; name: string };
type Section = { id: string; subjectId: string; title: string; order: number };
type Topic = { id: string; sectionId: string; title: string; order: number; explanationContent: string };
type Task = {
  id: string; topicId: string; type: "test_choice" | "open"; question: string; options: string[];
  correctOption: string | null; answerType: string | null; correctAnswerJson: unknown;
  solutionText: string; imageParamsJson: unknown;
};

async function api(entity: string, method = "GET", body?: unknown, id?: string, query = "") {
  const url = `/api/admin/content/${entity}${id ? `/${id}` : ""}${query}`;
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error ? JSON.stringify(data.error.fieldErrors ?? data.error) : "Ошибка запроса");
  return data;
}

const EMPTY_TASK = { type: "test_choice", question: "", options: "", correctOption: "A", answerType: "integer", correctAnswerJson: "", solutionText: "", imageParamsJson: "" };

export default function ContentPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [error, setError] = useState("");
  const [newTitle, setNewTitle] = useState({ subject: "", section: "", topic: "" });
  const [explanation, setExplanation] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_TASK);

  const guard = async (fn: () => Promise<unknown>) => { setError(""); try { await fn(); } catch (e) { setError((e as Error).message); } };

  const loadSubjects = useCallback(() => api("subjects").then(setSubjects), []);
  const loadSections = useCallback((s: string) => (s ? api("sections", "GET", undefined, undefined, `?subjectId=${s}`) : Promise.resolve([])).then(setSections), []);
  const loadTopics = useCallback((s: string) => (s ? api("topics", "GET", undefined, undefined, `?sectionId=${s}`) : Promise.resolve([])).then(setTopics), []);
  const loadTasks = useCallback((t: string) => (t ? api("tasks", "GET", undefined, undefined, `?topicId=${t}`) : Promise.resolve([])).then(setTasks), []);

  useEffect(() => { guard(loadSubjects); }, [loadSubjects]);
  useEffect(() => { guard(() => loadSections(subjectId)); setSectionId(""); }, [subjectId, loadSections]);
  useEffect(() => { guard(() => loadTopics(sectionId)); setTopicId(""); }, [sectionId, loadTopics]);
  useEffect(() => {
    guard(() => loadTasks(topicId));
    setExplanation(topics.find((t) => t.id === topicId)?.explanationContent ?? "");
    setEditingId(null); setForm(EMPTY_TASK);
  }, [topicId]); // eslint-disable-line react-hooks/exhaustive-deps

  const nextOrder = (xs: { order: number }[]) => Math.max(0, ...xs.map((x) => x.order)) + 1;
  const remove = (entity: string, id: string, label: string, after: () => Promise<unknown>) =>
    confirm(`Удалить «${label}» и всё вложенное?`) && guard(async () => { await api(entity, "DELETE", undefined, id); await after(); });

  function parseJson(text: string) { return text.trim() ? JSON.parse(text) : undefined; }

  async function saveTask() {
    await guard(async () => {
      const isChoice = form.type === "test_choice";
      const body = {
        topicId, type: form.type, question: form.question,
        options: isChoice ? form.options.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        correctOption: isChoice ? form.correctOption : null,
        answerType: isChoice ? null : form.answerType,
        correctAnswerJson: isChoice ? undefined : parseJson(form.correctAnswerJson),
        solutionText: form.solutionText,
        imageParamsJson: parseJson(form.imageParamsJson),
      };
      if (editingId) await api("tasks", "PUT", body, editingId); else await api("tasks", "POST", body);
      setEditingId(null); setForm(EMPTY_TASK); await loadTasks(topicId);
    });
  }

  function editTask(t: Task) {
    setEditingId(t.id);
    setForm({
      type: t.type, question: t.question, options: t.options.join("\n"), correctOption: t.correctOption ?? "A",
      answerType: t.answerType ?? "integer",
      correctAnswerJson: t.correctAnswerJson ? JSON.stringify(t.correctAnswerJson) : "",
      solutionText: t.solutionText, imageParamsJson: t.imageParamsJson ? JSON.stringify(t.imageParamsJson) : "",
    });
  }

  const set = (k: keyof typeof EMPTY_TASK) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <h1>Контент</h1>
      {error && <p className="err" role="alert">{error}</p>}
      <div className="cols">
        <section className="card list" aria-label="Предметы и разделы">
          <h2 style={{ marginTop: 0 }}>Предметы</h2>
          {subjects.map((s) => (
            <div key={s.id} className="row" style={{ marginBottom: 4 }}>
              <button style={{ flex: 1 }} aria-current={s.id === subjectId} onClick={() => setSubjectId(s.id)}>{s.name}</button>
              <button className="danger" aria-label={`Удалить ${s.name}`} onClick={() => remove("subjects", s.id, s.name, async () => { setSubjectId(""); await loadSubjects(); })}>×</button>
            </div>
          ))}
          <form className="row" onSubmit={(e) => { e.preventDefault(); guard(async () => { await api("subjects", "POST", { name: newTitle.subject }); setNewTitle({ ...newTitle, subject: "" }); await loadSubjects(); }); }}>
            <input placeholder="Новый предмет" value={newTitle.subject} onChange={(e) => setNewTitle({ ...newTitle, subject: e.target.value })} required />
            <button type="submit">Добавить</button>
          </form>

          {subjectId && <>
            <h2>Разделы</h2>
            {sections.map((s) => (
              <div key={s.id} className="row" style={{ marginBottom: 4 }}>
                <button style={{ flex: 1 }} aria-current={s.id === sectionId} onClick={() => setSectionId(s.id)}>{s.title}</button>
                <button className="danger" aria-label={`Удалить ${s.title}`} onClick={() => remove("sections", s.id, s.title, async () => { setSectionId(""); await loadSections(subjectId); })}>×</button>
              </div>
            ))}
            <form className="row" onSubmit={(e) => { e.preventDefault(); guard(async () => { await api("sections", "POST", { subjectId, title: newTitle.section, order: nextOrder(sections) }); setNewTitle({ ...newTitle, section: "" }); await loadSections(subjectId); }); }}>
              <input placeholder="Новый раздел" value={newTitle.section} onChange={(e) => setNewTitle({ ...newTitle, section: e.target.value })} required />
              <button type="submit">Добавить</button>
            </form>
          </>}
        </section>

        <section className="card list" aria-label="Темы">
          <h2 style={{ marginTop: 0 }}>Темы</h2>
          {!sectionId && <p className="muted">Выберите раздел слева.</p>}
          {sectionId && <>
            {topics.map((t) => (
              <div key={t.id} className="row" style={{ marginBottom: 4 }}>
                <button style={{ flex: 1 }} aria-current={t.id === topicId} onClick={() => { setTopicId(t.id); setExplanation(t.explanationContent); }}>{t.title}</button>
                <button className="danger" aria-label={`Удалить ${t.title}`} onClick={() => remove("topics", t.id, t.title, async () => { setTopicId(""); await loadTopics(sectionId); })}>×</button>
              </div>
            ))}
            <form className="row" onSubmit={(e) => { e.preventDefault(); guard(async () => { await api("topics", "POST", { sectionId, title: newTitle.topic, order: nextOrder(topics), explanationContent: "" }); setNewTitle({ ...newTitle, topic: "" }); await loadTopics(sectionId); }); }}>
              <input placeholder="Например: 1.1 Дроби" value={newTitle.topic} onChange={(e) => setNewTitle({ ...newTitle, topic: e.target.value })} required />
              <button type="submit">Добавить</button>
            </form>
          </>}
          {topicId && <>
            <h2>Объяснение</h2>
            <textarea style={{ minHeight: 200 }} value={explanation} onChange={(e) => setExplanation(e.target.value)} aria-label="Текст объяснения" />
            <button className="primary" onClick={() => guard(async () => {
              const t = topics.find((x) => x.id === topicId)!;
              await api("topics", "PUT", { sectionId: t.sectionId, title: t.title, order: t.order, explanationContent: explanation }, t.id);
              await loadTopics(sectionId);
            })}>Сохранить объяснение</button>
          </>}
        </section>

        <section className="card list" aria-label="Задачи">
          <h2 style={{ marginTop: 0 }}>Задачи</h2>
          {!topicId && <p className="muted">Выберите тему.</p>}
          {topicId && <>
            {tasks.map((t, i) => (
              <div key={t.id} className="row" style={{ marginBottom: 4 }}>
                <button style={{ flex: 1 }} aria-current={t.id === editingId} onClick={() => editTask(t)}>
                  {i + 1}. {t.type === "test_choice" ? "[тест] " : ""}{t.question.slice(0, 40)}
                </button>
                <button className="danger" aria-label="Удалить задачу" onClick={() => remove("tasks", t.id, `задача ${i + 1}`, async () => { if (editingId === t.id) { setEditingId(null); setForm(EMPTY_TASK); } await loadTasks(topicId); })}>×</button>
              </div>
            ))}
            <h2>{editingId ? "Редактирование задачи" : "Новая задача"}</h2>
            <label>Тип</label>
            <select value={form.type} onChange={set("type")}><option value="test_choice">Тест с вариантами A–E</option><option value="open">Открытый ответ</option></select>
            <label>Условие</label>
            <textarea value={form.question} onChange={set("question")} />
            {form.type === "test_choice" ? <>
              <label>Варианты (по одному в строке, по порядку A, B, C…)</label>
              <textarea value={form.options} onChange={set("options")} />
              <label>Правильный вариант</label>
              <select value={form.correctOption} onChange={set("correctOption")}>{"ABCDE".split("").map((l) => <option key={l}>{l}</option>)}</select>
            </> : <>
              <label>Тип ответа</label>
              <select value={form.answerType} onChange={set("answerType")}>
                <option value="integer">Целое число</option><option value="decimal">Десятичная дробь</option>
                <option value="fraction">Обыкновенная дробь</option><option value="mixed">Смешанное число</option>
              </select>
              <label>Эталон (JSON: {`{"value":5}`}, {`{"num":1,"denom":2}`} или {`{"whole":1,"num":1,"denom":6}`})</label>
              <textarea value={form.correctAnswerJson} onChange={set("correctAnswerJson")} />
            </>}
            <label>Решение</label>
            <textarea value={form.solutionText} onChange={set("solutionText")} />
            <label>Параметры рисунка (JSON, необязательно)</label>
            <textarea value={form.imageParamsJson} onChange={set("imageParamsJson")} />
            <div className="row" style={{ marginTop: 10 }}>
              <button className="primary" onClick={saveTask}>{editingId ? "Сохранить задачу" : "Добавить задачу"}</button>
              {editingId && <button onClick={() => { setEditingId(null); setForm(EMPTY_TASK); }}>Отмена</button>}
            </div>
          </>}
        </section>
      </div>
    </>
  );
}
