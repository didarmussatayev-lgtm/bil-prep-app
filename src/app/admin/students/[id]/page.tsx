import { StudentCard } from "@/components/admin/StudentCard";

export default async function StudentPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }>;
}) {
  const [{ id }, { tab }] = await Promise.all([params, searchParams]);
  return <StudentCard id={id} initialTab={tab ?? "progress"} />;
}
