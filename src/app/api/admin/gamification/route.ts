import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { backfill } from "@/lib/gamification/engine";

// POST — разовое начисление XP и достижений за прошлую работу всех учеников (безопасно повторять)
export async function POST() {
  const g = await requireAdmin(); if (g.error) return g.error;
  const students = await prisma.user.findMany({ where: { role: "student" }, select: { id: true } });
  let xpRows = 0, achievements = 0;
  for (const s of students) {
    const r = await backfill(s.id);
    xpRows += r.xpRows; achievements += r.achievements;
  }
  return NextResponse.json({ students: students.length, xpRows, achievements });
}
