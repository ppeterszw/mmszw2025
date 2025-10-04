import { sql } from "drizzle-orm";
import { db } from "../db";
import { namingSeriesCounters } from "@shared/schema";

/**
 * Generate next application ID for individuals or organizations
 * @param type - 'individual' or 'organization'
 * @returns Promise<string> - Generated application ID
 */
export async function nextApplicationId(type: 'individual' | 'organization'): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = type === 'individual' ? 'APP-MBR-' : 'APP-ORG-';

  // Year-based counter for application IDs
  const result = await db.execute(sql`
    INSERT INTO application_id_counters (type, counter)
    VALUES (${type + '_' + currentYear}, 1)
    ON CONFLICT (type)
    DO UPDATE SET counter = application_id_counters.counter + 1
    RETURNING counter
  `);

  const counter = result.rows[0]?.counter || 1;
  return `${prefix}${currentYear}-${String(counter).padStart(4, '0')}`;
}

/**
 * Generate next member number with year-based series reset
 * @param kind - 'individual' or 'organization'
 * @returns Promise<string> - Generated member number (EAC-MBR-YYYY-XXXX or EAC-ORG-YYYY-XXXX)
 */
export async function nextMemberNumber(kind: 'individual' | 'organization'): Promise<string> {
  const currentYear = new Date().getFullYear();
  const seriesCode = kind === 'individual' ? 'member_ind' : 'member_org';
  const prefix = kind === 'individual' ? 'EAC-MBR-' : 'EAC-ORG-';
  const counterKey = `${seriesCode}_${currentYear}`;

  // Use UPSERT pattern compatible with Neon serverless (no transactions needed)
  const result = await db.execute(sql`
    INSERT INTO naming_series_counters (series_code, year, counter)
    VALUES (${counterKey}, ${currentYear}, 1)
    ON CONFLICT (series_code, year)
    DO UPDATE SET counter = naming_series_counters.counter + 1
    RETURNING counter
  `);

  const counter = result.rows[0]?.counter || 1;

  // Format: EAC-MBR-YYYY-XXXX or EAC-ORG-YYYY-XXXX (using full 4-digit year)
  return `${prefix}${currentYear}-${String(counter).padStart(4, '0')}`;
}

/**
 * Create application ID counter table if it doesn't exist
 * This is a simple counter table for application IDs (separate from member numbers)
 */
export async function initializeApplicationCounters() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS application_id_counters (
      type VARCHAR(20) PRIMARY KEY,
      counter INTEGER DEFAULT 0
    )
  `);
}

/**
 * Get current counter values for debugging/admin purposes
 */
export async function getCurrentCounters() {
  const memberCounters = await db.select().from(namingSeriesCounters);
  const appCounters = await db.execute(sql`SELECT * FROM application_id_counters`);
  
  return {
    memberCounters,
    applicationCounters: appCounters.rows
  };
}