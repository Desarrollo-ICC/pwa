// Sync Habitación room-service info sections to match Figma 1:1 (tabbed screen content).
// Replaces ONLY the managed sections below; preserves housekeeping, protocolo, emergencia,
// and all image sections (hero_image, img_*). Backs up everything first.
import './_env';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { roomInfo } from '../lib/db/schema';
import { inArray } from 'drizzle-orm';

type Row = typeof roomInfo.$inferInsert;
const rows: Row[] = [];
let ord = 0;
function row(section: string, title: string, content: string) {
  rows.push({ section, title, content, active: true, order: ++ord });
}

// ── Lavandería ───────────────────────────────────────────────────────────────
row('lavanderia', 'Lavandería - Hombre', [
  'Camisa — $3.840', 'Camisetas — $2.880', 'Calzoncillos — $2.040', 'Calcetines (1 par) — $1.800',
  'Pañuelos — $1.560', 'Pijama — $3.360', 'Pantalones Cortos — $3.360', 'Pantalones — $4.200',
  'Poleras — $3.000', 'Pantalón Ski — $5.040', 'Buzo Completo Ski — $6.600', 'Buzo Deportivo — $4.200', 'Sweaters — $4.320',
].join('\n'));
row('lavanderia', 'Lavandería - Mujer', [
  'Blusas — $4.560', 'Camisas — $3.840', 'Calzones — $1.800', 'Sostenes — $1.920', 'Medias — $1.920',
  'Pañuelos — $1.920', 'Falda — $4.560', 'Vestido — $6.240', 'Camisones — $3.360', 'Pijamas — $3.360',
  'Pantalones — $4.200', 'Pantalón Ski — $5.040', 'Parka — $5.040', 'Sweaters — $4.320', 'Buzo Completo Ski — $6.600', 'Buzo deportivo — $4.200',
].join('\n'));
row('lavanderia', 'Planchado', [
  'Camisas — $2.500', 'Blusas — $2.800', 'Pantalones — $2.600', 'Faldas — $2.600', 'Poleras — $1.500', 'Vestidos — $3.600', 'Trajes — $3.800',
].join('\n'));

// ── Caja de Seguridad ────────────────────────────────────────────────────────
row('caja', 'Caja de Seguridad', 'Cada habitación dispone de una caja de seguridad para el resguardo de objetos de valor.');
row('caja', 'Asistencia Técnica', 'En caso de tener inconvenientes con la clave de acceso, contacte a recepción para recibir ayuda del personal técnico y de seguridad.');

// ── Minibar ──────────────────────────────────────────────────────────────────
row('minibar', 'Minibar', 'En el refrigerador dentro de la habitación, encontrarás agua mineral de cortesía. Se repone todos los días durante el servicio de aseo. Si se te antoja algún snack o bebida, en Muffin Café encontrarás variedad de productos.');

// ── Room Service ─────────────────────────────────────────────────────────────
row('room_service', 'Room Service', 'No contamos con Room Service, pero hemos preparado una diversa oferta gastronómica en espacios pensados para disfrutar y compartir. Te esperamos en Restaurante La Arboleda, Bar La Grieta y Muffin Café.');

// ── Menú de Almohadas ────────────────────────────────────────────────────────
row('almohadas', 'Menú de Almohadas', 'Para un descanso confortable, ponemos a su disposición una selección de almohadas para adaptarnos a sus preferencias de descanso:');
row('almohadas', 'Pluma con Tratamiento Antialérgico', 'Presentes por defecto en todas las habitaciones.');
row('almohadas', 'Fibra Sintética', 'Firmeza Baja.\nOfrece un soporte tradicional, generalmente suave, ligero y maleable. Es ideal para quienes prefieren almohadas blandas que se puedan amoldar con las manos.');
row('almohadas', 'Visco Gel', 'Firmeza Media.\nAlivia los puntos de presión de manera excepcional, entregando una firmeza alta y un soporte moldeado personalizado.');
row('almohadas', 'Látex', 'Firmeza Alta.\nBrinda un soporte firme y constante; no se hunde tanto, manteniendo cabeza y cuello alineados.');
row('almohadas', 'Viscoelástica + Fibra Sintética', 'Firmeza Media a Baja.\nOfrece lo mejor de dos mundos: la suavidad mullida y ligera de la fibra sintética al exterior, combinada con el soporte ergonómico y la resiliencia lenta (efecto memoria) del núcleo viscoelástico.');
row('almohadas', 'Nota', 'Todas las almohadas cuentan con tratamiento antialérgico.\nOpciones adicionales están sujetas a disponibilidad.\n\nPara solicitar un cambio de almohada, comuníquese con Recepción o con Housekeeping.');

