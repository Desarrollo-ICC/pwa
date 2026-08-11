import './_env';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import * as S from '../lib/db/schema';

(async () => {
  const tables: [string, any][] = [
    ['alerts', S.alerts], ['events', S.events],
    ['spaServices', S.spaServices], ['spaSchedules', S.spaSchedules], ['gymClasses', S.gymClasses],
    ['restaurantItems', S.restaurantItems], ['restaurantSchedules', S.restaurantSchedules],
    ['activities', S.activities], ['familyPrograms', S.familyPrograms],
    ['roomProducts', S.roomProducts], ['roomInfo', S.roomInfo],
    ['systemSettings', S.systemSettings], ['admins', S.admins],
  ];
  const dump: Record<string, unknown[]> = {};
  for (const [name, t] of tables) {
    try { dump[name] = await db.select().from(t); } catch (e: any) { dump[name] = [`ERROR: ${e.message}`]; }
  }
  const dir = resolve(__dirname, 'backups'); mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const f = resolve(dir, `PROD-FULL-${stamp}.json`);
  writeFileSync(f, JSON.stringify(dump, null, 2));
  console.log('Respaldo:', f);
  for (const k of Object.keys(dump)) console.log(`  ${k.padEnd(22)} ${Array.isArray(dump[k]) ? dump[k].length : '?'} filas`);
  process.exit(0);
})();
