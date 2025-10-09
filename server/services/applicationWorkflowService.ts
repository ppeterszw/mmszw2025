import { db } from "../db";
import { eq } from "drizzle-orm";
import {
  individualApplications,
  organizationApplications,
  members,
  organizations,
  users
} from "@shared/schema";
import type { Member, Organization } from "@shared/schema";
import { storage } from "../storage";
import { sendEmail } from "./emailService";
import { nextMemberNumber } from "./namingSeries";

/**
 * Application Workflow Service
 * Handles the complete application lifecycle:
 * 1. under_review -> Documents Review -> Payment Review -> Final Approval -> Member/Org Creation
 */

interface WorkflowTransitionData {
  applicationId: string;
  applicationType: 'individual' | 'organization';
  reviewerId: string;
  notes?: string;
}

// Email templates for workflow stages
export function generateUnderReviewEmail(
  applicantName: string,
  applicationId: string,
  applicationType: 'individual' | 'organization'
): { subject: string; html: string; text: string } {
  const typeDisplay = applicationType === 'individual' ? 'Individual Membership' : 'Organization Registration';
  const subject = `Application Under Review - ${applicationId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
        .header { background: #1034A6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9f9f9; }
        .status-box { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0284c7; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Under Review</h1>
        </div>
        <div class="content">
          <h2>Hello ${applicantName},</h2>
          <p>Your ${typeDisplay} application has been submitted and is now under review by our team.</p>

          <div class="status-box">
            <h3 style="margin-top: 0;">Application Status: Under Review</h3>
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p><strong>Current Stage:</strong> Initial Review</p>
            <p><strong>Next Stage:</strong> Document Verification</p>
          </div>

          <p><strong>What happens next:</strong></p>
          <ol>
            <li>Our Member Manager and Administrator will review your application</li>
            <li>We will verify all submitted documents</li>
            <li>You may be contacted if additional information is needed</li>
            <li>Once reviewed, your application will proceed to document verification</li>
          </ol>

          <p>We aim to complete the initial review within 5-7 business days.</p>

          <p>If you have any questions, please contact us at info@eacz.co.zw</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Application Under Review - ${applicationId}

    Hello ${applicantName},

    Your ${typeDisplay} application has been submitted and is now under review by our team.

    Application Status: Under Review
    Application ID: ${applicationId}
    Current Stage: Initial Review
    Next Stage: Document Verification

    What happens next:
    1. Our Member Manager and Administrator will review your application
    2. We will verify all submitted documents
    3. You may be contacted if additional information is needed
    4. Once reviewed, your application will proceed to document verification

    We aim to complete the initial review within 5-7 business days.

    If you have any questions, please contact us at info@eacz.co.zw

    © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;

  return { subject, html, text };
}

export function generateDocumentReviewEmail(
  applicantName: string,
  applicationId: string,
  applicationType: 'individual' | 'organization'
): { subject: string; html: string; text: string } {
  const typeDisplay = applicationType === 'individual' ? 'Individual Membership' : 'Organization Registration';
  const subject = `Document Review Stage - ${applicationId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
        .header { background: #1034A6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9f9f9; }
        .status-box { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Document Review In Progress</h1>
        </div>
        <div class="content">
          <h2>Hello ${applicantName},</h2>
          <p>Good news! Your ${typeDisplay} application has passed initial review and is now in the document verification stage.</p>

          <div class="status-box">
            <h3 style="margin-top: 0;">Application Status: Document Review</h3>
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p><strong>Current Stage:</strong> Document Verification</p>
            <p><strong>Next Stage:</strong> Payment Review</p>
          </div>

          <p><strong>What's happening now:</strong></p>
          <ul>
            <li>Our Administrator is reviewing all uploaded documents</li>
            <li>Documents are being verified for authenticity and completeness</li>
            <li>We may contact you if any documents need clarification or resubmission</li>
          </ul>

          <p>Document verification typically takes 3-5 business days.</p>

          <p>If you have any questions, please contact us at info@eacz.co.zw</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Document Review In Progress - ${applicationId}

    Hello ${applicantName},

    Good news! Your ${typeDisplay} application has passed initial review and is now in the document verification stage.

    Application Status: Document Review
    Application ID: ${applicationId}
    Current Stage: Document Verification
    Next Stage: Payment Review

    What's happening now:
    - Our Administrator is reviewing all uploaded documents
    - Documents are being verified for authenticity and completeness
    - We may contact you if any documents need clarification or resubmission

    Document verification typically takes 3-5 business days.

    If you have any questions, please contact us at info@eacz.co.zw

    © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;

  return { subject, html, text };
}

export function generatePaymentReviewEmail(
  applicantName: string,
  applicationId: string,
  applicationType: 'individual' | 'organization'
): { subject: string; html: string; text: string } {
  const typeDisplay = applicationType === 'individual' ? 'Individual Membership' : 'Organization Registration';
  const subject = `Payment Review - ${applicationId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
        .header { background: #1034A6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9f9f9; }
        .status-box { background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Review</h1>
        </div>
        <div class="content">
          <h2>Hello ${applicantName},</h2>
          <p>Excellent progress! Your ${typeDisplay} application documents have been verified and we are now reviewing your payment.</p>

          <div class="status-box">
            <h3 style="margin-top: 0;">Application Status: Payment Review</h3>
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p><strong>Current Stage:</strong> Payment Verification</p>
            <p><strong>Next Stage:</strong> Final Approval</p>
          </div>

          <p><strong>What's happening now:</strong></p>
          <ul>
            <li>Our Administrator is verifying your payment details</li>
            <li>Payment confirmation is being processed</li>
            <li>Once confirmed, your application will proceed to final approval</li>
          </ul>

          <p>Payment verification typically takes 1-2 business days.</p>

          <p>You're almost there! Once payment is confirmed, we'll proceed with final approval and membership activation.</p>

          <p>If you have any questions, please contact us at info@eacz.co.zw</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Payment Review - ${applicationId}

    Hello ${applicantName},

    Excellent progress! Your ${typeDisplay} application documents have been verified and we are now reviewing your payment.

    Application Status: Payment Review
    Application ID: ${applicationId}
    Current Stage: Payment Verification
    Next Stage: Final Approval

    What's happening now:
    - Our Administrator is verifying your payment details
    - Payment confirmation is being processed
    - Once confirmed, your application will proceed to final approval

    Payment verification typically takes 1-2 business days.

    You're almost there! Once payment is confirmed, we'll proceed with final approval and membership activation.

    If you have any questions, please contact us at info@eacz.co.zw

    © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;

  return { subject, html, text };
}

// Notification emails for administrators
export function generateAdminNotificationEmail(
  adminName: string,
  applicationId: string,
  applicantName: string,
  stage: string,
  applicationType: 'individual' | 'organization'
): { subject: string; html: string; text: string } {
  const typeDisplay = applicationType === 'individual' ? 'Individual Membership' : 'Organization Registration';
  const subject = `Action Required: ${stage} - ${applicationId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9f9f9; }
        .action-box { background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
        .button { display: inline-block; background: #1034A6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Requires Your Review</h1>
        </div>
        <div class="content">
          <h2>Hello ${adminName},</h2>
          <p>An application requires your attention and review.</p>

          <div class="action-box">
            <h3 style="margin-top: 0;">Action Required</h3>
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p><strong>Applicant:</strong> ${applicantName}</p>
            <p><strong>Type:</strong> ${typeDisplay}</p>
            <p><strong>Stage:</strong> ${stage}</p>
          </div>

          <p>Please log in to the admin panel to review this application.</p>

          <div style="text-align: center;">
            <a href="https://mms.estateagentscouncil.org/admin/applications" class="button">Review Application</a>
          </div>

          <p>If you have any questions, please contact the system administrator.</p>
        </div>
        <div class="footer">
          <p>© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Application Requires Your Review - ${applicationId}

    Hello ${adminName},

    An application requires your attention and review.

    Action Required:
    - Application ID: ${applicationId}
    - Applicant: ${applicantName}
    - Type: ${typeDisplay}
    - Stage: ${stage}

    Please log in to the admin panel to review this application:
    https://mms.estateagentscouncil.org/admin/applications

    If you have any questions, please contact the system administrator.

    © 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;

  return { subject, html, text };
}

/**
 * Transition application to Under Review stage
 */
export async function moveToUnderReview(data: WorkflowTransitionData): Promise<void> {
  const { applicationId, applicationType, reviewerId } = data;

  // Update application status
  if (applicationType === 'individual') {
    await db.update(individualApplications)
      .set({
        status: 'under_review',
        reviewedBy: reviewerId,
        reviewStartedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(individualApplications.id, applicationId));

    // Get application details
    const [app] = await db.select().from(individualApplications)
      .where(eq(individualApplications.id, applicationId));

    if (app) {
      const personal = typeof app.personal === 'string' ? JSON.parse(app.personal) : app.personal;
      const applicantName = `${personal.firstName} ${personal.lastName}`;

      // Send email to applicant
      const email = generateUnderReviewEmail(applicantName, app.applicationId, 'individual');
      await sendEmail({
        to: app.applicantEmail,
        from: 'sysadmin@estateagentscouncil.org',
        ...email
      });

      // Notify administrators and member managers
      const admins = await storage.getUsersByRole('admin');
      const memberManagers = await storage.getUsersByRole('member_manager');
      const notifyUsers = [...admins, ...memberManagers];

      for (const user of notifyUsers) {
        const adminEmail = generateAdminNotificationEmail(
          user.fullName || user.email,
          app.applicationId,
          applicantName,
          'Under Review',
          'individual'
        );
        await sendEmail({
          to: user.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...adminEmail
        });
      }
    }
  } else {
    await db.update(organizationApplications)
      .set({
        status: 'under_review',
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(organizationApplications.id, applicationId));

    // Get application details
    const [app] = await db.select().from(organizationApplications)
      .where(eq(organizationApplications.id, applicationId));

    if (app) {
      const company = typeof app.company === 'string' ? JSON.parse(app.company) : app.company;
      const companyName = company.name || 'Organization';

      // Send email to applicant
      const email = generateUnderReviewEmail(companyName, app.applicationId, 'organization');
      await sendEmail({
        to: app.applicantEmail,
        from: 'sysadmin@estateagentscouncil.org',
        ...email
      });

      // Notify administrators and member managers
      const admins = await storage.getUsersByRole('admin');
      const memberManagers = await storage.getUsersByRole('member_manager');
      const notifyUsers = [...admins, ...memberManagers];

      for (const user of notifyUsers) {
        const adminEmail = generateAdminNotificationEmail(
          user.fullName || user.email,
          app.applicationId,
          companyName,
          'Under Review',
          'organization'
        );
        await sendEmail({
          to: user.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...adminEmail
        });
      }
    }
  }
}

/**
 * Transition application to Document Review stage
 */
export async function moveToDocumentReview(data: WorkflowTransitionData): Promise<void> {
  const { applicationId, applicationType, reviewerId } = data;

  // Update application status
  if (applicationType === 'individual') {
    await db.update(individualApplications)
      .set({
        status: 'document_review',
        reviewedBy: reviewerId,
        updatedAt: new Date()
      })
      .where(eq(individualApplications.id, applicationId));

    // Get application details
    const [app] = await db.select().from(individualApplications)
      .where(eq(individualApplications.id, applicationId));

    if (app) {
      const personal = typeof app.personal === 'string' ? JSON.parse(app.personal) : app.personal;
      const applicantName = `${personal.firstName} ${personal.lastName}`;

      // Send email to applicant
      const email = generateDocumentReviewEmail(applicantName, app.applicationId, 'individual');
      await sendEmail({
        to: app.applicantEmail,
        from: 'sysadmin@estateagentscouncil.org',
        ...email
      });

      // Notify administrators
      const admins = await storage.getUsersByRole('admin');
      for (const admin of admins) {
        const adminEmail = generateAdminNotificationEmail(
          admin.fullName || admin.email,
          app.applicationId,
          applicantName,
          'Document Review',
          'individual'
        );
        await sendEmail({
          to: admin.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...adminEmail
        });
      }
    }
  } else {
    await db.update(organizationApplications)
      .set({
        status: 'document_review',
        reviewedBy: reviewerId,
        updatedAt: new Date()
      })
      .where(eq(organizationApplications.id, applicationId));

    // Get application details
    const [app] = await db.select().from(organizationApplications)
      .where(eq(organizationApplications.id, applicationId));

    if (app) {
      const company = typeof app.company === 'string' ? JSON.parse(app.company) : app.company;
      const companyName = company.name || 'Organization';

      // Send email to applicant
      const email = generateDocumentReviewEmail(companyName, app.applicationId, 'organization');
      await sendEmail({
        to: app.applicantEmail,
        from: 'sysadmin@estateagentscouncil.org',
        ...email
      });

      // Notify administrators
      const admins = await storage.getUsersByRole('admin');
      for (const admin of admins) {
        const adminEmail = generateAdminNotificationEmail(
          admin.fullName || admin.email,
          app.applicationId,
          companyName,
          'Document Review',
          'organization'
        );
        await sendEmail({
          to: admin.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...adminEmail
        });
      }
    }
  }
}

/**
 * Transition application to Payment Review stage
 */
export async function moveToPaymentReview(data: WorkflowTransitionData): Promise<void> {
  const { applicationId, applicationType, reviewerId } = data;

  // Update application status
  if (applicationType === 'individual') {
    await db.update(individualApplications)
      .set({
        status: 'payment_received', // Use existing enum value
        reviewedBy: reviewerId,
        updatedAt: new Date()
      })
      .where(eq(individualApplications.id, applicationId));

    // Get application details
    const [app] = await db.select().from(individualApplications)
      .where(eq(individualApplications.id, applicationId));

    if (app) {
      const personal = typeof app.personal === 'string' ? JSON.parse(app.personal) : app.personal;
      const applicantName = `${personal.firstName} ${personal.lastName}`;

      // Send email to applicant
      const email = generatePaymentReviewEmail(applicantName, app.applicationId, 'individual');
      await sendEmail({
        to: app.applicantEmail,
        from: 'sysadmin@estateagentscouncil.org',
        ...email
      });

      // Notify administrators
      const admins = await storage.getUsersByRole('admin');
      for (const admin of admins) {
        const adminEmail = generateAdminNotificationEmail(
          admin.fullName || admin.email,
          app.applicationId,
          applicantName,
          'Payment Review',
          'individual'
        );
        await sendEmail({
          to: admin.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...adminEmail
        });
      }
    }
  } else {
    await db.update(organizationApplications)
      .set({
        status: 'payment_received',
        reviewedBy: reviewerId,
        updatedAt: new Date()
      })
      .where(eq(organizationApplications.id, applicationId));

    // Get application details
    const [app] = await db.select().from(organizationApplications)
      .where(eq(organizationApplications.id, applicationId));

    if (app) {
      const company = typeof app.company === 'string' ? JSON.parse(app.company) : app.company;
      const companyName = company.name || 'Organization';

      // Send email to applicant
      const email = generatePaymentReviewEmail(companyName, app.applicationId, 'organization');
      await sendEmail({
        to: app.applicantEmail,
        from: 'sysadmin@estateagentscouncil.org',
        ...email
      });

      // Notify administrators
      const admins = await storage.getUsersByRole('admin');
      for (const admin of admins) {
        const adminEmail = generateAdminNotificationEmail(
          admin.fullName || admin.email,
          app.applicationId,
          companyName,
          'Payment Review',
          'organization'
        );
        await sendEmail({
          to: admin.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...adminEmail
        });
      }
    }
  }
}

/**
 * Final approval - Creates actual Member or Organization record
 * This is where the approved application becomes a full member/organization
 */
export async function approveAndCreateMember(data: WorkflowTransitionData): Promise<Member | Organization> {
  const { applicationId, applicationType, reviewerId, notes } = data;

  if (applicationType === 'individual') {
    // Get application
    const [app] = await db.select().from(individualApplications)
      .where(eq(individualApplications.id, applicationId));

    if (!app) {
      throw new Error('Application not found');
    }

    // Parse personal data
    const personal = typeof app.personal === 'string' ? JSON.parse(app.personal) : app.personal;

    // Generate membership number
    const membershipNumber = await nextMemberNumber('individual');

    // Calculate expiry date (1 year from now)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Create member record
    const [newMember] = await db.insert(members).values({
      membershipNumber,
      firstName: personal.firstName,
      lastName: personal.lastName,
      email: app.applicantEmail,
      phone: personal.phone || '',
      memberType: app.memberType,
      membershipStatus: 'active',
      expiryDate,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Update application
    await db.update(individualApplications)
      .set({
        status: 'approved',
        reviewedBy: reviewerId,
        reviewNotes: notes,
        approvedAt: new Date(),
        createdMemberId: newMember.id,
        updatedAt: new Date()
      })
      .where(eq(individualApplications.id, applicationId));

    // TODO: Generate and send certificate with QR code
    // This will be implemented in the next phase

    return newMember;
  } else {
    // Get application
    const [app] = await db.select().from(organizationApplications)
      .where(eq(organizationApplications.id, applicationId));

    if (!app) {
      throw new Error('Application not found');
    }

    // Parse company data
    const company = typeof app.company === 'string' ? JSON.parse(app.company) : app.company;

    // Generate registration number
    const registrationNumber = await nextMemberNumber('organization');

    // Calculate expiry date (1 year from now)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Create organization record
    const [newOrg] = await db.insert(organizations).values({
      organizationId: registrationNumber,
      name: company.name,
      businessType: app.businessType,
      registrationNumber,
      email: app.applicantEmail,
      phone: company.phone || '',
      physicalAddress: company.physicalAddress || '',
      status: 'active',
      expiryDate,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Update application
    await db.update(organizationApplications)
      .set({
        status: 'approved',
        reviewedBy: reviewerId,
        reviewNotes: notes,
        approvedAt: new Date(),
        createdOrganizationId: newOrg.id,
        updatedAt: new Date()
      })
      .where(eq(organizationApplications.id, applicationId));

    // TODO: Generate and send certificate with QR code
    // This will be implemented in the next phase

    return newOrg;
  }
}
