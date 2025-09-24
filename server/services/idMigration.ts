import { sql } from "drizzle-orm";
import { db } from "../db";
import { members, organizations, namingSeriesCounters } from "@shared/schema";

/**
 * Migration to update all existing Member and Organization IDs to new format
 * EAC-MBR-YYYY-XXXX for members and EAC-ORG-YYYY-XXXX for organizations
 */

interface MemberRecord {
  id: string;
  membership_number: string | null;
  joining_date: Date | null;
  created_at: Date;
}

interface OrganizationRecord {
  id: string;
  registration_number: string | null;
  registration_date: Date | null;
  created_at: Date;
}

/**
 * Determine enrollment year from record dates
 */
function getEnrollmentYear(joiningDate: Date | null, createdAt: Date): number {
  // Priority: 1) joining/registration date, 2) created date, 3) current year as fallback
  if (joiningDate) {
    return joiningDate.getFullYear();
  }
  if (createdAt) {
    return createdAt.getFullYear();
  }
  return new Date().getFullYear();
}

/**
 * Check if ID is already in new format
 */
function isNewFormat(id: string | null): boolean {
  if (!id) return false;
  // New format: EAC-MBR-YYYY-XXXX or EAC-ORG-YYYY-XXXX
  const newFormatRegex = /^EAC-(MBR|ORG)-\d{4}-\d{4}$/;
  return newFormatRegex.test(id);
}

/**
 * Check if migration has already been completed
 */
