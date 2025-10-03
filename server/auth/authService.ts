/**
 * Robust Authentication Service
 * Handles user authentication, session management, and security
 */

import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq, and, lt, sql } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

// Configuration
const AUTH_CONFIG = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL: true,

  // Account lockout
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,

  // Session
  SESSION_TIMEOUT_MINUTES: 60,
  SESSION_ABSOLUTE_TIMEOUT_HOURS: 8,

  // Password reset
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS: 1,

  // Email verification
  EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS: 24,
};

export class AuthService {
  /**
   * Hash a password using scrypt
   */
  static async hashPassword(password: string): Promise<string> {
    // Validate password strength
    const validation = this.validatePasswordStrength(password);
    if (!validation.valid) {
      throw new Error(`Weak password: ${validation.errors.join(", ")}`);
    }

    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  /**
   * Compare supplied password with stored hash
   */
  static async comparePasswords(
    supplied: string,
    stored: string
  ): Promise<boolean> {
    if (!stored || !supplied) {
      return false;
    }

    if (!stored.includes(".")) {
      console.warn("Attempted login with unhashed password");
      return false;
    }

    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      return false;
    }

    try {
      const hashedBuf = Buffer.from(hashed, "hex");
      const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;

      if (hashedBuf.length !== suppliedBuf.length) {
        return false;
      }

      return timingSafeEqual(hashedBuf, suppliedBuf);
    } catch (error) {
      console.error("Password comparison error:", error);
      return false;
    }
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
      errors.push(
        `Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters`
      );
    }

    if (AUTH_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (AUTH_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (AUTH_CONFIG.PASSWORD_REQUIRE_NUMBER && !/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (
      AUTH_CONFIG.PASSWORD_REQUIRE_SPECIAL &&
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    ) {
      errors.push("Password must contain at least one special character");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if account is locked
   */
  static async isAccountLocked(userId: string): Promise<boolean> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return false;

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return true;
    }

    // Unlock if lockout period has passed
    if (user.lockedUntil && new Date(user.lockedUntil) <= new Date()) {
      await db
        .update(users)
        .set({
          lockedUntil: null,
          loginAttempts: 0,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    }

    return false;
  }

  /**
   * Record failed login attempt
   */
  static async recordFailedLogin(userId: string): Promise<void> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return;

    const newAttempts = (user.loginAttempts || 0) + 1;
    const updates: any = {
      loginAttempts: newAttempts,
      updatedAt: new Date(),
    };

    // Lock account if max attempts reached
    if (newAttempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
      const lockoutUntil = new Date();
      lockoutUntil.setMinutes(
        lockoutUntil.getMinutes() + AUTH_CONFIG.LOCKOUT_DURATION_MINUTES
      );
      updates.lockedUntil = lockoutUntil;
    }

    await db.update(users).set(updates).where(eq(users.id, userId));
  }

  /**
   * Record successful login
   */
  static async recordSuccessfulLogin(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        loginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  /**
   * Generate password reset token
   */
  static async generatePasswordResetToken(
    email: string
  ): Promise<string | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) return null;

    const token = randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(
      expires.getHours() + AUTH_CONFIG.PASSWORD_RESET_TOKEN_EXPIRY_HOURS
    );

    await db
      .update(users)
      .set({
        passwordResetToken: token,
        passwordResetExpires: expires,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return token;
  }

  /**
   * Verify password reset token
   */
  static async verifyPasswordResetToken(
    token: string
  ): Promise<string | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.passwordResetToken, token),
          lt(new Date(), users.passwordResetExpires!)
        )
      )
      .limit(1);

    return user?.id || null;
  }

  /**
   * Reset password with token
   */
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<boolean> {
    const userId = await this.verifyPasswordResetToken(token);
    if (!userId) return false;

    const hashedPassword = await this.hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        passwordChangedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return true;
  }

  /**
   * Generate email verification token
   */
  static async generateEmailVerificationToken(
    userId: string
  ): Promise<string> {
    const token = randomBytes(32).toString("hex");

    await db
      .update(users)
      .set({
        emailVerificationToken: token,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return token;
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<boolean> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token))
      .limit(1);

    if (!user) return false;

    await db
      .update(users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return true;
  }

  /**
   * Change user password (authenticated)
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Verify current password
    const isValid = await this.comparePasswords(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        passwordChangedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { success: true };
  }
}

export { AUTH_CONFIG };
