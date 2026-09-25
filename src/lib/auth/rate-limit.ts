import { LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS } from "./config";

// In-memory лимитер. Для одного Railway-инстанса этого достаточно;
// счётчики сбрасываются при редеплое. Если появится несколько реплик — вынести в БД/Redis.
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function sweep(now: number) {
  if (buckets.size < 1000) return;
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
}

export function checkLoginRate(key: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) return { allowed: true, retryAfterSec: 0 };
  if (b.count >= LOGIN_MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

export function registerLoginFailure(key: string) {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) buckets.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  else b.count += 1;
}

export function resetLoginFailures(key: string) {
  buckets.delete(key);
}
