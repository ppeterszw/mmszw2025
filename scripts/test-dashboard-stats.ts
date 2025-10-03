#!/usr/bin/env npx tsx

import { neon } from '@neondatabase/serverless';

async function testDashboardStats() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log('📊 Testing Dashboard Statistics...\n');

  // Test total members
  const totalMembersResult = await sql`SELECT COUNT(*) as count FROM members`;
  console.log('Total Members:', totalMembersResult[0].count);

  // Test active organizations
  const activeOrgsResult = await sql`SELECT COUNT(*) as count FROM organizations WHERE membership_status = 'active'`;
  console.log('Active Organizations:', activeOrgsResult[0].count);

  // Test pending applications (both individual and organization)
  const pendingIndAppsResult = await sql`
    SELECT COUNT(*) as count
    FROM individual_applications
    WHERE status IN ('submitted', 'pre_validation', 'eligibility_review', 'document_review')
  `;
  console.log('Pending Individual Applications:', pendingIndAppsResult[0].count);

  const pendingOrgAppsResult = await sql`
    SELECT COUNT(*) as count
    FROM organization_applications
    WHERE status IN ('submitted', 'pre_validation', 'eligibility_review', 'document_review')
  `;
  console.log('Pending Organization Applications:', pendingOrgAppsResult[0].count);

  // Test open cases
  const openCasesResult = await sql`SELECT COUNT(*) as count FROM cases WHERE status = 'open'`;
  console.log('Open Cases:', openCasesResult[0].count);

  // Test revenue this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const revenueResult = await sql`
    SELECT COALESCE(SUM(CAST(amount AS DECIMAL)), 0) as sum
    FROM payments
    WHERE status = 'completed'
      AND created_at >= ${startOfMonth.toISOString()}
  `;
  console.log('Revenue This Month:', revenueResult[0].sum);

  // Test pending renewals
  const currentYear = new Date().getFullYear();
  const renewalsResult = await sql`
    SELECT COUNT(*) as count
    FROM member_renewals
    WHERE renewal_year = ${currentYear}
      AND status IN ('pending', 'reminded')
  `;
  console.log('Renewals Pending:', renewalsResult[0].count);

  console.log('\n📋 Summary:');
  console.log('─'.repeat(50));
  console.log('All database queries executed successfully');
}

testDashboardStats().catch(console.error);
