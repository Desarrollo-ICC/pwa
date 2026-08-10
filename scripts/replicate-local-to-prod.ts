// Replica el CONTENIDO de la DB local hacia la DB destino (producción vía prod.sh).
// Reemplaza por completo las tablas de contenido; preserva admins, activity_logs y system_settings.
// Uso: bash scripts/prod.sh scripts/replicate-local-to-prod.ts
// Requiere respaldo previo (scripts/backups/prod-full-backup-*.sql).
import './_env';
import postgres from 'postgres';

const LOCAL_URL = process.env.LOCAL_DATABASE_URL ?? 'postgresql://ravenswood:ravenswood_secret@localhost:5436/hoteltermas';

// Tablas de contenido a reemplazar. `alerts` se vacía pero NO se copia
// (la alerta local es de demostración; las reales se crean desde el admin).
const COPY_TABLES = [
  'spa_services', 'spa_schedules', 'gym_classes',
  'restaurant_items', 'restaurant_schedules',
  'activities', 'family_programs',
  'room_products', 'room_info',
  'events', 'info_pages',
];

async function main() {
  const target = process.env.DATABASE_URL ?? '';
  if (!target || target.includes('localhost')) {
    console.error('DATABASE_URL destino no es producción; usa scripts/prod.sh');
    process.exit(1);
  }
  const local = postgres(LOCAL_URL, { ssl: false });
  const prod = postgres(target, { ssl: 'require' });

  for (const t of ['alerts', ...COPY_TABLES]) {
    const [{ count }] = await prod.unsafe(`SELECT count(*)::int AS count FROM ${t}`);
    console.log(`prod ${t}: ${count} filas antes`);
  }

  // vaciar contenido en destino
  await prod.unsafe(`TRUNCATE alerts, ${COPY_TABLES.join(', ')} RESTART IDENTITY CASCADE`);
  console.log('— tablas de contenido vaciadas en destino —');

  for (const t of COPY_TABLES) {
    const rows = await local.unsafe(`SELECT * FROM ${t} ORDER BY 1`);
    if (rows.length === 0) { console.log(`${t}: 0 filas (local vacía)`); continue; }
    const cols = Object.keys(rows[0]);
    for (const row of rows) {
      const values = cols.map(c => row[c]);
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
      await prod.unsafe(
        `INSERT INTO ${t} (${cols.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`,
        values
      );
    }
    // realinear la secuencia del id si existe
    await prod.unsafe(
      `SELECT setval(pg_get_serial_sequence('${t}', 'id'), COALESCE((SELECT MAX(id) FROM ${t}), 1))`
    ).catch(() => {});
    console.log(`${t}: ${rows.length} filas copiadas`);
  }

  for (const t of COPY_TABLES) {
    const [{ count: pc }] = await prod.unsafe(`SELECT count(*)::int AS count FROM ${t}`);
    const [{ count: lc }] = await local.unsafe(`SELECT count(*)::int AS count FROM ${t}`);
    const ok = pc === lc ? 'OK' : '≠ MISMATCH';
    console.log(`verify ${t}: local=${lc} prod=${pc} ${ok}`);
  }

  await local.end();
  await prod.end();
  console.log('Replicación completa.');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
