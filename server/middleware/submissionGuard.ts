import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { individualApplications, organizationApplications } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface ApplicationSubmissionRequest extends Request {
  body: {
    applicationId?: string;
    applicationType?: 'individual' | 'organization';
  };
  query: {
    submit?: string;
  };
}

/**
 * Middleware to ensure application fee is paid before submission
 * Blocks submission unless:
 * 1. feeRequired is false, OR
 * 2. feeStatus is 'settled', OR  
 * 3. feeProofDocId is present (POP uploaded)
 */
export async function requireApplicationFee(
  req: ApplicationSubmissionRequest, 
  res: Response, 
  next: NextFunction
) {
  try {
    // Only apply this guard when submitting (not for drafts)
    if (req.query.submit !== 'true') {
      return next();
    }

    const { applicationId, applicationType } = req.body;

    if (!applicationId || !applicationType) {
      return res.status(400).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Bad Request',
        status: 400,
        detail: 'Application ID and type are required',
        code: 'MISSING_APPLICATION_DATA'
      });
    }

    let application: any = null;

    // Fetch application based on type
    if (applicationType === 'individual') {
      const results = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.applicationId, applicationId))
        .limit(1);
      application = results[0];
    } else if (applicationType === 'organization') {
      const results = await db
        .select()
        .from(organizationApplications)
        .where(eq(organizationApplications.applicationId, applicationId))
        .limit(1);
      application = results[0];
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

    // Check fee requirements
    const feeRequired = application.feeRequired ?? true;
    const feeStatus = application.feeStatus || 'pending';
    const feeProofDocId = application.feeProofDocId;

    // Allow submission if fee is not required
    if (!feeRequired) {
      return next();
    }

    // Allow submission if fee is settled
    if (feeStatus === 'settled') {
      return next();
    }

    // Allow submission if proof of payment is uploaded
    if (feeProofDocId) {
      return next();
    }

    // Block submission - fee required but not satisfied
    return res.status(409).json({
      type: 'https://tools.ietf.org/html/rfc7807',
      title: 'Payment Required',
      status: 409,
      detail: 'Application fee must be paid before submission. Either pay via Paynow or upload proof of payment.',
      code: 'FEE_REQUIRED',
      instance: `/applications/${applicationId}`,
      feeAmount: application.feeAmount,
      feeCurrency: application.feeCurrency || 'USD',
      feeStatus: feeStatus,
      paymentOptions: [
        {
          method: 'paynow',
          description: 'Pay online using EcoCash, OneMoney, or bank transfer',
          endpoint: `/api/public/applications/${applicationId}/fee/initiate`
        },
        {
          method: 'proof_upload',
          description: 'Upload proof of payment if already paid',
          endpoint: `/api/public/applications/${applicationId}/documents`,
          docType: 'application_fee_pop'
        }
      ]
    });

  } catch (error) {
    console.error('Submission guard error:', error);
    return res.status(500).json({
      type: 'https://tools.ietf.org/html/rfc7807',
      title: 'Internal Server Error',
      status: 500,
      detail: 'Unable to verify payment status',
      code: 'PAYMENT_VERIFICATION_ERROR'
    });
  }
}

/**
 * Middleware to validate application is in correct state for submission
 */
export async function validateApplicationState(
  req: ApplicationSubmissionRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Only apply when submitting
    if (req.query.submit !== 'true') {
      return next();
    }

    const { applicationId, applicationType } = req.body;

    if (!applicationId || !applicationType) {
      return next(); // Let other middleware handle this
    }

    let application: any = null;

    // Fetch application to check status
    if (applicationType === 'individual') {
      const results = await db
        .select()
        .from(individualApplications)
        .where(eq(individualApplications.applicationId, applicationId))
        .limit(1);
      application = results[0];
    } else if (applicationType === 'organization') {
      const results = await db
        .select()
        .from(organizationApplications)
        .where(eq(organizationApplications.applicationId, applicationId))
        .limit(1);
      application = results[0];
    }

    if (!application) {
      return next(); // Let other middleware handle this
    }

    // Check if application is in submittable state
    const validStatuses = ['draft', 'needs_applicant_action'];
    
    if (!validStatuses.includes(application.status)) {
      return res.status(409).json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Invalid Application State',
        status: 409,
        detail: `Application cannot be submitted in current state: ${application.status}`,
        code: 'INVALID_APPLICATION_STATE',
        currentStatus: application.status,
        allowedStatuses: validStatuses
      });
    }

    next();

  } catch (error) {
    console.error('Application state validation error:', error);
    return res.status(500).json({
      type: 'https://tools.ietf.org/html/rfc7807',
      title: 'Internal Server Error',
      status: 500,
      detail: 'Unable to validate application state',
      code: 'STATE_VALIDATION_ERROR'
    });
  }
}

/**
 * Combined middleware that applies all submission guards
 */
export function applicationSubmissionGuards() {
  return [
    validateApplicationState,
    requireApplicationFee
  ];
}