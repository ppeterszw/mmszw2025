import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "member_manager", "case_manager", "super_admin", "staff", "accountant", "reviewer"]);
export const userStatusEnum = pgEnum("user_status", ["active", "inactive", "suspended", "locked", "pending_verification"]);
export const memberTypeEnum = pgEnum("member_type", ["real_estate_agent", "property_manager", "principal_real_estate_agent", "real_estate_negotiator"]);
export const organizationTypeEnum = pgEnum("organization_type", ["real_estate_firm", "property_management_firm", "brokerage_firm", "real_estate_development_firm"]);
export const membershipStatusEnum = pgEnum("membership_status", ["active", "standby", "revoked", "pending", "expired"]);
export const caseStatusEnum = pgEnum("case_status", ["open", "in_progress", "resolved", "closed"]);
export const casePriorityEnum = pgEnum("case_priority", ["low", "medium", "high", "critical"]);
export const caseTypeEnum = pgEnum("case_type", ["complaint", "inquiry", "dispute", "violation"]);
export const eventTypeEnum = pgEnum("event_type", ["workshop", "seminar", "training", "conference"]);
export const activityTypeEnum = pgEnum("activity_type", ["login", "logout", "profile_update", "document_upload", "payment", "case_submission", "event_registration", "status_change", "password_change", "role_change", "access_granted", "access_denied"]);
export const renewalStatusEnum = pgEnum("renewal_status", ["pending", "reminded", "completed", "overdue", "lapsed"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "processing", "completed", "failed", "refunded", "cancelled", "expired"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cash", "paynow_ecocash", "paynow_onemoney", "stripe_card", "bank_transfer", "cheque"]);
export const applicationStatusEnum = pgEnum("application_status", ["draft", "submitted", "pre_validation", "eligibility_review", "document_review", "needs_applicant_action", "ready_for_registry", "accepted", "rejected", "withdrawn", "expired"]);
export const applicationStageEnum = pgEnum("application_stage", ["initial_review", "document_verification", "background_check", "committee_review", "final_approval", "certificate_generation"]);
export const applicationTypeEnum = pgEnum("application_type", ["individual", "organization"]);
export const documentStatusEnum = pgEnum("document_status", ["uploaded", "verified", "rejected"]);
export const documentTypeEnum = pgEnum("document_type", [
  // Individual documents
  "o_level_cert", "a_level_cert", "equivalent_cert", "id_or_passport", "birth_certificate",
  // Organization documents
  "bank_trust_letter", "certificate_incorporation", "partnership_agreement", "cr6", "cr11", 
  "tax_clearance", "annual_return_1", "annual_return_2", "annual_return_3", "police_clearance_director",
  // Payment documents
  "application_fee_pop"
]);
export const decisionEnum = pgEnum("decision", ["accepted", "rejected"]);
export const educationLevelEnum = pgEnum("education_level", ["o_level", "a_level", "bachelors", "hnd", "masters", "doctorate"]);
export const notificationTypeEnum = pgEnum("notification_type", ["email", "sms", "push", "in_app"]);
export const notificationStatusEnum = pgEnum("notification_status", ["pending", "sent", "delivered", "failed", "opened"]);
export const applicantStatusEnum = pgEnum("applicant_status", ["registered", "email_verified", "application_started", "application_completed", "under_review", "approved", "rejected"]);

// Users table - Enhanced for robust user management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  role: userRoleEnum("role").default("admin"),
  status: userStatusEnum("status").default("active"),
  permissions: text("permissions"), // JSON array of specific permissions
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: integer("login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  passwordChangedAt: timestamp("password_changed_at"),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  profileImageUrl: text("profile_image_url"),
  department: text("department"),
  jobTitle: text("job_title"),
  notes: text("notes"),
  clerkId: text("clerk_id").unique(), // Clerk user ID for authentication
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Applicants table - For pre-registration before application
export const applicants = pgTable("applicants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantId: text("applicant_id").unique().notNull(), // Human-readable ID like APP-2024-001
  firstName: text("first_name").notNull(),
  surname: text("surname").notNull(),
  email: text("email").notNull().unique(),
  status: applicantStatusEnum("status").default("registered"),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  applicationStartedAt: timestamp("application_started_at"),
  applicationCompletedAt: timestamp("application_completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Organization Applicants table - For organization pre-registration before application
export const organizationApplicants = pgTable("organization_applicants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantId: text("applicant_id").unique().notNull(), // Human-readable ID like ORG-APP-YYYY-XXXX
  companyName: text("company_name").notNull(),
  email: text("email").notNull().unique(),
  status: applicantStatusEnum("status").default("registered"),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  applicationStartedAt: timestamp("application_started_at"),
  applicationCompletedAt: timestamp("application_completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Organizations table
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: text("organization_id").unique(),
  name: text("name").notNull(),
  businessType: organizationTypeEnum("business_type").notNull(),
  registrationNumber: text("registration_number").unique(),
  email: text("email").notNull(),
  phone: text("phone"),
  physicalAddress: text("physical_address"),
  status: membershipStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Members table
export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clerkId: text("clerk_id"),
  membershipNumber: text("membership_number").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  memberType: memberTypeEnum("member_type").notNull(),
  membershipStatus: membershipStatusEnum("membership_status").default("pending"),
  organizationId: varchar("organization_id"),
  joinedDate: timestamp("joined_date"),
  expiryDate: timestamp("expiry_date"),
  nationalId: text("national_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Member Applications table - Enhanced for application tracking (Legacy)
export const memberApplications = pgTable("member_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationNumber: text("application_number").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  nationalId: text("national_id"),
  memberType: memberTypeEnum("member_type").notNull(),
  organizationId: varchar("organization_id").references(() => organizations.id),
  status: applicationStatusEnum("status").default("draft"),
  currentStage: applicationStageEnum("current_stage").default("initial_review"),
  applicationFee: decimal("application_fee", { precision: 10, scale: 2 }),
  feePaymentStatus: paymentStatusEnum("fee_payment_status").default("pending"),
  paymentId: varchar("payment_id"),
  educationLevel: educationLevelEnum("education_level"),
  workExperience: integer("work_experience"), // in years
  currentEmployer: text("current_employer"),
  jobTitle: text("job_title"),
  documentsUploaded: boolean("documents_uploaded").default(false),
  documentsVerified: boolean("documents_verified").default(false),
  backgroundCheckPassed: boolean("background_check_passed"),
  interviewScheduled: boolean("interview_scheduled").default(false),
  interviewDate: timestamp("interview_date"),
  interviewNotes: text("interview_notes"),
  reviewNotes: text("review_notes"),
  rejectionReason: text("rejection_reason"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  submittedAt: timestamp("submitted_at"),
  reviewStartedAt: timestamp("review_started_at"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  expiresAt: timestamp("expires_at"),
  priority: integer("priority").default(3), // 1=high, 3=normal, 5=low
  estimatedProcessingDays: integer("estimated_processing_days").default(30),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Individual Applications table - New application system
export const individualApplications = pgTable("individual_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: text("application_id").notNull().unique(), // MBR-APP-XXXX
  status: applicationStatusEnum("status").default("draft"),
  personal: text("personal").notNull(), // JSON: { firstName, lastName, dob, nationalId, email, phone, address }
  oLevel: text("o_level").notNull(), // JSON: { subjects[], hasEnglish, hasMath, passesCount }
  aLevel: text("a_level"), // JSON: { subjects[], passesCount } nullable
  equivalentQualification: text("equivalent_qualification"), // JSON: { type, institution, levelMap, evidenceDocId } nullable
  matureEntry: boolean("mature_entry").default(false),
  feeRequired: boolean("fee_required").default(true),
  feeAmount: integer("fee_amount"),
  feeCurrency: varchar("fee_currency", { length: 8 }).default("USD"),
  feeStatus: varchar("fee_status", { length: 16 }).default("pending"), // none|pending|settled|failed|refunded
  feePaymentId: varchar("fee_payment_id", { length: 36 }),
  feeProofDocId: varchar("fee_proof_doc_id", { length: 36 }),
  submittedAt: timestamp("submitted_at"),
  createdByUserId: varchar("created_by_user_id").references(() => users.id),
  memberId: varchar("member_id").references(() => members.id), // Set on acceptance
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Organization Applications table - New application system
export const organizationApplications = pgTable("organization_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: text("application_id").notNull().unique(), // ORG-APP-XXXX
  status: applicationStatusEnum("status").default("draft"),
  orgProfile: text("org_profile").notNull(), // JSON: { legalName, tradingName, regNo, taxNo, address, emails[], phones[] }
  trustAccount: text("trust_account").notNull(), // JSON: { bankName, branch, accountNoMasked }
  preaMemberId: varchar("prea_member_id").references(() => members.id), // Principal Registered Estate Agent
  directors: text("directors"), // JSON: [{ name, nationalId, memberId }]
  feeRequired: boolean("fee_required").default(true),
  feeAmount: integer("fee_amount"),
  feeCurrency: varchar("fee_currency", { length: 8 }).default("USD"),
  feeStatus: varchar("fee_status", { length: 16 }).default("pending"),
  feePaymentId: varchar("fee_payment_id", { length: 36 }),
  feeProofDocId: varchar("fee_proof_doc_id", { length: 36 }),
  submittedAt: timestamp("submitted_at"),
  createdByUserId: varchar("created_by_user_id").references(() => users.id),
  memberId: varchar("member_id").references(() => members.id), // Set on acceptance
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Uploaded Documents table for new application system
export const uploadedDocuments = pgTable("uploaded_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationType: applicationTypeEnum("application_type").notNull(),
  applicationIdFk: varchar("application_id_fk").notNull(), // References individual_applications.id or organization_applications.id
  docType: documentTypeEnum("doc_type").notNull(),
  fileKey: text("file_key").notNull(),
  fileName: text("file_name").notNull(),
  mime: text("mime"),
  sizeBytes: integer("size_bytes"),
  sha256: text("sha256"),
  status: documentStatusEnum("status").default("uploaded"),
  verifierUserId: varchar("verifier_user_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Status History table for application state transitions
export const statusHistory = pgTable("status_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationType: applicationTypeEnum("application_type").notNull(),
  applicationIdFk: varchar("application_id_fk").notNull(),
  fromStatus: applicationStatusEnum("from_status"),
  toStatus: applicationStatusEnum("to_status").notNull(),
  actorUserId: varchar("actor_user_id").references(() => users.id),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow()
});

// Registry Decisions table for final decisions
export const registryDecisions = pgTable("registry_decisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationType: applicationTypeEnum("application_type").notNull(),
  applicationIdFk: varchar("application_id_fk").notNull(),
  decision: decisionEnum("decision").notNull(),
  reasons: text("reasons"), // JSON array of reasons
  decidedBy: varchar("decided_by").references(() => users.id),
  decidedAt: timestamp("decided_at").defaultNow()
});

// Naming Series Counters for year-based member numbering
export const namingSeriesCounters = pgTable("naming_series_counters", {
  seriesCode: varchar("series_code").notNull(), // 'member_ind' | 'member_org'
  year: integer("year").notNull(),
  counter: integer("counter").default(0),
}, (table) => ({
  pk: sql`PRIMARY KEY (${table.seriesCode}, ${table.year})`
}));

// App Login Tokens for Save & Resume OTP
export const appLoginTokens = pgTable("app_login_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationType: applicationTypeEnum("application_type").notNull(),
  applicationIdFk: varchar("application_id_fk").notNull(),
  email: text("email").notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  attempts: integer("attempts").default(0),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  appTokenIdx: sql`CREATE INDEX IF NOT EXISTS app_token_idx ON ${table} (${table.applicationType}, ${table.applicationIdFk}, ${table.email})`
}));

// Cases table
export const cases = pgTable("cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseNumber: text("case_number").unique().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: caseTypeEnum("type").notNull(),
  priority: casePriorityEnum("priority").default("medium"),
  status: caseStatusEnum("status").default("open"),
  submittedBy: text("submitted_by"), // For anonymous submissions
  submittedByEmail: text("submitted_by_email"),
  memberId: varchar("member_id").references(() => members.id),
  organizationId: varchar("organization_id").references(() => organizations.id),
  assignedTo: varchar("assigned_to").references(() => users.id),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: eventTypeEnum("type").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"),
  address: text("address"),
  instructor: text("instructor"),
  capacity: integer("capacity"),
  price: decimal("price", { precision: 10, scale: 2 }),
  cpdPoints: integer("cpd_points").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Event Registrations table
export const eventRegistrations = pgTable("event_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id),
  memberId: varchar("member_id").references(() => members.id),
  paymentStatus: paymentStatusEnum("payment_status").default("pending"),
  registrationDate: timestamp("registration_date").defaultNow(),
  attended: boolean("attended").default(false),
  certificateIssued: boolean("certificate_issued").default(false)
});

// Payments table - Enhanced for robust payment processing
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentNumber: text("payment_number").unique().notNull(),
  memberId: varchar("member_id").references(() => members.id),
  organizationId: varchar("organization_id").references(() => organizations.id),
  applicationId: varchar("application_id"),
  eventId: varchar("event_id").references(() => events.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  status: paymentStatusEnum("status").default("pending"),
  purpose: text("purpose").notNull(), // membership, event, application, renewal, fine
  description: text("description"),
  referenceNumber: text("reference_number"),
  transactionId: text("transaction_id"),
  externalPaymentId: text("external_payment_id"), // Stripe/Paynow ID
  gatewayResponse: text("gateway_response"), // JSON response from payment gateway
  paymentDate: timestamp("payment_date"),
  dueDate: timestamp("due_date"),
  processedBy: varchar("processed_by").references(() => users.id),
  receiptUrl: text("receipt_url"),
  notes: text("notes"),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0"), // Processing fees
  netAmount: decimal("net_amount", { precision: 10, scale: 2 }), // Amount after fees
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).default("0"),
  refundReason: text("refund_reason"),
  refundedAt: timestamp("refunded_at"),
  failureReason: text("failure_reason"),
  retryCount: integer("retry_count").default(0),
  lastRetryAt: timestamp("last_retry_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// CPD Activities table
export const cpdActivities = pgTable("cpd_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").references(() => members.id),
  eventId: varchar("event_id").references(() => events.id),
  activityTitle: text("activity_title").notNull(),
  activityType: text("activity_type").notNull(),
  pointsEarned: integer("points_earned").default(0),
  completionDate: timestamp("completion_date"),
  certificateUrl: text("certificate_url"),
  verifiedBy: varchar("verified_by").references(() => users.id),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Member Renewals table
export const memberRenewals = pgTable("member_renewals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").references(() => members.id),
  renewalYear: integer("renewal_year").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: renewalStatusEnum("status").default("pending"),
  remindersSent: integer("reminders_sent").default(0),
  lastReminderDate: timestamp("last_reminder_date"),
  renewalDate: timestamp("renewal_date"),
  renewalFee: decimal("renewal_fee", { precision: 10, scale: 2 }),
  paymentId: varchar("payment_id").references(() => payments.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Member Activity Audit table
export const memberActivities = pgTable("member_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").references(() => members.id),
  userId: varchar("user_id").references(() => users.id),
  activityType: activityTypeEnum("activity_type").notNull(),
  description: text("description").notNull(),
  details: text("details"), // JSON string for additional data
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow()
});

// Documents table
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").references(() => members.id),
  organizationId: varchar("organization_id").references(() => organizations.id),
  applicationId: varchar("application_id").references(() => memberApplications.id),
  documentType: text("document_type").notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: varchar("verified_by").references(() => users.id),
  verificationDate: timestamp("verification_date"),
  createdAt: timestamp("created_at").defaultNow()
});

// User Sessions table for robust session management
export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionToken: text("session_token").unique().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: text("location"), // Geolocation info
  deviceType: text("device_type"), // desktop, mobile, tablet
  isActive: boolean("is_active").default(true),
  lastActivity: timestamp("last_activity").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Application Workflow Stages table for tracking application progress
export const applicationWorkflows = pgTable("application_workflows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").references(() => memberApplications.id).notNull(),
  stage: applicationStageEnum("stage").notNull(),
  status: text("status").notNull(), // pending, in_progress, completed, skipped, failed
  assignedTo: varchar("assigned_to").references(() => users.id),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  dueDate: timestamp("due_date"),
  notes: text("notes"),
  documents: text("documents"), // JSON array of required documents for this stage
  estimatedDurationHours: integer("estimated_duration_hours").default(24),
  actualDurationHours: integer("actual_duration_hours"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Payment Installments table for installment payment plans
export const paymentInstallments = pgTable("payment_installments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentId: varchar("payment_id").references(() => payments.id).notNull(),
  installmentNumber: integer("installment_number").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  status: paymentStatusEnum("status").default("pending"),
  transactionId: text("transaction_id"),
  lateFee: decimal("late_fee", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow()
});

// Notifications table for system notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  memberId: varchar("member_id").references(() => members.id),
  type: notificationTypeEnum("type").notNull(),
  status: notificationStatusEnum("status").default("pending"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: text("data"), // JSON data for notification context
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  openedAt: timestamp("opened_at"),
  externalId: text("external_id"), // ID from email/SMS service
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  createdAt: timestamp("created_at").defaultNow()
});

// User Permissions table for granular permission management
export const userPermissions = pgTable("user_permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  permission: text("permission").notNull(), // e.g., "users:create", "payments:view", "members:approve"
  resource: text("resource"), // Specific resource ID if permission is resource-specific
  grantedBy: varchar("granted_by").references(() => users.id),
  grantedAt: timestamp("granted_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true)
});

// Audit Logs table for comprehensive system auditing
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(), // CREATE, UPDATE, DELETE, VIEW, LOGIN, etc.
  resource: text("resource").notNull(), // users, members, payments, etc.
  resourceId: text("resource_id"), // ID of the affected resource
  oldValues: text("old_values"), // JSON of old values
  newValues: text("new_values"), // JSON of new values
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
  severity: text("severity").default("info"), // info, warning, error, critical
  description: text("description")
});

// Badge Types enum
export const badgeTypeEnum = pgEnum("badge_type", [
  "profile_basic",
  "profile_complete", 
  "documents_verified",
  "cpd_achiever",
  "event_participant",
  "payment_complete",
  "early_bird",
  "community_contributor",
  "certificate_holder",
  "organization_member"
]);

// Badge Difficulty enum
export const badgeDifficultyEnum = pgEnum("badge_difficulty", [
  "bronze",
  "silver", 
  "gold",
  "platinum"
]);

// Achievement Badges table
export const achievementBadges = pgTable("achievement_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: badgeTypeEnum("type").notNull(),
  difficulty: badgeDifficultyEnum("difficulty").default("bronze"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  criteria: text("criteria").notNull(), // JSON string describing requirements
  points: integer("points").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Member Achievement Badges table
export const memberAchievementBadges = pgTable("member_achievement_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").references(() => members.id),
  badgeId: varchar("badge_id").references(() => achievementBadges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
  isVisible: boolean("is_visible").default(true),
  progress: integer("progress").default(0), // Percentage completion for ongoing badges
  createdAt: timestamp("created_at").defaultNow()
});

// System Settings table
export const systemSettings = pgTable("system_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(), // JSON string for flexibility
  description: text("description"),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  assignedCases: many(cases),
  reviewedApplications: many(memberApplications),
  verifiedDocuments: many(documents),
  sessions: many(userSessions),
  permissions: many(userPermissions),
  auditLogs: many(auditLogs),
  processedPayments: many(payments),
  notifications: many(notifications),
  createdBy: one(users, {
    fields: [users.createdBy],
    references: [users.id]
  }),
  createdUsers: many(users)
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(members),
  applications: many(memberApplications),
  cases: many(cases),
  payments: many(payments),
  documents: many(documents)
}));

export const membersRelations = relations(members, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id]
  }),
  cases: many(cases),
  eventRegistrations: many(eventRegistrations),
  payments: many(payments),
  documents: many(documents),
  cpdActivities: many(cpdActivities),
  renewals: many(memberRenewals),
  activities: many(memberActivities)
}));

export const memberApplicationsRelations = relations(memberApplications, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [memberApplications.organizationId],
    references: [organizations.id]
  }),
  reviewer: one(users, {
    fields: [memberApplications.reviewedBy],
    references: [users.id]
  }),
  payment: one(payments, {
    fields: [memberApplications.paymentId],
    references: [payments.id]
  }),
  documents: many(documents),
  workflows: many(applicationWorkflows)
}));

