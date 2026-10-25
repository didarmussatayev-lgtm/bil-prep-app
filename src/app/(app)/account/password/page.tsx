import Link from "next/link";
import { PasswordForm } from "@/components/auth/PasswordForm";
import ui from "@/components/student/ui.module.css";
import { requireUser } from "@/lib/auth/guards";
import { getT } from "@/lib/i18n/server";

export default async function PasswordPage() {
  const user = await requireUser();
  const t = await getT();
  return (
    <main className={ui.container}>
      <h1 className={ui.h1}>{t("Смена пароля")}</h1>
      <p className={ui.lead}>{t("После смены на других устройствах придётся войти заново.")}</p>
      <PasswordForm minLen={user.role === "admin" ? 12 : 8} />
      <p className={ui.muted}><Link href={user.role === "admin" ? "/admin" : "/"}>{t("Назад")}</Link></p>
    </main>
  );
}