// ── Climatización ────────────────────────────────────────────────────────────
row('climatizacion', 'Climatización', 'Controle la temperatura desde la pantalla táctil ubicada en su habitación.');
row('climatizacion', 'Encender', 'Presione On / Off.');
row('climatizacion', 'Temperatura', 'Ajuste con los botones ▲ / ▼.\nRango: 16°C a 30°C.\nTemperatura recomendada: 22°C a 24°C.');
row('climatizacion', 'Ventilador', 'Seleccione entre:\nBaja\nMedia\nAlta');
row('climatizacion', 'Recomendaciones', 'Mantenga puertas y ventanas cerradas.\nEvite temperaturas extremas para un mejor rendimiento.');

// ── Redes y Contraseñas ──────────────────────────────────────────────────────
row('redes', 'Redes y Contraseñas', 'En habitaciones y áreas comunes\n\nRed: Huéspedes Termas Chillán\nContraseña: hotel.2019');

// ── TV ───────────────────────────────────────────────────────────────────────
row('tv', 'Paso 1', 'Con el Televisor encendido, pulse botón de inicio para acceder al menú principal.');
row('tv', 'Paso 2', 'Use la cruceta direccional y el botón central para acceder a Mundo Go.');
row('tv', 'Paso 3', 'En Mundo Go podrás ver el catálogo en el menú “VER TODOS” y también podrás buscar por nombre los programas seleccionando el ícono lupa.');

// ── Guarda Maletas ───────────────────────────────────────────────────────────
row('guarda_maletas', 'Guarda Maletas', 'Disponemos de servicio de guarda maletas.');
row('guarda_maletas', '¿Cómo solicitarlo?', 'Llame a Recepción (marcando 0).\nNuestro personal registrará su equipaje y le entregará un comprobante.');
row('guarda_maletas', 'Retiro', 'Presente el comprobante al retirar sus maletas.\nSi lo extravía, se solicitará una identificación.');
row('guarda_maletas', 'Importante', 'Las maletas deben estar cerradas, idealmente vacías.\nNo deje dinero, documentos, joyas ni objetos de valor en su interior.');

// ── Punto de Hidratación ─────────────────────────────────────────────────────
row('hidratacion', 'Punto de Hidratación', 'A la salida de los ascensores, en el piso 1, encontrarás agua mineral con y sin gas.');

const MANAGED = ['lavanderia', 'caja', 'minibar', 'room_service', 'almohadas', 'climatizacion', 'redes', 'tv', 'guarda_maletas', 'hidratacion'];

async function main() {
  const all = await db.select().from(roomInfo);
  const backupDir = resolve(__dirname, 'backups');
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  writeFileSync(resolve(backupDir, `habitacion-${stamp}.json`), JSON.stringify({ all }, null, 2));
  console.log(`Backup: scripts/backups/habitacion-${stamp}.json`);
  const beforeManaged = all.filter(r => MANAGED.includes(r.section)).length;
  const preserved = all.filter(r => !MANAGED.includes(r.section)).length;
  console.log(`Before: ${beforeManaged} managed rows (+ ${preserved} preserved: housekeeping/protocolo/emergencia/images) | Prepared: ${rows.length}`);

  await db.delete(roomInfo).where(inArray(roomInfo.section, MANAGED));
  await db.insert(roomInfo).values(rows);

  const after = (await db.select().from(roomInfo)).filter(r => MANAGED.includes(r.section));
  const bySec: Record<string, number> = {};
  for (const r of after) bySec[r.section] = (bySec[r.section] ?? 0) + 1;
  console.log(`After:  ${after.length} managed rows`);
  console.log(JSON.stringify(bySec, null, 2));
  process.exit(0);
}
main().catch((e: any) => { console.error('ERROR:', e.message); console.error('CAUSE:', e.cause?.message, e.cause?.code, e.cause?.detail); process.exit(1); });
