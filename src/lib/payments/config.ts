import "server-only";

/** Оплата доступа включена только при PAYWALL_ENABLED=true. Пока не включена — сайт работает как раньше. */
export const paywallEnabled = () => process.env.PAYWALL_ENABLED === "true";

/** Сколько живёт неоплаченный счёт у нас (QR от Kaspi обычно живёт дольше — ориентируемся на меньшее). */
export const PAYMENT_TTL_MS = 15 * 60 * 1000;

/** Сколько неоплаченных попыток подряд можно держать открытыми (защита от спама счетами). */
export const MAX_PENDING_PER_USER = 3;
