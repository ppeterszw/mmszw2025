#!/usr/bin/env npx tsx

/**
 * Check user password information
 */

import { neon } from '@neondatabase/serverless';

async function checkUserPassword() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  try {
    const sql = neon(databaseUrl);

    const email = 'sysadmin@estateagentscouncil.org';

    console.log(`🔍 Checking password information for: ${email}\n`);

    const [user] = await sql`
      SELECT
        id,
        email,
        password,
        first_name,
        last_name,
        role,
        status,
        email_verified,
        clerk_id
      FROM users
      WHERE email = ${email}
    `;

    if (!user) {
      console.log('❌ User not found\n');
      return;
    }

    console.log('User Information:');
    console.log('─'.repeat(80));
    console.log(`Name:           ${user.first_name || ''} ${user.last_name || ''}`);
    console.log(`Email:          ${user.email}`);
    console.log(`Role:           ${user.role}`);
    console.log(`Status:         ${user.status}`);
    console.log(`Email Verified: ${user.email_verified ? 'Yes' : 'No'}`);
    console.log(`Clerk ID:       ${user.clerk_id || 'Not set'}`);
    console.log('─'.repeat(80));

    console.log('\n🔐 Password Information:');
    console.log('─'.repeat(80));

    if (!user.password) {
      console.log('⚠️  NO PASSWORD SET');
      console.log('\nThis user has no password in the database.');
      console.log('Possible reasons:');
      console.log('  1. User was created but password was never set');
      console.log('  2. User is using Clerk authentication only (clerk_id exists)');
      console.log('  3. Password needs to be set via password reset flow');
    } else {
      const passwordHash = user.password;
      console.log(`Password Hash:  ${passwordHash.substring(0, 60)}...`);
      console.log(`Hash Length:    ${passwordHash.length} characters`);

      // Determine hash type
      if (passwordHash.startsWith('$2')) {
        console.log(`Hash Type:      bcrypt`);
      } else if (passwordHash.includes(':')) {
        console.log(`Hash Type:      scrypt (new auth system)`);
      } else {
        console.log(`Hash Type:      Unknown/Legacy`);
      }

      console.log('\n⚠️  SECURITY NOTE:');
      console.log('The actual password cannot be retrieved from the hash.');
      console.log('Passwords are one-way encrypted for security.');
    }

    console.log('─'.repeat(80));

    console.log('\n💡 Options to Access This Account:');
    console.log('─'.repeat(80));

    if (user.clerk_id) {
      console.log('✅ Option 1: Use Clerk Authentication');
      console.log('   - Login at: /admin-login');
      console.log(`   - Clerk ID: ${user.clerk_id}`);
      console.log('');
    }

    if (user.password) {
      console.log('✅ Option 2: If you know the current password');
      console.log('   - Login at: /api/auth/login');
      console.log('   - Use existing credentials');
      console.log('');
    }

    console.log('✅ Option 3: Password Reset Flow');
    console.log('   - Request reset: POST /api/auth/forgot-password');
    console.log(`   - Email: ${user.email}`);
    console.log('   - Follow reset link in email');
    console.log('');

    console.log('✅ Option 4: Direct Database Password Update (Development Only)');
    console.log('   - Run script: npx tsx scripts/reset-user-password.ts');
    console.log('   - Sets a new password directly in database');

    console.log('─'.repeat(80) + '\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUserPassword();
