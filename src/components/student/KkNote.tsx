"use client";

import ui from "./ui.module.css";
import { useT } from "@/lib/i18n/client";

/** Плашка в казахском режиме: перевод ещё не вычитан человеком. */
export function KkNote() {
  const t = useT();
  return <p className={ui.muted}>{t("Перевод ещё не проверен — возможны неточности.")}</p>;
}
