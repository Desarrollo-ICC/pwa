// Imágenes de categorías de Actividades desde el Figma (feedback DSÑ 06-08).
// Se guardan en room_info (act_cat_*) — editables desde el admin de Habitación.
import './_env';
import { db } from '../lib/db/index';
import { roomInfo } from '../lib/db/schema';
import { like } from 'drizzle-orm';

const CATS: [string, string][] = [
  ['act_cat_caminatas_y_trekking',        '/images/fig-cat-caminatas.jpg'],
  ['act_cat_bicicleta',                   '/images/fig-cat-bicicleta.jpg'],
  ['act_cat_contemplacion_y_recreacion',  '/images/fig-cat-contemplacion.jpg'],
  ['act_cat_bienestar_y_talleres_indoor', '/images/fig-cat-bienestar.jpg'],
  ['act_cat_ninos',                       '/images/fig-cat-ninos.jpg'],
  ['act_cat_otras_actividades',           '/images/fig-cat-otras.jpg'],
  ['act_cat_deportes_de_nieve',           '/images/fig-cat-nieve.jpg'],
  ['act_cat_exploracion_naturaleza',      '/images/fig-cat-exploracion.jpg'],
  ['act_cat_centro_de_ski',               '/images/fig-hero-ski.jpg'],
];

(async () => {
  const before = await db.select().from(roomInfo).where(like(roomInfo.section, 'act_cat_%'));
  console.log('antes:', before.map(r => r.section).join(', ') || '(ninguna)');
  await db.delete(roomInfo).where(like(roomInfo.section, 'act_cat_%'));
  await db.insert(roomInfo).values(CATS.map(([section, img], i) => ({
    section, title: section.replace('act_cat_', '').replace(/_/g, ' '), content: img, active: true, order: 90 + i,
  })));
  const after = await db.select().from(roomInfo).where(like(roomInfo.section, 'act_cat_%'));
  console.log('después:', after.length, 'imágenes de categoría');
  process.exit(0);
})();
