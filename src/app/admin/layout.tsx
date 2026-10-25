import { SessionWatcher } from "@/components/auth/SessionWatcher";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin, requireSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import "./admin.css";

// requireAdmin() здесь — постраничный гард из шага 3 (redirect на /login или /),
// а не адаптер lib/admin.ts (тот — только для API-роутов админки).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const { expiresAt } = await requireSession();
  const openHelp = await prisma.helpRequest.count({ where: { status: "open" } });
  return (
    <div className="adm">
      <AdminNav openHelp={openHelp} />
      <SessionWatcher expiresAt={expiresAt.toISOString()} />
      <main>{children}</main>
    </div>
  );
}
