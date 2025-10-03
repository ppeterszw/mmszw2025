/**
 * Clerk Authentication Integration
 * Uses @clerk/express for Express.js integration
 */

import { Request, Response, NextFunction, Express } from "express";
import { clerkClient, clerkMiddleware, requireAuth as clerkRequireAuth, getAuth } from "@clerk/express";

// Role definitions
export type UserRole = 'super_admin' | 'admin' | 'staff' | 'accountant' | 'member_manager' | 'member';

export interface ClerkUser {
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      clerkUser?: ClerkUser;
    }
  }
}

/**
 * Setup Clerk authentication middleware
 */
export function setupClerkAuth(app: Express) {
  if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    console.warn("⚠️  Clerk keys not configured - authentication disabled");
    return;
  }

  console.log("✅ Setting up Clerk authentication");

  // TEMPORARILY DISABLED - Causing 504 timeouts
  // TODO: Fix Clerk middleware to only run on specific routes
  console.warn("⚠️  Clerk middleware temporarily disabled to prevent timeouts");

  // Add Clerk middleware - this adds req.auth
  // app.use(clerkMiddleware());

  // Attach user info middleware (only for API routes)
  // app.use(attachClerkUser);
}

/**
 * Middleware to attach Clerk user information to request
 * Only runs for API routes to avoid unnecessary API calls
 */
async function attachClerkUser(req: Request, res: Response, next: NextFunction) {
  try {
    // Skip for non-API routes
    if (!req.path.startsWith('/api')) {
      return next();
    }

    const auth = getAuth(req);

    if (!auth?.userId) {
      return next();
    }

    // Fetch user from Clerk with timeout
    const fetchUser = async () => {
      const user = await clerkClient.users.getUser(auth.userId!);
      const role = (user.publicMetadata?.role as UserRole) || 'member';

      req.clerkUser = {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        role: role
      };
    };

    // Add timeout to prevent hanging
    await Promise.race([
      fetchUser(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Clerk timeout')), 3000)
      )
    ]);

    next();
  } catch (error) {
    console.error('Clerk user fetch error:', error);
    // Continue without user info
    next();
  }
}

/**
 * Middleware to require authentication
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);

  if (!auth?.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource'
    });
  }
  next();
}

/**
 * Middleware to require specific roles
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);

    if (!auth?.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource'
      });
    }

    if (!req.clerkUser) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'User information not available'
      });
    }

    if (!roles.includes(req.clerkUser.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `This action requires one of the following roles: ${roles.join(', ')}`,
        yourRole: req.clerkUser.role
      });
    }

    next();
  };
}

/**
 * Helper function to get current user from request
 */
export function getCurrentUser(req: Request): ClerkUser | null {
  return req.clerkUser || null;
}

/**
 * Helper function to check if user has role
 */
export function hasRole(req: Request, ...roles: UserRole[]): boolean {
  if (!req.clerkUser) return false;
  return roles.includes(req.clerkUser.role);
}

// Export clerkClient for use in other modules
export { clerkClient };
