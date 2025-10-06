/**
 * Notification Routes - API for managing in-app notifications
 */

import type { Express } from "express";
import { db } from "./db";
import { notifications, users } from "@shared/schema";
import { eq, desc, and, isNull, or } from "drizzle-orm";

export function registerNotificationRoutes(app: Express) {
  /**
   * GET /api/notifications
   * Get all notifications for the current user
   */
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const userNotifications = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt));

      res.json({
        success: true,
        notifications: userNotifications,
      });
    } catch (error: any) {
      console.error("Get notifications error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch notifications",
      });
    }
  });

  /**
   * GET /api/notifications/unread
   * Get unread notifications count
   */
  app.get("/api/notifications/unread", async (req, res) => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const unreadNotifications = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, userId),
            isNull(notifications.openedAt)
          )
        );

      res.json({
        success: true,
        count: unreadNotifications.length,
        notifications: unreadNotifications,
      });
    } catch (error: any) {
      console.error("Get unread notifications error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch unread notifications",
      });
    }
  });

  /**
   * PUT /api/notifications/:id/mark-read
   * Mark a notification as read
   */
  app.put("/api/notifications/:id/mark-read", async (req, res) => {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const [notification] = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.id, id),
            eq(notifications.userId, userId)
          )
        )
        .limit(1);

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: "Notification not found",
        });
      }

      const [updated] = await db
        .update(notifications)
        .set({
          openedAt: new Date(),
        })
        .where(eq(notifications.id, id))
        .returning();

      res.json({
        success: true,
        notification: updated,
      });
    } catch (error: any) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to mark notification as read",
      });
    }
  });

  /**
   * PUT /api/notifications/mark-all-read
   * Mark all notifications as read
   */
  app.put("/api/notifications/mark-all-read", async (req, res) => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      await db
        .update(notifications)
        .set({
          openedAt: new Date(),
        })
        .where(
          and(
            eq(notifications.userId, userId),
            isNull(notifications.openedAt)
          )
        );

      res.json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error: any) {
      console.error("Mark all notifications as read error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to mark all notifications as read",
      });
    }
  });

  /**
   * DELETE /api/notifications/:id
   * Delete a notification
   */
  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const [notification] = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.id, id),
            eq(notifications.userId, userId)
          )
        )
        .limit(1);

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: "Notification not found",
        });
      }

      await db.delete(notifications).where(eq(notifications.id, id));

      res.json({
        success: true,
        message: "Notification deleted",
      });
    } catch (error: any) {
      console.error("Delete notification error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete notification",
      });
    }
  });

  /**
   * POST /api/notifications/create
   * Create a new notification (admin/system use)
   */
  app.post("/api/notifications/create", async (req, res) => {
    try {
      const {
        userId,
        memberId,
        type = "in_app",
        title,
        message,
        data,
      } = req.body;

      if (!title || !message) {
        return res.status(400).json({
          success: false,
          error: "Title and message are required",
        });
      }

      const [notification] = await db
        .insert(notifications)
        .values({
          userId,
          memberId,
          type,
          status: "pending",
          title,
          message,
          data: data ? JSON.stringify(data) : null,
        })
        .returning();

      res.json({
        success: true,
        notification,
      });
    } catch (error: any) {
      console.error("Create notification error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create notification",
      });
    }
  });
}
