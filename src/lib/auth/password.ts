import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";
import { BCRYPT_ROUNDS } from "./config";

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Фиктивный хэш: если логина нет в БД, всё равно тратим время на bcrypt.compare,
// чтобы по времени ответа нельзя было отличить «нет такого логина» от «неверный пароль».
let dummyHash: string | null = null;
export async function getDummyHash(): Promise<string> {
  dummyHash ??= await bcrypt.hash("timing-equalizer", BCRYPT_ROUNDS);
  return dummyHash;
}

// Алфавит без похожих символов (0/O, 1/l/I) — пароль выдаётся ученику вручную.
const ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateTempPassword(length = 10): string {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}
