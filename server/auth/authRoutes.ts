/**
 * Comprehensive Authentication Routes
 * Includes registration, login, logout, password management, email verification
 */

import { Express, Request, Response } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { AuthService } from "./authService";
import { RBACService, requireAuth, requirePermission, Permission } from "./rbacService";
import { SessionService, sessionTimeoutMiddleware, refreshSessionMiddleware } from "./sessionService";
import { AuthEmailService } from "./emailNotifications";
import { storage } from "../storage";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      role: string;
      status: string;
      emailVerified: boolean;
    }
  }
}

export function setupAuthRoutes(app: Express) {
  // ============================================================================
  // SESSION CONFIGURATION
  // ============================================================================

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
      sameSite: "lax",
    },
    rolling: true, // Reset expiry on every request
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Apply session middleware
  app.use(sessionTimeoutMiddleware);
  app.use(refreshSessionMiddleware);

  // Start session cleanup
  SessionService.startCleanup();

  // ============================================================================
  // PASSPORT CONFIGURATION
  // ============================================================================

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Get user
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Check if account is locked
          const isLocked = await AuthService.isAccountLocked(user.id);
          if (isLocked) {
            return done(null, false, {
              message: "Account is locked due to multiple failed login attempts",
            });
          }

          // Check if account is active
          if (user.status !== "active") {
            return done(null, false, {
              message: "Account is inactive. Please contact support.",
            });
          }

          // Verify password
          if (!user.password) {
            return done(null, false, { message: "Invalid email or password" });
          }

          const isValid = await AuthService.comparePasswords(
            password,
            user.password
          );

          if (!isValid) {
            // Record failed attempt
            await AuthService.recordFailedLogin(user.id);
            return done(null, false, { message: "Invalid email or password" });
          }

          // Record successful login
          await AuthService.recordSuccessfulLogin(user.id);

          return done(null, {
            id: user.id,
            email: user.email,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            role: user.role || 'applicant',
            status: user.status || 'active',
            emailVerified: user.emailVerified || false,
          } as any);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          role: users.role,
          status: users.status,
          emailVerified: users.emailVerified,
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      done(null, user || undefined);
    } catch (error) {
      done(error);
    }
  });

  // ============================================================================
  // AUTHENTICATION ROUTES
  // ============================================================================

  /**
   * POST /api/auth/register
   * Register a new user
   */
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: "Missing required fields",
          required: ["email", "password", "firstName", "lastName"],
        });
      }

      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser) {
        return res.status(400).json({
          error: "Email already registered",
        });
      }

      // Hash password (validates strength)
      let hashedPassword;
      try {
        hashedPassword = await AuthService.hashPassword(password);
      } catch (error: any) {
        return res.status(400).json({
          error: error.message,
        });
      }

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: role || "staff", // Default role
          status: "active",
          emailVerified: false,
        })
        .returning();

      // Generate email verification token
      const verificationToken =
        await AuthService.generateEmailVerificationToken(newUser.id);

      // Send welcome email
      await AuthEmailService.sendWelcomeEmail(
        email,
        `${firstName} ${lastName}`,
        verificationToken
      );

      res.status(201).json({
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Registration failed",
      });
    }
  });

  /**
   * POST /api/auth/login
   * Login user
   */
  app.post(
    "/api/auth/login",
    passport.authenticate("local"),
    async (req: Request, res: Response) => {
      try {
        // Send login notification if from new location/device
        const user = req.user!;
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers["user-agent"];

        // Optional: Send notification for suspicious logins
        // await AuthEmailService.sendLoginNotification(
        //   user.email,
        //   `${user.firstName} ${user.lastName}`,
        //   {
        //     time: new Date(),
        //     ipAddress,
        //     userAgent,
        //   }
        // );

        res.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            emailVerified: user.emailVerified,
            permissions: RBACService.getRolePermissions(user.role),
          },
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
          error: "Login failed",
        });
      }
    }
  );

  /**
   * POST /api/auth/logout
   * Logout user
   */
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          error: "Logout failed",
        });
      }
      req.session.destroy(() => {
        res.json({
          success: true,
          message: "Logged out successfully",
        });
      });
    });
  });

  /**
   * GET /api/auth/me
   * Get current user
   */
  app.get("/api/auth/me", requireAuth, (req: Request, res: Response) => {
    const user = req.user!;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      emailVerified: user.emailVerified,
      permissions: RBACService.getRolePermissions(user.role),
    });
  });

  // ============================================================================
  // EMAIL VERIFICATION
  // ============================================================================

  /**
   * GET /api/auth/verify-email/:token
   * Verify email address
   */
  app.get("/api/auth/verify-email/:token", async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const success = await AuthService.verifyEmail(token);

      if (success) {
        res.json({
          success: true,
          message: "Email verified successfully",
        });
      } else {
        res.status(400).json({
          error: "Invalid or expired verification token",
        });
      }
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({
        error: "Email verification failed",
      });
    }
  });

  /**
   * POST /api/auth/resend-verification
   * Resend verification email
   */
  app.post("/api/auth/resend-verification", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      if (user.emailVerified) {
        return res.status(400).json({
          error: "Email already verified",
        });
      }

      const token = await AuthService.generateEmailVerificationToken(user.id);
      await AuthEmailService.sendWelcomeEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        token
      );

      res.json({
        success: true,
        message: "Verification email sent",
      });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({
        error: "Failed to resend verification email",
      });
    }
  });

  // ============================================================================
  // PASSWORD MANAGEMENT
  // ============================================================================

  /**
   * POST /api/auth/forgot-password
   * Request password reset
   */
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: "Email is required",
        });
      }

      const token = await AuthService.generatePasswordResetToken(email);

      if (token) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (user) {
          await AuthEmailService.sendPasswordResetEmail(
            email,
            `${user.firstName} ${user.lastName}`,
            token
          );
        }
      }

      // Always return success to prevent email enumeration
      res.json({
        success: true,
        message: "If the email exists, a password reset link has been sent",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        error: "Failed to process password reset request",
      });
    }
  });

  /**
   * POST /api/auth/reset-password
   * Reset password with token
   */
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          error: "Token and new password are required",
        });
      }

      const success = await AuthService.resetPassword(token, newPassword);

      if (success) {
        // Get user to send notification
        const userId = await AuthService.verifyPasswordResetToken(token);
        if (userId) {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

          if (user) {
            await AuthEmailService.sendPasswordChangedEmail(
              user.email,
              `${user.firstName} ${user.lastName}`
            );
          }
        }

        res.json({
          success: true,
          message: "Password reset successfully",
        });
      } else {
        res.status(400).json({
          error: "Invalid or expired reset token",
        });
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      res.status(500).json({
        error: error.message || "Password reset failed",
      });
    }
  });

  /**
   * POST /api/auth/change-password
   * Change password (authenticated)
   */
  app.post("/api/auth/change-password", requireAuth, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = req.user!;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Current password and new password are required",
        });
      }

      const result = await AuthService.changePassword(
        user.id,
        currentPassword,
        newPassword
      );

      if (result.success) {
        await AuthEmailService.sendPasswordChangedEmail(
          user.email,
          `${user.firstName} ${user.lastName}`
        );

        res.json({
          success: true,
          message: "Password changed successfully",
        });
      } else {
        res.status(400).json({
          error: result.error || "Password change failed",
        });
      }
    } catch (error: any) {
      console.error("Change password error:", error);
      res.status(500).json({
        error: error.message || "Password change failed",
      });
    }
  });

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  /**
   * GET /api/auth/sessions
   * Get active sessions
   */
  app.get("/api/auth/sessions", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const sessions = await SessionService.getUserActiveSessions(user.id);

      res.json({
        sessions: sessions.map((s) => ({
          createdAt: s.createdAt,
          lastActivity: s.lastActivity,
          expiresAt: s.expiresAt,
          ipAddress: s.ipAddress,
          device: s.userAgent,
        })),
      });
    } catch (error) {
      console.error("Get sessions error:", error);
      res.status(500).json({
        error: "Failed to get sessions",
      });
    }
  });

  /**
   * DELETE /api/auth/sessions
   * Logout from all devices
   */
  app.delete("/api/auth/sessions", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      await SessionService.invalidateAllUserSessions(user.id);

      req.logout((err) => {
        if (err) {
          return res.status(500).json({
            error: "Failed to logout",
          });
        }
        res.json({
          success: true,
          message: "Logged out from all devices",
        });
      });
    } catch (error) {
      console.error("Logout all error:", error);
      res.status(500).json({
        error: "Failed to logout from all devices",
      });
    }
  });
}
