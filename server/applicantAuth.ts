import { Request, Response, NextFunction } from "express";
import { db } from "./db";
import { applicants, organizationApplicants } from "@shared/schema";
import { eq } from "drizzle-orm";

// Extend Express Request interface to include applicant info
declare global {
  namespace Express {
    interface Request {
      applicant?: {
        id: string;
        applicantId: string;
        email: string;
        name: string;
        type: 'individual' | 'organization';
        status: string;
        emailVerified: boolean;
      };
    }
  }
}

/**
 * Middleware to authenticate applicants using their Applicant ID and email
 * This is a simple authentication middleware for the application flow
 */
export async function authenticateApplicant(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, applicantId } = req.headers;

    if (!email || !applicantId) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Email and Applicant ID headers are required"
      });
    }

    // Try individual applicants first
    const [individualApplicant] = await db
      .select()
      .from(applicants)
      .where(eq(applicants.email, email as string))
      .limit(1);

    if (individualApplicant && individualApplicant.applicantId === applicantId) {
      req.applicant = {
        id: individualApplicant.id,
        applicantId: individualApplicant.applicantId,
        email: individualApplicant.email,
        name: `${individualApplicant.firstName} ${individualApplicant.surname}`,
        type: 'individual',
        status: individualApplicant.status || 'registered',
        emailVerified: individualApplicant.emailVerified || false
      };
      return next();
    }

    // Try organization applicants
    const [orgApplicant] = await db
      .select()
      .from(organizationApplicants)
      .where(eq(organizationApplicants.email, email as string))
      .limit(1);

    if (orgApplicant && orgApplicant.applicantId === applicantId) {
      req.applicant = {
        id: orgApplicant.id,
        applicantId: orgApplicant.applicantId,
        email: orgApplicant.email,
        name: orgApplicant.companyName,
        type: 'organization',
        status: orgApplicant.status || 'registered',
        emailVerified: orgApplicant.emailVerified || false
      };
      return next();
    }

    // Authentication failed
    return res.status(401).json({
      error: "Invalid credentials",
      message: "The email and Applicant ID combination is incorrect"
    });

  } catch (error) {
    console.error('Applicant authentication error:', error);
    return res.status(500).json({
      error: "Authentication failed",
      message: "An error occurred during authentication"
    });
  }
}

/**
 * Middleware to require email verification
 */
export function requireEmailVerification(req: Request, res: Response, next: NextFunction) {
  if (!req.applicant) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Please authenticate first"
    });
  }

  if (!req.applicant.emailVerified) {
    return res.status(403).json({
      error: "Email verification required",
      message: "Please verify your email address before proceeding"
    });
  }

  next();
}

/**
 * Helper function to get current applicant from request
 */
export function getCurrentApplicant(req: Request) {
  return req.applicant || null;
}