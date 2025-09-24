// Extend express-session types to include custom properties
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    // Individual applicant session properties
    applicantId?: string;
    applicantDbId?: string;
    
    // Organization applicant session properties
    organizationApplicantId?: string;
    isOrganizationApplicant?: boolean;
    
    // Other custom session properties
    draftId?: string;
  }
}

// Extend Express Request to include custom properties
declare global {
  namespace Express {
    interface Request {
      authType?: 'user' | 'applicant' | 'organizationApplicant';
      authUserId?: string;
      applicantId?: string;
    }
  }
}