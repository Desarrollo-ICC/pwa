import './_env';
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });
const TABLES = ['alerts','events','spa_services','spa_schedules','gym_classes','restaurant_items',
  'restaurant_schedules','activities','family_programs','room_products','room_info','info_pages',
  'system_settings','admins','activity_logs'];
(async () => {
  for (const t of TABLES) {
    try {
      const r = await sql.unsafe(`SELECT setval(pg_get_serial_sequence('${t}','id'), COALESCE((SELECT MAX(id) FROM "${t}"),1), true) AS v`);
      console.log(`  ${t.padEnd(22)} → secuencia en ${r[0].v}`);
    } catch (e: any) { console.log(`  ${t.padEnd(22)} → ${e.message.slice(0,60)}`); }
  }
  await sql.end(); process.exit(0);
})();
