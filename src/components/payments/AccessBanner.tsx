import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getT } from "@/lib/i18n/server";
import { paywallEnabled } from "@/lib/payments/config";
import styles from "@/components/student/gami.module.css";
import ui from "@/components/student/ui.module.css";

/** Плашка на главной: доступ закрыт / скоро закончится. Невидима, пока оплата выключена или у ученика бесплатный доступ. */
export async function AccessBanner({ userId }: { userId: string }) {
  if (!paywallEnabled()) return null;
  const [t, u] = [await getT(), await prisma.user.findUnique({ where: { id: userId }, select: { freeAccess: true, accessUntil: true } })];
  if (!u || u.freeAccess) return null;

  const left = u.accessUntil ? u.accessUntil.getTime() - Date.now() : 0;
  if (left > 7 * 24 * 3600 * 1000) return null;
  const days = Math.ceil(left / (24 * 3600 * 1000));

  return (
    <section className={styles.hero} style={left > 0 ? { background: "var(--warn)", boxShadow: "0 5px 0 color-mix(in srgb, var(--warn) 70%, black)" } : undefined}>
      <div className={styles.heroText}>
        <p className={styles.heroKicker}>{left > 0 ? t("Доступ скоро закончится") : t("Доступ закрыт")}</p>
        <p className={styles.heroTitle}>{left > 0 ? t("Осталось дней: {n}", { n: days }) : t("Оплатите тариф, чтобы открыть уроки")}</p>
      </div>
      <Link href="/account/subscription" className={ui.btnHero}>{left > 0 ? t("Продлить") : t("Оплатить")}</Link>
    </section>
  );
}
