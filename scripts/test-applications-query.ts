import { sql } from '../server/db';

async function testApplicationsQuery() {
  try {
    console.log('Testing applications query...\n');

    // Test 1: Count total applications
    const totalApps = await sql`SELECT COUNT(*) as count FROM individual_applications`;
    console.log('Total individual applications:', totalApps[0].count);

    // Test 2: Get all statuses
    const statuses = await sql`SELECT DISTINCT status FROM individual_applications`;
    console.log('\nDistinct statuses:', statuses.map(s => s.status));

    // Test 3: Count by status
    const statusCounts = await sql`
      SELECT status, COUNT(*) as count
      FROM individual_applications
      GROUP BY status
    `;
    console.log('\nApplications by status:');
    statusCounts.forEach(s => {
      console.log(`  ${s.status}: ${s.count}`);
    });

    // Test 4: Get submitted applications
    const submitted = await sql`
      SELECT id, application_id, applicant_email, status, created_at
      FROM individual_applications
      WHERE status = 'submitted'
      ORDER BY created_at DESC
      LIMIT 5
    `;
    console.log('\nSubmitted applications:', submitted.length);
    if (submitted.length > 0) {
      console.log('Sample:', JSON.stringify(submitted[0], null, 2));
    }

    // Test 5: Test the actual Drizzle query with pending statuses
    console.log('\n--- Testing Drizzle ORM query with pending statuses ---');
    const { db } = await import('../server/db');
    const { individualApplications } = await import('@shared/schema');
    const { desc, sql: drizzleSql } = await import('drizzle-orm');

    const apps = await db
      .select()
      .from(individualApplications)
      .where(drizzleSql`status IN ('submitted', 'payment_pending', 'payment_received', 'under_review')`)
      .orderBy(desc(individualApplications.createdAt));

    console.log('Drizzle query result:', apps.length, 'applications');
    if (apps.length > 0) {
      console.log('Sample:', JSON.stringify(apps[0], null, 2));
    }

    // Test 6: Test the actual storage function
    console.log('\n--- Testing storage.getPendingApplications() ---');
    const { storage } = await import('../server/storage');
    const pendingApps = await storage.getPendingApplications();
    console.log('Storage function result:', pendingApps.length, 'applications');
    if (pendingApps.length > 0) {
      console.log('Sample:', JSON.stringify(pendingApps[0], null, 2));
    }

  } catch (error: any) {
    console.error('Error:', error);
    console.error('Stack:', error.stack);
  }

  process.exit(0);
}

testApplicationsQuery();
