import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { listBooks } from "@/lib/student/access";

export async function GET() {
  const g = await requireAdmin(); if (g.error) return g.error;
  return NextResponse.json(await listBooks());
}
