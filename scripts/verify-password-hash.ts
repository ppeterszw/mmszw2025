#!/usr/bin/env npx tsx

import { neon } from '@neondatabase/serverless';
import { scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashedPassword, salt] = stored.split('.');
  const hashedSuppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return hashedPassword === hashedSuppliedBuf.toString('hex');
}

async function verifyPassword() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  const [user] = await sql`
    SELECT id, email, password
    FROM users
    WHERE email = 'sysadmin@estateagentscouncil.org'
  `;

  if (!user) {
    console.log('User not found');
    process.exit(1);
  }

  console.log('Testing password verification...\n');
  console.log('Email:', user.email);
  console.log('Stored hash:', user.password.substring(0, 50) + '...');
  console.log('Hash format:', user.password.includes('.') ? 'scrypt (new)' : 'other');

  const testPassword = 'minaNA!20210117';

  try {
    const isValid = await comparePasswords(testPassword, user.password);
    console.log('\nPassword test:', testPassword);
    console.log('Result:', isValid ? '✅ VALID' : '❌ INVALID');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

verifyPassword();
