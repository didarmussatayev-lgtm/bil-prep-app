import { prisma } from "@/lib/prisma";
import { paywallEnabled } from "@/lib/payments/config";
import { checkSession } from "@/lib/payments/kaspi";
import { listActivePlans } from "@/lib/payments/service";
import { PaymentsAdmin } from "@/components/admin/PaymentsAdmin";

const STATUS_NOTE = {
  ok: ["good", "Kaspi подключён, сессия кассира жива"],
  not_configured: ["warn", "Kaspi не настроен: задайте KASPI_POS_URL, KASPI_TOKEN_SN, KASPI_VTOKEN_SECRET (см. docs/PAYMENTS.md)"],
  session_expired: ["bad", "Сессия кассира Kaspi истекла: войдите кассиром заново в сервисе kaspi-pos и обновите KASPI_TOKEN_SN и KASPI_VTOKEN_SECRET"],
  unreachable: ["bad", "Сервис kaspi-pos недоступен: проверьте KASPI_POS_URL и что сервис запущен"],
} as const;

export default async function PaymentsPage() {
  await listActivePlans(); // создаёт тарифы-образцы при первом открытии
  const [plans, payments, kaspi, paidSum] = await Promise.all([
    prisma.plan.findMany({ orderBy: [{ order: "asc" }] }),
    prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { user: { select: { login: true } } } }),
    checkSession(),
    prisma.payment.aggregate({ where: { status: "paid", method: { not: "manual" } }, _sum: { amount: true }, _count: true }),
  ]);
  const [tone, note] = STATUS_NOTE[kaspi];

  return (
    <>
      <h1>Оплаты</h1>
      <p className={`tag ${tone}`} role="status">{note}</p>
      <p className="muted">
        Оплата для учеников {paywallEnabled() ? "включена" : "выключена (PAYWALL_ENABLED не равна true) — сайт работает как раньше"}.
        {" "}Получено через Kaspi: {(paidSum._sum.amount ?? 0).toLocaleString("ru-RU")} ₸ ({paidSum._count} платежей).
      </p>
      <PaymentsAdmin
        plans={plans.map((p) => ({ id: p.id, title: p.title, months: p.months, price: p.price, active: p.active }))}
        payments={payments.map((p) => ({
          id: p.id, login: p.user.login, amount: p.amount, months: p.months, method: p.method, status: p.status,
          note: p.note, createdAt: p.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
