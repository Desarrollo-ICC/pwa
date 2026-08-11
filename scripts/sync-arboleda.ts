// Sync Arboleda restaurant content to match Figma 1:1.
// - Backs up current arboleda rows to scripts/backups/ before any change (reversible).
// - Scoped strictly to restaurant='arboleda'. Replaces items + schedules for arboleda only.
import './_env';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { restaurantItems, restaurantSchedules } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const R = 'arboleda';

// ── helpers ──────────────────────────────────────────────────────────────────
type Row = typeof restaurantItems.$inferInsert;
const rows: Row[] = [];
let ord = 0;
const clean = (s: string) => s.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
// name + price list (wines, spirits, other drinks)
function np(category: string, subcategory: string | null, pairs: [string, string][]) {
  for (const [name, price] of pairs) rows.push({ restaurant: R, category, subcategory, name: clean(name), price: price.trim(), active: true, order: ++ord });
}
// name + description + price (dishes, cocktails)
function ndp(category: string, subcategory: string | null, triples: [string, string, string][]) {
  for (const [name, desc, price] of triples) rows.push({ restaurant: R, category, subcategory, name: clean(name), description: clean(desc), price: price.trim(), active: true, order: ++ord });
}

// ── 1. MENÚ DEL DÍA ──────────────────────────────────────────────────────────
ndp('Menú del día', null, [
  ['Garrón de Cordero con Puré', 'Cocinado por 12 horas en una reducción de vino Carménère y hierbas cordilleranas. Se sirve sobre un puré rústico de papas.', '$27.500'],
  ['Risotto de Mote y Hongos Silvestres', 'Trigo mote cremoso cocinado en caldo de verduras ahumadas, con salteado de hongos morchellas o changles.', '$26.000'],
  ['Ñoquis con Salsa Blanca', 'Ñoquis hechos a mano con papas de colores, servidos con una suave salsa de crema y queso parmesano (opción de agregar tiritas de pollo a la plancha).', '$16.500'],
]);

