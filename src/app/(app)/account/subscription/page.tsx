import Link from "next/link";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/student/Breadcrumbs";
import { PayPanel } from "@/components/payments/PayPanel";
import ui from "@/components/student/ui.module.css";
import { requireUser } from "@/lib/auth/guards";
import { getT } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { paywallEnabled } from "@/lib/payments/config";
import { kaspiConfigured } from "@/lib/payments/kaspi";
import { listActivePlans } from "@/lib/payments/service";

const fmtDate = (d: Date) => d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

export default async function SubscriptionPage() {
  const user = await requireUser();
  if (user.role === "admin") redirect("/admin/payments");
  const t = await getT();
  if (!paywallEnabled()) redirect("/");

  const [u, plans, history] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id }, select: { freeAccess: true, accessUntil: true } }),
    listActivePlans(),
    prisma.payment.findMany({ where: { userId: user.id, status: "paid" }, orderBy: { paidAt: "desc" }, take: 5, select: { id: true, amount: true, months: true, paidAt: true } }),
  ]);
  const until = u?.accessUntil && u.accessUntil.getTime() > Date.now() ? u.accessUntil : null;

  return (
    <main className={ui.container}>
      <Breadcrumbs items={[{ label: t("Подготовка в БИЛ"), href: "/" }, { label: t("Доступ") }]} />
      <h1 className={ui.h1}>{t("Доступ к урокам")}</h1>

      {u?.freeAccess ? (
        <p className={ui.callout}>{t("У вас бесплатный доступ. Платить не нужно.")}</p>
      ) : until ? (
        <p className={ui.callout}>{t("Доступ открыт до {d}. Оплата продлит его.", { d: fmtDate(until) })}</p>
      ) : (
        <p className={ui.callout}>{t("Доступ закрыт. Выберите тариф и оплатите через Kaspi — уроки откроются сразу.")}</p>
      )}

      {!u?.freeAccess && (kaspiConfigured() ? (
        <PayPanel plans={plans.map((p) => ({ id: p.id, title: p.title, months: p.months, price: p.price }))} />
      ) : (
        <p className={ui.callout}>{t("Оплата через Kaspi сейчас недоступна. Напишите администратору — он откроет доступ вручную.")}</p>
      ))}

      {history.length > 0 && (
        <>
          <h2 className={ui.h2}>{t("Прошлые оплаты")}</h2>
          <ul className={ui.historyList}>
            {history.map((h) => (
              <li key={h.id}>
                <span>{h.paidAt ? fmtDate(h.paidAt) : ""}</span>
                <span>{h.amount.toLocaleString("ru-RU")} ₸ · {h.months} {t("мес.")}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className={ui.muted}><Link href="/">{t("Назад")}</Link></p>
    </main>
  );
}
