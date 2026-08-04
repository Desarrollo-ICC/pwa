import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { infoPages } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getSession() {
  const session = await auth();
  return session?.user ? session : null;
}

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const blocks = await db.select().from(infoPages).orderBy(asc(infoPages.page), asc(infoPages.order));
  return NextResponse.json({ blocks });
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  const [created] = await db.insert(infoPages).values({
    page: body.page,
    pageTitle: body.pageTitle,
    block: body.block ?? "text",
    title: body.title ?? null,
    content: body.content ?? null,
    image: body.image ?? null,
    active: body.active ?? true,
    order: body.order ?? 0,
  }).returning();
  return NextResponse.json({ block: created });
}

export async function PATCH(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id requerido" }, { status: 400 });
  const [updated] = await db.update(infoPages).set({
    page: body.page,
    pageTitle: body.pageTitle,
    block: body.block,
    title: body.title ?? null,
    content: body.content ?? null,
    image: body.image ?? null,
    active: body.active,
    order: body.order,
  }).where(eq(infoPages.id, body.id)).returning();
  return NextResponse.json({ block: updated });
}

export async function DELETE(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });
  await db.delete(infoPages).where(eq(infoPages.id, id));
  return NextResponse.json({ ok: true });
}
