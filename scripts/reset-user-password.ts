#!/usr/bin/env npx tsx

/**
 * Reset user password directly (Development/Emergency Use Only)
 */

import { neon } from '@neondatabase/serverless';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function resetPassword() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('Usage: npx tsx scripts/reset-user-password.ts <email> <new-password>\n');
    console.log('Example: npx tsx scripts/reset-user-password.ts admin@example.com MyNewPass123!\n');
    process.exit(1);
  }

  // Validate password strength
  if (newPassword.length < 8) {
    console.error('❌ Password must be at least 8 characters long');
    process.exit(1);
  }

  if (!/[A-Z]/.test(newPassword)) {
    console.error('❌ Password must contain at least one uppercase letter');
    process.exit(1);
  }

  if (!/[a-z]/.test(newPassword)) {
    console.error('❌ Password must contain at least one lowercase letter');
    process.exit(1);
  }

  if (!/[0-9]/.test(newPassword)) {
    console.error('❌ Password must contain at least one number');
    process.exit(1);
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
    console.error('❌ Password must contain at least one special character');
    process.exit(1);
  }

  try {
    const sql = neon(databaseUrl);

    // Check if user exists
    const [user] = await sql`
      SELECT id, email, first_name, last_name, role
      FROM users
      WHERE email = ${email}
    `;

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log('\n🔄 Resetting password...\n');
    console.log('User Details:');
    console.log(`  Name:  ${user.first_name || ''} ${user.last_name || ''}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role:  ${user.role}\n`);

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and reset failed login attempts
    await sql`
      UPDATE users
      SET
        password = ${hashedPassword},
        login_attempts = 0,
        locked_until = NULL,
        password_changed_at = NOW(),
        email_verified = true
      WHERE id = ${user.id}
    `;

    console.log('✅ Password reset successfully!\n');
    console.log('Updated:');
    console.log('  ✓ New password set (scrypt hash)');
    console.log('  ✓ Login attempts reset to 0');
    console.log('  ✓ Account unlocked');
    console.log('  ✓ Email marked as verified');
    console.log('  ✓ Password change timestamp updated\n');

    console.log('🔐 Login Credentials:');
    console.log('─'.repeat(60));
    console.log(`  Email:    ${user.email}`);
    console.log(`  Password: ${newPassword}`);
    console.log('─'.repeat(60));

    console.log('\n💡 Next Steps:');
    console.log('  1. Login at: https://mms.estateagentscouncil.org/auth');
    console.log('     OR');
    console.log('     POST /api/auth/login with credentials above');
    console.log('  2. Change password after first login for security\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
