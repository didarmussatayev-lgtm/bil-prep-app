import Link from "next/link";
import ui from "./ui.module.css";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Навигация">
      <ol className={ui.crumbs}>
        {items.map((it) => (
          <li key={it.label}>{it.href ? <Link href={it.href}>{it.label}</Link> : it.label}</li>
        ))}
      </ol>
    </nav>
  );
}
