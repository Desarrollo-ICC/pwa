import './_env';
import { db } from '../lib/db/index';
import { spaSchedules } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
(async () => {
  const all = await db.select().from(spaSchedules);
  console.log('antes:', all.map(s => `${s.venue}=${s.hours}`).join(' | '));
  const seen = new Set<string>();
  for (const s of all) {
    if (seen.has(s.venue)) { await db.delete(spaSchedules).where(eq(spaSchedules.id, s.id)); }
    else seen.add(s.venue);
  }
  const after = await db.select().from(spaSchedules);
  console.log('después:', after.map(s => `${s.venue}=${s.hours}`).join(' | '));
  process.exit(0);
})();
