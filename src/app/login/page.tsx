import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getT } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { LoginForm } from "./LoginForm";

const NOTICES: Record<string, string> = {
  expired: "Сессия закончилась через 8 часов. Войдите снова.",
  replaced: "В аккаунт вошли с другого устройства, поэтому эта сессия завершена.",
  admin: "Администратор завершил вашу сессию. Войдите снова.",
  password_reset: "Пароль был изменён. Войдите с новым паролем.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  // уже вошёл — на главную (сюда попадает только валидная сессия, зацикливания нет)
  const s = await getSession();
  if (s.ok) redirect(s.user.role === "admin" ? "/admin" : "/");

  const { reason } = await searchParams;
  const t = await getT();
  // настоящие цифры курса для первого экрана; без базы страница входа всё равно открывается
  const stats = await Promise.all([prisma.topic.count({ where: { hidden: false } }), prisma.task.count()])
    .then(([topics, tasks]) => ({ topics, tasks }))
    .catch(() => null);
  return <LoginForm notice={reason && NOTICES[reason] ? t(NOTICES[reason]) : undefined} stats={stats} />;
}
