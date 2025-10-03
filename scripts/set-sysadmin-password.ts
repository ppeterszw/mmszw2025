#!/usr/bin/env npx tsx

import { neon } from '@neondatabase/serverless';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function setPassword() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  // Hardcode the password here to avoid shell escaping issues
  const email = 'sysadmin@estateagentscouncil.org';
  const password = 'minaNA!20210117';

  console.log('Setting password for:', email);
  console.log('Password (plain):', password);
  console.log('Password length:', password.length);
  console.log('');

  const hashedPassword = await hashPassword(password);
  console.log('Hashed password:', hashedPassword.substring(0, 50) + '...');

  await sql`
    UPDATE users
    SET
      password = ${hashedPassword},
      login_attempts = 0,
      locked_until = NULL,
      password_changed_at = NOW(),
      email_verified = true
    WHERE email = ${email}
  `;

  console.log('✅ Password updated successfully');

  // Verify it works
  const [user] = await sql`SELECT password FROM users WHERE email = ${email}`;

  const [storedHash, salt] = user.password.split('.');
  const testHashBuf = (await scryptAsync(password, salt, 64)) as Buffer;
  const isValid = storedHash === testHashBuf.toString('hex');

  console.log('Verification:', isValid ? '✅ PASS' : '❌ FAIL');
  console.log('\n🔐 Login with:');
  console.log('  Email:', email);
  console.log('  Password:', password);
}

setPassword();
