import { sql } from "../server/db";

/**
 * Migration script to fix naming_series_counters table schema
 *
 * Old schema: id, series, current_value, prefix, updated_at
 * New schema: series_code, year, counter (matching shared/schema.ts)
 */
async function migrateNamingSeriesCounters() {
  console.log('🔄 Migrating naming_series_counters table...');

  try {
    console.log('Dropping old naming_series_counters table...');
    await sql`DROP TABLE IF EXISTS naming_series_counters CASCADE`;

    console.log('Creating new naming_series_counters table with correct schema...');
    await sql`
      CREATE TABLE naming_series_counters (
        series_code VARCHAR NOT NULL,
        year INTEGER NOT NULL,
        counter INTEGER DEFAULT 0,
        PRIMARY KEY (series_code, year)
      )
    `;

    console.log('✅ Table migrated successfully');
    console.log('Schema: series_code (VARCHAR), year (INTEGER), counter (INTEGER)');
    console.log('Primary Key: (series_code, year)');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateNamingSeriesCounters()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
