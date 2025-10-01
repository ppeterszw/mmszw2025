import type { Express } from "express";
import { z } from "zod";
import { db } from "./db";
import { 
  individualApplications, 
  organizationApplications, 
  uploadedDocuments, 
  statusHistory,
  appLoginTokens,
  registryDecisions,
  members
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { 
  nextApplicationId, 
  nextMemberNumber 
} from "./services/namingSeries";
import { 
  createPaynowService, 
  PaynowService,
  isPaymentSuccessful 
} from "./services/paynow";
import { 
  checkIndividualEligibility, 
  checkOrganizationEligibility,
  validateDocumentRequirements 
} from "./services/eligibility";
import { 
  applicationSubmissionGuards,
  requireApplicationFee 
} from "./middleware/submissionGuard";

// Validation schemas for the new applications
const individualApplicationSchema = z.object({
  personal: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    dob: z.string().refine((dateStr) => {
      const dob = new Date(dateStr);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const adjustedAge = (today.getMonth() < dob.getMonth() || 
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) 
        ? age - 1 : age;
      return adjustedAge >= 18;
    }, { message: "Applicant must be at least 18 years old" }),
    nationalId: z.string().optional(),
    email: z.string().email(),
    phone: z.object({
      countryCode: z.string().min(1, "Country code is required"),
      number: z.string().min(5, "Phone number is required")
    }).optional(),
    address: z.string().optional(),
    countryOfResidence: z.string().min(2, "Country of residence is required"),
    currentEmployer: z.string().optional()
  }),
  oLevel: z.object({
    subjects: z.array(z.string()),
    hasEnglish: z.boolean(),
    hasMath: z.boolean(),
    passesCount: z.number().min(5)
  }),
  aLevel: z.object({
    subjects: z.array(z.string()),
    passesCount: z.number()
  }).optional(),
  equivalentQualification: z.object({
    type: z.string(),
    institution: z.string(),
    levelMap: z.string(),
    evidenceDocId: z.string().optional()
  }).optional()
});

const organizationApplicationSchema = z.object({
  orgProfile: z.object({
    legalName: z.string().min(2),
    tradingName: z.string().optional(),
    regNo: z.string().optional(),
    taxNo: z.string().optional(),
    address: z.string().optional(),
    emails: z.array(z.string().email()),
    phones: z.array(z.string()).optional()
  }),
  trustAccount: z.object({
    bankName: z.string().min(2),
    branch: z.string().optional(),
    accountNoMasked: z.string().optional()
  }),
  preaMemberId: z.string(),
  directors: z.array(z.object({
    name: z.string(),
    nationalId: z.string().optional(),
    memberId: z.string().optional()
  }))
});

// OTP generation and verification
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email: string, code: string): Promise<boolean> {
  // In production, integrate with email service
  console.log(`OTP for ${email}: ${code}`);
  return true;
}

/**
 * Register application-specific routes
 */
