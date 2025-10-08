/**
 * Application Constants
 * Central location for all magic numbers and strings
 */

// ============================================================================
// AGE & ELIGIBILITY
// ============================================================================

export const AGE = {
  MINIMUM: 18,
  MATURE_ENTRY: 25,
} as const;

// ============================================================================
// SESSION & AUTHENTICATION
// ============================================================================

export const SESSION = {
  DURATION_MS: 8 * 60 * 60 * 1000, // 8 hours
  CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // 1 hour
  MAX_AGE_COOKIE: 8 * 60 * 60 * 1000, // 8 hours
  ROLLING: true, // Reset expiry on every request
} as const;

// ============================================================================
// FEES (in USD)
// ============================================================================

export const FEES = {
  APPLICATION: {
    INDIVIDUAL: 50,
    INDIVIDUAL_MATURE: 75,
    ORGANIZATION: 200,
  },
  RENEWAL: {
    INDIVIDUAL: 100,
    ORGANIZATION: 500,
  },
  EVENT: {
    DEFAULT: 25,
  },
} as const;

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 1000,
  DEFAULT_OFFSET: 0,
} as const;

// ============================================================================
// FILE UPLOAD
// ============================================================================

export const FILE_UPLOAD = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
  ALLOWED_CSV_TYPES: ['text/csv'],
  MAX_BULK_IMPORT_ROWS: 1000,
} as const;

// ============================================================================
// EMAIL VERIFICATION
// ============================================================================

export const EMAIL_VERIFICATION = {
  TOKEN_LENGTH: 32,
  EXPIRY_HOURS: 24,
  EXPIRY_MS: 24 * 60 * 60 * 1000,
} as const;

// ============================================================================
// PASSWORD
// ============================================================================

export const PASSWORD = {
  MIN_LENGTH: 8,
  BCRYPT_ROUNDS: 10,
  RESET_TOKEN_LENGTH: 32,
  RESET_EXPIRY_HOURS: 1,
  RESET_EXPIRY_MS: 60 * 60 * 1000,
} as const;

// ============================================================================
// RATE LIMITING
// ============================================================================

export const RATE_LIMIT = {
  API: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 5,
  },
  APPLICATION: {
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MAX_REQUESTS: 10,
  },
  PUBLIC: {
    WINDOW_MS: 5 * 60 * 1000, // 5 minutes
    MAX_REQUESTS: 20,
  },
} as const;

// ============================================================================
// DATABASE
// ============================================================================

export const DATABASE = {
  MAX_POOL_SIZE: 20,
  IDLE_TIMEOUT_MS: 30000,
  CONNECTION_TIMEOUT_MS: 10000,
  QUERY_TIMEOUT_MS: 30000,
} as const;

// ============================================================================
// APPLICATION STATUS
// ============================================================================

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_RECEIVED = 'payment_received',
  UNDER_REVIEW = 'under_review',
  PRE_VALIDATION = 'pre_validation',
  ELIGIBILITY_REVIEW = 'eligibility_review',
  DOCUMENT_REVIEW = 'document_review',
  NEEDS_APPLICANT_ACTION = 'needs_applicant_action',
  READY_FOR_REGISTRY = 'ready_for_registry',
  APPROVED = 'approved',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  EXPIRED = 'expired',
}

// ============================================================================
// PAYMENT STATUS
// ============================================================================

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// ============================================================================
// MEMBERSHIP STATUS
// ============================================================================

export enum MembershipStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
}

// ============================================================================
// USER ROLES
// ============================================================================

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MEMBER_MANAGER = 'member_manager',
  CASE_MANAGER = 'case_manager',
  STAFF = 'staff',
  ACCOUNTANT = 'accountant',
  REVIEWER = 'reviewer',
}

// ============================================================================
// CASE STATUS
// ============================================================================

