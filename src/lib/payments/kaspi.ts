import "server-only";

/**
 * Клиент к сервису kaspi-pos-automation (отдельный сервис на Railway).
 * Настройки — только из переменных окружения, в репозитории и в логах их нет:
 *   KASPI_POS_URL           адрес сервиса, например https://kaspi-pos.up.railway.app
 *   KASPI_TOKEN_SN          tokenSN после SMS-входа кассира
 *   KASPI_VTOKEN_SECRET     vtokenSecret оттуда же
 *   KASPI_PROFILE_ID        profileId оттуда же
 *   KASPI_WEBHOOK_SECRET    секрет подписи webhook (тот же, что в webhooks.json сервиса)
 */

export class KaspiError extends Error {
  constructor(message: string, public code: "not_configured" | "session_expired" | "upstream" | "network") {
    super(message);
  }
}

export const kaspiConfigured = () =>
  !!(process.env.KASPI_POS_URL && process.env.KASPI_TOKEN_SN && process.env.KASPI_VTOKEN_SECRET);

async function call<T>(path: string, init?: { method?: "GET" | "POST"; body?: unknown }): Promise<T> {
  if (!kaspiConfigured()) throw new KaspiError("Kaspi не настроен", "not_configured");
  const base = process.env.KASPI_POS_URL!.replace(/\/$/, "");
  const headers: Record<string, string> = {
    "X-Token-SN": process.env.KASPI_TOKEN_SN!,
    "X-Vtoken-Secret": process.env.KASPI_VTOKEN_SECRET!,
  };
  if (process.env.KASPI_PROFILE_ID) headers["X-Profile-Id"] = process.env.KASPI_PROFILE_ID;
  if (init?.body !== undefined) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      method: init?.method ?? "GET",
      headers,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
  } catch {
    throw new KaspiError("Нет связи с сервисом Kaspi", "network");
  }
  const json = (await res.json().catch(() => null)) as (T & { StatusCode?: number }) | null;
  // 401 — сервис не принял сессию; -101001 — Kaspi вытеснил сессию (кассир вошёл с другого устройства)
  if (res.status === 401 || json?.StatusCode === -101001) throw new KaspiError("Сессия Kaspi истекла: войдите кассиром заново", "session_expired");
  if (!res.ok || !json) throw new KaspiError(`Kaspi ответил ошибкой (${res.status})`, "upstream");
  return json;
}

type Envelope<D> = { StatusCode?: number; Data?: D };

export type QrCreated = { QrOperationId: number; QrToken: string; ExpireDate?: string; Amount?: number; ReceiptUrl?: string };
export type InvoiceCreated = { QrOperationId: number; Amount?: number; ReceiptUrl?: string; OrderNumber?: string; ClientMobile?: string };
export type Status = { Status?: string; StatusDesc?: string; Amount?: number; ReceiptUrl?: string };

export async function createQr(amount: number): Promise<QrCreated> {
  const r = await call<Envelope<QrCreated>>("/api/qr/create", { method: "POST", body: { amount } });
  if (!r.Data?.QrOperationId) throw new KaspiError("Kaspi не создал QR", "upstream");
  return r.Data;
}

export async function createInvoice(phone: string, amount: number, comment: string): Promise<InvoiceCreated> {
  const r = await call<Envelope<InvoiceCreated>>("/api/invoice/create", { method: "POST", body: { phoneNumber: phone, amount, comment } });
  if (!r.Data?.QrOperationId) throw new KaspiError("Kaspi не выставил счёт", "upstream");
  return r.Data;
}

export async function getStatus(kind: "qr" | "invoice", id: string): Promise<Status> {
  const r = await call<Envelope<Status>>(
    kind === "qr" ? `/api/qr/status?qrOperationId=${encodeURIComponent(id)}` : `/api/invoice/details?operationId=${encodeURIComponent(id)}`,
  );
  return r.Data ?? {};
}

/** Проверка, что сессия кассира жива (для админки). */
export async function checkSession(): Promise<"ok" | "not_configured" | "session_expired" | "unreachable"> {
  try {
    await call("/api/invoice/history", { method: "POST", body: {} });
    return "ok";
  } catch (e) {
    if (e instanceof KaspiError) return e.code === "not_configured" ? "not_configured" : e.code === "session_expired" ? "session_expired" : "unreachable";
    return "unreachable";
  }
}

/** Итоговые статусы Kaspi (как в kaspi-pos-automation/src/polling.js). */
const FAILED = new Set([
  "CancelledByUser", "NotConfirmedByUser", "CancelledByExternalSource", "ProcessingFailed", "Rejected", "InsufficientFunds",
  "InsufficientFundsError", "Error", "RemotePaymentCanceled", "RemotePaymentRejected",
]);
const EXPIRED = new Set(["QrTokenDiscarded", "Expired"]);

export function classify(status: string | undefined): "paid" | "failed" | "expired" | "pending" {
  if (status === "Processed") return "paid";
  if (status && EXPIRED.has(status)) return "expired";
  if (status && (FAILED.has(status) || /^Iris(Src|Dest)BlockCode/.test(status))) return "failed";
  return "pending";
}
