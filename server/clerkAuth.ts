// Optional Clerk imports - only enable if CLERK_SECRET_KEY is available
let clerkMiddleware: any = null;
let getAuth: any = null;
let createClerkClient: any = null;
let clerkClient: any = null;

// Initialize Clerk using dynamic import to avoid module hoisting issues
const initializeClerk = async () => {
  // Debug: Check if CLERK_SECRET_KEY is loaded
  console.log("CLERK_SECRET_KEY check:", process.env.CLERK_SECRET_KEY ? `${process.env.CLERK_SECRET_KEY.substring(0, 15)}...` : "NOT SET");

  try {
    if (process.env.CLERK_SECRET_KEY) {
      const clerkModule = await import("@clerk/backend");
      console.log("Clerk module imported, available exports:", Object.keys(clerkModule).slice(0, 10));

      clerkMiddleware = clerkModule.clerkMiddleware;
      getAuth = clerkModule.getAuth;
      createClerkClient = clerkModule.createClerkClient;

      console.log("After assignment:");
      console.log("  - clerkMiddleware:", clerkMiddleware ? "SET" : "NULL");
      console.log("  - getAuth:", getAuth ? "SET" : "NULL");
      console.log("  - createClerkClient:", createClerkClient ? "SET" : "NULL");

      clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY!
      });

      console.log("Clerk client initialized successfully");
    } else {
      console.log("CLERK_SECRET_KEY not found - Clerk will not be initialized");
    }
  } catch (error) {
    console.log("Clerk initialization error:", error);
  }
};

// Call initialization immediately
await initializeClerk();

import { Request, Response, NextFunction, Express } from "express";
import { storage } from "./storage";

export function setupClerkAuth(app: Express) {
  // Debug logging
  console.log("setupClerkAuth called:");
  console.log("  - CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "SET" : "NOT SET");
  console.log("  - clerkMiddleware:", clerkMiddleware ? "AVAILABLE" : "NULL");
  console.log("  - getAuth:", getAuth ? "AVAILABLE" : "NULL");
  console.log("  - clerkClient:", clerkClient ? "AVAILABLE" : "NULL");

  // Skip Clerk setup if not available
  if (!process.env.CLERK_SECRET_KEY || !clerkMiddleware) {
    console.log("Clerk authentication not configured - using basic applicant auth only");
    return;
  }

  console.log("✅ Setting up Clerk authentication middleware");
  app.use(clerkMiddleware());
  app.use(clerkAuthMiddleware);
}

export async function getCurrentUser(req: Request) {
  if (!getAuth) {
    return null; // Clerk not available
  }

  const auth = getAuth(req);
  if (!auth?.userId) {
    return null;
  }

  let user = await storage.getUserByClerkId(auth.userId);

  if (!user && auth.userId) {
    try {
      const clerkUser = await clerkClient.users.getUser(auth.userId);
      if (clerkUser) {
        user = await storage.createUserFromClerk({
          clerkId: auth.userId,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
        });
      }
    } catch (error) {
      console.error('Error fetching Clerk user:', error);
    }
  }

  return user;
}

export async function clerkAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getCurrentUser(req);
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    console.error('Clerk auth middleware error:', error);
    next();
  }
}

export function requireAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!getAuth) {
    return res.status(401).json({ error: 'Unauthorized - Clerk not available' });
  }

  const auth = getAuth(req);
  if (!auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Export clerkClient for use in other modules
export { clerkClient };