/**
 * Session Management Service
 * Handles session creation, validation, and timeout management
 */

import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { userSessions } from "@shared/schema";
import { eq, and, lt } from "drizzle-orm";
import { randomBytes } from "crypto";

// Session configuration
const SESSION_CONFIG = {
  // Idle timeout: session expires after 60 minutes of inactivity
  IDLE_TIMEOUT_MINUTES: 60,

  // Absolute timeout: session expires after 8 hours regardless of activity
  ABSOLUTE_TIMEOUT_HOURS: 8,

  // Session cleanup: remove expired sessions every 1 hour
  CLEANUP_INTERVAL_MINUTES: 60,
};

export class SessionService {
  private static cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Start automatic session cleanup
   */
  static startCleanup() {
    if (this.cleanupInterval) return;

    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpiredSessions().catch(console.error);
      },
      SESSION_CONFIG.CLEANUP_INTERVAL_MINUTES * 60 * 1000
    );

    console.log("✅ Session cleanup started");
  }

  /**
   * Stop automatic session cleanup
   */
  static stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log("Session cleanup stopped");
    }
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions(): Promise<number> {
    const now = new Date();

    const result = await db
      .delete(userSessions)
      .where(
        and(
          lt(userSessions.expiresAt, now),
          eq(userSessions.isActive, true)
        )
      );

    const count = result.rowCount || 0;
    if (count > 0) {
      console.log(`🧹 Cleaned up ${count} expired sessions`);
    }

    return count;
  }

  /**
   * Create a new session
   */
  static async createSession(
    userId: string,
    ipAddress: string | null,
    userAgent: string | null
  ): Promise<string> {
    const sessionToken = randomBytes(32).toString("hex");
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + SESSION_CONFIG.ABSOLUTE_TIMEOUT_HOURS * 60 * 60 * 1000
    );

    await db.insert(userSessions).values({
      userId,
      sessionToken,
      ipAddress,
      userAgent,
      expiresAt,
      lastActivityAt: now,
      isActive: true,
    });

    return sessionToken;
  }

  /**
   * Validate and update session
   */
  static async validateSession(
    sessionToken: string
  ): Promise<{ valid: boolean; userId?: string; reason?: string }> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.sessionToken, sessionToken),
          eq(userSessions.isActive, true)
        )
      )
      .limit(1);

    if (!session) {
      return { valid: false, reason: "Session not found" };
    }

    const now = new Date();

    // Check absolute timeout
    if (new Date(session.expiresAt) < now) {
      await this.invalidateSession(sessionToken);
      return { valid: false, reason: "Session expired (absolute timeout)" };
    }

    // Check idle timeout
    const lastActivity = new Date(session.lastActivityAt);
    const idleMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

    if (idleMinutes > SESSION_CONFIG.IDLE_TIMEOUT_MINUTES) {
      await this.invalidateSession(sessionToken);
      return {
        valid: false,
        reason: "Session expired (idle timeout)",
      };
    }

    // Update last activity
    await db
      .update(userSessions)
      .set({
        lastActivityAt: now,
      })
      .where(eq(userSessions.sessionToken, sessionToken));

    return { valid: true, userId: session.userId };
  }

  /**
   * Invalidate a session (logout)
   */
  static async invalidateSession(sessionToken: string): Promise<void> {
    await db
      .update(userSessions)
      .set({
        isActive: false,
      })
      .where(eq(userSessions.sessionToken, sessionToken));
  }

  /**
   * Invalidate all sessions for a user
   */
  static async invalidateAllUserSessions(userId: string): Promise<void> {
    await db
      .update(userSessions)
      .set({
        isActive: false,
      })
      .where(
        and(
          eq(userSessions.userId, userId),
          eq(userSessions.isActive, true)
        )
      );
  }

  /**
   * Get active sessions for a user
   */
  static async getUserActiveSessions(userId: string) {
    return await db
      .select({
        sessionToken: userSessions.sessionToken,
        createdAt: userSessions.createdAt,
        lastActivityAt: userSessions.lastActivityAt,
        expiresAt: userSessions.expiresAt,
        ipAddress: userSessions.ipAddress,
        userAgent: userSessions.userAgent,
      })
      .from(userSessions)
      .where(
        and(
          eq(userSessions.userId, userId),
          eq(userSessions.isActive, true)
        )
      );
  }

  /**
   * Get session timeout remaining (in minutes)
   */
  static getTimeoutRemaining(lastActivityAt: Date): number {
    const now = new Date();
    const elapsed = (now.getTime() - lastActivityAt.getTime()) / (1000 * 60);
    const remaining = SESSION_CONFIG.IDLE_TIMEOUT_MINUTES - elapsed;
    return Math.max(0, Math.round(remaining));
  }
}

/**
 * Middleware to handle session timeout warnings
 */
export function sessionTimeoutMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.isAuthenticated()) {
    return next();
  }

  // Add session timeout info to response headers
  const session = req.session;
  if (session && session.cookie) {
    const lastActivity = session.cookie._expires
      ? new Date(session.cookie._expires)
      : new Date();
    const remaining = SessionService.getTimeoutRemaining(lastActivity);

    res.setHeader("X-Session-Timeout-Remaining", remaining.toString());

    // Warn if less than 5 minutes remaining
    if (remaining < 5) {
      res.setHeader("X-Session-Warning", "true");
    }
  }

  next();
}

/**
 * Middleware to refresh session on activity
 */
export function refreshSessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated() && req.session) {
    // Touch the session to keep it alive
    req.session.touch();
  }
  next();
}

export { SESSION_CONFIG };
