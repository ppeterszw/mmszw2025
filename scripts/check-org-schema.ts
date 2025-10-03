#!/usr/bin/env npx tsx

import { neon } from '@neondatabase/serverless';

async function checkSchema() {
  const sql = neon(process.env.DATABASE_URL!);

  const cols = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'organizations'
    ORDER BY ordinal_position
  `;

  console.log('Organizations table columns:');
  cols.forEach((c: any) => console.log('  ' + c.column_name + ' (' + c.data_type + ')'));
}

checkSchema();
