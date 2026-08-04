#!/usr/bin/env bash
# Ejecuta un script tsx contra la base de PRODUCCIÓN (Railway) usando el proxy público.
# Uso: bash scripts/prod.sh scripts/sync-arboleda.ts
set -euo pipefail
URL="$(railway variables --service Postgres --kv 2>/dev/null | grep '^DATABASE_PUBLIC_URL=' | cut -d= -f2-)"
if [ -z "$URL" ]; then echo "No se pudo obtener DATABASE_PUBLIC_URL"; exit 1; fi
export DATABASE_URL="$URL"
export SYNC_TARGET=prod-explicit
exec npx tsx "$@"
