// Loads .env files into process.env. MUST be the FIRST import in any script that
// imports `lib/db`, because ES module imports execute in order and `lib/db` reads
// DATABASE_URL at module-init time (otherwise it silently falls back to localhost:5433).
// Set SYNC_TARGET=prod to load .env.production.local instead.
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Si DATABASE_URL ya viene exportada (scripts/prod.sh), no se lee ningún .env — PRE_SET
const preset = !!process.env.DATABASE_URL;
const files = preset ? [] : process.env.SYNC_TARGET === 'prod'
  ? ['../.env.production.local']
  : ['../.env.local', '../.env'];

for (const file of files) {
  try {
    const env = readFileSync(resolve(__dirname, file), 'utf8');
    for (const line of env.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  } catch {}
}

const url = process.env.DATABASE_URL ?? '';
try {
  const u = new URL(url);
  const isProd = preset || process.env.SYNC_TARGET?.startsWith('prod') || /rlwy\.net|railway|neon\.tech/.test(u.hostname);
  console.log(`[db] ${isProd ? '\u001b[31mPRODUCCIÓN\u001b[0m' : 'LOCAL'} → ${u.hostname}:${u.port || 'default'}${u.pathname}`);
} catch {
  console.warn('[db] WARNING: no valid DATABASE_URL loaded');
}
