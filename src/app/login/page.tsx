import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
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
  return <LoginForm notice={reason ? NOTICES[reason] : undefined} />;
}
