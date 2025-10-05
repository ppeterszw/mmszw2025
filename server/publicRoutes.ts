import type { Express } from "express";
import { z } from "zod";
import { db } from "./db";
import { applicants, organizationApplicants } from "@shared/schema";
import { storage } from "./storage";
import { eq } from "drizzle-orm";
import { nextApplicationId } from "./services/namingSeries";
import { sendEmail, generateWelcomeEmail, generateVerificationEmail, generateOrgApplicantVerificationEmail } from "./services/emailService";
import crypto from "crypto";

// Validation schemas
const individualRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const organizationRegistrationSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function registerPublicRoutes(app: Express) {
  // === APPLICANT REGISTRATION ENDPOINTS ===

  /**
   * Individual applicant registration
   * POST /api/applicants/register
   */
  app.post("/api/applicants/register", async (req, res) => {
    try {
      const registrationData = individualRegistrationSchema.parse(req.body);

      // Check if email already exists
      const existingApplicant = await db
        .select()
        .from(applicants)
        .where(eq(applicants.email, registrationData.email))
        .limit(1);

      if (existingApplicant.length > 0) {
        return res.status(409).json({
          error: "Email already registered",
          message: "An applicant with this email address already exists."
        });
      }

      // Generate applicant ID using existing naming series
      const applicantId = await nextApplicationId('individual');

      // Generate verification token
      const verificationToken = generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create applicant record
      const [newApplicant] = await db.insert(applicants).values({
        applicantId,
        firstName: registrationData.firstName,
        surname: registrationData.surname,
        email: registrationData.email,
        status: 'registered',
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }).returning();

      // Send welcome email with applicant ID (with 5 second timeout)
      const sendEmailsWithTimeout = async () => {
        const fullName = `${registrationData.firstName} ${registrationData.surname}`;
        const welcomeEmail = generateWelcomeEmail(fullName, applicantId);

        await sendEmail({
          to: registrationData.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...welcomeEmail
        });

        // Send verification email
        const baseUrl = process.env.NODE_ENV === 'production'
          ? `https://${process.env.REPL_SLUG}.${process.env.REPLIT_DEV_DOMAIN}`
          : 'http://localhost:5000';

        const verificationEmail = generateVerificationEmail(fullName, verificationToken, baseUrl);

        await sendEmail({
          to: registrationData.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...verificationEmail
        });

        console.log(`Welcome and verification emails sent to: ${registrationData.email}`);
      };

      // Send emails with timeout (wait up to 5 seconds)
      await Promise.race([
        sendEmailsWithTimeout(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Email sending timeout')), 5000))
      ]).catch(emailError => {
        console.error('Failed to send welcome/verification emails:', emailError);
        // Don't fail the registration if email fails
      });

      res.status(201).json({
        success: true,
        applicantId,
        message: "Registration successful! Please check your email for your Applicant ID and verification instructions."
      });

    } catch (error: any) {
      console.error('Individual registration error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors
        });
      }
      res.status(500).json({
        error: "Registration failed",
        message: "An error occurred during registration. Please try again."
      });
    }
  });

  /**
   * Organization applicant registration
   * POST /api/organization-applicants/register
   */
  app.post("/api/organization-applicants/register", async (req, res) => {
    try {
      const registrationData = organizationRegistrationSchema.parse(req.body);

      // Check if email already exists
      const existingApplicant = await db
        .select()
        .from(organizationApplicants)
        .where(eq(organizationApplicants.email, registrationData.email))
        .limit(1);

      if (existingApplicant.length > 0) {
        return res.status(409).json({
          error: "Email already registered",
          message: "An organization applicant with this email address already exists."
        });
      }

      // Generate applicant ID using existing naming series
      const applicantId = await nextApplicationId('organization');

      // Generate verification token
      const verificationToken = generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create organization applicant record
      const [newApplicant] = await db.insert(organizationApplicants).values({
        applicantId,
        companyName: registrationData.companyName,
        email: registrationData.email,
        status: 'registered',
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }).returning();

      // Send verification email with timeout
      const sendEmailWithTimeout = async () => {
        const verificationEmail = generateOrgApplicantVerificationEmail(
          registrationData.companyName,
          verificationToken
        );

        await sendEmail({
          to: registrationData.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...verificationEmail
        });

        console.log(`Organization verification email sent to: ${registrationData.email}`);
      };

      // Send email with timeout (wait up to 5 seconds)
      await Promise.race([
        sendEmailWithTimeout(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Email sending timeout')), 5000))
      ]).catch(emailError => {
        console.error('Failed to send organization verification email:', emailError);
        // Don't fail the registration if email fails
      });

      res.status(201).json({
        success: true,
        applicantId,
        message: "Registration successful! Please check your email for verification instructions."
      });

    } catch (error: any) {
      console.error('Organization registration error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors
        });
      }
      res.status(500).json({
        error: "Registration failed",
        message: "An error occurred during registration. Please try again."
      });
    }
  });

  /**
   * Email verification endpoint
   * POST /api/applicants/verify-email
   */
  app.post("/api/applicants/verify-email", async (req, res) => {
    try {
      const { token, applicantId } = req.body;

      if (!token) {
        return res.status(400).json({
          error: "Verification token is required"
        });
      }

      // Try individual applicants first
      const [individualApplicant] = await db
        .select()
        .from(applicants)
        .where(eq(applicants.emailVerificationToken, token))
        .limit(1);

      if (individualApplicant) {
        // Check if token is expired
        if (individualApplicant.emailVerificationExpires && new Date() > individualApplicant.emailVerificationExpires) {
          return res.status(400).json({
            error: "Verification token has expired",
            message: "Please request a new verification email."
          });
        }

        // Update applicant as verified
        await db
          .update(applicants)
          .set({
            emailVerified: true,
            status: 'email_verified',
            emailVerificationToken: null,
            emailVerificationExpires: null,
            updatedAt: new Date()
          })
          .where(eq(applicants.id, individualApplicant.id));

        return res.json({
          success: true,
          applicantId: individualApplicant.applicantId,
          applicantType: 'individual',
          message: "Email verified successfully! You can now continue with your application."
        });
      }

      // Try organization applicants
      const [orgApplicant] = await db
        .select()
        .from(organizationApplicants)
        .where(eq(organizationApplicants.emailVerificationToken, token))
        .limit(1);

      if (orgApplicant) {
        // Check if token is expired
        if (orgApplicant.emailVerificationExpires && new Date() > orgApplicant.emailVerificationExpires) {
          return res.status(400).json({
            error: "Verification token has expired",
            message: "Please request a new verification email."
          });
        }

        // Update applicant as verified
        await db
          .update(organizationApplicants)
          .set({
            emailVerified: true,
            status: 'email_verified',
            emailVerificationToken: null,
            emailVerificationExpires: null,
            updatedAt: new Date()
          })
          .where(eq(organizationApplicants.id, orgApplicant.id));

        return res.json({
          success: true,
          applicantId: orgApplicant.applicantId,
          applicantType: 'organization',
          message: "Email verified successfully! You can now continue with your application."
        });
      }

      // Token not found
      return res.status(404).json({
        error: "Invalid verification token",
        message: "The verification token is invalid or has already been used."
      });

    } catch (error: any) {
      console.error('Email verification error:', error);
      res.status(500).json({
        error: "Verification failed",
        message: "An error occurred during email verification. Please try again."
      });
    }
  });

  /**
   * Resend welcome and verification emails
   * POST /api/applicants/resend-emails
   */
  app.post("/api/applicants/resend-emails", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: "Email is required"
        });
      }

      // Try to find individual applicant
      const [individualApplicant] = await db
        .select()
        .from(applicants)
        .where(eq(applicants.email, email))
        .limit(1);

      if (individualApplicant) {
        // Generate new verification token if not verified
        const verificationToken = generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Update verification token
        await db
          .update(applicants)
          .set({
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            updatedAt: new Date()
          })
          .where(eq(applicants.id, individualApplicant.id));

        // Send emails
        const fullName = `${individualApplicant.firstName} ${individualApplicant.surname}`;
        const welcomeEmail = generateWelcomeEmail(fullName, individualApplicant.applicantId);

        await Promise.race([
          (async () => {
            await sendEmail({
              to: email,
              from: 'sysadmin@estateagentscouncil.org',
              ...welcomeEmail
            });

            const baseUrl = process.env.NODE_ENV === 'production'
              ? `https://${process.env.REPL_SLUG}.${process.env.REPLIT_DEV_DOMAIN}`
              : 'http://localhost:5000';

            const verificationEmail = generateVerificationEmail(fullName, verificationToken, baseUrl);

            await sendEmail({
              to: email,
              from: 'sysadmin@estateagentscouncil.org',
              ...verificationEmail
            });
          })(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Email sending timeout')), 5000))
        ]).catch(emailError => {
          console.error('Failed to resend emails:', emailError);
        });

        return res.json({
          success: true,
          message: "Welcome and verification emails have been resent. Please check your inbox."
        });
      }

      // Try organization applicants
      const [orgApplicant] = await db
        .select()
        .from(organizationApplicants)
        .where(eq(organizationApplicants.email, email))
        .limit(1);

      if (orgApplicant) {
        // Generate new verification token
        const verificationToken = generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Update verification token
        await db
          .update(organizationApplicants)
          .set({
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            updatedAt: new Date()
          })
          .where(eq(organizationApplicants.id, orgApplicant.id));

        // Send verification email
        await Promise.race([
          (async () => {
            const verificationEmail = generateOrgApplicantVerificationEmail(
              orgApplicant.companyName,
              verificationToken
            );

            await sendEmail({
              to: email,
              from: 'sysadmin@estateagentscouncil.org',
              ...verificationEmail
            });
          })(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Email sending timeout')), 5000))
        ]).catch(emailError => {
          console.error('Failed to resend emails:', emailError);
        });

        return res.json({
          success: true,
          message: "Verification email has been resent. Please check your inbox."
        });
      }

      // Email not found
      return res.status(404).json({
        error: "Email not found",
        message: "No applicant found with this email address."
      });

    } catch (error: any) {
      console.error('Resend emails error:', error);
      res.status(500).json({
        error: "Failed to resend emails",
        message: "An error occurred while resending emails. Please try again."
      });
    }
  });

  /**
   * Applicant login endpoint (using Applicant ID as password)
   * POST /api/applicants/login
   */
  app.post("/api/applicants/login", async (req, res) => {
    try {
      const { email, applicantId } = req.body;

      if (!email || !applicantId) {
        return res.status(400).json({
          error: "Email and Applicant ID are required"
        });
      }

      // Try individual applicants first
      const [individualApplicant] = await db
        .select()
        .from(applicants)
        .where(eq(applicants.email, email))
        .limit(1);

      if (individualApplicant && individualApplicant.applicantId === applicantId) {
        if (!individualApplicant.emailVerified) {
          return res.status(401).json({
            error: "Email not verified",
            message: "Please verify your email address before logging in."
          });
        }

        return res.json({
          success: true,
          applicantId: individualApplicant.applicantId,
          applicantType: 'individual',
          name: `${individualApplicant.firstName} ${individualApplicant.surname}`,
          email: individualApplicant.email,
          status: individualApplicant.status,
          message: "Login successful"
        });
      }

      // Try organization applicants
      const [orgApplicant] = await db
        .select()
        .from(organizationApplicants)
        .where(eq(organizationApplicants.email, email))
        .limit(1);

      if (orgApplicant && orgApplicant.applicantId === applicantId) {
        if (!orgApplicant.emailVerified) {
          return res.status(401).json({
            error: "Email not verified",
            message: "Please verify your email address before logging in."
          });
        }

        return res.json({
          success: true,
          applicantId: orgApplicant.applicantId,
          applicantType: 'organization',
          name: orgApplicant.companyName,
          email: orgApplicant.email,
          status: orgApplicant.status,
          message: "Login successful"
        });
      }

      // Invalid credentials
      return res.status(401).json({
        error: "Invalid credentials",
        message: "The email and Applicant ID combination is incorrect."
      });

    } catch (error: any) {
      console.error('Applicant login error:', error);
      res.status(500).json({
        error: "Login failed",
        message: "An error occurred during login. Please try again."
      });
    }
  });

  // === PUBLIC VERIFICATION ENDPOINTS ===

  // Public verification endpoint - no authentication required
  app.get("/api/public/verify/:membershipNumber", async (req, res) => {
    try {
      const { membershipNumber } = req.params;
      
      if (!membershipNumber) {
        return res.status(400).json({ error: "Membership number is required" });
      }

      // Search in both members and organizations
      const member = await storage.getMemberByMembershipNumber(membershipNumber);
      if (member) {
        // Return member information for verification
        return res.json({
          type: "member",
          membershipNumber: member.membershipNumber,
          firstName: member.firstName,
          lastName: member.lastName,
          memberType: member.memberType,
          status: member.membershipStatus, // Use 'status' for consistency with frontend
          createdAt: member.createdAt,
          expiryDate: member.expiryDate
        });
      }

      // Try organization lookup by registration number
      const organization = await storage.getOrganizationByRegistrationNumber(membershipNumber);
      
      if (organization) {
        // Return organization information for verification
        return res.json({
          type: "organization",
          membershipNumber: organization.registrationNumber,
          name: organization.name,
          organizationType: organization.type,
          status: organization.membershipStatus, // Use 'status' for consistency with frontend
          createdAt: organization.createdAt,
          expiryDate: organization.expiryDate
        });
      }

      // No registration found
      return res.status(404).json({ error: "Registration not found" });
      
    } catch (error) {
      console.error("Public verification error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Alternative endpoint that accepts query parameter
  app.get("/api/public/verify", async (req, res) => {
    const membershipNumber = req.query.member as string;
    if (membershipNumber) {
      // Redirect to the main verification endpoint
      return res.redirect(307, `/api/public/verify/${encodeURIComponent(membershipNumber)}`);
    }
    
    return res.status(400).json({ error: "Membership number is required" });
  });

  // Public members directory endpoint - limited data for verification
  app.get("/api/public/members", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      
      // Return only safe, public information for verification purposes
      const publicMembers = members
        .filter(member => member.membershipStatus === "active")
        .map(member => ({
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          membershipNumber: member.membershipNumber,
          memberType: member.memberType,
          membershipStatus: member.membershipStatus
        }));

      res.json(publicMembers);
    } catch (error) {
      console.error("Public members directory error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Public organizations directory endpoint - limited data for verification
  app.get("/api/public/organizations", async (req, res) => {
    try {
      const organizations = await storage.getAllOrganizations();
      
      // Return only safe, public information for verification purposes
      const publicOrganizations = organizations
        .filter(org => org.membershipStatus === "active")
        .map(org => ({
          id: org.id,
          name: org.name,
          registrationNumber: org.registrationNumber,
          membershipStatus: org.membershipStatus
        }));

      res.json(publicOrganizations);
    } catch (error) {
      console.error("Public organizations directory error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}