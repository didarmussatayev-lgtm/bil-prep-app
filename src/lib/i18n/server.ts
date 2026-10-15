import "server-only";
import { cookies } from "next/headers";
import { LANG_COOKIE, normLang, type Lang } from "./config";
import { KK } from "./kk";
import { fill, type Vars } from "./fill";

export async function getLang(): Promise<Lang> {
  return normLang((await cookies()).get(LANG_COOKIE)?.value);
}

/** Перевод строки интерфейса: ключ — русский текст; нет перевода → русский. */
export const trFor = (lang: Lang) => (ru: string, vars?: Vars): string => fill(lang === "kk" ? KK[ru] ?? ru : ru, vars);

export async function getT() {
  return trFor(await getLang());
}
