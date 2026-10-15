/**
 * Казахский перевод контента (необязательный слой поверх русского seed).
 * Всё пишется в колонку i18n как { kk: {..., reviewed: false} } — русский оригинал не меняется.
 * Нет записи → ученик с казахским интерфейсом видит русский текст.
 *
 * Ключи задач: "p:<n>" (закрепление) и "t:<n>" (тест) — как в slug задачи.
 */
export type KkTask = { question: string; options?: string[]; solution?: string };
export type KkTopic = { title: string; explanation?: string; tasks?: Record<string, KkTask> };

export const KK_SUBJECTS: Record<string, { name: string }> = {
  math: { name: "Математика" },
  logic: { name: "Логика" },
};

/** slug раздела → название */
export const KK_SECTIONS: Record<string, { title: string }> = {};

/** "<slug раздела>.<код темы>" → перевод темы */
export const KK_TOPICS: Record<string, KkTopic> = {};
