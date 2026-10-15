export type Vars = Record<string, string | number>;

/** Подставляет {name} в строку интерфейса. */
export const fill = (s: string, vars?: Vars): string =>
  vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;
