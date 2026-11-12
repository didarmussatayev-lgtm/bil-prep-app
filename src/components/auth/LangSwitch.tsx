"use client";

import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n/client";
import styles from "./LangSwitch.module.css";

/** Переключатель RU/ҚАЗ. Пишет cookie и перерисовывает страницу на сервере. */
export function LangSwitch({ className }: { className?: string }) {
  const lang = useLang();
  const router = useRouter();
  async function set(next: "ru" | "kk") {
    if (next === lang) return;
    await fetch("/api/lang", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lang: next }) });
    router.refresh();
  }
  return (
    <span className={`${styles.seg} ${className ?? ""}`.trim()} role="group" aria-label="Тіл / Язык">
      <button type="button" onClick={() => set("ru")} aria-pressed={lang === "ru"} className={styles.opt}>RU</button>
      <button type="button" onClick={() => set("kk")} aria-pressed={lang === "kk"} className={styles.opt}>ҚАЗ</button>
    </span>
  );
}
