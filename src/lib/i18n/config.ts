export type Lang = "ru" | "kk";
export const LANG_COOKIE = "bil_lang";
export const normLang = (v: unknown): Lang => (v === "kk" ? "kk" : "ru");
