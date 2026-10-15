// Локализация контента из БД. Переводы лежат в колонке i18n: { kk: { title?, question?, ... , reviewed } }.
// Нет перевода или поля — отдаём русский оригинал.
import type { Lang } from "./config";

type Bag = Record<string, unknown> | null | undefined;

export function pick<T>(i18n: unknown, lang: Lang, field: string, fallback: T): T {
  if (lang !== "kk" || !i18n || typeof i18n !== "object") return fallback;
  const kk = (i18n as Record<string, Bag>).kk;
  const v = kk?.[field];
  return v === undefined || v === null || v === "" ? fallback : (v as T);
}

/** true, если для сущности есть казахский перевод, ещё не проверенный человеком. */
export function kkUnreviewed(i18n: unknown): boolean {
  const kk = i18n && typeof i18n === "object" ? (i18n as Record<string, Bag>).kk : null;
  return !!kk && kk.reviewed !== true;
}
