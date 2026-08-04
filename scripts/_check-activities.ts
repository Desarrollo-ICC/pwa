// READ-ONLY: dump current activities grouped by season/category.
import './_env';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { activities } from '../lib/db/schema';

async function main() {
  const acts = await db.select().from(activities);
  const bySeason: Record<string, Record<string, string[]>> = {};
  for (const a of acts) {
    (bySeason[a.season] ??= {});
    (bySeason[a.season][a.category] ??= []).push(`${a.name}${a.price ? ' — '+a.price : ' (gratis)'}`);
  }
  console.log(`activities: ${acts.length}`);
  for (const s of Object.keys(bySeason)) {
    console.log(`\n########## ${s.toUpperCase()} ##########`);
    for (const c of Object.keys(bySeason[s])) {
      console.log(`\n[${c}] (${bySeason[s][c].length})`);
      for (const n of bySeason[s][c]) console.log('   - ' + n);
    }
  }
  process.exit(0);
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
