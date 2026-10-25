import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { ENTITIES } from "@/lib/content-schemas";
import { recalcTopicCounts } from "@/lib/student/topic-counts";

type Ctx = { params: Promise<{ entity: string; id: string }> };
const delegate = (model: string) => (prisma as any)[model];

export async function GET(_: Request, { params }: Ctx) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { entity, id } = await params;
  const cfg = ENTITIES[entity];
  if (!cfg) return NextResponse.json({ error: "unknown entity" }, { status: 404 });
  const row = await delegate(cfg.model).findUnique({ where: { id } });
  return row ? NextResponse.json(row) : NextResponse.json({ error: "not found" }, { status: 404 });
}

export async function PUT(req: Request, { params }: Ctx) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { entity, id } = await params;
  const cfg = ENTITIES[entity];
  if (!cfg) return NextResponse.json({ error: "unknown entity" }, { status: 404 });
  const parsed = cfg.schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const updated = await delegate(cfg.model).update({ where: { id }, data: parsed.data });
  if (entity === "tasks") await recalcTopicCounts([updated.topicId]); // счётчики задач по темам (кэш)
  return NextResponse.json(updated);
}

// Каскадное удаление (раздел → темы → задачи) задаётся в schema.prisma через onDelete: Cascade
export async function DELETE(_: Request, { params }: Ctx) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { entity, id } = await params;
  const cfg = ENTITIES[entity];
  if (!cfg) return NextResponse.json({ error: "unknown entity" }, { status: 404 });
  const before = entity === "tasks" ? await prisma.task.findUnique({ where: { id }, select: { topicId: true } }) : null;
  await delegate(cfg.model).delete({ where: { id } });
  if (before) await recalcTopicCounts([before.topicId]);
  return NextResponse.json({ ok: true });
}

/** Быстрые правки без полной формы: { hidden?: boolean, order?: number } — «скрыть/показать» и порядок. */
export async function PATCH(req: Request, { params }: Ctx) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const { entity, id } = await params;
  const cfg = ENTITIES[entity];
  if (!cfg) return NextResponse.json({ error: "unknown entity" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const data: Record<string, unknown> = {};
  if (typeof body?.hidden === "boolean" && (entity === "topics" || entity === "tasks")) data.hidden = body.hidden;
  if (Number.isInteger(body?.order) && entity !== "subjects") data.order = body.order;
  if (!Object.keys(data).length) return NextResponse.json({ error: "Нечего менять" }, { status: 400 });
  const updated = await delegate(cfg.model).update({ where: { id }, data });
  if (entity === "tasks" && "hidden" in data) await recalcTopicCounts([updated.topicId]);
  return NextResponse.json(updated);
}
