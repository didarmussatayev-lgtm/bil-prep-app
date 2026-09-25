/**
 * Создаёт (или обновляет пароль у) администратора. Запуск:
 *   ADMIN_LOGIN=admin ADMIN_PASSWORD='длинный-пароль' npx tsx scripts/create-admin.ts
 * На Railway: railway run npx tsx scripts/create-admin.ts (с теми же переменными).
 */
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth/password";

async function main() {
  const login = process.env.ADMIN_LOGIN?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!login || !password || password.length < 12) {
    console.error("Задайте ADMIN_LOGIN и ADMIN_PASSWORD (не короче 12 символов).");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { login },
    update: { passwordHash, role: "admin" },
    create: { login, passwordHash, role: "admin" },
  });

  // если пароль меняли — старые сессии этого админа больше не действуют
  await prisma.session.updateMany({
    where: { userId: user.id, revoked: false },
    data: { revoked: true, revokedReason: "password_reset" },
  });

  console.log(`Готово: администратор "${login}" (id: ${user.id}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