export const casesRelations = relations(cases, ({ one }) => ({
  member: one(members, {
    fields: [cases.memberId],
    references: [members.id]
  }),
  organization: one(organizations, {
    fields: [cases.organizationId],
    references: [organizations.id]
  }),
  assignedUser: one(users, {
    fields: [cases.assignedTo],
    references: [users.id]
  })
}));

export const eventsRelations = relations(events, ({ many }) => ({
  registrations: many(eventRegistrations)
}));

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id]
  }),
  member: one(members, {
    fields: [eventRegistrations.memberId],
    references: [members.id]
  })
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  member: one(members, {
    fields: [payments.memberId],
    references: [members.id]
  }),
  organization: one(organizations, {
    fields: [payments.organizationId],
    references: [organizations.id]
  }),
  application: one(memberApplications, {
    fields: [payments.applicationId],
    references: [memberApplications.id]
  }),
  event: one(events, {
    fields: [payments.eventId],
    references: [events.id]
  }),
  processor: one(users, {
    fields: [payments.processedBy],
    references: [users.id]
  }),
  installments: many(paymentInstallments)
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  member: one(members, {
    fields: [documents.memberId],
    references: [members.id]
  }),
  organization: one(organizations, {
    fields: [documents.organizationId],
    references: [organizations.id]
  }),
  application: one(memberApplications, {
    fields: [documents.applicationId],
    references: [memberApplications.id]
  }),
  verifier: one(users, {
    fields: [documents.verifiedBy],
    references: [users.id]
  })
}));

