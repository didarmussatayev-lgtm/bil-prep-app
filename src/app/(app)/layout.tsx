import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { SessionWatcher } from "@/components/auth/SessionWatcher";
import ui from "@/components/student/ui.module.css";
import { requireSession } from "@/lib/auth/guards";

// Заменяет layout из шага 3: та же проверка сессии + оформление и шапка.
// ВАЖНО: layout не перерисовывается при переходах внутри него, поэтому каждая page.tsx
// сама вызывает requireUser().
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, expiresAt } = await requireSession();

  return (
    <div className={ui.shell}>
      <header className={ui.header}>
        <Link href="/" className={ui.brand}>Подготовка в БИЛ</Link>
        <div className={ui.headerRight}>
          <span className={ui.who}>{user.login}</span>
          <LogoutButton className={ui.btnGhost} />
        </div>
      </header>
      <SessionWatcher expiresAt={expiresAt.toISOString()} />
      {children}
    </div>
  );
}
