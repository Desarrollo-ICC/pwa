// Removes orphaned content superseded by the Figma redesign. Backs up before deleting.
import './_env';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { roomProducts, roomInfo } from '../lib/db/schema';
import { inArray } from 'drizzle-orm';

async function main() {
  const products = await db.select().from(roomProducts);
  const info = await db.select().from(roomInfo);
  const doomed = info.filter(r => ['protocolo', 'emergencia'].includes(r.section));

  const dir = resolve(__dirname, 'backups');
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  writeFileSync(resolve(dir, `cleanup-orphans-${stamp}.json`), JSON.stringify({ roomProducts: products, roomInfoRemoved: doomed }, null, 2));
  console.log(`Backup: scripts/backups/cleanup-orphans-${stamp}.json`);

  await db.delete(roomProducts);
  await db.delete(roomInfo).where(inArray(roomInfo.section, ['protocolo', 'emergencia']));

  console.log(`Borradas: ${products.length} room_products, ${doomed.length} room_info (protocolo/emergencia)`);
  console.log(`room_info restantes: ${(await db.select().from(roomInfo)).length}`);
  process.exit(0);
}
main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
