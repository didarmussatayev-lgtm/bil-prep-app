import "server-only";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { DEMO_LOGIN, DEMO_PASSWORD } from "@/lib/site-info";

const demoData = async () => ({ passwordHash: await hashPassword(DEMO_PASSWORD), role: "student" as const, isDemo: true, freeAccess: true, restrictAccess: false });

/**
 * Гарантирует, что демо-аккаунт student/student существует (создаёт при первом открытии страницы входа).
 * Существующий демо-аккаунт не трогает; обычного ученика с логином student не перезаписывает.
 */
export async function ensureDemoUser(): Promise<void> {
  const u = await prisma.user.findUnique({ where: { login: DEMO_LOGIN }, select: { id: true } });
  if (u) return;
  try {
    await prisma.user.create({ data: { login: DEMO_LOGIN, ...(await demoData()) } });
  } catch {
    /* параллельный запрос уже создал */
  }
}

/** Сброс демо к исходному состоянию (кнопка в админке). Возвращает false, если логин занят обычным учеником. */
export async function resetDemoUser(): Promise<boolean> {
  const existing = await prisma.user.findUnique({ where: { login: DEMO_LOGIN }, select: { id: true, isDemo: true } });
  if (existing && !existing.isDemo) return false;
  const data = await demoData();
  const u = existing ? await prisma.user.update({ where: { id: existing.id }, data }) : await prisma.user.create({ data: { login: DEMO_LOGIN, ...data } });
  await prisma.userBookAccess.deleteMany({ where: { userId: u.id } });
  return true;
}
