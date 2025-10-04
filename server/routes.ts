import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { setupClerkAuth } from "./clerkAuth";
import { setupAuthRoutes } from "./auth/authRoutes";
import { storage } from "./storage";
import { registerPaymentRoutes } from "./paymentRoutes";
import { registerApplicationRoutes } from "./applicationRoutes";
import { z } from "zod";
import multer from "multer";
import { 
  insertMemberApplicationSchema, insertCaseSchema, insertEventSchema,
  insertOrganizationSchema, insertPaymentSchema, insertDocumentSchema,
  insertCpdActivitySchema, insertMemberRenewalSchema, insertMemberActivitySchema,
  insertOrganizationApplicantSchema, uploadedDocuments, individualApplications, organizationApplications
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { ObjectStorageService, getObjectStorageClient, parseObjectPath, signObjectURL } from "./objectStorage";
import { randomUUID, randomBytes } from "crypto";
import { DOCUMENT_TYPE_CONFIG, FileValidator, type DocumentType } from "./utils/fileValidation";
import { hashPassword } from "./auth";
import { nextMemberNumber } from "./services/namingSeries";

// Centralized role constants from schema
const ADMIN_ROLES = ['admin', 'super_admin'];
const FINANCE_ROLES = ['admin', 'accountant', 'super_admin'];
const STAFF_ROLES = ['admin', 'member_manager', 'super_admin', 'staff'];
const MEMBER_MANAGER_ROLES = ['admin', 'member_manager', 'super_admin'];

// Allowed sort fields to prevent injection
const PAYMENT_SORT_FIELDS = ['createdAt', 'amount', 'status', 'paymentNumber'] as const;
const RENEWAL_SORT_FIELDS = ['dueDate', 'createdAt', 'status', 'renewalYear'] as const;

// Enhanced Zod schemas for validation
const paginationQuerySchema = z.object({
  limit: z.string().optional()
    .transform(val => val ? parseInt(val) : undefined)
    .refine(val => val === undefined || (!isNaN(val) && val > 0 && val <= 1000), {
      message: "Limit must be a positive number between 1 and 1000"
    }),
  offset: z.string().optional()
    .transform(val => val ? parseInt(val) : undefined)
    .refine(val => val === undefined || (!isNaN(val) && val >= 0), {
      message: "Offset must be a non-negative number"
    }),
});

const paymentsQuerySchema = paginationQuerySchema.extend({
  status: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(PAYMENT_SORT_FIELDS).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

const renewalsQuerySchema = paginationQuerySchema.extend({
  year: z.string().optional()
    .transform(val => val ? parseInt(val) : undefined)
    .refine(val => val === undefined || (!isNaN(val) && val >= 2020 && val <= 2030), {
      message: "Year must be between 2020 and 2030"
    }),
  status: z.string().optional(),
  search: z.string().optional(),
});

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv' && !file.originalname.toLowerCase().endsWith('.csv')) {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  }
});

const financeStatsQuerySchema = z.object({
  startDate: z.string().optional()
    .transform(val => val ? new Date(val) : undefined)
    .refine(val => val === undefined || !isNaN(val.getTime()), {
      message: "Start date must be a valid date"
    }),
  endDate: z.string().optional()
    .transform(val => val ? new Date(val) : undefined)
    .refine(val => val === undefined || !isNaN(val.getTime()), {
      message: "End date must be a valid date"
    }),
});

const settingsUpdateSchema = z.object({
  settings: z.array(z.object({
    key: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_.-]+$/, {
      message: "Key must contain only alphanumeric characters, underscores, dots, and hyphens"
    }),
    value: z.string().max(10000),
    description: z.string().max(500).optional(),
  })).min(1).max(50),
});

const singleSettingUpdateSchema = z.object({
  value: z.string().min(1).max(10000),
  description: z.string().max(500).optional(),
});

const renewalUpdateSchema = z.object({
  status: z.enum(['pending', 'reminded', 'overdue', 'completed', 'lapsed']).optional(),
  renewalFee: z.string().optional()
    .refine(val => val === undefined || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: "Renewal fee must be a valid non-negative number"
    }),
  notes: z.string().max(1000).optional(),
  dueDate: z.string().optional()
    .transform(val => val ? new Date(val) : undefined)
    .refine(val => val === undefined || !isNaN(val.getTime()), {
      message: "Due date must be a valid date"
    }),
});

const generateRenewalsSchema = z.object({
  year: z.number().int().min(2020).max(2030),
  defaultFee: z.number().positive().max(10000).optional(),
});

// Case query and update schemas
const casesQuerySchema = paginationQuerySchema.extend({
  status: z.string().optional(),
  priority: z.string().optional(),
  type: z.string().optional(),
  assignedTo: z.string().optional(),
  search: z.string().optional(),
});

const caseUpdateSchema = insertCaseSchema.partial().extend({
  resolution: z.string().optional(),
});

const caseAssignmentSchema = z.object({
  assignedTo: z.string().uuid("Invalid user ID format").optional(),
});

const bulkCaseActionSchema = z.object({
  caseIds: z.array(z.string().uuid("Invalid case ID format")).min(1).max(100),
  action: z.enum(['resolve', 'assign', 'close']),
  assignedTo: z.string().uuid("Invalid user ID format").optional(), // For bulk assign
  resolution: z.string().optional(), // For bulk resolve
});

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  console.log("Auth middleware: req.isAuthenticated():", req.isAuthenticated());
  console.log("Auth middleware: req.user:", req.user);
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Role-based authorization middleware
function authorizeRole(allowedRoles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: "Access denied. Insufficient permissions.", 
        requiredRoles: allowedRoles,
        userRole: userRole
      });
    }
    
    next();
  };
}

// Combined authentication middleware (accepts both user and applicant authentication)
function requireUserOrApplicantAuth(req: any, res: any, next: any) {
  console.log("Combined auth middleware: req.isAuthenticated():", req.isAuthenticated());
  console.log("Combined auth middleware: req.user:", req.user);
  console.log("Combined auth middleware: req.session.applicantId:", req.session.applicantId);
  
  // Check for user authentication (admin/staff)
  if (req.isAuthenticated()) {
    req.authType = 'user';
    req.authUserId = req.user.id;
    return next();
  }
  
  // Check for applicant authentication
  if (req.session.applicantId && req.session.applicantDbId) {
    req.authType = 'applicant';
    req.authUserId = req.session.applicantDbId; // Use applicant DB ID for authorization
    req.applicantId = req.session.applicantId;
    return next();
  }
  
  return res.status(401).json({ message: "Authentication required" });
}

// Application authorization function
async function checkApplicationAuthorization(userId: string, applicationId: string, applicationType?: string): Promise<{ authorized: boolean; reason?: string; application?: any }> {
  if (!applicationId) {
    return { authorized: false, reason: "Application ID is required" };
  }

  try {
    let application = null;
    let appType = applicationType;

    // If applicationType is provided, check only that type
    if (appType === 'individual') {
      const individualApp = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.id, applicationId))
        .limit(1);
      
      if (individualApp.length === 0) {
        return { authorized: false, reason: "Individual application not found" };
      }
      application = individualApp[0];
    } else if (appType === 'organization') {
      const orgApp = await db
        .select()
        .from(organizationApplications)
        .where(eq(organizationApplications.id, applicationId))
        .limit(1);
      
      if (orgApp.length === 0) {
        return { authorized: false, reason: "Organization application not found" };
      }
      application = orgApp[0];
    } else {
      // Try both tables to find the application
      const [individualApp] = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.id, applicationId))
        .limit(1);

      if (individualApp) {
        application = individualApp;
        appType = 'individual';
      } else {
        const [orgApp] = await db
          .select()
          .from(organizationApplications)
          .where(eq(organizationApplications.id, applicationId))
          .limit(1);

        if (orgApp) {
          application = orgApp;
          appType = 'organization';
        }
      }

      if (!application) {
        return { authorized: false, reason: "Application not found in either individual or organization applications" };
      }
    }

    // Check if user owns the application
    if (application.createdByUserId === userId) {
      console.log(`Authorization granted: User ${userId} owns application ${applicationId} (${appType})`);
      return { authorized: true, application };
    }

    // Check if user has admin role (admin users can access any application)
    const user = await storage.getUser(userId);
    if (user?.role === 'admin') {
      console.log(`Authorization granted: User ${userId} has admin role for application ${applicationId} (${appType})`);
      return { authorized: true, application };
    }

    console.log(`Authorization denied: User ${userId} does not own application ${applicationId} (${appType}) and is not admin`);
    return { 
      authorized: false, 
      reason: "You do not have permission to upload documents for this application" 
    };

  } catch (error) {
    console.error('Authorization check error:', error);
    return { 
      authorized: false, 
      reason: "Error checking application authorization" 
    };
  }
}

