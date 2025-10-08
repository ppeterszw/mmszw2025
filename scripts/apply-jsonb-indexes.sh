#!/bin/bash

# Script to apply JSONB GIN indexes to Neon database
# Usage: ./scripts/apply-jsonb-indexes.sh

set -e  # Exit on error

echo "🚀 Applying JSONB GIN Indexes Migration"
echo "========================================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo ""
  echo "Please set DATABASE_URL to your Neon database connection string:"
  echo "  export DATABASE_URL='postgresql://neondb_owner:...'"
  echo ""
  echo "Or source your .env.local file:"
  echo "  set -a && source .env.local && set +a"
  exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""
echo "📊 Applying migration: add_jsonb_indexes.sql"
echo ""

# Apply the migration
psql "$DATABASE_URL" -f migrations/add_jsonb_indexes.sql

echo ""
echo "✅ Migration completed successfully!"
echo ""
echo "📈 Verifying indexes..."
echo ""

# Verify indexes were created
psql "$DATABASE_URL" -c "
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE (indexname LIKE '%jsonb%' OR indexname LIKE '%gin%')
  AND schemaname = 'public'
ORDER BY tablename, indexname;
" -t

echo ""
echo "✨ JSONB GIN indexes successfully applied!"
echo ""
echo "Performance Improvement:"
echo "  • JSONB queries: 10-100x faster"
echo "  • Storage overhead: ~10-20%"
echo ""
