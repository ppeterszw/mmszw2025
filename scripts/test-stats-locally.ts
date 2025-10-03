#!/usr/bin/env npx tsx

import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from '../shared/schema';
import { eq, sql, and } from 'drizzle-orm';

const { members, organizations, individualApplications, organizationApplications, cases, payments, memberRenewals } = schema;

async function testStats() {
  const databaseUrl = process.env.DATABASE_URL!;
  const sqlClient = neon(databaseUrl);
  const db = drizzle(sqlClient, { schema });

  console.log('Testing dashboard stats queries...\n');

  try {
    // Test 1: Total members
    console.log('1. Testing total members count...');
    const totalMembersResult = await db.select({ count: sql<number>`count(*)` }).from(members);
    console.log('   Result:', totalMembersResult[0]?.count || 0);

    // Test 2: Active organizations
    console.log('\n2. Testing active organizations count...');
    const activeOrganizationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(organizations)
      .where(eq(organizations.status, "active"));
    console.log('   Result:', activeOrganizationsResult[0]?.count || 0);

    // Test 3: Pending individual applications
    console.log('\n3. Testing pending individual applications...');
    const pendingIndApps = await db
      .select({ count: sql<number>`count(*)` })
      .from(individualApplications)
      .where(sql`status IN ('submitted', 'payment_pending', 'payment_received', 'under_review')`);
    console.log('   Result:', pendingIndApps[0]?.count || 0);

    // Test 4: Pending organization applications
    console.log('\n4. Testing pending organization applications...');
    const pendingOrgApps = await db
      .select({ count: sql<number>`count(*)` })
      .from(organizationApplications)
      .where(sql`status IN ('submitted', 'payment_pending', 'payment_received', 'under_review')`);
    console.log('   Result:', pendingOrgApps[0]?.count || 0);

    // Test 5: Open cases
    console.log('\n5. Testing open cases count...');
    const openCasesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(cases)
      .where(eq(cases.status, "open"));
    console.log('   Result:', openCasesResult[0]?.count || 0);

    // Test 6: Revenue this month
    console.log('\n6. Testing revenue this month...');
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenueResult = await db
      .select({ sum: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` })
      .from(payments)
      .where(and(
        eq(payments.status, "completed"),
        sql`created_at >= ${startOfMonth}`
      ));
    console.log('   Result:', revenueResult[0]?.sum || 0);

    console.log('\n✅ All queries successful!');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testStats();
