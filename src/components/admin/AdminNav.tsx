"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";

const I = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const ITEMS = [
  { href: "/admin", label: "Сегодня", icon: I("M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10") },
  { href: "/admin/students", label: "Ученики", icon: I("M16 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 20v-2a4 4 0 00-3-3.9M16 3.1a3.5 3.5 0 010 6.8") },
  { href: "/admin/help", label: "Заявки", icon: I("M12 22a10 10 0 100-20 10 10 0 000 20zM9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01"), badge: true },
  { href: "/admin/content", label: "Контент", icon: I("M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zM4 19.5A2.5 2.5 0 006.5 22H20v-5") },
  { href: "/admin/stats", label: "Отчёты", icon: I("M4 20V10M10 20V4M16 20v-8M22 20H2") },
];

export function AdminNav({ openHelp }: { openHelp: number }) {
  const path = usePathname();
  const current = (href: string) => (href === "/admin" ? path === "/admin" : path === href || path.startsWith(href + "/"));
  const link = (it: (typeof ITEMS)[number], withIcon: boolean) => (
    <Link key={it.href} href={it.href} aria-current={current(it.href) ? "page" : undefined}>
      {withIcon && it.icon}
      <span>{it.label}</span>
      {it.badge && openHelp > 0 && <span className="badge" aria-label={`Ждут разбора: ${openHelp}`}>{openHelp > 99 ? "99+" : openHelp}</span>}
    </Link>
  );
  return (
    <>
      <header className="top">
        <span className="brand">БИЛ · админка</span>
        <nav className="tabs" aria-label="Разделы">{ITEMS.map((i) => link(i, false))}</nav>
        <LogoutButton />
      </header>
      <nav className="bottom" aria-label="Разделы">{ITEMS.map((i) => link(i, true))}</nav>
    </>
  );
}