export const cpdActivitiesRelations = relations(cpdActivities, ({ one }) => ({
  member: one(members, {
    fields: [cpdActivities.memberId],
    references: [members.id]
  }),
  event: one(events, {
    fields: [cpdActivities.eventId],
    references: [events.id]
  }),
  verifier: one(users, {
    fields: [cpdActivities.verifiedBy],
    references: [users.id]
  })
}));

export const memberRenewalsRelations = relations(memberRenewals, ({ one }) => ({
  member: one(members, {
    fields: [memberRenewals.memberId],
    references: [members.id]
  }),
  payment: one(payments, {
    fields: [memberRenewals.paymentId],
    references: [payments.id]
  })
}));

export const memberActivitiesRelations = relations(memberActivities, ({ one }) => ({
  member: one(members, {
    fields: [memberActivities.memberId],
    references: [members.id]
  }),
  user: one(users, {
    fields: [memberActivities.userId],
    references: [users.id]
  })
}));

// New table relations
export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id]
  })
}));

export const applicationWorkflowsRelations = relations(applicationWorkflows, ({ one }) => ({
  application: one(memberApplications, {
    fields: [applicationWorkflows.applicationId],
    references: [memberApplications.id]
  }),
  assignedUser: one(users, {
    fields: [applicationWorkflows.assignedTo],
    references: [users.id]
  })
}));

