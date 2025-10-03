/**
 * Role-Based Access Control (RBAC) Service
 * Manages permissions and authorization
 */

import { Request, Response, NextFunction } from "express";

// Define all permissions in the system
export enum Permission {
  // User Management
  USER_CREATE = "user:create",
  USER_READ = "user:read",
  USER_UPDATE = "user:update",
  USER_DELETE = "user:delete",
  USER_MANAGE_ROLES = "user:manage_roles",

  // Member Management
  MEMBER_CREATE = "member:create",
  MEMBER_READ = "member:read",
  MEMBER_UPDATE = "member:update",
  MEMBER_DELETE = "member:delete",
  MEMBER_APPROVE = "member:approve",
  MEMBER_SUSPEND = "member:suspend",

  // Application Management
  APPLICATION_READ = "application:read",
  APPLICATION_REVIEW = "application:review",
  APPLICATION_APPROVE = "application:approve",
  APPLICATION_REJECT = "application:reject",

  // Case Management
  CASE_CREATE = "case:create",
  CASE_READ = "case:read",
  CASE_UPDATE = "case:update",
  CASE_DELETE = "case:delete",
  CASE_ASSIGN = "case:assign",
  CASE_CLOSE = "case:close",

  // Financial/Payment Management
  PAYMENT_READ = "payment:read",
  PAYMENT_PROCESS = "payment:process",
  PAYMENT_REFUND = "payment:refund",
  PAYMENT_REPORTS = "payment:reports",

  // Document Management
  DOCUMENT_READ = "document:read",
  DOCUMENT_UPLOAD = "document:upload",
  DOCUMENT_VERIFY = "document:verify",
  DOCUMENT_DELETE = "document:delete",

  // Event Management
  EVENT_CREATE = "event:create",
  EVENT_READ = "event:read",
  EVENT_UPDATE = "event:update",
  EVENT_DELETE = "event:delete",

  // Organization Management
  ORGANIZATION_CREATE = "organization:create",
  ORGANIZATION_READ = "organization:read",
  ORGANIZATION_UPDATE = "organization:update",
  ORGANIZATION_DELETE = "organization:delete",

  // System Administration
  SYSTEM_SETTINGS = "system:settings",
  SYSTEM_LOGS = "system:logs",
  SYSTEM_BACKUP = "system:backup",
}

