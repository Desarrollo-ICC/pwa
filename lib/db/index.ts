import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import postgres from "postgres";
import { drizzle as postgresDrizzle } from "drizzle-orm/postgres-js";

const url = process.env.DATABASE_URL ?? "";

const isNeon = url.includes("neon.tech") || url.includes("neon.database");
const isRailway = url.includes("railway.internal") || url.includes("rlwy.net");

export const db = isNeon
  ? neonDrizzle(neon(url), { schema })
  : postgresDrizzle(
      postgres(url || "postgresql://ravenswood:ravenswood_secret@localhost:5433/hoteltermas", {
        ssl: isRailway ? "require" : false,
      }),
      { schema }
    );
