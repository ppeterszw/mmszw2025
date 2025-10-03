#!/usr/bin/env npx tsx

import { neon } from '@neondatabase/serverless';

async function addPhoneColumn() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log('Adding phone column to users table...');

  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT`;
    console.log('✅ Phone column added successfully');

    // Verify
    const result = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'phone'
    `;

    if (result.length > 0) {
      console.log('✅ Verified: phone column exists');
    } else {
      console.log('⚠️  Warning: phone column not found after adding');
    }
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addPhoneColumn();
