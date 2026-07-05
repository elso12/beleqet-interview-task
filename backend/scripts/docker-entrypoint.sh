#!/bin/sh
set -e

echo "=== Beleqet API startup ==="

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set. Link beleqet-db on Render."
  exit 1
fi

if [ -z "$JWT_ACCESS_SECRET" ]; then
  echo "ERROR: JWT_ACCESS_SECRET is not set. Add it in Render Environment."
  exit 1
fi

if [ -z "$REDIS_URL" ] && [ -z "$REDIS_HOST" ]; then
  echo "WARN: REDIS_URL / REDIS_HOST not set — queues may fail; set Upstash REDIS_URL"
fi

echo "Syncing database schema..."
npx prisma db push --accept-data-loss

echo "Seeding demo data..."
npm run prisma:seed || echo "Seed skipped (may already exist)"

echo "Starting API on port ${PORT:-4000}..."
exec npm run start:prod
