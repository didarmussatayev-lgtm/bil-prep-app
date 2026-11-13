import "server-only";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/auth/guards";
import { MAX_PENDING_PER_USER, PAYMENT_TTL_MS } from "./config";
import { classify, createInvoice, createQr, getStatus, KaspiError } from "./kaspi";

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

const DEFAULT_PLANS = [
  { title: "1 месяц", months: 1, price: 5000, order: 1 },
  { title: "3 месяца", months: 3, price: 12000, order: 2 },
  { title: "6 месяцев", months: 6, price: 20000, order: 3 },
];

/** Тарифы для витрины. Если таблица пуста — создаёт три тарифа-образца (цены правятся в админке). */
export async function listActivePlans() {
  if ((await prisma.plan.count()) === 0) await prisma.plan.createMany({ data: DEFAULT_PLANS });
  return prisma.plan.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { price: "asc" }] });
}

/** Начисляет месяцы подписки: от текущей даты окончания (если она в будущем) или от сегодня. */
export async function extendAccess(userId: string, months: number) {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { accessUntil: true } });
  const from = u?.accessUntil && u.accessUntil.getTime() > Date.now() ? u.accessUntil.getTime() : Date.now();
  return prisma.user.update({ where: { id: userId }, data: { accessUntil: new Date(from + months * MONTH_MS) }, select: { accessUntil: true } });
}

/**
 * Переводит платёж в итоговый статус. Для paid делается ровно один раз (updateMany по status=pending/lost):
 * и webhook, и опрос со страницы могут прийти одновременно — доступ продлится один раз.
 */
export async function settle(
  paymentId: string,
  to: "paid" | "failed" | "expired" | "lost",
  extra: { kaspiStatus?: string; receiptUrl?: string; note?: string } = {},
) {
  const data = {
    status: to,
    kaspiStatus: extra.kaspiStatus,
    ...(extra.receiptUrl ? { receiptUrl: extra.receiptUrl } : {}),
    ...(extra.note ? { note: extra.note } : {}),
    ...(to === "paid" ? { paidAt: new Date() } : {}),
  };
  const res = await prisma.payment.updateMany({ where: { id: paymentId, status: { in: ["pending", "lost"] } }, data });
  if (res.count === 0) return false;
  if (to === "paid") {
    const p = await prisma.payment.findUnique({ where: { id: paymentId }, select: { userId: true, months: true } });
    if (p) await extendAccess(p.userId, p.months);
  }
  return true;
}

/** Создаёт платёж и счёт в Kaspi. */
export async function startPayment(userId: string, input: { planId: string; method: "qr" | "invoice"; phone?: string }) {
  const plan = await prisma.plan.findFirst({ where: { id: input.planId, active: true } });
  if (!plan) throw new ApiError(404, "Тариф не найден");

  const open = await prisma.payment.count({ where: { userId, status: "pending", createdAt: { gt: new Date(Date.now() - PAYMENT_TTL_MS) } } });
  if (open >= MAX_PENDING_PER_USER) throw new ApiError(429, "Слишком много неоплаченных счетов. Оплатите открытый или подождите 15 минут.");

  let phone: string | undefined;
  if (input.method === "invoice") {
    phone = (input.phone ?? "").replace(/\D/g, "");
    if (phone.length === 11 && /^[78]/.test(phone)) phone = phone.slice(1);
    if (!/^7\d{9}$/.test(phone)) throw new ApiError(400, "Введите номер Kaspi в формате 7001234567");
  }

  let kaspi: { id: string; link?: string; receipt?: string; expires?: Date };
  try {
    if (input.method === "qr") {
      const q = await createQr(plan.price);
      kaspi = { id: String(q.QrOperationId), link: q.QrToken, receipt: q.ReceiptUrl, expires: q.ExpireDate ? new Date(q.ExpireDate) : undefined };
    } else {
      const i = await createInvoice(phone!, plan.price, `Доступ: ${plan.title}`);
      kaspi = { id: String(i.QrOperationId), receipt: i.ReceiptUrl };
    }
  } catch (e) {
    if (e instanceof KaspiError) {
      console.error("[payments] kaspi:", e.code, e.message);
      throw new ApiError(e.code === "session_expired" || e.code === "not_configured" ? 503 : 502, "Оплата временно недоступна. Напишите администратору — он откроет доступ вручную.");
    }
    throw e;
  }

  return prisma.payment.create({
    data: {
      userId, planId: plan.id, months: plan.months, amount: plan.price, method: input.method,
      kaspiId: kaspi.id, payLink: kaspi.link, phone, receiptUrl: kaspi.receipt,
      expiresAt: new Date(Date.now() + PAYMENT_TTL_MS),
    },
  });
}

/** Свежий статус платежа: если ещё pending — спрашиваем Kaspi (опрос со страницы), иначе отдаём из базы. */
export async function refreshPayment(paymentId: string, userId: string) {
  let p = await prisma.payment.findFirst({ where: { id: paymentId, userId } });
  if (!p) throw new ApiError(404, "Платёж не найден");
  if (p.status !== "pending" || !p.kaspiId || p.method === "manual") return p;

  try {
    const st = await getStatus(p.method === "qr" ? "qr" : "invoice", p.kaspiId);
    const kind = classify(st.Status);
    if (kind !== "pending") {
      await settle(p.id, kind, { kaspiStatus: st.Status, receiptUrl: st.ReceiptUrl });
    } else if (p.expiresAt && p.expiresAt.getTime() < Date.now()) {
      await settle(p.id, "expired", { kaspiStatus: st.Status });
    }
  } catch (e) {
    if (!(e instanceof KaspiError)) throw e;
    // нет связи с Kaspi — не меняем статус, webhook или следующий опрос догонят
  }
  p = await prisma.payment.findFirst({ where: { id: paymentId, userId } });
  return p!;
}