export const paymentInstallmentsRelations = relations(paymentInstallments, ({ one }) => ({
  payment: one(payments, {
    fields: [paymentInstallments.paymentId],
    references: [payments.id]
  })
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  }),
  member: one(members, {
    fields: [notifications.memberId],
    references: [members.id]
  })
}));

export const userPermissionsRelations = relations(userPermissions, ({ one }) => ({
  user: one(users, {
    fields: [userPermissions.userId],
    references: [users.id]
  }),
  grantedByUser: one(users, {
    fields: [userPermissions.grantedBy],
    references: [users.id]
  })
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id]
  })
}));

// New Application Relations
export const individualApplicationsRelations = relations(individualApplications, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [individualApplications.createdByUserId],
    references: [users.id]
  }),
  member: one(members, {
    fields: [individualApplications.memberId],
    references: [members.id]
  }),
  documents: many(uploadedDocuments),
  statusHistory: many(statusHistory),
  decisions: many(registryDecisions),
  loginTokens: many(appLoginTokens)
}));

export const organizationApplicationsRelations = relations(organizationApplications, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [organizationApplications.createdByUserId],
    references: [users.id]
  }),
  preaMember: one(members, {
    fields: [organizationApplications.preaMemberId],
    references: [members.id]
  }),
  member: one(members, {
    fields: [organizationApplications.memberId],
    references: [members.id]
  }),
  documents: many(uploadedDocuments),
  statusHistory: many(statusHistory),
  decisions: many(registryDecisions),
  loginTokens: many(appLoginTokens)
}));

