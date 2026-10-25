import { NextResponse } from "next/server";
import { normLang } from "@/lib/i18n/config";
import { requireAdmin } from "@/lib/admin";
import { renderStudentReport } from "@/lib/student-report";

export const runtime = "nodejs";

// GET /api/admin/students/:id/report?notes=1&lang=ru|kk — PDF-отчёт об ученике (notes=1 добавляет заметки преподавателя)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id } = await params;
  const sp = new URL(req.url).searchParams;
  const r = await renderStudentReport(id, { notes: sp.get("notes") === "1", lang: normLang(sp.get("lang")) });
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });
  return new NextResponse(new Uint8Array(r.pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${r.filePrefix}-${r.login.replace(/[^\w.-]/g, "_")}-${new Date().toISOString().slice(0, 10)}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