// Define role permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  super_admin: [
    // Full access to everything
    ...Object.values(Permission),
  ],

  admin: [
    // User management (except role management)
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,

    // Full member management
    Permission.MEMBER_CREATE,
    Permission.MEMBER_READ,
    Permission.MEMBER_UPDATE,
    Permission.MEMBER_DELETE,
    Permission.MEMBER_APPROVE,
    Permission.MEMBER_SUSPEND,

    // Full application management
    Permission.APPLICATION_READ,
    Permission.APPLICATION_REVIEW,
    Permission.APPLICATION_APPROVE,
    Permission.APPLICATION_REJECT,

    // Full case management
    Permission.CASE_CREATE,
    Permission.CASE_READ,
    Permission.CASE_UPDATE,
    Permission.CASE_DELETE,
    Permission.CASE_ASSIGN,
    Permission.CASE_CLOSE,

    // Full payment management
    Permission.PAYMENT_READ,
    Permission.PAYMENT_PROCESS,
    Permission.PAYMENT_REFUND,
    Permission.PAYMENT_REPORTS,

    // Full document management
    Permission.DOCUMENT_READ,
    Permission.DOCUMENT_UPLOAD,
    Permission.DOCUMENT_VERIFY,
    Permission.DOCUMENT_DELETE,

    // Full event management
    Permission.EVENT_CREATE,
    Permission.EVENT_READ,
    Permission.EVENT_UPDATE,
    Permission.EVENT_DELETE,

    // Full organization management
    Permission.ORGANIZATION_CREATE,
    Permission.ORGANIZATION_READ,
    Permission.ORGANIZATION_UPDATE,
    Permission.ORGANIZATION_DELETE,

    // System logs only
    Permission.SYSTEM_LOGS,
  ],

  member_manager: [
    // Member management
    Permission.MEMBER_CREATE,
    Permission.MEMBER_READ,
    Permission.MEMBER_UPDATE,
    Permission.MEMBER_APPROVE,

    // Application review
    Permission.APPLICATION_READ,
    Permission.APPLICATION_REVIEW,

    // Document management
    Permission.DOCUMENT_READ,
    Permission.DOCUMENT_UPLOAD,
    Permission.DOCUMENT_VERIFY,

    // Organization management
    Permission.ORGANIZATION_READ,
    Permission.ORGANIZATION_UPDATE,
  ],

  case_manager: [
    // Case management
    Permission.CASE_CREATE,
    Permission.CASE_READ,
    Permission.CASE_UPDATE,
    Permission.CASE_ASSIGN,
    Permission.CASE_CLOSE,

    // Read member info
    Permission.MEMBER_READ,

    // Read organization info
    Permission.ORGANIZATION_READ,

    // Read documents
    Permission.DOCUMENT_READ,
  ],

  accountant: [
    // Full payment access
    Permission.PAYMENT_READ,
    Permission.PAYMENT_PROCESS,
    Permission.PAYMENT_REFUND,
    Permission.PAYMENT_REPORTS,

    // Read-only member access
    Permission.MEMBER_READ,

    // Read-only organization access
    Permission.ORGANIZATION_READ,

    // Read applications
    Permission.APPLICATION_READ,
  ],

  reviewer: [
    // Application review
    Permission.APPLICATION_READ,
    Permission.APPLICATION_REVIEW,

    // Document verification
    Permission.DOCUMENT_READ,
    Permission.DOCUMENT_VERIFY,

    // Read member info
    Permission.MEMBER_READ,

    // Read organization info
    Permission.ORGANIZATION_READ,
  ],

  staff: [
    // Basic read access
    Permission.MEMBER_READ,
    Permission.APPLICATION_READ,
    Permission.CASE_READ,
    Permission.DOCUMENT_READ,
    Permission.EVENT_READ,
    Permission.ORGANIZATION_READ,
  ],
};

export class RBACService {
  /**
   * Check if user has a specific permission
   */
  static hasPermission(userRole: string, permission: Permission): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    if (!rolePermissions) return false;
    return rolePermissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  static hasAnyPermission(
    userRole: string,
    permissions: Permission[]
  ): boolean {
    return permissions.some((permission) =>
      this.hasPermission(userRole, permission)
    );
  }

  /**
   * Check if user has all of the specified permissions
   */
  static hasAllPermissions(
    userRole: string,
    permissions: Permission[]
  ): boolean {
    return permissions.every((permission) =>
      this.hasPermission(userRole, permission)
    );
  }

  /**
   * Get all permissions for a role
   */
  static getRolePermissions(role: string): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  }
}

/**
 * Middleware to require authentication
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "You must be logged in to access this resource",
    });
  }
  next();
}

/**
 * Middleware to require specific permission
 */
export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be logged in",
      });
    }

    const user = req.user;
    if (!user || !RBACService.hasPermission(user.role, permission)) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to perform this action",
        required: permission,
        yourRole: user?.role,
      });
    }

    next();
  };
}

/**
 * Middleware to require any of the specified permissions
 */
export function requireAnyPermission(...permissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be logged in",
      });
    }

    const user = req.user;
    if (!user || !RBACService.hasAnyPermission(user.role, permissions)) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You do not have permission to perform this action",
        required: "One of: " + permissions.join(", "),
        yourRole: user?.role,
      });
    }

    next();
  };
}

/**
 * Middleware to require specific role
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be logged in",
      });
    }

    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `This action requires one of the following roles: ${roles.join(", ")}`,
        yourRole: user?.role,
      });
    }

    next();
  };
}
