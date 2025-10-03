import { sql } from '../server/db';

async function addOrganizationPortalTables() {
  try {
    console.log('Adding Organization Portal tables...\n');

    // 1. Add prea_member_id column to organizations table
    console.log('1. Adding prea_member_id column to organizations table...');
    await sql`
      ALTER TABLE organizations
      ADD COLUMN IF NOT EXISTS prea_member_id VARCHAR
    `;
    console.log('✓ Added prea_member_id column\n');

    // 2. Create directors table
    console.log('2. Creating directors table...');
    await sql`
      CREATE TABLE IF NOT EXISTS directors (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id VARCHAR NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        national_id TEXT,
        email TEXT,
        phone TEXT,
        position TEXT,
        appointed_date TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
      )
    `;
    console.log('✓ Created directors table\n');

    // 3. Add foreign key constraint for prea_member_id
    console.log('3. Adding foreign key constraint for prea_member_id...');
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'organizations_prea_member_id_fkey'
        ) THEN
          ALTER TABLE organizations
          ADD CONSTRAINT organizations_prea_member_id_fkey
          FOREIGN KEY (prea_member_id) REFERENCES members(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `;
    console.log('✓ Added foreign key constraint\n');

    // 4. Verify tables were created
    console.log('4. Verifying tables...');
    const directorsCount = await sql`SELECT COUNT(*) as count FROM directors`;
    console.log(`✓ Directors table exists (${directorsCount[0].count} records)\n`);

    console.log('✅ Migration completed successfully!');

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }

  process.exit(0);
}

addOrganizationPortalTables();
