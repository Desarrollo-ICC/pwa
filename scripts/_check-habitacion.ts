// READ-ONLY: dump current room_products and room_info.
import './_env';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { roomProducts, roomInfo } from '../lib/db/schema';

async function main() {
  const products = await db.select().from(roomProducts);
  const info = await db.select().from(roomInfo);

  const byCat: Record<string, string[]> = {};
  for (const p of products) (byCat[p.category] ??= []).push(`${p.name}${p.price ? ' — '+p.price : ''}`);
  console.log(`room_products: ${products.length}`);
  for (const c of Object.keys(byCat)) {
    console.log(`\n[${c}] (${byCat[c].length})`);
    for (const n of byCat[c]) console.log('   - ' + n);
  }

  const bySec: Record<string, string[]> = {};
  for (const i of info) (bySec[i.section] ??= []).push(`${i.title}${(i.content||'').length ? ' ('+(i.content||'').length+' chars)' : ''}`);
  console.log(`\n\nroom_info: ${info.length}`);
  for (const s of Object.keys(bySec)) {
    console.log(`\n<${s}> (${bySec[s].length})`);
    for (const n of bySec[s]) console.log('   - ' + n);
  }
  process.exit(0);
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
