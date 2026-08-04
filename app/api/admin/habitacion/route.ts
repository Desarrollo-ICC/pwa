import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { roomInfo } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";

async function getSession() {
  const session = await auth();
  if (!session) return null;
  const role = (session.user as { role?: string })?.role;
  const module = (session.user as { module?: string })?.module;
  if (role !== "superadmin" && module !== "habitacion") return null;
  return session;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [info] = await db.insert(roomInfo).values({ section: body.section, title: body.title, content: body.content, order: body.order ?? 99 }).returning();
  await logAction({ type: "admin", action: "create_item", module: "habitacion", actorName: session.user?.name, actorEmail: session.user?.email, details: `Creó info habitación: ${body.title}` });
  return NextResponse.json({ info });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [info] = await db.update(roomInfo).set({ section: body.section, title: body.title, content: body.content }).where(eq(roomInfo.id, body.id)).returning();
  await logAction({ type: "admin", action: "update_item", module: "habitacion", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó info: ${body.title}` });
  return NextResponse.json({ info });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await db.delete(roomInfo).where(eq(roomInfo.id, body.id));
  await logAction({ type: "admin", action: "delete_item", module: "habitacion", actorName: session.user?.name, actorEmail: session.user?.email, details: `Eliminó info id:${body.id}` });
  return NextResponse.json({ ok: true });
}
