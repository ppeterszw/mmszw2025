import { sql } from "../server/db";

async function createApplicationIdCountersTable() {
  try {
    console.log("Creating application_id_counters table...");

    await sql`
      CREATE TABLE IF NOT EXISTS application_id_counters (
        type VARCHAR(20) PRIMARY KEY,
        counter INTEGER DEFAULT 0
      )
    `;

    console.log("✅ application_id_counters table created successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating table:", error);
    process.exit(1);
  }
}

createApplicationIdCountersTable();
