#!/usr/bin/env npx tsx

import { neon } from '@neondatabase/serverless';

async function checkAndFixSchema() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log('🔍 Checking database schema...\n');

  try {
    // Check if user_status enum exists
    const enumCheck = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'user_status'
      ) as exists
    `;

    if (!enumCheck[0].exists) {
      console.log('Creating user_status enum...');
      await sql`
        CREATE TYPE user_status AS ENUM (
          'active', 'inactive', 'suspended', 'locked', 'pending_verification'
        )
      `;
      console.log('✅ user_status enum created');
    } else {
      console.log('✅ user_status enum already exists');
    }

    // Check user_role enum
    const roleEnumCheck = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'user_role'
      ) as exists
    `;

    if (!roleEnumCheck[0].exists) {
      console.log('Creating user_role enum...');
      await sql`
        CREATE TYPE user_role AS ENUM (
          'admin', 'member_manager', 'case_manager', 'super_admin', 'staff', 'accountant', 'reviewer'
        )
      `;
      console.log('✅ user_role enum created');
    } else {
      console.log('✅ user_role enum already exists');
    }

    // Check if status column exists and its type
    const statusCheck = await sql`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'status'
    `;

    if (statusCheck.length === 0) {
      console.log('\nAdding status column...');
      await sql`ALTER TABLE users ADD COLUMN status user_status DEFAULT 'active'`;
      console.log('✅ status column added');
    } else {
      console.log(`\n✅ status column exists (type: ${statusCheck[0].udt_name})`);
    }

    // Check if role column type is correct
    const roleCheck = await sql`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'role'
    `;

    if (roleCheck.length > 0 && roleCheck[0].udt_name !== 'user_role') {
      console.log(`\nRole column is type ${roleCheck[0].udt_name}, needs to be user_role enum`);
      console.log('Converting role column to user_role enum...');

      // Drop default first
      await sql`ALTER TABLE users ALTER COLUMN role DROP DEFAULT`;

      // Convert column type
      await sql`
        ALTER TABLE users
        ALTER COLUMN role TYPE user_role
        USING role::user_role
      `;

      // Set new default
      await sql`ALTER TABLE users ALTER COLUMN role SET DEFAULT 'staff'::user_role`;

      console.log('✅ role column converted to user_role enum');
    } else {
      console.log(`✅ role column is correct type`);
    }

    // Final verification
    console.log('\n📋 Final schema check:');
    const finalCheck = await sql`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'users'
        AND column_name IN ('role', 'status', 'phone')
      ORDER BY column_name
    `;

    finalCheck.forEach((col: any) => {
      console.log(`   ${col.column_name.padEnd(15)} ${col.data_type.padEnd(20)} ${col.udt_name}`);
    });

    console.log('\n✅ Schema is ready!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAndFixSchema();