// ── 2. VINOS ─────────────────────────────────────────────────────────────────
np('Vinos', 'Burbujas del Mundo', [
  ['Imperial Brut, Moët & Chandon, Francia', '$158.000'],
  ['Don Perignon, Möet & Chandon, Francia', '$450.000'],
  ['Hera, Calyptra, Cachapoal Andes', '$35.000'],
  ['Cordillera, Extra Brut, Miguel Torres, Curicó', '$28.500'],
  ['Chandon Brut, Luján de Cuyo', '$28.000'],
  ['Loma Larga, Brut Nature, Casablanca', '$28.000'],
  ['Berta (Nature, E. Brut y Doux), Itata', '$25.000'],
  ['Estelado, Rose Brut, Miguel Torres, Maule', '$23.000'],
]);
np('Vinos', 'Sauvignon Blanc', [
  ['Cipreses, Casa Marín, San Antonio', '$35.000'],
  ['Outer Limits, Montes, Petorca', '$29.000'],
  ['Cordillera, Miguel Torres, Maule Costa', '$25.000'],
  ['Vetas Blancas, Tabalí, Limarí', '$25.000'],
  ['Chagual, Los Vascos, Colchagua', '$21.000'],
  ['Ritual, Veramonte, Casablanca', '$20.000'],
]);
np('Vinos', 'Chardonnay', [
  ['Tara, Ventisquero, Atacama', '$55.000'],
  ['Los Parientes, Pandolfi Price, Itata', '$35.000'],
  ['Cordillera, Miguel Torres, Limarí', '$25.000'],
  ['Ritual, Veramonte, Casablanca', '$20.000'],
  ['Pedregoso, Tabalí, Limarí', '$20.000'],
]);
np('Vinos', 'Merlot', [
  ['Pedregoso, Tabalí, Limarí', '$23.000'],
  ['Cuvee Alexander, Lapostolle, Colchagua', '$23.000'],
  ['Santa Digna, Miguel Torres, Valle Central', '$20.000'],
  ['Ritual, Veramonte, Casablanca', '$20.000'],
]);
np('Vinos', 'Carmenere', [
  ['Carmín de Peumo, Concha y Toro, Cachapoal', '$150.000'],
  ['El Incidente, Viu Manent, Colchagua', '$78.000'],
  ['Maturana, Maturana Wines, Colchagua', '$45.000'],
  ['Cordillera, Miguel Torres, Cachapoal', '$25.000'],
  ['Micas, Tabalí, Cachapoal', '$23.000'],
  ['Cota 400, Andes Plateau, Maule', '$21.000'],
  ['Ándica, Miguel Torres, Maule', '$20.000'],
]);
np('Vinos', 'Cabernet Sauvignon', [
  ['Manso de Velasco, Miguel Torres, Maule', '$90.000'],
  ['Enclave, Ventisquero, Maipo', '$72.000'],
  ['Forajidos #1, Forajidos Wine, Maipo', '$48.000'],
  ['Grand Clos, Boldos, Cachapoal', '$40.000'],
  ['Cordillera, Miguel Torres, Maipo', '$25.000'],
  ['Cota 500, Andes Plateau, Maipo', '$23.000'],
  ['Montes Alpha, Montes, Colchagua', '$23.000'],
  ['Pedregoso, Tabalí, Maipo', '$20.000'],
  ['Ándica, Miguel Torres, Itata', '$20.000'],
]);
np('Vinos', 'Syrah', [
  ['Ventolera, Ventisquero, Casablanca', '$35.000'],
  ['Vetas Blancas, Tabalí, Limarí', '$29.000'],
  ['Cromas, Los Vascos, Colchagua', '$23.000'],
  ['Origen, Valle Secreto, Cachapoal', '$22.000'],
]);
np('Vinos', 'Malbec', [
  ['Portillo, Salentein, Mendoza', '$25.000'],
  ['Callia, Bodegas Callia, San Juan', '$20.000'],
  ['Loma Larga, Casablanca', '$20.000'],
]);
np('Vinos', 'Ensamblajes', [
  ['EPU, Almaviva, Maipo', '$110.000'],
  ['Futa, Calcu, Colchagua', '$85.000'],
  ['Mixtio, Sutil, Varias zonas', '$68.000'],
  ['Brisas, Arboleda, Aconcagua', '$55.000'],
  ['Rapsodia, Loma Larga, Casablanca', '$38.500'],
  ['Ácrux, Sutil, Colchagua', '$38.000'],
  ['The Lost Barrel, Oveja Negra, Maule', '$35.000'],
  ['Berta, Santa Berta, Itata', '$35.000'],
  ['Calyptra Fortificado, Calyptra, Cachapoal', '$35.000'],
  ['Almado, Miguel Torres, Maule', '$29.000'],
  ['Vetas Blancas, Tabalí, Limarí', '$29.000'],
  ['Causa, Miguel Torres, Maule', '$29.000'],
  ['700, Andes Plateau, Maipo', '$25.000'],
  ['Secreto, Valle Secreto, Cachapoal', '$20.000'],
]);
np('Vinos', 'Vinos para Momentos Memorables', [
  ['Chadwick, Cabernet Sauvignon, Maipo', '$590.000'],
  ['Almaviva, Ensamblaje, Maipo', '$350.000'],
  ['Don Melchor, Cabernet Sauvignon, Maipo', '$330.000'],
  ['Seña, Ensamblaje, Aconcagua', '$255.000'],
  ['Don Maximiano, Ensamblaje, Aconcagua', '$250.000'],
  ['Clos Apalta, Ensamblaje, Colchagua', '$240.000'],
  ['Montes Alpha M, Ensamblaje, Colchagua', '$210.000'],
  ['Carmín de Peumo, Carmenere, Cachapoal', '$190.000'],
  ['Purple Angel, Carmenere, Colchagua', '$160.000'],
  ['Rocas de Seña, Ensamblaje, Aconcagua', '$150.000'],
  ['Kai, Carmenere, Aconcagua', '$130.000'],
  ['Viola, Carmenere, Colchagua', '$120.000'],
  ['Franco, Cabernet Franc, Colchagua', '$120.000'],
  ['Pizarras, Syrah, Aconcagua', '$110.000'],
]);

