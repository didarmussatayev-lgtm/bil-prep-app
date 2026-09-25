import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { revokeUserSessions } from "@/lib/auth/session";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id } = await params;
  const revoked = await revokeUserSessions(id, "admin");
  return NextResponse.json({ revoked });
}
