/**
 * Custom Session Store for Neon Serverless
 * Works with Neon's HTTP driver instead of requiring pg.Pool
 */
import { Store } from "express-session";
import { sql } from "./db";

export class NeonSessionStore extends Store {
  private initialized = false;

  constructor() {
    super();
    // Don't initialize immediately - defer until first use
  }

  private async ensureTableExists() {
    if (this.initialized) return;

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS session (
          sid VARCHAR NOT NULL PRIMARY KEY,
          sess JSON NOT NULL,
          expire TIMESTAMP(6) NOT NULL
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire)`;
      this.initialized = true;
      console.log("✅ Session table ready");
    } catch (error) {
      console.error("❌ Failed to create session table:", error);
      throw error;
    }
  }

  async get(sid: string, callback: (err?: any, session?: any) => void) {
    try {
      await this.ensureTableExists();

      const result = await sql`
        SELECT sess FROM session WHERE sid = ${sid} AND expire >= NOW()
      `;

      if (result.length === 0) {
        return callback(null, null);
      }

      callback(null, result[0].sess);
    } catch (error) {
      callback(error);
    }
  }

  async set(sid: string, session: any, callback?: (err?: any) => void) {
    try {
      await this.ensureTableExists();

      const expire = this.getExpireTime(session);

      await sql`
        INSERT INTO session (sid, sess, expire)
        VALUES (${sid}, ${JSON.stringify(session)}, ${expire})
        ON CONFLICT (sid)
        DO UPDATE SET sess = ${JSON.stringify(session)}, expire = ${expire}
      `;

      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      await sql`DELETE FROM session WHERE sid = ${sid}`;
      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  async touch(sid: string, session: any, callback?: (err?: any) => void) {
    try {
      const expire = this.getExpireTime(session);

      await sql`
        UPDATE session SET expire = ${expire} WHERE sid = ${sid}
      `;

      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  async all(callback: (err?: any, obj?: any) => void) {
    try {
      const result = await sql`
        SELECT sess FROM session WHERE expire >= NOW()
      `;

      const sessions = result.map((row: any) => row.sess);
      callback(null, sessions);
    } catch (error) {
      callback(error);
    }
  }

  async clear(callback?: (err?: any) => void) {
    try {
      await sql`DELETE FROM session`;
      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  async length(callback: (err?: any, length?: number) => void) {
    try {
      const result = await sql`
        SELECT COUNT(*) as count FROM session WHERE expire >= NOW()
      `;

      callback(null, Number(result[0].count));
    } catch (error) {
      callback(error);
    }
  }

  private getExpireTime(session: any): Date {
    const maxAge = session.cookie?.maxAge || 86400000; // Default 24 hours
    return new Date(Date.now() + maxAge);
  }
}
