"use client";
import { useCallback, useEffect, useState } from "react";
import { ConfirmDialog } from "../common";
import { api, type TreeSection, type TreeSubject } from "./api";
import { TopicEditor } from "./TopicEditor";

type Confirm = { title: string; text: string; label: string; run: () => Promise<unknown> };

export function ContentEditor() {
  const [tree, setTree] = useState<TreeSubject[] | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState<{ kind: "topic" | "section"; parent: string; level?: number } | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const load = useCallback(() => api("tree").then((d) => setTree(d.subjects)).catch((e) => setError(e.message)), []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const guard = async (fn: () => Promise<unknown>) => { setError(""); try { await fn(); await load(); } catch (e) { setError((e as Error).message); } };

  function select(id: string) {
    if (id === topicId) return;
    if (!dirty) return setTopicId(id);
    setConfirm({ title: "Есть несохранённые правки", text: "Если перейти к другой теме, изменения в объяснении пропадут.", label: "Перейти без сохранения", run: async () => { setDirty(false); setTopicId(id); } });
  }

  async function add() {
    if (!adding || !newTitle.trim()) return;
    await guard(async () => {
      const siblings = tree?.flatMap((s) => s.books.flatMap((b) => b.sections)) ?? [];
      if (adding.kind === "topic") {
        const sec = siblings.find((s) => s.id === adding.parent)!;
        const t = await api("topics", "POST", { sectionId: adding.parent, title: newTitle.trim(), order: Math.max(0, ...sec.topics.map((x) => x.order)) + 1, explanationContent: "" });
        setTopicId(t.id);
      } else {
        const order = Math.max(0, ...siblings.map((s) => s.order)) + 1;
        await api("sections", "POST", { subjectId: adding.parent, title: newTitle.trim(), order, level: adding.level });
      }
      setAdding(null); setNewTitle("");
    });
  }

  const move = (sec: TreeSection, i: number, dir: -1 | 1) => {
    const a = sec.topics[i], b = sec.topics[i + dir];
    if (!b) return;
    void guard(async () => { await api("topics", "PATCH", { order: b.order }, a.id); await api("topics", "PATCH", { order: a.order }, b.id); });
  };

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>Контент</h1>
        <a href="/admin/papers" className="pdf">📝 Пробные варианты</a>
      </div>
      {error && <p className="err" role="alert">{error}</p>}
      <div className={`ce ${topicId ? "has-topic" : ""}`}>
        <aside className="ce-tree" aria-label="Дерево книг">
          {!tree && <p className="muted">Загрузка…</p>}
          {tree?.map((s) => (
            <details key={s.id} className="card" open>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>{s.name}</summary>
              {s.books.map((b) => (
                <details key={b.level} open={s.books.length === 1} style={{ marginTop: 8 }}>
                  <summary style={{ cursor: "pointer", fontWeight: 600, minHeight: 36 }}>{b.title}</summary>
                  {b.sections.map((sec) => (
                    <details key={sec.id} className="ce-sec" open={sec.topics.some((t) => t.id === topicId)}>
                      <summary>
                        <span className="grow">{sec.title}</span>
                        <span className="muted">{sec.topics.length}</span>
                      </summary>
                      {sec.topics.map((t, i) => (
                        <div key={t.id} className={`ce-topic ${t.id === topicId ? "on" : ""}`}>
                          <button className="ce-pick" onClick={() => select(t.id)} aria-current={t.id === topicId}>
                            <span className={t.hidden ? "muted" : ""} style={t.hidden ? { textDecoration: "line-through" } : undefined}>{t.title}</span>
                            <span className="meta">
                              <span>{t.practice} зад. · {t.test} тест.</span>
                              {t.hidden && <span className="tag warn">скрыта</span>}
                              {t.empty && <span className="tag bad">нет объяснения</span>}
                            </span>
                          </button>
                          <span className="ce-move">
                            <button className="sm" aria-label={`Поднять «${t.title}» выше`} disabled={i === 0} onClick={() => move(sec, i, -1)}>↑</button>
                            <button className="sm" aria-label={`Опустить «${t.title}» ниже`} disabled={i === sec.topics.length - 1} onClick={() => move(sec, i, 1)}>↓</button>
                          </span>
                        </div>
                      ))}
                      <div className="row" style={{ margin: "8px 0 0" }}>
                        <button className="sm" onClick={() => { setAdding({ kind: "topic", parent: sec.id }); setNewTitle(""); }}>＋ Тема</button>
                        <button className="sm danger" onClick={() => setConfirm({
                          title: `Удалить раздел «${sec.title}»?`,
                          text: `Вместе с разделом удалятся ${sec.topics.length} тем и все их задачи (${sec.topics.reduce((n, t) => n + t.practice + t.test, 0)}), а также прогресс учеников по ним. Это нельзя отменить.`,
                          label: "Удалить раздел",
                          run: async () => { if (sec.topics.some((t) => t.id === topicId)) setTopicId(null); await api("sections", "DELETE", undefined, sec.id); },
                        })}>Удалить раздел</button>
                      </div>
                    </details>
                  ))}
                  <button className="sm" style={{ marginTop: 8 }} onClick={() => { setAdding({ kind: "section", parent: s.id, level: b.level }); setNewTitle(""); }}>＋ Раздел в «{b.title}»</button>
                </details>
              ))}
            </details>
          ))}
        </aside>

        <section className="ce-main" aria-label="Редактор темы">
          {topicId ? (
            <TopicEditor
              key={topicId}
              id={topicId}
              onDirty={setDirty}
              onChanged={load}
              onClose={() => { if (!dirty) setTopicId(null); else setConfirm({ title: "Есть несохранённые правки", text: "Закрыть тему без сохранения?", label: "Закрыть", run: async () => { setDirty(false); setTopicId(null); } }); }}
              onDelete={(title, tasks) => setConfirm({
                title: `Удалить тему «${title}»?`,
                text: `Удалятся объяснение и все задачи темы (${tasks}), а также прогресс и заявки учеников по ней. Это нельзя отменить.`,
                label: "Удалить тему",
                run: async () => { await api("topics", "DELETE", undefined, topicId); setDirty(false); setTopicId(null); },
              })}
            />
          ) : (
            <p className="card muted">Выберите тему слева, чтобы изменить объяснение и задачи.</p>
          )}
        </section>
      </div>

      {adding && (
        <div className="overlay" onClick={() => setAdding(null)}>
          <form className="dialog" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); void add(); }}>
            <h2 style={{ margin: 0 }}>{adding.kind === "topic" ? "Новая тема" : "Новый раздел"}</h2>
            <label htmlFor="ctitle">{adding.kind === "topic" ? "Название, например «1.1 Дроби»" : "Название раздела"}</label>
            <input id="ctitle" autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: "100%" }} required />
            <div className="row"><button type="button" onClick={() => setAdding(null)}>Отмена</button><button className="primary" type="submit">Создать</button></div>
          </form>
        </div>
      )}
      {confirm && (
        <ConfirmDialog title={confirm.title} text={confirm.text} confirmLabel={confirm.label}
          onCancel={() => setConfirm(null)}
          onConfirm={() => { const c = confirm; setConfirm(null); void guard(c.run); }} />
      )}
    </>
  );
}
