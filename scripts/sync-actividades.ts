// Sync Activities (verano + invierno + ski) to match Figma 1:1. Backs up + full replace of `activities`.
// Description encoding: line 0 = short paragraph, lines 1..n = info bullets (matches actividades/page.tsx extractBullets).
import './_env';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { activities } from '../lib/db/schema';

type Row = typeof activities.$inferInsert;
const rows: Row[] = [];
let ord = 0;
function act(season: string, category: string, name: string, paragraph: string | null, bullets: string[], price: string | null) {
  const description = paragraph
    ? (bullets.length ? paragraph + '\n' + bullets.join('\n') : paragraph)
    : null;
  rows.push({ season, category, name, description, price, active: true, order: ++ord });
}

// ══════════════ VERANO ══════════════
// Caminatas y Trekkings (Figma bullets are identical template values across the 3 cards)
const camBul = ['5 Horas', 'Altitud de 1.920 msnm', 'Dificultad Alta', '7 Km de Distancia', '6 Pasajeros por Guía'];
act('verano', 'Caminatas y Trekking', 'Fumarolas', 'Caminata desde el hotel hacia zonas de altura, atravesando bosque nativo hasta llegar a impresionantes fumarolas volcánicas.', camBul, null);
act('verano', 'Caminatas y Trekking', 'Refugio Garganta del Diablo', 'Ruta más extensa que atraviesa bosque centenario y arenales volcánicos hasta un refugio con vista panorámica privilegiada.', camBul, null);
act('verano', 'Caminatas y Trekking', 'Laguna el Huemul (Full Day)', 'Trekking de alta exigencia que atraviesa bosques y terreno volcánico hasta llegar a una laguna de montaña.', camBul, null);

// Bicicleta
act('verano', 'Bicicleta', 'Refugio Garganta del Diablo', 'Ruta más extensa que atraviesa bosque centenario y arenales volcánicos hasta un refugio con vista panorámica privilegiada.', ['5 Horas', 'Altitud de 1.920 msnm', 'Variable (Según Pista)', '7 Km de Distancia', '6 Pasajeros por Guía'], null);
act('verano', 'Bicicleta', 'Rukapiren', 'Ruta en bicicleta a través de bosque nativo que conduce hasta la cascada Rukapirén, con una caída de aproximadamente 50 metros.', ['3 Horas', 'Altitud de 1.200 msnm', 'Dificultad Fácil', '5 Km de Distancia', '6 Pasajeros por Guía'], null);

// Contemplación y Recreación
act('verano', 'Contemplación y Recreación', 'Observación de Aves y Fauna', 'Actividad guiada en el entorno del bosque para aprender a identificar especies y conectar con la biodiversidad local.', ['2 Horas', 'Altitud de 1.600 msnm', 'Dificultad Fácil', '8 Pasajeros'], null);
act('verano', 'Contemplación y Recreación', 'Tour Astronómico', 'Experiencia nocturna con introducción a la astronomía y observación de astros mediante telescopio.', ['1 Horas', 'Altitud de 1.600 msnm', 'Dificultad Fácil', '16 Pasajeros'], null);

// Bienestar y Talleres
act('verano', 'Bienestar y Talleres Indoor', 'Música en Vivo / Karaoke', "Actividad nocturna en el 'Bar La Grieta' del hotel con música en vivo y espacios de entretenimiento.", ['Bar La Grieta', 'Desde las 22:00', 'Jueves, viernes y sábados'], null);
act('verano', 'Bienestar y Talleres Indoor', 'Taller de Pizza', 'Actividad culinaria familiar donde conocerás los orígenes de la pizza y aprenderás a preparar tu propia pizza a la piedra junto a un experto.', ['1 Hora', 'Dificultad Alta', '16 Integrantes', 'Jueves y sábado'], null);

// Otras Actividades (Gratuitas + Con Costo Extra) — simple chips, no description
act('verano', 'Otras Actividades', 'Canchas de tennis', null, [], null);
act('verano', 'Otras Actividades', 'Baby Football', null, [], null);
act('verano', 'Otras Actividades', 'Paddleboard piscina', null, [], null);
act('verano', 'Otras Actividades', 'Cabalgatas', null, [], 'Con costo adicional');
act('verano', 'Otras Actividades', 'Paseo Viña Santa Berta', null, [], 'Con costo adicional');
act('verano', 'Otras Actividades', 'Paseos en buggy', null, [], 'Con costo adicional');

// Niños (verano) — Figma lists Niños as an Actividades category
act('verano', 'Niños', 'Canopy Infantil', 'Actividad de tirolesa diseñada para niños, combinando aventura y seguridad en un entorno controlado.', ['1 Hora', 'Altitud de 1.600 msnm', 'Dificultad Fácil', '6 Niños por Guía'], null);
act('verano', 'Niños', 'Caminata Nocturna', 'Exploración guiada del bosque cercano al hotel en horario nocturno, utilizando linternas.', ['1,5 Horas', 'Altitud de 1.600 msnm', 'Dificultad Fácil', '8 Niños por Guía', '1,6 Km de Distancia'], null);

