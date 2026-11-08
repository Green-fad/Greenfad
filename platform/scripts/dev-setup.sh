#!/bin/bash
# GREEN FAD — préparation environnement local (D1 + seed + build)
set -e
cd "$(dirname "$0")/.."

PERSIST="/home/z/my-project/greenfad/.wrangler-persist"
mkdir -p "$PERSIST"

echo "== migrations D1 locales =="
npx wrangler d1 migrations apply greenfad-production --local --persist-to="$PERSIST" 2>&1 | tail -4

echo "== seed.sql =="
npx wrangler d1 execute greenfad-production --local --persist-to="$PERSIST" --file=seed/seed.sql 2>&1 | tail -2
echo "== content-update.sql =="
npx wrangler d1 execute greenfad-production --local --persist-to="$PERSIST" --file=seed/content-update.sql 2>&1 | tail -2

echo "== build =="
npm run build 2>&1 | tail -2

# Piège connu : deux clés sqlite sous persist/v3/d1 — propager la BDD peuplée
DBDIR="$PERSIST/v3/d1/miniflare-D1DatabaseObject"
if [ -d "$DBDIR" ]; then
  MAIN=$(ls -S "$DBDIR"/*.sqlite 2>/dev/null | head -1)
  echo "== base peuplée : $MAIN =="
  for f in "$DBDIR"/*.sqlite; do
    if [ "$f" != "$MAIN" ]; then cp "$MAIN" "$f"; echo "copiée → $f"; fi
  done
fi
echo "== DEV-SETUP OK =="
