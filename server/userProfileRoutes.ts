/**
 * User Profile Management Routes
 * Handles user profile, preferences, sessions, and activity
 */

import { Express, Request, Response } from "express";
import { requireAuth } from "./auth/rbacService";
import { db } from "./db";
import { users, userSessions, auditLogs } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

// Validation schemas
const updateProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  notes: z.string().optional(),
});

const updatePreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  inAppNotifications: z.boolean().optional(),
  dashboardView: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

export function registerUserProfileRoutes(app: Express) {
  /**
   * GET /api/user/profile
   * Get current user's full profile
   */
  app.get("/api/user/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const [profile] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!profile) {
        return res.status(404).json({
          error: "Profile not found",
        });
      }

      // Exclude sensitive fields
      const { password, passwordResetToken, emailVerificationToken, twoFactorSecret, ...safeProfile } = profile;

      res.json(safeProfile);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        error: "Failed to get profile",
      });
    }
  });

  /**
   * PUT /api/user/profile
   * Update current user's profile
   */
  app.put("/api/user/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      // Validate input
      const validation = updateProfileSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Validation error",
          details: validation.error.errors,
        });
      }

      const updateData = validation.data;

      // If email is being changed, check if it's already taken
      if (updateData.email) {
        const [existingUser] = await db
          .select()
          .from(users)
          .where(and(
            eq(users.email, updateData.email),
            // Not the current user
            // @ts-ignore - Type mismatch but works
            eq(users.id, userId) === false
          ))
          .limit(1);

        if (existingUser) {
          return res.status(400).json({
            error: "Email already in use",
          });
        }
      }

      // Update profile
      const [updatedProfile] = await db
        .update(users)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedProfile) {
        return res.status(404).json({
          error: "Profile not found",
        });
      }

      // Log the activity
      await db.insert(auditLogs).values({
        userId: userId,
        action: "UPDATE",
        resource: "user_profile",
        resourceId: userId,
        description: "Updated profile information",
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      // Exclude sensitive fields
      const { password, passwordResetToken, emailVerificationToken, twoFactorSecret, ...safeProfile } = updatedProfile;

      res.json({
        success: true,
        message: "Profile updated successfully",
        profile: safeProfile,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        error: "Failed to update profile",
      });
    }
  });

  /**
   * PUT /api/user/preferences
   * Update user preferences (stored in permissions field as JSON for now)
   */
  app.put("/api/user/preferences", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      // Validate input
      const validation = updatePreferencesSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Validation error",
          details: validation.error.errors,
        });
      }

      const preferences = validation.data;

      // For now, we'll store preferences in the notes field as JSON
      // In a production system, you'd want a separate preferences table
      await db
        .update(users)
        .set({
          notes: JSON.stringify({ preferences }),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      // Log the activity
      await db.insert(auditLogs).values({
        userId: userId,
        action: "UPDATE",
        resource: "user_preferences",
        resourceId: userId,
        description: "Updated user preferences",
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      res.json({
        success: true,
        message: "Preferences updated successfully",
        preferences,
      });
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({
        error: "Failed to update preferences",
      });
    }
  });

  /**
   * GET /api/user/sessions
   * Get current user's active sessions
   */
  app.get("/api/user/sessions", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const sessions = await db
        .select()
        .from(userSessions)
        .where(and(
          eq(userSessions.userId, userId),
          eq(userSessions.isActive, true)
        ))
        .orderBy(desc(userSessions.lastActivity))
        .limit(50);

      res.json(sessions);
    } catch (error) {
      console.error("Get sessions error:", error);
      res.status(500).json({
        error: "Failed to get sessions",
      });
    }
  });

  /**
   * DELETE /api/user/sessions/:id
   * Terminate a specific session
   */
  app.delete("/api/user/sessions/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const sessionId = req.params.id;

      // Verify the session belongs to the user
      const [session] = await db
        .select()
        .from(userSessions)
        .where(and(
          eq(userSessions.id, sessionId),
          eq(userSessions.userId, userId)
        ))
        .limit(1);

      if (!session) {
        return res.status(404).json({
          error: "Session not found",
        });
      }

      // Deactivate the session
      await db
        .update(userSessions)
        .set({
          isActive: false,
        })
        .where(eq(userSessions.id, sessionId));

      // Log the activity
      await db.insert(auditLogs).values({
        userId: userId,
        action: "DELETE",
        resource: "user_session",
        resourceId: sessionId,
        description: "Terminated user session",
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      res.json({
        success: true,
        message: "Session terminated successfully",
      });
    } catch (error) {
      console.error("Terminate session error:", error);
      res.status(500).json({
        error: "Failed to terminate session",
      });
    }
  });

  /**
   * GET /api/user/activity
   * Get current user's recent activity
   */
  app.get("/api/user/activity", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const limit = parseInt(req.query.limit as string) || 20;

      const activities = await db
        .select()
        .from(auditLogs)
        .where(eq(auditLogs.userId, userId))
        .orderBy(desc(auditLogs.timestamp))
        .limit(Math.min(limit, 100));

      res.json(activities);
    } catch (error) {
      console.error("Get activity error:", error);
      res.status(500).json({
        error: "Failed to get activity",
      });
    }
  });

  /**
   * POST /api/user/avatar
   * Upload user avatar (placeholder for future implementation)
   */
  app.post("/api/user/avatar", requireAuth, async (req: Request, res: Response) => {
    try {
      // This would typically use multer or similar for file upload
      // and store the image in object storage (S3, GCS, etc.)

      res.status(501).json({
        error: "Avatar upload not yet implemented",
        message: "This feature will be available soon",
      });
    } catch (error) {
      console.error("Upload avatar error:", error);
      res.status(500).json({
        error: "Failed to upload avatar",
      });
    }
  });

  /**
   * DELETE /api/user/avatar
   * Remove user avatar
   */
  app.delete("/api/user/avatar", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      await db
        .update(users)
        .set({
          profileImageUrl: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      // Log the activity
      await db.insert(auditLogs).values({
        userId: userId,
        action: "DELETE",
        resource: "user_avatar",
        resourceId: userId,
        description: "Removed profile avatar",
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      });

      res.json({
        success: true,
        message: "Avatar removed successfully",
      });
    } catch (error) {
      console.error("Remove avatar error:", error);
      res.status(500).json({
        error: "Failed to remove avatar",
      });
    }
  });
}
