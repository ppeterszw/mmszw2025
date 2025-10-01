// Optional Clerk imports - only enable if CLERK_SECRET_KEY is available
let clerkMiddleware: any = null;
let getAuth: any = null;
let createClerkClient: any = null;
let clerkClient: any = null;

try {
  if (process.env.CLERK_SECRET_KEY) {
    const clerkModule = require("@clerk/backend");
    clerkMiddleware = clerkModule.clerkMiddleware;
    getAuth = clerkModule.getAuth;
    createClerkClient = clerkModule.createClerkClient;

    clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!
    });
  }
} catch (error) {
  console.log("Clerk is not available, skipping Clerk authentication setup");
}

import { Request, Response, NextFunction, Express } from "express";
import { storage } from "./storage";

export function setupClerkAuth(app: Express) {
  // Skip Clerk setup if not available
  if (!process.env.CLERK_SECRET_KEY || !clerkMiddleware) {
    console.log("Clerk authentication not configured - using basic applicant auth only");
    return;
  }

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