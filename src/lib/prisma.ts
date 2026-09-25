import { PrismaClient } from "@prisma/client";

// Next.js в dev-режиме пересоздаёт модули при каждом изменении файла,
// поэтому храним единственный экземпляр PrismaClient в global,
// чтобы не плодить подключения к БД.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