export function registerApplicationRoutes(app: Express) {
  
  // === PUBLIC APPLICATION SUBMISSION ROUTES ===
  
  /**
   * Start new individual application
   * POST /api/public/applications/individual/start
   */
  app.post("/api/public/applications/individual/start", async (req, res) => {
    try {
      const applicationData = individualApplicationSchema.parse(req.body);
      
      // Check eligibility
      const eligibility = checkIndividualEligibility(applicationData);
      if (!eligibility.ok) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Eligibility Check Failed',
          status: 400,
          detail: eligibility.reason,
          code: 'ELIGIBILITY_FAILED'
        });
      }

      // Generate application ID
      const applicationId = await nextApplicationId('individual');
      
      // Calculate application fee
      const feeAmount = eligibility.mature ? 75 : 50; // USD

      // Create application record
      const [application] = await db.insert(individualApplications).values({
        applicationId,
        status: 'draft',
        personal: JSON.stringify(applicationData.personal),
        oLevel: JSON.stringify(applicationData.oLevel),
        aLevel: applicationData.aLevel ? JSON.stringify(applicationData.aLevel) : null,
        equivalentQualification: applicationData.equivalentQualification ? 
          JSON.stringify(applicationData.equivalentQualification) : null,
        matureEntry: eligibility.mature,
        feeAmount,
        feeCurrency: 'USD',
        feeStatus: 'pending'
      }).returning();

      // Log status history
      await db.insert(statusHistory).values({
        applicationType: 'individual',
        applicationIdFk: applicationId,
        toStatus: 'draft',
        comment: 'Application created'
      });

      // Send application confirmation email
      try {
        const { sendEmail, generateApplicationConfirmationEmail } = await import('./services/emailService');
        const applicantName = applicationData.personal.firstName + ' ' + applicationData.personal.lastName;
        const confirmationEmail = generateApplicationConfirmationEmail(
          applicantName,
          applicationId,
          'individual',
          feeAmount
        );
        
        await sendEmail({
          to: applicationData.personal.email,
          from: 'noreply@estateagentscouncil.org',
          ...confirmationEmail
        });
        console.log(`Application confirmation email sent to: ${applicationData.personal.email}`);
      } catch (emailError) {
        console.error('Failed to send application confirmation email:', emailError);
        // Don't fail the application creation if email fails
      }

      res.status(201).json({
        applicationId,
        matureEntry: eligibility.mature,
        feeAmount,
        feeCurrency: 'USD',
        requirements: eligibility.requirements,
        warnings: eligibility.warnings,
        message: 'Application created successfully. Please upload required documents and pay application fee before submission.'
      });

    } catch (error: any) {
      console.error('Individual application start error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Validation Error',
          status: 400,
          detail: 'Invalid application data',
          code: 'VALIDATION_ERROR',
          errors: error.errors
        });
      }
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to create individual application',
        code: 'APPLICATION_CREATION_ERROR'
      });
    }
  });

  /**
   * Start new organization application 
   * POST /api/public/applications/organization/start
   */
  app.post("/api/public/applications/organization/start", async (req, res) => {
    try {
      const applicationData = organizationApplicationSchema.parse(req.body);
      
      // Verify PREA member exists and is active
      const [preaMember] = await db
        .select()
        .from(members)
        .where(eq(members.id, applicationData.preaMemberId))
        .limit(1);

      const preaIsActive = preaMember && preaMember.membershipStatus === 'active';
      
      // Check eligibility
      const eligibility = checkOrganizationEligibility(
        applicationData,
        {}, // Empty doc map - will be populated during document upload
        preaIsActive,
        false // Will be validated later from CR6 form
      );
      
      if (!eligibility.ok) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Eligibility Check Failed',
          status: 400,
          detail: eligibility.reason,
          code: 'ELIGIBILITY_FAILED'
        });
      }

      // Generate application ID
      const applicationId = await nextApplicationId('organization');
      
      // Calculate application fee
      const feeAmount = 150; // USD for organizations

      // Create application record
      const [application] = await db.insert(organizationApplications).values({
        applicationId,
        status: 'draft',
        orgProfile: JSON.stringify(applicationData.orgProfile),
        trustAccount: JSON.stringify(applicationData.trustAccount),
        preaMemberId: applicationData.preaMemberId,
        directors: JSON.stringify(applicationData.directors),
        feeAmount,
        feeCurrency: 'USD',
        feeStatus: 'pending'
      }).returning();

      // Log status history
      await db.insert(statusHistory).values({
        applicationType: 'organization',
        applicationIdFk: applicationId,
        toStatus: 'draft',
        comment: 'Organization application created'
      });

      // Send application confirmation email
      try {
        const { sendEmail, generateApplicationConfirmationEmail } = await import('./services/emailService');
        const orgProfile = applicationData.orgProfile;
        const applicantName = orgProfile.legalName;
        const applicantEmail = orgProfile.emails[0]; // Use first email from the array
        
        const confirmationEmail = generateApplicationConfirmationEmail(
          applicantName,
          applicationId,
          'organization',
          feeAmount
        );
        
        await sendEmail({
          to: applicantEmail,
          from: 'noreply@estateagentscouncil.org',
          ...confirmationEmail
        });
        console.log(`Organization application confirmation email sent to: ${applicantEmail}`);
      } catch (emailError) {
        console.error('Failed to send organization application confirmation email:', emailError);
        // Don't fail the application creation if email fails
      }

      res.status(201).json({
        applicationId,
        feeAmount,
        feeCurrency: 'USD',
        requirements: eligibility.requirements,
        warnings: eligibility.warnings,
        message: 'Organization application created successfully. Please upload required documents and pay application fee before submission.'
      });

    } catch (error: any) {
      console.error('Organization application start error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Validation Error',
          status: 400,
          detail: 'Invalid application data',
          code: 'VALIDATION_ERROR',
          errors: error.errors
        });
      }
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to create organization application',
        code: 'APPLICATION_CREATION_ERROR'
      });
    }
  });

  /**
   * Get application status and details
   * GET /api/public/applications/:applicationId
   */
  app.get("/api/public/applications/:applicationId", async (req, res) => {
    try {
      const { applicationId } = req.params;
      
      // Try individual applications first
      const [individualApp] = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.applicationId, applicationId))
        .limit(1);

      if (individualApp) {
        // Get uploaded documents
        const documents = await db
          .select()
          .from(uploadedDocuments)
          .where(and(
            eq(uploadedDocuments.applicationType, 'individual'),
            eq(uploadedDocuments.applicationIdFk, applicationId)
          ));

        // Get status history
        const history = await db
          .select()
          .from(statusHistory)
          .where(and(
            eq(statusHistory.applicationType, 'individual'),
            eq(statusHistory.applicationIdFk, applicationId)
          ))
          .orderBy(desc(statusHistory.createdAt));

        return res.json({
          ...individualApp,
          applicationType: 'individual',
          documents,
          statusHistory: history
        });
      }

      // Try organization applications
      const [orgApp] = await db
        .select()
        .from(organizationApplications)
        .where(eq(organizationApplications.applicationId, applicationId))
        .limit(1);

      if (orgApp) {
        // Get uploaded documents
        const documents = await db
          .select()
          .from(uploadedDocuments)
          .where(and(
            eq(uploadedDocuments.applicationType, 'organization'),
            eq(uploadedDocuments.applicationIdFk, applicationId)
          ));

        // Get status history
        const history = await db
          .select()
          .from(statusHistory)
          .where(and(
            eq(statusHistory.applicationType, 'organization'),
            eq(statusHistory.applicationIdFk, applicationId)
          ))
          .orderBy(desc(statusHistory.createdAt));

        return res.json({
          ...orgApp,
          applicationType: 'organization',
          documents,
          statusHistory: history
        });
      }

      res.status(404).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Not Found',
        status: 404,
        detail: 'Application not found',
        code: 'APPLICATION_NOT_FOUND'
      });

    } catch (error: any) {
      console.error('Get application error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to retrieve application',
        code: 'APPLICATION_FETCH_ERROR'
      });
    }
  });

  /**
   * Submit application for review (with fee guard)
   * POST /api/public/applications/:applicationId/submit
   */
  app.post("/api/public/applications/:applicationId/submit",
    applicationSubmissionGuards(),
    async (req: any, res: any) => {
      try {
        const { applicationId } = req.params;

        // Determine application type and get record
        let application: any = null;
        let applicationType: 'individual' | 'organization' = 'individual';

        const [individualApp] = await db
          .select()
          .from(individualApplications)
          .where(eq(individualApplications.applicationId, applicationId))
          .limit(1);

        if (individualApp) {
          application = individualApp;
          applicationType = 'individual';
        } else {
          const [orgApp] = await db
            .select()
            .from(organizationApplications)
            .where(eq(organizationApplications.applicationId, applicationId))
            .limit(1);

          if (orgApp) {
            application = orgApp;
            applicationType = 'organization';
          }
        }

        if (!application) {
          return res.status(404).json({
            type: 'https://tools.ietf.org/html/rfc7807',
            title: 'Not Found',
            status: 404,
            detail: 'Application not found',
            code: 'APPLICATION_NOT_FOUND'
          });
        }

        // Validate document requirements
        const uploadedDocs = await db
          .select()
          .from(uploadedDocuments)
          .where(and(
            eq(uploadedDocuments.applicationType, applicationType),
            eq(uploadedDocuments.applicationIdFk, applicationId)
          ));

        const docTypes = uploadedDocs.map(doc => doc.docType);
        const docValidation = validateDocumentRequirements(
          applicationType,
          docTypes,
          { 
            matureEntry: application.matureEntry,
            directorCount: applicationType === 'organization' 
              ? JSON.parse(application.directors || '[]').length 
              : undefined
          }
        );

        if (!docValidation.ok) {
          return res.status(400).json({
            type: 'https://tools.ietf.org/html/rfc7807',
            title: 'Missing Required Documents',
            status: 400,
            detail: docValidation.reason,
            code: 'MISSING_DOCUMENTS',
            requirements: docValidation.requirements
          });
        }

        // Update application status to submitted
        if (applicationType === 'individual') {
          await db
            .update(individualApplications)
            .set({
              status: 'eligibility_review',
              submittedAt: new Date()
            })
            .where(eq(individualApplications.applicationId, applicationId));
        } else {
          await db
            .update(organizationApplications)
            .set({
              status: 'eligibility_review',
              submittedAt: new Date()
            })
            .where(eq(organizationApplications.applicationId, applicationId));
        }

        // Log status change
        const submittedAt = new Date();
        await db.insert(statusHistory).values({
          applicationType,
          applicationIdFk: applicationId,
          fromStatus: application.status || 'draft',
          toStatus: 'eligibility_review',
          comment: 'Application submitted for review'
        });

        res.json({
          applicationId,
          status: 'eligibility_review',
          submittedAt,
          message: 'Application submitted successfully and is now under review'
        });

      } catch (error: any) {
        console.error('Application submission error:', error);
        res.status(500).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Internal Server Error',
          status: 500,
          detail: 'Failed to submit application',
          code: 'SUBMISSION_ERROR'
        });
      }
    }
  );

  /**
   * Generate Save & Resume OTP
   * POST /api/public/applications/:applicationId/generate-otp
   */
  app.post("/api/public/applications/:applicationId/generate-otp", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Email address is required',
          code: 'MISSING_EMAIL'
        });
      }

      // Verify application exists
      const [individualApp] = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.applicationId, applicationId))
        .limit(1);

      const [orgApp] = await db
        .select()
        .from(organizationApplications)
        .where(eq(organizationApplications.applicationId, applicationId))
        .limit(1);

      if (!individualApp && !orgApp) {
        return res.status(404).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Not Found',
          status: 404,
          detail: 'Application not found',
          code: 'APPLICATION_NOT_FOUND'
        });
      }

      const applicationType = individualApp ? 'individual' : 'organization';
      
      // Generate OTP
      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      // Store OTP token
      await db.insert(appLoginTokens).values({
        applicationType,
        applicationIdFk: applicationId,
        email,
        code,
        expiresAt
      });

      // Send OTP email
      await sendOTPEmail(email, code);

      res.json({
        message: 'OTP sent to your email address',
        expiresAt
      });

    } catch (error: any) {
      console.error('OTP generation error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to generate OTP',
        code: 'OTP_GENERATION_ERROR'
      });
    }
  });

  /**
   * Verify OTP and create session token
   * POST /api/public/applications/:applicationId/verify-otp
   */
  app.post("/api/public/applications/:applicationId/verify-otp", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Email and OTP code are required',
          code: 'MISSING_CREDENTIALS'
        });
      }

      // Find valid OTP token
      const [token] = await db
        .select()
        .from(appLoginTokens)
        .where(and(
          eq(appLoginTokens.applicationIdFk, applicationId),
          eq(appLoginTokens.email, email),
          eq(appLoginTokens.code, code)
        ))
        .limit(1);

      if (!token) {
        return res.status(401).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Invalid OTP',
          status: 401,
          detail: 'Invalid or expired OTP code',
          code: 'INVALID_OTP'
        });
      }

      // Check expiration
      if (new Date() > token.expiresAt) {
        return res.status(401).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Expired OTP',
          status: 401,
          detail: 'OTP code has expired',
          code: 'EXPIRED_OTP'
        });
      }

      // Check attempt limit
      if ((token.attempts || 0) >= 3) {
        return res.status(429).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Too Many Attempts',
          status: 429,
          detail: 'Too many verification attempts',
          code: 'TOO_MANY_ATTEMPTS'
        });
      }

      // Update attempt count
      await db
        .update(appLoginTokens)
        .set({ attempts: (token.attempts || 0) + 1 })
        .where(eq(appLoginTokens.id, token.id));

      // Generate session token (simple implementation)
      const sessionToken = Buffer.from(`${applicationId}:${email}:${Date.now()}`).toString('base64');

      res.json({
        sessionToken,
        applicationId,
        applicationType: token.applicationType,
        message: 'OTP verified successfully'
      });

    } catch (error: any) {
      console.error('OTP verification error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to verify OTP',
        code: 'OTP_VERIFICATION_ERROR'
      });
    }
  });

  // === PAYMENT PROCESSING ROUTES ===

  /**
   * Initialize Paynow payment for application fee
   * POST /api/public/applications/:applicationId/fee/initiate
   */
  app.post("/api/public/applications/:applicationId/fee/initiate", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { method, amount, email, phone } = req.body;

      // Get application
      let application: any = null;
      let applicationType: 'individual' | 'organization' = 'individual';

      const [individualApp] = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.applicationId, applicationId))
        .limit(1);

      if (individualApp) {
        application = individualApp;
        applicationType = 'individual';
      } else {
        const [orgApp] = await db
          .select()
          .from(organizationApplications)
          .where(eq(organizationApplications.applicationId, applicationId))
          .limit(1);

        if (orgApp) {
          application = orgApp;
          applicationType = 'organization';
        }
      }

      if (!application) {
        return res.status(404).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Not Found',
          status: 404,
          detail: 'Application not found',
          code: 'APPLICATION_NOT_FOUND'
        });
      }

      // Validate amount matches application fee
      if (amount !== application.feeAmount) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Invalid Amount',
          status: 400,
          detail: `Payment amount must be ${application.feeAmount} ${application.feeCurrency}`,
          code: 'INVALID_PAYMENT_AMOUNT'
        });
      }

      // Initialize payment
      const paynowService = createPaynowService();
      const paymentResult = await paynowService.initiatePayment({
        amount,
        currency: 'USD',
        email: email || JSON.parse(application.personal || application.orgProfile).email,
        reference: `EACZ-FEE-${applicationId}`,
        returnUrl: `${process.env.FRONTEND_URL}/application/${applicationId}/payment-complete`,
        resultUrl: `${process.env.BACKEND_URL}/api/public/applications/${applicationId}/fee/callback`
      });

      if (!paymentResult.success) {
        return res.status(500).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Payment Initialization Failed',
          status: 500,
          detail: paymentResult.error || 'Failed to initialize payment',
          code: 'PAYMENT_INIT_ERROR'
        });
      }

      // Update application with payment ID
      const updateData = { feePaymentId: paymentResult.pollUrl };

      if (applicationType === 'individual') {
        await db
          .update(individualApplications)
          .set(updateData)
          .where(eq(individualApplications.applicationId, applicationId));
      } else {
        await db
          .update(organizationApplications)
          .set(updateData)
          .where(eq(organizationApplications.applicationId, applicationId));
      }

      res.json({
        paymentUrl: paymentResult.redirectUrl,
        pollUrl: paymentResult.pollUrl,
        instructions: (paymentResult as any).instructions,
        message: 'Payment initialized successfully'
      });

    } catch (error: any) {
      console.error('Payment initialization error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to initialize payment',
        code: 'PAYMENT_INIT_ERROR'
      });
    }
  });

  /**
   * Handle Paynow payment callback (IPN)
   * POST /api/public/applications/:applicationId/fee/callback
   */
  app.post("/api/public/applications/:applicationId/fee/callback", async (req, res) => {
    try {
      const { applicationId } = req.params;
      
      // Process callback
      const paynowService = createPaynowService();
      const callbackResult: any = await paynowService.verifyIPN(req.body);

      if (callbackResult && callbackResult.success && isPaymentSuccessful(callbackResult.status)) {
        // Update application fee status
        const updateData = { feeStatus: 'settled' as const };

        // Try individual applications first
        const [individualApp] = await db
          .select()
          .from(individualApplications)
          .where(eq(individualApplications.applicationId, applicationId))
          .limit(1);

        if (individualApp) {
          await db
            .update(individualApplications)
            .set(updateData)
            .where(eq(individualApplications.applicationId, applicationId));
          
          // Log status change
          await db.insert(statusHistory).values({
            applicationType: 'individual',
            applicationIdFk: applicationId,
            fromStatus: individualApp.status || 'draft',
            toStatus: individualApp.status || 'draft',
            comment: 'Application fee payment confirmed'
          });
        } else {
          // Try organization applications
          const [orgApp] = await db
            .select()
            .from(organizationApplications)
            .where(eq(organizationApplications.applicationId, applicationId))
            .limit(1);

          if (orgApp) {
            await db
              .update(organizationApplications)
              .set(updateData)
              .where(eq(organizationApplications.applicationId, applicationId));
            
            // Log status change
            await db.insert(statusHistory).values({
              applicationType: 'organization',
              applicationIdFk: applicationId,
              fromStatus: orgApp.status || 'draft',
              toStatus: orgApp.status || 'draft',
              comment: 'Application fee payment confirmed'
            });
          }
        }
      }

      res.status(200).send('OK');
    } catch (error: any) {
      console.error('Payment callback error:', error);
      res.status(500).send('Error');
    }
  });

  /**
   * Upload proof of payment
   * POST /api/public/applications/:applicationId/fee/proof
   */
  app.post("/api/public/applications/:applicationId/fee/proof", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { fileKey, fileName, mimeType, size } = req.body;

      if (!fileKey || !fileName) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'File key and name are required',
          code: 'MISSING_FILE_DATA'
        });
      }

      // Determine application type
      let applicationType: 'individual' | 'organization' = 'individual';

      const [individualApp] = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.applicationId, applicationId))
        .limit(1);

      if (!individualApp) {
        const [orgApp] = await db
          .select()
          .from(organizationApplications)
          .where(eq(organizationApplications.applicationId, applicationId))
          .limit(1);

        if (orgApp) {
          applicationType = 'organization';
        } else {
          return res.status(404).json({
            type: 'https://tools.ietf.org/html/rfc7807',
            title: 'Not Found',
            status: 404,
            detail: 'Application not found',
            code: 'APPLICATION_NOT_FOUND'
          });
        }
      }

      // Create document record
      const [document] = await db.insert(uploadedDocuments).values({
        applicationType,
        applicationIdFk: applicationId,
        docType: 'application_fee_pop',
        fileKey,
        fileName,
        mime: mimeType,
        sizeBytes: size,
        status: 'uploaded'
      }).returning();

      // Update application with proof document ID
      const updateData = { 
        feeProofDocId: document.id,
        feeStatus: 'proof_uploaded' as const
      };

      if (applicationType === 'individual') {
        await db
          .update(individualApplications)
          .set(updateData)
          .where(eq(individualApplications.applicationId, applicationId));
      } else {
        await db
          .update(organizationApplications)
          .set(updateData)
          .where(eq(organizationApplications.applicationId, applicationId));
      }

      // Log status change
      await db.insert(statusHistory).values({
        applicationType,
        applicationIdFk: applicationId,
        fromStatus: applicationType === 'individual' ? (individualApp?.status || 'draft') : 'draft',
        toStatus: applicationType === 'individual' ? (individualApp?.status || 'draft') : 'draft',
        comment: 'Proof of payment uploaded - pending verification'
      });

      res.json({
        documentId: document.id,
        message: 'Proof of payment uploaded successfully. Payment verification is pending.'
      });

    } catch (error: any) {
      console.error('Proof of payment upload error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to upload proof of payment',
        code: 'PROOF_UPLOAD_ERROR'
      });
    }
  });

  // === DOCUMENT UPLOAD ROUTES ===

  /**
   * Upload application document
   * POST /api/public/applications/:applicationId/documents
   */
  app.post("/api/public/applications/:applicationId/documents", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { fileKey, fileName, mimeType, size, docType, uploadUrl } = req.body;

      if (!fileKey || !fileName || !docType || !uploadUrl) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'File key, name, document type, and upload URL are required for security validation',
          code: 'MISSING_DOCUMENT_DATA'
        });
      }

      // Import validation utilities
      const { DOCUMENT_TYPE_CONFIG, FileValidator } = await import('./utils/fileValidation');

      // Validate document type
      if (!DOCUMENT_TYPE_CONFIG[docType as keyof typeof DOCUMENT_TYPE_CONFIG]) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Invalid document type',
          code: 'INVALID_DOCUMENT_TYPE'
        });
      }

      const typeConfig = DOCUMENT_TYPE_CONFIG[docType as keyof typeof DOCUMENT_TYPE_CONFIG];

      // Download and validate the uploaded file content with magic numbers
      console.log('Performing server-side file validation for:', fileName);
      const fileResponse = await fetch(uploadUrl);
      if (!fileResponse.ok) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: 'Failed to access uploaded file for server-side validation',
          code: 'FILE_ACCESS_ERROR'
        });
      }

      const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());
      const actualSize = fileBuffer.length;

      // Comprehensive server-side file validation with magic number verification
      const validationResult = await FileValidator.validateFile(
        fileBuffer,
        fileName,
        mimeType || 'application/octet-stream',
        { documentType: docType as any }
      );

      if (!validationResult.isValid) {
        console.error('Server-side file validation failed:', validationResult.errors);
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'File Security Validation Failed',
          status: 400,
          detail: `File failed security validation: ${validationResult.errors.join('; ')}`,
          code: 'FILE_SECURITY_VALIDATION_FAILED',
          errors: validationResult.errors,
          warnings: validationResult.warnings
        });
      }

      const calculatedHash = validationResult.fileInfo.hash!;
      console.log('File validation passed. Calculated SHA-256:', calculatedHash);
      
      // Comprehensive duplicate detection using server-calculated SHA-256
      const existingByHash = await db
        .select({
          id: uploadedDocuments.id,
          applicationIdFk: uploadedDocuments.applicationIdFk,
          docType: uploadedDocuments.docType,
          fileName: uploadedDocuments.fileName
        })
        .from(uploadedDocuments)
        .where(eq(uploadedDocuments.sha256, calculatedHash))
        .limit(1);
      
      if (existingByHash.length > 0) {
        const existingDoc = existingByHash[0];
        console.log('Duplicate file detected with hash:', calculatedHash);
        return res.status(409).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Duplicate File Content',
          status: 409,
          detail: `A file with identical content already exists: "${existingDoc.fileName}" in application ${existingDoc.applicationIdFk}`,
          code: 'DUPLICATE_FILE_CONTENT',
          existingDocument: {
            id: existingDoc.id,
            applicationId: existingDoc.applicationIdFk,
            docType: existingDoc.docType,
            fileName: existingDoc.fileName
          }
        });
      }

      // Determine application type and verify it exists
      let applicationType: 'individual' | 'organization' = 'individual';
      let application;

      const [individualApp] = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.applicationId, applicationId))
        .limit(1);

      if (individualApp) {
        application = individualApp;
        applicationType = 'individual';
      } else {
        const [orgApp] = await db
          .select()
          .from(organizationApplications)
          .where(eq(organizationApplications.applicationId, applicationId))
          .limit(1);

        if (orgApp) {
          application = orgApp;
          applicationType = 'organization';
        } else {
          return res.status(404).json({
            type: 'https://tools.ietf.org/html/rfc7807',
            title: 'Not Found',
            status: 404,
            detail: 'Application not found',
            code: 'APPLICATION_NOT_FOUND'
          });
        }
      }

      // Verify application is in a state that allows document uploads
      if (!['draft', 'needs_applicant_action'].includes(application.status || '')) {
        return res.status(400).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Bad Request',
          status: 400,
          detail: `Cannot upload documents for application in ${application.status} status`,
          code: 'INVALID_APPLICATION_STATUS'
        });
      }

      // Check for existing document of same type (replace if allowed)
      const existingDocForType = await db
        .select()
        .from(uploadedDocuments)
        .where(
          and(
            eq(uploadedDocuments.applicationIdFk, applicationId),
            eq(uploadedDocuments.docType, docType)
          )
        )
        .limit(1);

      // For certain critical document types, only allow one per application
      const singleDocumentTypes = ['id_or_passport', 'birth_certificate', 'certificate_incorporation'];
      if (singleDocumentTypes.includes(docType) && existingDocForType.length > 0) {
        // For single-document types, update existing instead of creating new
        console.log('Updating existing single-document type:', docType);
        const [document] = await db
          .update(uploadedDocuments)
          .set({
            fileKey,
            fileName,
            mime: mimeType,
            sizeBytes: actualSize,
            sha256: calculatedHash,
            status: 'uploaded',
            updatedAt: new Date()
          })
          .where(eq(uploadedDocuments.id, existingDocForType[0].id))
          .returning();

        return res.status(200).json({
          documentId: document.id,
          docType,
          fileName,
          status: 'uploaded',
          fileSize: actualSize,
          mimeType: mimeType,
          fileHash: calculatedHash,
          uploadedAt: document.updatedAt,
          category: typeConfig.category,
          validationWarnings: validationResult.warnings,
          message: `${typeConfig.label} updated successfully after security validation`
        });
      }

      // Create new document record with server-validated data
      console.log('Creating new document record for:', docType);
      const [document] = await db.insert(uploadedDocuments).values({
        applicationType,
        applicationIdFk: applicationId,
        docType,
        fileKey,
        fileName,
        mime: mimeType,
        sizeBytes: actualSize,
        sha256: calculatedHash,
        status: 'uploaded'
      }).returning();

      console.log('Document upload completed with security validation:', document.id);

      res.status(201).json({
        documentId: document.id,
        docType,
        fileName,
        status: 'uploaded',
        fileSize: actualSize,
        mimeType: mimeType,
        fileHash: calculatedHash,
        uploadedAt: document.createdAt,
        category: typeConfig.category,
        validationWarnings: validationResult.warnings,
        message: `${typeConfig.label} uploaded successfully after comprehensive security validation`
      });

    } catch (error: any) {
      console.error('Document upload error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to upload document',
        code: 'DOCUMENT_UPLOAD_ERROR'
      });
    }
  });

  /**
   * Get application documents
   * GET /api/public/applications/:applicationId/documents
   */
  app.get("/api/public/applications/:applicationId/documents", async (req, res) => {
    try {
      const { applicationId } = req.params;

      // Get all documents for this application
      const documents = await db
        .select()
        .from(uploadedDocuments)
        .where(eq(uploadedDocuments.applicationIdFk, applicationId))
        .orderBy(desc(uploadedDocuments.createdAt));

      res.json(documents);

    } catch (error: any) {
      console.error('Get documents error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to retrieve documents',
        code: 'DOCUMENTS_FETCH_ERROR'
      });
    }
  });

  /**
   * Delete uploaded document
   * DELETE /api/public/applications/:applicationId/documents/:documentId
   */
  app.delete("/api/public/applications/:applicationId/documents/:documentId", async (req, res) => {
    try {
      const { applicationId, documentId } = req.params;

      // Verify document belongs to application
      const [document] = await db
        .select()
        .from(uploadedDocuments)
        .where(and(
          eq(uploadedDocuments.id, documentId),
          eq(uploadedDocuments.applicationIdFk, applicationId)
        ))
        .limit(1);

      if (!document) {
        return res.status(404).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Not Found',
          status: 404,
          detail: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND'
        });
      }

      // Only allow deletion if status is 'uploaded' (not yet verified)
      if (document.status !== 'uploaded') {
        return res.status(409).json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Document Cannot Be Deleted',
          status: 409,
          detail: 'Document has already been processed and cannot be deleted',
          code: 'DOCUMENT_PROCESSED'
        });
      }

      // Delete document record
      await db
        .delete(uploadedDocuments)
        .where(eq(uploadedDocuments.id, documentId));

      res.json({
        message: 'Document deleted successfully'
      });

    } catch (error: any) {
      console.error('Document deletion error:', error);
      res.status(500).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Failed to delete document',
        code: 'DOCUMENT_DELETE_ERROR'
      });
    }
  });

  // === ADMIN APPLICATION MANAGEMENT ROUTES ===

  // Authentication middleware for admin routes
  function requireAuth(req: any, res: any, next: any) {
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

  // Centralized role constants
  const ADMIN_ROLES = ['admin', 'super_admin'];
  const STAFF_ROLES = ['admin', 'member_manager', 'super_admin', 'staff'];

  /**
   * Get all applications (admin)
   * GET /api/admin/applications
   */
  app.get("/api/admin/applications", authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { status, type, limit = 50, offset = 0 } = req.query;

      // Build filters and execute queries
      const individualQueryBase = db.select().from(individualApplications);
      const orgQueryBase = db.select().from(organizationApplications);

      const individualQuery = status
        ? individualQueryBase.where(eq(individualApplications.status, status as any))
        : individualQueryBase;

      const orgQuery = status
        ? orgQueryBase.where(eq(organizationApplications.status, status as any))
        : orgQueryBase;

      // Get individual applications
      let individualApps: any[] = [];
      if (!type || type === 'individual') {
        individualApps = await individualQuery
          .limit(parseInt(limit as string))
          .offset(parseInt(offset as string))
          .orderBy(desc(individualApplications.createdAt));
      }

      // Get organization applications
      let orgApps: any[] = [];
      if (!type || type === 'organization') {
        orgApps = await orgQuery
          .limit(parseInt(limit as string))
          .offset(parseInt(offset as string))
          .orderBy(desc(organizationApplications.createdAt));
      }

      // Combine and format results
      const allApplications = [
        ...individualApps.map(app => ({ ...app, applicationType: 'individual' })),
        ...orgApps.map(app => ({ ...app, applicationType: 'organization' }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.json(allApplications);

    } catch (error: any) {
      console.error('Admin applications fetch error:', error);
      res.status(500).json({ message: 'Failed to fetch applications' });
    }
  });

  /**
   * Get application details with documents and history (admin)
   * GET /api/admin/applications/:applicationId
   */
  app.get("/api/admin/applications/:applicationId", authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { applicationId } = req.params;

      // Get application details (same as public route but with admin context)
      const [individualApp] = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.applicationId, applicationId))
        .limit(1);

      let application: any = null;
      let applicationType: 'individual' | 'organization' = 'individual';

      if (individualApp) {
        application = individualApp;
        applicationType = 'individual';
      } else {
        const [orgApp] = await db
          .select()
          .from(organizationApplications)
          .where(eq(organizationApplications.applicationId, applicationId))
          .limit(1);

        if (orgApp) {
          application = orgApp;
          applicationType = 'organization';
        }
      }

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      // Get documents
      const documents = await db
        .select()
        .from(uploadedDocuments)
        .where(and(
          eq(uploadedDocuments.applicationType, applicationType),
          eq(uploadedDocuments.applicationIdFk, applicationId)
        ));

      // Get status history
      const history = await db
        .select()
        .from(statusHistory)
        .where(and(
          eq(statusHistory.applicationType, applicationType),
          eq(statusHistory.applicationIdFk, applicationId)
        ))
        .orderBy(desc(statusHistory.createdAt));

      // Get decisions if any
      const decisions = await db
        .select()
        .from(registryDecisions)
        .where(and(
          eq(registryDecisions.applicationType, applicationType),
          eq(registryDecisions.applicationIdFk, applicationId)
        ))
        .orderBy(desc(registryDecisions.decidedAt));

      res.json({
        ...application,
        applicationType,
        documents,
        statusHistory: history,
        decisions
      });

    } catch (error: any) {
      console.error('Admin application details fetch error:', error);
      res.status(500).json({ message: 'Failed to fetch application details' });
    }
  });

  /**
   * Update application status (admin)
   * PUT /api/admin/applications/:applicationId/status
   */
  app.put("/api/admin/applications/:applicationId/status", authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status, comment } = req.body;
      const userId = req.user?.id;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      // Get current application
      let application: any = null;
      let applicationType: 'individual' | 'organization' = 'individual';

      const [individualApp] = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.applicationId, applicationId))
        .limit(1);

      if (individualApp) {
        application = individualApp;
        applicationType = 'individual';
      } else {
        const [orgApp] = await db
          .select()
          .from(organizationApplications)
          .where(eq(organizationApplications.applicationId, applicationId))
          .limit(1);

        if (orgApp) {
          application = orgApp;
          applicationType = 'organization';
        }
      }

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      // Update status
      const updateData = { status, updatedAt: new Date() };

      if (applicationType === 'individual') {
        await db
          .update(individualApplications)
          .set(updateData)
          .where(eq(individualApplications.applicationId, applicationId));
      } else {
        await db
          .update(organizationApplications)
          .set(updateData)
          .where(eq(organizationApplications.applicationId, applicationId));
      }

      // Log status change
      await db.insert(statusHistory).values({
        applicationType,
        applicationIdFk: applicationId,
        fromStatus: application.status,
        toStatus: status,
        actorUserId: userId,
        comment: comment || `Status changed by admin to ${status}`
      });

      res.json({
        applicationId,
        status,
        message: 'Application status updated successfully'
      });

    } catch (error: any) {
      console.error('Admin status update error:', error);
      res.status(500).json({ message: 'Failed to update application status' });
    }
  });

  /**
   * Verify document (admin)
   * PUT /api/admin/applications/:applicationId/documents/:documentId/verify
   */
  app.put("/api/admin/applications/:applicationId/documents/:documentId/verify", authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { applicationId, documentId } = req.params;
      const { status, notes } = req.body;
      const userId = req.user?.id;

      if (!status || !['verified', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Valid status (verified/rejected) is required' });
      }

      // Verify document exists and belongs to application
      const [document] = await db
        .select()
        .from(uploadedDocuments)
        .where(and(
          eq(uploadedDocuments.id, documentId),
          eq(uploadedDocuments.applicationIdFk, applicationId)
        ))
        .limit(1);

      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      // Update document
      await db
        .update(uploadedDocuments)
        .set({
          status: status as any,
          verifierUserId: userId,
          notes,
          updatedAt: new Date()
        })
        .where(eq(uploadedDocuments.id, documentId));

      res.json({
        documentId,
        status,
        message: `Document ${status} successfully`
      });

    } catch (error: any) {
      console.error('Document verification error:', error);
      res.status(500).json({ message: 'Failed to verify document' });
    }
  });

  /**
   * Make registry decision (admin)
   * POST /api/admin/applications/:applicationId/decide
   */
  app.post("/api/admin/applications/:applicationId/decide", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { decision, reasons } = req.body;
      const userId = req.user?.id;

      if (!decision || !['accepted', 'rejected'].includes(decision)) {
        return res.status(400).json({ message: 'Valid decision (accepted/rejected) is required' });
      }

      // Get application
      let application: any = null;
      let applicationType: 'individual' | 'organization' = 'individual';

      const [individualApp] = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.applicationId, applicationId))
        .limit(1);

      if (individualApp) {
        application = individualApp;
        applicationType = 'individual';
      } else {
        const [orgApp] = await db
          .select()
          .from(organizationApplications)
          .where(eq(organizationApplications.applicationId, applicationId))
          .limit(1);

        if (orgApp) {
          application = orgApp;
          applicationType = 'organization';
        }
      }

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      // Record decision
      await db.insert(registryDecisions).values({
        applicationType,
        applicationIdFk: applicationId,
        decision: decision as any,
        reasons,
        decidedBy: userId,
        decidedAt: new Date()
      });

      // Update application status based on decision
      const newStatus = decision === 'accepted' ? 'accepted' : 'rejected';
      
      const updateData = { 
        status: newStatus as any, 
        updatedAt: new Date()
      };

      // If approved, generate member number
      if (decision === 'accepted') {
        const memberNumber = await nextMemberNumber(applicationType);
        Object.assign(updateData, { memberId: memberNumber });
      }

      if (applicationType === 'individual') {
        await db
          .update(individualApplications)
          .set(updateData)
          .where(eq(individualApplications.applicationId, applicationId));
      } else {
        await db
          .update(organizationApplications)
          .set(updateData)
          .where(eq(organizationApplications.applicationId, applicationId));
      }

      // Log status change
      await db.insert(statusHistory).values({
        applicationType,
        applicationIdFk: applicationId,
        fromStatus: application.status || 'draft',
        toStatus: newStatus,
        actorUserId: userId,
        comment: `Application ${decision} by registry`
      });

      res.json({
        applicationId,
        decision,
        status: newStatus,
        memberNumber: (updateData as any).memberId,
        message: `Application ${decision} successfully`
      });

    } catch (error: any) {
      console.error('Registry decision error:', error);
      res.status(500).json({ message: 'Failed to record decision' });
    }
  });

}