import postgres from "postgres";

const LOCAL_URL = "postgresql://ravenswood:ravenswood_secret@localhost:5436/hoteltermas";
const RAILWAY_NEW_URL = "postgresql://postgres:DIzctFdyUKNIuqUtnWWoSdVaJFrrEKfq@acela.proxy.rlwy.net:46618/railway";

const src = postgres(LOCAL_URL, { max: 1 });
const dst = postgres(RAILWAY_NEW_URL, { ssl: "require", max: 1 });

const tables = [
  "activities",
  "spa_services",
  "spa_schedules",
  "gym_classes",
  "restaurant_items",
  "restaurant_schedules",
  "family_programs",
  "room_products",
  "room_info",
  "alerts",
  "events",
  "system_settings",
  "admins",
];

async function copyTable(table: string) {
  const rows = await src`SELECT * FROM ${src(table)}`;
  if (rows.length === 0) {
    console.log(`  ${table}: vacía, saltando`);
    return;
  }
  await dst`TRUNCATE ${dst(table)} RESTART IDENTITY CASCADE`;
  await dst`INSERT INTO ${dst(table)} ${dst(rows as any[])}`;
  console.log(`  ${table}: ${rows.length} filas copiadas`);
}

async function main() {
  console.log("Copiando datos de Railway → local...");
  for (const table of tables) {
    try {
      await copyTable(table);
    } catch (e: any) {
      console.error(`  ERROR en ${table}: ${e.message}`);
    }
  }
  await src.end();
  await dst.end();
  console.log("\nListo!");
}

main();