export const uploadedDocumentsRelations = relations(uploadedDocuments, ({ one }) => ({
  verifierUser: one(users, {
    fields: [uploadedDocuments.verifierUserId],
    references: [users.id]
  })
}));

export const statusHistoryRelations = relations(statusHistory, ({ one }) => ({
  actorUser: one(users, {
    fields: [statusHistory.actorUserId],
    references: [users.id]
  })
}));

export const registryDecisionsRelations = relations(registryDecisions, ({ one }) => ({
  decidedByUser: one(users, {
    fields: [registryDecisions.decidedBy],
    references: [users.id]
  })
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertApplicantSchema = createInsertSchema(applicants).omit({
  id: true,
  applicantId: true,
  emailVerificationToken: true,
  emailVerificationExpires: true,
  createdAt: true,
  updatedAt: true
});

export const insertOrganizationApplicantSchema = createInsertSchema(organizationApplicants).omit({
  id: true,
  applicantId: true,
  emailVerificationToken: true,
  emailVerificationExpires: true,
  createdAt: true,
  updatedAt: true
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  membershipNumber: true,
  createdAt: true,
  updatedAt: true
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertMemberApplicationSchema = createInsertSchema(memberApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  caseNumber: true,
  createdAt: true,
  updatedAt: true
});

// Case query schema for filtering
export const casesQuerySchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  type: z.enum(["complaint", "inquiry", "dispute", "violation"]).optional(),
  assignedTo: z.string().optional(),
  search: z.string().optional(),
});

// Case update schema for PUT operations
export const caseUpdateSchema = createInsertSchema(cases).omit({
  id: true,
  caseNumber: true,
  createdAt: true,
  updatedAt: true
}).partial();

// Case assignment schema
export const caseAssignmentSchema = z.object({
  assignedTo: z.string().optional(),
});

// Bulk operations schemas
export const bulkCaseAssignmentSchema = z.object({
  caseIds: z.array(z.string()),
  assignedTo: z.string(),
});

export const bulkCaseResolutionSchema = z.object({
  caseIds: z.array(z.string()),
  resolution: z.string().optional(),
  status: z.enum(["resolved", "closed"]).default("resolved"),
});

// Combined bulk action schema
export const bulkCaseActionSchema = z.object({
  caseIds: z.array(z.string()),
  action: z.enum(["assign", "resolve", "close"]),
  assignedTo: z.string().optional(),
  resolution: z.string().optional(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true
});

export const insertCpdActivitySchema = createInsertSchema(cpdActivities).omit({
  id: true,
  createdAt: true
});

export const insertMemberRenewalSchema = createInsertSchema(memberRenewals).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertMemberActivitySchema = createInsertSchema(memberActivities).omit({
  id: true,
  timestamp: true
});

// New table insert schemas
export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true
});

export const insertApplicationWorkflowSchema = createInsertSchema(applicationWorkflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertPaymentInstallmentSchema = createInsertSchema(paymentInstallments).omit({
  id: true,
  createdAt: true
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});

export const insertUserPermissionSchema = createInsertSchema(userPermissions).omit({
  id: true,
  grantedAt: true
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true
});

export const insertSystemSettingsSchema = createInsertSchema(systemSettings).omit({
  updatedAt: true
});

// New Application Insert Schemas
export const insertIndividualApplicationSchema = createInsertSchema(individualApplications).omit({
  id: true,
  applicationId: true,
  createdAt: true,
  updatedAt: true
});

export const insertOrganizationApplicationSchema = createInsertSchema(organizationApplications).omit({
  id: true,
  applicationId: true,
  createdAt: true,
  updatedAt: true
});

export const insertUploadedDocumentSchema = createInsertSchema(uploadedDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertStatusHistorySchema = createInsertSchema(statusHistory).omit({
  id: true,
  createdAt: true
});

export const insertRegistryDecisionSchema = createInsertSchema(registryDecisions).omit({
  id: true,
  decidedAt: true
});

export const insertNamingSeriesCounterSchema = createInsertSchema(namingSeriesCounters);

export const insertAppLoginTokenSchema = createInsertSchema(appLoginTokens).omit({
  id: true,
  createdAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Applicant = typeof applicants.$inferSelect;
export type InsertApplicant = z.infer<typeof insertApplicantSchema>;

export type OrganizationApplicant = typeof organizationApplicants.$inferSelect;
export type InsertOrganizationApplicant = z.infer<typeof insertOrganizationApplicantSchema>;

export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;

export type MemberApplication = typeof memberApplications.$inferSelect;
export type InsertMemberApplication = z.infer<typeof insertMemberApplicationSchema>;

export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type EventRegistration = typeof eventRegistrations.$inferSelect;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type CpdActivity = typeof cpdActivities.$inferSelect;
export type InsertCpdActivity = z.infer<typeof insertCpdActivitySchema>;

export type MemberRenewal = typeof memberRenewals.$inferSelect;
export type InsertMemberRenewal = z.infer<typeof insertMemberRenewalSchema>;

export type MemberActivity = typeof memberActivities.$inferSelect;
export type InsertMemberActivity = z.infer<typeof insertMemberActivitySchema>;

// New table types
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

export type ApplicationWorkflow = typeof applicationWorkflows.$inferSelect;
export type InsertApplicationWorkflow = z.infer<typeof insertApplicationWorkflowSchema>;

export type PaymentInstallment = typeof paymentInstallments.$inferSelect;
export type InsertPaymentInstallment = z.infer<typeof insertPaymentInstallmentSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type UserPermission = typeof userPermissions.$inferSelect;
export type InsertUserPermission = z.infer<typeof insertUserPermissionSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

// Badge schema exports
export const insertAchievementBadgeSchema = createInsertSchema(achievementBadges).omit({
  id: true,
  createdAt: true
});

export const insertMemberAchievementBadgeSchema = createInsertSchema(memberAchievementBadges).omit({
  id: true,
  createdAt: true
});

export type AchievementBadge = typeof achievementBadges.$inferSelect;
export type InsertAchievementBadge = z.infer<typeof insertAchievementBadgeSchema>;

export type MemberAchievementBadge = typeof memberAchievementBadges.$inferSelect;
export type InsertMemberAchievementBadge = z.infer<typeof insertMemberAchievementBadgeSchema>;

// New Application Types
export type IndividualApplication = typeof individualApplications.$inferSelect;
export type InsertIndividualApplication = z.infer<typeof insertIndividualApplicationSchema>;

export type OrganizationApplication = typeof organizationApplications.$inferSelect;
export type InsertOrganizationApplication = z.infer<typeof insertOrganizationApplicationSchema>;

export type UploadedDocument = typeof uploadedDocuments.$inferSelect;
export type InsertUploadedDocument = z.infer<typeof insertUploadedDocumentSchema>;

export type StatusHistory = typeof statusHistory.$inferSelect;
export type InsertStatusHistory = z.infer<typeof insertStatusHistorySchema>;

export type RegistryDecision = typeof registryDecisions.$inferSelect;
export type InsertRegistryDecision = z.infer<typeof insertRegistryDecisionSchema>;

export type NamingSeriesCounter = typeof namingSeriesCounters.$inferSelect;
export type InsertNamingSeriesCounter = z.infer<typeof insertNamingSeriesCounterSchema>;

export type AppLoginToken = typeof appLoginTokens.$inferSelect;
export type InsertAppLoginToken = z.infer<typeof insertAppLoginTokenSchema>;

export type SystemSettings = typeof systemSettings.$inferSelect;
export type InsertSystemSettings = z.infer<typeof insertSystemSettingsSchema>;

// Business Experience Schemas for Dynamic Forms
export const businessExperienceItemSchema = z.object({
  employer: z.string().min(2, "Employer name must be at least 2 characters"),
  typeOfBusiness: z.string().min(2, "Type of business must be at least 2 characters"), 
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  dateFrom: z.string().min(1, "Start date is required"), // ISO date format (yyyy-mm-dd)
  dateTo: z.string().optional(), // Optional for current positions
}).superRefine((data, ctx) => {
  // Validate that dateFrom is not in the future
  const today = new Date().toISOString().split('T')[0];
  if (data.dateFrom > today) {
    ctx.addIssue({
      code: 'custom',
      message: 'Start date cannot be in the future',
      path: ['dateFrom'],
    });
  }
  
  // Validate that dateTo is after dateFrom if provided
  if (data.dateTo && data.dateFrom > data.dateTo) {
    ctx.addIssue({
      code: 'custom',
      message: 'End date must be after start date',
      path: ['dateTo'],
    });
  }
  
  // Validate that dateTo is not in the future if provided
  if (data.dateTo && data.dateTo > today) {
    ctx.addIssue({
      code: 'custom',
      message: 'End date cannot be in the future',
      path: ['dateTo'],
    });
  }
});

export const businessExperienceSchema = z.array(businessExperienceItemSchema)
  .min(1, "At least one business experience entry is required")
  .max(20, "Too many experience entries (maximum 20 allowed)");

export type BusinessExperienceItem = z.infer<typeof businessExperienceItemSchema>;
export type BusinessExperience = z.infer<typeof businessExperienceSchema>;
