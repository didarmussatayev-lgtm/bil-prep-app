import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { renderStudentReport } from "@/lib/student-report";

export const runtime = "nodejs";

// GET /api/admin/students/:id/report?notes=1 — PDF-отчёт об ученике (notes=1 добавляет заметки преподавателя)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id } = await params;
  const r = await renderStudentReport(id, { notes: new URL(req.url).searchParams.get("notes") === "1" });
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });
  return new NextResponse(new Uint8Array(r.pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="report-${r.login.replace(/[^\w.-]/g, "_")}-${new Date().toISOString().slice(0, 10)}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