// ══════════════ INVIERNO ══════════════
// Deportes de Nieve
act('invierno', 'Deportes de Nieve', 'Ski y Snowboard', 'Disfruta de la nieve en pistas de nivel internacional, ideales tanto para principiantes como expertos.', ['Duración Libre', 'Altitud de 1.540 – 2.400 msnm', 'Dificultad Variable', 'Capacidad Variable', 'Distancia Variable'], null);
act('invierno', 'Deportes de Nieve', 'Heli-Ski', 'Accede a cumbres remotas en helicóptero y desciende por nieve virgen fuera de pista. Una experiencia exclusiva para los amantes de la montaña y la adrenalina. Recorre paisajes nevados a través de bosques y laderas en una experiencia llena de adrenalina y velocidad.', [], null);

// Exploración y Naturaleza
act('invierno', 'Exploración & Naturaleza', 'Caminatas con Raquetas (Día)', 'Recorridos guiados por bosques nevados que permiten explorar la montaña de forma accesible y segura, conectando con el entorno natural.', [], null);
act('invierno', 'Exploración & Naturaleza', 'Caminatas con Raquetas (Noche)', 'Experiencia nocturna en la nieve que permite descubrir el paisaje bajo una atmósfera única, ideal para quienes buscan algo diferente. Para más información, acércate al mesón de recepción del Hotel.', [], null);

// Bienestar y Talleres Indoor
act('invierno', 'Bienestar y Talleres Indoor', 'Spa y Wellness', 'Espacio integral de bienestar con tratamientos, sauna, baños de vapor y experiencias diseñadas para la relajación y recuperación en altura.', ['Spa Alunco'], null);
act('invierno', 'Bienestar y Talleres Indoor', 'Piscina Temperada', 'Relájate en piscinas de aguas termales provenientes de la montaña, con temperaturas diseñadas para el descanso y la recuperación.', ['Piscina Temperada'], null);

// Niños (invierno)
act('invierno', 'Niños', 'Tour Astronómico', 'Experiencia nocturna con introducción a la astronomía y observación de astros mediante telescopio.', ['1 Hora', 'Altitud de 1.600 msnm', 'Dificultad Fácil', '16 Pasajeros'], null);
act('invierno', 'Niños', 'Taller de Pizza', 'Actividad culinaria familiar donde conocerás los orígenes de la pizza y aprenderás a preparar tu propia pizza a la piedra junto a un experto.', ['1 Hora', 'Dificultad Fácil', '16 Niños por Guía', 'Jueves y sábado'], null);

// Ski (Centro de Ski view — price lists)
const skiDia: [string, string][] = [
  ['Equipo Completo Ski / Snow Hi-Performance', '$56.000'],
  ['Equipo Completo Ski / Snow Gama Normal', '$52.000'],
  ['Equipo Completo Ski / Snow Niño', '$44.000'],
  ['Equipo por Separado Ski / Snow Hi-Performance', '$48.000'],
  ['Equipo por Separado Ski / Snow', '$40.000'],
  ['Equipo por Separado Ski / Snow Niño', '$36.000'],
  ['Botas', '$44.000'],
  ['Botas niño', '$36.000'],
  ['Casco', '$24.000'],
  ['Casco niño', '$20.000'],
];
for (const [n, p] of skiDia) act('invierno', 'SKI – Renta por Día', n, null, [], p);

const skiSem: [string, string][] = [
  ['Equipo Completo Ski / Snow Hi-Performance', '$236.000'],
  ['Equipo Completo Ski / Snow Gama Normal', '$216.000'],
  ['Equipo Completo Ski / Snow Niño', '$200.000'],
  ['Equipo por Separado Ski / Snow Hi-Performance', '$188.000'],
  ['Equipo por Separado Ski / Snow Gama Normal', '$168.000'],
  ['Equipo por Separado Ski / Snow Niño', '$144.000'],
  ['Bota', '$128.000'],
  ['Bota niño', '$112.000'],
];
for (const [n, p] of skiSem) act('invierno', 'SKI – Renta Semanal', n, null, [], p);

const skiServ: [string, string][] = [
  ['Encerado', '$28.000'],
  ['Afilado de cantos', '$28.000'],
  ['Cofix', '$28.000'],
  ['Reposición de bastón', '$24.000'],
];
for (const [n, p] of skiServ) act('invierno', 'SKI – Servicios', n, null, [], p);

async function main() {
  const before = await db.select().from(activities);
  const backupDir = resolve(__dirname, 'backups');
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  writeFileSync(resolve(backupDir, `actividades-${stamp}.json`), JSON.stringify({ activities: before }, null, 2));
  console.log(`Backup: scripts/backups/actividades-${stamp}.json`);
  console.log(`Before: ${before.length} activities | Prepared (Figma): ${rows.length}`);

  await db.delete(activities);
  for (let i = 0; i < rows.length; i += 50) await db.insert(activities).values(rows.slice(i, i + 50));

  const after = await db.select().from(activities);
  const grp: Record<string, Record<string, number>> = {};
  for (const a of after) { (grp[a.season] ??= {}); grp[a.season][a.category] = (grp[a.season][a.category] ?? 0) + 1; }
  console.log(`After:  ${after.length} activities`);
  console.log(JSON.stringify(grp, null, 2));
  process.exit(0);
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