export enum CaseStatus {
  OPEN = 'open',
  UNDER_INVESTIGATION = 'under_investigation',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

// ============================================================================
// CASE PRIORITY
// ============================================================================

export enum CasePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// ============================================================================
// MEMBER TYPES
// ============================================================================

export enum MemberType {
  REAL_ESTATE_AGENT = 'real_estate_agent',
  PROPERTY_MANAGER = 'property_manager',
  PRINCIPAL_REAL_ESTATE_AGENT = 'principal_real_estate_agent',
  REAL_ESTATE_NEGOTIATOR = 'real_estate_negotiator',
  PROPERTY_DEVELOPER = 'property_developer',
}

// ============================================================================
// ORGANIZATION TYPES
// ============================================================================

export enum OrganizationType {
  REAL_ESTATE_AGENCY = 'real_estate_agency',
  PROPERTY_MANAGEMENT_FIRM = 'property_management_firm',
  BROKERAGE_FIRM = 'brokerage_firm',
  REAL_ESTATE_DEVELOPMENT_FIRM = 'real_estate_development_firm',
}

// ============================================================================
// PAYMENT METHODS
// ============================================================================

export enum PaymentMethod {
  CASH = 'cash',
  PAYNOW_ECOCASH = 'paynow_ecocash',
  PAYNOW_ONEMONEY = 'paynow_onemoney',
  STRIPE_CARD = 'stripe_card',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  GOOGLE_PAY = 'google_pay',
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

// ============================================================================
// DOCUMENT TYPES
// ============================================================================

export enum DocumentType {
  ID_DOCUMENT = 'id_document',
  ACADEMIC_CERTIFICATE = 'academic_certificate',
  PROOF_OF_PAYMENT = 'proof_of_payment',
  COMPANY_REGISTRATION = 'company_registration',
  TAX_CLEARANCE = 'tax_clearance',
  OTHER = 'other',
}

// ============================================================================
// EDUCATION REQUIREMENTS
// ============================================================================

export const EDUCATION = {
  O_LEVEL: {
    MIN_SUBJECTS: 5,
    REQUIRED_SUBJECTS: ['English', 'Mathematics'],
  },
  A_LEVEL: {
    MIN_SUBJECTS: 2,
  },
} as const;

// ============================================================================
// ID FORMATS & PATTERNS
// ============================================================================

export const ID_PATTERNS = {
  MEMBERSHIP_NUMBER: /^EAC-\d{4}-\d{4}$/, // EAC-2024-0001
  APPLICATION_ID_INDIVIDUAL: /^APP-IND-\d{4}-\d{4}$/, // APP-IND-2024-0001
  APPLICATION_ID_ORGANIZATION: /^APP-ORG-\d{4}-\d{4}$/, // APP-ORG-2024-0001
  ORGANIZATION_ID: /^EAC-ORG-\d{4}-\d{4}$/, // EAC-ORG-2024-0001
  PAYMENT_NUMBER: /^PAY-\d{4}-\d{6}$/, // PAY-2024-000001
  CASE_NUMBER: /^CASE-\d{4}-\d{4}$/, // CASE-2024-0001
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ZIMBABWE_MOBILE: /^(?:\+263|0)7[1-9]\d{7}$/,
} as const;

// ============================================================================
// ERROR CODES
// ============================================================================

export enum ErrorCode {
  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Database
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_KEY = 'DUPLICATE_KEY',
  FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',

  // Application
  ELIGIBILITY_FAILED = 'ELIGIBILITY_FAILED',
  DOCUMENT_MISSING = 'DOCUMENT_MISSING',
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',

  // System
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get fee amount based on application type and maturity
 */
export function getApplicationFee(type: 'individual' | 'organization', mature?: boolean): number {
  if (type === 'organization') {
    return FEES.APPLICATION.ORGANIZATION;
  }
  return mature ? FEES.APPLICATION.INDIVIDUAL_MATURE : FEES.APPLICATION.INDIVIDUAL;
}

/**
 * Get renewal fee based on membership type
 */
export function getRenewalFee(type: 'individual' | 'organization'): number {
  return type === 'organization'
    ? FEES.RENEWAL.ORGANIZATION
    : FEES.RENEWAL.INDIVIDUAL;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return ID_PATTERNS.EMAIL.test(email);
}

/**
 * Validate Zimbabwe mobile number
 */
export function isValidZimbabweMobile(phone: string): boolean {
  return ID_PATTERNS.ZIMBABWE_MOBILE.test(phone);
}
