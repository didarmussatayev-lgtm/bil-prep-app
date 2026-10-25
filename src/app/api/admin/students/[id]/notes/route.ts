import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const MAX = 4000;

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id } = await params;
  const notes = await prisma.studentNote.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, select: { id: true, text: true, createdAt: true, updatedAt: true } });
  return NextResponse.json(notes);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { id } = await params;
  const text = String((await req.json().catch(() => null))?.text ?? "").trim().slice(0, MAX);
  if (!text) return NextResponse.json({ error: "Заметка пустая" }, { status: 400 });
  if (!(await prisma.user.findFirst({ where: { id, role: "student" }, select: { id: true } })))
    return NextResponse.json({ error: "not found" }, { status: 404 });
  const note = await prisma.studentNote.create({ data: { userId: id, text }, select: { id: true, text: true, createdAt: true, updatedAt: true } });
  return NextResponse.json(note, { status: 201 });
}
