// READ-ONLY: dump current spa/gym content.
import './_env';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { spaServices, spaSchedules, gymClasses } from '../lib/db/schema';

async function main() {
  const services = await db.select().from(spaServices);
  const schedules = await db.select().from(spaSchedules);
  const gym = await db.select().from(gymClasses);

  const byCat: Record<string, string[]> = {};
  for (const s of services) {
    (byCat[s.category] ??= []).push(`${s.name}${s.duration ? ' ['+s.duration+']' : ''}${s.price ? ' — '+s.price : ''}`);
  }
  console.log(`spa_services: ${services.length}`);
  for (const c of Object.keys(byCat)) {
    console.log(`\n[${c}] (${byCat[c].length})`);
    for (const n of byCat[c]) console.log('   - ' + n);
  }
  console.log(`\n=== spa_schedules (${schedules.length}) ===`);
  for (const s of schedules) console.log(`   ${s.venue}: ${s.hours}`);
  console.log(`\n=== gym_classes (${gym.length}) ===`);
  for (const g of gym) console.log(`   - ${g.name}${g.schedule ? ' ['+g.schedule+']' : ''}${g.price ? ' — '+g.price : ''}`);
  process.exit(0);
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
