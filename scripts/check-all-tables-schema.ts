#!/usr/bin/env npx tsx

import { neon } from '@neondatabase/serverless';

async function checkAllTables() {
  const sql = neon(process.env.DATABASE_URL!);

  const tables = ['members', 'organizations', 'individual_applications', 'organization_applications', 'cases', 'payments'];

  for (const table of tables) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Table: ${table}`);
    console.log('='.repeat(60));

    try {
      const cols = await sql`
        SELECT column_name, data_type, udt_name
        FROM information_schema.columns
        WHERE table_name = ${table}
        ORDER BY ordinal_position
      `;

      if (cols.length === 0) {
        console.log(`  ⚠️  Table "${table}" does not exist`);
        continue;
      }

      cols.forEach((c: any) => {
        const type = c.udt_name || c.data_type;
        console.log(`  ${c.column_name.padEnd(30)} ${type}`);
      });

      // Count rows
      const countResult = await sql`SELECT COUNT(*) as count FROM ${sql(table)}`;
      console.log(`\n  📊 Row count: ${countResult[0].count}`);

    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }

  console.log(`\n${'='.repeat(60)}\n`);
}

checkAllTables();
