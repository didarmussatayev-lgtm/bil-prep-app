import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStats } from "@/lib/admin-stats";

export async function GET() {
  const g = await requireAdmin(); if (g.error) return g.error;
  return NextResponse.json(await getStats());
}
