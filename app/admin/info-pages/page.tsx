import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import InfoPagesAdminClient from "./InfoPagesAdminClient";
import { db } from "@/lib/db";
import { infoPages } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function InfoPagesAdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const blocks = await db.select().from(infoPages).orderBy(asc(infoPages.page), asc(infoPages.order));

  return (
    <AdminShell>
      <InfoPagesAdminClient initialBlocks={blocks} />
    </AdminShell>
  );
}
