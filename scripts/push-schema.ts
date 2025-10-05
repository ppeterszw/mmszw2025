import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as schema from '../shared/schema';
import 'dotenv/config';

async function pushSchema() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL not found in environment');
  }

  console.log('Connecting to Neon database...');
  console.log('Database URL:', databaseUrl.substring(0, 40) + '...');

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  console.log('\nCreating tables...');

  try {
    // List all tables from schema
    const tables = Object.keys(schema).filter(key =>
      schema[key as keyof typeof schema] &&
      typeof schema[key as keyof typeof schema] === 'object' &&
      'getSQL' in (schema[key as keyof typeof schema] as any)
    );

    console.log(`Found ${tables.length} table definitions in schema`);

    // Check existing tables
    const result = await sql`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `;

    console.log(`\nExisting tables in database: ${result.length}`);
    result.forEach((row: any) => console.log(`  - ${row.tablename}`));

    console.log('\n✅ Schema check complete');
    console.log('\nTo create missing tables, run: npx drizzle-kit push');

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

pushSchema().catch(console.error);
