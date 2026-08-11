import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { infoPages } from "@/lib/db/schema";
import { asc, eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/info-pages            → all blocks (all pages)
// GET /api/info-pages?page=slug  → blocks for one page
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  const rows = page
    ? await db.select().from(infoPages).where(and(eq(infoPages.page, page), eq(infoPages.active, true))).orderBy(asc(infoPages.order))
    : await db.select().from(infoPages).orderBy(asc(infoPages.page), asc(infoPages.order));

  return NextResponse.json({ blocks: rows });
}
