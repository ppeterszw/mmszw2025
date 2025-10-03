#!/usr/bin/env npx tsx

/**
 * Run Authentication System Migration
 * This script applies the auth system columns to the users table
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  console.log('🔄 Starting authentication system migration...\n');

  // Check for DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    console.error('   Set it to your Neon production database URL');
    process.exit(1);
  }

  console.log('📊 Database:', databaseUrl.substring(0, 50) + '...\n');

  try {
    // Initialize Neon client
    const sql = neon(databaseUrl);

    // Read migration SQL file
    const migrationPath = join(process.cwd(), 'migrations', 'add_auth_columns.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded:', migrationPath);
    console.log('📝 Executing migration statements...\n');

    // Split SQL into individual statements and filter out comments/empty lines
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement individually (Neon serverless doesn't support multiple statements)
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          console.log(`   [${i + 1}/${statements.length}] Executing...`);
          await sql(statement);
          console.log(`   ✓ Success`);
        } catch (error: any) {
          // Ignore "column already exists" errors
          if (error.message.includes('already exists')) {
            console.log(`   ⊙ Skipped (already exists)`);
          } else {
            throw error;
          }
        }
      }
    }

    console.log('✅ Migration completed successfully!\n');

    // Verify columns exist
    console.log('🔍 Verifying migration...\n');
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;

    console.log('📋 Users table columns:');
    console.log('─'.repeat(80));
    columns.forEach((col: any) => {
      const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(not null)';
      const defaultVal = col.column_default ? `[default: ${col.column_default.substring(0, 30)}]` : '';
      console.log(`  ${col.column_name.padEnd(30)} ${col.data_type.padEnd(20)} ${nullable} ${defaultVal}`);
    });
    console.log('─'.repeat(80));
    console.log(`\n✅ Total columns: ${columns.length}\n`);

    console.log('🎉 Authentication system is ready to use!');
    console.log('\n📖 Next steps:');
    console.log('   1. Test registration: POST /api/auth/register');
    console.log('   2. Test login: POST /api/auth/login');
    console.log('   3. Configure ZeptoMail for email notifications');
    console.log('   4. Review AUTH_SYSTEM_DOCUMENTATION.md for complete API reference\n');

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Verify DATABASE_URL is correct');
    console.error('   2. Check database connectivity');
    console.error('   3. Ensure you have ALTER TABLE permissions');
    console.error('   4. Review error details above\n');
    process.exit(1);
  }
}

// Run migration
runMigration();
