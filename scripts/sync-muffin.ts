// Sync Muffin Café content to match Figma 1:1. Backs up + scoped to restaurant='muffin'.
import './_env';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { restaurantItems } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const R = 'muffin';
const CAT = 'Menús';
type Row = typeof restaurantItems.$inferInsert;
const rows: Row[] = [];
let ord = 0;
function np(subcategory: string, pairs: [string, string][]) {
  for (const [name, price] of pairs) rows.push({ restaurant: R, category: CAT, subcategory, name: name.trim(), price: price.trim(), active: true, order: ++ord });
}

np('Pastelería', [
  ['Barra de Proteína', '$3.800'],
  ['Muffin Variedades', '$3.500'],
  ['Galletón Variedades', '$3.200'],
  ['Masa Danesa Rellena de Crema', '$2.900'],
  ['Donuts Variedad Sabores', '$2.500*'],
]);
np('Bebidas Calientes', [
  ['Chocolate Caliente', '$4.900'],
  ['Moccaccino', '$3.900'],
  ['Café Expreso Doble', '$3.400'],
  ['Café Latte', '$3.400'],
  ['Café Cortado', '$3.200'],
  ['Café Capucchino', '$3.200'],
  ['Infusiones', '$3.000'],
  ['Café Macchiato', '$2.800'],
  ['Lungo', '$2.400'],
  ['Café Americano', '$2.300'],
  ['Ristretto', '$2.300'],
  ['Café Expreso Simple', '$2.200'],
  ['Té Variedades', '$2.000'],
]);
np('Bebidas Frías', [
  ['RedBull Variedades', '$3.500'],
  ['Acqua Panna 500 cc', '$3.200'],
  ['San Pellegrino 500 cc', '$3.200'],
  ['Bebidas Lata Variedades', '$2.500'],
  ['Vitamin Water', '$1.900'],
]);
np('Kiosko Muffin', [
  ['Galletas Oreo', '$1.300'],
  ['M&M', '$1.900'],
  ['Skittles', '$1.700'],
  ['Krispo', '$1.500'],
  ['Tubos Fini Sabores', '$2.000'],
  ['Fini Gomitas Gusano', '$1.400'],
  ['Fini Gomitas Frutilla', '$2.000'],
  ['Toblerone', '$4.800'],
  ['Snickers', '$2.000'],
  ['Mantecol', '$1.500'],
  ['Snack Chery Chips', '$3.500'],
  ['Vitamin Water', '$1.900'],
  ['Energéticas', '$3.500'],
  ['San Pellegrino Variedades', '$2.900'],
  ['Protein Bar', '$2.300'],
]);

async function main() {
  const before = await db.select().from(restaurantItems).where(eq(restaurantItems.restaurant, R));
  const backupDir = resolve(__dirname, 'backups');
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = resolve(backupDir, `muffin-${stamp}.json`);
  writeFileSync(backupFile, JSON.stringify({ items: before }, null, 2));
  console.log(`Backup: ${backupFile}`);
  console.log(`Before: ${before.length} items | Prepared (Figma): ${rows.length} items`);

  await db.delete(restaurantItems).where(eq(restaurantItems.restaurant, R));
  for (let i = 0; i < rows.length; i += 50) await db.insert(restaurantItems).values(rows.slice(i, i + 50));

  const after = await db.select().from(restaurantItems).where(eq(restaurantItems.restaurant, R));
  const subs: Record<string, number> = {};
  for (const it of after) subs[it.subcategory ?? '(none)'] = (subs[it.subcategory ?? '(none)'] ?? 0) + 1;
  console.log(`After:  ${after.length} items`);
  console.log('By subcategory:', JSON.stringify(subs, null, 2));
  process.exit(0);
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
