#!/usr/bin/env npx tsx

/**
 * List all users in the system
 */

import { neon } from '@neondatabase/serverless';

async function listUsers() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  try {
    const sql = neon(databaseUrl);

    console.log('📊 User Management System - Current Users\n');
    console.log('═'.repeat(100));

    // Get all users with key fields
    const users = await sql`
      SELECT
        id,
        email,
        first_name,
        last_name,
        role,
        status,
        email_verified,
        last_login_at,
        login_attempts,
        locked_until,
        clerk_id,
        created_at
      FROM users
      ORDER BY created_at DESC
    `;

    if (users.length === 0) {
      console.log('\n⚠️  No users found in the system\n');
      return;
    }

    console.log(`\n✅ Found ${users.length} user(s)\n`);
    console.log('─'.repeat(100));

    users.forEach((user: any, index: number) => {
      const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || '(No name)';
      const emailVerified = user.email_verified ? '✓ Verified' : '✗ Not verified';
      const lastLogin = user.last_login_at
        ? new Date(user.last_login_at).toLocaleString()
        : 'Never';
      const locked = user.locked_until && new Date(user.locked_until) > new Date()
        ? `🔒 Locked until ${new Date(user.locked_until).toLocaleString()}`
        : '';
      const clerkStatus = user.clerk_id ? '(Clerk enabled)' : '';

      console.log(`\n${index + 1}. ${fullName}`);
      console.log(`   Email:          ${user.email}`);
      console.log(`   Role:           ${user.role || 'N/A'}`);
      console.log(`   Status:         ${user.status || 'N/A'} ${locked}`);
      console.log(`   Email Status:   ${emailVerified}`);
      console.log(`   Last Login:     ${lastLogin}`);
      console.log(`   Login Attempts: ${user.login_attempts || 0}`);
      console.log(`   Created:        ${new Date(user.created_at).toLocaleString()}`);
      if (user.clerk_id) {
        console.log(`   Clerk ID:       ${user.clerk_id} ${clerkStatus}`);
      }
      console.log(`   User ID:        ${user.id}`);
    });

    console.log('\n' + '─'.repeat(100));

    // Summary by role
    console.log('\n📊 Users by Role:');
    const roleCount = await sql`
      SELECT role, COUNT(*) as count
      FROM users
      WHERE role IS NOT NULL
      GROUP BY role
      ORDER BY count DESC
    `;

    roleCount.forEach((rc: any) => {
      console.log(`   ${rc.role}: ${rc.count}`);
    });

    // Summary by status
    console.log('\n📊 Users by Status:');
    const statusCount = await sql`
      SELECT status, COUNT(*) as count
      FROM users
      WHERE status IS NOT NULL
      GROUP BY status
      ORDER BY count DESC
    `;

    statusCount.forEach((sc: any) => {
      console.log(`   ${sc.status}: ${sc.count}`);
    });

    // Email verification stats
    const verificationStats = await sql`
      SELECT
        COUNT(*) FILTER (WHERE email_verified = true) as verified,
        COUNT(*) FILTER (WHERE email_verified = false) as unverified
      FROM users
    `;

    console.log('\n📧 Email Verification:');
    console.log(`   Verified:   ${verificationStats[0].verified}`);
    console.log(`   Unverified: ${verificationStats[0].unverified}`);

    // Account security stats
    const securityStats = await sql`
      SELECT
        COUNT(*) FILTER (WHERE locked_until IS NOT NULL AND locked_until > NOW()) as locked,
        COUNT(*) FILTER (WHERE login_attempts > 0) as with_failed_attempts
      FROM users
    `;

    console.log('\n🔒 Security Status:');
    console.log(`   Locked Accounts:        ${securityStats[0].locked}`);
    console.log(`   With Failed Attempts:   ${securityStats[0].with_failed_attempts}`);

    console.log('\n' + '═'.repeat(100) + '\n');

  } catch (error: any) {
    console.error('❌ Error fetching users:', error.message);
    process.exit(1);
  }
}

listUsers();
