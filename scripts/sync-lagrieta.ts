// Sync La Grieta restaurant content to match Figma 1:1. Backs up + scoped to restaurant='lagrieta'.
import './_env';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { restaurantItems } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const R = 'lagrieta';
type Row = typeof restaurantItems.$inferInsert;
const rows: Row[] = [];
let ord = 0;
const clean = (s: string) => s.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
function np(category: string, subcategory: string | null, pairs: [string, string][]) {
  for (const [name, price] of pairs) rows.push({ restaurant: R, category, subcategory, name: clean(name), price: price.trim(), active: true, order: ++ord });
}
function ndp(category: string, subcategory: string | null, triples: [string, string, string][]) {
  for (const [name, desc, price] of triples) rows.push({ restaurant: R, category, subcategory, name: clean(name), description: clean(desc), price: price.trim(), active: true, order: ++ord });
}

// ── COMIDA ───────────────────────────────────────────────────────────────────
ndp('Comida', 'Hamburguesas', [
  ['Burger de la Casa', 'Pan Brioche de papa, triple cheddar, 180 grs. smash, pepinillo.', '$13.900'],
  ['Beyond Burger', 'Vegan Burger, rúcula, duxelle de setas, cebolla asada, salsa de ajo.', '$14.900'],
  ['Burger Serrano & Azul', 'Jamón serrano, mermelada membrillo, queso azul, mostaza Dijon.', '$14.900'],
  ['Cheese Burger', 'Clásica hamburguesa con queso cheddar.', '$9.900'],
]);
ndp('Comida', 'Sándwiches', [
  ['Barros Luco', 'Filete grillado, queso fundido, mayo merkén en marraqueta.', '$8.900'],
  ['Completo Encurtido', 'Salchicha artesanal, palta, relish pepino, mayo-ajo en pan Nan/Brioche.', '$7.900'],
  ['Don Panchito', 'Filete de pollo, queso, salsa macha, choclo y pebre en marraqueta.', '$6.990'],
]);
ndp('Comida', 'Pizza', [
  ['Pizza Camarón', 'Masa de pizza, mozzarella, salsa de tomate, camarón, aceite de ajo.', '$13.990'],
]);
ndp('Comida', 'Fast Food', [
  ['Papas Fritas', 'Tradicionales sazonadas con sal (Medianas / Grandes).', '$4.900 / $5.900'],
  ['Papas Cheddar', 'Con salsa cheddar, tocino crocante y perejil.', '$6.900'],
  ['Empanadas de Queso', '6 unidades fritas acompañadas de pebre.', '$8.900'],
]);
ndp('Comida', 'Tablas', [
  ['Mar y Tierra', 'Base de papas, lomo res, pollo, navajuelas, ostiones y camarones.', '$23.500'],
  ['Tabla de Empanadas', '16 unidades de empanadas de la casa al horno.', '$9.500'],
]);
ndp('Comida', 'Ensaladas', [
  ['Ensalada del Chef', 'Hojas verdes, jamón serrano, aceto miel, frutillas y mozzarella.', '$9.900'],
  ['Ensalada César', 'Pollo grillado, hojas verdes, anchoas, crutones y palta.', '$8.900'],
  ['Ensalada de Frutas', 'Mix de frutas frescas de la estación.', '$5.900'],
]);

