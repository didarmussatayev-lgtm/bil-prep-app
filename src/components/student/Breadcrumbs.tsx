"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/client";
import ui from "./ui.module.css";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const t = useT();
  return (
    <nav aria-label={t("Навигация")}>
      <ol className={ui.crumbs}>
        {items.map((it) => (
          <li key={it.label}>{it.href ? <Link href={it.href}>{it.label}</Link> : it.label}</li>
        ))}
      </ol>
    </nav>
  );
}
