import { StudentsView } from "@/components/admin/StudentsView";

export default async function StudentsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return <StudentsView initial={{ activity: sp.activity ?? "all", progress: sp.progress ?? "all", book: sp.book ?? "" }} />;
}