async function isMigrationCompleted(): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT value FROM system_settings 
      WHERE key = 'id_format_migration_2025_completed'
    `);
    return result.rows.length > 0 && result.rows[0]?.value === 'true';
  } catch (error) {
    // If table doesn't exist, migration hasn't been completed
    return false;
  }
}

/**
 * Mark migration as completed
 */
async function markMigrationCompleted(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS system_settings (
      key VARCHAR(255) PRIMARY KEY,
      value TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  
  await db.execute(sql`
    INSERT INTO system_settings (key, value) 
    VALUES ('id_format_migration_2025_completed', 'true')
    ON CONFLICT (key) 
    DO UPDATE SET value = 'true', created_at = NOW()
  `);
}

/**
 * Dry run migration - returns preview of changes without applying them
 */
export async function previewIdFormatMigration(): Promise<{
  members: Array<{ id: string; old: string | null; new: string; year: number }>;
  organizations: Array<{ id: string; old: string | null; new: string; year: number }>;
  summary: { totalMembers: number; totalOrganizations: number; membersByYear: Record<number, number>; orgsByYear: Record<number, number> };
}> {
  console.log('🔍 Running ID format migration preview...');

  // Get all members
  const memberRecords = await db.execute(sql`
    SELECT id, membership_number, joining_date, created_at 
    FROM members 
    ORDER BY created_at ASC
  `);

  // Get all organizations  
  const orgRecords = await db.execute(sql`
    SELECT id, registration_number, registration_date, created_at 
    FROM organizations 
    ORDER BY created_at ASC
  `);

  // Process members
  const memberChanges: Array<{ id: string; old: string | null; new: string; year: number }> = [];
  const memberCountersByYear: Record<number, number> = {};

  for (const memberRow of memberRecords.rows) {
    const member = memberRow as MemberRecord;
    if (isNewFormat(member.membership_number)) {
      continue; // Skip if already in new format
    }

    const year = getEnrollmentYear(member.joining_date, member.created_at);
    
    // Initialize counter for this year
    if (!memberCountersByYear[year]) {
      memberCountersByYear[year] = 1;
    } else {
      memberCountersByYear[year]++;
    }

    const newId = `EAC-MBR-${year}-${String(memberCountersByYear[year]).padStart(4, '0')}`;
    
    memberChanges.push({
      id: member.id,
      old: member.membership_number,
      new: newId,
      year: year
    });
  }

  // Process organizations
  const orgChanges: Array<{ id: string; old: string | null; new: string; year: number }> = [];
  const orgCountersByYear: Record<number, number> = {};

  for (const orgRow of orgRecords.rows) {
    const org = orgRow as OrganizationRecord;
    if (isNewFormat(org.registration_number)) {
      continue; // Skip if already in new format
    }

    const year = getEnrollmentYear(org.registration_date, org.created_at);
    
    // Initialize counter for this year
    if (!orgCountersByYear[year]) {
      orgCountersByYear[year] = 1;
    } else {
      orgCountersByYear[year]++;
    }

    const newId = `EAC-ORG-${year}-${String(orgCountersByYear[year]).padStart(4, '0')}`;
    
    orgChanges.push({
      id: org.id,
      old: org.registration_number,
      new: newId,
      year: year
    });
  }

  return {
    members: memberChanges,
    organizations: orgChanges,
    summary: {
      totalMembers: memberChanges.length,
      totalOrganizations: orgChanges.length,
      membersByYear: memberCountersByYear,
      orgsByYear: orgCountersByYear
    }
  };
}

/**
 * Execute the ID format migration
 */
export async function executeIdFormatMigration(): Promise<{
  success: boolean;
  membersUpdated: number;
  organizationsUpdated: number;
  error?: string;
}> {
  console.log('🚀 Starting ID format migration execution...');

  // Check if migration already completed
  if (await isMigrationCompleted()) {
    console.log('✅ Migration already completed - skipping');
    return {
      success: true,
      membersUpdated: 0,
      organizationsUpdated: 0
    };
  }

  try {
    // Get preview of changes
    const preview = await previewIdFormatMigration();
    
    console.log(`📊 Migration preview: ${preview.summary.totalMembers} members, ${preview.summary.totalOrganizations} organizations`);

    // Execute migration in transaction
    const result = await db.transaction(async (tx) => {
      let membersUpdated = 0;
      let organizationsUpdated = 0;

      // Update members
      for (const change of preview.members) {
        await tx.execute(sql`
          UPDATE members 
          SET membership_number = ${change.new}
          WHERE id = ${change.id}
        `);
        membersUpdated++;
        
        console.log(`Updated member ${change.id}: ${change.old} → ${change.new}`);
      }

      // Update organizations
      for (const change of preview.organizations) {
        await tx.execute(sql`
          UPDATE organizations 
          SET registration_number = ${change.new}
          WHERE id = ${change.id}
        `);
        organizationsUpdated++;
        
        console.log(`Updated organization ${change.id}: ${change.old} → ${change.new}`);
      }

      // Update naming series counters for future ID generation
      for (const [year, count] of Object.entries(preview.summary.membersByYear)) {
        await tx
          .insert(namingSeriesCounters)
          .values({
            seriesCode: 'member_ind',
            year: parseInt(year),
            counter: count
          })
          .onConflictDoUpdate({
            target: [namingSeriesCounters.seriesCode, namingSeriesCounters.year],
            set: {
              counter: sql`GREATEST(${namingSeriesCounters.counter}, ${count})`
            }
          });
      }

      for (const [year, count] of Object.entries(preview.summary.orgsByYear)) {
        await tx
          .insert(namingSeriesCounters)
          .values({
            seriesCode: 'member_org',
            year: parseInt(year),
            counter: count
          })
          .onConflictDoUpdate({
            target: [namingSeriesCounters.seriesCode, namingSeriesCounters.year],
            set: {
              counter: sql`GREATEST(${namingSeriesCounters.counter}, ${count})`
            }
          });
      }

      return { membersUpdated, organizationsUpdated };
    });

    // Mark migration as completed
    await markMigrationCompleted();

    console.log(`✅ Migration completed successfully! Updated ${result.membersUpdated} members and ${result.organizationsUpdated} organizations`);

    return {
      success: true,
      membersUpdated: result.membersUpdated,
      organizationsUpdated: result.organizationsUpdated
    };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      membersUpdated: 0,
      organizationsUpdated: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get current migration status
 */
export async function getMigrationStatus(): Promise<{
  completed: boolean;
  needsMigration: boolean;
  recordsInOldFormat: { members: number; organizations: number };
}> {
  const completed = await isMigrationCompleted();
  
  // Count records in old format
  const membersOldFormat = await db.execute(sql`
    SELECT COUNT(*) as count FROM members 
    WHERE membership_number IS NOT NULL 
    AND NOT (membership_number ~ '^EAC-MBR-\\d{4}-\\d{4}$')
  `);
  
  const orgsOldFormat = await db.execute(sql`
    SELECT COUNT(*) as count FROM organizations 
    WHERE registration_number IS NOT NULL 
    AND NOT (registration_number ~ '^EAC-ORG-\\d{4}-\\d{4}$')
  `);

  const oldMemberCount = parseInt(membersOldFormat.rows[0]?.count || '0');
  const oldOrgCount = parseInt(orgsOldFormat.rows[0]?.count || '0');

  return {
    completed,
    needsMigration: oldMemberCount > 0 || oldOrgCount > 0,
    recordsInOldFormat: {
      members: oldMemberCount,
      organizations: oldOrgCount
    }
  };
}