import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { ENTITIES } from "@/lib/content-schemas";

type Ctx = { params: Promise<{ entity: string; id: string }> };
const delegate = (model: string) => (prisma as any)[model];

export async function PUT(req: Request, { params }: Ctx) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { entity, id } = await params;
  const cfg = ENTITIES[entity];
  if (!cfg) return NextResponse.json({ error: "unknown entity" }, { status: 404 });
  const parsed = cfg.schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(await delegate(cfg.model).update({ where: { id }, data: parsed.data }));
}

// Каскадное удаление (раздел → темы → задачи) задаётся в schema.prisma через onDelete: Cascade
export async function DELETE(_: Request, { params }: Ctx) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { entity, id } = await params;
  const cfg = ENTITIES[entity];
  if (!cfg) return NextResponse.json({ error: "unknown entity" }, { status: 404 });
  await delegate(cfg.model).delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
