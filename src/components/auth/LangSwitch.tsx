"use client";

import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n/client";

/** Переключатель RU/ҚАЗ. Пишет cookie и перерисовывает страницу на сервере. */
export function LangSwitch({ className }: { className?: string }) {
  const lang = useLang();
  const router = useRouter();
  async function set(next: "ru" | "kk") {
    if (next === lang) return;
    await fetch("/api/lang", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lang: next }) });
    router.refresh();
  }
  const on = { fontWeight: 700, textDecoration: "underline" } as const;
  return (
    <span className={className} role="group" aria-label="Тіл / Язык">
      <button type="button" onClick={() => set("ru")} style={lang === "ru" ? on : undefined} className={className}>RU</button>
      <button type="button" onClick={() => set("kk")} style={lang === "kk" ? on : undefined} className={className}>ҚАЗ</button>
    </span>
  );
}
