import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireApiUser } from "@/lib/auth/guards";

// POST { keys: string[] } — ученик увидел поздравления
export async function POST(req: Request) {
  try {
    const user = await requireApiUser();
    const body = await req.json().catch(() => null);
    const keys: string[] = Array.isArray(body?.keys) ? body.keys.filter((k: unknown) => typeof k === "string").slice(0, 50) : [];
    if (keys.length) await prisma.userAchievement.updateMany({ where: { userId: user.id, key: { in: keys }, seenAt: null }, data: { seenAt: new Date() } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
