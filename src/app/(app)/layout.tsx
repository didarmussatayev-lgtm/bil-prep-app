import Link from "next/link";
import { GamificationHost } from "@/components/student/GamificationHost";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { LangSwitch } from "@/components/auth/LangSwitch";
import { ThemeToggle } from "@/components/auth/ThemeToggle";
import { SessionWatcher } from "@/components/auth/SessionWatcher";
import ui from "@/components/student/ui.module.css";
import { getT } from "@/lib/i18n/server";
import { requireSession } from "@/lib/auth/guards";

// Заменяет layout из шага 3: та же проверка сессии + оформление и шапка.
// ВАЖНО: layout не перерисовывается при переходах внутри него, поэтому каждая page.tsx
// сама вызывает requireUser().
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, expiresAt } = await requireSession();

  const t = await getT();
  return (
    <div className={ui.shell}>
      <header className={ui.header}>
        <Link href="/" className={ui.brand}>{t("Подготовка в БИЛ")}</Link>
        <div className={ui.headerRight}>
          <Link href="/search" className={ui.iconBtn} aria-label={t("Поиск по темам")} title={t("Поиск по темам")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </Link>
          {user.role === "student" && <GamificationHost />}
          <Link href="/account/password" className={ui.who} title={t("Смена пароля")}><span className={ui.whoInit} aria-hidden="true">{user.login.slice(0, 1)}</span><span className={ui.whoText}>{user.login}</span></Link>
          <LangSwitch />
          <ThemeToggle className={`${ui.iconBtn} ${ui.themeBtn}`} />
          <LogoutButton className={ui.btnGhost} />
        </div>
      </header>
      <SessionWatcher expiresAt={expiresAt.toISOString()} />
      {children}
    </div>
  );
}
