// Sync Home "Próximos Eventos" to match Figma 1:1. Backs up + full replace of `events`.
import './_env';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { db } from '../lib/db/index';
import { events } from '../lib/db/schema';

const rows: (typeof events.$inferInsert)[] = [
  {
    day: '29', month: 'Mar', time: '13:00',
    title: 'Noche de Folklore Chileno',
    description: 'Música y baile tradicional con artistas locales de la región del Biobío. Concierto sinfónico.',
    location: 'Salón Los Riscos', active: true, order: 1,
  },
  {
    day: '30', month: 'Mar', time: '13:00',
    title: 'Cata de Vinos del Valle',
    description: 'Selección de los mejores vinos de los valles centrales con maridaje.',
    location: 'Salón Los Riscos', active: true, order: 2,
  },
];

async function main() {
  const before = await db.select().from(events);
  const backupDir = resolve(__dirname, 'backups');
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  writeFileSync(resolve(backupDir, `home-events-${stamp}.json`), JSON.stringify({ events: before }, null, 2));
  console.log(`Backup: scripts/backups/home-events-${stamp}.json`);
  console.log(`Before: ${before.length} events | Prepared (Figma): ${rows.length}`);

  await db.delete(events);
  await db.insert(events).values(rows);

  const after = await db.select().from(events);
  console.log(`After:  ${after.length} events`);
  for (const e of after) console.log(`   - ${e.day} ${e.month} ${e.time} — ${e.title} (${e.location})`);
  process.exit(0);
}
main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