// ── 3. COCTELERÍA INTERNACIONAL ──────────────────────────────────────────────
ndp('Coctelería Internacional', 'Cítricos', [
  ['Margarita', 'Don Julio, Gran Manier, jugo de limón.', '$9.900'],
  ['Pisco Sour', 'Gobernador 40°, jugo de limón, syrup de la casa.', '$7.500'],
  ['Sour Peruano', 'Pisco peruano, jugo de limón, syrup de la casa.', '$7.500'],
  ['Sour Chileno Catedral', 'Pisco Gobernador 40°, jugo de limón, syrup de la casa.', '$9.990'],
  ['Whiskey Sour', 'Bourbon Bulleit, jugo de limón, syrup de la casa, dash de angostura.', '$9.500'],
  ['Amaretto Sour', 'Disaronno Amaretto, Bourbon Bulleit, jugo de limón, jarabe demerara.', '$9.000'],
]);
ndp('Coctelería Internacional', 'Históricos', [
  ['Dry Martini', 'Gin Tanqueray y Vermouth Dry.', '$7.500'],
  ['Godfather', 'Whisky Grants 12 años, Dissarono Amaretto, dash de angostura.', '$8.500'],
  ['Manhattan', 'Bourbon Bullet, Whisky Jameson, Vermouth Rosso, dash de angostura.', '$8.500'],
  ['Negroni', 'Gin Tanqueray, Campari y Vermouth Rosso.', '$8.000'],
]);
ndp('Coctelería Internacional', 'Dulces y Cremosos', [
  ['Carajillo', 'Licor 43, café espresso.', '$7.500'],
  ['Espresso Martini', 'Vodka, licor de café Borghetti, café espresso, bitter de cacao.', '$7.500'],
  ['Piña Colada', 'Ron Blanco, Ron Malibú, jugo de piña, crema de coco.', '$7.500'],
  ['White Russian', 'Vodka, crema de leche, licor de café Borghetti.', '$7.500'],
]);
ndp('Coctelería Internacional', 'Refrescantes', [
  ['Aperol Spritz', 'Aperol, espumante de la zona, top soda.', '$7.500'],
  ['Ramazzotti Spritz', 'Ramazzotti, espumante de la zona, top soda.', '$7.500'],
  ['Caipiriña', 'Cachaca, limón sutil, syrup simple.', '$7.500'],
  ['Mojito', 'Ron Blanco, syrup simple, jugo de limón, top soda.', '$6.000'],
  ['Mojito Sabores', 'Variedad de sabores, Ron Blanco, syrup simple, jugo de limón, top soda.', '$8.000'],
]);

// ── 4. DESTILADOS Y LICORES ──────────────────────────────────────────────────
np('Destilados y Licores', 'Pisco', [
  ['Waqar 40° / Kappa 40°', '$9.900'],
  ['Pisco Mistral Gran Nobel', '$8.000'],
  ['Gobernador 40°', '$5.500'],
  ['Pisco Mistral 35°', '$5.000'],
]);
np('Destilados y Licores', 'Whisky', [
  ['Chivas Regal 18 años', '$17.500'],
  ['Chivas Regal 12 años', '$8.000'],
  ["Jack Daniel's (N°7, Apple, Fire, Honney)", '$7.000'],
  ['Whisky Grants 12 años', '$5.000'],
]);
np('Destilados y Licores', 'Gin', [
  ['Ophir', '$9.500'],
  ["Hendrick's", '$8.500'],
  ['Tanqueray N° Ten', '$8.000'],
  ['Tanqueray / Tanqueray Royale.', '$6.000'],
]);
np('Destilados y Licores', 'Tequila', [
  ['Don Julio Reposado', '$9.900'],
  ['Don Julio Blanco', '$7.900'],
  ['Mezcal 400 Conejo.', '$7.000'],
]);
np('Destilados y Licores', 'Ron', [
  ['Zacapa 23 años', '$13.500'],
  ['Bayou Spiced', '$8.000'],
]);
np('Destilados y Licores', 'Vodka', [
  ['Absolut Blue', '$5.500'],
  ['Stoli / Stoli Gluten Free', '$5.000'],
]);
np('Destilados y Licores', 'Licores', [
  ['Disaronno / Dissaronno Velvet', '$6.000'],
  ['Baileys / Licor 43 / Jagermeister / Frangelico', '$5.500'],
  ['Villa Massa Limoncello / Fernet Branca', '$5.000'],
]);