// ── COCTELERÍA ───────────────────────────────────────────────────────────────
ndp('Coctelería', 'Cítricos', [
  ['Margarita', 'Don Julio, Gran Manier, jugo de limón.', '$9.900'],
  ['Chardonnay Sour', 'Chardonnay, limón natural, syrup de la casa.', '$7.500'],
  ['Pisco Sour', 'Gobernador 40°, jugo de limón, syrup.', '$7.500'],
]);
ndp('Coctelería', 'Históricos', [
  ['Godfather', 'Whisky Grants 12 años, Dissarono Amaretto, angostura.', '$8.500'],
  ['Negroni', 'Gin Tanqueray, Campari y Vermuth Rosso.', '$8.000'],
  ['Old Fashioned', 'Bourbon Bullet, Grants 12 años, jarabe Demerara, angostura.', '$8.500'],
]);
ndp('Coctelería', 'Autor', [
  ['Carpintero', 'Pisco, licor de mora/boysenberry, limón, agua de rosas.', '$10.900'],
  ['Fuego & Flor', 'Gin, Vermut Rosso, Campari, rosa mosqueta, ahumado de pino.', '$9.900'],
  ['Fresco del Valle', 'Pisco, Trakal, piña, limón, syrup de romero.', '$12.500'],
]);
ndp('Coctelería', 'Dulces & Cremosos', [
  ['Carajillo', 'Licor 43, café espresso.', '$7.500'],
  ['Espresso Martini', 'Vodka, licor café Borghetti, espresso, bitter cacao.', '$7.500'],
]);
ndp('Coctelería', 'Refrescantes', [
  ['Aperol Spritz', 'Aperol, espumante de la zona, top soda.', '$7.900'],
  ['Moscow Mule', 'Vodka, jugo de limón natural, Ginger Beer.', '$8.500'],
]);

// ── LICORES ──────────────────────────────────────────────────────────────────
np('Destilados y Licores', 'Pisco', [['Waqar 40° / Bou Legado', '$5.500 a $9.900']]);
np('Destilados y Licores', 'Whisky', [["J.W. Blue Label / Akashi / Chivas 18 / Jack Daniel's", '$5.000 a $55.000']]);
np('Destilados y Licores', 'Cognac & Brandy', [['Hennessy XO / Carlos I', '$22.500 a $67.900']]);
np('Destilados y Licores', 'Gin', [["Mary Le Bone / Hendrick's / Tanqueray", '$6.000 a $14.500']]);
np('Destilados y Licores', 'Tequila', [['Don Julio Reposado / Mezcal 400 conejo', '$7.000 a $9.900']]);
np('Destilados y Licores', 'Ron', [['Zacapa XO / Havana 7 años / Ron Kraken', '$6.000 a $25.900']]);
np('Destilados y Licores', 'Vodka', [['Grey Goose / Belvedere / Stoli', '$5.000 a $9.900']]);
np('Destilados y Licores', 'Licores', [['Jagermeister / Grand Marnier / Baileys / Trä Kal', '$5.000 a $9.000']]);

// ── BEBIDAS CON Y SIN ALCOHOL ────────────────────────────────────────────────
np('Otras Bebidas', 'Vinos Espumosos', [['Moet Chandon Brut / Estelado Rose', '$19.500 a $158.000']]);
np('Otras Bebidas', 'Cervezas', [['Kunstmann / Tamango / Shangrila / Prócer / Kross', '$4.500 a $6.500']]);
np('Otras Bebidas', 'Sin Alcohol', [['Virgin Mary / Virgin Colada / Limonadas / Jugos', '$4.500 a $6.800']]);
np('Otras Bebidas', 'Refrescos y Aguas', [['Red Bull / San Pellegrino / Bebidas', '$1.900 a $3.500']]);

async function main() {
  const before = await db.select().from(restaurantItems).where(eq(restaurantItems.restaurant, R));
  const backupDir = resolve(__dirname, 'backups');
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = resolve(backupDir, `lagrieta-${stamp}.json`);
  writeFileSync(backupFile, JSON.stringify({ items: before }, null, 2));
  console.log(`Backup: ${backupFile}`);
  console.log(`Before: ${before.length} items | Prepared (Figma): ${rows.length} items`);

  await db.delete(restaurantItems).where(eq(restaurantItems.restaurant, R));
  for (let i = 0; i < rows.length; i += 50) await db.insert(restaurantItems).values(rows.slice(i, i + 50));

  const after = await db.select().from(restaurantItems).where(eq(restaurantItems.restaurant, R));
  const cats: Record<string, number> = {};
  for (const it of after) cats[it.category] = (cats[it.category] ?? 0) + 1;
  console.log(`After:  ${after.length} items`);
  console.log('By category:', JSON.stringify(cats, null, 2));
  process.exit(0);
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