// Audit logging function for security events
async function logSecurityEvent(action: string, userId: string, applicationId: string, details: any, success: boolean) {
  try {
    console.log(`[SECURITY AUDIT] ${action}:`, {
      userId,
      applicationId,
      success,
      timestamp: new Date().toISOString(),
      ...details
    });
    // In production, this should also write to a dedicated security audit log
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Register public routes first (before authentication)
  const { registerPublicRoutes } = await import("./publicRoutes");
  registerPublicRoutes(app);

  // Setup authentication (Clerk)
  setupClerkAuth(app);
  // Keep legacy auth for backward compatibility during migration
  setupAuth(app);

  // Setup new comprehensive auth routes (RBAC, Session Management, Password Reset, etc.)
  setupAuthRoutes(app);

  // Register application routes
  registerApplicationRoutes(app);

  // Setup Organization Portal routes
  const { setupOrganizationPortalRoutes } = await import("./organizationPortalRoutes");
  setupOrganizationPortalRoutes(app);

  // ===== APPLICANT REGISTRATION ROUTES =====

  /**
   * POST /api/applicants/register
   * Register a new applicant with email verification
   */
  app.post("/api/applicants/register", async (req, res) => {
    try {
      const { firstName, surname, email } = req.body;

      if (!firstName || !surname || !email) {
        return res.status(400).json({ 
          error: "Missing required fields",
          details: "firstName, surname and email are required"
        });
      }

      // Check if applicant already exists
      const existingApplicant = await storage.getApplicantByEmail(email);
      if (existingApplicant) {
        return res.status(409).json({ 
          error: "Email already registered",
          applicantId: existingApplicant.applicantId
        });
      }

      // Create applicant (verification token is generated internally)
      const applicant = await storage.createApplicant({
        firstName,
        surname,
        email
      });

      // Send welcome email with applicant ID
      const { sendEmail, generateWelcomeEmail } = await import('./services/emailService');
      const fullName = `${firstName} ${surname}`;
      const welcomeEmail = generateWelcomeEmail(fullName, applicant.applicantId);
      
      const welcomeEmailSent = await sendEmail({
        to: email,
        from: 'noreply@estateagentscouncil.org',
        ...welcomeEmail
      });

      // Send verification email - use production URL for all environments
      const baseUrl = 'https://mms.estateagentscouncil.org';
      
      const { generateVerificationEmail } = await import('./services/emailService');
      const verificationEmail = generateVerificationEmail(fullName, applicant.emailVerificationToken!, baseUrl);
      
      const verificationEmailSent = await sendEmail({
        to: email,
        from: 'noreply@estateagentscouncil.org',
        ...verificationEmail
      });

      res.status(201).json({
        success: true,
        applicantId: applicant.applicantId,
        message: "Registration successful! Please check your email for verification instructions.",
        emailsSent: {
          welcome: welcomeEmailSent,
          verification: verificationEmailSent
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        error: "Registration failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * POST /api/applicants/login
   * Login existing applicant with Applicant ID and email
   */
  app.post("/api/applicants/login", async (req, res) => {
    try {
      const { applicantId, email } = req.body;

      if (!applicantId || !email) {
        return res.status(400).json({ 
          error: "Missing required fields",
          details: "applicantId and email are required"
        });
      }

      // Validate applicant ID format
      const applicantIdPattern = /^MBR-APP-\d{4}-\d{4}$/;
      if (!applicantIdPattern.test(applicantId)) {
        return res.status(400).json({ 
          error: "Invalid applicant ID format",
          details: "Applicant ID must be in format MBR-APP-YYYY-XXXX"
        });
      }

      // Find applicant by applicant ID
      const applicant = await storage.getApplicantByApplicantId(applicantId);
      if (!applicant) {
        return res.status(401).json({ 
          error: "Invalid credentials",
          details: "Applicant ID not found"
        });
      }

      // Verify email matches
      if (applicant.email !== email) {
        return res.status(401).json({ 
          error: "Invalid credentials",
          details: "Email address does not match the applicant ID"
        });
      }

      // Check if email is verified
      if (!applicant.emailVerified) {
        return res.status(403).json({ 
          error: "Email not verified",
          details: "Please verify your email address before continuing with your application"
        });
      }

      // Store applicant session for authorization
      req.session.applicantId = applicant.applicantId;
      req.session.applicantDbId = applicant.id;
      
      // Login successful - return applicant info
      res.status(200).json({
        success: true,
        message: "Login successful",
        applicant: {
          id: applicant.id,
          applicantId: applicant.applicantId,
          firstName: applicant.firstName,
          surname: applicant.surname,
          fullName: `${applicant.firstName} ${applicant.surname}`,
          email: applicant.email,
          status: applicant.status,
          emailVerified: applicant.emailVerified
        }
      });

    } catch (error) {
      console.error('Applicant login error:', error);
      res.status(500).json({ 
        error: "Login failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * POST /api/applicants/verify-email
   * Verify applicant's email address
   */
  app.post("/api/applicants/verify-email", async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ 
          error: "Verification token required"
        });
      }

      // Find applicant by verification token
      const applicant = await storage.getApplicantByVerificationToken(token);
      if (!applicant) {
        return res.status(404).json({ 
          error: "Invalid verification token"
        });
      }

      // Check if token has expired
      if (applicant.emailVerificationExpires && new Date() > applicant.emailVerificationExpires) {
        return res.status(410).json({ 
          error: "Verification token has expired"
        });
      }

      // Check if already verified
      if (applicant.emailVerified) {
        return res.status(200).json({ 
          success: true,
          message: "Email already verified",
          applicantId: applicant.applicantId
        });
      }

      // Verify the email
      const verifiedApplicant = await storage.verifyApplicantEmail(applicant.id);

      res.status(200).json({
        success: true,
        message: "Email successfully verified! You can now continue with your application.",
        applicantId: verifiedApplicant.applicantId
      });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ 
        error: "Email verification failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * GET /api/applicants/:id/status
   * Get applicant status and verification information
   */
  app.get("/api/applicants/:id/status", async (req, res) => {
    try {
      const { id } = req.params;

      const applicant = await storage.getApplicantByApplicantId(id);
      if (!applicant) {
        return res.status(404).json({ 
          error: "Applicant not found"
        });
      }

      res.status(200).json({
        applicantId: applicant.applicantId,
        firstName: applicant.firstName,
        surname: applicant.surname,
        fullName: `${applicant.firstName} ${applicant.surname}`,
        email: applicant.email,
        status: applicant.status,
        emailVerified: applicant.emailVerified,
        applicationStartedAt: applicant.applicationStartedAt,
        applicationCompletedAt: applicant.applicationCompletedAt,
        createdAt: applicant.createdAt
      });

    } catch (error) {
      console.error('Get applicant status error:', error);
      res.status(500).json({ 
        error: "Failed to get applicant status",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * POST /api/applicants/:applicantId/save-draft
   * Save draft application data for an applicant
   */
  app.post("/api/applicants/:applicantId/save-draft", async (req, res) => {
    try {
      const { applicantId } = req.params;
      const { applicationData } = req.body;

      if (!applicationData) {
        return res.status(400).json({ 
          error: "Application data required"
        });
      }

      // Validate applicant ID format
      const applicantIdPattern = /^MBR-APP-\d{4}-\d{4}$/;
      if (!applicantIdPattern.test(applicantId)) {
        return res.status(400).json({ 
          error: "Invalid applicant ID format",
          details: "Applicant ID must be in format MBR-APP-YYYY-XXXX"
        });
      }

      // SECURITY: Verify session authorization
      if (!req.session.applicantId || req.session.applicantId !== applicantId) {
        return res.status(401).json({ 
          error: "Unauthorized",
          details: "You can only save drafts for your own application"
        });
      }

      // Check if applicant exists and is verified
      const applicant = await storage.getApplicantByApplicantId(applicantId);
      if (!applicant) {
        return res.status(404).json({ 
          error: "Applicant not found"
        });
      }

      if (!applicant.emailVerified) {
        return res.status(403).json({ 
          error: "Email not verified",
          details: "Please verify your email address before saving application data"
        });
      }

      // Save or update draft application
      const draftApplication = await storage.saveApplicationDraft(applicant.id, applicationData);

      res.status(200).json({
        success: true,
        message: "Application draft saved successfully",
        draftId: draftApplication.id,
        lastSaved: new Date().toISOString()
      });

    } catch (error) {
      console.error('Save draft error:', error);
      res.status(500).json({ 
        error: "Failed to save draft",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * GET /api/applicants/:applicantId/load-draft
   * Load saved draft application data for an applicant
   */
  app.get("/api/applicants/:applicantId/load-draft", async (req, res) => {
    try {
      const { applicantId } = req.params;

      // Validate applicant ID format
      const applicantIdPattern = /^MBR-APP-\d{4}-\d{4}$/;
      if (!applicantIdPattern.test(applicantId)) {
        return res.status(400).json({ 
          error: "Invalid applicant ID format",
          details: "Applicant ID must be in format MBR-APP-YYYY-XXXX"
        });
      }

      // SECURITY: Verify session authorization
      if (!req.session.applicantId || req.session.applicantId !== applicantId) {
        return res.status(401).json({ 
          error: "Unauthorized",
          details: "You can only access drafts for your own application"
        });
      }

      // Check if applicant exists and is verified
      const applicant = await storage.getApplicantByApplicantId(applicantId);
      if (!applicant) {
        return res.status(404).json({ 
          error: "Applicant not found"
        });
      }

      if (!applicant.emailVerified) {
        return res.status(403).json({ 
          error: "Email not verified",
          details: "Please verify your email address before accessing application data"
        });
      }

      // Load draft application
      const draftApplication = await storage.loadApplicationDraft(applicant.id);

      if (!draftApplication) {
        return res.status(404).json({ 
          error: "No saved draft found",
          message: "Start a new application to begin"
        });
      }

      res.status(200).json({
        success: true,
        applicationData: draftApplication.applicationData,
        lastSaved: draftApplication.updatedAt,
        draftId: draftApplication.id
      });

    } catch (error) {
      console.error('Load draft error:', error);
      res.status(500).json({ 
        error: "Failed to load draft",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Organization Applicant Registration and Authentication

  /**
   * POST /api/organization-applicants/register
   * Register a new organization applicant with email verification
   */
  app.post("/api/organization-applicants/register", async (req, res) => {
    try {
      // Validate input using Zod schema
      const registrationSchema = insertOrganizationApplicantSchema.pick({
        companyName: true,
        email: true
      });
      
      const validatedData = registrationSchema.parse(req.body);
      const { companyName, email } = validatedData;

      // Check if organization applicant with this email already exists
      const existingApplicant = await storage.getOrganizationApplicantByEmail(email);
      if (existingApplicant) {
        return res.status(409).json({ 
          error: "Organization applicant already exists",
          details: "An organization application with this email address already exists"
        });
      }

      // Create organization applicant record
      const organizationApplicant = await storage.createOrganizationApplicant({
        companyName,
        email
      });

      // Send verification email
      try {
        const { sendEmail, generateOrgApplicantVerificationEmail } = await import('./services/emailService');
        const emailContent = generateOrgApplicantVerificationEmail(
          companyName,
          organizationApplicant.emailVerificationToken!
        );

        await sendEmail({
          to: email,
          from: 'sysadmin@estateagentscouncil.org',
          subject: emailContent.subject,
          html: emailContent.html
        });

        console.log(`Organization verification email sent to: ${email}`);
      } catch (emailError) {
        console.error('Failed to send organization verification email:', emailError);
        // Continue with registration even if email fails
      }

      res.status(201).json({
        success: true,
        message: "Organization application started successfully",
        applicantId: organizationApplicant.applicantId,
        companyName: organizationApplicant.companyName,
        email: organizationApplicant.email,
        emailVerified: organizationApplicant.emailVerified,
        status: organizationApplicant.status
      });

    } catch (error) {
      console.error('Organization registration error:', error);
      res.status(500).json({ 
        error: "Failed to register organization applicant",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * POST /api/organization-applicants/login
   * Login existing organization applicant with Applicant ID and email
   */
  app.post("/api/organization-applicants/login", async (req, res) => {
    try {
      // Validate input with strict schema
      const loginSchema = z.object({
        applicantId: z.string().regex(/^ORG-APP-\d{4}-\d{4}$/, "Invalid organization applicant ID format"),
        email: z.string().email("Invalid email format")
      });
      
      const { applicantId, email } = loginSchema.parse(req.body);

      // Find organization applicant by applicant ID
      const organizationApplicant = await storage.getOrganizationApplicantByApplicantId(applicantId);
      if (!organizationApplicant) {
        return res.status(401).json({ 
          error: "Invalid credentials",
          details: "Organization applicant ID not found"
        });
      }

      // Verify email matches
      if (organizationApplicant.email !== email) {
        return res.status(401).json({ 
          error: "Invalid credentials"
        });
      }

      // SECURITY: Enforce email verification before allowing login
      if (!organizationApplicant.emailVerified) {
        return res.status(403).json({ 
          error: "Email verification required",
          details: "Please verify your email address before logging in"
        });
      }

      // Set session for organization applicant
      req.session.organizationApplicantId = applicantId;
      req.session.isOrganizationApplicant = true;

      res.status(200).json({
        success: true,
        message: "Organization login successful",
        applicantId: organizationApplicant.applicantId,
        companyName: organizationApplicant.companyName,
        email: organizationApplicant.email,
        emailVerified: organizationApplicant.emailVerified,
        status: organizationApplicant.status
      });

    } catch (error) {
      console.error('Organization login error:', error);
      res.status(500).json({ 
        error: "Failed to login organization applicant",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * POST /api/organization-applicants/verify-email
   * Verify organization applicant's email address
   */
  app.post("/api/organization-applicants/verify-email", async (req, res) => {
    try {
      // Validate input with strict schema
      const verifySchema = z.object({
        token: z.string().min(1, "Verification token is required")
      });
      
      const { token } = verifySchema.parse(req.body);

      // Find organization applicant by verification token
      const organizationApplicant = await storage.getOrganizationApplicantByVerificationToken(token);
      if (!organizationApplicant) {
        return res.status(400).json({ 
          error: "Invalid or expired verification token"
        });
      }

      // SECURITY: Check if token has expired
      if (organizationApplicant.emailVerificationExpires && 
          organizationApplicant.emailVerificationExpires < new Date()) {
        return res.status(400).json({ 
          error: "Verification token has expired",
          details: "Please request a new verification email"
        });
      }

      // SECURITY: Check if email is already verified (prevent token reuse)
      if (organizationApplicant.emailVerified) {
        return res.status(400).json({ 
          error: "Email is already verified"
        });
      }

      // Verify the organization applicant's email
      const verifiedApplicant = await storage.verifyOrganizationApplicantEmail(organizationApplicant.id);

      // Set session for the verified organization applicant
      req.session.organizationApplicantId = verifiedApplicant.applicantId;
      req.session.isOrganizationApplicant = true;

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
        applicantId: verifiedApplicant.applicantId,
        companyName: verifiedApplicant.companyName,
        email: verifiedApplicant.email,
        emailVerified: verifiedApplicant.emailVerified,
        status: verifiedApplicant.status
      });

    } catch (error) {
      console.error('Organization email verification error:', error);
      res.status(500).json({ 
        error: "Failed to verify email",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * GET /api/organization-applicants/:id/status
   * Get organization applicant status and verification information
   * SECURITY: Requires valid session for the specific applicant
   */
  app.get("/api/organization-applicants/:id/status", async (req, res) => {
    try {
      const { id } = req.params;

      // SECURITY: Validate applicant ID format
      const orgApplicantIdPattern = /^ORG-APP-\d{4}-\d{4}$/;
      if (!orgApplicantIdPattern.test(id)) {
        return res.status(400).json({ 
          error: "Invalid applicant ID format"
        });
      }

      // SECURITY: Only allow authenticated organization applicants to access their own status
      if (!req.session.organizationApplicantId || req.session.organizationApplicantId !== id) {
        return res.status(401).json({ 
          error: "Unauthorized",
          details: "You can only access your own application status"
        });
      }

      const organizationApplicant = await storage.getOrganizationApplicantByApplicantId(id);
      if (!organizationApplicant) {
        return res.status(404).json({ 
          error: "Organization applicant not found"
        });
      }

      // Return status information for authenticated applicant
      res.status(200).json({
        applicantId: organizationApplicant.applicantId,
        companyName: organizationApplicant.companyName,
        email: organizationApplicant.email,
        emailVerified: organizationApplicant.emailVerified,
        status: organizationApplicant.status,
        applicationStartedAt: organizationApplicant.applicationStartedAt,
        applicationCompletedAt: organizationApplicant.applicationCompletedAt
      });

    } catch (error) {
      console.error('Organization status check error:', error);
      res.status(500).json({ 
        error: "Failed to check organization applicant status",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Member applications
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertMemberApplicationSchema.parse(req.body);
      const application = await storage.createMemberApplication(validatedData);
      
      // Send application confirmation email
      try {
        const { sendEmail, generateApplicationConfirmationEmail } = await import('./services/emailService');
        const applicantName = `${validatedData.firstName} ${validatedData.lastName}`;
        const applicationId = application.applicationNumber || `APP-${Date.now()}`;
        const feeAmount = validatedData.applicationFee || 75; // Default individual fee
        
        const confirmationEmail = generateApplicationConfirmationEmail(
          applicantName, 
          applicationId, 
          'individual',
          parseFloat(feeAmount.toString())
        );
        
        await sendEmail({
          to: validatedData.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...confirmationEmail
        });
        
        console.log(`Application confirmation email sent to: ${validatedData.email}`);
      } catch (emailError) {
        console.error('Failed to send application confirmation email:', emailError);
        // Don't fail the request if email fails
      }
      
      res.status(201).json(application);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getPendingApplications();
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const application = await storage.updateMemberApplication(id, updates);
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Members
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/members/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const member = await storage.getMember(id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/members/verify/:identifier", async (req, res) => {
    try {
      const { identifier } = req.params;
      let member;
      
      // Try to find by membership number or full name
      if (identifier.startsWith('REA-')) {
        member = await storage.getMemberByMembershipNumber(identifier);
      } else {
        // Search by name logic would need to be implemented
        member = await storage.getMemberByEmail(identifier);
      }
      
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      // Return only public verification data
      res.json({
        membershipNumber: member.membershipNumber,
        firstName: member.firstName,
        lastName: member.lastName,
        memberType: member.memberType,
        status: member.membershipStatus,
        expiryDate: member.expiryDate
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Organizations
  app.get("/api/organizations", async (req, res) => {
    try {
      const organizations = await storage.getAllOrganizations();
      res.json(organizations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/organizations", async (req, res) => {
    try {
      const validatedData = insertOrganizationSchema.parse(req.body);
      const organization = await storage.createOrganization(validatedData);
      res.status(201).json(organization);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Cases - Enhanced with security and functionality
  app.get("/api/cases", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const validatedQuery = casesQuerySchema.safeParse(req.query);
      if (!validatedQuery.success) {
        return res.status(400).json({ 
          message: "Invalid query parameters", 
          errors: validatedQuery.error.errors 
        });
      }

      const { status, priority, type, assignedTo, search } = validatedQuery.data;
      let cases;
      
      if (priority === 'high' || priority === 'critical') {
        // Priority queue endpoint functionality
        cases = await storage.getCasesByPriority(priority);
      } else if (status) {
        cases = await storage.getCasesByStatus(status);
      } else {
        cases = await storage.getAllCases();
      }
      
      // Apply additional filters
      if (type) {
        cases = cases.filter(c => c.type === type);
      }
      if (assignedTo) {
        cases = cases.filter(c => c.assignedTo === assignedTo);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        cases = cases.filter(c => 
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.caseNumber.toLowerCase().includes(searchLower)
        );
      }
      
      res.json(cases);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cases", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const validatedData = insertCaseSchema.parse(req.body);
      const caseItem = await storage.createCase(validatedData);
      res.status(201).json(caseItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/cases/:id", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const caseItem = await storage.getCase(id);
      if (!caseItem) {
        return res.status(404).json({ message: "Case not found" });
      }
      res.json(caseItem);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/cases/:id", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const validatedUpdates = caseUpdateSchema.parse(req.body);
      const caseItem = await storage.updateCase(id, validatedUpdates);
      res.json(caseItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Case assignment endpoint
  app.put("/api/cases/:id/assign", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = caseAssignmentSchema.parse(req.body);
      const caseItem = await storage.assignCase(id, validatedData.assignedTo);
      res.json(caseItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Bulk case operations
  app.post("/api/cases/bulk-action", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const validatedData = bulkCaseActionSchema.parse(req.body);
      const { caseIds, action, assignedTo, resolution } = validatedData;
      
      let result;
      if (action === 'assign') {
        if (!assignedTo) {
          return res.status(400).json({ message: "assignedTo is required for bulk assign" });
        }
        result = await storage.bulkAssignCases(caseIds, assignedTo);
      } else if (action === 'resolve') {
        result = await storage.bulkResolveCases(caseIds, resolution);
      } else if (action === 'close') {
        result = await storage.bulkCloseCases(caseIds);
      }
      
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Case reports endpoint
  app.get("/api/cases/reports/export", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { format = 'json', status, priority } = req.query;
      
      let cases;
      if (status) {
        cases = await storage.getCasesByStatus(status as string);
      } else {
        cases = await storage.getAllCases();
      }

      if (priority) {
        cases = cases.filter(c => c.priority === priority);
      }

      if (format === 'csv') {
        // Simple CSV export
        const csvHeaders = 'Case Number,Title,Type,Priority,Status,Assigned To,Created Date\n';
        const csvRows = cases.map(c => 
          `${c.caseNumber},"${c.title}",${c.type},${c.priority},${c.status},"${c.assignedTo || 'Unassigned'}",${c.createdAt}`
        ).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="cases-export.csv"');
        res.send(csvHeaders + csvRows);
      } else {
        res.json(cases);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Staff list for case assignment
  app.get("/api/cases/staff", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const staff = await storage.getStaffUsers();
      res.json(staff);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CPD Activities
  app.get("/api/cpd-activities", async (req, res) => {
    try {
      const activities = await storage.getCpdActivities();
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cpd-activities", async (req, res) => {
    try {
      const validatedData = insertCpdActivitySchema.parse(req.body);
      const activity = await storage.createCpdActivity(validatedData);
      res.status(201).json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Member Renewals
  app.get("/api/renewals", authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const validatedQuery = renewalsQuerySchema.safeParse(req.query);
      if (!validatedQuery.success) {
        return res.status(400).json({ 
          message: "Invalid query parameters", 
          errors: validatedQuery.error.errors 
        });
      }
      
      const result = await storage.listRenewals(validatedQuery.data);
      res.json(result.renewals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/renewals/current", async (req, res) => {
    try {
      const currentRenewal = await storage.getCurrentMemberRenewal();
      res.json(currentRenewal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/renewals/:id/remind", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.sendRenewalReminder(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/renewals/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;
      const renewal = await storage.completeRenewal(id);
      res.json(renewal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Enhanced renewal management routes
  app.put("/api/renewals/:id", authorizeRole(MEMBER_MANAGER_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || id.trim() === '') {
        return res.status(400).json({ message: "Renewal ID is required" });
      }
      
      const validatedBody = renewalUpdateSchema.safeParse(req.body);
      if (!validatedBody.success) {
        return res.status(400).json({ 
          message: "Invalid request body", 
          errors: validatedBody.error.errors 
        });
      }
      
      const renewal = await storage.updateRenewal(id, validatedBody.data);
      res.json(renewal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/renewals/:id/increment-reminder", authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || id.trim() === '') {
        return res.status(400).json({ message: "Renewal ID is required" });
      }
      
      const renewal = await storage.incrementRenewalReminder(id);
      res.json(renewal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/renewals/generate", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const validatedBody = generateRenewalsSchema.safeParse(req.body);
      if (!validatedBody.success) {
        return res.status(400).json({ 
          message: "Invalid request body", 
          errors: validatedBody.error.errors 
        });
      }
      
      const { year, defaultFee } = validatedBody.data;
      const result = await storage.generateRenewals(year, defaultFee);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Member Activities (Audit Trail)
  app.get("/api/member-activities", async (req, res) => {
    try {
      const activities = await storage.getMemberActivities();
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/member-activities", async (req, res) => {
    try {
      const validatedData = insertMemberActivitySchema.parse(req.body);
      const activity = await storage.createMemberActivity(validatedData);
      res.status(201).json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const { upcoming } = req.query;
      let events;
      
      if (upcoming === 'true') {
        events = await storage.getUpcomingEvents();
      } else {
        events = await storage.getAllEvents();
      }
      
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Payments
  app.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/payments/member/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const payments = await storage.getPaymentsByMember(memberId);
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/payments/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const payment = await storage.updatePaymentStatus(id, status);
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Documents
  app.post("/api/documents", async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/documents/member/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const documents = await storage.getDocumentsByMember(memberId);
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/documents/application/:applicationId", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const documents = await storage.getDocumentsByApplication(applicationId);
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/documents/:id/verify", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { id } = req.params;
      const document = await storage.verifyDocument(id, req.user!.id);
      res.json(document);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin Portal Routes
  app.get("/api/admin/members", requireAuth, async (req, res) => {
    try {
      const allMembers = await storage.getAllMembers();
      res.json(allMembers);
    } catch (error: any) {
      console.error("Admin members fetch error:", error);
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  // Admin update member endpoint
  app.put("/api/members/:id", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Find the member first
      const member = await storage.getMember(id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      // Update the member
      await storage.updateMember(id, updates);
      
      res.json({ message: "Member updated successfully" });
    } catch (error: any) {
      console.error("Admin member update error:", error);
      res.status(500).json({ message: "Failed to update member" });
    }
  });

  // Simplified Add Member route for AgentsHub
  app.post("/api/admin/members/simplified-add", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const {
        firstName,
        surname,
        dateOfBirth,
        countryOfResidence,
        nationality,
        email,
        memberType,
        educationLevel,
        employmentStatus,
        organizationName
      } = req.body;

      // Validate required fields
      if (!firstName || !surname || !dateOfBirth || !countryOfResidence || 
          !nationality || !email || !memberType || !educationLevel || !employmentStatus) {
        return res.status(400).json({
          message: "Missing required fields",
          details: "All fields except organization name are required"
        });
      }

      // Check if member email already exists
      const existingMember = await storage.getMemberByEmail(email);
      if (existingMember) {
        return res.status(409).json({
          message: "Email already exists",
          details: "A member with this email address already exists"
        });
      }

      // Generate membership number
      const { nextMemberNumber } = await import('./services/namingSeries');
      const membershipNumber = await nextMemberNumber('individual');

      // Prepare member data
      const memberData = {
        firstName,
        lastName: surname,
        email,
        dateOfBirth: new Date(dateOfBirth),
        countryOfResidence,
        nationality,
        memberType,
        membershipNumber,
        membershipStatus: 'pending' as const,
        // Additional fields based on form data
        isMatureEntry: educationLevel === 'mature_entry' ? true : false,
        
      };

      // Create the member
      const newMember = await storage.createMember(memberData);

      // Send welcome and verification email
      try {
        const { sendEmail, generateNewMemberWelcomeEmail, generateMemberVerificationEmail } = await import('./services/emailService');
        const fullName = `${firstName} ${surname}`;
        
        // Generate verification token for member
        const { generateVerificationToken, getVerificationExpiry } = await import('./utils/applicantUtils');
        const verificationToken = generateVerificationToken();
        
        // Member created successfully - verification token would be stored in a separate system

        // Send welcome email
        const welcomeEmail = generateNewMemberWelcomeEmail(fullName, membershipNumber, educationLevel, employmentStatus);
        const baseUrl = 'https://mms.estateagentscouncil.org';
        
        const welcomeEmailSent = await sendEmail({
          to: email,
          from: 'noreply@estateagentscouncil.org',
          ...welcomeEmail
        });

        // Send verification email with login link
        const verificationEmail = generateMemberVerificationEmail(fullName, email, membershipNumber, verificationToken, baseUrl);
        
        const verificationEmailSent = await sendEmail({
          to: email,
          from: 'noreply@estateagentscouncil.org',
          ...verificationEmail
        });

        console.log(`Member ${membershipNumber} created successfully. Emails sent: welcome=${welcomeEmailSent}, verification=${verificationEmailSent}`);

        res.status(201).json({
          success: true,
          message: "Member created successfully! Verification email has been sent.",
          member: {
            id: newMember.id,
            firstName: newMember.firstName,
            surname: newMember.lastName,
            email: newMember.email,
            membershipNumber: newMember.membershipNumber,
            memberType: newMember.memberType,
            membershipStatus: newMember.membershipStatus,
            emailVerified: false // Member email verification status
          },
          emailsSent: {
            welcome: welcomeEmailSent,
            verification: verificationEmailSent
          }
        });

      } catch (emailError: any) {
        console.error("Email sending error:", emailError);
        // Member was created successfully but email failed
        res.status(201).json({
          success: true,
          message: "Member created successfully, but email notification failed to send.",
          member: {
            id: newMember.id,
            firstName: newMember.firstName,
            surname: newMember.lastName,
            email: newMember.email,
            membershipNumber: newMember.membershipNumber,
            memberType: newMember.memberType,
            membershipStatus: newMember.membershipStatus,
            emailVerified: false // Member email verification status
          },
          emailError: emailError.message
        });
      }

    } catch (error: any) {
      console.error("Simplified add member error:", error);
      res.status(500).json({ 
        message: "Failed to create member",
        details: error.message || "Unknown error occurred"
      });
    }
  });

  // Add Member with Clerk Integration
  app.post("/api/admin/members/create-with-clerk", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const {
        firstName,
        surname,
        dateOfBirth,
        email,
        memberType,
        educationLevel,
        countryOfResidence,
        nationality,
        employmentStatus,
        organizationName
      } = req.body;

      // Validate required fields
      if (!firstName || !surname || !dateOfBirth || !email || !memberType ||
          !educationLevel || !countryOfResidence || !nationality || !employmentStatus) {
        return res.status(400).json({
          message: "Missing required fields",
          details: "All fields except organization name are required"
        });
      }

      // Check if member email already exists
      const existingMember = await storage.getMemberByEmail(email);
      if (existingMember) {
        return res.status(409).json({
          message: "Email already exists",
          details: "A member with this email address already exists"
        });
      }

      // Check if user with email already exists in Clerk
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: "User already exists",
          details: "A user with this email address already exists"
        });
      }

      // Determine account type based on member type
      const isPREA = memberType === "principal_agent";
      const accountType = isPREA ? "PREA" : "Member";

      // Create Clerk user (or use development mode)
      let clerkUserId: string | null = null;
      const isDevelopmentMode = process.env.NODE_ENV === 'development' && !process.env.CLERK_SECRET_KEY;

      if (isDevelopmentMode) {
        // Development mode: Create member without Clerk integration
        console.log(`[DEV MODE] Creating member without Clerk. Account type: ${accountType}`);
        clerkUserId = null; // Will create member without Clerk ID
      } else {
        // Production mode: Require Clerk integration
        try {
          const { clerkClient } = await import('./clerkAuth');
          if (!clerkClient) {
            return res.status(500).json({
              message: "Clerk authentication not configured",
              details: "Cannot create user account without Clerk integration. Set CLERK_SECRET_KEY environment variable."
            });
          }

          // Generate a temporary password for Clerk
          const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';

          // Sanitize username: replace invalid characters with underscores
          // Clerk only allows letters, numbers, hyphens, and underscores
          const sanitizedUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '_');

          const clerkUser = await clerkClient.users.createUser({
            emailAddress: [email],
            username: sanitizedUsername,
            password: tempPassword,
            firstName,
            lastName: surname,
            skipPasswordRequirement: false,
            skipPasswordChecks: true, // Skip Clerk's password validation since we generate our own
            publicMetadata: {
              accountType,
              memberType,
              role: "member"
            },
            privateMetadata: {
              educationLevel: educationLevel || '',
              employmentStatus: employmentStatus || '',
              tempPassword // Store temp password in private metadata for reference
            }
          });

          clerkUserId = clerkUser.id;
          console.log(`Created Clerk user ${clerkUserId} with account type: ${accountType}`);
        } catch (clerkError: any) {
          console.error("Clerk user creation error:", clerkError);
          const errorDetails = clerkError.errors?.[0]?.message || clerkError.message || "Clerk API error";
          console.error("Full Clerk error:", JSON.stringify(clerkError, null, 2));

          // Check if it's a duplicate email error - if so, skip Clerk and create member only
          if (errorDetails.includes('already exists') || errorDetails.includes('duplicate')) {
            console.warn(`Email ${email} already exists in Clerk, creating member without Clerk integration`);
            clerkUserId = null; // Continue without Clerk ID
          } else {
            return res.status(500).json({
              message: "Failed to create user account",
              details: errorDetails
            });
          }
        }
      }

      // Generate membership number
      const { nextMemberNumber } = await import('./services/namingSeries');
      const membershipNumber = await nextMemberNumber('individual');

      // Create User record in database
      let newUser;
      if (isDevelopmentMode) {
        // In development mode without Clerk, create user with hashed password
        const { hashPassword } = await import('./auth');
        const tempPassword = await hashPassword('Welcome123!'); // Temporary password for dev

        const userData = {
          clerkId: null,
          email,
          firstName,
          lastName: surname,
          password: tempPassword,
          role: null,
          status: 'active' as const,
          emailVerified: false
        };

        newUser = await storage.createUser(userData);
        console.log(`[DEV MODE] Created User record ${newUser.id} without Clerk (temp password: Welcome123!)`);
      } else {
        // Production mode with Clerk
        const userData = {
          clerkId: clerkUserId!,
          email,
          firstName,
          lastName: surname,
          password: '', // Empty password for Clerk-managed users
          role: null,
          status: 'active' as const,
          emailVerified: false // Will be verified through Clerk
        };

        newUser = await storage.createUser(userData);
        console.log(`Created User record ${newUser.id} for Clerk user ${clerkUserId}`);
      }

      // Create Member record
      const memberData = {
        userId: newUser.id,
        firstName,
        lastName: surname,
        email,
        dateOfBirth: new Date(dateOfBirth),
        countryOfResidence,
        nationality,
        memberType,
        membershipNumber,
        membershipStatus: 'pending' as const,
        isMatureEntry: educationLevel === 'mature_entry' ? true : false,
        
      };

      const newMember = await storage.createMember(memberData);
      console.log(`Created Member record ${newMember.id} with membership number ${membershipNumber}`);

      // Send welcome email with verification
      try {
        const { sendEmail, generateNewMemberWelcomeEmail } = await import('./services/emailService');
        const fullName = `${firstName} ${surname}`;

        const welcomeEmail = generateNewMemberWelcomeEmail(
          fullName,
          membershipNumber,
          educationLevel,
          employmentStatus
        );

        const welcomeEmailSent = await sendEmail({
          to: email,
          from: 'noreply@estateagentscouncil.org',
          ...welcomeEmail
        });

        console.log(`Welcome email sent to ${email}: ${welcomeEmailSent}`);

        const successMessage = isDevelopmentMode
          ? `[DEV MODE] Member created successfully! ${accountType} account type assigned. Temp password: Welcome123!`
          : `Member created successfully! ${accountType} account has been set up. Verification email has been sent.`;

        res.status(201).json({
          success: true,
          message: successMessage,
          member: {
            id: newMember.id,
            firstName: newMember.firstName,
            surname: newMember.lastName,
            email: newMember.email,
            membershipNumber: newMember.membershipNumber,
            memberType: newMember.memberType,
            membershipStatus: newMember.membershipStatus,
            accountType,
            isPREA,
            emailVerified: false
          },
          emailsSent: {
            welcome: welcomeEmailSent
          },
          ...(isDevelopmentMode && { devMode: true, tempPassword: 'Welcome123!' })
        });

      } catch (emailError: any) {
        console.error("Email sending error:", emailError);

        const errorMessage = isDevelopmentMode
          ? `[DEV MODE] Member created successfully with ${accountType} account type. Temp password: Welcome123!`
          : `Member created successfully with ${accountType} account, but email notification failed to send.`;

        // Member was created successfully but email failed
        res.status(201).json({
          success: true,
          message: errorMessage,
          member: {
            id: newMember.id,
            firstName: newMember.firstName,
            surname: newMember.lastName,
            email: newMember.email,
            membershipNumber: newMember.membershipNumber,
            memberType: newMember.memberType,
            membershipStatus: newMember.membershipStatus,
            accountType,
            isPREA,
            emailVerified: false
          },
          emailError: isDevelopmentMode ? undefined : emailError.message,
          ...(isDevelopmentMode && { devMode: true, tempPassword: 'Welcome123!' })
        });
      }

    } catch (error: any) {
      console.error("Create member with Clerk error:", error);
      res.status(500).json({
        message: "Failed to create member",
        details: error.message || "Unknown error occurred"
      });
    }
  });

  // Get organization's current members for org users
  app.get("/api/organizations/current/members", requireAuth, async (req, res) => {
    try {
      // Find the user's member record to get their organization
      const allMembers = await storage.getAllMembers();
      const userMember = allMembers.find(m => m.userId === req.user?.id);
      
      if (!userMember?.organizationId) {
        return res.status(400).json({
          error: "User must be associated with an organization to view members"
        });
      }

      const organizationId = userMember.organizationId;
      
      // Get all members for this organization
      const members = allMembers.filter(m => m.organizationId === organizationId);
      res.json(members);
    } catch (error) {
      console.error('Error fetching organization members:', error);
      res.status(500).json({
        error: "Failed to fetch organization members"
      });
    }
  });

  // Organization-scoped bulk member import for org users
  app.post("/api/organizations/current/members/bulk-import", requireAuth, upload.single('csvFile'), async (req, res) => {
    try {
      // Find the user's member record to get their organization
      const allMembers = await storage.getAllMembers();
      const userMember = allMembers.find(m => m.userId === req.user?.id);
      
      if (!userMember?.organizationId) {
        return res.status(400).json({
          success: false,
          message: "User must be associated with an organization to import members",
          errors: [{ row: 0, error: "No organization association found" }]
        });
      }

      const organizationId = userMember.organizationId;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No CSV file uploaded",
          errors: [{ row: 0, error: "CSV file is required" }]
        });
      }

      const csvContent = req.file.buffer.toString('utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim().length > 0);
      
      if (lines.length < 2) {
        return res.status(400).json({
          success: false,
          message: "CSV file must contain at least a header row and one data row",
          errors: [{ row: 0, error: "CSV file is empty or contains only headers" }]
        });
      }

      const results = {
        success: true,
        processed: lines.length - 1,
        succeeded: 0,
        failed: 0,
        errors: [] as Array<{ row: number; error: string }>
      };

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['firstname', 'lastname', 'email', 'phone', 'membershiptype'];
      
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required headers: ${missingHeaders.join(', ')}`,
          errors: [{ row: 0, error: `Required headers: ${requiredHeaders.join(', ')}` }]
        });
      }

      // Process each row
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        try {
          const rowData: any = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });

          // Validate required fields
          if (!rowData.firstname || !rowData.lastname || !rowData.email) {
            results.failed++;
            results.errors.push({ 
              row: i, 
              error: `Missing required data: ${!rowData.firstname ? 'firstname ' : ''}${!rowData.lastname ? 'lastname ' : ''}${!rowData.email ? 'email' : ''}`.trim() 
            });
            continue;
          }

          // Generate membership number
          const membershipNumber = await nextMemberNumber('individual');
          
          const memberData = {
            firstName: rowData.firstname,
            lastName: rowData.lastname,
            email: rowData.email,
            phone: rowData.phone || '',
            memberType: rowData.membershiptype as any,
            membershipNumber,
            organizationId, // Force organization association
            membershipStatus: 'active' as const,
            registrationDate: new Date(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          };

          // Create member
          await storage.createMember(memberData);

          // Create user account for the member
          const { generateVerificationToken } = await import('./utils/applicantUtils');
          const tempPassword = generateVerificationToken(); // Generate temporary password
          
          const userData = {
            email: rowData.email,
            password: await hashPassword(tempPassword),
            firstName: rowData.firstname,
            lastName: rowData.lastname,
            phone: rowData.phone || '',
            role: null, // Members don't have system roles - they access through different authentication
            status: 'active' as const,
            emailVerified: false,
            passwordChangedAt: new Date(),
            organizationId // Associate user with organization
          };

          try {
            await storage.createUser(userData);
          } catch (userError: any) {
            console.warn(`Failed to create user account for ${rowData.email}:`, userError.message);
            // Continue - member was created successfully even if user creation failed
          }

          // Send welcome email
          try {
            // TODO: Implement sendMemberWelcomeEmail function in emailService
            console.log(`Welcome email would be sent to ${rowData.email} with member number ${membershipNumber}`);
          } catch (emailError: any) {
            console.warn(`Failed to send welcome email to ${rowData.email}:`, emailError.message);
            // Continue - member and user were created successfully even if email failed
          }

          results.succeeded++;
        } catch (error: any) {
          console.error(`Error processing row ${i}:`, error);
          results.failed++;
          results.errors.push({ 
            row: i, 
            error: error.message || 'Unknown error occurred' 
          });
        }
      }

      // Final response
      results.success = results.succeeded > 0;
      res.json(results);

    } catch (error) {
      console.error('Bulk import error:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error during bulk import",
        errors: [{ row: 0, error: "Server error occurred" }]
      });
    }
  });

  // Admin-scoped bulk member import (original)
  app.post("/api/admin/members/bulk-import", requireAuth, authorizeRole(STAFF_ROLES), upload.single('csvFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No CSV file uploaded",
          errors: [{ row: 0, error: "CSV file is required" }]
        });
      }

      const csvContent = req.file.buffer.toString('utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim().length > 0);
      
      if (lines.length < 2) {
        return res.status(400).json({
          success: false,
          message: "CSV file must contain at least a header row and one data row",
          errors: [{ row: 0, error: "CSV file is empty or contains only headers" }]
        });
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredFields = ['firstname', 'lastname', 'email', 'dateofbirth', 'countryofresidence', 'nationality', 'membertype', 'educationlevel', 'employmentstatus'];
      
      // Validate headers
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Missing required columns in CSV",
          errors: [{ row: 0, error: `Missing required columns: ${missingFields.join(', ')}` }]
        });
      }

      const results = {
        success: true,
        processed: 0,
        succeeded: 0,
        failed: 0,
        errors: [] as Array<{ row: number; field?: string; error: string; data?: any }>,
        members: [] as Array<{ firstName: string; lastName: string; email: string; membershipNumber: string }>
      };

      // Process each data row
      for (let i = 1; i < lines.length; i++) {
        const rowNumber = i + 1;
        const values = lines[i].split(',').map(v => v.trim());
        results.processed++;

        try {
          // Parse CSV row into object
          const rowData: any = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });

          // Validate required fields for this row
          const missingRowFields = requiredFields.filter(field => !rowData[field] || rowData[field].trim() === '');
          if (missingRowFields.length > 0) {
            results.errors.push({
              row: rowNumber,
              error: `Missing required fields: ${missingRowFields.join(', ')}`,
              data: rowData
            });
            results.failed++;
            continue;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(rowData.email)) {
            results.errors.push({
              row: rowNumber,
              field: 'email',
              error: 'Invalid email format',
              data: rowData
            });
            results.failed++;
            continue;
          }

          // Check for duplicate email
          const existingMember = await storage.getMemberByEmail(rowData.email);
          if (existingMember) {
            results.errors.push({
              row: rowNumber,
              field: 'email',
              error: 'Email already exists in system',
              data: rowData
            });
            results.failed++;
            continue;
          }

          // Validate date of birth
          const birthDate = new Date(rowData.dateofbirth);
          if (isNaN(birthDate.getTime())) {
            results.errors.push({
              row: rowNumber,
              field: 'dateOfBirth',
              error: 'Invalid date format. Use YYYY-MM-DD',
              data: rowData
            });
            results.failed++;
            continue;
          }

          // Validate age (18-80)
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18 || age > 80) {
            results.errors.push({
              row: rowNumber,
              field: 'dateOfBirth',
              error: 'Age must be between 18 and 80 years',
              data: rowData
            });
            results.failed++;
            continue;
          }

          // Validate member type
          const validMemberTypes = ['real_estate_agent', 'property_manager', 'principal_agent', 'negotiator'];
          if (!validMemberTypes.includes(rowData.membertype)) {
            results.errors.push({
              row: rowNumber,
              field: 'memberType',
              error: `Invalid member type. Must be one of: ${validMemberTypes.join(', ')}`,
              data: rowData
            });
            results.failed++;
            continue;
          }

          // Validate education level
          const validEducationLevels = ['normal_entry', 'mature_entry'];
          if (!validEducationLevels.includes(rowData.educationlevel)) {
            results.errors.push({
              row: rowNumber,
              field: 'educationLevel',
              error: `Invalid education level. Must be one of: ${validEducationLevels.join(', ')}`,
              data: rowData
            });
            results.failed++;
            continue;
          }

          // Validate employment status
          const validEmploymentStatuses = ['employed', 'self_employed'];
          if (!validEmploymentStatuses.includes(rowData.employmentstatus)) {
            results.errors.push({
              row: rowNumber,
              field: 'employmentStatus',
              error: `Invalid employment status. Must be one of: ${validEmploymentStatuses.join(', ')}`,
              data: rowData
            });
            results.failed++;
            continue;
          }

          // Validate mature entry age requirement
          if (rowData.educationlevel === 'mature_entry' && age < 27) {
            results.errors.push({
              row: rowNumber,
              field: 'educationLevel',
              error: 'Mature Entry requires age 27 years and above',
              data: rowData
            });
            results.failed++;
            continue;
          }

          // Validate organization name if employed
          if (rowData.employmentstatus === 'employed' && (!rowData.organizationname || rowData.organizationname.trim() === '')) {
            results.errors.push({
              row: rowNumber,
              field: 'organizationName',
              error: 'Organization name is required when employment status is employed',
              data: rowData
            });
            results.failed++;
            continue;
          }

          // Generate membership number
          const membershipNumber = await nextMemberNumber('individual');

          // Prepare member data
          const memberData = {
            firstName: rowData.firstname,
            lastName: rowData.lastname,
            email: rowData.email,
            dateOfBirth: birthDate,
            countryOfResidence: rowData.countryofresidence,
            nationality: rowData.nationality,
            memberType: rowData.membertype,
            membershipNumber,
            membershipStatus: 'active' as const, // Bulk imported members are active immediately
            isMatureEntry: rowData.educationlevel === 'mature_entry',
            
          };

          // Create the member
          const newMember = await storage.createMember(memberData);

          // Create user account for the member
          const { generateVerificationToken } = await import('./utils/applicantUtils');
          const tempPassword = generateVerificationToken(); // Generate temporary password
          
          const userData = {
            email: rowData.email,
            password: await hashPassword(tempPassword),
            firstName: rowData.firstname,
            lastName: rowData.lastname,
            phone: '', // Optional for bulk import
            role: null, // Members don't have system roles - they access through different authentication
            status: 'active' as const,
            emailVerified: false,
            passwordChangedAt: new Date()
          };

          try {
            await storage.createUser(userData);
          } catch (userError: any) {
            console.error(`Failed to create user account for ${rowData.email}:`, userError);
            // Continue with member creation even if user account creation fails
          }

          // Send welcome email with login credentials
          try {
            const { sendEmail, generateApprovedMemberWelcomeEmail } = await import('./services/emailService');
            const fullName = `${rowData.firstname} ${rowData.lastname}`;
            const baseUrl = 'https://mms.estateagentscouncil.org';
            
            // Generate password reset token for first login
            const passwordResetToken = generateVerificationToken();
            
            const welcomeEmail = generateApprovedMemberWelcomeEmail(
              fullName,
              rowData.email,
              membershipNumber,
              passwordResetToken,
              baseUrl
            );
            
            const emailSent = await sendEmail({
              to: rowData.email,
              from: 'noreply@estateagentscouncil.org',
              ...welcomeEmail
            });

            console.log(`Welcome email sent to ${fullName} (${rowData.email}): ${emailSent}`);
          } catch (emailError: any) {
            console.error(`Failed to send welcome email to ${rowData.email}:`, emailError);
            // Continue even if email fails
          }

          results.members.push({
            firstName: newMember.firstName,
            lastName: newMember.lastName,
            email: newMember.email,
            membershipNumber: newMember.membershipNumber!
          });
          results.succeeded++;

        } catch (memberError: any) {
          console.error(`Failed to create member for row ${rowNumber}:`, memberError);
          results.errors.push({
            row: rowNumber,
            error: `Failed to create member: ${memberError.message}`,
            data: values
          });
          results.failed++;
        }
      }

      // Set overall success based on results
      results.success = results.succeeded > 0;

      res.status(200).json(results);

    } catch (error: any) {
      console.error("Bulk import error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process bulk import",
        processed: 0,
        succeeded: 0,
        failed: 0,
        errors: [{ row: 0, error: error.message || "Unknown error occurred" }]
      });
    }
  });

  app.get("/api/admin/organizations", requireAuth, async (req, res) => {
    try {
      const allOrganizations = await storage.getAllOrganizations();
      res.json(allOrganizations);
    } catch (error: any) {
      console.error("Admin organizations fetch error:", error);
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  app.get("/api/admin/applicants", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const allApplicants = await storage.listApplicants();
      res.json(allApplicants);
    } catch (error: any) {
      console.error("Admin applicants fetch error:", error);
      res.status(500).json({ message: "Failed to fetch applicants" });
    }
  });

  app.get("/api/admin/organization-applicants", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const allOrgApplicants = await storage.listOrganizationApplicants();
      res.json(allOrgApplicants);
    } catch (error: any) {
      console.error("Admin organization applicants fetch error:", error);
      res.status(500).json({ message: "Failed to fetch organization applicants" });
    }
  });

  app.put("/api/admin/applicants/:id", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Get the current applicant to check status change
      const currentApplicant = await storage.getApplicant(id);
      if (!currentApplicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      // Update the applicant
      const applicant = await storage.updateApplicant(id, updates);
      
      // Check if status was changed to 'approved' - trigger member conversion
      if (updates.status === 'approved' && currentApplicant.status !== 'approved') {
        console.log(`Converting approved applicant ${applicant.applicantId} to member...`);
        
        try {
          // Generate password reset token instead of plaintext password
          const passwordResetToken = randomBytes(32).toString('hex');
          const passwordResetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
          const hashedPassword = await hashPassword('temp_' + randomBytes(8).toString('hex')); // Temporary, will be reset
          
          // Generate membership number
          const membershipNumber = await nextMemberNumber('individual');
          
          // Create user account
          const newUser = await storage.createUser({
            email: applicant.email,
            password: hashedPassword,
            firstName: applicant.firstName,
            lastName: applicant.surname,
            role: 'member_manager', // Set as member role
            status: 'active',
            emailVerified: applicant.emailVerified,
            passwordResetToken: passwordResetToken,
            passwordResetExpires: passwordResetExpires
          });
          
          // Create member record
          const newMember = await storage.createMember({
            userId: newUser.id,
            firstName: applicant.firstName,
            lastName: applicant.surname,
            email: applicant.email,
            memberType: 'real_estate_agent', // Default type, can be customized
            membershipStatus: 'active',
            joinedDate: new Date(),
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
            
          });
          
          // Send welcome email with credentials
          const { sendEmail } = await import('./services/emailService');
          const { generateApprovedMemberWelcomeEmail } = await import('./services/emailService');
          
          const welcomeEmail = generateApprovedMemberWelcomeEmail(
            `${applicant.firstName} ${applicant.surname}`,
            applicant.email,
            newMember.membershipNumber || 'Pending',
            passwordResetToken,
            'https://mms.estateagentscouncil.org'
          );
          
          const emailSent = await sendEmail({
            to: applicant.email,
            from: 'noreply@estateagentscouncil.org',
            ...welcomeEmail
          });
          
          console.log(`Member ${membershipNumber} created successfully. Welcome email sent: ${emailSent}`);
          
          res.json({
            ...applicant,
            memberCreated: true,
            membershipNumber: newMember.membershipNumber,
            userId: newUser.id,
            memberId: newMember.id,
            emailSent: emailSent
          });
        } catch (memberCreationError: any) {
          console.error("Member creation error:", memberCreationError);
          // Applicant status was updated but member creation failed
          res.json({
            ...applicant,
            memberCreated: false,
            error: "Applicant approved but member account creation failed: " + memberCreationError.message
          });
        }
      } else {
        // Normal status update without member conversion
        res.json(applicant);
      }
    } catch (error: any) {
      console.error("Update applicant error:", error);
      res.status(500).json({ message: "Failed to update applicant" });
    }
  });

  app.put("/api/admin/organization-applicants/:id", requireAuth, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const orgApplicant = await storage.updateOrganizationApplicant(id, updates);
      res.json(orgApplicant);
    } catch (error: any) {
      console.error("Update organization applicant error:", error);
      res.status(500).json({ message: "Failed to update organization applicant" });
    }
  });

  app.get("/api/admin/applications", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getPendingApplications();
      res.json(applications);
    } catch (error: any) {
      console.error("Admin applications fetch error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Member Portal Routes
  app.get("/api/members/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // First try to get member by userId
      let member = await storage.getMemberByUserId(userId);
      
      // If no member found by userId, try by email as fallback
      if (!member && req.user?.email) {
        member = await storage.getMemberByEmail(req.user.email);
      }
      
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      res.json(member);
    } catch (error: any) {
      console.error("Member profile fetch error:", error);
      res.status(500).json({ message: "Failed to fetch member profile" });
    }
  });

  app.put("/api/members/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const updates = req.body;
      const member = await storage.getMemberByUserId(userId);
      
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      await storage.updateMember(member.id, updates);
      res.json({ message: "Profile updated successfully" });
    } catch (error: any) {
      console.error("Member profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Update professional details
  app.put("/api/members/professional", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const member = await storage.getMemberByUserId(userId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      const updates = {
        phone: req.body.phone,
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
        nationalId: req.body.nationalId,
        memberType: req.body.memberType
      };
      
      await storage.updateMember(member.id, updates);
      res.json({ message: "Professional details updated successfully" });
    } catch (error: any) {
      console.error("Professional details update error:", error);
      res.status(500).json({ message: "Failed to update professional details" });
    }
  });

  // Change password
  app.put("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      const isValid = await storage.verifyPassword(user.email, currentPassword);
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Update password
      await storage.updateUserPassword(req.user!.id, newPassword);
      
      res.json({ message: "Password updated successfully" });
    } catch (error: any) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  app.get("/api/members/documents", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const member = await storage.getMemberByUserId(userId);
      
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      const documents = await storage.getDocumentsByMember(member.id);
      res.json(documents);
    } catch (error: any) {
      console.error("Member documents fetch error:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/members/payments", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const member = await storage.getMemberByUserId(userId);
      
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      const payments = await storage.getPaymentsByMember(member.id);
      res.json(payments);
    } catch (error: any) {
      console.error("Member payments fetch error:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Organization Portal Routes
  app.get("/api/organization/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const member = await storage.getMemberByUserId(userId);
      
      if (!member || !member.organizationId) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      const organization = await storage.getOrganization(member.organizationId);
      res.json(organization);
    } catch (error: any) {
      console.error("Organization profile fetch error:", error);
      res.status(500).json({ message: "Failed to fetch organization profile" });
    }
  });

  app.put("/api/organization/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const updates = req.body;
      const member = await storage.getMemberByUserId(userId);
      
      if (!member || !member.organizationId) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      await storage.updateOrganization(member.organizationId, updates);
      res.json({ message: "Organization profile updated successfully" });
    } catch (error: any) {
      console.error("Organization profile update error:", error);
      res.status(500).json({ message: "Failed to update organization profile" });
    }
  });

  app.get("/api/organization/members", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const member = await storage.getMemberByUserId(userId);
      
      if (!member || !member.organizationId) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      const allMembers = await storage.getAllMembers();
      const orgMembers = allMembers.filter(m => m.organizationId === member.organizationId);
      res.json(orgMembers);
    } catch (error: any) {
      console.error("Organization members fetch error:", error);
      res.status(500).json({ message: "Failed to fetch organization members" });
    }
  });

  // === ENHANCED USER MANAGEMENT ROUTES ===
  
  // Get all users (Admin only)
  app.get("/api/admin/users", requireAuth, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get users by role
  app.get("/api/admin/users/role/:role", requireAuth, async (req, res) => {
    try {
      const { role } = req.params;
      const users = await storage.getUsersByRole(role);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update user
  app.put("/api/admin/users/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Lock user account
  app.post("/api/admin/users/:id/lock", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { lockedUntil } = req.body;
      const user = await storage.lockUser(id, new Date(lockedUntil));
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Unlock user account
  app.post("/api/admin/users/:id/unlock", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.unlockUser(id);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Send welcome emails to multiple users
  app.post("/api/admin/users/welcome-emails", requireAuth, async (req, res) => {
    try {
      const { userIds } = req.body;
      
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "User IDs array is required" });
      }

      // Get user details for email sending
      const users = await Promise.all(
        userIds.map(id => storage.getUser(id))
      );

      const validUsers = users.filter(user => user !== undefined);

      // Simulate email sending (replace with actual email service)
      console.log(`Sending welcome emails to ${validUsers.length} users:`, 
        validUsers.map(u => u!.email)
      );

      // In a real implementation, you would integrate with an email service like:
      // - SendGrid
      // - AWS SES  
      // - Nodemailer
      // For now, we'll simulate success

      res.json({ 
        success: true, 
        message: `Welcome emails queued for ${validUsers.length} users`,
        emailsSent: validUsers.length
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Send password reset emails to multiple users
  app.post("/api/admin/users/password-reset-emails", requireAuth, async (req, res) => {
    try {
      const { userIds } = req.body;
      
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "User IDs array is required" });
      }

      // Get user details for email sending
      const users = await Promise.all(
        userIds.map(id => storage.getUser(id))
      );

      const validUsers = users.filter(user => user !== undefined);

      // Simulate password reset email sending
      console.log(`Sending password reset emails to ${validUsers.length} users:`, 
        validUsers.map(u => u!.email)
      );

      // In a real implementation, you would:
      // 1. Generate secure reset tokens
      // 2. Store them with expiration dates
      // 3. Send emails with reset links
      // For now, we'll simulate success

      res.json({ 
        success: true, 
        message: `Password reset emails queued for ${validUsers.length} users`,
        emailsSent: validUsers.length
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === ENHANCED PAYMENT ROUTES ===
  
  // Get all payments (Admin)
  app.get("/api/admin/payments", authorizeRole(['admin', 'accountant', 'super_admin', 'staff']), async (req, res) => {
    try {
      const validatedQuery = paymentsQuerySchema.safeParse(req.query);
      if (!validatedQuery.success) {
        return res.status(400).json({ 
          message: "Invalid query parameters", 
          errors: validatedQuery.error.errors 
        });
      }
      
      const result = await storage.listPayments(validatedQuery.data);
      res.json(result.payments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get finance statistics (Admin)
  app.get("/api/admin/finance/stats", authorizeRole(FINANCE_ROLES), async (req, res) => {
    try {
      const validatedQuery = financeStatsQuerySchema.safeParse(req.query);
      if (!validatedQuery.success) {
        return res.status(400).json({
          message: "Invalid query parameters",
          errors: validatedQuery.error.errors
        });
      }

      const stats = await storage.getFinanceStats(validatedQuery.data);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get recent payment transactions (Admin)
  app.get("/api/admin/payments/recent", authorizeRole(FINANCE_ROLES), async (req, res) => {
    try {
      const payments = await storage.getRecentPayments(10); // Get last 10
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update payment status (Admin/Accountant)
  app.put("/api/admin/payments/:id/status", authorizeRole(FINANCE_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const payment = await storage.updatePayment(id, { status });
      res.json(payment);
    } catch (error: any) {
      console.error("Update payment status error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Record manual payment (Admin/Accountant)
  app.post("/api/admin/payments/record", authorizeRole(FINANCE_ROLES), async (req, res) => {
    try {
      const { amount, purpose, paymentMethod, reference, description, paidAt, memberId, organizationId } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Valid amount is required" });
      }

      if (!purpose) {
        return res.status(400).json({ message: "Payment purpose is required" });
      }

      if (!paymentMethod) {
        return res.status(400).json({ message: "Payment method is required" });
      }

      const payment = await storage.createPayment({
        amount: amount.toString(),
        purpose,
        paymentMethod,
        reference,
        description,
        status: 'completed',
        paidAt: paidAt ? new Date(paidAt) : new Date(),
        memberId,
        organizationId
      });

      res.json(payment);
    } catch (error: any) {
      console.error("Record payment error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // === SYSTEM SETTINGS ROUTES ===
  
  // Get all system settings (Admin)
  app.get("/api/admin/settings", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get a specific setting (Admin)
  app.get("/api/admin/settings/:key", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const { key } = req.params;
      
      if (!key || key.trim() === '') {
        return res.status(400).json({ message: "Setting key is required" });
      }
      
      const setting = await storage.getSetting(key);
      
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update multiple settings (Admin)
  app.put("/api/admin/settings", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const validatedBody = settingsUpdateSchema.safeParse(req.body);
      if (!validatedBody.success) {
        return res.status(400).json({ 
          message: "Invalid request body", 
          errors: validatedBody.error.errors 
        });
      }
      
      const { settings } = validatedBody.data;
      const updatedSettings = await storage.updateSettings(settings);
      res.json(updatedSettings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === ID FORMAT MIGRATION ROUTES ===
  
  // Import migration functions
  const { previewIdFormatMigration, executeIdFormatMigration, getMigrationStatus } = await import('./services/idMigration');

  // Get migration status (Admin)
  app.get("/api/admin/migration/id-format/status", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const status = await getMigrationStatus();
      res.json(status);
    } catch (error: any) {
      console.error("Migration status check error:", error);
      res.status(500).json({ message: "Failed to check migration status" });
    }
  });

  // Preview ID format migration (Admin) - Shows what would change without executing
  app.get("/api/admin/migration/id-format/preview", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const preview = await previewIdFormatMigration();
      res.json(preview);
    } catch (error: any) {
      console.error("Migration preview error:", error);
      res.status(500).json({ message: "Failed to generate migration preview" });
    }
  });

  // Execute ID format migration (Admin)
  app.post("/api/admin/migration/id-format/execute", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      console.log("🚀 Starting ID format migration execution by admin:", req.user?.email);
      const result = await executeIdFormatMigration();
      
      if (result.success) {
        console.log("✅ ID format migration completed successfully");
        res.json({
          success: true,
          message: `Migration completed! Updated ${result.membersUpdated} members and ${result.organizationsUpdated} organizations`,
          membersUpdated: result.membersUpdated,
          organizationsUpdated: result.organizationsUpdated
        });
      } else {
        console.error("❌ ID format migration failed:", result.error);
        res.status(500).json({
          success: false,
          message: "Migration failed",
          error: result.error
        });
      }
    } catch (error: any) {
      console.error("Migration execution error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to execute migration",
        error: error.message
      });
    }
  });

  // Update a single setting (Admin)
  app.put("/api/admin/settings/:key", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const { key } = req.params;
      
      if (!key || key.trim() === '') {
        return res.status(400).json({ message: "Setting key is required" });
      }
      
      const validatedBody = singleSettingUpdateSchema.safeParse(req.body);
      if (!validatedBody.success) {
        return res.status(400).json({ 
          message: "Invalid request body", 
          errors: validatedBody.error.errors 
        });
      }
      
      const { value, description } = validatedBody.data as { value: string; description?: string };
      const updatedSetting = await storage.updateSetting(key, value, description, req.user?.id);
      res.json(updatedSetting);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get payments by date range
  app.get("/api/payments/range", requireAuth, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const payments = await storage.getPaymentsByDateRange(
        new Date(startDate as string), 
        new Date(endDate as string)
      );
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get payments by method
  app.get("/api/payments/method/:method", requireAuth, async (req, res) => {
    try {
      const { method } = req.params;
      const payments = await storage.getPaymentsByMethod(method);
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Process refund
  app.post("/api/payments/:id/refund", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { refundAmount, reason } = req.body;
      const payment = await storage.processRefund(id, refundAmount, reason);
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Payment installments
  app.get("/api/payments/:id/installments", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const installments = await storage.getInstallmentsByPayment(id);
      res.json(installments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === ENHANCED APPLICATION MANAGEMENT ROUTES ===
  
  // Get all applications (Admin)
  app.get("/api/admin/applications", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Organization Applications endpoints
  app.get("/api/organization-applications", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getAllOrganizationApplications();
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/organization-applications/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getOrganizationApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Organization application not found" });
      }
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/organization-applications/:id/review", requireAuth, async (req, res) => {
    try {
      console.log("Organization review request:", { id: req.params.id, action: req.body.action, userId: req.user?.id });
      
      const { id } = req.params;
      const { action, notes } = req.body;
      
      // Validate action - accept both forms for flexibility
      if (!['approve', 'approved', 'reject', 'rejected'].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'approve', 'approved', 'reject', or 'rejected'" });
      }
      
      // Update application status based on action
      const isApprove = ['approve', 'approved'].includes(action);
      const updates: any = {
        status: isApprove ? 'accepted' : 'rejected',
        // reviewNotes: notes,
        // reviewedBy: req.user?.id,
        updatedAt: new Date()
      };
      
      if (isApprove) {
        // updates.approvedAt = new Date();
      } else {
        // updates.rejectedAt = new Date();
        // if (notes) {
        //   updates.rejectionReason = notes;
        // }
      }

      const updatedApplication = await storage.updateOrganizationApplication(id, updates);
      res.json(updatedApplication);
    } catch (error: any) {
      console.error("Organization application review error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get applications by status
  app.get("/api/applications/status/:status", requireAuth, async (req, res) => {
    try {
      const { status } = req.params;
      const applications = await storage.getApplicationsByStatus(status);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get applications by stage
  app.get("/api/applications/stage/:stage", requireAuth, async (req, res) => {
    try {
      const { stage } = req.params;
      const applications = await storage.getApplicationsByStage(stage);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Assign application reviewer
  app.post("/api/applications/:id/assign", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { reviewerId } = req.body;
      const application = await storage.assignApplicationReviewer(id, reviewerId);
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Review application (approve/reject)
  app.post("/api/applications/:id/review", requireAuth, async (req, res) => {
    try {
      console.log("Review application request:", { id: req.params.id, action: req.body.action, userId: req.user?.id });
      
      const { id } = req.params;
      const { action, notes } = req.body;
      
      // Validate action - accept both forms for flexibility
      if (!['approve', 'approved', 'reject', 'rejected'].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'approve', 'approved', 'reject', or 'rejected'" });
      }
      
      // Update application status based on action
      const isApprove = ['approve', 'approved'].includes(action);
      const updates: any = {
        status: isApprove ? 'accepted' : 'rejected',
        reviewNotes: notes,
        reviewedBy: req.user?.id,
        reviewStartedAt: new Date()
      };
      
      if (isApprove) {
        updates.approvedAt = new Date();
      } else {
        updates.rejectedAt = new Date();
        if (notes) {
          updates.rejectionReason = notes;
        }
      }
      
      const updatedApplication = await storage.updateMemberApplication(id, updates);
      
      res.json(updatedApplication);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Application workflow routes
  app.get("/api/applications/:id/workflows", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const workflows = await storage.getWorkflowsByApplication(id);
      res.json(workflows);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/workflows/stage/:stage", requireAuth, async (req, res) => {
    try {
      const { stage } = req.params;
      const workflows = await storage.getWorkflowsByStage(stage);
      res.json(workflows);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/workflows/assignee/:userId", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const workflows = await storage.getWorkflowsByAssignee(userId);
      res.json(workflows);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === USER PERMISSIONS ROUTES ===
  
  // Get user permissions
  app.get("/api/users/:id/permissions", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const permissions = await storage.getUserPermissions(id);
      res.json(permissions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Check specific permission
  app.get("/api/users/:id/permissions/check", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { permission, resource } = req.query;
      const hasPermission = await storage.checkUserPermission(
        id, 
        permission as string, 
        resource as string
      );
      res.json({ hasPermission });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === NOTIFICATIONS ROUTES ===
  
  // Get user notifications
  app.get("/api/notifications/user/:userId", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get member notifications
  app.get("/api/notifications/member/:memberId", requireAuth, async (req, res) => {
    try {
      const { memberId } = req.params;
      const notifications = await storage.getMemberNotifications(memberId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mark notification as opened
  app.post("/api/notifications/:id/opened", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.markNotificationOpened(id);
      res.json(notification);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get pending notifications (Admin)
  app.get("/api/admin/notifications/pending", requireAuth, async (req, res) => {
    try {
      const notifications = await storage.getPendingNotifications();
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === AUDIT LOGS ROUTES ===
  
  // Get audit logs with filters
  app.get("/api/admin/audit-logs", requireAuth, async (req, res) => {
    try {
      const { userId, resource, action } = req.query;
      const logs = await storage.getAuditLogs({
        userId: userId as string,
        resource: resource as string,
        action: action as string
      });
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === SESSION MANAGEMENT ROUTES ===
  
  // Get user active sessions
  app.get("/api/users/:id/sessions", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const sessions = await storage.getUserSessions(id);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Deactivate session
  app.post("/api/sessions/:id/deactivate", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.deactivateSession(id);
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cleanup expired sessions (Admin)
  app.post("/api/admin/sessions/cleanup", requireAuth, async (req, res) => {
    try {
      const count = await storage.cleanupExpiredSessions();
      res.json({ cleanedSessions: count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Register payment routes
  registerPaymentRoutes(app);

  // === NEW SECURE UPLOAD ROUTES ===
  
  // Initialize ObjectStorageService
  const objectStorageService = new ObjectStorageService();

  /**
   * POST /api/uploads/presign
   * Secure presign endpoint - validates docType/size/MIME, returns constrained presigned URL + server-generated key
   */
  app.post("/api/uploads/presign", requireUserOrApplicantAuth, async (req, res) => {
    try {
      const { docType, fileSize, mimeType, fileName, applicationId } = req.body;
      const userId = req.authUserId || 'unknown';
      
      // Validate required parameters
      if (!docType || !fileSize || !mimeType || !fileName) {
        await logSecurityEvent('PRESIGN_VALIDATION_FAILED', userId, applicationId || 'unknown', 
          { reason: 'Missing required parameters', docType, fileName }, false);
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Document type, file size, MIME type, and filename are required',
          code: 'MISSING_PRESIGN_PARAMETERS'
        });
      }

      // CRITICAL SECURITY CHECK: Validate application authorization
      if (applicationId) {
        const authResult = await checkApplicationAuthorization(userId, applicationId);
        if (!authResult.authorized) {
          await logSecurityEvent('PRESIGN_AUTHORIZATION_DENIED', userId, applicationId, 
            { reason: authResult.reason, docType, fileName }, false);
          return res.status(403).json({
            type: 'https://tools.ietf.org/html/rfc7807',
            title: 'Forbidden',
            status: 403,
            detail: authResult.reason,
            code: 'INSUFFICIENT_PERMISSIONS'
          });
        }
        console.log(`Authorization granted for presign: User ${userId} can upload ${docType} to application ${applicationId}`);
      }

      // Validate document type against config
      const typeConfig = DOCUMENT_TYPE_CONFIG[docType as DocumentType];
      if (!typeConfig) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Invalid document type',
          code: 'INVALID_DOCUMENT_TYPE'
        });
      }

      // Validate file size
      if (fileSize > typeConfig.maxSize) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: `File size (${(fileSize / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size of ${(typeConfig.maxSize / 1024 / 1024).toFixed(1)}MB for ${typeConfig.label}`,
          code: 'FILE_SIZE_EXCEEDED'
        });
      }

      // Validate MIME type
      if (!typeConfig.allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: `File type '${mimeType}' not allowed for ${typeConfig.label}. Allowed types: ${typeConfig.allowedMimeTypes.join(', ')}`,
          code: 'INVALID_FILE_TYPE'
        });
      }

      // Validate file extension
      const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
      if (!typeConfig.allowedExtensions.includes(extension)) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: `File extension '${extension}' not allowed for ${typeConfig.label}. Allowed extensions: ${typeConfig.allowedExtensions.join(', ')}`,
          code: 'INVALID_FILE_EXTENSION'
        });
      }

      // Generate server-controlled file key (never accept client-provided keys)
      const fileKey = `uploads/${docType}/${Date.now()}-${randomUUID()}${extension}`;
      
      // Get constrained presigned URL
      const privateObjectDir = objectStorageService.getPrivateObjectDir();
      if (!privateObjectDir) {
        throw new Error("Object storage upload is not configured. PRIVATE_OBJECT_DIR environment variable is missing.");
      }

      const fullPath = `${privateObjectDir}/${fileKey}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      
      // Create constrained presigned URL
      const signedURL = await signObjectURL({
        bucketName,
        objectName,
        method: "PUT",
        ttlSec: 900 // 15 minutes
      });

      // Log successful presign operation
      await logSecurityEvent('PRESIGN_SUCCESS', userId, applicationId || 'unknown', 
        { docType, fileName, fileKey }, true);

      res.json({
        uploadUrl: signedURL,
        fileKey,
        expiresIn: 900,
        maxSize: typeConfig.maxSize,
        allowedMimeTypes: typeConfig.allowedMimeTypes,
        message: 'Presigned URL generated successfully. Upload your file then call /api/uploads/finalize to complete the process.'
      });

    } catch (error: any) {
      console.error('Presign error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to generate presigned URL',
        code: 'PRESIGN_ERROR'
      });
    }
  });

  // Simple rate limiter for public uploads (in-memory, per IP)
  const uploadRateLimit = new Map<string, { count: number; resetTime: number }>();
  const MAX_UPLOADS_PER_HOUR = 10;
  const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

  function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const current = uploadRateLimit.get(ip);
    
    if (!current || now > current.resetTime) {
      uploadRateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      return true;
    }
    
    if (current.count >= MAX_UPLOADS_PER_HOUR) {
      return false;
    }
    
    current.count++;
    return true;
  }

  /**
   * POST /api/uploads/presign-public
   * Unauthenticated presign endpoint for application document uploads
   * Restricted to application document types with strict validation
   */
  app.post("/api/uploads/presign-public", async (req, res) => {
    try {
      const { docType, fileSize, mimeType, fileName } = req.body;
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      
      // Rate limiting check
      if (!checkRateLimit(clientIP)) {
        return res.status(429).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Too Many Requests',
          status: 429,
          detail: 'Upload rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        });
      }
      
      // Validate required parameters
      if (!docType || !fileSize || !mimeType || !fileName) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Document type, file size, MIME type, and filename are required',
          code: 'MISSING_PRESIGN_PARAMETERS'
        });
      }

      // SECURITY: Only allow application document types
      const allowedAppDocTypes = ['id_or_passport', 'birth_certificate', 'o_level_cert', 'a_level_cert', 'equivalent_cert'];
      if (!allowedAppDocTypes.includes(docType)) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: `Document type '${docType}' not allowed for public uploads. Allowed types: ${allowedAppDocTypes.join(', ')}`,
          code: 'INVALID_DOCUMENT_TYPE'
        });
      }

      // Validate document type against config
      const typeConfig = DOCUMENT_TYPE_CONFIG[docType as DocumentType];
      if (!typeConfig) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Invalid document type configuration',
          code: 'INVALID_DOCUMENT_TYPE'
        });
      }

      // Validate file size
      if (fileSize > typeConfig.maxSize) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: `File size (${(fileSize / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size of ${(typeConfig.maxSize / 1024 / 1024).toFixed(1)}MB for ${typeConfig.label}`,
          code: 'FILE_SIZE_EXCEEDED'
        });
      }

      // Validate MIME type
      if (!typeConfig.allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: `File type '${mimeType}' not allowed for ${typeConfig.label}. Allowed types: ${typeConfig.allowedMimeTypes.join(', ')}`,
          code: 'INVALID_FILE_TYPE'
        });
      }

      // Validate file extension
      const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
      if (!typeConfig.allowedExtensions.includes(extension)) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: `File extension '${extension}' not allowed for ${typeConfig.label}. Allowed extensions: ${typeConfig.allowedExtensions.join(', ')}`,
          code: 'INVALID_FILE_EXTENSION'
        });
      }

      // Draft session management - create or use existing draftId
      if (!req.session.draftId) {
        req.session.draftId = randomUUID();
        console.log(`Created new draft session: ${req.session.draftId}`);
      }
      const draftId = req.session.draftId;

      // Generate secure, session-bound file key
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileKey = `applications/drafts/${draftId}/${docType}/${randomUUID()}-${sanitizedFileName}`;
      
      // Get constrained presigned URL
      const privateObjectDir = objectStorageService.getPrivateObjectDir();
      if (!privateObjectDir) {
        throw new Error("Object storage upload is not configured. PRIVATE_OBJECT_DIR environment variable is missing.");
      }

      const fullPath = `${privateObjectDir}/${fileKey}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      
      // Create short-lived presigned URL (5 minutes for security)
      const signedURL = await signObjectURL({
        bucketName,
        objectName,
        method: "PUT",
        ttlSec: 300 // 5 minutes
      });

      console.log(`Public presign successful - Draft: ${draftId}, DocType: ${docType}, File: ${sanitizedFileName}`);

      res.json({
        uploadUrl: signedURL,
        objectPath: fileKey,
        draftId: draftId,
        expiresIn: 300,
        maxSize: typeConfig.maxSize,
        allowedMimeTypes: typeConfig.allowedMimeTypes
      });

    } catch (error: any) {
      console.error('Public presign error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to generate presigned URL',
        code: 'PRESIGN_ERROR'
      });
    }
  });

  /**
   * POST /api/uploads/finalize
   * Finalize upload - downloads file, validates content, computes SHA-256, checks duplicates, persists record
   */
  app.post("/api/uploads/finalize", requireUserOrApplicantAuth, async (req, res) => {
    try {
      const { fileKey, docType, fileName, mimeType, applicationId, applicationType } = req.body;
      const userId = req.authUserId || 'unknown';
      
      // Validate required parameters
      if (!fileKey || !docType || !fileName || !mimeType) {
        await logSecurityEvent('FINALIZE_VALIDATION_FAILED', userId, applicationId || 'unknown', 
          { reason: 'Missing required parameters', docType, fileName, fileKey }, false);
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'File key, document type, filename, and MIME type are required',
          code: 'MISSING_FINALIZE_PARAMETERS'
        });
      }

      // CRITICAL SECURITY CHECK: Validate application authorization
      if (applicationId) {
        const authResult = await checkApplicationAuthorization(userId, applicationId, applicationType);
        if (!authResult.authorized) {
          await logSecurityEvent('FINALIZE_AUTHORIZATION_DENIED', userId, applicationId, 
            { reason: authResult.reason, docType, fileName, fileKey, applicationType }, false);
          return res.status(403).json({
            type: 'https://tools.ietf.org/html/rfc7807',
            title: 'Forbidden',
            status: 403,
            detail: authResult.reason,
            code: 'INSUFFICIENT_PERMISSIONS'
          });
        }
        console.log(`Authorization granted for finalize: User ${userId} can finalize ${docType} upload for application ${applicationId}`);
      }

      // Get the uploaded file from object storage
      const privateObjectDir = objectStorageService.getPrivateObjectDir();
      if (!privateObjectDir) {
        throw new Error("Object storage not configured");
      }

      const fullPath = `${privateObjectDir}/${fileKey}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = getObjectStorageClient().bucket(bucketName);
      const file = bucket.file(objectName);

      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Not Found',
          status: 404,
          detail: 'Uploaded file not found. Please upload the file first using the presigned URL.',
          code: 'FILE_NOT_FOUND'
        });
      }

      // Download file content for validation
      const [fileBuffer] = await file.download();
      
      // Validate file content using FileValidator
      const validationResult = await FileValidator.validateFile(
        fileBuffer,
        fileName,
        mimeType,
        { documentType: docType as DocumentType }
      );

      if (!validationResult.isValid) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'File Validation Failed',
          status: 400,
          detail: validationResult.errors.join('; '),
          code: 'FILE_VALIDATION_FAILED',
          errors: validationResult.errors,
          warnings: validationResult.warnings
        });
      }

      // Compute SHA-256 hash from actual file content
      const fileHash = validationResult.fileInfo.hash!;
      const fileSizeActual = validationResult.fileInfo.size;

      // Check for duplicates by hash
      const existingDoc = await db
        .select()
        .from(uploadedDocuments)
        .where(eq(uploadedDocuments.sha256, fileHash))
        .limit(1);

      if (existingDoc.length > 0) {
        const duplicate = existingDoc[0];
        return res.status(409).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Duplicate File',
          status: 409,
          detail: 'A file with identical content already exists',
          code: 'DUPLICATE_FILE',
          conflictInfo: {
            existingFileId: duplicate.id,
            existingFileName: duplicate.fileName,
            existingDocType: duplicate.docType,
            uploadedAt: duplicate.createdAt
          }
        });
      }

      // Persist record to database
      const [documentRecord] = await db.insert(uploadedDocuments).values({
        applicationType: applicationType || 'individual',
        applicationIdFk: applicationId || '',
        docType: docType as DocumentType,
        fileKey,
        fileName,
        mime: mimeType,
        sizeBytes: fileSizeActual,
        sha256: fileHash,
        status: 'uploaded'
      }).returning();

      // Log successful finalize operation
      await logSecurityEvent('FINALIZE_SUCCESS', userId, applicationId || 'unknown', 
        { docType, fileName, fileKey, documentId: documentRecord.id, fileHash, fileSize: fileSizeActual }, true);

      res.status(201).json({
        documentId: documentRecord.id,
        fileKey,
        fileName,
        docType,
        fileHash,
        fileSize: fileSizeActual,
        status: 'uploaded',
        warnings: validationResult.warnings,
        message: 'File uploaded and validated successfully'
      });

    } catch (error: any) {
      console.error('Finalize upload error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to finalize upload',
        code: 'FINALIZE_ERROR'
      });
    }
  });

  // Object Storage routes - Enhanced with document type validation (LEGACY - kept for backward compatibility)
  app.post("/api/object-storage/upload-url", async (req, res) => {
    try {
      const { documentType, fileSize, mimeType, fileName } = req.body;
      
      // Validate required parameters for secure document upload
      if (!documentType || !fileSize || !mimeType || !fileName) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Document type, file size, MIME type, and filename are required for secure uploads',
          code: 'MISSING_UPLOAD_PARAMETERS'
        });
      }

      // Import validation utility
      const { DOCUMENT_TYPE_CONFIG } = await import('./utils/fileValidation');
      
      // Validate document type
      if (!DOCUMENT_TYPE_CONFIG[documentType as keyof typeof DOCUMENT_TYPE_CONFIG]) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Invalid document type',
          code: 'INVALID_DOCUMENT_TYPE'
        });
      }

      const typeConfig = DOCUMENT_TYPE_CONFIG[documentType as keyof typeof DOCUMENT_TYPE_CONFIG];
      
      // Validate file size
      if (fileSize > typeConfig.maxSize) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: `File size (${(fileSize / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size of ${(typeConfig.maxSize / 1024 / 1024).toFixed(1)}MB for ${typeConfig.label}`,
          code: 'FILE_SIZE_EXCEEDED'
        });
      }

      // Validate MIME type
      if (!typeConfig.allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: `File type '${mimeType}' not allowed for ${typeConfig.label}. Allowed types: ${typeConfig.allowedMimeTypes.join(', ')}`,
          code: 'INVALID_FILE_TYPE'
        });
      }

      // Validate file extension
      const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
      if (!typeConfig.allowedExtensions.includes(extension)) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: `File extension '${extension}' not allowed for ${typeConfig.label}. Allowed extensions: ${typeConfig.allowedExtensions.join(', ')}`,
          code: 'INVALID_FILE_EXTENSION'
        });
      }

      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const uploadUrl = await objectStorageService.getObjectEntityUploadURL();
      
      res.json({ 
        uploadUrl,
        constraints: {
          maxSize: typeConfig.maxSize,
          allowedMimeTypes: typeConfig.allowedMimeTypes,
          allowedExtensions: typeConfig.allowedExtensions
        }
      });
    } catch (error: any) {
      console.error('Error getting upload URL:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: error.message || "Object storage is not configured properly",
        code: 'UPLOAD_URL_ERROR'
      });
    }
  });

  // New route: Validate uploaded file content
  app.post("/api/object-storage/validate-file", async (req, res) => {
    try {
      const { uploadUrl, documentType, fileName, mimeType } = req.body;
      
      if (!uploadUrl || !documentType || !fileName || !mimeType) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Upload URL, document type, filename, and MIME type are required',
          code: 'MISSING_VALIDATION_PARAMETERS'
        });
      }

      // Download file from uploaded URL to validate content
      const response = await fetch(uploadUrl);
      if (!response.ok) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Failed to access uploaded file for validation',
          code: 'FILE_ACCESS_ERROR'
        });
      }

      const fileBuffer = Buffer.from(await response.arrayBuffer());
      
      // Import and use FileValidator
      const { FileValidator } = await import('./utils/fileValidation');
      
      const validationResult = await FileValidator.validateFile(
        fileBuffer,
        fileName,
        mimeType,
        { documentType: documentType as any }
      );

      if (!validationResult.isValid) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'File Validation Failed',
          status: 400,
          detail: validationResult.errors.join('; '),
          code: 'FILE_VALIDATION_FAILED',
          errors: validationResult.errors,
          warnings: validationResult.warnings
        });
      }

      res.json({
        valid: true,
        fileHash: validationResult.fileInfo.hash,
        fileSize: validationResult.fileInfo.size,
        warnings: validationResult.warnings,
        message: 'File validation successful'
      });

    } catch (error: any) {
      console.error('File validation error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to validate uploaded file',
        code: 'FILE_VALIDATION_ERROR'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
