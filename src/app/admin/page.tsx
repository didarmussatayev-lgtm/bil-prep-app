import { redirect } from "next/navigation";

// /admin сам по себе не рендерит ничего — только layout.tsx (шапка с навигацией).
// Стартовая страница админки — список учеников.
export default function AdminIndexPage() {
  redirect("/admin/students");
}
