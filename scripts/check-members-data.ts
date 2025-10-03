#!/usr/bin/env npx tsx

import { neon } from '@neondatabase/serverless';

async function checkMembersData() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log('📋 Checking Members Data...\n');

  // Get all members
  const members = await sql`
    SELECT
      id,
      membership_number,
      first_name,
      last_name,
      email,
      phone,
      member_type,
      membership_status,
      organization_id,
      joined_date,
      expiry_date,
      created_at
    FROM members
    ORDER BY created_at DESC
  `;

  console.log(`Found ${members.length} members:\n`);
  console.log('='.repeat(100));

  members.forEach((member: any, index: number) => {
    console.log(`\n${index + 1}. ${member.first_name} ${member.last_name}`);
    console.log(`   Membership #:    ${member.membership_number || 'N/A'}`);
    console.log(`   Email:           ${member.email}`);
    console.log(`   Phone:           ${member.phone || 'N/A'}`);
    console.log(`   Member Type:     ${member.member_type}`);
    console.log(`   Status:          ${member.membership_status}`);
    console.log(`   Organization ID: ${member.organization_id || 'N/A'}`);
    console.log(`   Joined Date:     ${member.joined_date ? new Date(member.joined_date).toLocaleDateString() : 'N/A'}`);
    console.log(`   Expiry Date:     ${member.expiry_date ? new Date(member.expiry_date).toLocaleDateString() : 'N/A'}`);
    console.log(`   Created:         ${new Date(member.created_at).toLocaleString()}`);
  });

  console.log('\n' + '='.repeat(100));

  // Check what the API endpoint returns
  console.log('\n📡 Testing /api/members endpoint format...\n');

  // Show column names and types
  const columns = await sql`
    SELECT column_name, data_type, udt_name
    FROM information_schema.columns
    WHERE table_name = 'members'
    ORDER BY ordinal_position
  `;

  console.log('Members table schema:');
  columns.forEach((col: any) => {
    console.log(`  ${col.column_name.padEnd(25)} ${col.data_type.padEnd(20)} ${col.udt_name}`);
  });

  console.log('\n');
}

checkMembersData();
