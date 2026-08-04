// READ-ONLY: dump current family_programs.
import './_env';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { familyPrograms } from '../lib/db/schema';

async function main() {
  const progs = await db.select().from(familyPrograms);
  const grp: Record<string, string[]> = {};
  for (const p of progs) {
    const k = `${p.type} / ${p.season ?? 'sin-temporada'}`;
    (grp[k] ??= []).push(`${p.name}${p.schedule ? ' ['+p.schedule+']' : ''}`);
  }
  console.log(`family_programs: ${progs.length}`);
  for (const k of Object.keys(grp)) {
    console.log(`\n[${k}] (${grp[k].length})`);
    for (const n of grp[k]) console.log('   - ' + n);
  }
  process.exit(0);
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
