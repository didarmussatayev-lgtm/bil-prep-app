import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { autoSlug, ENTITIES } from "@/lib/content-schemas";

type Ctx = { params: Promise<{ entity: string }> };
const delegate = (model: string) => (prisma as any)[model];

export async function GET(req: Request, { params }: Ctx) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const cfg = ENTITIES[(await params).entity];
  if (!cfg) return NextResponse.json({ error: "unknown entity" }, { status: 404 });
  const sp = new URL(req.url).searchParams;
  const where: Record<string, string> = {};
  for (const k of cfg.filters) { const v = sp.get(k); if (v) where[k] = v; }
  return NextResponse.json(await delegate(cfg.model).findMany({ where, orderBy: cfg.orderBy }));
}

export async function POST(req: Request, { params }: Ctx) {
  const g = await requireAdmin(); if (g.error) return g.error;
  const cfg = ENTITIES[(await params).entity];
  if (!cfg) return NextResponse.json({ error: "unknown entity" }, { status: 404 });
  const parsed = cfg.schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  // slug обязателен в БД, а в форме админки его нет — подставляем случайный на создании.
  const data = { ...(parsed.data as Record<string, unknown>) };
  if (cfg.slugPrefix && !data.slug) data.slug = autoSlug(cfg.slugPrefix);
  return NextResponse.json(await delegate(cfg.model).create({ data }), { status: 201 });
}
