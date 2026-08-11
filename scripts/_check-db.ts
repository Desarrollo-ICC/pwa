// READ-ONLY diagnostic — verifies DB connectivity and shows current restaurant content counts.
import './_env';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { restaurantItems, restaurantSchedules } from '../lib/db/schema';

async function main() {
  const items = await db.select().from(restaurantItems);
  const schedules = await db.select().from(restaurantSchedules);

  const byRest: Record<string, Record<string, Record<string, number>>> = {};
  for (const it of items) {
    const r = it.restaurant, c = it.category, s = it.subcategory ?? '(sin subcat)';
    byRest[r] ??= {};
    byRest[r][c] ??= {};
    byRest[r][c][s] = (byRest[r][c][s] ?? 0) + 1;
  }

  console.log('TOTAL restaurant_items:', items.length);
  console.log('TOTAL restaurant_schedules:', schedules.length);
  for (const r of Object.keys(byRest).sort()) {
    const total = Object.values(byRest[r]).reduce((a, cat) => a + Object.values(cat).reduce((x, y) => x + y, 0), 0);
    console.log(`\n=== ${r} (${total} items) ===`);
    for (const c of Object.keys(byRest[r])) {
      const catTotal = Object.values(byRest[r][c]).reduce((a, b) => a + b, 0);
      console.log(`  [${c}] ${catTotal}`);
      for (const s of Object.keys(byRest[r][c])) {
        console.log(`      - ${s}: ${byRest[r][c][s]}`);
      }
    }
  }
  process.exit(0);
}
main().catch((e) => { console.error('DB ERROR:', e.message); process.exit(1); });
