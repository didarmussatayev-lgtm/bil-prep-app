"use client";

import { createContext, useContext } from "react";
import type { Lang } from "./config";
import { KK } from "./kk";
import { fill, type Vars } from "./fill";

const Ctx = createContext<Lang>("ru");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

/** Перевод строки интерфейса: ключ — русский текст; нет перевода → русский. */
export function useT() {
  const lang = useContext(Ctx);
  return (ru: string, vars?: Vars): string => fill(lang === "kk" ? KK[ru] ?? ru : ru, vars);
}
