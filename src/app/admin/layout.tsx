import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { SessionWatcher } from "@/components/auth/SessionWatcher";
import { requireAdmin, requireSession } from "@/lib/auth/guards";
import "./admin.css";

// requireAdmin() здесь — постраничный гард из шага 3 (redirect на /login или /),
// а не адаптер lib/admin.ts (тот — только для API-роутов админки).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const { expiresAt } = await requireSession();
  return (
    <div className="adm">
      <nav>
        <Link href="/admin/students">Ученики</Link>
        <Link href="/admin/content">Контент</Link>
        <Link href="/admin/stats">Статистика</Link>
        <span className="grow" />
        <LogoutButton />
      </nav>
      <SessionWatcher expiresAt={expiresAt.toISOString()} />
      <main>{children}</main>
    </div>
  );
}
