/** Запросы к /api/admin/content/*; при ошибке бросает Error с понятным текстом. */
export async function api(entity: string, method = "GET", body?: unknown, id?: string, query = "") {
  const r = await fetch(`/api/admin/content/${entity}${id ? `/${id}` : ""}${query}`, {
    method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = data.error;
    const msg = typeof e === "string" ? e : e?.fieldErrors ? Object.entries(e.fieldErrors).map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`).join("; ") || (e.formErrors ?? []).join("; ") : "Ошибка запроса";
    throw new Error(msg || "Ошибка запроса");
  }
  return data;
}

export type TreeTopic = { id: string; title: string; order: number; hidden: boolean; empty: boolean; practice: number; test: number; hiddenTasks: number };
export type TreeSection = { id: string; title: string; order: number; topics: TreeTopic[] };
export type TreeBook = { level: number; title: string; sections: TreeSection[] };
export type TreeSubject = { id: string; name: string; books: TreeBook[] };