// ── 5. OTRAS BEBIDAS ─────────────────────────────────────────────────────────
np('Otras Bebidas', 'Cervezas', [
  ['Shangri-La / Tamango / Kross / Procer', '$5.500'],
  ['Kunstmann Torobayo', '$5.000'],
  ['Heineken / Corona', '$4.500'],
]);
np('Otras Bebidas', 'Cervezas Sin Alcohol', [
  ['Heineken Cero / Corona Cero', '$4.500'],
  ['Michelada o Chelada', '$1.500'],
]);
np('Otras Bebidas', 'Bebidas Sin Alcohol', [
  ['Virgin Mary / Virgin Colada / Virgin Mojito', '$6.800'],
  ['Sweet Russian', '$6.500'],
  ['Italian Spritz', '$6.000'],
  ['Caipirinha Zero', '$5.000'],
  ['Limonada (Tradicional / Menta-Jengibre)', '$4.900'],
  ['Jugos', '$4.500'],
]);
np('Otras Bebidas', 'Refrescos & Aguas', [
  ['Red Bull Variedades', '$3.500'],
  ['Agua San Pellegrino / Acqua Panna 500cc', '$3.200'],
  ['Agua Tónica / Bebidas', '$2.500'],
]);
np('Otras Bebidas', 'Cafetería', [
  ['Mocaccino', '$3.800'],
  ['Cappuccino / Cortado doble', '$3.500'],
  ['Americano doble', '$3.200'],
  ['Cortado simple', '$2.900'],
  ['Espresso / Ristreto / Lungo / Americano', '$2.500*'],
]);

// ── SCHEDULES (Horarios de Atención) ─────────────────────────────────────────
const scheduleLines = [
  'Desayuno:',
  'Lunes a viernes: 07:30 - 10:00',
  'Sábados, domingos y festivos: 07:30 - 10:30',
  'Almuerzo:',
  'Lunes a domingo: 13:00 - 15:00',
  'Sábado, domingo y festivos: 13:15 - 15:15',
  'Cena:',
  'Lunes a domingo: 19:30 - 22:00',
];

// ── RUN ──────────────────────────────────────────────────────────────────────
async function main() {
  const beforeItems = await db.select().from(restaurantItems).where(eq(restaurantItems.restaurant, R));
  const beforeSched = await db.select().from(restaurantSchedules).where(eq(restaurantSchedules.restaurant, R));

  const backupDir = resolve(__dirname, 'backups');
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = resolve(backupDir, `arboleda-${stamp}.json`);
  writeFileSync(backupFile, JSON.stringify({ items: beforeItems, schedules: beforeSched }, null, 2));
  console.log(`Backup: ${backupFile}`);
  console.log(`Before: ${beforeItems.length} items, ${beforeSched.length} schedules`);
  console.log(`Prepared (Figma): ${rows.length} items, ${scheduleLines.length} schedule lines`);

  await db.delete(restaurantItems).where(eq(restaurantItems.restaurant, R));
  await db.delete(restaurantSchedules).where(eq(restaurantSchedules.restaurant, R));

  // insert in chunks
  for (let i = 0; i < rows.length; i += 50) await db.insert(restaurantItems).values(rows.slice(i, i + 50));
  await db.insert(restaurantSchedules).values(scheduleLines.map((info) => ({ restaurant: R, info, active: true })));

  const afterItems = await db.select().from(restaurantItems).where(eq(restaurantItems.restaurant, R));
  const afterSched = await db.select().from(restaurantSchedules).where(eq(restaurantSchedules.restaurant, R));
  console.log(`After:  ${afterItems.length} items, ${afterSched.length} schedules`);

  // breakdown
  const cats: Record<string, number> = {};
  for (const it of afterItems) cats[it.category] = (cats[it.category] ?? 0) + 1;
  console.log('By category:', JSON.stringify(cats, null, 2));
  process.exit(0);
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
