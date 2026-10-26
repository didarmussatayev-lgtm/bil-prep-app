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
          {user.role === "student" && <GamificationHost />}
          <Link href="/account/password" className={ui.who} title={t("Смена пароля")}>{user.login}</Link>
          <LangSwitch className={ui.iconBtn} />
          <ThemeToggle className={ui.iconBtn} />
          <LogoutButton className={ui.btnGhost} />
        </div>
      </header>
      <SessionWatcher expiresAt={expiresAt.toISOString()} />
      {children}
    </div>
  );
}
