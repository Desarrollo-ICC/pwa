// Sync Familia y Niños to match Figma 1:1. Backs up. Deletes ONLY type in (actividad,club,guarderia)
// so image/hero rows stored in family_programs (cat_ninos, hero_*, etc.) are preserved.
import './_env';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { familyPrograms } from '../lib/db/schema';
import { inArray } from 'drizzle-orm';

type Row = typeof familyPrograms.$inferInsert;
const rows: Row[] = [];
let ord = 0;
function prog(type: string, name: string, paragraph: string | null, bullets: string[], opts: { season?: string | null; schedule?: string | null } = {}) {
  const description = paragraph ? (bullets.length ? paragraph + '\n' + bullets.join('\n') : paragraph) : null;
  rows.push({ type, name, description, schedule: opts.schedule ?? null, season: opts.season ?? null, active: true, order: ++ord });
}

// ── Actividades de Temporada (type=actividad) ────────────────────────────────
prog('actividad', 'Canopy Infantil', 'Actividad de tirolesa diseñada para niños, combinando aventura y seguridad en un entorno controlado.',
  ['1 Hora', 'Altitud de 1.600 msnm', 'Dificultad Fácil', '6 Niños por Guía'], { season: 'verano' });
prog('actividad', 'Caminata Nocturna', 'Exploración guiada del bosque cercano al hotel en horario nocturno, utilizando linternas.',
  ['1,5 Horas', 'Altitud de 1.600 msnm', 'Dificultad Fácil', '8 Niños por Guía', '1,6 Km de Distancia'], { season: 'verano' });
prog('actividad', 'Tour Astronómico', 'Experiencia nocturna con introducción a la astronomía y observación de astros mediante telescopio.',
  ['1 Hora', 'Altitud de 1.600 msnm', 'Dificultad Fácil', '16 Pasajeros'], { season: 'invierno' });
prog('actividad', 'Taller de Pizza', 'Actividad culinaria familiar donde conocerás los orígenes de la pizza y aprenderás a preparar tu propia pizza a la piedra junto a un experto.',
  ['1 Hora', 'Dificultad Fácil', '16 Niños por Guía', 'Jueves y sábado'], { season: 'invierno' });

// ── Clubes / Actividades permanentes (type=club, season-independent) ─────────
prog('club', 'Club de la Montaña', 'Programa con actividades recreativas y educativas enfocadas en la exploración, el juego y la conexión con la naturaleza.',
  ['Desde los 7 años de edad']);
prog('club', 'Mini Kids Club', 'Sala de Actividades segura, enfocadas a la exploración y descubrimiento libre, supervisado por educadoras de párvulo.',
  ['Desde los 4 años hasta los 7 años de edad.', '8:30 - 19:00', 'De lunes a domingo']);
prog('club', 'Salón de Juegos', 'Espacio de entretención y recreación para toda la familia.',
  ['8:30 - 23:30']);

// ── Guardería (type=guarderia) — schedule + reglamento ───────────────────────
const reglamento = `Con el fin de asegurar el bienestar, la seguridad y una buena convivencia, solicitamos respetar las siguientes normas:

1. Edad y supervisión
Para niños/as de 3 a 7 años con control de esfínter. Menores de 3 años deben estar siempre con un adulto (opción de babysitter disponible).

2. Ingreso y retiro
Siempre con un adulto responsable.
Se debe firmar ingreso y entregar información actualizada (salud, alergias, contacto).

Mantener teléfono disponible ante emergencias.
Ante cualquier situación, el equipo contactará al adulto registrado.

3. Bienestar
La permanencia debe ser voluntaria.
No se permite consumo de alimentos dentro del recinto.

4. Autonomía
Niños/as deben ser autónomos en el uso del baño (educadoras solo acompañan).

5. Uso de espacios y materiales
Juguetes permanecen en la guardería (solo se llevan manualidades).

Espacios y mobiliario son de uso preferente de los niños/as.

Adultos pueden acompañar en zonas habilitadas.

6. Convivencia
Caminar dentro del espacio y jugar de forma respetuosa.

Cuidar y ordenar materiales.

Respetar a otros niños/as, especialmente a los más pequeños.

Usar juegos y estructuras de forma segura.`;
rows.push({ type: 'guarderia', name: 'Guardería', description: reglamento, schedule: 'Lunes a Sábado: 08:30 a 18:30 | Domingo: 08:30 a 16:30', season: null, active: true, order: ++ord });

async function main() {
  const types = ['actividad', 'club', 'guarderia'];
  const all = await db.select().from(familyPrograms);
  const before = all.filter(p => types.includes(p.type));
  const preserved = all.filter(p => !types.includes(p.type));
  const backupDir = resolve(__dirname, 'backups');
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  writeFileSync(resolve(backupDir, `familia-${stamp}.json`), JSON.stringify({ all }, null, 2));
  console.log(`Backup: scripts/backups/familia-${stamp}.json`);
  console.log(`Before: ${before.length} content rows (+ ${preserved.length} image/other rows preserved) | Prepared (Figma): ${rows.length}`);

  await db.delete(familyPrograms).where(inArray(familyPrograms.type, types));
  await db.insert(familyPrograms).values(rows);

  const after = (await db.select().from(familyPrograms)).filter(p => types.includes(p.type));
  const grp: Record<string, number> = {};
  for (const p of after) grp[`${p.type}${p.season ? '/' + p.season : ''}`] = (grp[`${p.type}${p.season ? '/' + p.season : ''}`] ?? 0) + 1;
  console.log(`After:  ${after.length} content rows`);
  console.log(JSON.stringify(grp, null, 2));
  process.exit(0);
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
