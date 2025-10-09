var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc6) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc6 = __getOwnPropDesc(from, key)) || desc6.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  achievementBadges: () => achievementBadges,
  activityTypeEnum: () => activityTypeEnum,
  appLoginTokens: () => appLoginTokens,
  applicantStatusEnum: () => applicantStatusEnum,
  applicants: () => applicants,
  applicationStageEnum: () => applicationStageEnum,
  applicationStatusEnum: () => applicationStatusEnum,
  applicationTypeEnum: () => applicationTypeEnum,
  applicationWorkflows: () => applicationWorkflows,
  applicationWorkflowsRelations: () => applicationWorkflowsRelations,
  auditLogs: () => auditLogs,
  auditLogsRelations: () => auditLogsRelations,
  badgeDifficultyEnum: () => badgeDifficultyEnum,
  badgeTypeEnum: () => badgeTypeEnum,
  bulkCaseActionSchema: () => bulkCaseActionSchema,
  bulkCaseAssignmentSchema: () => bulkCaseAssignmentSchema,
  bulkCaseResolutionSchema: () => bulkCaseResolutionSchema,
  businessExperienceItemSchema: () => businessExperienceItemSchema,
  businessExperienceSchema: () => businessExperienceSchema,
  caseAssignmentSchema: () => caseAssignmentSchema,
  casePriorityEnum: () => casePriorityEnum,
  caseStatusEnum: () => caseStatusEnum,
  caseTypeEnum: () => caseTypeEnum,
  caseUpdateSchema: () => caseUpdateSchema,
  cases: () => cases,
  casesQuerySchema: () => casesQuerySchema,
  casesRelations: () => casesRelations,
  cpdActivities: () => cpdActivities,
  cpdActivitiesRelations: () => cpdActivitiesRelations,
  decisionEnum: () => decisionEnum,
  directors: () => directors,
  directorsRelations: () => directorsRelations,
  documentStatusEnum: () => documentStatusEnum,
  documentTypeEnum: () => documentTypeEnum,
  documents: () => documents,
  documentsRelations: () => documentsRelations,
  educationLevelEnum: () => educationLevelEnum,
  eventRegistrations: () => eventRegistrations,
  eventRegistrationsRelations: () => eventRegistrationsRelations,
  eventTypeEnum: () => eventTypeEnum,
  events: () => events,
  eventsRelations: () => eventsRelations,
  individualApplications: () => individualApplications,
  individualApplicationsRelations: () => individualApplicationsRelations,
  insertAchievementBadgeSchema: () => insertAchievementBadgeSchema,
  insertAppLoginTokenSchema: () => insertAppLoginTokenSchema,
  insertApplicantSchema: () => insertApplicantSchema,
  insertApplicationWorkflowSchema: () => insertApplicationWorkflowSchema,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertCaseSchema: () => insertCaseSchema,
  insertCpdActivitySchema: () => insertCpdActivitySchema,
  insertDocumentSchema: () => insertDocumentSchema,
  insertEventSchema: () => insertEventSchema,
  insertIndividualApplicationSchema: () => insertIndividualApplicationSchema,
  insertMemberAchievementBadgeSchema: () => insertMemberAchievementBadgeSchema,
  insertMemberActivitySchema: () => insertMemberActivitySchema,
  insertMemberApplicationSchema: () => insertMemberApplicationSchema,
  insertMemberRenewalSchema: () => insertMemberRenewalSchema,
  insertMemberSchema: () => insertMemberSchema,
  insertNamingSeriesCounterSchema: () => insertNamingSeriesCounterSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertOrganizationApplicantSchema: () => insertOrganizationApplicantSchema,
  insertOrganizationApplicationSchema: () => insertOrganizationApplicationSchema,
  insertOrganizationSchema: () => insertOrganizationSchema,
  insertPaymentInstallmentSchema: () => insertPaymentInstallmentSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertRegistryDecisionSchema: () => insertRegistryDecisionSchema,
  insertStatusHistorySchema: () => insertStatusHistorySchema,
  insertSystemSettingsSchema: () => insertSystemSettingsSchema,
  insertUploadedDocumentSchema: () => insertUploadedDocumentSchema,
  insertUserPermissionSchema: () => insertUserPermissionSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserSessionSchema: () => insertUserSessionSchema,
  memberAchievementBadges: () => memberAchievementBadges,
  memberActivities: () => memberActivities,
  memberActivitiesRelations: () => memberActivitiesRelations,
  memberApplications: () => memberApplications,
  memberRenewals: () => memberRenewals,
  memberRenewalsRelations: () => memberRenewalsRelations,
  memberTypeEnum: () => memberTypeEnum,
  members: () => members,
  membersRelations: () => membersRelations,
  membershipStatusEnum: () => membershipStatusEnum,
  namingSeriesCounters: () => namingSeriesCounters,
  notificationStatusEnum: () => notificationStatusEnum,
  notificationTypeEnum: () => notificationTypeEnum,
  notifications: () => notifications,
  notificationsRelations: () => notificationsRelations,
  organizationApplicants: () => organizationApplicants,
  organizationApplications: () => organizationApplications,
  organizationApplicationsRelations: () => organizationApplicationsRelations,
  organizationTypeEnum: () => organizationTypeEnum,
  organizations: () => organizations,
  organizationsRelations: () => organizationsRelations,
  paymentInstallments: () => paymentInstallments,
  paymentInstallmentsRelations: () => paymentInstallmentsRelations,
  paymentMethodEnum: () => paymentMethodEnum,
  paymentStatusEnum: () => paymentStatusEnum,
  payments: () => payments,
  paymentsRelations: () => paymentsRelations,
  registryDecisions: () => registryDecisions,
  registryDecisionsRelations: () => registryDecisionsRelations,
  renewalStatusEnum: () => renewalStatusEnum,
  statusHistory: () => statusHistory,
  statusHistoryRelations: () => statusHistoryRelations,
  systemSettings: () => systemSettings,
  uploadedDocuments: () => uploadedDocuments2,
  uploadedDocumentsRelations: () => uploadedDocumentsRelations,
  userPermissions: () => userPermissions,
  userPermissionsRelations: () => userPermissionsRelations,
  userRoleEnum: () => userRoleEnum,
  userSessions: () => userSessions,
  userSessionsRelations: () => userSessionsRelations,
  userStatusEnum: () => userStatusEnum,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z as z2 } from "zod";
var userRoleEnum, userStatusEnum, memberTypeEnum, organizationTypeEnum, membershipStatusEnum, caseStatusEnum, casePriorityEnum, caseTypeEnum, eventTypeEnum, activityTypeEnum, renewalStatusEnum, paymentStatusEnum, paymentMethodEnum, applicationStatusEnum, applicationStageEnum, applicationTypeEnum, documentStatusEnum, documentTypeEnum, decisionEnum, educationLevelEnum, notificationTypeEnum, notificationStatusEnum, applicantStatusEnum, users, applicants, organizationApplicants, organizations, members, directors, individualApplications, memberApplications, organizationApplications, uploadedDocuments2, statusHistory, registryDecisions, namingSeriesCounters, appLoginTokens, cases, events, eventRegistrations, payments, cpdActivities, memberRenewals, memberActivities, documents, userSessions, applicationWorkflows, paymentInstallments, notifications, userPermissions, auditLogs, badgeTypeEnum, badgeDifficultyEnum, achievementBadges, memberAchievementBadges, systemSettings, usersRelations, organizationsRelations, membersRelations, directorsRelations, casesRelations, eventsRelations, eventRegistrationsRelations, paymentsRelations, documentsRelations, cpdActivitiesRelations, memberRenewalsRelations, memberActivitiesRelations, userSessionsRelations, applicationWorkflowsRelations, paymentInstallmentsRelations, notificationsRelations, userPermissionsRelations, auditLogsRelations, individualApplicationsRelations, organizationApplicationsRelations, uploadedDocumentsRelations, statusHistoryRelations, registryDecisionsRelations, insertUserSchema, insertApplicantSchema, insertOrganizationApplicantSchema, insertMemberSchema, insertOrganizationSchema, insertMemberApplicationSchema, insertCaseSchema, casesQuerySchema, caseUpdateSchema, caseAssignmentSchema, bulkCaseAssignmentSchema, bulkCaseResolutionSchema, bulkCaseActionSchema, insertEventSchema, insertPaymentSchema, insertDocumentSchema, insertCpdActivitySchema, insertMemberRenewalSchema, insertMemberActivitySchema, insertUserSessionSchema, insertApplicationWorkflowSchema, insertPaymentInstallmentSchema, insertNotificationSchema, insertUserPermissionSchema, insertAuditLogSchema, insertSystemSettingsSchema, insertIndividualApplicationSchema, insertOrganizationApplicationSchema, insertUploadedDocumentSchema, insertStatusHistorySchema, insertRegistryDecisionSchema, insertNamingSeriesCounterSchema, insertAppLoginTokenSchema, insertAchievementBadgeSchema, insertMemberAchievementBadgeSchema, businessExperienceItemSchema, businessExperienceSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    userRoleEnum = pgEnum("user_role", ["admin", "member_manager", "case_manager", "super_admin", "staff", "accountant", "reviewer"]);
    userStatusEnum = pgEnum("user_status", ["active", "inactive", "suspended", "locked", "pending_verification"]);
    memberTypeEnum = pgEnum("member_type", ["real_estate_agent", "property_manager", "principal_real_estate_agent", "real_estate_negotiator", "property_developer"]);
    organizationTypeEnum = pgEnum("organization_type", ["real_estate_agency", "property_management_firm", "brokerage_firm", "real_estate_development_firm"]);
    membershipStatusEnum = pgEnum("membership_status", ["active", "suspended", "expired", "pending"]);
    caseStatusEnum = pgEnum("case_status", ["open", "under_investigation", "resolved", "closed"]);
    casePriorityEnum = pgEnum("case_priority", ["low", "medium", "high", "critical"]);
    caseTypeEnum = pgEnum("case_type", ["complaint", "inquiry", "dispute", "violation"]);
    eventTypeEnum = pgEnum("event_type", ["workshop", "seminar", "training", "conference", "meeting"]);
    activityTypeEnum = pgEnum("activity_type", ["login", "logout", "profile_update", "document_upload", "payment", "case_submission", "event_registration", "status_change", "password_change", "role_change", "access_granted", "access_denied"]);
    renewalStatusEnum = pgEnum("renewal_status", ["pending", "reminded", "completed", "overdue", "lapsed"]);
    paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);
    paymentMethodEnum = pgEnum("payment_method", ["cash", "paynow_ecocash", "paynow_onemoney", "stripe_card", "bank_transfer", "cheque", "google_pay"]);
    applicationStatusEnum = pgEnum("application_status", ["draft", "submitted", "payment_pending", "payment_received", "under_review", "approved", "rejected", "pre_validation", "eligibility_review", "document_review", "needs_applicant_action", "ready_for_registry", "accepted", "withdrawn", "expired"]);
    applicationStageEnum = pgEnum("application_stage", ["initial_review", "document_verification", "background_check", "committee_review", "final_approval", "certificate_generation"]);
    applicationTypeEnum = pgEnum("application_type", ["individual", "organization"]);
    documentStatusEnum = pgEnum("document_status", ["uploaded", "verified", "rejected"]);
    documentTypeEnum = pgEnum("document_type", [
      "id_document",
      "academic_certificate",
      "proof_of_payment",
      "company_registration",
      "tax_clearance",
      "other"
    ]);
    decisionEnum = pgEnum("decision", ["accepted", "rejected"]);
    educationLevelEnum = pgEnum("education_level", ["o_level", "a_level", "bachelors", "hnd", "masters", "doctorate"]);
    notificationTypeEnum = pgEnum("notification_type", ["email", "sms", "push", "in_app"]);
    notificationStatusEnum = pgEnum("notification_status", ["pending", "sent", "delivered", "failed", "opened"]);
    applicantStatusEnum = pgEnum("applicant_status", ["registered", "email_verified", "application_started", "application_completed", "under_review", "approved", "rejected"]);
    users = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: text("email").notNull().unique(),
      password: text("password"),
      firstName: text("first_name"),
      lastName: text("last_name"),
      phone: text("phone"),
      role: userRoleEnum("role").default("staff"),
      status: userStatusEnum("status").default("active"),
      permissions: text("permissions"),
      // JSON array of specific permissions
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
      clerkId: text("clerk_id").unique(),
      // Clerk user ID for authentication
      createdBy: varchar("created_by"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    applicants = pgTable("applicants", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      applicantId: text("applicant_id").unique().notNull(),
      // Human-readable ID like APP-2024-001
      firstName: text("first_name").notNull(),
      surname: text("surname").notNull(),
      email: text("email").notNull().unique(),
      status: applicantStatusEnum("status").default("registered"),
      emailVerified: boolean("email_verified").default(false),
      emailVerificationToken: text("email_verification_token"),
      emailVerificationExpires: timestamp("email_verification_expires"),
      applicationStartedAt: timestamp("application_started_at"),
      applicationCompletedAt: timestamp("application_completed_at"),
      password: text("password"),
      passwordResetToken: text("password_reset_token"),
      passwordResetExpires: timestamp("password_reset_expires"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    organizationApplicants = pgTable("organization_applicants", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      applicantId: text("applicant_id").unique().notNull(),
      // Human-readable ID like ORG-APP-YYYY-XXXX
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
    organizations = pgTable("organizations", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: text("organization_id").unique(),
      name: text("name").notNull(),
      businessType: organizationTypeEnum("business_type").notNull(),
      registrationNumber: text("registration_number").unique(),
      email: text("email").notNull(),
      phone: text("phone"),
      physicalAddress: text("physical_address"),
      preaMemberId: varchar("prea_member_id"),
      // Principal Real Estate Agent - references members.id
      status: membershipStatusEnum("status").default("pending"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    members = pgTable("members", {
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
    directors = pgTable("directors", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      firstName: text("first_name").notNull(),
      lastName: text("last_name").notNull(),
      nationalId: text("national_id"),
      email: text("email"),
      phone: text("phone"),
      position: text("position"),
      // e.g., "Chairman", "Director", "Secretary"
      appointedDate: timestamp("appointed_date"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    individualApplications = pgTable("individual_applications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      applicationId: text("application_id").notNull().unique(),
      applicantEmail: text("applicant_email").notNull(),
      personal: jsonb("personal").notNull(),
      education: jsonb("education"),
      memberType: memberTypeEnum("member_type").notNull(),
      status: applicationStatusEnum("status").default("draft"),
      applicationFee: decimal("application_fee", { precision: 10, scale: 2 }),
      paymentStatus: paymentStatusEnum("payment_status"),
      paymentReference: text("payment_reference"),
      reviewNotes: text("review_notes"),
      reviewedBy: text("reviewed_by"),
      reviewedAt: timestamp("reviewed_at"),
      approvedAt: timestamp("approved_at"),
      createdMemberId: varchar("created_member_id"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    memberApplications = individualApplications;
    organizationApplications = pgTable("organization_applications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      applicationId: text("application_id").notNull().unique(),
      applicantEmail: text("applicant_email").notNull(),
      company: jsonb("company").notNull(),
      businessType: organizationTypeEnum("business_type").notNull(),
      status: applicationStatusEnum("status").default("draft"),
      applicationFee: decimal("application_fee", { precision: 10, scale: 2 }),
      paymentStatus: paymentStatusEnum("payment_status"),
      paymentReference: text("payment_reference"),
      reviewNotes: text("review_notes"),
      reviewedBy: text("reviewed_by"),
      reviewedAt: timestamp("reviewed_at"),
      approvedAt: timestamp("approved_at"),
      createdOrganizationId: varchar("created_organization_id"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    uploadedDocuments2 = pgTable("uploaded_documents", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      applicationType: varchar("application_type").notNull(),
      // Not enum in DB - stores 'individual' or 'organization'
      applicationIdFk: varchar("application_id_fk").notNull(),
      // References individual_applications.id or organization_applications.id
      docType: varchar("doc_type").notNull(),
      // Not enum in DB - stores various document type strings
      fileKey: text("file_key"),
      fileName: text("file_name").notNull(),
      fileData: text("file_data"),
      // Base64 encoded file content for database storage (fallback when object storage not available)
      mime: text("mime"),
      sizeBytes: integer("size_bytes"),
      sha256: text("sha256"),
      status: varchar("status").default("uploaded"),
      // Not enum in DB
      rejectionReason: text("rejection_reason"),
      verifierUserId: varchar("verifier_user_id").references(() => users.id),
      verifiedAt: timestamp("verified_at"),
      uploadedAt: timestamp("uploaded_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    statusHistory = pgTable("status_history", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      applicationType: applicationTypeEnum("application_type").notNull(),
      applicationIdFk: varchar("application_id_fk").notNull(),
      fromStatus: applicationStatusEnum("from_status"),
      toStatus: applicationStatusEnum("to_status").notNull(),
      actorUserId: varchar("actor_user_id").references(() => users.id),
      comment: text("comment"),
      createdAt: timestamp("created_at").defaultNow()
    });
    registryDecisions = pgTable("registry_decisions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      applicationType: applicationTypeEnum("application_type").notNull(),
      applicationIdFk: varchar("application_id_fk").notNull(),
      decision: decisionEnum("decision").notNull(),
      reasons: text("reasons"),
      // JSON array of reasons
      decidedBy: varchar("decided_by").references(() => users.id),
      decidedAt: timestamp("decided_at").defaultNow()
    });
    namingSeriesCounters = pgTable("naming_series_counters", {
      seriesCode: varchar("series_code").notNull(),
      // 'member_ind' | 'member_org'
      year: integer("year").notNull(),
      counter: integer("counter").default(0)
    }, (table) => ({
      pk: sql`PRIMARY KEY (${table.seriesCode}, ${table.year})`
    }));
    appLoginTokens = pgTable("app_login_tokens", {
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
    cases = pgTable("cases", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      caseNumber: text("case_number").unique().notNull(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      type: caseTypeEnum("type").notNull(),
      priority: casePriorityEnum("priority").default("medium"),
      status: caseStatusEnum("status").default("open"),
      submittedBy: text("submitted_by"),
      // For anonymous submissions
      submittedByEmail: text("submitted_by_email"),
      memberId: varchar("member_id").references(() => members.id),
      organizationId: varchar("organization_id").references(() => organizations.id),
      assignedTo: varchar("assigned_to").references(() => users.id),
      resolution: text("resolution"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    events = pgTable("events", {
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
    eventRegistrations = pgTable("event_registrations", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      eventId: varchar("event_id").references(() => events.id),
      memberId: varchar("member_id").references(() => members.id),
      paymentStatus: paymentStatusEnum("payment_status").default("pending"),
      registrationDate: timestamp("registration_date").defaultNow(),
      attended: boolean("attended").default(false),
      certificateIssued: boolean("certificate_issued").default(false)
    });
    payments = pgTable("payments", {
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
      purpose: text("purpose").notNull(),
      // membership, event, application, renewal, fine
      description: text("description"),
      referenceNumber: text("reference_number"),
      transactionId: text("transaction_id"),
      externalPaymentId: text("external_payment_id"),
      // Stripe/Paynow ID
      gatewayResponse: text("gateway_response"),
      // JSON response from payment gateway
      paymentDate: timestamp("payment_date"),
      dueDate: timestamp("due_date"),
      processedBy: varchar("processed_by").references(() => users.id),
      receiptUrl: text("receipt_url"),
      notes: text("notes"),
      fees: decimal("fees", { precision: 10, scale: 2 }).default("0"),
      // Processing fees
      netAmount: decimal("net_amount", { precision: 10, scale: 2 }),
      // Amount after fees
      refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).default("0"),
      refundReason: text("refund_reason"),
      refundedAt: timestamp("refunded_at"),
      failureReason: text("failure_reason"),
      retryCount: integer("retry_count").default(0),
      lastRetryAt: timestamp("last_retry_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    cpdActivities = pgTable("cpd_activities", {
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
    memberRenewals = pgTable("member_renewals", {
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
    memberActivities = pgTable("member_activities", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      memberId: varchar("member_id").references(() => members.id),
      userId: varchar("user_id").references(() => users.id),
      activityType: activityTypeEnum("activity_type").notNull(),
      description: text("description").notNull(),
      details: text("details"),
      // JSON string for additional data
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      timestamp: timestamp("timestamp").defaultNow()
    });
    documents = pgTable("documents", {
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
    userSessions = pgTable("user_sessions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id).notNull(),
      sessionToken: text("session_token").unique().notNull(),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      location: text("location"),
      // Geolocation info
      deviceType: text("device_type"),
      // desktop, mobile, tablet
      isActive: boolean("is_active").default(true),
      lastActivity: timestamp("last_activity").defaultNow(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    applicationWorkflows = pgTable("application_workflows", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      applicationId: varchar("application_id").references(() => memberApplications.id).notNull(),
      stage: applicationStageEnum("stage").notNull(),
      status: text("status").notNull(),
      // pending, in_progress, completed, skipped, failed
      assignedTo: varchar("assigned_to").references(() => users.id),
      startedAt: timestamp("started_at"),
      completedAt: timestamp("completed_at"),
      dueDate: timestamp("due_date"),
      notes: text("notes"),
      documents: text("documents"),
      // JSON array of required documents for this stage
      estimatedDurationHours: integer("estimated_duration_hours").default(24),
      actualDurationHours: integer("actual_duration_hours"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    paymentInstallments = pgTable("payment_installments", {
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
    notifications = pgTable("notifications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id),
      memberId: varchar("member_id").references(() => members.id),
      type: notificationTypeEnum("type").notNull(),
      status: notificationStatusEnum("status").default("pending"),
      title: text("title").notNull(),
      message: text("message").notNull(),
      data: text("data"),
      // JSON data for notification context
      scheduledFor: timestamp("scheduled_for"),
      sentAt: timestamp("sent_at"),
      deliveredAt: timestamp("delivered_at"),
      openedAt: timestamp("opened_at"),
      externalId: text("external_id"),
      // ID from email/SMS service
      retryCount: integer("retry_count").default(0),
      maxRetries: integer("max_retries").default(3),
      createdAt: timestamp("created_at").defaultNow()
    });
    userPermissions = pgTable("user_permissions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id).notNull(),
      permission: text("permission").notNull(),
      // e.g., "users:create", "payments:view", "members:approve"
      resource: text("resource"),
      // Specific resource ID if permission is resource-specific
      grantedBy: varchar("granted_by").references(() => users.id),
      grantedAt: timestamp("granted_at").defaultNow(),
      expiresAt: timestamp("expires_at"),
      isActive: boolean("is_active").default(true)
    });
    auditLogs = pgTable("audit_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id),
      action: text("action").notNull(),
      // CREATE, UPDATE, DELETE, VIEW, LOGIN, etc.
      resource: text("resource").notNull(),
      // users, members, payments, etc.
      resourceId: text("resource_id"),
      // ID of the affected resource
      oldValues: text("old_values"),
      // JSON of old values
      newValues: text("new_values"),
      // JSON of new values
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      timestamp: timestamp("timestamp").defaultNow(),
      severity: text("severity").default("info"),
      // info, warning, error, critical
      description: text("description")
    });
    badgeTypeEnum = pgEnum("badge_type", [
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
    badgeDifficultyEnum = pgEnum("badge_difficulty", [
      "bronze",
      "silver",
      "gold",
      "platinum"
    ]);
    achievementBadges = pgTable("achievement_badges", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      description: text("description").notNull(),
      type: badgeTypeEnum("type").notNull(),
      difficulty: badgeDifficultyEnum("difficulty").default("bronze"),
      icon: text("icon").notNull(),
      color: text("color").notNull(),
      criteria: text("criteria").notNull(),
      // JSON string describing requirements
      points: integer("points").default(0),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    memberAchievementBadges = pgTable("member_achievement_badges", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      memberId: varchar("member_id").references(() => members.id),
      badgeId: varchar("badge_id").references(() => achievementBadges.id),
      earnedAt: timestamp("earned_at").defaultNow(),
      isVisible: boolean("is_visible").default(true),
      progress: integer("progress").default(0),
      // Percentage completion for ongoing badges
      createdAt: timestamp("created_at").defaultNow()
    });
    systemSettings = pgTable("system_settings", {
      key: text("key").primaryKey(),
      value: text("value").notNull(),
      // JSON string for flexibility
      description: text("description"),
      updatedBy: varchar("updated_by").references(() => users.id),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    usersRelations = relations(users, ({ many, one }) => ({
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
    organizationsRelations = relations(organizations, ({ one, many }) => ({
      members: many(members),
      directors: many(directors),
      preaMember: one(members, {
        fields: [organizations.preaMemberId],
        references: [members.id]
      }),
      applications: many(memberApplications),
      cases: many(cases),
      payments: many(payments),
      documents: many(documents)
    }));
    membersRelations = relations(members, ({ one, many }) => ({
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
    directorsRelations = relations(directors, ({ one }) => ({
      organization: one(organizations, {
        fields: [directors.organizationId],
        references: [organizations.id]
      })
    }));
    casesRelations = relations(cases, ({ one }) => ({
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
    eventsRelations = relations(events, ({ many }) => ({
      registrations: many(eventRegistrations)
    }));
    eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
      event: one(events, {
        fields: [eventRegistrations.eventId],
        references: [events.id]
      }),
      member: one(members, {
        fields: [eventRegistrations.memberId],
        references: [members.id]
      })
    }));
    paymentsRelations = relations(payments, ({ one, many }) => ({
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
    documentsRelations = relations(documents, ({ one }) => ({
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
    cpdActivitiesRelations = relations(cpdActivities, ({ one }) => ({
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
    memberRenewalsRelations = relations(memberRenewals, ({ one }) => ({
      member: one(members, {
        fields: [memberRenewals.memberId],
        references: [members.id]
      }),
      payment: one(payments, {
        fields: [memberRenewals.paymentId],
        references: [payments.id]
      })
    }));
    memberActivitiesRelations = relations(memberActivities, ({ one }) => ({
      member: one(members, {
        fields: [memberActivities.memberId],
        references: [members.id]
      }),
      user: one(users, {
        fields: [memberActivities.userId],
        references: [users.id]
      })
    }));
    userSessionsRelations = relations(userSessions, ({ one }) => ({
      user: one(users, {
        fields: [userSessions.userId],
        references: [users.id]
      })
    }));
    applicationWorkflowsRelations = relations(applicationWorkflows, ({ one }) => ({
      application: one(memberApplications, {
        fields: [applicationWorkflows.applicationId],
        references: [memberApplications.id]
      }),
      assignedUser: one(users, {
        fields: [applicationWorkflows.assignedTo],
        references: [users.id]
      })
    }));
    paymentInstallmentsRelations = relations(paymentInstallments, ({ one }) => ({
      payment: one(payments, {
        fields: [paymentInstallments.paymentId],
        references: [payments.id]
      })
    }));
    notificationsRelations = relations(notifications, ({ one }) => ({
      user: one(users, {
        fields: [notifications.userId],
        references: [users.id]
      }),
      member: one(members, {
        fields: [notifications.memberId],
        references: [members.id]
      })
    }));
    userPermissionsRelations = relations(userPermissions, ({ one }) => ({
      user: one(users, {
        fields: [userPermissions.userId],
        references: [users.id]
      }),
      grantedByUser: one(users, {
        fields: [userPermissions.grantedBy],
        references: [users.id]
      })
    }));
    auditLogsRelations = relations(auditLogs, ({ one }) => ({
      user: one(users, {
        fields: [auditLogs.userId],
        references: [users.id]
      })
    }));
    individualApplicationsRelations = relations(individualApplications, ({ one, many }) => ({
      createdMember: one(members, {
        fields: [individualApplications.createdMemberId],
        references: [members.id]
      }),
      documents: many(uploadedDocuments2),
      statusHistory: many(statusHistory),
      decisions: many(registryDecisions),
      loginTokens: many(appLoginTokens)
    }));
    organizationApplicationsRelations = relations(organizationApplications, ({ one, many }) => ({
      createdOrganization: one(organizations, {
        fields: [organizationApplications.createdOrganizationId],
        references: [organizations.id]
      }),
      documents: many(uploadedDocuments2),
      statusHistory: many(statusHistory),
      decisions: many(registryDecisions),
      loginTokens: many(appLoginTokens)
    }));
    uploadedDocumentsRelations = relations(uploadedDocuments2, ({ one }) => ({
      verifierUser: one(users, {
        fields: [uploadedDocuments2.verifierUserId],
        references: [users.id]
      })
    }));
    statusHistoryRelations = relations(statusHistory, ({ one }) => ({
      actorUser: one(users, {
        fields: [statusHistory.actorUserId],
        references: [users.id]
      })
    }));
    registryDecisionsRelations = relations(registryDecisions, ({ one }) => ({
      decidedByUser: one(users, {
        fields: [registryDecisions.decidedBy],
        references: [users.id]
      })
    }));
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertApplicantSchema = createInsertSchema(applicants).omit({
      id: true,
      applicantId: true,
      emailVerificationToken: true,
      emailVerificationExpires: true,
      createdAt: true,
      updatedAt: true
    });
    insertOrganizationApplicantSchema = createInsertSchema(organizationApplicants).omit({
      id: true,
      applicantId: true,
      emailVerificationToken: true,
      emailVerificationExpires: true,
      createdAt: true,
      updatedAt: true
    });
    insertMemberSchema = createInsertSchema(members).omit({
      id: true,
      membershipNumber: true,
      createdAt: true,
      updatedAt: true
    });
    insertOrganizationSchema = createInsertSchema(organizations).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertMemberApplicationSchema = createInsertSchema(memberApplications).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCaseSchema = createInsertSchema(cases).omit({
      id: true,
      caseNumber: true,
      createdAt: true,
      updatedAt: true
    });
    casesQuerySchema = z2.object({
      status: z2.enum(["open", "in_progress", "resolved", "closed"]).optional(),
      priority: z2.enum(["low", "medium", "high", "critical"]).optional(),
      type: z2.enum(["complaint", "inquiry", "dispute", "violation"]).optional(),
      assignedTo: z2.string().optional(),
      search: z2.string().optional()
    });
    caseUpdateSchema = createInsertSchema(cases).omit({
      id: true,
      caseNumber: true,
      createdAt: true,
      updatedAt: true
    }).partial();
    caseAssignmentSchema = z2.object({
      assignedTo: z2.string().optional()
    });
    bulkCaseAssignmentSchema = z2.object({
      caseIds: z2.array(z2.string()),
      assignedTo: z2.string()
    });
    bulkCaseResolutionSchema = z2.object({
      caseIds: z2.array(z2.string()),
      resolution: z2.string().optional(),
      status: z2.enum(["resolved", "closed"]).default("resolved")
    });
    bulkCaseActionSchema = z2.object({
      caseIds: z2.array(z2.string()),
      action: z2.enum(["assign", "resolve", "close"]),
      assignedTo: z2.string().optional(),
      resolution: z2.string().optional()
    });
    insertEventSchema = createInsertSchema(events).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPaymentSchema = createInsertSchema(payments).omit({
      id: true,
      createdAt: true
    });
    insertDocumentSchema = createInsertSchema(documents).omit({
      id: true,
      createdAt: true
    });
    insertCpdActivitySchema = createInsertSchema(cpdActivities).omit({
      id: true,
      createdAt: true
    });
    insertMemberRenewalSchema = createInsertSchema(memberRenewals).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertMemberActivitySchema = createInsertSchema(memberActivities).omit({
      id: true,
      timestamp: true
    });
    insertUserSessionSchema = createInsertSchema(userSessions).omit({
      id: true,
      createdAt: true
    });
    insertApplicationWorkflowSchema = createInsertSchema(applicationWorkflows).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPaymentInstallmentSchema = createInsertSchema(paymentInstallments).omit({
      id: true,
      createdAt: true
    });
    insertNotificationSchema = createInsertSchema(notifications).omit({
      id: true,
      createdAt: true
    });
    insertUserPermissionSchema = createInsertSchema(userPermissions).omit({
      id: true,
      grantedAt: true
    });
    insertAuditLogSchema = createInsertSchema(auditLogs).omit({
      id: true,
      timestamp: true
    });
    insertSystemSettingsSchema = createInsertSchema(systemSettings).omit({
      updatedAt: true
    });
    insertIndividualApplicationSchema = createInsertSchema(individualApplications).omit({
      id: true,
      applicationId: true,
      createdAt: true,
      updatedAt: true
    });
    insertOrganizationApplicationSchema = createInsertSchema(organizationApplications).omit({
      id: true,
      applicationId: true,
      createdAt: true,
      updatedAt: true
    });
    insertUploadedDocumentSchema = createInsertSchema(uploadedDocuments2).omit({
      id: true,
      uploadedAt: true,
      updatedAt: true
    });
    insertStatusHistorySchema = createInsertSchema(statusHistory).omit({
      id: true,
      createdAt: true
    });
    insertRegistryDecisionSchema = createInsertSchema(registryDecisions).omit({
      id: true,
      decidedAt: true
    });
    insertNamingSeriesCounterSchema = createInsertSchema(namingSeriesCounters);
    insertAppLoginTokenSchema = createInsertSchema(appLoginTokens).omit({
      id: true,
      createdAt: true
    });
    insertAchievementBadgeSchema = createInsertSchema(achievementBadges).omit({
      id: true,
      createdAt: true
    });
    insertMemberAchievementBadgeSchema = createInsertSchema(memberAchievementBadges).omit({
      id: true,
      createdAt: true
    });
    businessExperienceItemSchema = z2.object({
      employer: z2.string().min(2, "Employer name must be at least 2 characters"),
      typeOfBusiness: z2.string().min(2, "Type of business must be at least 2 characters"),
      jobTitle: z2.string().min(2, "Job title must be at least 2 characters"),
      dateFrom: z2.string().min(1, "Start date is required"),
      // ISO date format (yyyy-mm-dd)
      dateTo: z2.string().optional()
      // Optional for current positions
    }).superRefine((data, ctx) => {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      if (data.dateFrom > today) {
        ctx.addIssue({
          code: "custom",
          message: "Start date cannot be in the future",
          path: ["dateFrom"]
        });
      }
      if (data.dateTo && data.dateFrom > data.dateTo) {
        ctx.addIssue({
          code: "custom",
          message: "End date must be after start date",
          path: ["dateTo"]
        });
      }
      if (data.dateTo && data.dateTo > today) {
        ctx.addIssue({
          code: "custom",
          message: "End date cannot be in the future",
          path: ["dateTo"]
        });
      }
    });
    businessExperienceSchema = z2.array(businessExperienceItemSchema).min(1, "At least one business experience entry is required").max(20, "Too many experience entries (maximum 20 allowed)");
  }
});

// server/db.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
var sql2, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    sql2 = neon(process.env.DATABASE_URL);
    db = drizzle(sql2, { schema: schema_exports });
  }
});

// server/services/namingSeries.ts
var namingSeries_exports = {};
__export(namingSeries_exports, {
  getCurrentCounters: () => getCurrentCounters,
  initializeApplicationCounters: () => initializeApplicationCounters,
  nextApplicationId: () => nextApplicationId,
  nextMemberNumber: () => nextMemberNumber
});
import { sql as sql3 } from "drizzle-orm";
async function nextApplicationId(type) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const prefix = type === "individual" ? "APP-MBR-" : "APP-ORG-";
  const result = await db.execute(sql3`
    INSERT INTO application_id_counters (type, counter)
    VALUES (${type + "_" + currentYear}, 1)
    ON CONFLICT (type)
    DO UPDATE SET counter = application_id_counters.counter + 1
    RETURNING counter
  `);
  const counter = result.rows[0]?.counter || 1;
  return `${prefix}${currentYear}-${String(counter).padStart(4, "0")}`;
}
async function nextMemberNumber(kind) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const seriesCode = kind === "individual" ? "member_ind" : "member_org";
  const prefix = kind === "individual" ? "EAC-MBR-" : "EAC-ORG-";
  const counterKey = `${seriesCode}_${currentYear}`;
  const result = await db.execute(sql3`
    INSERT INTO naming_series_counters (series_code, year, counter)
    VALUES (${counterKey}, ${currentYear}, 1)
    ON CONFLICT (series_code, year)
    DO UPDATE SET counter = naming_series_counters.counter + 1
    RETURNING counter
  `);
  const counter = result.rows[0]?.counter || 1;
  return `${prefix}${currentYear}-${String(counter).padStart(4, "0")}`;
}
async function initializeApplicationCounters() {
  await db.execute(sql3`
    CREATE TABLE IF NOT EXISTS application_id_counters (
      type VARCHAR(20) PRIMARY KEY,
      counter INTEGER DEFAULT 0
    )
  `);
}
async function getCurrentCounters() {
  const memberCounters = await db.select().from(namingSeriesCounters);
  const appCounters = await db.execute(sql3`SELECT * FROM application_id_counters`);
  return {
    memberCounters,
    applicationCounters: appCounters.rows
  };
}
var init_namingSeries = __esm({
  "server/services/namingSeries.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/auth/sessionService.ts
var sessionService_exports = {};
__export(sessionService_exports, {
  SESSION_CONFIG: () => SESSION_CONFIG,
  SessionService: () => SessionService,
  refreshSessionMiddleware: () => refreshSessionMiddleware,
  sessionTimeoutMiddleware: () => sessionTimeoutMiddleware
});
import { eq, and, lt } from "drizzle-orm";
import { randomBytes } from "crypto";
function sessionTimeoutMiddleware(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  const session3 = req.session;
  if (session3 && session3.cookie) {
    const lastActivity = session3.cookie.expires ? new Date(session3.cookie.expires) : /* @__PURE__ */ new Date();
    const remaining = SessionService.getTimeoutRemaining(lastActivity);
    res.setHeader("X-Session-Timeout-Remaining", remaining.toString());
    if (remaining < 5) {
      res.setHeader("X-Session-Warning", "true");
    }
  }
  next();
}
function refreshSessionMiddleware(req, res, next) {
  if (req.isAuthenticated() && req.session) {
    req.session.touch();
  }
  next();
}
var SESSION_CONFIG, SessionService;
var init_sessionService = __esm({
  "server/auth/sessionService.ts"() {
    "use strict";
    init_db();
    init_schema();
    SESSION_CONFIG = {
      // Idle timeout: session expires after 60 minutes of inactivity
      IDLE_TIMEOUT_MINUTES: 60,
      // Absolute timeout: session expires after 8 hours regardless of activity
      ABSOLUTE_TIMEOUT_HOURS: 8,
      // Session cleanup: remove expired sessions every 1 hour
      CLEANUP_INTERVAL_MINUTES: 60
    };
    SessionService = class {
      static cleanupInterval = null;
      /**
       * Start automatic session cleanup
       */
      static startCleanup() {
        if (this.cleanupInterval) return;
        this.cleanupInterval = setInterval(
          () => {
            this.cleanupExpiredSessions().catch(console.error);
          },
          SESSION_CONFIG.CLEANUP_INTERVAL_MINUTES * 60 * 1e3
        );
        console.log("\u2705 Session cleanup started");
      }
      /**
       * Stop automatic session cleanup
       */
      static stopCleanup() {
        if (this.cleanupInterval) {
          clearInterval(this.cleanupInterval);
          this.cleanupInterval = null;
          console.log("Session cleanup stopped");
        }
      }
      /**
       * Clean up expired sessions
       */
      static async cleanupExpiredSessions() {
        const now = /* @__PURE__ */ new Date();
        const result = await db.delete(userSessions).where(
          and(
            lt(userSessions.expiresAt, now),
            eq(userSessions.isActive, true)
          )
        );
        const count2 = result.rowCount || 0;
        if (count2 > 0) {
          console.log(`\u{1F9F9} Cleaned up ${count2} expired sessions`);
        }
        return count2;
      }
      /**
       * Create a new session
       */
      static async createSession(userId, ipAddress, userAgent) {
        const sessionToken = randomBytes(32).toString("hex");
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(
          now.getTime() + SESSION_CONFIG.ABSOLUTE_TIMEOUT_HOURS * 60 * 60 * 1e3
        );
        await db.insert(userSessions).values({
          userId,
          sessionToken,
          ipAddress,
          userAgent,
          expiresAt,
          lastActivity: now,
          isActive: true
        });
        return sessionToken;
      }
      /**
       * Validate and update session
       */
      static async validateSession(sessionToken) {
        const [session3] = await db.select().from(userSessions).where(
          and(
            eq(userSessions.sessionToken, sessionToken),
            eq(userSessions.isActive, true)
          )
        ).limit(1);
        if (!session3) {
          return { valid: false, reason: "Session not found" };
        }
        const now = /* @__PURE__ */ new Date();
        if (new Date(session3.expiresAt) < now) {
          await this.invalidateSession(sessionToken);
          return { valid: false, reason: "Session expired (absolute timeout)" };
        }
        const lastActivity = new Date(session3.lastActivity || now);
        const idleMinutes = (now.getTime() - lastActivity.getTime()) / (1e3 * 60);
        if (idleMinutes > SESSION_CONFIG.IDLE_TIMEOUT_MINUTES) {
          await this.invalidateSession(sessionToken);
          return {
            valid: false,
            reason: "Session expired (idle timeout)"
          };
        }
        await db.update(userSessions).set({
          lastActivity: now
        }).where(eq(userSessions.sessionToken, sessionToken));
        return { valid: true, userId: session3.userId };
      }
      /**
       * Invalidate a session (logout)
       */
      static async invalidateSession(sessionToken) {
        await db.update(userSessions).set({
          isActive: false
        }).where(eq(userSessions.sessionToken, sessionToken));
      }
      /**
       * Invalidate all sessions for a user
       */
      static async invalidateAllUserSessions(userId) {
        await db.update(userSessions).set({
          isActive: false
        }).where(
          and(
            eq(userSessions.userId, userId),
            eq(userSessions.isActive, true)
          )
        );
      }
      /**
       * Get active sessions for a user
       */
      static async getUserActiveSessions(userId) {
        return await db.select({
          sessionToken: userSessions.sessionToken,
          createdAt: userSessions.createdAt,
          lastActivity: userSessions.lastActivity,
          expiresAt: userSessions.expiresAt,
          ipAddress: userSessions.ipAddress,
          userAgent: userSessions.userAgent
        }).from(userSessions).where(
          and(
            eq(userSessions.userId, userId),
            eq(userSessions.isActive, true)
          )
        );
      }
      /**
       * Get session timeout remaining (in minutes)
       */
      static getTimeoutRemaining(lastActivity) {
        const now = /* @__PURE__ */ new Date();
        const elapsed = (now.getTime() - lastActivity.getTime()) / (1e3 * 60);
        const remaining = SESSION_CONFIG.IDLE_TIMEOUT_MINUTES - elapsed;
        return Math.max(0, Math.round(remaining));
      }
    };
  }
});

// server/neonSessionStore.ts
import { Store } from "express-session";
var NeonSessionStore;
var init_neonSessionStore = __esm({
  "server/neonSessionStore.ts"() {
    "use strict";
    init_db();
    NeonSessionStore = class extends Store {
      initialized = false;
      constructor() {
        super();
      }
      async ensureTableExists() {
        if (this.initialized) return;
        try {
          await sql2`
        CREATE TABLE IF NOT EXISTS session (
          sid VARCHAR NOT NULL PRIMARY KEY,
          sess JSON NOT NULL,
          expire TIMESTAMP(6) NOT NULL
        )
      `;
          await sql2`CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire)`;
          this.initialized = true;
          console.log("\u2705 Session table ready");
        } catch (error) {
          console.error("\u274C Failed to create session table:", error);
          throw error;
        }
      }
      async get(sid, callback) {
        try {
          await this.ensureTableExists();
          const result = await sql2`
        SELECT sess FROM session WHERE sid = ${sid} AND expire >= NOW()
      `;
          if (result.length === 0) {
            return callback(null, null);
          }
          callback(null, result[0].sess);
        } catch (error) {
          callback(error);
        }
      }
      async set(sid, session3, callback) {
        try {
          await this.ensureTableExists();
          const expire = this.getExpireTime(session3);
          await sql2`
        INSERT INTO session (sid, sess, expire)
        VALUES (${sid}, ${JSON.stringify(session3)}, ${expire})
        ON CONFLICT (sid)
        DO UPDATE SET sess = ${JSON.stringify(session3)}, expire = ${expire}
      `;
          callback?.();
        } catch (error) {
          callback?.(error);
        }
      }
      async destroy(sid, callback) {
        try {
          await sql2`DELETE FROM session WHERE sid = ${sid}`;
          callback?.();
        } catch (error) {
          callback?.(error);
        }
      }
      async touch(sid, session3, callback) {
        try {
          const expire = this.getExpireTime(session3);
          await sql2`
        UPDATE session SET expire = ${expire} WHERE sid = ${sid}
      `;
          callback?.();
        } catch (error) {
          callback?.(error);
        }
      }
      async all(callback) {
        try {
          const result = await sql2`
        SELECT sess FROM session WHERE expire >= NOW()
      `;
          const sessions = result.map((row) => row.sess);
          callback(null, sessions);
        } catch (error) {
          callback(error);
        }
      }
      async clear(callback) {
        try {
          await sql2`DELETE FROM session`;
          callback?.();
        } catch (error) {
          callback?.(error);
        }
      }
      async length(callback) {
        try {
          const result = await sql2`
        SELECT COUNT(*) as count FROM session WHERE expire >= NOW()
      `;
          callback(null, Number(result[0].count));
        } catch (error) {
          callback(error);
        }
      }
      getExpireTime(session3) {
        const maxAge = session3.cookie?.maxAge || 864e5;
        return new Date(Date.now() + maxAge);
      }
    };
  }
});

// server/utils/applicantUtils.ts
var applicantUtils_exports = {};
__export(applicantUtils_exports, {
  generateVerificationToken: () => generateVerificationToken,
  getVerificationExpiry: () => getVerificationExpiry
});
import { randomUUID } from "crypto";
function generateVerificationToken() {
  return randomUUID().replace(/-/g, "");
}
function getVerificationExpiry() {
  const expiry = /* @__PURE__ */ new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
}
var init_applicantUtils = __esm({
  "server/utils/applicantUtils.ts"() {
    "use strict";
  }
});

// server/storage.ts
import { eq as eq2, and as and2, desc, asc, sql as sql4 } from "drizzle-orm";
async function migrateToHashedPasswords() {
  try {
    console.log("Checking for plaintext passwords to migrate...");
    const plainTextUsers = await db.select().from(users).where(sql4`password NOT LIKE '%.%'`);
    if (plainTextUsers.length === 0) {
      console.log("No plaintext passwords found. Migration not needed.");
      return;
    }
    console.log(`Found ${plainTextUsers.length} users with plaintext passwords. Migrating...`);
    for (const user of plainTextUsers) {
      const hashedPassword = await hashPassword(user.password);
      await db.update(users).set({
        password: hashedPassword,
        passwordChangedAt: /* @__PURE__ */ new Date()
      }).where(eq2(users.id, user.id));
      console.log(`Migrated password for user: ${user.email}`);
    }
    console.log(`Successfully migrated ${plainTextUsers.length} passwords to hashed format.`);
  } catch (error) {
    console.error("Error during password migration:", error);
    throw error;
  }
}
async function initializeDemoData() {
  try {
    console.log("Initializing demo data...");
    console.log("Force creating demo data...");
    const demoUsers = [
      {
        email: "admin@eacz.com",
        password: "admin123",
        firstName: "System",
        lastName: "Administrator",
        role: "super_admin",
        status: "active",
        department: "IT Administration",
        jobTitle: "System Administrator"
      },
      {
        email: "member.manager@eacz.com",
        password: "manager123",
        firstName: "Sarah",
        lastName: "Thompson",
        role: "member_manager",
        status: "active",
        department: "Membership Services",
        jobTitle: "Senior Member Manager"
      },
      {
        email: "case.manager@eacz.com",
        password: "case123",
        firstName: "David",
        lastName: "Wilson",
        role: "case_manager",
        status: "active",
        department: "Legal Affairs",
        jobTitle: "Case Manager"
      },
      {
        email: "staff@eacz.com",
        password: "staff123",
        firstName: "Lisa",
        lastName: "Martinez",
        role: "staff",
        status: "active",
        department: "Applications Review",
        jobTitle: "Senior Staff Member"
      },
      {
        email: "accountant@eacz.com",
        password: "accounts123",
        firstName: "Michael",
        lastName: "Brown",
        role: "accountant",
        status: "active",
        department: "Finance",
        jobTitle: "Chief Accountant"
      }
    ];
    const createdUsers = [];
    for (const userData of demoUsers) {
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        console.log(`User ${userData.email} already exists, updating password to match demo data`);
        const hashedPassword = await hashPassword(userData.password);
        await db.update(users).set({
          password: hashedPassword,
          passwordChangedAt: /* @__PURE__ */ new Date()
        }).where(eq2(users.id, existingUser.id));
        const updatedUser = await storage.getUser(existingUser.id);
        createdUsers.push(updatedUser);
        continue;
      }
      const userWithHashedPassword = {
        ...userData,
        password: await hashPassword(userData.password)
      };
      const user = await storage.createUser(userWithHashedPassword);
      createdUsers.push(user);
    }
    const demoOrganizations = [
      {
        name: "Premier Estate Agents",
        businessType: "real_estate_agency",
        registrationNumber: "EAC-ORG-2023-0001",
        email: "info@premierestate.com",
        phone: "+263 4 123 4567",
        physicalAddress: "123 Union Avenue, Harare",
        status: "active"
      },
      {
        name: "Harare Property Management",
        businessType: "property_management_firm",
        registrationNumber: "EAC-ORG-2023-0002",
        email: "contact@harareprop.com",
        phone: "+263 4 234 5678",
        physicalAddress: "456 Second Street, Harare",
        status: "active"
      },
      {
        name: "Zimbabwe Brokerage Services",
        businessType: "brokerage_firm",
        registrationNumber: "EAC-ORG-2023-0003",
        email: "admin@zim-brokerage.com",
        phone: "+263 4 345 6789",
        physicalAddress: "789 Third Avenue, Bulawayo",
        status: "pending"
      }
    ];
    const createdOrgs = [];
    for (const orgData of demoOrganizations) {
      const existingOrg = await storage.getOrganizationByRegistrationNumber(orgData.registrationNumber);
      if (existingOrg) {
        console.log(`Organization ${orgData.registrationNumber} already exists, skipping creation`);
        createdOrgs.push(existingOrg);
        continue;
      }
      const org = await storage.createOrganization(orgData);
      createdOrgs.push(org);
    }
    const demoMembers = [
      {
        firstName: "John",
        lastName: "Chikwanha",
        email: "john.chikwanha@gmail.com",
        phone: "+263 77 123 4567",
        membershipNumber: "EAC-MBR-2023-0012",
        memberType: "principal_real_estate_agent",
        membershipStatus: "active",
        dateOfBirth: /* @__PURE__ */ new Date("1980-05-15"),
        nationalId: "08-123456-A-15",
        organizationId: createdOrgs[0].id,
        joinedDate: /* @__PURE__ */ new Date("2023-01-20"),
        expiryDate: /* @__PURE__ */ new Date("2024-01-20")
      },
      {
        firstName: "Grace",
        lastName: "Mukamuri",
        email: "grace.mukamuri@yahoo.com",
        phone: "+263 77 234 5678",
        membershipNumber: "EAC-MBR-2023-0023",
        memberType: "real_estate_agent",
        membershipStatus: "active",
        dateOfBirth: /* @__PURE__ */ new Date("1985-08-22"),
        nationalId: "08-234567-B-22",
        organizationId: createdOrgs[0].id,
        joinedDate: /* @__PURE__ */ new Date("2023-02-15"),
        expiryDate: /* @__PURE__ */ new Date("2024-02-15")
      },
      {
        firstName: "Tendai",
        lastName: "Moyo",
        email: "tendai.moyo@outlook.com",
        phone: "+263 77 345 6789",
        membershipNumber: "EAC-MBR-2023-0034",
        memberType: "property_manager",
        membershipStatus: "active",
        dateOfBirth: /* @__PURE__ */ new Date("1982-03-10"),
        nationalId: "08-345678-C-10",
        organizationId: createdOrgs[1].id,
        joinedDate: /* @__PURE__ */ new Date("2023-03-25"),
        expiryDate: /* @__PURE__ */ new Date("2024-03-25")
      },
      {
        firstName: "Chipo",
        lastName: "Mutumwa",
        email: "chipo.mutumwa@gmail.com",
        phone: "+263 77 456 7890",
        membershipNumber: "EAC-MBR-2023-0045",
        memberType: "real_estate_negotiator",
        membershipStatus: "pending",
        dateOfBirth: /* @__PURE__ */ new Date("1990-11-05"),
        nationalId: "08-456789-D-05",
        organizationId: createdOrgs[2].id,
        joinedDate: /* @__PURE__ */ new Date("2023-04-10"),
        expiryDate: /* @__PURE__ */ new Date("2024-04-10")
      }
    ];
    const createdMembers = [];
    for (const memberData of demoMembers) {
      const existingMember = await storage.getMemberByEmail(memberData.email);
      if (existingMember) {
        console.log(`Member ${memberData.email} already exists, skipping creation`);
        createdMembers.push(existingMember);
        continue;
      }
      const member = await storage.createMember(memberData);
      createdMembers.push(member);
    }
    const demoCases = [
      {
        caseNumber: "CASE-2023-001",
        title: "Unauthorized Property Sale",
        description: "Complaint regarding unauthorized sale of property by agent without proper documentation.",
        type: "complaint",
        priority: "high",
        status: "under_investigation",
        submittedBy: "Anonymous Client",
        submittedByEmail: "client@example.com",
        memberId: createdMembers[0].id,
        assignedTo: createdUsers[2].id
        // Case manager
      },
      {
        caseNumber: "CASE-2023-002",
        title: "Property Management Inquiry",
        description: "General inquiry about property management regulations and requirements.",
        type: "inquiry",
        priority: "medium",
        status: "open",
        submittedBy: "Mary Ndoro",
        submittedByEmail: "mary.ndoro@email.com",
        assignedTo: createdUsers[2].id
        // Case manager
      },
      {
        caseNumber: "CASE-2023-003",
        title: "Commission Dispute",
        description: "Dispute between agent and client regarding commission payments.",
        type: "dispute",
        priority: "high",
        status: "resolved",
        memberId: createdMembers[1].id,
        assignedTo: createdUsers[2].id,
        // Case manager
        resolution: "Matter resolved through mediation. Commission payment plan agreed upon."
      },
      {
        caseNumber: "CASE-2023-004",
        title: "Ethical Violation Report",
        description: "Report of potential ethical violations in property transactions.",
        type: "violation",
        priority: "critical",
        status: "open",
        submittedBy: "Concerned Citizen",
        submittedByEmail: "concerned@example.com",
        memberId: createdMembers[2].id,
        assignedTo: createdUsers[2].id
        // Case manager
      }
    ];
    for (const caseData of demoCases) {
      const existingCase = await storage.getCaseByCaseNumber(caseData.caseNumber);
      if (existingCase) {
        console.log(`Case ${caseData.caseNumber} already exists, skipping creation`);
        continue;
      }
      await storage.createCase(caseData);
    }
    const demoEvents = [
      {
        title: "Real Estate Law Update Workshop",
        description: "Annual workshop covering updates in real estate law and regulations for 2024.",
        type: "workshop",
        startDate: /* @__PURE__ */ new Date("2024-02-15T09:00:00Z"),
        endDate: /* @__PURE__ */ new Date("2024-02-15T17:00:00Z"),
        location: "Harare Conference Center",
        address: "123 Conference Road, Harare",
        instructor: "Advocate Susan Chigara",
        capacity: 100,
        price: "50.00",
        cpdPoints: 8,
        isActive: true
      },
      {
        title: "Property Valuation Seminar",
        description: "Comprehensive seminar on modern property valuation techniques and market trends.",
        type: "seminar",
        startDate: /* @__PURE__ */ new Date("2024-03-20T08:30:00Z"),
        endDate: /* @__PURE__ */ new Date("2024-03-20T16:30:00Z"),
        location: "Bulawayo Business Center",
        address: "456 Business Avenue, Bulawayo",
        instructor: "Dr. Patrick Mutomba",
        capacity: 80,
        price: "75.00",
        cpdPoints: 10,
        isActive: true
      },
      {
        title: "Digital Marketing for Real Estate",
        description: "Training session on using digital marketing tools to promote real estate services.",
        type: "training",
        startDate: /* @__PURE__ */ new Date("2024-04-10T10:00:00Z"),
        endDate: /* @__PURE__ */ new Date("2024-04-11T16:00:00Z"),
        location: "Mutare Training Institute",
        address: "789 Training Street, Mutare",
        instructor: "Ms. Jennifer Katsande",
        capacity: 50,
        price: "120.00",
        cpdPoints: 15,
        isActive: true
      },
      {
        title: "Annual Real Estate Conference",
        description: "The premier annual conference for real estate professionals in Zimbabwe.",
        type: "conference",
        startDate: /* @__PURE__ */ new Date("2024-06-15T08:00:00Z"),
        endDate: /* @__PURE__ */ new Date("2024-06-17T18:00:00Z"),
        location: "Victoria Falls Conference Resort",
        address: "Victoria Falls, Zimbabwe",
        instructor: "Multiple Industry Experts",
        capacity: 300,
        price: "250.00",
        cpdPoints: 25,
        isActive: true
      }
    ];
    const createdEvents = [];
    for (const eventData of demoEvents) {
      const existingEvents = await storage.getAllEvents();
      const existingEvent = existingEvents.find((e) => e.title === eventData.title);
      if (existingEvent) {
        console.log(`Event "${eventData.title}" already exists, skipping creation`);
        createdEvents.push(existingEvent);
        continue;
      }
      const event = await storage.createEvent(eventData);
      createdEvents.push(event);
    }
    const demoPayments = [
      {
        paymentNumber: "PAY-2023-001",
        memberId: createdMembers[0].id,
        amount: "500.00",
        currency: "USD",
        paymentMethod: "paynow_ecocash",
        status: "completed",
        purpose: "membership",
        description: "Annual membership fee payment",
        referenceNumber: "ECO123456789",
        paymentDate: /* @__PURE__ */ new Date("2023-01-25"),
        processedBy: createdUsers[4].id
        // Accountant
      },
      {
        paymentNumber: "PAY-2023-002",
        memberId: createdMembers[1].id,
        amount: "50.00",
        currency: "USD",
        paymentMethod: "stripe_card",
        status: "completed",
        purpose: "event",
        description: "Real Estate Law Update Workshop registration",
        eventId: createdEvents[0].id,
        transactionId: "pi_stripe_12345",
        paymentDate: /* @__PURE__ */ new Date("2023-02-10"),
        processedBy: createdUsers[4].id
        // Accountant
      },
      {
        paymentNumber: "PAY-2023-003",
        organizationId: createdOrgs[0].id,
        amount: "5000.00",
        currency: "USD",
        paymentMethod: "bank_transfer",
        status: "completed",
        purpose: "membership",
        description: "Organization annual membership fee",
        referenceNumber: "BT987654321",
        paymentDate: /* @__PURE__ */ new Date("2023-01-30"),
        processedBy: createdUsers[4].id
        // Accountant
      },
      {
        paymentNumber: "PAY-2023-004",
        memberId: createdMembers[2].id,
        amount: "75.00",
        currency: "USD",
        paymentMethod: "cash",
        status: "pending",
        purpose: "event",
        description: "Property Valuation Seminar registration",
        eventId: createdEvents[1].id,
        dueDate: /* @__PURE__ */ new Date("2024-03-15")
      }
    ];
    for (const paymentData of demoPayments) {
      const existingPayments = await storage.getAllPayments();
      const existingPayment = existingPayments.find((p) => p.paymentNumber === paymentData.paymentNumber);
      if (existingPayment) {
        console.log(`Payment ${paymentData.paymentNumber} already exists, skipping creation`);
        continue;
      }
      await storage.createPayment(paymentData);
    }
    const demoApplications = [
      {
        applicationId: "APP-2023-001",
        applicantEmail: "robert.banda@gmail.com",
        memberType: "real_estate_agent",
        status: "submitted",
        applicationFee: "100.00",
        paymentStatus: "completed",
        personal: {
          firstName: "Robert",
          lastName: "Banda",
          email: "robert.banda@gmail.com",
          phone: "+263 77 567 8901",
          dateOfBirth: (/* @__PURE__ */ new Date("1988-07-12")).toISOString(),
          nationalId: "08-567890-E-12"
        },
        education: {
          educationLevel: "bachelors",
          workExperience: 3,
          currentEmployer: "Independent Agent",
          jobTitle: "Real Estate Agent"
        },
        reviewedBy: createdUsers[3].id
        // Staff member
      },
      {
        applicationId: "APP-2023-002",
        applicantEmail: "patricia.matemba@yahoo.com",
        memberType: "property_manager",
        status: "draft",
        applicationFee: "100.00",
        paymentStatus: "pending",
        personal: {
          firstName: "Patricia",
          lastName: "Matemba",
          email: "patricia.matemba@yahoo.com",
          phone: "+263 77 678 9012",
          dateOfBirth: (/* @__PURE__ */ new Date("1992-04-18")).toISOString(),
          nationalId: "08-678901-F-18"
        },
        education: {
          educationLevel: "hnd",
          workExperience: 2,
          currentEmployer: "City Properties Ltd",
          jobTitle: "Junior Property Manager"
        },
        reviewedBy: createdUsers[3].id
        // Staff member
      }
    ];
    for (const appData of demoApplications) {
      const existingApplications = await storage.getAllApplications();
      const existingApp = existingApplications.find((app2) => app2.applicationId === appData.applicationId);
      if (existingApp) {
        console.log(`Application ${appData.applicationId} already exists, skipping creation`);
        continue;
      }
      await storage.createMemberApplication(appData);
    }
    console.log("Demo data initialization completed successfully!");
    console.log(`Created ${createdUsers.length} users, ${createdOrgs.length} organizations, ${createdMembers.length} members`);
  } catch (error) {
    console.error("Error initializing demo data:", error);
  }
}
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_neonSessionStore();
    init_auth();
    DatabaseStorage = class {
      sessionStore;
      migrationCompleted = false;
      constructor() {
        this.sessionStore = new NeonSessionStore();
        this.runPasswordMigration();
      }
      async runPasswordMigration() {
        if (this.migrationCompleted) return;
        try {
          await migrateToHashedPasswords();
          this.migrationCompleted = true;
        } catch (error) {
          console.error("Failed to run password migration:", error);
        }
      }
      // User operations
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq2(users.id, id));
        return user || void 0;
      }
      async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq2(users.email, email));
        return user || void 0;
      }
      async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq2(users.email, username));
        return user || void 0;
      }
      async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
      // Applicant operations
      async createApplicant(insertApplicant) {
        const { nextApplicationId: nextApplicationId2 } = await Promise.resolve().then(() => (init_namingSeries(), namingSeries_exports));
        const applicantId = await nextApplicationId2("individual");
        const { generateVerificationToken: generateVerificationToken3, getVerificationExpiry: getVerificationExpiry2 } = await Promise.resolve().then(() => (init_applicantUtils(), applicantUtils_exports));
        const verificationToken = generateVerificationToken3();
        const verificationExpiry = getVerificationExpiry2();
        const [applicant] = await db.insert(applicants).values({
          ...insertApplicant,
          applicantId,
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpiry
        }).returning();
        return applicant;
      }
      async getApplicant(id) {
        const [applicant] = await db.select().from(applicants).where(eq2(applicants.id, id));
        return applicant || void 0;
      }
      async getApplicantByEmail(email) {
        const [applicant] = await db.select().from(applicants).where(eq2(applicants.email, email));
        return applicant || void 0;
      }
      async getApplicantByApplicantId(applicantId) {
        const [applicant] = await db.select().from(applicants).where(eq2(applicants.applicantId, applicantId));
        return applicant || void 0;
      }
      async getApplicantByVerificationToken(token) {
        const [applicant] = await db.select().from(applicants).where(eq2(applicants.emailVerificationToken, token));
        return applicant || void 0;
      }
      async updateApplicant(id, updates) {
        const [applicant] = await db.update(applicants).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(applicants.id, id)).returning();
        return applicant;
      }
      async verifyApplicantEmail(id) {
        const [applicant] = await db.update(applicants).set({
          emailVerified: true,
          status: "email_verified",
          emailVerificationToken: null,
          emailVerificationExpires: null,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq2(applicants.id, id)).returning();
        return applicant;
      }
      async listApplicants() {
        return await db.select().from(applicants).orderBy(desc(applicants.createdAt));
      }
      // Organization Applicant operations
      async createOrganizationApplicant(insertOrgApplicant) {
        const { nextApplicationId: nextApplicationId2 } = await Promise.resolve().then(() => (init_namingSeries(), namingSeries_exports));
        const applicantId = await nextApplicationId2("organization");
        const { generateVerificationToken: generateVerificationToken3, getVerificationExpiry: getVerificationExpiry2 } = await Promise.resolve().then(() => (init_applicantUtils(), applicantUtils_exports));
        const verificationToken = generateVerificationToken3();
        const verificationExpiry = getVerificationExpiry2();
        const [orgApplicant] = await db.insert(organizationApplicants).values({
          ...insertOrgApplicant,
          applicantId,
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpiry
        }).returning();
        return orgApplicant;
      }
      async getOrganizationApplicant(id) {
        const [orgApplicant] = await db.select().from(organizationApplicants).where(eq2(organizationApplicants.id, id));
        return orgApplicant || void 0;
      }
      async getOrganizationApplicantByEmail(email) {
        const [orgApplicant] = await db.select().from(organizationApplicants).where(eq2(organizationApplicants.email, email));
        return orgApplicant || void 0;
      }
      async getOrganizationApplicantByApplicantId(applicantId) {
        const [orgApplicant] = await db.select().from(organizationApplicants).where(eq2(organizationApplicants.applicantId, applicantId));
        return orgApplicant || void 0;
      }
      async getOrganizationApplicantByVerificationToken(token) {
        const [orgApplicant] = await db.select().from(organizationApplicants).where(eq2(organizationApplicants.emailVerificationToken, token));
        return orgApplicant || void 0;
      }
      async updateOrganizationApplicant(id, updates) {
        const [orgApplicant] = await db.update(organizationApplicants).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(organizationApplicants.id, id)).returning();
        return orgApplicant;
      }
      async verifyOrganizationApplicantEmail(id) {
        const [orgApplicant] = await db.update(organizationApplicants).set({
          emailVerified: true,
          status: "email_verified",
          emailVerificationToken: null,
          emailVerificationExpires: null,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq2(organizationApplicants.id, id)).returning();
        return orgApplicant;
      }
      async listOrganizationApplicants() {
        return await db.select().from(organizationApplicants).orderBy(desc(organizationApplicants.createdAt));
      }
      // Application draft operations
      async saveApplicationDraft(applicantId, applicationData) {
        const applicant = await this.getApplicant(applicantId);
        if (!applicant) {
          throw new Error("Applicant not found");
        }
        const [existingDraft] = await db.select().from(individualApplications).where(eq2(individualApplications.applicationId, applicant.applicantId));
        const draftData = {
          personal: JSON.stringify(applicationData.personalInfo || {}),
          oLevel: JSON.stringify(applicationData.oLevel || {}),
          aLevel: JSON.stringify(applicationData.aLevel || {}),
          equivalentQualification: JSON.stringify(applicationData.equivalentQualification || {}),
          matureEntry: applicationData.matureEntry || false,
          status: "draft",
          updatedAt: /* @__PURE__ */ new Date()
        };
        if (existingDraft) {
          const [updated] = await db.update(individualApplications).set(draftData).where(eq2(individualApplications.id, existingDraft.id)).returning();
          return {
            id: updated.id,
            applicationData,
            updatedAt: updated.updatedAt || /* @__PURE__ */ new Date()
          };
        } else {
          const [newDraft] = await db.insert(individualApplications).values({
            applicationId: applicant.applicantId,
            ...draftData
          }).returning();
          return {
            id: newDraft.id,
            applicationData,
            updatedAt: newDraft.updatedAt || /* @__PURE__ */ new Date()
          };
        }
      }
      async loadApplicationDraft(applicantId) {
        const applicant = await this.getApplicant(applicantId);
        if (!applicant) {
          throw new Error("Applicant not found");
        }
        const [draft] = await db.select().from(individualApplications).where(eq2(individualApplications.applicationId, applicant.applicantId));
        if (!draft) {
          return null;
        }
        const applicationData = {
          personalInfo: JSON.parse(draft.personal || "{}"),
          oLevel: JSON.parse(draft.oLevel || "{}"),
          aLevel: JSON.parse(draft.aLevel || "{}"),
          equivalentQualification: JSON.parse(draft.equivalentQualification || "{}"),
          matureEntry: draft.matureEntry || false
        };
        return {
          id: draft.id,
          applicationData,
          updatedAt: draft.updatedAt || /* @__PURE__ */ new Date()
        };
      }
      // Member operations
      async getMember(id) {
        const [member] = await db.select().from(members).where(eq2(members.id, id));
        return member || void 0;
      }
      async getMemberByUserId(userId) {
        const [member] = await db.select().from(members).where(eq2(members.clerkId, userId));
        return member || void 0;
      }
      async getMemberByEmail(email) {
        const [member] = await db.select().from(members).where(eq2(members.email, email));
        return member || void 0;
      }
      async getMemberByMembershipNumber(number) {
        const [member] = await db.select().from(members).where(eq2(members.membershipNumber, number));
        return member || void 0;
      }
      async createMember(insertMember) {
        let membershipNumber = insertMember.membershipNumber;
        if (!membershipNumber) {
          const { nextMemberNumber: nextMemberNumber2 } = await Promise.resolve().then(() => (init_namingSeries(), namingSeries_exports));
          membershipNumber = await nextMemberNumber2("individual");
        }
        const [member] = await db.insert(members).values({ ...insertMember, membershipNumber }).returning();
        return member;
      }
      async updateMember(id, updates) {
        const [member] = await db.update(members).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(members.id, id)).returning();
        return member;
      }
      async getAllMembers() {
        return await db.select().from(members).orderBy(desc(members.createdAt));
      }
      async getAllMembersWithOrganizations() {
        const results = await db.select({
          member: members,
          organization: organizations
        }).from(members).leftJoin(organizations, eq2(members.organizationId, organizations.id)).orderBy(desc(members.createdAt));
        return results.map((row) => ({
          ...row.member,
          organization: row.organization || null
        }));
      }
      // Organization operations
      async getOrganization(id) {
        const [org] = await db.select().from(organizations).where(eq2(organizations.id, id));
        return org || void 0;
      }
      async getOrganizationByRegistrationNumber(number) {
        const [org] = await db.select().from(organizations).where(eq2(organizations.registrationNumber, number));
        return org || void 0;
      }
      async createOrganization(insertOrg) {
        let registrationNumber = insertOrg.registrationNumber;
        if (!registrationNumber) {
          registrationNumber = `EAC-ORG-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")}`;
        }
        let organizationId = insertOrg.organizationId;
        if (!organizationId) {
          organizationId = registrationNumber;
        }
        const [org] = await db.insert(organizations).values({ ...insertOrg, organizationId, registrationNumber }).returning();
        return org;
      }
      async updateOrganization(id, updates) {
        const [org] = await db.update(organizations).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(organizations.id, id)).returning();
        return org;
      }
      async getAllOrganizations() {
        return await db.select().from(organizations).orderBy(desc(organizations.createdAt));
      }
      async getAllOrganizationsWithMembers() {
        const allOrgs = await db.select().from(organizations).orderBy(desc(organizations.createdAt));
        const orgsWithMembers = await Promise.all(
          allOrgs.map(async (org) => {
            const orgMembers = await db.select().from(members).where(eq2(members.organizationId, org.id));
            return {
              ...org,
              members: orgMembers,
              memberCount: orgMembers.length
            };
          })
        );
        return orgsWithMembers;
      }
      async getOrganizationByMemberId(memberId) {
        const [org] = await db.select().from(organizations).where(eq2(organizations.preaMemberId, memberId));
        return org || void 0;
      }
      async getOrganizationWithDetails(organizationId) {
        const [organization] = await db.select().from(organizations).where(eq2(organizations.id, organizationId));
        if (!organization) return void 0;
        const orgDirectors = await db.select().from(directors).where(and2(eq2(directors.organizationId, organizationId), eq2(directors.isActive, true))).orderBy(asc(directors.lastName));
        const orgMembers = await db.select().from(members).where(eq2(members.organizationId, organizationId)).orderBy(asc(members.lastName));
        const preaMember = organization.preaMemberId ? await db.select().from(members).where(eq2(members.id, organization.preaMemberId)).then((rows) => rows[0]) : null;
        return {
          ...organization,
          directors: orgDirectors,
          members: orgMembers,
          preaMember
        };
      }
      // Director operations
      async getDirectorsByOrganization(organizationId) {
        return await db.select().from(directors).where(and2(eq2(directors.organizationId, organizationId), eq2(directors.isActive, true))).orderBy(asc(directors.lastName));
      }
      async createDirector(insertDirector) {
        const [director] = await db.insert(directors).values(insertDirector).returning();
        return director;
      }
      async updateDirector(id, updates) {
        const [director] = await db.update(directors).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(directors.id, id)).returning();
        return director;
      }
      async deleteDirector(id) {
        await db.update(directors).set({ isActive: false, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(directors.id, id));
      }
      async getMembersByOrganization(organizationId) {
        return await db.select().from(members).where(eq2(members.organizationId, organizationId)).orderBy(asc(members.lastName));
      }
      async updateOrganizationPREA(organizationId, memberId) {
        const [org] = await db.update(organizations).set({ preaMemberId: memberId, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(organizations.id, organizationId)).returning();
        return org;
      }
      // Application operations
      async getMemberApplication(id) {
        const [app2] = await db.select().from(individualApplications).where(eq2(individualApplications.id, id));
        return app2 || void 0;
      }
      async createMemberApplication(insertApp) {
        const { nextApplicationId: nextApplicationId2 } = await Promise.resolve().then(() => (init_namingSeries(), namingSeries_exports));
        const applicationNumber = await nextApplicationId2("individual");
        const [app2] = await db.insert(individualApplications).values({ ...insertApp, applicationNumber }).returning();
        return app2;
      }
      async updateMemberApplication(id, updates) {
        const [app2] = await db.update(individualApplications).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(individualApplications.id, id)).returning();
        return app2;
      }
      // Helper function to transform JSONB fields to flat structure for backward compatibility
      transformApplication(app2) {
        const personal = typeof app2.personal === "string" ? JSON.parse(app2.personal) : app2.personal || {};
        const education = typeof app2.education === "string" ? JSON.parse(app2.education) : app2.education || {};
        return {
          ...app2,
          firstName: personal.firstName || "",
          lastName: personal.lastName || "",
          phone: personal.phone || "",
          address: personal.address || "",
          nationalId: personal.nationalId || "",
          dateOfBirth: personal.dateOfBirth || null,
          educationLevel: education.level || "",
          institution: education.institution || "",
          yearCompleted: education.yearCompleted || null
        };
      }
      async getPendingApplications() {
        const apps = await db.select().from(individualApplications).where(sql4`status IN ('submitted', 'payment_pending', 'payment_received', 'under_review')`).orderBy(desc(individualApplications.createdAt));
        return apps.map((app2) => this.transformApplication(app2));
      }
      // Organization Application operations
      async getOrganizationApplication(id) {
        const [app2] = await db.select().from(organizationApplications).where(eq2(organizationApplications.id, id));
        return app2 || void 0;
      }
      async createOrganizationApplication(insertApp) {
        const { nextApplicationId: nextApplicationId2 } = await Promise.resolve().then(() => (init_namingSeries(), namingSeries_exports));
        const applicationId = await nextApplicationId2("organization");
        const [app2] = await db.insert(organizationApplications).values({ ...insertApp, applicationId }).returning();
        return app2;
      }
      async updateOrganizationApplication(id, updates) {
        const [app2] = await db.update(organizationApplications).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(organizationApplications.id, id)).returning();
        return app2;
      }
      async getAllOrganizationApplications() {
        return await db.select().from(organizationApplications).orderBy(desc(organizationApplications.createdAt));
      }
      async getOrganizationApplicationsByStatus(status) {
        return await db.select().from(organizationApplications).where(eq2(organizationApplications.status, status)).orderBy(desc(organizationApplications.createdAt));
      }
      async assignOrganizationApplicationReviewer(id, reviewerId) {
        const [application] = await db.update(organizationApplications).set({
          createdByUserId: reviewerId,
          // Using this field for reviewer assignment temporarily
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq2(organizationApplications.id, id)).returning();
        return application;
      }
      // Case operations
      async getCase(id) {
        const [caseItem] = await db.select().from(cases).where(eq2(cases.id, id));
        return caseItem || void 0;
      }
      async getCaseByCaseNumber(number) {
        const [caseItem] = await db.select().from(cases).where(eq2(cases.caseNumber, number));
        return caseItem || void 0;
      }
      async createCase(insertCase) {
        const caseNumber = `CASE-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`;
        const [caseItem] = await db.insert(cases).values({ ...insertCase, caseNumber }).returning();
        return caseItem;
      }
      async updateCase(id, updates) {
        const [caseItem] = await db.update(cases).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(cases.id, id)).returning();
        return caseItem;
      }
      async getAllCases() {
        return await db.select().from(cases).orderBy(desc(cases.createdAt));
      }
      async getCasesByStatus(status) {
        return await db.select().from(cases).where(eq2(cases.status, status)).orderBy(desc(cases.createdAt));
      }
      async getCasesByPriority(priority) {
        return await db.select().from(cases).where(eq2(cases.priority, priority)).orderBy(desc(cases.createdAt));
      }
      async assignCase(caseId, assignedTo) {
        const [caseItem] = await db.update(cases).set({ assignedTo, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(cases.id, caseId)).returning();
        return caseItem;
      }
      async bulkAssignCases(caseIds, assignedTo) {
        const updatedCases = [];
        for (const caseId of caseIds) {
          const [caseItem] = await db.update(cases).set({ assignedTo, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(cases.id, caseId)).returning();
          updatedCases.push(caseItem);
        }
        return updatedCases;
      }
      async bulkResolveCases(caseIds, resolution) {
        const updatedCases = [];
        for (const caseId of caseIds) {
          const [caseItem] = await db.update(cases).set({
            status: "resolved",
            resolution: resolution || "Case resolved via bulk action",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq2(cases.id, caseId)).returning();
          updatedCases.push(caseItem);
        }
        return updatedCases;
      }
      async bulkCloseCases(caseIds) {
        const updatedCases = [];
        for (const caseId of caseIds) {
          const [caseItem] = await db.update(cases).set({
            status: "closed",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq2(cases.id, caseId)).returning();
          updatedCases.push(caseItem);
        }
        return updatedCases;
      }
      async getStaffUsers() {
        return await db.select().from(users).where(sql4`role IN ('admin', 'case_manager', 'staff', 'super_admin')`).orderBy(users.firstName);
      }
      // Event operations
      async getEvent(id) {
        const [event] = await db.select().from(events).where(eq2(events.id, id));
        return event || void 0;
      }
      async createEvent(insertEvent) {
        const [event] = await db.insert(events).values(insertEvent).returning();
        return event;
      }
      async updateEvent(id, updates) {
        const [event] = await db.update(events).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(events.id, id)).returning();
        return event;
      }
      async getAllEvents() {
        return await db.select().from(events).orderBy(desc(events.startDate));
      }
      async getUpcomingEvents() {
        return await db.select().from(events).where(and2(
          eq2(events.isActive, true),
          sql4`${events.startDate} > NOW()`
        )).orderBy(events.startDate);
      }
      // Payment operations
      async createPayment(insertPayment) {
        const [payment] = await db.insert(payments).values(insertPayment).returning();
        return payment;
      }
      async getPaymentsByMember(memberId) {
        return await db.select().from(payments).where(eq2(payments.memberId, memberId)).orderBy(desc(payments.createdAt));
      }
      async updatePaymentStatus(id, status) {
        const [payment] = await db.update(payments).set({ status, paymentDate: /* @__PURE__ */ new Date() }).where(eq2(payments.id, id)).returning();
        return payment;
      }
      // Document operations
      async createDocument(insertDoc) {
        const [doc] = await db.insert(documents).values(insertDoc).returning();
        return doc;
      }
      async getDocumentsByMember(memberId) {
        return await db.select().from(documents).where(eq2(documents.memberId, memberId)).orderBy(desc(documents.createdAt));
      }
      async getDocumentsByApplication(applicationId) {
        return await db.select().from(documents).where(eq2(documents.applicationId, applicationId)).orderBy(desc(documents.createdAt));
      }
      async verifyDocument(id, verifierId) {
        const [doc] = await db.update(documents).set({
          isVerified: true,
          verifiedBy: verifierId,
          verificationDate: /* @__PURE__ */ new Date()
        }).where(eq2(documents.id, id)).returning();
        return doc;
      }
      // CPD Activities
      async getCpdActivities() {
        return [
          {
            id: "cpd-1",
            activityTitle: "Real Estate Law Update Workshop",
            activityType: "workshop",
            pointsEarned: 5,
            completionDate: "2024-11-15",
            isVerified: true
          }
        ];
      }
      async createCpdActivity(data) {
        return { id: `cpd-${Date.now()}`, ...data, isVerified: false };
      }
      // Member Renewals
      async getMemberRenewals() {
        return [
          {
            id: "renewal-1",
            renewalYear: 2024,
            dueDate: "2024-12-31",
            status: "pending",
            remindersSent: 1,
            renewalFee: "150.00",
            member: {
              firstName: "John",
              lastName: "Doe",
              membershipNumber: "REA-2023-001234"
            }
          }
        ];
      }
      async getCurrentMemberRenewal() {
        return {
          id: "renewal-current",
          renewalYear: 2024,
          dueDate: "2024-12-31",
          status: "pending",
          renewalFee: "150.00"
        };
      }
      async sendRenewalReminder(renewalId) {
        console.log(`Sending renewal reminder for ${renewalId}`);
      }
      async completeRenewal(renewalId) {
        return { id: renewalId, status: "completed", renewalDate: /* @__PURE__ */ new Date() };
      }
      // Member Activities (Audit Trail)
      async getMemberActivities() {
        return [];
      }
      async createMemberActivity(data) {
        return { id: `activity-${Date.now()}`, ...data, timestamp: /* @__PURE__ */ new Date() };
      }
      // Enhanced User Management Methods
      async updateUser(id, updates) {
        const [user] = await db.update(users).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(users.id, id)).returning();
        return user;
      }
      async getAllUsers() {
        return await db.select().from(users).orderBy(desc(users.createdAt));
      }
      async getUsersByRole(role) {
        return await db.select().from(users).where(eq2(users.role, role));
      }
      async lockUser(id, lockedUntil) {
        return await this.updateUser(id, {
          status: "locked",
          lockedUntil,
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      async unlockUser(id) {
        return await this.updateUser(id, {
          status: "active",
          lockedUntil: null,
          loginAttempts: 0,
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      async updateLastLogin(id) {
        return await this.updateUser(id, {
          lastLoginAt: /* @__PURE__ */ new Date(),
          loginAttempts: 0,
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      async incrementLoginAttempts(id) {
        const [user] = await db.update(users).set({
          loginAttempts: sql4`${users.loginAttempts} + 1`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq2(users.id, id)).returning();
        return user;
      }
      async resetLoginAttempts(id) {
        return await this.updateUser(id, { loginAttempts: 0, updatedAt: /* @__PURE__ */ new Date() });
      }
      async verifyPassword(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user) return false;
        return await comparePasswords(password, user.password);
      }
      async updateUserPassword(id, newPassword) {
        const hashedPassword = await hashPassword(newPassword);
        return await this.updateUser(id, {
          password: hashedPassword,
          passwordChangedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      // Clerk integration methods
      async getUserByClerkId(clerkId) {
        const [user] = await db.select().from(users).where(eq2(users.clerkId, clerkId));
        return user || void 0;
      }
      async createUserFromClerk(clerkData) {
        const userData = {
          clerkId: clerkData.clerkId,
          email: clerkData.email,
          firstName: clerkData.firstName,
          lastName: clerkData.lastName,
          password: "",
          role: null,
          status: "active",
          emailVerified: true
        };
        const [user] = await db.insert(users).values(userData).returning();
        return user;
      }
      // Enhanced Payment Methods
      async getPayment(id) {
        const [payment] = await db.select().from(payments).where(eq2(payments.id, id));
        return payment || void 0;
      }
      async getPaymentsByOrganization(organizationId) {
        return await db.select().from(payments).where(eq2(payments.organizationId, organizationId)).orderBy(desc(payments.createdAt));
      }
      async getPaymentsByApplication(applicationId) {
        return await db.select().from(payments).where(eq2(payments.applicationId, applicationId)).orderBy(desc(payments.createdAt));
      }
      async processRefund(id, refundAmount, reason) {
        const [payment] = await db.update(payments).set({
          status: "refunded",
          refundAmount: refundAmount.toString(),
          refundReason: reason,
          refundedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq2(payments.id, id)).returning();
        return payment;
      }
      async getAllPayments() {
        return await db.select().from(payments).orderBy(desc(payments.createdAt));
      }
      async getRecentPayments(limit) {
        return await db.select().from(payments).orderBy(desc(payments.createdAt)).limit(limit);
      }
      async getPaymentsByDateRange(startDate, endDate) {
        return await db.select().from(payments).where(and2(
          sql4`${payments.createdAt} >= ${startDate}`,
          sql4`${payments.createdAt} <= ${endDate}`
        )).orderBy(desc(payments.createdAt));
      }
      async getPaymentsByMethod(method) {
        return await db.select().from(payments).where(eq2(payments.paymentMethod, method)).orderBy(desc(payments.createdAt));
      }
      // Payment Installments
      async createPaymentInstallment(installment) {
        const [newInstallment] = await db.insert(paymentInstallments).values(installment).returning();
        return newInstallment;
      }
      async getInstallmentsByPayment(paymentId) {
        return await db.select().from(paymentInstallments).where(eq2(paymentInstallments.paymentId, paymentId)).orderBy(paymentInstallments.installmentNumber);
      }
      async updateInstallmentStatus(id, status) {
        const [installment] = await db.update(paymentInstallments).set({ status, paidDate: /* @__PURE__ */ new Date() }).where(eq2(paymentInstallments.id, id)).returning();
        return installment;
      }
      // Enhanced Application Methods
      async getApplicationsByStatus(status) {
        const apps = await db.select().from(individualApplications).where(eq2(individualApplications.status, status)).orderBy(desc(individualApplications.createdAt));
        return apps.map((app2) => this.transformApplication(app2));
      }
      async getApplicationsByStage(stage) {
        const apps = await db.select().from(individualApplications).where(eq2(individualApplications.currentStage, stage)).orderBy(desc(individualApplications.createdAt));
        return apps.map((app2) => this.transformApplication(app2));
      }
      async getAllApplications() {
        const apps = await db.select().from(individualApplications).orderBy(desc(individualApplications.createdAt));
        return apps.map((app2) => this.transformApplication(app2));
      }
      async assignApplicationReviewer(id, reviewerId) {
        const [application] = await db.update(individualApplications).set({
          reviewedBy: reviewerId,
          reviewStartedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq2(individualApplications.id, id)).returning();
        return application;
      }
      // Application Workflow Methods
      async createApplicationWorkflow(workflow) {
        const [newWorkflow] = await db.insert(applicationWorkflows).values(workflow).returning();
        return newWorkflow;
      }
      async getWorkflowsByApplication(applicationId) {
        return await db.select().from(applicationWorkflows).where(eq2(applicationWorkflows.applicationId, applicationId)).orderBy(applicationWorkflows.createdAt);
      }
      async updateWorkflowStage(id, updates) {
        const [workflow] = await db.update(applicationWorkflows).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(applicationWorkflows.id, id)).returning();
        return workflow;
      }
      async getWorkflowsByStage(stage) {
        return await db.select().from(applicationWorkflows).where(eq2(applicationWorkflows.stage, stage)).orderBy(desc(applicationWorkflows.createdAt));
      }
      async getWorkflowsByAssignee(userId) {
        return await db.select().from(applicationWorkflows).where(eq2(applicationWorkflows.assignedTo, userId)).orderBy(desc(applicationWorkflows.createdAt));
      }
      // Session Management
      async createUserSession(session3) {
        const [newSession] = await db.insert(userSessions).values(session3).returning();
        return newSession;
      }
      async getUserSessions(userId) {
        return await db.select().from(userSessions).where(and2(
          eq2(userSessions.userId, userId),
          eq2(userSessions.isActive, true)
        )).orderBy(desc(userSessions.lastActivity));
      }
      async updateSessionActivity(sessionId) {
        const [session3] = await db.update(userSessions).set({ lastActivity: /* @__PURE__ */ new Date() }).where(eq2(userSessions.id, sessionId)).returning();
        return session3;
      }
      async deactivateSession(sessionId) {
        const [session3] = await db.update(userSessions).set({ isActive: false }).where(eq2(userSessions.id, sessionId)).returning();
        return session3;
      }
      async cleanupExpiredSessions() {
        const result = await db.update(userSessions).set({ isActive: false }).where(sql4`${userSessions.expiresAt} < NOW()`).returning({ id: userSessions.id });
        return result.length;
      }
      // User Permissions
      async createUserPermission(permission) {
        const [newPermission] = await db.insert(userPermissions).values(permission).returning();
        return newPermission;
      }
      async getUserPermissions(userId) {
        return await db.select().from(userPermissions).where(and2(
          eq2(userPermissions.userId, userId),
          eq2(userPermissions.isActive, true)
        ));
      }
      async checkUserPermission(userId, permission, resource) {
        const permissions = await db.select().from(userPermissions).where(and2(
          eq2(userPermissions.userId, userId),
          eq2(userPermissions.permission, permission),
          eq2(userPermissions.isActive, true),
          resource ? eq2(userPermissions.resource, resource) : sql4`1=1`
        ));
        return permissions.length > 0;
      }
      async revokeUserPermission(id) {
        const [permission] = await db.update(userPermissions).set({ isActive: false }).where(eq2(userPermissions.id, id)).returning();
        return permission;
      }
      // Notifications
      async createNotification(notification) {
        const [newNotification] = await db.insert(notifications).values(notification).returning();
        return newNotification;
      }
      async getUserNotifications(userId) {
        return await db.select().from(notifications).where(eq2(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
      }
      async getMemberNotifications(memberId) {
        return await db.select().from(notifications).where(eq2(notifications.memberId, memberId)).orderBy(desc(notifications.createdAt));
      }
      async markNotificationSent(id) {
        const [notification] = await db.update(notifications).set({ status: "sent", sentAt: /* @__PURE__ */ new Date() }).where(eq2(notifications.id, id)).returning();
        return notification;
      }
      async markNotificationDelivered(id) {
        const [notification] = await db.update(notifications).set({ status: "delivered", deliveredAt: /* @__PURE__ */ new Date() }).where(eq2(notifications.id, id)).returning();
        return notification;
      }
      async markNotificationOpened(id) {
        const [notification] = await db.update(notifications).set({ openedAt: /* @__PURE__ */ new Date() }).where(eq2(notifications.id, id)).returning();
        return notification;
      }
      async getPendingNotifications() {
        return await db.select().from(notifications).where(eq2(notifications.status, "pending")).orderBy(notifications.scheduledFor || notifications.createdAt);
      }
      // Audit Logging
      async createAuditLog(log2) {
        const [newLog] = await db.insert(auditLogs).values(log2).returning();
        return newLog;
      }
      async getAuditLogs(filters) {
        const conditions = [];
        if (filters?.userId) {
          conditions.push(eq2(auditLogs.userId, filters.userId));
        }
        if (filters?.resource) {
          conditions.push(eq2(auditLogs.resource, filters.resource));
        }
        if (filters?.action) {
          conditions.push(eq2(auditLogs.action, filters.action));
        }
        if (conditions.length > 0) {
          return await db.select().from(auditLogs).where(and2(...conditions)).orderBy(desc(auditLogs.timestamp));
        }
        return await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp));
      }
      // Dashboard Statistics
      async getDashboardStats() {
        const totalMembersResult = await db.select({ count: sql4`count(*)` }).from(members);
        const totalMembers = totalMembersResult[0]?.count || 0;
        const totalOrganizationsResult = await db.select({ count: sql4`count(*)` }).from(organizations);
        const totalOrganizations = totalOrganizationsResult[0]?.count || 0;
        const activeOrganizationsResult = await db.select({ count: sql4`count(*)` }).from(organizations).where(eq2(organizations.status, "active"));
        const activeOrganizations = activeOrganizationsResult[0]?.count || 0;
        const pendingIndividualApplicationsResult = await db.select({ count: sql4`count(*)` }).from(individualApplications).where(sql4`status IN ('submitted', 'payment_pending', 'payment_received', 'under_review')`);
        const pendingIndividualApplications = pendingIndividualApplicationsResult[0]?.count || 0;
        const pendingOrganizationApplicationsResult = await db.select({ count: sql4`count(*)` }).from(organizationApplications).where(sql4`status IN ('submitted', 'payment_pending', 'payment_received', 'under_review')`);
        const pendingOrganizationApplications = pendingOrganizationApplicationsResult[0]?.count || 0;
        const pendingApplications = pendingIndividualApplications + pendingOrganizationApplications;
        const openCasesResult = await db.select({ count: sql4`count(*)` }).from(cases).where(eq2(cases.status, "open"));
        const openCases = openCasesResult[0]?.count || 0;
        const totalUsersResult = await db.select({ count: sql4`count(*)` }).from(users);
        const totalUsers = totalUsersResult[0]?.count || 0;
        const upcomingEventsResult = await db.select({ count: sql4`count(*)` }).from(events).where(sql4`${events.startDate} >= NOW()`);
        const upcomingEvents = upcomingEventsResult[0]?.count || 0;
        const startOfMonth = /* @__PURE__ */ new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const revenueResult = await db.select({ sum: sql4`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(payments).where(and2(
          eq2(payments.status, "completed"),
          sql4`created_at >= ${startOfMonth}`
        ));
        const revenueThisMonth = Number(revenueResult[0]?.sum || 0);
        const totalRevenueResult = await db.select({ sum: sql4`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(payments).where(eq2(payments.status, "completed"));
        const totalRevenue = Number(totalRevenueResult[0]?.sum || 0);
        const renewalsPending = 0;
        return {
          totalMembers,
          activeOrganizations,
          totalOrganizations,
          pendingApplications,
          openCases,
          totalRevenue,
          revenueThisMonth,
          renewalsPending,
          totalUsers,
          upcomingEvents
        };
      }
      // Finance Statistics  
      async getFinanceStats(filters) {
        const conditions = [eq2(payments.status, "completed")];
        if (filters?.startDate) {
          conditions.push(sql4`created_at >= ${filters.startDate}`);
        }
        if (filters?.endDate) {
          conditions.push(sql4`created_at <= ${filters.endDate}`);
        }
        const totalRevenueResult = await db.select({ sum: sql4`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(payments).where(and2(...conditions));
        const totalRevenue = Number(totalRevenueResult[0]?.sum || 0);
        const startOfMonth = /* @__PURE__ */ new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const monthlyRevenueResult = await db.select({ sum: sql4`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(payments).where(and2(
          eq2(payments.status, "completed"),
          sql4`created_at >= ${startOfMonth}`
        ));
        const monthlyRevenue = Number(monthlyRevenueResult[0]?.sum || 0);
        const pendingPaymentsResult = await db.select({ count: sql4`count(*)` }).from(payments).where(eq2(payments.status, "pending"));
        const pendingPayments = pendingPaymentsResult[0]?.count || 0;
        const completedPaymentsResult = await db.select({ count: sql4`count(*)` }).from(payments).where(eq2(payments.status, "completed"));
        const completedPayments = completedPaymentsResult[0]?.count || 0;
        const membershipFeesResult = await db.select({ sum: sql4`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(payments).where(and2(
          eq2(payments.status, "completed"),
          sql4`purpose LIKE '%membership%' OR purpose LIKE '%renewal%'`
        ));
        const membershipFees = Number(membershipFeesResult[0]?.sum || 0);
        const applicationFeesResult = await db.select({ sum: sql4`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(payments).where(and2(
          eq2(payments.status, "completed"),
          sql4`purpose LIKE '%application%'`
        ));
        const applicationFees = Number(applicationFeesResult[0]?.sum || 0);
        const eventFeesResult = await db.select({ sum: sql4`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` }).from(payments).where(and2(
          eq2(payments.status, "completed"),
          sql4`purpose LIKE '%event%'`
        ));
        const eventFees = Number(eventFeesResult[0]?.sum || 0);
        return {
          totalRevenue,
          monthlyRevenue,
          pendingPayments,
          completedPayments,
          membershipFees,
          applicationFees,
          eventFees,
          renewalFees: membershipFees
          // For now, same as membership fees
        };
      }
      // Enhanced Payment Listing
      async listPayments(filters) {
        const conditions = [];
        if (filters?.status) {
          conditions.push(eq2(payments.status, filters.status));
        }
        if (filters?.search) {
          conditions.push(sql4`(purpose ILIKE ${`%${filters.search}%`} OR payment_number ILIKE ${`%${filters.search}%`})`);
        }
        const totalResult = await db.select({ count: sql4`count(*)` }).from(payments).where(conditions.length > 0 ? and2(...conditions) : void 0);
        const total = totalResult[0]?.count || 0;
        const baseQuery = db.select().from(payments).where(conditions.length > 0 ? and2(...conditions) : void 0);
        const sortedQuery = filters?.sortBy === "amount" ? baseQuery.orderBy(filters.sortOrder === "asc" ? asc(sql4`CAST(amount AS DECIMAL)`) : desc(sql4`CAST(amount AS DECIMAL)`)) : baseQuery.orderBy(filters?.sortOrder === "asc" ? asc(payments.createdAt) : desc(payments.createdAt));
        const paginatedQuery = filters?.limit ? sortedQuery.limit(filters.limit) : sortedQuery;
        const finalQuery = filters?.offset ? paginatedQuery.offset(filters.offset) : paginatedQuery;
        const paymentsList = await finalQuery;
        return { payments: paymentsList, total };
      }
      async listRecentPayments(limit = 10) {
        return await db.select().from(payments).orderBy(desc(payments.createdAt)).limit(limit);
      }
      // Renewals Management
      async listRenewals(filters) {
        const conditions = [];
        if (filters?.year) {
          conditions.push(eq2(memberRenewals.renewalYear, filters.year));
        }
        if (filters?.status) {
          conditions.push(eq2(memberRenewals.status, filters.status));
        }
        const totalResult = await db.select({ count: sql4`count(*)` }).from(memberRenewals).where(conditions.length > 0 ? and2(...conditions) : void 0);
        const total = totalResult[0]?.count || 0;
        const baseQuery = db.select({
          id: memberRenewals.id,
          memberId: memberRenewals.memberId,
          renewalYear: memberRenewals.renewalYear,
          status: memberRenewals.status,
          dueDate: memberRenewals.dueDate,
          remindersSent: memberRenewals.remindersSent,
          lastReminderDate: memberRenewals.lastReminderDate,
          renewalDate: memberRenewals.renewalDate,
          renewalFee: memberRenewals.renewalFee,
          paymentId: memberRenewals.paymentId,
          createdAt: memberRenewals.createdAt,
          updatedAt: memberRenewals.updatedAt,
          member: {
            id: members.id,
            firstName: members.firstName,
            lastName: members.lastName,
            membershipNumber: members.membershipNumber,
            email: members.email,
            memberType: members.memberType
          }
        }).from(memberRenewals).leftJoin(members, eq2(memberRenewals.memberId, members.id)).where(conditions.length > 0 ? and2(...conditions) : void 0).orderBy(desc(memberRenewals.dueDate));
        const paginatedQuery = filters?.limit ? baseQuery.limit(filters.limit) : baseQuery;
        const finalQuery = filters?.offset ? paginatedQuery.offset(filters.offset) : paginatedQuery;
        const renewalsList = await finalQuery;
        return { renewals: renewalsList, total };
      }
      async updateRenewal(id, updates) {
        const [renewal] = await db.update(memberRenewals).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq2(memberRenewals.id, id)).returning();
        return renewal;
      }
      async incrementRenewalReminder(id) {
        const [renewal] = await db.update(memberRenewals).set({
          remindersSent: sql4`reminders_sent + 1`,
          lastReminderDate: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq2(memberRenewals.id, id)).returning();
        return renewal;
      }
      async generateRenewals(year, defaultFee = 50) {
        const activeMembers = await db.select().from(members).where(eq2(members.membershipStatus, "active"));
        const existingRenewals = await db.select({ memberId: memberRenewals.memberId }).from(memberRenewals).where(eq2(memberRenewals.renewalYear, year));
        const existingMemberIds = new Set(existingRenewals.map((r) => r.memberId));
        const membersNeedingRenewal = activeMembers.filter((m) => !existingMemberIds.has(m.id));
        let created = 0;
        let skipped = 0;
        for (const member of membersNeedingRenewal) {
          try {
            const dueDate = new Date(year, 2, 31);
            await db.insert(memberRenewals).values({
              memberId: member.id,
              renewalYear: year,
              dueDate,
              status: "pending",
              renewalFee: defaultFee.toString(),
              remindersSent: 0
            });
            created++;
          } catch (error) {
            console.error(`Failed to create renewal for member ${member.id}:`, error);
            skipped++;
          }
        }
        return { created, skipped };
      }
      // System Settings
      async getSettings() {
        return await db.select().from(systemSettings).orderBy(systemSettings.key);
      }
      async getSetting(key) {
        const [setting] = await db.select().from(systemSettings).where(eq2(systemSettings.key, key));
        return setting || void 0;
      }
      async updateSettings(settings) {
        const updatedSettings = [];
        for (const setting of settings) {
          const [updated] = await db.insert(systemSettings).values({
            key: setting.key,
            value: setting.value,
            description: setting.description,
            updatedAt: /* @__PURE__ */ new Date()
          }).onConflictDoUpdate({
            target: systemSettings.key,
            set: {
              value: setting.value,
              description: setting.description,
              updatedAt: /* @__PURE__ */ new Date()
            }
          }).returning();
          updatedSettings.push(updated);
        }
        return updatedSettings;
      }
      async updateSetting(key, value, description, updatedBy) {
        const [setting] = await db.insert(systemSettings).values({
          key,
          value,
          description,
          updatedBy,
          updatedAt: /* @__PURE__ */ new Date()
        }).onConflictDoUpdate({
          target: systemSettings.key,
          set: {
            value,
            description,
            updatedBy,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        return setting;
      }
      /**
       * Create uploaded document record
       */
      async createUploadedDocument(doc) {
        const [document] = await db.insert(uploadedDocuments).values(doc).returning();
        return document;
      }
    };
    storage = new DatabaseStorage();
    setTimeout(() => {
      initializeDemoData().catch(console.error);
    }, 2e3);
  }
});

// server/services/emailService.ts
var emailService_exports = {};
__export(emailService_exports, {
  generateApplicationConfirmationEmail: () => generateApplicationConfirmationEmail,
  generateApprovedMemberWelcomeEmail: () => generateApprovedMemberWelcomeEmail,
  generateMemberVerificationEmail: () => generateMemberVerificationEmail,
  generateNewMemberWelcomeEmail: () => generateNewMemberWelcomeEmail,
  generateOrgApplicantVerificationEmail: () => generateOrgApplicantVerificationEmail,
  generatePasswordChangeNotification: () => generatePasswordChangeNotification,
  generateProfileUpdateNotification: () => generateProfileUpdateNotification,
  generateVerificationEmail: () => generateVerificationEmail,
  generateWelcomeEmail: () => generateWelcomeEmail,
  sendEmail: () => sendEmail
});
import nodemailer from "nodemailer";
async function sendEmail(params) {
  try {
    if (!process.env.ZEPTOMAIL_API_KEY || !transporter) {
      console.log("Email would be sent to:", params.to, "Subject:", params.subject);
      console.log("Note: ZEPTOMAIL_API_KEY not configured - email functionality disabled");
      return true;
    }
    const mailOptions = {
      from: '"Estate Agents Council of Zimbabwe" <sysadmin@estateagentscouncil.org>',
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html
    };
    if (params.attachments && params.attachments.length > 0) {
      mailOptions.attachments = params.attachments;
    }
    console.log("Sending email via ZeptoMail SMTP to:", params.to);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending error:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    return false;
  }
}
function generateWelcomeEmail(fullName, applicantId) {
  const subject = "Welcome to EACZ - Your Application ID & Required Documents";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
        .logo-container { text-align: center; padding: 20px; background: #ffffff; }
        .logo { max-width: 200px; height: auto; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9f9f9; }
        .applicant-id { background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .documents-section { background: #fff8dc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .document-item { background: white; padding: 12px; margin: 10px 0; border-radius: 6px; border: 1px solid #e5e7eb; }
        .important-note { background: #dbeafe; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3b82f6; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-container">
          <img src="https://mms.estateagentscouncil.org/logo.png" alt="Estate Agents Council of Zimbabwe" class="logo" />
        </div>
        <div class="header">
          <h1>Estate Agents Council of Zimbabwe</h1>
        </div>
        <div class="content">
          <h2>Welcome, ${fullName}!</h2>
          <p>Thank you for starting your individual membership application with the Estate Agents Council of Zimbabwe.</p>

          <div class="applicant-id">
            <h3>Your Applicant ID</h3>
            <strong style="font-size: 18px; color: #1e40af;">${applicantId}</strong>
            <p style="margin-top: 10px; font-size: 14px;">Please save this ID for your records and use it as your password to log in</p>
          </div>

          <p>To continue with your application, please verify your email address by clicking the link in the verification email we're sending you.</p>

          <div class="documents-section">
            <h3 style="color: #d97706; margin-top: 0;">\u{1F4CB} Required Documents Checklist</h3>
            <p>Please have the following documents ready in digital format (PDF or image files) for upload during your application:</p>

            <div class="document-item">
              <strong>1. National ID or Passport</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Clear copy of your identification document</p>
            </div>

            <div class="document-item">
              <strong>2. Educational Certificates</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">\u2022 5 O-Level subjects (including English & Math)<br>\u2022 2 A-Level subjects OR proof of mature entry (27+ years)</p>
            </div>

            <div class="document-item">
              <strong>3. Proof of Address</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Recent utility bill or bank statement (not older than 3 months)</p>
            </div>

            <div class="document-item">
              <strong>4. Professional References</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Contact details of 2 professional references</p>
            </div>

            <div class="document-item">
              <strong>5. Passport Photo</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Recent passport-sized photograph</p>
            </div>
          </div>

          <div class="important-note">
            <strong>\u{1F4A1} Important:</strong> All documents must be clear, legible, and in digital format (PDF, JPG, or PNG). Maximum file size: 5MB per document.
          </div>

          <p>Once verified, you'll be able to complete your application form and upload the required documents.</p>

          <p>If you have any questions, please contact us at info@eacz.co.zw</p>
        </div>
        <div class="footer">
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `
    Welcome to EACZ, ${fullName}!

    Thank you for starting your individual membership application with the Estate Agents Council of Zimbabwe.

    Your Applicant ID: ${applicantId}
    Please save this ID for your records and use it as your password to log in.

    To continue with your application, please verify your email address by clicking the link in the verification email we're sending you.

    ============================================
    REQUIRED DOCUMENTS CHECKLIST
    ============================================

    Please have the following documents ready in digital format (PDF or image files) for upload during your application:

    1. NATIONAL ID OR PASSPORT
       - Clear copy of your identification document

    2. EDUCATIONAL CERTIFICATES
       - 5 O-Level subjects (including English & Math)
       - 2 A-Level subjects OR proof of mature entry (27+ years)

    3. PROOF OF ADDRESS
       - Recent utility bill or bank statement (not older than 3 months)

    4. PROFESSIONAL REFERENCES
       - Contact details of 2 professional references

    5. PASSPORT PHOTO
       - Recent passport-sized photograph

    IMPORTANT: All documents must be clear, legible, and in digital format (PDF, JPG, or PNG). Maximum file size: 5MB per document.

    ============================================

    Once verified, you'll be able to complete your application form and upload the required documents.

    If you have any questions, please contact us at info@eacz.co.zw

    \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  return { subject, html, text: text2 };
}
function generateOrgApplicantVerificationEmail(companyName, verificationToken) {
  const baseUrl = process.env.NODE_ENV === "production" ? "https://mms.estateagentscouncil.org" : "http://localhost:5000";
  const verificationUrl = `${baseUrl}/organization/verify-email?token=${verificationToken}`;
  const subject = "Verify Your Email Address - EACZ Organization Application";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
        .logo-container { text-align: center; padding: 20px; background: #ffffff; }
        .logo { max-width: 200px; height: auto; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-container">
          <img src="https://mms.estateagentscouncil.org/logo.png" alt="Estate Agents Council of Zimbabwe" class="logo" />
        </div>
        <div class="header">
          <h1>Email Verification Required</h1>
        </div>
        <div class="content">
          <h2>Hello ${companyName},</h2>
          <p>Please verify your email address to continue with your EACZ organization membership application.</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #e0e7ff; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
          
          <p>This verification link will expire in 24 hours for security reasons.</p>
          
          <p>If you didn't request this verification email, please ignore this message.</p>
          
          <p>Contact us at info@eacz.co.zw if you need assistance.</p>
        </div>
        <div class="footer">
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `
    Email Verification Required - EACZ Organization Application
    
    Hello ${companyName},
    
    Please verify your email address to continue with your EACZ organization membership application.
    
    Click this link to verify: ${verificationUrl}
    
    This verification link will expire in 24 hours for security reasons.
    
    If you didn't request this verification email, please ignore this message.
    
    Contact us at info@eacz.co.zw if you need assistance.
    
    \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  return { subject, html, text: text2 };
}
function generateVerificationEmail(fullName, verificationToken, baseUrl) {
  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;
  const subject = "Verify Your Email Address - EACZ Application";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
        .logo-container { text-align: center; padding: 20px; background: #ffffff; }
        .logo { max-width: 200px; height: auto; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-container">
          <img src="https://mms.estateagentscouncil.org/logo.png" alt="Estate Agents Council of Zimbabwe" class="logo" />
        </div>
        <div class="header">
          <h1>Email Verification Required</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Please verify your email address to continue with your EACZ membership application.</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #1e40af;">${verificationUrl}</p>
          
          <p>This verification link will expire in 24 hours.</p>
          
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `
    Hello ${fullName},
    
    Please verify your email address to continue with your EACZ membership application.
    
    Click this link to verify: ${verificationUrl}
    
    This verification link will expire in 24 hours.
    
    If you didn't request this verification, please ignore this email.
    
    \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  return { subject, html, text: text2 };
}
function generateApplicationConfirmationEmail(applicantName, applicationId, applicationType, feeAmount) {
  const typeDisplayName = applicationType === "individual" ? "Individual Membership" : "Organization Registration";
  const subject = `Application Submitted - ${applicationId}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .application-id { background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .fee-info { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Submitted Successfully</h1>
        </div>
        <div class="content">
          <h2>Hello ${applicantName},</h2>
          <p>Your ${typeDisplayName} application has been successfully submitted to the Estate Agents Council of Zimbabwe.</p>
          
          <div class="application-id">
            <h3>Application ID</h3>
            <strong style="font-size: 18px; color: #1e40af;">${applicationId}</strong>
            <p style="margin-top: 10px; font-size: 14px;">Please save this ID for your records</p>
          </div>
          
          <div class="fee-info">
            <h4>Next Steps - Payment Required</h4>
            <p><strong>Application Fee: $${feeAmount} USD</strong></p>
            <p>To complete your application, please:</p>
            <ul>
              <li>Upload all required documents</li>
              <li>Pay the application fee</li>
              <li>Submit your application for review</li>
            </ul>
          </div>
          
          <p>Your application is currently in <strong>draft</strong> status. You can continue editing and uploading documents until you're ready to submit for review.</p>
          
          <p>If you have any questions, please contact us at info@eacz.co.zw</p>
        </div>
        <div class="footer">
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `
    Application Submitted Successfully
    
    Hello ${applicantName},
    
    Your ${typeDisplayName} application has been successfully submitted to the Estate Agents Council of Zimbabwe.
    
    Application ID: ${applicationId}
    Please save this ID for your records.
    
    Next Steps - Payment Required:
    Application Fee: $${feeAmount} USD
    
    To complete your application, please:
    - Upload all required documents
    - Pay the application fee
    - Submit your application for review
    
    Your application is currently in draft status. You can continue editing and uploading documents until you're ready to submit for review.
    
    If you have any questions, please contact us at info@eacz.co.zw
    
    \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  return { subject, html, text: text2 };
}
function generateApprovedMemberWelcomeEmail(fullName, email, membershipNumber, passwordResetToken, baseUrl) {
  const subject = "Welcome to EACZ - Your Member Account is Ready!";
  const passwordResetUrl = `${baseUrl}/reset-password?token=${passwordResetToken}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .credentials { background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .password-button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .login-button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>\u{1F389} Welcome to EACZ!</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Congratulations! Your application has been approved and your member account has been created with the Estate Agents Council of Zimbabwe.</p>
          
          <div class="credentials">
            <h3>Your Member Details</h3>
            <p><strong>Member ID:</strong> ${membershipNumber}</p>
            <p><strong>Login Email:</strong> ${email}</p>
            <p><strong>Status:</strong> Account Ready - Password Setup Required</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${passwordResetUrl}" class="password-button">Set Your Password</a>
            <br>
            <a href="${baseUrl}" class="login-button">Visit Member Portal</a>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Click "Set Your Password" above to create your secure password</li>
            <li>Log in to the member portal with your email and new password</li>
            <li>Complete your member profile and upload required documents</li>
          </ol>
          
          <p>As a registered member, you now have access to:</p>
          <ul>
            <li>Member portal and resources</li>
            <li>CPD training and certification programs</li>
            <li>Industry updates and newsletters</li>
            <li>Professional networking opportunities</li>
          </ul>
          
          <p>If you have any questions, please contact us at info@eacz.co.zw</p>
        </div>
        <div class="footer">
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `
    Welcome to EACZ - Your Member Account is Ready!
    
    Hello ${fullName},
    
    Congratulations! Your application has been approved and your member account has been created with the Estate Agents Council of Zimbabwe.
    
    Your Member Details:
    - Member ID: ${membershipNumber}
    - Login Email: ${email}
    - Status: Account Ready - Password Setup Required
    
    Next Steps:
    1. Set your password: ${passwordResetUrl}
    2. Visit member portal: ${baseUrl}
    
    As a registered member, you now have access to:
    - Member portal and resources
    - CPD training and certification programs
    - Industry updates and newsletters
    - Professional networking opportunities
    
    If you have any questions, please contact us at info@eacz.co.zw
    
    \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  return { subject, html, text: text2 };
}
function generateNewMemberWelcomeEmail(fullName, membershipNumber, educationLevel, employmentStatus) {
  const subject = "Welcome to EACZ - Member Profile Created";
  const entryType = educationLevel === "normal_entry" ? "Normal Entry (5 O'levels + 2 A'levels)" : "Mature Entry (27+ years, 5 O'levels)";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .member-info { background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .next-steps { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to EACZ</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Your member profile has been successfully created with the Estate Agents Council of Zimbabwe.</p>
          
          <div class="member-info">
            <h3>Your Member Details</h3>
            <p><strong>Membership Number:</strong> ${membershipNumber}</p>
            <p><strong>Entry Type:</strong> ${entryType}</p>
            <p><strong>Employment Status:</strong> ${employmentStatus}</p>
            <p><strong>Status:</strong> Pending Email Verification</p>
          </div>
          
          <div class="next-steps">
            <h4>Next Steps Required</h4>
            <p>To activate your membership, you'll need to:</p>
            <ol>
              <li><strong>Verify your email address</strong> (verification email sent separately)</li>
              <li><strong>Complete your profile</strong> with additional details</li>
              <li><strong>Upload required documents</strong></li>
              <li><strong>Pay membership fees</strong></li>
            </ol>
          </div>
          
          <p>Once you've verified your email, you'll be able to log in and complete your profile with additional information such as professional qualifications, work experience, and required documentation.</p>
          
          <p>If you have any questions, please contact us at info@eacz.co.zw</p>
        </div>
        <div class="footer">
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `
    Welcome to EACZ
    
    Hello ${fullName},
    
    Your member profile has been successfully created with the Estate Agents Council of Zimbabwe.
    
    Your Member Details:
    - Membership Number: ${membershipNumber}
    - Entry Type: ${entryType}
    - Employment Status: ${employmentStatus}
    - Status: Pending Email Verification
    
    Next Steps Required:
    1. Verify your email address (verification email sent separately)
    2. Complete your profile with additional details
    3. Upload required documents
    4. Pay membership fees
    
    Once you've verified your email, you'll be able to log in and complete your profile with additional information such as professional qualifications, work experience, and required documentation.
    
    If you have any questions, please contact us at info@eacz.co.zw
    
    \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  return { subject, html, text: text2 };
}
function generateMemberVerificationEmail(fullName, email, membershipNumber, verificationToken, baseUrl) {
  const verificationUrl = `${baseUrl}/member-verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;
  const subject = "Verify Your Email - EACZ Member Profile";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .credentials { background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification Required</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Please verify your email address to activate your EACZ member profile and complete your registration.</p>
          
          <div class="credentials">
            <h3>Your Login Details</h3>
            <p><strong>Membership Number:</strong> ${membershipNumber}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p style="font-size: 14px; color: #666;">You'll use these to log in after verification</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email & Activate Profile</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #e0e7ff; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
          
          <p>After verifying your email, you'll be able to:</p>
          <ul>
            <li>Log in to your member dashboard</li>
            <li>Complete your professional profile</li>
            <li>Upload required documents</li>
            <li>Make membership fee payments</li>
            <li>Access member resources and services</li>
          </ul>
          
          <p>This verification link will expire in 24 hours for security reasons.</p>
          
          <p>If you didn't request this membership, please ignore this message.</p>
          
          <p>Contact us at info@eacz.co.zw if you need assistance.</p>
        </div>
        <div class="footer">
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `
    Email Verification Required - EACZ Member Profile
    
    Hello ${fullName},
    
    Please verify your email address to activate your EACZ member profile and complete your registration.
    
    Your Login Details:
    - Membership Number: ${membershipNumber}
    - Email: ${email}
    You'll use these to log in after verification
    
    Click this link to verify: ${verificationUrl}
    
    After verifying your email, you'll be able to:
    - Log in to your member dashboard
    - Complete your professional profile
    - Upload required documents
    - Make membership fee payments
    - Access member resources and services
    
    This verification link will expire in 24 hours for security reasons.
    
    If you didn't request this membership, please ignore this message.
    
    Contact us at info@eacz.co.zw if you need assistance.
    
    \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  return { subject, html, text: text2 };
}
function generateProfileUpdateNotification(userName) {
  const subject = "Profile Updated Successfully - EACZ";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .security-notice { background: #fef3cd; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Profile Updated Successfully</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Your profile has been successfully updated in the EACZ system.</p>
          
          <div class="security-notice">
            <strong>Security Notice:</strong> If you did not make this change, please contact our support team immediately at info@eacz.co.zw or call our office during business hours.
          </div>
          
          <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
        </div>
        <div class="footer">
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `Profile Updated Successfully - EACZ
    
Hello ${userName},

Your profile has been successfully updated in the EACZ system.

SECURITY NOTICE: If you did not make this change, please contact our support team immediately at info@eacz.co.zw or call our office during business hours.

Best regards,
Estate Agents Council of Zimbabwe`;
  return { subject, html, text: text2 };
}
function generatePasswordChangeNotification(userName) {
  const subject = "Password Changed Successfully - EACZ";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .security-alert { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Changed Successfully</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          
          <div class="security-alert">
            <strong>Important Security Notice:</strong> If you did NOT make this change, your account may be compromised. Please contact our support team IMMEDIATELY at info@eacz.co.zw.
          </div>
          
          <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
        </div>
        <div class="footer">
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `Password Changed Successfully - EACZ
    
Hello ${userName},

Your password has been successfully changed for your EACZ account.

IMPORTANT SECURITY NOTICE: If you did NOT make this change, your account may be compromised. Please contact our support team IMMEDIATELY at info@eacz.co.zw.

Best regards,
Estate Agents Council of Zimbabwe`;
  return { subject, html, text: text2 };
}
var transporter;
var init_emailService = __esm({
  "server/services/emailService.ts"() {
    "use strict";
    transporter = null;
    if (!process.env.ZEPTOMAIL_API_KEY) {
      console.warn("ZEPTOMAIL_API_KEY environment variable not set - email functionality will be disabled");
    } else {
      console.log("ZeptoMail SMTP configured successfully");
      try {
        transporter = nodemailer.createTransport({
          host: "smtp.zeptomail.eu",
          port: 587,
          auth: {
            user: "emailapikey",
            pass: process.env.ZEPTOMAIL_API_KEY
          }
        });
        console.log("Nodemailer transport initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Nodemailer transport:", error);
      }
    }
  }
});

// server/auth.ts
var auth_exports = {};
__export(auth_exports, {
  comparePasswords: () => comparePasswords,
  hashPassword: () => hashPassword,
  setupAuth: () => setupAuth
});
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes as randomBytes2, timingSafeEqual } from "crypto";
import { promisify } from "util";
async function hashPassword(password) {
  const salt = randomBytes2(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  if (!stored) {
    return false;
  }
  if (stored.includes(".")) {
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      return false;
    }
    try {
      const hashedBuf = Buffer.from(hashed, "hex");
      const suppliedBuf = await scryptAsync(supplied, salt, 64);
      if (hashedBuf.length !== suppliedBuf.length) {
        console.warn(`Hash length mismatch: stored=${hashedBuf.length}, calculated=${suppliedBuf.length}`);
        return false;
      }
      return timingSafeEqual(hashedBuf, suppliedBuf);
    } catch (error) {
      console.warn("Error comparing hashed passwords:", error);
      return false;
    }
  } else {
    console.warn("Attempted login with unhashed password format");
    return false;
  }
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
      // Changed from strict to lax for custom domain compatibility
      domain: process.env.COOKIE_DOMAIN || void 0
      // Allow custom domain configuration
    },
    rolling: true
    // Reset expiration on every request
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }
    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password)
    });
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
  app2.put("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { firstName, lastName, email, phone } = req.body;
      const userId = req.user.id;
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        lastName,
        email,
        phone
      });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      try {
        const { sendEmail: sendEmail2, generateProfileUpdateNotification: generateProfileUpdateNotification2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
        const userName = `${firstName || updatedUser.firstName} ${lastName || updatedUser.lastName}`;
        const emailContent = generateProfileUpdateNotification2(userName);
        await sendEmail2({
          to: email || updatedUser.email,
          from: "sysadmin@estateagentscouncil.org",
          ...emailContent
        });
      } catch (emailError) {
        console.error("Failed to send profile update notification:", emailError);
      }
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  app2.put("/api/user/password", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user || !user.password || !await comparePasswords(currentPassword, user.password)) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      const hashedNewPassword = await hashPassword(newPassword);
      const updatedUser = await storage.updateUserPassword(userId, hashedNewPassword);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      try {
        const { sendEmail: sendEmail2, generatePasswordChangeNotification: generatePasswordChangeNotification2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
        const userName = `${user.firstName} ${user.lastName}` || user.email;
        const emailContent = generatePasswordChangeNotification2(userName);
        await sendEmail2({
          to: user.email,
          from: "sysadmin@estateagentscouncil.org",
          ...emailContent
        });
      } catch (emailError) {
        console.error("Failed to send password change notification:", emailError);
      }
      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });
}
var scryptAsync;
var init_auth = __esm({
  "server/auth.ts"() {
    "use strict";
    init_storage();
    scryptAsync = promisify(scrypt);
  }
});

// server/clerkAuth.ts
var clerkAuth_exports = {};
__export(clerkAuth_exports, {
  clerkClient: () => clerkClient,
  getCurrentUser: () => getCurrentUser,
  hasRole: () => hasRole,
  requireAuth: () => requireAuth,
  requireRole: () => requireRole,
  setupClerkAuth: () => setupClerkAuth
});
import { clerkClient, getAuth } from "@clerk/express";
function setupClerkAuth(app2) {
  if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    console.warn("\u26A0\uFE0F  Clerk keys not configured - authentication disabled");
    return;
  }
  console.log("\u2705 Setting up Clerk authentication");
  console.warn("\u26A0\uFE0F  Clerk middleware temporarily disabled to prevent timeouts");
}
function requireAuth(req, res, next) {
  const auth = getAuth(req);
  if (!auth?.userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "You must be logged in to access this resource"
    });
  }
  next();
}
function requireRole(...roles) {
  return (req, res, next) => {
    const auth = getAuth(req);
    if (!auth?.userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be logged in to access this resource"
      });
    }
    if (!req.clerkUser) {
      return res.status(403).json({
        error: "Forbidden",
        message: "User information not available"
      });
    }
    if (!roles.includes(req.clerkUser.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `This action requires one of the following roles: ${roles.join(", ")}`,
        yourRole: req.clerkUser.role
      });
    }
    next();
  };
}
function getCurrentUser(req) {
  return req.clerkUser || null;
}
function hasRole(req, ...roles) {
  if (!req.clerkUser) return false;
  return roles.includes(req.clerkUser.role);
}
var init_clerkAuth = __esm({
  "server/clerkAuth.ts"() {
    "use strict";
  }
});

// server/auth/authService.ts
import { scrypt as scrypt2, randomBytes as randomBytes3, timingSafeEqual as timingSafeEqual2 } from "crypto";
import { promisify as promisify2 } from "util";
import { eq as eq3, and as and3, gt } from "drizzle-orm";
var scryptAsync2, AUTH_CONFIG, AuthService;
var init_authService = __esm({
  "server/auth/authService.ts"() {
    "use strict";
    init_db();
    init_schema();
    scryptAsync2 = promisify2(scrypt2);
    AUTH_CONFIG = {
      // Password requirements
      PASSWORD_MIN_LENGTH: 8,
      PASSWORD_REQUIRE_UPPERCASE: true,
      PASSWORD_REQUIRE_LOWERCASE: true,
      PASSWORD_REQUIRE_NUMBER: true,
      PASSWORD_REQUIRE_SPECIAL: true,
      // Account lockout
      MAX_LOGIN_ATTEMPTS: 5,
      LOCKOUT_DURATION_MINUTES: 30,
      // Session
      SESSION_TIMEOUT_MINUTES: 60,
      SESSION_ABSOLUTE_TIMEOUT_HOURS: 8,
      // Password reset
      PASSWORD_RESET_TOKEN_EXPIRY_HOURS: 1,
      // Email verification
      EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS: 24
    };
    AuthService = class {
      /**
       * Hash a password using scrypt
       */
      static async hashPassword(password) {
        const validation = this.validatePasswordStrength(password);
        if (!validation.valid) {
          throw new Error(`Weak password: ${validation.errors.join(", ")}`);
        }
        const salt = randomBytes3(16).toString("hex");
        const buf = await scryptAsync2(password, salt, 64);
        return `${buf.toString("hex")}.${salt}`;
      }
      /**
       * Compare supplied password with stored hash
       */
      static async comparePasswords(supplied, stored) {
        if (!stored || !supplied) {
          return false;
        }
        if (!stored.includes(".")) {
          console.warn("Attempted login with unhashed password");
          return false;
        }
        const [hashed, salt] = stored.split(".");
        if (!hashed || !salt) {
          return false;
        }
        try {
          const hashedBuf = Buffer.from(hashed, "hex");
          const suppliedBuf = await scryptAsync2(supplied, salt, 64);
          if (hashedBuf.length !== suppliedBuf.length) {
            return false;
          }
          return timingSafeEqual2(hashedBuf, suppliedBuf);
        } catch (error) {
          console.error("Password comparison error:", error);
          return false;
        }
      }
      /**
       * Validate password strength
       */
      static validatePasswordStrength(password) {
        const errors = [];
        if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
          errors.push(
            `Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters`
          );
        }
        if (AUTH_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
          errors.push("Password must contain at least one uppercase letter");
        }
        if (AUTH_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
          errors.push("Password must contain at least one lowercase letter");
        }
        if (AUTH_CONFIG.PASSWORD_REQUIRE_NUMBER && !/[0-9]/.test(password)) {
          errors.push("Password must contain at least one number");
        }
        if (AUTH_CONFIG.PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
          errors.push("Password must contain at least one special character");
        }
        return {
          valid: errors.length === 0,
          errors
        };
      }
      /**
       * Check if account is locked
       */
      static async isAccountLocked(userId) {
        const [user] = await db.select().from(users).where(eq3(users.id, userId)).limit(1);
        if (!user) return false;
        if (user.lockedUntil && new Date(user.lockedUntil) > /* @__PURE__ */ new Date()) {
          return true;
        }
        if (user.lockedUntil && new Date(user.lockedUntil) <= /* @__PURE__ */ new Date()) {
          await db.update(users).set({
            lockedUntil: null,
            loginAttempts: 0,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq3(users.id, userId));
        }
        return false;
      }
      /**
       * Record failed login attempt
       */
      static async recordFailedLogin(userId) {
        const [user] = await db.select().from(users).where(eq3(users.id, userId)).limit(1);
        if (!user) return;
        const newAttempts = (user.loginAttempts || 0) + 1;
        const updates = {
          loginAttempts: newAttempts,
          updatedAt: /* @__PURE__ */ new Date()
        };
        if (newAttempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
          const lockoutUntil = /* @__PURE__ */ new Date();
          lockoutUntil.setMinutes(
            lockoutUntil.getMinutes() + AUTH_CONFIG.LOCKOUT_DURATION_MINUTES
          );
          updates.lockedUntil = lockoutUntil;
        }
        await db.update(users).set(updates).where(eq3(users.id, userId));
      }
      /**
       * Record successful login
       */
      static async recordSuccessfulLogin(userId) {
        await db.update(users).set({
          lastLoginAt: /* @__PURE__ */ new Date(),
          loginAttempts: 0,
          lockedUntil: null,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq3(users.id, userId));
      }
      /**
       * Generate password reset token
       */
      static async generatePasswordResetToken(email) {
        const [user] = await db.select().from(users).where(eq3(users.email, email)).limit(1);
        if (!user) return null;
        const token = randomBytes3(32).toString("hex");
        const expires = /* @__PURE__ */ new Date();
        expires.setHours(
          expires.getHours() + AUTH_CONFIG.PASSWORD_RESET_TOKEN_EXPIRY_HOURS
        );
        await db.update(users).set({
          passwordResetToken: token,
          passwordResetExpires: expires,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq3(users.id, user.id));
        return token;
      }
      /**
       * Verify password reset token
       */
      static async verifyPasswordResetToken(token) {
        const [user] = await db.select().from(users).where(
          and3(
            eq3(users.passwordResetToken, token),
            gt(users.passwordResetExpires, /* @__PURE__ */ new Date())
          )
        ).limit(1);
        return user?.id || null;
      }
      /**
       * Reset password with token
       */
      static async resetPassword(token, newPassword) {
        const userId = await this.verifyPasswordResetToken(token);
        if (!userId) return false;
        const hashedPassword = await this.hashPassword(newPassword);
        await db.update(users).set({
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          passwordChangedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq3(users.id, userId));
        return true;
      }
      /**
       * Generate email verification token
       */
      static async generateEmailVerificationToken(userId) {
        const token = randomBytes3(32).toString("hex");
        await db.update(users).set({
          emailVerificationToken: token,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq3(users.id, userId));
        return token;
      }
      /**
       * Verify email with token
       */
      static async verifyEmail(token) {
        const [user] = await db.select().from(users).where(eq3(users.emailVerificationToken, token)).limit(1);
        if (!user) return false;
        await db.update(users).set({
          emailVerified: true,
          emailVerificationToken: null,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq3(users.id, user.id));
        return true;
      }
      /**
       * Change user password (authenticated)
       */
      static async changePassword(userId, currentPassword, newPassword) {
        const [user] = await db.select().from(users).where(eq3(users.id, userId)).limit(1);
        if (!user) {
          return { success: false, error: "User not found" };
        }
        if (!user.password) {
          return { success: false, error: "User has no password set" };
        }
        const isValid = await this.comparePasswords(currentPassword, user.password);
        if (!isValid) {
          return { success: false, error: "Current password is incorrect" };
        }
        const hashedPassword = await this.hashPassword(newPassword);
        await db.update(users).set({
          password: hashedPassword,
          passwordChangedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq3(users.id, userId));
        return { success: true };
      }
    };
  }
});

// server/auth/rbacService.ts
function requireAuth2(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "You must be logged in to access this resource"
    });
  }
  next();
}
var Permission, ROLE_PERMISSIONS, RBACService;
var init_rbacService = __esm({
  "server/auth/rbacService.ts"() {
    "use strict";
    Permission = /* @__PURE__ */ ((Permission3) => {
      Permission3["USER_CREATE"] = "user:create";
      Permission3["USER_READ"] = "user:read";
      Permission3["USER_UPDATE"] = "user:update";
      Permission3["USER_DELETE"] = "user:delete";
      Permission3["USER_MANAGE_ROLES"] = "user:manage_roles";
      Permission3["MEMBER_CREATE"] = "member:create";
      Permission3["MEMBER_READ"] = "member:read";
      Permission3["MEMBER_UPDATE"] = "member:update";
      Permission3["MEMBER_DELETE"] = "member:delete";
      Permission3["MEMBER_APPROVE"] = "member:approve";
      Permission3["MEMBER_SUSPEND"] = "member:suspend";
      Permission3["APPLICATION_READ"] = "application:read";
      Permission3["APPLICATION_REVIEW"] = "application:review";
      Permission3["APPLICATION_APPROVE"] = "application:approve";
      Permission3["APPLICATION_REJECT"] = "application:reject";
      Permission3["CASE_CREATE"] = "case:create";
      Permission3["CASE_READ"] = "case:read";
      Permission3["CASE_UPDATE"] = "case:update";
      Permission3["CASE_DELETE"] = "case:delete";
      Permission3["CASE_ASSIGN"] = "case:assign";
      Permission3["CASE_CLOSE"] = "case:close";
      Permission3["PAYMENT_READ"] = "payment:read";
      Permission3["PAYMENT_PROCESS"] = "payment:process";
      Permission3["PAYMENT_REFUND"] = "payment:refund";
      Permission3["PAYMENT_REPORTS"] = "payment:reports";
      Permission3["DOCUMENT_READ"] = "document:read";
      Permission3["DOCUMENT_UPLOAD"] = "document:upload";
      Permission3["DOCUMENT_VERIFY"] = "document:verify";
      Permission3["DOCUMENT_DELETE"] = "document:delete";
      Permission3["EVENT_CREATE"] = "event:create";
      Permission3["EVENT_READ"] = "event:read";
      Permission3["EVENT_UPDATE"] = "event:update";
      Permission3["EVENT_DELETE"] = "event:delete";
      Permission3["ORGANIZATION_CREATE"] = "organization:create";
      Permission3["ORGANIZATION_READ"] = "organization:read";
      Permission3["ORGANIZATION_UPDATE"] = "organization:update";
      Permission3["ORGANIZATION_DELETE"] = "organization:delete";
      Permission3["SYSTEM_SETTINGS"] = "system:settings";
      Permission3["SYSTEM_LOGS"] = "system:logs";
      Permission3["SYSTEM_BACKUP"] = "system:backup";
      return Permission3;
    })(Permission || {});
    ROLE_PERMISSIONS = {
      super_admin: [
        // Full access to everything
        ...Object.values(Permission)
      ],
      admin: [
        // User management (except role management)
        "user:create" /* USER_CREATE */,
        "user:read" /* USER_READ */,
        "user:update" /* USER_UPDATE */,
        "user:delete" /* USER_DELETE */,
        // Full member management
        "member:create" /* MEMBER_CREATE */,
        "member:read" /* MEMBER_READ */,
        "member:update" /* MEMBER_UPDATE */,
        "member:delete" /* MEMBER_DELETE */,
        "member:approve" /* MEMBER_APPROVE */,
        "member:suspend" /* MEMBER_SUSPEND */,
        // Full application management
        "application:read" /* APPLICATION_READ */,
        "application:review" /* APPLICATION_REVIEW */,
        "application:approve" /* APPLICATION_APPROVE */,
        "application:reject" /* APPLICATION_REJECT */,
        // Full case management
        "case:create" /* CASE_CREATE */,
        "case:read" /* CASE_READ */,
        "case:update" /* CASE_UPDATE */,
        "case:delete" /* CASE_DELETE */,
        "case:assign" /* CASE_ASSIGN */,
        "case:close" /* CASE_CLOSE */,
        // Full payment management
        "payment:read" /* PAYMENT_READ */,
        "payment:process" /* PAYMENT_PROCESS */,
        "payment:refund" /* PAYMENT_REFUND */,
        "payment:reports" /* PAYMENT_REPORTS */,
        // Full document management
        "document:read" /* DOCUMENT_READ */,
        "document:upload" /* DOCUMENT_UPLOAD */,
        "document:verify" /* DOCUMENT_VERIFY */,
        "document:delete" /* DOCUMENT_DELETE */,
        // Full event management
        "event:create" /* EVENT_CREATE */,
        "event:read" /* EVENT_READ */,
        "event:update" /* EVENT_UPDATE */,
        "event:delete" /* EVENT_DELETE */,
        // Full organization management
        "organization:create" /* ORGANIZATION_CREATE */,
        "organization:read" /* ORGANIZATION_READ */,
        "organization:update" /* ORGANIZATION_UPDATE */,
        "organization:delete" /* ORGANIZATION_DELETE */,
        // System logs only
        "system:logs" /* SYSTEM_LOGS */
      ],
      member_manager: [
        // Member management
        "member:create" /* MEMBER_CREATE */,
        "member:read" /* MEMBER_READ */,
        "member:update" /* MEMBER_UPDATE */,
        "member:approve" /* MEMBER_APPROVE */,
        // Application review
        "application:read" /* APPLICATION_READ */,
        "application:review" /* APPLICATION_REVIEW */,
        // Document management
        "document:read" /* DOCUMENT_READ */,
        "document:upload" /* DOCUMENT_UPLOAD */,
        "document:verify" /* DOCUMENT_VERIFY */,
        // Organization management
        "organization:read" /* ORGANIZATION_READ */,
        "organization:update" /* ORGANIZATION_UPDATE */
      ],
      case_manager: [
        // Case management
        "case:create" /* CASE_CREATE */,
        "case:read" /* CASE_READ */,
        "case:update" /* CASE_UPDATE */,
        "case:assign" /* CASE_ASSIGN */,
        "case:close" /* CASE_CLOSE */,
        // Read member info
        "member:read" /* MEMBER_READ */,
        // Read organization info
        "organization:read" /* ORGANIZATION_READ */,
        // Read documents
        "document:read" /* DOCUMENT_READ */
      ],
      accountant: [
        // Full payment access
        "payment:read" /* PAYMENT_READ */,
        "payment:process" /* PAYMENT_PROCESS */,
        "payment:refund" /* PAYMENT_REFUND */,
        "payment:reports" /* PAYMENT_REPORTS */,
        // Read-only member access
        "member:read" /* MEMBER_READ */,
        // Read-only organization access
        "organization:read" /* ORGANIZATION_READ */,
        // Read applications
        "application:read" /* APPLICATION_READ */
      ],
      reviewer: [
        // Application review
        "application:read" /* APPLICATION_READ */,
        "application:review" /* APPLICATION_REVIEW */,
        // Document verification
        "document:read" /* DOCUMENT_READ */,
        "document:verify" /* DOCUMENT_VERIFY */,
        // Read member info
        "member:read" /* MEMBER_READ */,
        // Read organization info
        "organization:read" /* ORGANIZATION_READ */
      ],
      staff: [
        // Basic read access
        "member:read" /* MEMBER_READ */,
        "application:read" /* APPLICATION_READ */,
        "case:read" /* CASE_READ */,
        "document:read" /* DOCUMENT_READ */,
        "event:read" /* EVENT_READ */,
        "organization:read" /* ORGANIZATION_READ */
      ]
    };
    RBACService = class {
      /**
       * Check if user has a specific permission
       */
      static hasPermission(userRole, permission) {
        const rolePermissions = ROLE_PERMISSIONS[userRole];
        if (!rolePermissions) return false;
        return rolePermissions.includes(permission);
      }
      /**
       * Check if user has any of the specified permissions
       */
      static hasAnyPermission(userRole, permissions) {
        return permissions.some(
          (permission) => this.hasPermission(userRole, permission)
        );
      }
      /**
       * Check if user has all of the specified permissions
       */
      static hasAllPermissions(userRole, permissions) {
        return permissions.every(
          (permission) => this.hasPermission(userRole, permission)
        );
      }
      /**
       * Get all permissions for a role
       */
      static getRolePermissions(role) {
        return ROLE_PERMISSIONS[role] || [];
      }
    };
  }
});

// server/auth/emailNotifications.ts
var BASE_URL, AuthEmailService;
var init_emailNotifications = __esm({
  "server/auth/emailNotifications.ts"() {
    "use strict";
    init_emailService();
    BASE_URL = process.env.BASE_URL || "https://mms.estateagentscouncil.org";
    AuthEmailService = class {
      /**
       * Send welcome email after registration
       */
      static async sendWelcomeEmail(email, name, verificationToken) {
        const verificationLink = `${BASE_URL}/verify-email?token=${verificationToken}`;
        return await sendEmail({
          to: email,
          from: "sysadmin@estateagentscouncil.org",
          subject: "Welcome to Estate Agents Council of Zimbabwe",
          html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a56db; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background: #1a56db; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to EACZ</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>

              <p>Thank you for registering with the Estate Agents Council of Zimbabwe. We're excited to have you join us!</p>

              <p>To complete your registration, please verify your email address by clicking the button below:</p>

              <p style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </p>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #1a56db;">${verificationLink}</p>

              <p><strong>This link will expire in 24 hours.</strong></p>

              <p>If you didn't create an account, please ignore this email.</p>

              <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
            </div>
            <div class="footer">
              <p>Estate Agents Council of Zimbabwe<br>
              Email: info@estateagentscouncil.org<br>
              Website: estateagentscouncil.org</p>
            </div>
          </div>
        </body>
        </html>
      `,
          text: `
Welcome to Estate Agents Council of Zimbabwe!

Hello ${name},

Thank you for registering. To complete your registration, please verify your email address by visiting:

${verificationLink}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

Best regards,
Estate Agents Council of Zimbabwe
      `
        });
      }
      /**
       * Send password reset email
       */
      static async sendPasswordResetEmail(email, name, resetToken) {
        const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;
        return await sendEmail({
          to: email,
          from: "sysadmin@estateagentscouncil.org",
          subject: "Password Reset Request - EACZ",
          html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>

              <p>We received a request to reset your password for your EACZ account.</p>

              <p>Click the button below to reset your password:</p>

              <p style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </p>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #dc2626;">${resetLink}</p>

              <div class="warning">
                <strong>\u26A0\uFE0F Security Notice:</strong><br>
                \u2022 This link will expire in 1 hour<br>
                \u2022 For security, you can only use this link once<br>
                \u2022 If you didn't request this reset, please ignore this email and contact support
              </div>

              <p>Need help? Contact our support team at support@estateagentscouncil.org</p>

              <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
            </div>
            <div class="footer">
              <p>Estate Agents Council of Zimbabwe<br>
              Email: info@estateagentscouncil.org</p>
            </div>
          </div>
        </body>
        </html>
      `,
          text: `
Password Reset Request

Hello ${name},

We received a request to reset your password for your EACZ account.

To reset your password, visit:
${resetLink}

SECURITY NOTICE:
- This link will expire in 1 hour
- You can only use this link once
- If you didn't request this reset, please ignore this email and contact support

Need help? Contact support@estateagentscouncil.org

Best regards,
Estate Agents Council of Zimbabwe
      `
        });
      }
      /**
       * Send password changed confirmation
       */
      static async sendPasswordChangedEmail(email, name) {
        return await sendEmail({
          to: email,
          from: "sysadmin@estateagentscouncil.org",
          subject: "Password Changed Successfully - EACZ",
          html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>\u2713 Password Changed</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>

              <p>This email confirms that your password was successfully changed.</p>

              <div class="warning">
                <strong>\u26A0\uFE0F Didn't make this change?</strong><br>
                If you didn't change your password, your account may be compromised. Please contact our support team immediately at:<br>
                <strong>support@estateagentscouncil.org</strong>
              </div>

              <p><strong>Changed:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>

              <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
            </div>
            <div class="footer">
              <p>Estate Agents Council of Zimbabwe<br>
              Email: info@estateagentscouncil.org</p>
            </div>
          </div>
        </body>
        </html>
      `,
          text: `
Password Changed Successfully

Hello ${name},

This email confirms that your password was successfully changed.

DIDN'T MAKE THIS CHANGE?
If you didn't change your password, your account may be compromised. Please contact support immediately at: support@estateagentscouncil.org

Changed: ${(/* @__PURE__ */ new Date()).toLocaleString()}

Best regards,
Estate Agents Council of Zimbabwe
      `
        });
      }
      /**
       * Send account locked notification
       */
      static async sendAccountLockedEmail(email, name, unlockTime) {
        return await sendEmail({
          to: email,
          from: "sysadmin@estateagentscouncil.org",
          subject: "Account Locked - EACZ",
          html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .alert { background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>\u{1F512} Account Locked</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>

              <div class="alert">
                <strong>Your account has been temporarily locked due to multiple failed login attempts.</strong>
              </div>

              <p><strong>Unlock Time:</strong> ${unlockTime.toLocaleString()}</p>

              <p>Your account will automatically unlock at the time shown above.</p>

              <p><strong>For immediate assistance:</strong></p>
              <ul>
                <li>Contact support: support@estateagentscouncil.org</li>
                <li>Call: +263 XXX XXX XXX</li>
              </ul>

              <p>If you didn't attempt to login, please contact support immediately as your account may be under attack.</p>

              <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
            </div>
            <div class="footer">
              <p>Estate Agents Council of Zimbabwe</p>
            </div>
          </div>
        </body>
        </html>
      `,
          text: `
Account Locked

Hello ${name},

Your account has been temporarily locked due to multiple failed login attempts.

Unlock Time: ${unlockTime.toLocaleString()}

Your account will automatically unlock at the time shown above.

For immediate assistance:
- Email: support@estateagentscouncil.org
- Phone: +263 XXX XXX XXX

If you didn't attempt to login, please contact support immediately.

Best regards,
Estate Agents Council of Zimbabwe
      `
        });
      }
      /**
       * Send login notification (suspicious activity)
       */
      static async sendLoginNotification(email, name, loginDetails) {
        return await sendEmail({
          to: email,
          from: "sysadmin@estateagentscouncil.org",
          subject: "New Login to Your Account - EACZ",
          html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a56db; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .details { background: white; border: 1px solid #e5e7eb; padding: 12px; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Login Detected</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>

              <p>We detected a new login to your EACZ account.</p>

              <div class="details">
                <strong>Login Details:</strong><br>
                \u2022 Time: ${loginDetails.time.toLocaleString()}<br>
                ${loginDetails.ipAddress ? `\u2022 IP Address: ${loginDetails.ipAddress}<br>` : ""}
                ${loginDetails.location ? `\u2022 Location: ${loginDetails.location}<br>` : ""}
                ${loginDetails.userAgent ? `\u2022 Device: ${loginDetails.userAgent}<br>` : ""}
              </div>

              <div class="warning">
                <strong>Was this you?</strong><br>
                If you didn't login, your account may be compromised. Please:
                <ol>
                  <li>Change your password immediately</li>
                  <li>Contact support: support@estateagentscouncil.org</li>
                </ol>
              </div>

              <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
            </div>
            <div class="footer">
              <p>Estate Agents Council of Zimbabwe</p>
            </div>
          </div>
        </body>
        </html>
      `,
          text: `
New Login Detected

Hello ${name},

We detected a new login to your EACZ account.

Login Details:
- Time: ${loginDetails.time.toLocaleString()}
${loginDetails.ipAddress ? `- IP Address: ${loginDetails.ipAddress}
` : ""}
${loginDetails.location ? `- Location: ${loginDetails.location}
` : ""}
${loginDetails.userAgent ? `- Device: ${loginDetails.userAgent}
` : ""}

WAS THIS YOU?
If you didn't login, your account may be compromised. Please:
1. Change your password immediately
2. Contact support: support@estateagentscouncil.org

Best regards,
Estate Agents Council of Zimbabwe
      `
        });
      }
    };
  }
});

// server/auth/authRoutes.ts
import passport2 from "passport";
import { Strategy as LocalStrategy2 } from "passport-local";
import session2 from "express-session";
import { eq as eq4 } from "drizzle-orm";
function setupAuthRoutes(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1e3,
      // 8 hours
      sameSite: "lax"
    },
    rolling: true
    // Reset expiry on every request
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport2.initialize());
  app2.use(passport2.session());
  app2.use(sessionTimeoutMiddleware);
  app2.use(refreshSessionMiddleware);
  SessionService.startCleanup();
  passport2.use(
    new LocalStrategy2(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const [user] = await db.select().from(users).where(eq4(users.email, email)).limit(1);
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }
          const isLocked = await AuthService.isAccountLocked(user.id);
          if (isLocked) {
            return done(null, false, {
              message: "Account is locked due to multiple failed login attempts"
            });
          }
          if (user.status !== "active") {
            return done(null, false, {
              message: "Account is inactive. Please contact support."
            });
          }
          if (!user.password) {
            return done(null, false, { message: "Invalid email or password" });
          }
          const isValid = await AuthService.comparePasswords(
            password,
            user.password
          );
          if (!isValid) {
            await AuthService.recordFailedLogin(user.id);
            return done(null, false, { message: "Invalid email or password" });
          }
          await AuthService.recordSuccessfulLogin(user.id);
          return done(null, {
            id: user.id,
            email: user.email,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            role: user.role || "applicant",
            status: user.status || "active",
            emailVerified: user.emailVerified || false
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport2.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport2.deserializeUser(async (id, done) => {
    try {
      const [user] = await db.select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        status: users.status,
        emailVerified: users.emailVerified
      }).from(users).where(eq4(users.id, id)).limit(1);
      done(null, user || void 0);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: "Missing required fields",
          required: ["email", "password", "firstName", "lastName"]
        });
      }
      const [existingUser] = await db.select().from(users).where(eq4(users.email, email)).limit(1);
      if (existingUser) {
        return res.status(400).json({
          error: "Email already registered"
        });
      }
      let hashedPassword;
      try {
        hashedPassword = await AuthService.hashPassword(password);
      } catch (error) {
        return res.status(400).json({
          error: error.message
        });
      }
      const [newUser] = await db.insert(users).values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || "staff",
        // Default role
        status: "active",
        emailVerified: false
      }).returning();
      const verificationToken = await AuthService.generateEmailVerificationToken(newUser.id);
      await AuthEmailService.sendWelcomeEmail(
        email,
        `${firstName} ${lastName}`,
        verificationToken
      );
      res.status(201).json({
        success: true,
        message: "Registration successful. Please check your email to verify your account.",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Registration failed"
      });
    }
  });
  app2.post(
    "/api/auth/login",
    passport2.authenticate("local"),
    async (req, res) => {
      try {
        const user = req.user;
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers["user-agent"];
        res.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            emailVerified: user.emailVerified,
            permissions: RBACService.getRolePermissions(user.role)
          }
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
          error: "Login failed"
        });
      }
    }
  );
  app2.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          error: "Logout failed"
        });
      }
      req.session.destroy(() => {
        res.json({
          success: true,
          message: "Logged out successfully"
        });
      });
    });
  });
  app2.get("/api/auth/me", requireAuth2, (req, res) => {
    const user = req.user;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      emailVerified: user.emailVerified,
      permissions: RBACService.getRolePermissions(user.role)
    });
  });
  app2.get("/api/auth/verify-email/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const success = await AuthService.verifyEmail(token);
      if (success) {
        res.json({
          success: true,
          message: "Email verified successfully"
        });
      } else {
        res.status(400).json({
          error: "Invalid or expired verification token"
        });
      }
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({
        error: "Email verification failed"
      });
    }
  });
  app2.post("/api/auth/resend-verification", requireAuth2, async (req, res) => {
    try {
      const user = req.user;
      if (user.emailVerified) {
        return res.status(400).json({
          error: "Email already verified"
        });
      }
      const token = await AuthService.generateEmailVerificationToken(user.id);
      await AuthEmailService.sendWelcomeEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        token
      );
      res.json({
        success: true,
        message: "Verification email sent"
      });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({
        error: "Failed to resend verification email"
      });
    }
  });
  app2.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          error: "Email is required"
        });
      }
      const token = await AuthService.generatePasswordResetToken(email);
      if (token) {
        const [user] = await db.select().from(users).where(eq4(users.email, email)).limit(1);
        if (user) {
          await AuthEmailService.sendPasswordResetEmail(
            email,
            `${user.firstName} ${user.lastName}`,
            token
          );
        }
      }
      res.json({
        success: true,
        message: "If the email exists, a password reset link has been sent"
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        error: "Failed to process password reset request"
      });
    }
  });
  app2.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({
          error: "Token and new password are required"
        });
      }
      const success = await AuthService.resetPassword(token, newPassword);
      if (success) {
        const userId = await AuthService.verifyPasswordResetToken(token);
        if (userId) {
          const [user] = await db.select().from(users).where(eq4(users.id, userId)).limit(1);
          if (user) {
            await AuthEmailService.sendPasswordChangedEmail(
              user.email,
              `${user.firstName} ${user.lastName}`
            );
          }
        }
        res.json({
          success: true,
          message: "Password reset successfully"
        });
      } else {
        res.status(400).json({
          error: "Invalid or expired reset token"
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({
        error: error.message || "Password reset failed"
      });
    }
  });
  app2.post("/api/auth/change-password", requireAuth2, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = req.user;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Current password and new password are required"
        });
      }
      const result = await AuthService.changePassword(
        user.id,
        currentPassword,
        newPassword
      );
      if (result.success) {
        await AuthEmailService.sendPasswordChangedEmail(
          user.email,
          `${user.firstName} ${user.lastName}`
        );
        res.json({
          success: true,
          message: "Password changed successfully"
        });
      } else {
        res.status(400).json({
          error: result.error || "Password change failed"
        });
      }
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        error: error.message || "Password change failed"
      });
    }
  });
  app2.get("/api/auth/sessions", requireAuth2, async (req, res) => {
    try {
      const user = req.user;
      const sessions = await SessionService.getUserActiveSessions(user.id);
      res.json({
        sessions: sessions.map((s) => ({
          createdAt: s.createdAt,
          lastActivity: s.lastActivity,
          expiresAt: s.expiresAt,
          ipAddress: s.ipAddress,
          device: s.userAgent
        }))
      });
    } catch (error) {
      console.error("Get sessions error:", error);
      res.status(500).json({
        error: "Failed to get sessions"
      });
    }
  });
  app2.delete("/api/auth/sessions", requireAuth2, async (req, res) => {
    try {
      const user = req.user;
      await SessionService.invalidateAllUserSessions(user.id);
      req.logout((err) => {
        if (err) {
          return res.status(500).json({
            error: "Failed to logout"
          });
        }
        res.json({
          success: true,
          message: "Logged out from all devices"
        });
      });
    } catch (error) {
      console.error("Logout all error:", error);
      res.status(500).json({
        error: "Failed to logout from all devices"
      });
    }
  });
}
var init_authRoutes = __esm({
  "server/auth/authRoutes.ts"() {
    "use strict";
    init_authService();
    init_rbacService();
    init_sessionService();
    init_emailNotifications();
    init_db();
    init_schema();
  }
});

// server/services/paynowService.ts
import crypto from "crypto";
import { eq as eq5 } from "drizzle-orm";
function getPayNowService() {
  if (!paynowService) {
    const config = {
      integrationId: process.env.PAYNOW_INTEGRATION_ID || "",
      integrationKey: process.env.PAYNOW_INTEGRATION_KEY || "",
      returnUrl: process.env.PAYNOW_RETURN_URL || `${process.env.BASE_URL}/payment/return`,
      resultUrl: process.env.PAYNOW_RESULT_URL || `${process.env.BASE_URL}/api/payments/paynow/callback`,
      merchantName: "Estate Agents Council of Zimbabwe"
    };
    paynowService = new PayNowService(config);
  }
  return paynowService;
}
var PayNowService, paynowService;
var init_paynowService = __esm({
  "server/services/paynowService.ts"() {
    "use strict";
    init_db();
    init_schema();
    PayNowService = class {
      config;
      baseUrl;
      constructor(config) {
        this.config = config;
        this.baseUrl = "https://www.paynow.co.zw";
      }
      /**
       * Generate HMAC SHA512 hash for request verification
       */
      generateHash(data) {
        const values = Object.keys(data).sort().map((key) => data[key]).join("");
        const hashString = values + this.config.integrationKey;
        return crypto.createHmac("sha512", this.config.integrationKey).update(hashString).digest("hex").toUpperCase();
      }
      /**
       * Verify hash from PayNow callback
       */
      verifyHash(data, receivedHash) {
        const calculatedHash = this.generateHash(data);
        return calculatedHash === receivedHash.toUpperCase();
      }
      /**
       * Initiate a mobile money payment
       */
      async initiatePayment(request) {
        try {
          const paymentData = {
            id: this.config.integrationId,
            reference: request.reference,
            amount: request.amount.toFixed(2),
            additionalinfo: request.description,
            returnurl: this.config.returnUrl,
            resulturl: this.config.resultUrl,
            status: "Message"
          };
          if (request.email) {
            paymentData.authemail = request.email;
          }
          if (request.phone) {
            paymentData.phone = request.phone;
          }
          paymentData.hash = this.generateHash(paymentData);
          const formData = new URLSearchParams(paymentData);
          const endpoint = request.paymentMethod === "ecocash" ? "/interface/initiatetransaction" : "/interface/remotetransaction";
          const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
          });
          const responseText = await response.text();
          const responseData = this.parsePayNowResponse(responseText);
          if (responseData.status?.toLowerCase() === "ok") {
            return {
              success: true,
              redirectUrl: responseData.browserurl,
              pollUrl: responseData.pollurl,
              reference: request.reference
            };
          } else {
            return {
              success: false,
              error: responseData.error || "Payment initiation failed"
            };
          }
        } catch (error) {
          console.error("PayNow initiation error:", error);
          return {
            success: false,
            error: error.message || "Failed to initiate payment"
          };
        }
      }
      /**
       * Check payment status
       */
      async checkPaymentStatus(pollUrl) {
        try {
          const response = await fetch(pollUrl, {
            method: "GET"
          });
          const responseText = await response.text();
          const data = this.parsePayNowResponse(responseText);
          return {
            status: this.mapPayNowStatus(data.status),
            pollUrl,
            reference: data.reference || "",
            paynowReference: data.paynowreference || "",
            amount: parseFloat(data.amount || "0"),
            hash: data.hash || ""
          };
        } catch (error) {
          console.error("PayNow status check error:", error);
          return null;
        }
      }
      /**
       * Process PayNow callback/webhook
       */
      async processCallback(callbackData) {
        try {
          const { hash, ...dataToVerify } = callbackData;
          if (!this.verifyHash(dataToVerify, hash)) {
            return {
              success: false,
              error: "Invalid hash - potential security issue"
            };
          }
          const reference = callbackData.reference;
          const status = this.mapPayNowStatus(callbackData.status);
          const paynowReference = callbackData.paynowreference;
          const amount = parseFloat(callbackData.amount || "0");
          const [payment] = await db.select().from(payments).where(eq5(payments.referenceNumber, reference)).limit(1);
          if (!payment) {
            return {
              success: false,
              error: "Payment not found"
            };
          }
          const updateData = {
            status,
            externalPaymentId: paynowReference,
            gatewayResponse: JSON.stringify(callbackData),
            updatedAt: /* @__PURE__ */ new Date()
          };
          if (status === "completed") {
            updateData.paymentDate = /* @__PURE__ */ new Date();
          } else if (status === "failed") {
            updateData.failureReason = callbackData.error || "Payment failed";
          }
          await db.update(payments).set(updateData).where(eq5(payments.id, payment.id));
          return {
            success: true,
            paymentId: payment.id,
            status
          };
        } catch (error) {
          console.error("PayNow callback processing error:", error);
          return {
            success: false,
            error: error.message || "Failed to process callback"
          };
        }
      }
      /**
       * Parse PayNow response (key=value format)
       */
      parsePayNowResponse(response) {
        const data = {};
        const lines = response.split("\n");
        for (const line of lines) {
          const [key, ...valueParts] = line.split("=");
          if (key && valueParts.length > 0) {
            data[key.toLowerCase().trim()] = valueParts.join("=").trim();
          }
        }
        return data;
      }
      /**
       * Map PayNow status to our internal status
       */
      mapPayNowStatus(paynowStatus) {
        if (!paynowStatus) return "pending";
        const status = paynowStatus.toLowerCase();
        if (status === "paid" || status === "delivered" || status === "ok") {
          return "paid";
        } else if (status === "cancelled" || status === "canceled") {
          return "cancelled";
        } else if (status === "failed" || status === "error") {
          return "failed";
        } else {
          return "pending";
        }
      }
      /**
       * Initiate Express Checkout (for mobile apps)
       */
      async initiateExpressCheckout(request) {
        try {
          const paymentData = {
            id: this.config.integrationId,
            reference: request.reference,
            amount: request.amount.toFixed(2),
            additionalinfo: request.description,
            returnurl: this.config.returnUrl,
            resulturl: this.config.resultUrl,
            phone: request.phoneNumber,
            method: request.paymentMethod === "ecocash" ? "ecocash" : "onemoney",
            status: "Message"
          };
          paymentData.hash = this.generateHash(paymentData);
          const formData = new URLSearchParams(paymentData);
          const response = await fetch(`${this.baseUrl}/interface/remotetransaction`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
          });
          const responseText = await response.text();
          const responseData = this.parsePayNowResponse(responseText);
          if (responseData.status?.toLowerCase() === "ok" || responseData.status?.toLowerCase() === "sent") {
            return {
              success: true,
              pollUrl: responseData.pollurl,
              instructions: `Please check your ${request.paymentMethod === "ecocash" ? "EcoCash" : "OneMoney"} phone for the payment prompt and enter your PIN to complete the transaction.`
            };
          } else {
            return {
              success: false,
              error: responseData.error || "Express checkout failed"
            };
          }
        } catch (error) {
          console.error("Express checkout error:", error);
          return {
            success: false,
            error: error.message || "Failed to initiate express checkout"
          };
        }
      }
      /**
       * Generate payment reference
       */
      static generateReference(prefix = "PAY") {
        const timestamp2 = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}-${timestamp2}-${random}`;
      }
    };
    paynowService = null;
  }
});

// server/paymentRoutes.ts
import { eq as eq6, and as and4, desc as desc2, sql as sql6 } from "drizzle-orm";
import { z as z3 } from "zod";
function registerPaymentRoutes(app2) {
  const paynow = getPayNowService();
  app2.post("/api/payments/create", async (req, res) => {
    try {
      const paymentData = createPaymentSchema.parse(req.body);
      const userId = req.user?.id;
      const paymentNumber = PayNowService.generateReference("EACZ-PAY");
      const referenceNumber = PayNowService.generateReference("REF");
      let fees = 0;
      if (paymentData.paymentMethod.startsWith("paynow_")) {
        fees = paymentData.amount * 0.025;
      }
      const netAmount = paymentData.amount - fees;
      const [payment] = await db.insert(payments).values({
        paymentNumber,
        memberId: paymentData.memberId || null,
        organizationId: paymentData.organizationId || null,
        applicationId: paymentData.applicationId || null,
        eventId: paymentData.eventId || null,
        amount: paymentData.amount.toString(),
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
        status: "pending",
        purpose: paymentData.purpose,
        description: paymentData.description || `${paymentData.purpose} payment`,
        referenceNumber,
        fees: fees.toString(),
        netAmount: netAmount.toString(),
        processedBy: userId || null,
        createdAt: /* @__PURE__ */ new Date()
      }).returning();
      if (paymentData.paymentMethod.startsWith("paynow_")) {
        const paymentMethod = paymentData.paymentMethod === "paynow_ecocash" ? "ecocash" : "onemoney";
        if (paymentData.phoneNumber) {
          const expressResult = await paynow.initiateExpressCheckout({
            amount: paymentData.amount,
            reference: referenceNumber,
            description: payment.description || "",
            paymentMethod,
            phoneNumber: paymentData.phoneNumber,
            email: paymentData.email
          });
          if (expressResult.success) {
            return res.json({
              success: true,
              payment: {
                id: payment.id,
                paymentNumber: payment.paymentNumber,
                amount: payment.amount,
                status: payment.status,
                method: "express"
              },
              paynow: {
                pollUrl: expressResult.pollUrl,
                instructions: expressResult.instructions
              }
            });
          }
        }
        const initResult = await paynow.initiatePayment({
          amount: paymentData.amount,
          reference: referenceNumber,
          description: payment.description || "",
          paymentMethod,
          email: paymentData.email,
          phone: paymentData.phoneNumber
        });
        if (initResult.success) {
          await db.update(payments).set({
            gatewayResponse: JSON.stringify(initResult),
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq6(payments.id, payment.id));
          return res.json({
            success: true,
            payment: {
              id: payment.id,
              paymentNumber: payment.paymentNumber,
              amount: payment.amount,
              status: payment.status,
              method: "redirect"
            },
            paynow: {
              redirectUrl: initResult.redirectUrl,
              pollUrl: initResult.pollUrl,
              reference: initResult.reference
            }
          });
        } else {
          await db.update(payments).set({
            status: "failed",
            failureReason: initResult.error,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq6(payments.id, payment.id));
          return res.status(400).json({
            success: false,
            error: initResult.error,
            payment: {
              id: payment.id,
              status: "failed"
            }
          });
        }
      }
      res.json({
        success: true,
        payment: {
          id: payment.id,
          paymentNumber: payment.paymentNumber,
          amount: payment.amount,
          status: payment.status,
          referenceNumber: payment.referenceNumber
        }
      });
    } catch (error) {
      console.error("Payment creation error:", error);
      if (error instanceof z3.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.errors
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || "Failed to create payment"
      });
    }
  });
  app2.post("/api/payments/paynow/callback", async (req, res) => {
    try {
      const result = await paynow.processCallback(req.body);
      if (result.success) {
        if (result.paymentId) {
          const [payment] = await db.select().from(payments).where(eq6(payments.id, result.paymentId)).limit(1);
          if (payment && result.status === "completed") {
            await handleSuccessfulPayment(payment);
          }
        }
        res.json({
          success: true,
          message: "Callback processed successfully"
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      console.error("PayNow callback error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process callback"
      });
    }
  });
  app2.get("/api/payments/:paymentId/status", async (req, res) => {
    try {
      const { paymentId } = req.params;
      const [payment] = await db.select().from(payments).where(eq6(payments.id, paymentId)).limit(1);
      if (!payment) {
        return res.status(404).json({
          success: false,
          error: "Payment not found"
        });
      }
      if (payment.status === "pending" && payment.paymentMethod?.startsWith("paynow_")) {
        const gatewayResponse = payment.gatewayResponse ? JSON.parse(payment.gatewayResponse) : null;
        if (gatewayResponse?.pollUrl) {
          const statusResult = await paynow.checkPaymentStatus(gatewayResponse.pollUrl);
          if (statusResult) {
            const newStatus = mapPayNowStatusToInternal(statusResult.status);
            if (newStatus !== payment.status) {
              await db.update(payments).set({
                status: newStatus,
                externalPaymentId: statusResult.paynowReference,
                paymentDate: newStatus === "completed" ? /* @__PURE__ */ new Date() : null,
                updatedAt: /* @__PURE__ */ new Date()
              }).where(eq6(payments.id, payment.id));
              if (newStatus === "completed") {
                await handleSuccessfulPayment({ ...payment, status: newStatus });
              }
              return res.json({
                success: true,
                payment: {
                  id: payment.id,
                  status: newStatus,
                  paynowReference: statusResult.paynowReference
                }
              });
            }
          }
        }
      }
      res.json({
        success: true,
        payment: {
          id: payment.id,
          paymentNumber: payment.paymentNumber,
          amount: payment.amount,
          status: payment.status,
          paymentMethod: payment.paymentMethod,
          purpose: payment.purpose,
          paymentDate: payment.paymentDate,
          referenceNumber: payment.referenceNumber
        }
      });
    } catch (error) {
      console.error("Payment status check error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to check payment status"
      });
    }
  });
  app2.post("/api/payments/paynow/express-checkout", async (req, res) => {
    try {
      const checkoutData = paynowExpressCheckoutSchema.parse(req.body);
      const [payment] = await db.select().from(payments).where(eq6(payments.id, checkoutData.paymentId)).limit(1);
      if (!payment) {
        return res.status(404).json({
          success: false,
          error: "Payment not found"
        });
      }
      if (payment.status !== "pending") {
        return res.status(400).json({
          success: false,
          error: "Payment is not in pending status"
        });
      }
      const result = await paynow.initiateExpressCheckout({
        amount: parseFloat(payment.amount),
        reference: payment.referenceNumber || "",
        description: payment.description || "",
        paymentMethod: checkoutData.paymentMethod,
        phoneNumber: checkoutData.phoneNumber
      });
      if (result.success) {
        await db.update(payments).set({
          gatewayResponse: JSON.stringify(result),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq6(payments.id, payment.id));
        res.json({
          success: true,
          pollUrl: result.pollUrl,
          instructions: result.instructions
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      console.error("Express checkout error:", error);
      if (error instanceof z3.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.errors
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to initiate express checkout"
      });
    }
  });
  app2.get("/api/payments/history", async (req, res) => {
    try {
      const userId = req.user?.id;
      const { memberId, organizationId, limit = 50, offset = 0 } = req.query;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }
      let query = db.select().from(payments);
      if (memberId) {
        query = query.where(eq6(payments.memberId, memberId));
      } else if (organizationId) {
        query = query.where(eq6(payments.organizationId, organizationId));
      }
      const paymentHistory = await query.orderBy(desc2(payments.createdAt)).limit(Number(limit)).offset(Number(offset));
      res.json({
        success: true,
        payments: paymentHistory,
        count: paymentHistory.length
      });
    } catch (error) {
      console.error("Payment history error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch payment history"
      });
    }
  });
  app2.post("/api/payments/:paymentId/installments", async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { numberOfInstallments, firstPaymentDate } = req.body;
      const [payment] = await db.select().from(payments).where(eq6(payments.id, paymentId)).limit(1);
      if (!payment) {
        return res.status(404).json({
          success: false,
          error: "Payment not found"
        });
      }
      const totalAmount = parseFloat(payment.amount);
      const installmentAmount = totalAmount / numberOfInstallments;
      const installments = [];
      for (let i = 0; i < numberOfInstallments; i++) {
        const dueDate = new Date(firstPaymentDate);
        dueDate.setMonth(dueDate.getMonth() + i);
        const [installment] = await db.insert(paymentInstallments).values({
          paymentId: payment.id,
          installmentNumber: i + 1,
          amount: installmentAmount.toString(),
          dueDate,
          status: "pending"
        }).returning();
        installments.push(installment);
      }
      res.json({
        success: true,
        installments,
        message: `Created ${numberOfInstallments} installments`
      });
    } catch (error) {
      console.error("Installment creation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create installments"
      });
    }
  });
}
async function handleSuccessfulPayment(payment) {
  try {
    switch (payment.purpose) {
      case "membership":
      case "application":
        if (payment.memberId) {
          await db.update(members).set({
            membershipStatus: "active",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq6(members.id, payment.memberId));
        }
        break;
      case "renewal":
        if (payment.memberId) {
          const renewals = await db.select().from(memberRenewals).where(
            and4(
              eq6(memberRenewals.memberId, payment.memberId),
              eq6(memberRenewals.status, "pending")
            )
          ).limit(1);
          if (renewals.length > 0) {
            await db.update(memberRenewals).set({
              status: "completed",
              renewalDate: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq6(memberRenewals.id, renewals[0].id));
            await db.update(members).set({
              expiryDate: sql6`${members.expiryDate} + INTERVAL '1 year'`,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq6(members.id, payment.memberId));
          }
        }
        break;
      default:
        console.log(`Payment completed for purpose: ${payment.purpose}`);
    }
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}
function mapPayNowStatusToInternal(paynowStatus) {
  switch (paynowStatus) {
    case "paid":
      return "completed";
    case "cancelled":
    case "failed":
      return "failed";
    default:
      return "pending";
  }
}
var createPaymentSchema, paynowExpressCheckoutSchema;
var init_paymentRoutes = __esm({
  "server/paymentRoutes.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_paynowService();
    createPaymentSchema = z3.object({
      amount: z3.number().positive(),
      currency: z3.string().default("USD"),
      paymentMethod: z3.enum(["paynow_ecocash", "paynow_onemoney", "cash", "bank_transfer", "stripe_card"]),
      purpose: z3.enum(["membership", "application", "renewal", "event", "fine", "subscription"]),
      description: z3.string().optional(),
      memberId: z3.string().optional(),
      organizationId: z3.string().optional(),
      applicationId: z3.string().optional(),
      eventId: z3.string().optional(),
      phoneNumber: z3.string().optional(),
      email: z3.string().email().optional()
    });
    paynowExpressCheckoutSchema = z3.object({
      paymentId: z3.string(),
      phoneNumber: z3.string().regex(/^(?:\+263|0)[0-9]{9}$/, "Invalid Zimbabwe phone number"),
      paymentMethod: z3.enum(["ecocash", "onemoney"])
    });
  }
});

// server/services/paynow.ts
import crypto2 from "crypto";
function createPaynowService() {
  const config = {
    id: process.env.PAYNOW_ID || "",
    key: process.env.PAYNOW_KEY || "",
    returnUrl: process.env.PAYNOW_RETURN_URL || `${process.env.BASE_URL}/api/public/paynow/return`,
    resultUrl: process.env.PAYNOW_RESULT_URL || `${process.env.BASE_URL}/api/system/paynow/ipn`
  };
  if (!config.id || !config.key) {
    throw new Error("Paynow configuration missing. Please set PAYNOW_ID and PAYNOW_KEY environment variables.");
  }
  return new PaynowService(config);
}
function isPaymentSuccessful(status) {
  return [PaynowStatus.PAID, PaynowStatus.AWAITING_DELIVERY, PaynowStatus.DELIVERED].includes(status);
}
var PaynowService, PaynowStatus;
var init_paynow = __esm({
  "server/services/paynow.ts"() {
    "use strict";
    PaynowService = class {
      config;
      constructor(config) {
        this.config = {
          ...config,
          baseUrl: config.baseUrl || "https://www.paynow.co.zw"
        };
      }
      /**
       * Initiate a payment with Paynow
       */
      async initiatePayment(params) {
        try {
          const paymentData = {
            id: this.config.id,
            reference: params.reference,
            amount: params.amount.toString(),
            additionalinfo: params.email,
            returnurl: params.returnUrl || this.config.returnUrl,
            resulturl: params.resultUrl || this.config.resultUrl,
            authemail: params.email,
            status: "Message"
          };
          const hash = this.generateHash(paymentData);
          const payload = { ...paymentData, hash };
          const formData = new URLSearchParams();
          Object.entries(payload).forEach(([key, value]) => {
            formData.append(key, value);
          });
          const response = await fetch(`${this.config.baseUrl}/interface/initiatetransaction`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
          });
          const responseText = await response.text();
          const responseData = this.parsePaynowResponse(responseText);
          if (responseData.status?.toLowerCase() === "ok") {
            return {
              success: true,
              redirectUrl: responseData.browserurl,
              pollUrl: responseData.pollurl,
              providerRef: responseData.paynowreference
            };
          } else {
            return {
              success: false,
              error: responseData.error || "Payment initiation failed"
            };
          }
        } catch (error) {
          console.error("Paynow initiation error:", error);
          return {
            success: false,
            error: "Payment service unavailable"
          };
        }
      }
      /**
       * Verify IPN (Instant Payment Notification) from Paynow
       */
      verifyIPN(payload) {
        try {
          const dataToHash = {
            reference: payload.reference,
            paynowreference: payload.paynowreference,
            amount: payload.amount,
            status: payload.status,
            pollurl: payload.pollurl
          };
          const expectedHash = this.generateHash(dataToHash);
          return expectedHash.toUpperCase() === payload.hash.toUpperCase();
        } catch (error) {
          console.error("IPN verification error:", error);
          return false;
        }
      }
      /**
       * Poll payment status
       */
      async pollPaymentStatus(pollUrl) {
        try {
          const response = await fetch(pollUrl);
          const responseText = await response.text();
          const responseData = this.parsePaynowResponse(responseText);
          return {
            success: true,
            status: responseData.status,
            amount: responseData.amount,
            reference: responseData.reference
          };
        } catch (error) {
          console.error("Poll payment error:", error);
          return {
            success: false,
            error: "Unable to check payment status"
          };
        }
      }
      /**
       * Generate security hash for Paynow requests
       */
      generateHash(data) {
        const sortedKeys = Object.keys(data).sort();
        const values = sortedKeys.map((key) => data[key]).join("");
        const stringToHash = values + this.config.key;
        return crypto2.createHash("sha512").update(stringToHash).digest("hex").toUpperCase();
      }
      /**
       * Parse Paynow response format (key=value pairs)
       */
      parsePaynowResponse(responseText) {
        const lines = responseText.trim().split("\n");
        const result = {};
        lines.forEach((line) => {
          const [key, ...valueParts] = line.split("=");
          if (key && valueParts.length > 0) {
            result[key.toLowerCase()] = valueParts.join("=");
          }
        });
        return result;
      }
      /**
       * Get payment status text
       */
      getStatusText(status) {
        const statusMap = {
          "Paid": "Payment successful",
          "Awaiting Delivery": "Payment received, awaiting delivery confirmation",
          "Delivered": "Payment completed and delivery confirmed",
          "Cancelled": "Payment was cancelled",
          "Failed": "Payment failed",
          "Pending": "Payment is pending",
          "Sent": "Payment has been sent for processing",
          "Created": "Payment created but not yet processed"
        };
        return statusMap[status] || `Status: ${status}`;
      }
    };
    PaynowStatus = {
      PAID: "Paid",
      AWAITING_DELIVERY: "Awaiting Delivery",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
      FAILED: "Failed",
      PENDING: "Pending",
      SENT: "Sent",
      CREATED: "Created"
    };
  }
});

// server/services/eligibility.ts
import { z as z4 } from "zod";
function checkIndividualEligibility(input) {
  try {
    personalSchema.parse(input.personal);
    oLevelSchema.parse(input.oLevel);
    if (input.aLevel) aLevelSchema.parse(input.aLevel);
    if (input.equivalentQualification) equivalentQualificationSchema.parse(input.equivalentQualification);
    const requirements = [];
    const warnings = [];
    const dob = new Date(input.personal.dob);
    const now = /* @__PURE__ */ new Date();
    const age = now.getFullYear() - dob.getFullYear();
    const adjustedAge = now.getMonth() < dob.getMonth() || now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate() ? age - 1 : age;
    if (input.oLevel.passesCount < 5) {
      return {
        ok: false,
        reason: "Must have at least 5 O-Level passes"
      };
    }
    if (!input.oLevel.hasEnglish) {
      return {
        ok: false,
        reason: "Must have O-Level English pass"
      };
    }
    if (!input.oLevel.hasMath) {
      return {
        ok: false,
        reason: "Must have O-Level Mathematics pass"
      };
    }
    const isMatureEntry = adjustedAge >= 27;
    if (!isMatureEntry) {
      const hasALevel = input.aLevel && input.aLevel.passesCount >= 2;
      const hasEquivalent = input.equivalentQualification && input.equivalentQualification.evidenceDocId;
      if (!hasALevel && !hasEquivalent) {
        return {
          ok: false,
          reason: "Applicants under 27 must have either 2+ A-Level passes or certified equivalent qualification"
        };
      }
      if (hasALevel) {
        requirements.push("Provide certified A-Level certificate");
      }
      if (hasEquivalent && !hasALevel) {
        requirements.push("Provide certified evidence of equivalent qualification");
      }
    } else {
      if (input.aLevel && input.aLevel.passesCount >= 2) {
        warnings.push("A-Level qualifications will strengthen your application");
      }
    }
    requirements.push(
      "Upload certified O-Level certificate",
      "Upload valid ID or Passport",
      "Upload birth certificate"
    );
    return {
      ok: true,
      mature: isMatureEntry,
      requirements,
      warnings: warnings.length > 0 ? warnings : void 0
    };
  } catch (error) {
    return {
      ok: false,
      reason: "Invalid application data provided"
    };
  }
}
function checkOrganizationEligibility(input, docMap = {}, preaIsActive = false, preaIsDirector = false) {
  try {
    const requirements = [];
    const warnings = [];
    if (!input.orgProfile.legalName || input.orgProfile.legalName.trim().length < 2) {
      return {
        ok: false,
        reason: "Valid organization legal name is required"
      };
    }
    if (!input.orgProfile.emails || input.orgProfile.emails.length === 0) {
      return {
        ok: false,
        reason: "At least one email address is required"
      };
    }
    if (!input.trustAccount.bankName || input.trustAccount.bankName.trim().length < 2) {
      return {
        ok: false,
        reason: "Trust account bank name is required"
      };
    }
    if (!input.preaMemberId) {
      return {
        ok: false,
        reason: "Principal Registered Estate Agent (PREA) must be declared"
      };
    }
    if (!preaIsActive) {
      return {
        ok: false,
        reason: "Principal Registered Estate Agent must be an active individual member"
      };
    }
    if (!preaIsDirector) {
      warnings.push("Verify that the PREA is listed as a director in CR6 form");
    }
    if (!input.directors || input.directors.length === 0) {
      return {
        ok: false,
        reason: "At least one director must be listed"
      };
    }
    const requiredDocs = [
      { key: "bank_trust_letter", label: "Trust Account letter from Commercial Bank" },
      { key: "certificate_incorporation", label: "Certificate of Incorporation OR Partnership Agreement" },
      { key: "annual_return_1", label: "Annual Return Form 1" },
      { key: "annual_return_2", label: "Annual Return Form 2" },
      { key: "annual_return_3", label: "Annual Return Form 3" },
      { key: "cr6", label: "CR6 Form (Director Proof)" },
      { key: "cr11", label: "Certified CR11 Forms" },
      { key: "tax_clearance", label: "Tax Clearance Certificate" }
    ];
    input.directors.forEach((director, index) => {
      const docKey = `police_clearance_director_${index + 1}`;
      requiredDocs.push({
        key: docKey,
        label: `Police Clearance letter for ${director.name}`
      });
    });
    const missingDocs = requiredDocs.filter((doc) => !docMap[doc.key]);
    if (missingDocs.length > 0) {
      requirements.push(
        "Upload all required documents:",
        ...missingDocs.map((doc) => `- ${doc.label}`)
      );
    }
    const hasIncorporationCert = docMap["certificate_incorporation"];
    const hasPartnershipAgreement = docMap["partnership_agreement"];
    if (!hasIncorporationCert && !hasPartnershipAgreement) {
      requirements.push("Provide either Certificate of Incorporation OR Partnership Agreement");
    }
    const preaInDirectors = input.directors.some(
      (director) => director.memberId === input.preaMemberId
    );
    if (!preaInDirectors) {
      warnings.push("Ensure the PREA is listed among the directors");
    }
    return {
      ok: requirements.length === 0,
      reason: requirements.length > 0 ? "Missing required documents or information" : void 0,
      requirements: requirements.length > 0 ? requirements : void 0,
      warnings: warnings.length > 0 ? warnings : void 0
    };
  } catch (error) {
    return {
      ok: false,
      reason: "Invalid organization data provided"
    };
  }
}
function validateDocumentRequirements(applicationType, uploadedDocs, additionalContext) {
  const missing = [];
  if (applicationType === "individual") {
    const required = ["o_level_cert", "id_or_passport", "birth_certificate"];
    if (additionalContext?.matureEntry === false) {
      if (!uploadedDocs.includes("a_level_cert") && !uploadedDocs.includes("equivalent_cert")) {
        missing.push("A-Level certificate OR equivalent qualification evidence");
      }
    }
    required.forEach((docType) => {
      if (!uploadedDocs.includes(docType)) {
        missing.push(getDocumentDisplayName(docType));
      }
    });
  } else if (applicationType === "organization") {
    const required = [
      "bank_trust_letter",
      "cr6",
      "cr11",
      "tax_clearance",
      "annual_return_1",
      "annual_return_2",
      "annual_return_3"
    ];
    if (!uploadedDocs.includes("certificate_incorporation") && !uploadedDocs.includes("partnership_agreement")) {
      missing.push("Certificate of Incorporation OR Partnership Agreement");
    }
    required.forEach((docType) => {
      if (!uploadedDocs.includes(docType)) {
        missing.push(getDocumentDisplayName(docType));
      }
    });
    const directorCount = additionalContext?.directorCount || 1;
    for (let i = 1; i <= directorCount; i++) {
      if (!uploadedDocs.includes(`police_clearance_director_${i}`)) {
        missing.push(`Police Clearance for Director ${i}`);
      }
    }
  }
  return {
    ok: missing.length === 0,
    reason: missing.length > 0 ? "Missing required documents" : void 0,
    requirements: missing.length > 0 ? missing : void 0
  };
}
function getDocumentDisplayName(docType) {
  const names = {
    "o_level_cert": "O-Level Certificate",
    "a_level_cert": "A-Level Certificate",
    "equivalent_cert": "Equivalent Qualification Certificate",
    "id_or_passport": "ID or Passport",
    "birth_certificate": "Birth Certificate",
    "bank_trust_letter": "Bank Trust Account Letter",
    "certificate_incorporation": "Certificate of Incorporation",
    "partnership_agreement": "Partnership Agreement",
    "cr6": "CR6 Form",
    "cr11": "CR11 Form",
    "tax_clearance": "Tax Clearance Certificate",
    "annual_return_1": "Annual Return Form 1",
    "annual_return_2": "Annual Return Form 2",
    "annual_return_3": "Annual Return Form 3",
    "police_clearance_director": "Police Clearance for Director"
  };
  return names[docType] || docType;
}
var oLevelSchema, aLevelSchema, equivalentQualificationSchema, personalSchema;
var init_eligibility = __esm({
  "server/services/eligibility.ts"() {
    "use strict";
    oLevelSchema = z4.object({
      subjects: z4.array(z4.string()),
      hasEnglish: z4.boolean(),
      hasMath: z4.boolean(),
      passesCount: z4.number()
    });
    aLevelSchema = z4.object({
      subjects: z4.array(z4.string()),
      passesCount: z4.number()
    }).optional();
    equivalentQualificationSchema = z4.object({
      type: z4.string(),
      institution: z4.string(),
      levelMap: z4.string(),
      // How it maps to A-Level equivalent
      evidenceDocId: z4.string().optional()
    }).optional();
    personalSchema = z4.object({
      firstName: z4.string(),
      lastName: z4.string(),
      dob: z4.string(),
      // ISO date string
      nationalId: z4.string().optional(),
      email: z4.string().email(),
      phone: z4.object({
        countryCode: z4.string(),
        number: z4.string()
      }).optional(),
      address: z4.string().optional(),
      countryOfResidence: z4.string(),
      currentEmployer: z4.string().optional()
    });
  }
});

// server/middleware/submissionGuard.ts
import { eq as eq7 } from "drizzle-orm";
async function requireApplicationFee(req, res, next) {
  try {
    if (req.query.submit !== "true") {
      return next();
    }
    const { applicationId, applicationType } = req.body;
    if (!applicationId || !applicationType) {
      return res.status(400).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Bad Request",
        status: 400,
        detail: "Application ID and type are required",
        code: "MISSING_APPLICATION_DATA"
      });
    }
    let application = null;
    if (applicationType === "individual") {
      const results = await db.select().from(individualApplications).where(eq7(individualApplications.applicationId, applicationId)).limit(1);
      application = results[0];
    } else if (applicationType === "organization") {
      const results = await db.select().from(organizationApplications).where(eq7(organizationApplications.applicationId, applicationId)).limit(1);
      application = results[0];
    }
    if (!application) {
      return res.status(404).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Not Found",
        status: 404,
        detail: "Application not found",
        code: "APPLICATION_NOT_FOUND"
      });
    }
    const feeRequired = application.feeRequired ?? true;
    const feeStatus = application.feeStatus || "pending";
    const feeProofDocId = application.feeProofDocId;
    if (!feeRequired) {
      return next();
    }
    if (feeStatus === "settled") {
      return next();
    }
    if (feeProofDocId) {
      return next();
    }
    return res.status(409).json({
      type: "https://tools.ietf.org/html/rfc7807",
      title: "Payment Required",
      status: 409,
      detail: "Application fee must be paid before submission. Either pay via Paynow or upload proof of payment.",
      code: "FEE_REQUIRED",
      instance: `/applications/${applicationId}`,
      feeAmount: application.feeAmount,
      feeCurrency: application.feeCurrency || "USD",
      feeStatus,
      paymentOptions: [
        {
          method: "paynow",
          description: "Pay online using EcoCash, OneMoney, or bank transfer",
          endpoint: `/api/public/applications/${applicationId}/fee/initiate`
        },
        {
          method: "proof_upload",
          description: "Upload proof of payment if already paid",
          endpoint: `/api/public/applications/${applicationId}/documents`,
          docType: "application_fee_pop"
        }
      ]
    });
  } catch (error) {
    console.error("Submission guard error:", error);
    return res.status(500).json({
      type: "https://tools.ietf.org/html/rfc7807",
      title: "Internal Server Error",
      status: 500,
      detail: "Unable to verify payment status",
      code: "PAYMENT_VERIFICATION_ERROR"
    });
  }
}
async function validateApplicationState(req, res, next) {
  try {
    if (req.query.submit !== "true") {
      return next();
    }
    const { applicationId, applicationType } = req.body;
    if (!applicationId || !applicationType) {
      return next();
    }
    let application = null;
    if (applicationType === "individual") {
      const results = await db.select().from(individualApplications).where(eq7(individualApplications.applicationId, applicationId)).limit(1);
      application = results[0];
    } else if (applicationType === "organization") {
      const results = await db.select().from(organizationApplications).where(eq7(organizationApplications.applicationId, applicationId)).limit(1);
      application = results[0];
    }
    if (!application) {
      return next();
    }
    const validStatuses = ["draft", "needs_applicant_action"];
    if (!validStatuses.includes(application.status)) {
      return res.status(409).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Invalid Application State",
        status: 409,
        detail: `Application cannot be submitted in current state: ${application.status}`,
        code: "INVALID_APPLICATION_STATE",
        currentStatus: application.status,
        allowedStatuses: validStatuses
      });
    }
    next();
  } catch (error) {
    console.error("Application state validation error:", error);
    return res.status(500).json({
      type: "https://tools.ietf.org/html/rfc7807",
      title: "Internal Server Error",
      status: 500,
      detail: "Unable to validate application state",
      code: "STATE_VALIDATION_ERROR"
    });
  }
}
function applicationSubmissionGuards() {
  return [
    validateApplicationState,
    requireApplicationFee
  ];
}
var init_submissionGuard = __esm({
  "server/middleware/submissionGuard.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/utils/fileValidation.ts
var fileValidation_exports = {};
__export(fileValidation_exports, {
  DOCUMENT_TYPE_CONFIG: () => DOCUMENT_TYPE_CONFIG,
  FileValidator: () => FileValidator
});
import crypto3 from "crypto";
var DOCUMENT_TYPE_CONFIG, FileValidator;
var init_fileValidation = __esm({
  "server/utils/fileValidation.ts"() {
    "use strict";
    DOCUMENT_TYPE_CONFIG = {
      // Individual documents
      o_level_cert: {
        label: "O-Level Certificate",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
        maxSize: 20 * 1024 * 1024,
        // 20MB
        description: "O-Level certificate document",
        category: "education"
      },
      a_level_cert: {
        label: "A-Level Certificate",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
        maxSize: 20 * 1024 * 1024,
        description: "A-Level certificate document",
        category: "education"
      },
      equivalent_cert: {
        label: "Equivalent Certificate",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
        maxSize: 20 * 1024 * 1024,
        description: "Equivalent qualification certificate",
        category: "education"
      },
      id_or_passport: {
        label: "ID or Passport",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
        maxSize: 20 * 1024 * 1024,
        description: "National ID or passport document",
        category: "identity"
      },
      birth_certificate: {
        label: "Birth Certificate",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
        maxSize: 20 * 1024 * 1024,
        description: "Birth certificate document",
        category: "identity"
      },
      // Organization documents  
      bank_trust_letter: {
        label: "Bank Trust Letter",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
        maxSize: 20 * 1024 * 1024,
        description: "Bank trust account letter",
        category: "financial"
      },
      certificate_incorporation: {
        label: "Certificate of Incorporation",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
        maxSize: 5 * 1024 * 1024,
        description: "Certificate of incorporation document",
        category: "legal"
      },
      partnership_agreement: {
        label: "Partnership Agreement",
        allowedMimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        allowedExtensions: [".pdf", ".doc", ".docx"],
        maxSize: 10 * 1024 * 1024,
        // 10MB
        description: "Partnership agreement document",
        category: "legal"
      },
      cr6: {
        label: "CR6 Form",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
        maxSize: 5 * 1024 * 1024,
        description: "CR6 form document",
        category: "legal"
      },
      cr11: {
        label: "CR11 Form",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
        maxSize: 5 * 1024 * 1024,
        description: "CR11 form document",
        category: "legal"
      },
      tax_clearance: {
        label: "Tax Clearance",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
        maxSize: 3 * 1024 * 1024,
        description: "Tax clearance certificate",
        category: "financial"
      },
      annual_return_1: {
        label: "Annual Return (Year 1)",
        allowedMimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        allowedExtensions: [".pdf", ".doc", ".docx"],
        maxSize: 5 * 1024 * 1024,
        description: "First year annual return",
        category: "financial"
      },
      annual_return_2: {
        label: "Annual Return (Year 2)",
        allowedMimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        allowedExtensions: [".pdf", ".doc", ".docx"],
        maxSize: 5 * 1024 * 1024,
        description: "Second year annual return",
        category: "financial"
      },
      annual_return_3: {
        label: "Annual Return (Year 3)",
        allowedMimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        allowedExtensions: [".pdf", ".doc", ".docx"],
        maxSize: 5 * 1024 * 1024,
        description: "Third year annual return",
        category: "financial"
      },
      police_clearance_director: {
        label: "Police Clearance (Director)",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
        maxSize: 3 * 1024 * 1024,
        description: "Police clearance for director",
        category: "identity"
      },
      // Payment documents
      application_fee_pop: {
        label: "Application Fee Proof of Payment",
        allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
        allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
        maxSize: 20 * 1024 * 1024,
        description: "Proof of payment for application fee",
        category: "financial"
      }
    };
    FileValidator = class {
      static SUSPICIOUS_PATTERNS = [
        // Script patterns
        /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        // PHP patterns
        /<\?php/gi,
        /<\?=/gi,
        // ASP patterns
        /<%[\s\S]*?%>/gi,
        // SQL injection patterns
        /union\s+select/gi,
        /drop\s+table/gi,
        /delete\s+from/gi
      ];
      static MAGIC_NUMBERS = {
        PDF: Buffer.from([37, 80, 68, 70]),
        // %PDF
        JPEG: Buffer.from([255, 216, 255]),
        PNG: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        DOC: Buffer.from([208, 207, 17, 224, 161, 177, 26, 225]),
        DOCX: Buffer.from([80, 75, 3, 4])
        // ZIP header, DOCX is a ZIP file
      };
      /**
       * Validate file based on document type and custom options
       */
      static async validateFile(fileBuffer, filename, mimeType, options = {}) {
        const result = {
          isValid: true,
          errors: [],
          warnings: [],
          fileInfo: {
            size: fileBuffer.length,
            extension: this.getFileExtension(filename),
            mimeType,
            hash: this.calculateHash(fileBuffer)
          }
        };
        try {
          const config = options.documentType ? DOCUMENT_TYPE_CONFIG[options.documentType] : null;
          this.validateFileSize(fileBuffer, config, options, result);
          await this.validateFileType(fileBuffer, filename, mimeType, config, options, result);
          await this.checkMaliciousContent(fileBuffer, filename, result);
          await this.validateFileStructure(fileBuffer, mimeType, result);
          if (options.customValidations) {
            await this.runCustomValidations(fileBuffer, filename, options.customValidations, result);
          }
          result.isValid = result.errors.length === 0;
        } catch (error) {
          result.isValid = false;
          result.errors.push(`Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
        return result;
      }
      /**
       * Validate file size
       */
      static validateFileSize(fileBuffer, config, options, result) {
        const maxSize = options.maxSize || config?.maxSize || 10 * 1024 * 1024;
        if (fileBuffer.length > maxSize) {
          const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
          result.errors.push(`File size (${(fileBuffer.length / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size of ${maxSizeMB}MB`);
        }
        if (fileBuffer.length < 100) {
          result.errors.push("File is too small or appears to be empty");
        }
        if (fileBuffer.length > 5 * 1024 * 1024) {
          result.warnings.push("Large file detected - upload may take longer");
        }
      }
      /**
       * Validate file type using both extension and magic number
       */
      static async validateFileType(fileBuffer, filename, mimeType, config, options, result) {
        const extension = this.getFileExtension(filename);
        const allowedExtensions = options.allowedExtensions || config?.allowedExtensions || [];
        const allowedMimeTypes = options.allowedMimeTypes || config?.allowedMimeTypes || [];
        const extensionWithDot = `.${extension.toLowerCase()}`;
        if (allowedExtensions.length > 0 && !allowedExtensions.includes(extensionWithDot)) {
          result.errors.push(`File extension '${extension}' not allowed. Allowed: ${allowedExtensions.join(", ")}`);
        }
        if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(mimeType)) {
          result.errors.push(`File type '${mimeType}' not allowed. Allowed: ${allowedMimeTypes.join(", ")}`);
        }
        const detectedType = this.detectFileTypeByMagicNumber(fileBuffer);
        if (detectedType && !this.isMimeTypeMatchingDetected(mimeType, detectedType)) {
          result.warnings.push(`File content doesn't match declared type. Detected: ${detectedType}, Declared: ${mimeType}`);
        }
      }
      /**
       * Check for malicious content
       */
      static async checkMaliciousContent(fileBuffer, filename, result) {
        const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".svg"];
        const fileExtension = filename.toLowerCase().split(".").pop();
        const isAllowedFileType = fileExtension && allowedExtensions.includes("." + fileExtension);
        if (isAllowedFileType) {
          const dangerousFilenames = [
            /\.(bat|cmd|com|exe|scr|vbs|jar)$/i,
            /\.\.+/
          ];
          for (const pattern of dangerousFilenames) {
            if (pattern.test(filename)) {
              result.errors.push("Filename contains suspicious patterns");
              break;
            }
          }
          return;
        }
        const content = fileBuffer.toString("utf8");
        for (const pattern of this.SUSPICIOUS_PATTERNS) {
          if (pattern.test(content)) {
            result.errors.push("File contains potentially malicious content");
            break;
          }
        }
        const suspiciousFilenames = [
          /\.(bat|cmd|com|exe|scr|vbs|js|jar)$/i,
          /\.(php|asp|jsp|py|rb|pl)$/i,
          /\.\.+/,
          /[<>:"|?*]/
        ];
        for (const pattern of suspiciousFilenames) {
          if (pattern.test(filename)) {
            result.errors.push("Filename contains suspicious patterns");
            break;
          }
        }
      }
      /**
       * Validate file structure based on type
       */
      static async validateFileStructure(fileBuffer, mimeType, result) {
        try {
          if (mimeType === "application/pdf") {
            await this.validatePdfStructure(fileBuffer, result);
          } else if (mimeType.startsWith("image/")) {
            await this.validateImageStructure(fileBuffer, mimeType, result);
          }
        } catch (error) {
          result.warnings.push(`Could not validate file structure: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      /**
       * Validate PDF structure
       */
      static async validatePdfStructure(fileBuffer, result) {
        if (!fileBuffer.subarray(0, 4).equals(this.MAGIC_NUMBERS.PDF)) {
          result.errors.push("Invalid PDF file structure");
          return;
        }
        const footer = fileBuffer.subarray(-10);
        if (!footer.includes(Buffer.from("%%EOF"))) {
          result.warnings.push("PDF file may be corrupted - missing EOF marker");
        }
        const header = fileBuffer.subarray(0, 20).toString();
        const versionMatch = header.match(/%PDF-(\d+\.\d+)/);
        if (versionMatch) {
          const version = parseFloat(versionMatch[1]);
          if (version > 2) {
            result.warnings.push(`PDF version ${version} may not be compatible with all viewers`);
          }
        }
      }
      /**
       * Validate image structure
       */
      static async validateImageStructure(fileBuffer, mimeType, result) {
        if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
          if (!fileBuffer.subarray(0, 3).equals(this.MAGIC_NUMBERS.JPEG)) {
            result.errors.push("Invalid JPEG file structure");
          }
          if (fileBuffer[fileBuffer.length - 2] !== 255 || fileBuffer[fileBuffer.length - 1] !== 217) {
            result.warnings.push("JPEG file may be corrupted - missing end marker");
          }
        } else if (mimeType === "image/png") {
          if (!fileBuffer.subarray(0, 8).equals(this.MAGIC_NUMBERS.PNG)) {
            result.errors.push("Invalid PNG file structure");
          }
        }
      }
      /**
       * Run custom validation functions
       */
      static async runCustomValidations(fileBuffer, filename, validations, result) {
        for (const validation of validations) {
          try {
            const error = await validation(fileBuffer, filename);
            if (error) {
              result.errors.push(error);
            }
          } catch (error) {
            result.warnings.push(`Custom validation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
          }
        }
      }
      /**
       * Get file extension from filename
       */
      static getFileExtension(filename) {
        return filename.toLowerCase().split(".").pop() || "";
      }
      /**
       * Calculate file hash
       */
      static calculateHash(fileBuffer) {
        return crypto3.createHash("sha256").update(fileBuffer).digest("hex");
      }
      /**
       * Detect file type by magic number
       */
      static detectFileTypeByMagicNumber(fileBuffer) {
        if (fileBuffer.subarray(0, 4).equals(this.MAGIC_NUMBERS.PDF)) return "application/pdf";
        if (fileBuffer.subarray(0, 3).equals(this.MAGIC_NUMBERS.JPEG)) return "image/jpeg";
        if (fileBuffer.subarray(0, 8).equals(this.MAGIC_NUMBERS.PNG)) return "image/png";
        if (fileBuffer.subarray(0, 8).equals(this.MAGIC_NUMBERS.DOC)) return "application/msword";
        if (fileBuffer.subarray(0, 4).equals(this.MAGIC_NUMBERS.DOCX)) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        return null;
      }
      /**
       * Check if MIME type matches detected type
       */
      static isMimeTypeMatchingDetected(mimeType, detectedType) {
        const typeMap = {
          "application/pdf": ["application/pdf"],
          "image/jpeg": ["image/jpeg", "image/jpg"],
          "image/png": ["image/png"],
          "application/msword": ["application/msword"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        };
        return typeMap[detectedType]?.includes(mimeType) || false;
      }
      /**
       * Get document categories
       */
      static getDocumentCategories() {
        const categories = /* @__PURE__ */ new Set();
        Object.values(DOCUMENT_TYPE_CONFIG).forEach((config) => {
          categories.add(config.category);
        });
        return Array.from(categories);
      }
      /**
       * Get documents by category
       */
      static getDocumentsByCategory(category) {
        return Object.entries(DOCUMENT_TYPE_CONFIG).filter(([, config]) => config.category === category).map(([key, config]) => ({ key, config }));
      }
    };
  }
});

// server/applicationRoutes.ts
import { z as z5 } from "zod";
import { eq as eq8, and as and5, desc as desc3 } from "drizzle-orm";
function generateOTP() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
async function sendOTPEmail(email, code) {
  console.log(`OTP for ${email}: ${code}`);
  return true;
}
function registerApplicationRoutes(app2) {
  app2.post("/api/public/applications/individual/start", async (req, res) => {
    try {
      const applicationData = individualApplicationSchema.parse(req.body);
      const eligibility = checkIndividualEligibility(applicationData);
      if (!eligibility.ok) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Eligibility Check Failed",
          status: 400,
          detail: eligibility.reason,
          code: "ELIGIBILITY_FAILED"
        });
      }
      const applicationId = await nextApplicationId("individual");
      const feeAmount = eligibility.mature ? 75 : 50;
      const educationData = {
        oLevel: applicationData.oLevel,
        aLevel: applicationData.aLevel || null,
        equivalentQualification: applicationData.equivalentQualification || null,
        mature: eligibility.mature
      };
      const [application] = await db.insert(individualApplications).values({
        applicationId,
        applicantEmail: applicationData.personal.email,
        personal: applicationData.personal,
        // Direct JSONB assignment
        education: educationData,
        // Direct JSONB assignment
        memberType: "real_estate_agent",
        // TODO: Get from application data
        status: "draft",
        applicationFee: feeAmount.toString(),
        paymentStatus: "pending"
      }).returning();
      await db.insert(statusHistory).values({
        applicationType: "individual",
        applicationIdFk: applicationId,
        toStatus: "draft",
        comment: "Application created"
      });
      try {
        const { sendEmail: sendEmail2, generateApplicationConfirmationEmail: generateApplicationConfirmationEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
        const applicantName = applicationData.personal.firstName + " " + applicationData.personal.lastName;
        const confirmationEmail = generateApplicationConfirmationEmail2(
          applicantName,
          applicationId,
          "individual",
          feeAmount
        );
        await sendEmail2({
          to: applicationData.personal.email,
          from: "noreply@estateagentscouncil.org",
          ...confirmationEmail
        });
        console.log(`Application confirmation email sent to: ${applicationData.personal.email}`);
      } catch (emailError) {
        console.error("Failed to send application confirmation email:", emailError);
      }
      res.status(201).json({
        applicationId,
        matureEntry: eligibility.mature,
        feeAmount,
        feeCurrency: "USD",
        requirements: eligibility.requirements,
        warnings: eligibility.warnings,
        message: "Application created successfully. Please upload required documents and pay application fee before submission."
      });
    } catch (error) {
      console.error("Individual application start error:", error);
      if (error instanceof z5.ZodError) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Validation Error",
          status: 400,
          detail: "Invalid application data",
          code: "VALIDATION_ERROR",
          errors: error.errors
        });
      }
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to create individual application",
        code: "APPLICATION_CREATION_ERROR"
      });
    }
  });
  app2.post("/api/public/applications/organization/start", async (req, res) => {
    try {
      const applicationData = organizationApplicationSchema.parse(req.body);
      const [preaMember] = await db.select().from(members).where(eq8(members.id, applicationData.preaMemberId)).limit(1);
      const preaIsActive = preaMember && preaMember.membershipStatus === "active";
      const eligibility = checkOrganizationEligibility(
        applicationData,
        {},
        // Empty doc map - will be populated during document upload
        preaIsActive,
        false
        // Will be validated later from CR6 form
      );
      if (!eligibility.ok) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Eligibility Check Failed",
          status: 400,
          detail: eligibility.reason,
          code: "ELIGIBILITY_FAILED"
        });
      }
      const applicationId = await nextApplicationId("organization");
      const feeAmount = 150;
      const companyData = {
        orgProfile: applicationData.orgProfile,
        trustAccount: applicationData.trustAccount,
        preaMemberId: applicationData.preaMemberId,
        directors: applicationData.directors
      };
      const applicantEmail = applicationData.orgProfile.emails[0];
      const [application] = await db.insert(organizationApplications).values({
        applicationId,
        applicantEmail,
        company: companyData,
        // Direct JSONB assignment
        businessType: "real_estate_agency",
        // TODO: Get from application data
        status: "draft",
        applicationFee: feeAmount.toString(),
        paymentStatus: "pending"
      }).returning();
      await db.insert(statusHistory).values({
        applicationType: "organization",
        applicationIdFk: applicationId,
        toStatus: "draft",
        comment: "Organization application created"
      });
      try {
        const { sendEmail: sendEmail2, generateApplicationConfirmationEmail: generateApplicationConfirmationEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
        const orgProfile = applicationData.orgProfile;
        const applicantName = orgProfile.legalName;
        const applicantEmail2 = orgProfile.emails[0];
        const confirmationEmail = generateApplicationConfirmationEmail2(
          applicantName,
          applicationId,
          "organization",
          feeAmount
        );
        await sendEmail2({
          to: applicantEmail2,
          from: "noreply@estateagentscouncil.org",
          ...confirmationEmail
        });
        console.log(`Organization application confirmation email sent to: ${applicantEmail2}`);
      } catch (emailError) {
        console.error("Failed to send organization application confirmation email:", emailError);
      }
      res.status(201).json({
        applicationId,
        feeAmount,
        feeCurrency: "USD",
        requirements: eligibility.requirements,
        warnings: eligibility.warnings,
        message: "Organization application created successfully. Please upload required documents and pay application fee before submission."
      });
    } catch (error) {
      console.error("Organization application start error:", error);
      if (error instanceof z5.ZodError) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Validation Error",
          status: 400,
          detail: "Invalid application data",
          code: "VALIDATION_ERROR",
          errors: error.errors
        });
      }
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to create organization application",
        code: "APPLICATION_CREATION_ERROR"
      });
    }
  });
  app2.get("/api/public/applications/:applicationId", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const [individualApp] = await db.select().from(individualApplications).where(eq8(individualApplications.applicationId, applicationId)).limit(1);
      if (individualApp) {
        const documents2 = await db.select().from(uploadedDocuments2).where(and5(
          eq8(uploadedDocuments2.applicationType, "individual"),
          eq8(uploadedDocuments2.applicationIdFk, applicationId)
        ));
        const history = await db.select().from(statusHistory).where(and5(
          eq8(statusHistory.applicationType, "individual"),
          eq8(statusHistory.applicationIdFk, applicationId)
        )).orderBy(desc3(statusHistory.createdAt));
        return res.json({
          ...individualApp,
          applicationType: "individual",
          documents: documents2,
          statusHistory: history
        });
      }
      const [orgApp] = await db.select().from(organizationApplications).where(eq8(organizationApplications.applicationId, applicationId)).limit(1);
      if (orgApp) {
        const documents2 = await db.select().from(uploadedDocuments2).where(and5(
          eq8(uploadedDocuments2.applicationType, "organization"),
          eq8(uploadedDocuments2.applicationIdFk, applicationId)
        ));
        const history = await db.select().from(statusHistory).where(and5(
          eq8(statusHistory.applicationType, "organization"),
          eq8(statusHistory.applicationIdFk, applicationId)
        )).orderBy(desc3(statusHistory.createdAt));
        return res.json({
          ...orgApp,
          applicationType: "organization",
          documents: documents2,
          statusHistory: history
        });
      }
      res.status(404).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Not Found",
        status: 404,
        detail: "Application not found",
        code: "APPLICATION_NOT_FOUND"
      });
    } catch (error) {
      console.error("Get application error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to retrieve application",
        code: "APPLICATION_FETCH_ERROR"
      });
    }
  });
  app2.post(
    "/api/public/applications/:applicationId/submit",
    applicationSubmissionGuards(),
    async (req, res) => {
      try {
        const { applicationId } = req.params;
        let application = null;
        let applicationType = "individual";
        const [individualApp] = await db.select().from(individualApplications).where(eq8(individualApplications.applicationId, applicationId)).limit(1);
        if (individualApp) {
          application = individualApp;
          applicationType = "individual";
        } else {
          const [orgApp] = await db.select().from(organizationApplications).where(eq8(organizationApplications.applicationId, applicationId)).limit(1);
          if (orgApp) {
            application = orgApp;
            applicationType = "organization";
          }
        }
        if (!application) {
          return res.status(404).json({
            type: "https://tools.ietf.org/html/rfc7807",
            title: "Not Found",
            status: 404,
            detail: "Application not found",
            code: "APPLICATION_NOT_FOUND"
          });
        }
        const uploadedDocs = await db.select().from(uploadedDocuments2).where(and5(
          eq8(uploadedDocuments2.applicationType, applicationType),
          eq8(uploadedDocuments2.applicationIdFk, applicationId)
        ));
        const docTypes = uploadedDocs.map((doc) => doc.docType);
        const docValidation = validateDocumentRequirements(
          applicationType,
          docTypes,
          {
            matureEntry: applicationType === "individual" ? application.education?.mature : void 0,
            directorCount: applicationType === "organization" ? (application.company?.directors || []).length : void 0
          }
        );
        if (!docValidation.ok) {
          return res.status(400).json({
            type: "https://tools.ietf.org/html/rfc7807",
            title: "Missing Required Documents",
            status: 400,
            detail: docValidation.reason,
            code: "MISSING_DOCUMENTS",
            requirements: docValidation.requirements
          });
        }
        if (applicationType === "individual") {
          await db.update(individualApplications).set({
            status: "eligibility_review",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq8(individualApplications.applicationId, applicationId));
        } else {
          await db.update(organizationApplications).set({
            status: "eligibility_review",
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq8(organizationApplications.applicationId, applicationId));
        }
        const submittedAt = /* @__PURE__ */ new Date();
        await db.insert(statusHistory).values({
          applicationType,
          applicationIdFk: applicationId,
          fromStatus: application.status || "draft",
          toStatus: "eligibility_review",
          comment: "Application submitted for review"
        });
        res.json({
          applicationId,
          status: "eligibility_review",
          submittedAt,
          message: "Application submitted successfully and is now under review"
        });
      } catch (error) {
        console.error("Application submission error:", error);
        res.status(500).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Internal Server Error",
          status: 500,
          detail: "Failed to submit application",
          code: "SUBMISSION_ERROR"
        });
      }
    }
  );
  app2.post("/api/public/applications/:applicationId/generate-otp", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Email address is required",
          code: "MISSING_EMAIL"
        });
      }
      const [individualApp] = await db.select().from(individualApplications).where(eq8(individualApplications.applicationId, applicationId)).limit(1);
      const [orgApp] = await db.select().from(organizationApplications).where(eq8(organizationApplications.applicationId, applicationId)).limit(1);
      if (!individualApp && !orgApp) {
        return res.status(404).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Not Found",
          status: 404,
          detail: "Application not found",
          code: "APPLICATION_NOT_FOUND"
        });
      }
      const applicationType = individualApp ? "individual" : "organization";
      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1e3);
      await db.insert(appLoginTokens).values({
        applicationType,
        applicationIdFk: applicationId,
        email,
        code,
        expiresAt
      });
      await sendOTPEmail(email, code);
      res.json({
        message: "OTP sent to your email address",
        expiresAt
      });
    } catch (error) {
      console.error("OTP generation error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to generate OTP",
        code: "OTP_GENERATION_ERROR"
      });
    }
  });
  app2.post("/api/public/applications/:applicationId/verify-otp", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Email and OTP code are required",
          code: "MISSING_CREDENTIALS"
        });
      }
      const [token] = await db.select().from(appLoginTokens).where(and5(
        eq8(appLoginTokens.applicationIdFk, applicationId),
        eq8(appLoginTokens.email, email),
        eq8(appLoginTokens.code, code)
      )).limit(1);
      if (!token) {
        return res.status(401).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Invalid OTP",
          status: 401,
          detail: "Invalid or expired OTP code",
          code: "INVALID_OTP"
        });
      }
      if (/* @__PURE__ */ new Date() > token.expiresAt) {
        return res.status(401).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Expired OTP",
          status: 401,
          detail: "OTP code has expired",
          code: "EXPIRED_OTP"
        });
      }
      if ((token.attempts || 0) >= 3) {
        return res.status(429).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Too Many Attempts",
          status: 429,
          detail: "Too many verification attempts",
          code: "TOO_MANY_ATTEMPTS"
        });
      }
      await db.update(appLoginTokens).set({ attempts: (token.attempts || 0) + 1 }).where(eq8(appLoginTokens.id, token.id));
      const sessionToken = Buffer.from(`${applicationId}:${email}:${Date.now()}`).toString("base64");
      res.json({
        sessionToken,
        applicationId,
        applicationType: token.applicationType,
        message: "OTP verified successfully"
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to verify OTP",
        code: "OTP_VERIFICATION_ERROR"
      });
    }
  });
  app2.post("/api/public/applications/:applicationId/fee/initiate", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { method, amount, email, phone } = req.body;
      let application = null;
      let applicationType = "individual";
      const [individualApp] = await db.select().from(individualApplications).where(eq8(individualApplications.applicationId, applicationId)).limit(1);
      if (individualApp) {
        application = individualApp;
        applicationType = "individual";
      } else {
        const [orgApp] = await db.select().from(organizationApplications).where(eq8(organizationApplications.applicationId, applicationId)).limit(1);
        if (orgApp) {
          application = orgApp;
          applicationType = "organization";
        }
      }
      if (!application) {
        return res.status(404).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Not Found",
          status: 404,
          detail: "Application not found",
          code: "APPLICATION_NOT_FOUND"
        });
      }
      if (amount !== application.feeAmount) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Invalid Amount",
          status: 400,
          detail: `Payment amount must be ${application.feeAmount} ${application.feeCurrency}`,
          code: "INVALID_PAYMENT_AMOUNT"
        });
      }
      const appEmail = application.personal ? application.personal.email : application.company.orgProfile?.emails?.[0];
      const paynowService2 = createPaynowService();
      const paymentResult = await paynowService2.initiatePayment({
        amount,
        currency: "USD",
        email: email || appEmail,
        reference: `EACZ-FEE-${applicationId}`,
        returnUrl: `${process.env.FRONTEND_URL}/application/${applicationId}/payment-complete`,
        resultUrl: `${process.env.BACKEND_URL}/api/public/applications/${applicationId}/fee/callback`
      });
      if (!paymentResult.success) {
        return res.status(500).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Payment Initialization Failed",
          status: 500,
          detail: paymentResult.error || "Failed to initialize payment",
          code: "PAYMENT_INIT_ERROR"
        });
      }
      const updateData = {
        paymentReference: paymentResult.pollUrl,
        paymentStatus: "pending"
      };
      if (applicationType === "individual") {
        await db.update(individualApplications).set(updateData).where(eq8(individualApplications.applicationId, applicationId));
      } else {
        await db.update(organizationApplications).set(updateData).where(eq8(organizationApplications.applicationId, applicationId));
      }
      res.json({
        paymentUrl: paymentResult.redirectUrl,
        pollUrl: paymentResult.pollUrl,
        instructions: paymentResult.instructions,
        message: "Payment initialized successfully"
      });
    } catch (error) {
      console.error("Payment initialization error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to initialize payment",
        code: "PAYMENT_INIT_ERROR"
      });
    }
  });
  app2.post("/api/public/applications/:applicationId/fee/callback", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const paynowService2 = createPaynowService();
      const callbackResult = await paynowService2.verifyIPN(req.body);
      if (callbackResult && callbackResult.success && isPaymentSuccessful(callbackResult.status)) {
        const updateData = {
          paymentStatus: "completed",
          updatedAt: /* @__PURE__ */ new Date()
        };
        const [individualApp] = await db.select().from(individualApplications).where(eq8(individualApplications.applicationId, applicationId)).limit(1);
        if (individualApp) {
          await db.update(individualApplications).set(updateData).where(eq8(individualApplications.applicationId, applicationId));
          await db.insert(statusHistory).values({
            applicationType: "individual",
            applicationIdFk: applicationId,
            fromStatus: individualApp.status || "draft",
            toStatus: individualApp.status || "draft",
            comment: "Application fee payment confirmed"
          });
        } else {
          const [orgApp] = await db.select().from(organizationApplications).where(eq8(organizationApplications.applicationId, applicationId)).limit(1);
          if (orgApp) {
            await db.update(organizationApplications).set(updateData).where(eq8(organizationApplications.applicationId, applicationId));
            await db.insert(statusHistory).values({
              applicationType: "organization",
              applicationIdFk: applicationId,
              fromStatus: orgApp.status || "draft",
              toStatus: orgApp.status || "draft",
              comment: "Application fee payment confirmed"
            });
          }
        }
      }
      res.status(200).send("OK");
    } catch (error) {
      console.error("Payment callback error:", error);
      res.status(500).send("Error");
    }
  });
  app2.post("/api/public/applications/:applicationId/fee/proof", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { fileKey, fileName, mimeType, size } = req.body;
      if (!fileKey || !fileName) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "File key and name are required",
          code: "MISSING_FILE_DATA"
        });
      }
      let applicationType = "individual";
      const [individualApp] = await db.select().from(individualApplications).where(eq8(individualApplications.applicationId, applicationId)).limit(1);
      if (!individualApp) {
        const [orgApp] = await db.select().from(organizationApplications).where(eq8(organizationApplications.applicationId, applicationId)).limit(1);
        if (orgApp) {
          applicationType = "organization";
        } else {
          return res.status(404).json({
            type: "https://tools.ietf.org/html/rfc7807",
            title: "Not Found",
            status: 404,
            detail: "Application not found",
            code: "APPLICATION_NOT_FOUND"
          });
        }
      }
      const [document] = await db.insert(uploadedDocuments2).values({
        applicationType,
        applicationIdFk: applicationId,
        docType: "application_fee_pop",
        fileKey,
        fileName,
        mime: mimeType,
        sizeBytes: size,
        status: "uploaded"
      }).returning();
      const updateData = {
        paymentStatus: "pending",
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (applicationType === "individual") {
        await db.update(individualApplications).set(updateData).where(eq8(individualApplications.applicationId, applicationId));
      } else {
        await db.update(organizationApplications).set(updateData).where(eq8(organizationApplications.applicationId, applicationId));
      }
      await db.insert(statusHistory).values({
        applicationType,
        applicationIdFk: applicationId,
        fromStatus: applicationType === "individual" ? individualApp?.status || "draft" : "draft",
        toStatus: applicationType === "individual" ? individualApp?.status || "draft" : "draft",
        comment: "Proof of payment uploaded - pending verification"
      });
      res.json({
        documentId: document.id,
        message: "Proof of payment uploaded successfully. Payment verification is pending."
      });
    } catch (error) {
      console.error("Proof of payment upload error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to upload proof of payment",
        code: "PROOF_UPLOAD_ERROR"
      });
    }
  });
  app2.post("/api/public/applications/:applicationId/documents", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { fileKey, fileName, mimeType, size, docType, uploadUrl } = req.body;
      if (!fileKey || !fileName || !docType || !uploadUrl) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "File key, name, document type, and upload URL are required for security validation",
          code: "MISSING_DOCUMENT_DATA"
        });
      }
      const { DOCUMENT_TYPE_CONFIG: DOCUMENT_TYPE_CONFIG2, FileValidator: FileValidator2 } = await Promise.resolve().then(() => (init_fileValidation(), fileValidation_exports));
      if (!DOCUMENT_TYPE_CONFIG2[docType]) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Invalid document type",
          code: "INVALID_DOCUMENT_TYPE"
        });
      }
      const typeConfig = DOCUMENT_TYPE_CONFIG2[docType];
      console.log("Performing server-side file validation for:", fileName);
      const fileResponse = await fetch(uploadUrl);
      if (!fileResponse.ok) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Failed to access uploaded file for server-side validation",
          code: "FILE_ACCESS_ERROR"
        });
      }
      const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());
      const actualSize = fileBuffer.length;
      const validationResult = await FileValidator2.validateFile(
        fileBuffer,
        fileName,
        mimeType || "application/octet-stream",
        { documentType: docType }
      );
      if (!validationResult.isValid) {
        console.error("Server-side file validation failed:", validationResult.errors);
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "File Security Validation Failed",
          status: 400,
          detail: `File failed security validation: ${validationResult.errors.join("; ")}`,
          code: "FILE_SECURITY_VALIDATION_FAILED",
          errors: validationResult.errors,
          warnings: validationResult.warnings
        });
      }
      const calculatedHash = validationResult.fileInfo.hash;
      console.log("File validation passed. Calculated SHA-256:", calculatedHash);
      const existingByHash = await db.select({
        id: uploadedDocuments2.id,
        applicationIdFk: uploadedDocuments2.applicationIdFk,
        docType: uploadedDocuments2.docType,
        fileName: uploadedDocuments2.fileName
      }).from(uploadedDocuments2).where(eq8(uploadedDocuments2.sha256, calculatedHash)).limit(1);
      if (existingByHash.length > 0) {
        const existingDoc = existingByHash[0];
        console.log("Duplicate file detected with hash:", calculatedHash);
        return res.status(409).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Duplicate File Content",
          status: 409,
          detail: `A file with identical content already exists: "${existingDoc.fileName}" in application ${existingDoc.applicationIdFk}`,
          code: "DUPLICATE_FILE_CONTENT",
          existingDocument: {
            id: existingDoc.id,
            applicationId: existingDoc.applicationIdFk,
            docType: existingDoc.docType,
            fileName: existingDoc.fileName
          }
        });
      }
      let applicationType = "individual";
      let application;
      const [individualApp] = await db.select().from(individualApplications).where(eq8(individualApplications.applicationId, applicationId)).limit(1);
      if (individualApp) {
        application = individualApp;
        applicationType = "individual";
      } else {
        const [orgApp] = await db.select().from(organizationApplications).where(eq8(organizationApplications.applicationId, applicationId)).limit(1);
        if (orgApp) {
          application = orgApp;
          applicationType = "organization";
        } else {
          return res.status(404).json({
            type: "https://tools.ietf.org/html/rfc7807",
            title: "Not Found",
            status: 404,
            detail: "Application not found",
            code: "APPLICATION_NOT_FOUND"
          });
        }
      }
      if (!["draft", "needs_applicant_action"].includes(application.status || "")) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: `Cannot upload documents for application in ${application.status} status`,
          code: "INVALID_APPLICATION_STATUS"
        });
      }
      const existingDocForType = await db.select().from(uploadedDocuments2).where(
        and5(
          eq8(uploadedDocuments2.applicationIdFk, applicationId),
          eq8(uploadedDocuments2.docType, docType)
        )
      ).limit(1);
      const singleDocumentTypes = ["id_or_passport", "birth_certificate", "certificate_incorporation"];
      if (singleDocumentTypes.includes(docType) && existingDocForType.length > 0) {
        console.log("Updating existing single-document type:", docType);
        const [document2] = await db.update(uploadedDocuments2).set({
          fileKey,
          fileName,
          mime: mimeType,
          sizeBytes: actualSize,
          sha256: calculatedHash,
          status: "uploaded",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq8(uploadedDocuments2.id, existingDocForType[0].id)).returning();
        return res.status(200).json({
          documentId: document2.id,
          docType,
          fileName,
          status: "uploaded",
          fileSize: actualSize,
          mimeType,
          fileHash: calculatedHash,
          uploadedAt: document2.updatedAt,
          category: typeConfig.category,
          validationWarnings: validationResult.warnings,
          message: `${typeConfig.label} updated successfully after security validation`
        });
      }
      console.log("Creating new document record for:", docType);
      const [document] = await db.insert(uploadedDocuments2).values({
        applicationType,
        applicationIdFk: applicationId,
        docType,
        fileKey,
        fileName,
        mime: mimeType,
        sizeBytes: actualSize,
        sha256: calculatedHash,
        status: "uploaded"
      }).returning();
      console.log("Document upload completed with security validation:", document.id);
      res.status(201).json({
        documentId: document.id,
        docType,
        fileName,
        status: "uploaded",
        fileSize: actualSize,
        mimeType,
        fileHash: calculatedHash,
        uploadedAt: document.uploadedAt,
        category: typeConfig.category,
        validationWarnings: validationResult.warnings,
        message: `${typeConfig.label} uploaded successfully after comprehensive security validation`
      });
    } catch (error) {
      console.error("Document upload error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to upload document",
        code: "DOCUMENT_UPLOAD_ERROR"
      });
    }
  });
  app2.get("/api/public/applications/:applicationId/documents", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const documents2 = await db.select().from(uploadedDocuments2).where(eq8(uploadedDocuments2.applicationIdFk, applicationId)).orderBy(desc3(uploadedDocuments2.uploadedAt));
      res.json(documents2);
    } catch (error) {
      console.error("Get documents error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to retrieve documents",
        code: "DOCUMENTS_FETCH_ERROR"
      });
    }
  });
  app2.delete("/api/public/applications/:applicationId/documents/:documentId", async (req, res) => {
    try {
      const { applicationId, documentId } = req.params;
      const [document] = await db.select().from(uploadedDocuments2).where(and5(
        eq8(uploadedDocuments2.id, documentId),
        eq8(uploadedDocuments2.applicationIdFk, applicationId)
      )).limit(1);
      if (!document) {
        return res.status(404).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Not Found",
          status: 404,
          detail: "Document not found",
          code: "DOCUMENT_NOT_FOUND"
        });
      }
      if (document.status !== "uploaded") {
        return res.status(409).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Document Cannot Be Deleted",
          status: 409,
          detail: "Document has already been processed and cannot be deleted",
          code: "DOCUMENT_PROCESSED"
        });
      }
      await db.delete(uploadedDocuments2).where(eq8(uploadedDocuments2.id, documentId));
      res.json({
        message: "Document deleted successfully"
      });
    } catch (error) {
      console.error("Document deletion error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to delete document",
        code: "DOCUMENT_DELETE_ERROR"
      });
    }
  });
  function requireAuth4(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  }
  function authorizeRole2(allowedRoles) {
    return (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const userRole = req.user?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions.",
          requiredRoles: allowedRoles,
          userRole
        });
      }
      next();
    };
  }
  const ADMIN_ROLES2 = ["admin", "super_admin"];
  const STAFF_ROLES2 = ["admin", "member_manager", "super_admin", "staff"];
  app2.get("/api/admin/applications", authorizeRole2(STAFF_ROLES2), async (req, res) => {
    try {
      const { status, type, limit = 50, offset = 0 } = req.query;
      const individualQueryBase = db.select().from(individualApplications);
      const orgQueryBase = db.select().from(organizationApplications);
      const individualQuery = status ? individualQueryBase.where(eq8(individualApplications.status, status)) : individualQueryBase;
      const orgQuery = status ? orgQueryBase.where(eq8(organizationApplications.status, status)) : orgQueryBase;
      let individualApps = [];
      if (!type || type === "individual") {
        individualApps = await individualQuery.limit(parseInt(limit)).offset(parseInt(offset)).orderBy(desc3(individualApplications.createdAt));
      }
      let orgApps = [];
      if (!type || type === "organization") {
        orgApps = await orgQuery.limit(parseInt(limit)).offset(parseInt(offset)).orderBy(desc3(organizationApplications.createdAt));
      }
      const allApplications = [
        ...individualApps.map((app3) => ({ ...app3, applicationType: "individual" })),
        ...orgApps.map((app3) => ({ ...app3, applicationType: "organization" }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json(allApplications);
    } catch (error) {
      console.error("Admin applications fetch error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  app2.get("/api/admin/applications/:applicationId", authorizeRole2(STAFF_ROLES2), async (req, res) => {
    try {
      const { applicationId } = req.params;
      const [individualApp] = await db.select().from(individualApplications).where(eq8(individualApplications.applicationId, applicationId)).limit(1);
      let application = null;
      let applicationType = "individual";
      if (individualApp) {
        application = individualApp;
        applicationType = "individual";
      } else {
        const [orgApp] = await db.select().from(organizationApplications).where(eq8(organizationApplications.applicationId, applicationId)).limit(1);
        if (orgApp) {
          application = orgApp;
          applicationType = "organization";
        }
      }
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const documents2 = await db.select().from(uploadedDocuments2).where(and5(
        eq8(uploadedDocuments2.applicationType, applicationType),
        eq8(uploadedDocuments2.applicationIdFk, applicationId)
      ));
      const history = await db.select().from(statusHistory).where(and5(
        eq8(statusHistory.applicationType, applicationType),
        eq8(statusHistory.applicationIdFk, applicationId)
      )).orderBy(desc3(statusHistory.createdAt));
      const decisions = await db.select().from(registryDecisions).where(and5(
        eq8(registryDecisions.applicationType, applicationType),
        eq8(registryDecisions.applicationIdFk, applicationId)
      )).orderBy(desc3(registryDecisions.decidedAt));
      res.json({
        ...application,
        applicationType,
        documents: documents2,
        statusHistory: history,
        decisions
      });
    } catch (error) {
      console.error("Admin application details fetch error:", error);
      res.status(500).json({ message: "Failed to fetch application details" });
    }
  });
  app2.put("/api/admin/applications/:applicationId/status", authorizeRole2(STAFF_ROLES2), async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status, comment } = req.body;
      const userId = req.user?.id;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      let application = null;
      let applicationType = "individual";
      const [individualApp] = await db.select().from(individualApplications).where(eq8(individualApplications.applicationId, applicationId)).limit(1);
      if (individualApp) {
        application = individualApp;
        applicationType = "individual";
      } else {
        const [orgApp] = await db.select().from(organizationApplications).where(eq8(organizationApplications.applicationId, applicationId)).limit(1);
        if (orgApp) {
          application = orgApp;
          applicationType = "organization";
        }
      }
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const updateData = { status, updatedAt: /* @__PURE__ */ new Date() };
      if (applicationType === "individual") {
        await db.update(individualApplications).set(updateData).where(eq8(individualApplications.applicationId, applicationId));
      } else {
        await db.update(organizationApplications).set(updateData).where(eq8(organizationApplications.applicationId, applicationId));
      }
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
        message: "Application status updated successfully"
      });
    } catch (error) {
      console.error("Admin status update error:", error);
      res.status(500).json({ message: "Failed to update application status" });
    }
  });
  app2.put("/api/admin/applications/:applicationId/documents/:documentId/verify", authorizeRole2(STAFF_ROLES2), async (req, res) => {
    try {
      const { applicationId, documentId } = req.params;
      const { status, notes } = req.body;
      const userId = req.user?.id;
      if (!status || !["verified", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Valid status (verified/rejected) is required" });
      }
      const [document] = await db.select().from(uploadedDocuments2).where(and5(
        eq8(uploadedDocuments2.id, documentId),
        eq8(uploadedDocuments2.applicationIdFk, applicationId)
      )).limit(1);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      const updateData = {
        status,
        verifierUserId: userId,
        verifiedAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (status === "rejected" && notes) {
        updateData.rejectionReason = notes;
      }
      await db.update(uploadedDocuments2).set(updateData).where(eq8(uploadedDocuments2.id, documentId));
      res.json({
        documentId,
        status,
        message: `Document ${status} successfully`
      });
    } catch (error) {
      console.error("Document verification error:", error);
      res.status(500).json({ message: "Failed to verify document" });
    }
  });
  app2.get("/api/admin/documents", authorizeRole2(STAFF_ROLES2), async (req, res) => {
    try {
      const documents2 = await db.select().from(uploadedDocuments2).orderBy(desc3(uploadedDocuments2.uploadedAt));
      res.json(documents2);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  app2.post("/api/admin/applications/:applicationId/decide", authorizeRole2(ADMIN_ROLES2), async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { decision, reasons } = req.body;
      const userId = req.user?.id;
      if (!decision || !["accepted", "rejected"].includes(decision)) {
        return res.status(400).json({ message: "Valid decision (accepted/rejected) is required" });
      }
      let application = null;
      let applicationType = "individual";
      const [individualApp] = await db.select().from(individualApplications).where(eq8(individualApplications.applicationId, applicationId)).limit(1);
      if (individualApp) {
        application = individualApp;
        applicationType = "individual";
      } else {
        const [orgApp] = await db.select().from(organizationApplications).where(eq8(organizationApplications.applicationId, applicationId)).limit(1);
        if (orgApp) {
          application = orgApp;
          applicationType = "organization";
        }
      }
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      await db.insert(registryDecisions).values({
        applicationType,
        applicationIdFk: applicationId,
        decision,
        reasons,
        decidedBy: userId,
        decidedAt: /* @__PURE__ */ new Date()
      });
      const newStatus = decision === "accepted" ? "accepted" : "rejected";
      const updateData = {
        status: newStatus,
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (decision === "accepted") {
        const memberNumber = applicationId.replace("APP-", "EAC-");
        Object.assign(updateData, { memberId: memberNumber });
      }
      if (applicationType === "individual") {
        await db.update(individualApplications).set(updateData).where(eq8(individualApplications.applicationId, applicationId));
      } else {
        await db.update(organizationApplications).set(updateData).where(eq8(organizationApplications.applicationId, applicationId));
      }
      await db.insert(statusHistory).values({
        applicationType,
        applicationIdFk: applicationId,
        fromStatus: application.status || "draft",
        toStatus: newStatus,
        actorUserId: userId,
        comment: `Application ${decision} by registry`
      });
      res.json({
        applicationId,
        decision,
        status: newStatus,
        memberNumber: updateData.memberId,
        message: `Application ${decision} successfully`
      });
    } catch (error) {
      console.error("Registry decision error:", error);
      res.status(500).json({ message: "Failed to record decision" });
    }
  });
}
var individualApplicationSchema, organizationApplicationSchema;
var init_applicationRoutes = __esm({
  "server/applicationRoutes.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_namingSeries();
    init_paynow();
    init_eligibility();
    init_submissionGuard();
    individualApplicationSchema = z5.object({
      personal: z5.object({
        firstName: z5.string().min(2),
        lastName: z5.string().min(2),
        dob: z5.string().refine((dateStr) => {
          const dob = new Date(dateStr);
          const today = /* @__PURE__ */ new Date();
          const age = today.getFullYear() - dob.getFullYear();
          const adjustedAge = today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate() ? age - 1 : age;
          return adjustedAge >= 18;
        }, { message: "Applicant must be at least 18 years old" }),
        nationalId: z5.string().optional(),
        email: z5.string().email(),
        phone: z5.object({
          countryCode: z5.string().min(1, "Country code is required"),
          number: z5.string().min(5, "Phone number is required")
        }).optional(),
        address: z5.string().optional(),
        countryOfResidence: z5.string().min(2, "Country of residence is required"),
        currentEmployer: z5.string().optional()
      }),
      oLevel: z5.object({
        subjects: z5.array(z5.string()),
        hasEnglish: z5.boolean(),
        hasMath: z5.boolean(),
        passesCount: z5.number().min(5)
      }),
      aLevel: z5.object({
        subjects: z5.array(z5.string()),
        passesCount: z5.number()
      }).optional(),
      equivalentQualification: z5.object({
        type: z5.string(),
        institution: z5.string(),
        levelMap: z5.string(),
        evidenceDocId: z5.string().optional()
      }).optional()
    });
    organizationApplicationSchema = z5.object({
      orgProfile: z5.object({
        legalName: z5.string().min(2),
        tradingName: z5.string().optional(),
        regNo: z5.string().optional(),
        taxNo: z5.string().optional(),
        address: z5.string().optional(),
        emails: z5.array(z5.string().email()),
        phones: z5.array(z5.string()).optional()
      }),
      trustAccount: z5.object({
        bankName: z5.string().min(2),
        branch: z5.string().optional(),
        accountNoMasked: z5.string().optional()
      }),
      preaMemberId: z5.string(),
      directors: z5.array(z5.object({
        name: z5.string(),
        nationalId: z5.string().optional(),
        memberId: z5.string().optional()
      }))
    });
  }
});

// server/notificationRoutes.ts
import { eq as eq9, desc as desc4, and as and6, isNull } from "drizzle-orm";
function registerNotificationRoutes(app2) {
  app2.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }
      const userNotifications = await db.select().from(notifications).where(eq9(notifications.userId, userId)).orderBy(desc4(notifications.createdAt));
      res.json({
        success: true,
        notifications: userNotifications
      });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch notifications"
      });
    }
  });
  app2.get("/api/notifications/unread", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }
      const unreadNotifications = await db.select().from(notifications).where(
        and6(
          eq9(notifications.userId, userId),
          isNull(notifications.openedAt)
        )
      );
      res.json({
        success: true,
        count: unreadNotifications.length,
        notifications: unreadNotifications
      });
    } catch (error) {
      console.error("Get unread notifications error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch unread notifications"
      });
    }
  });
  app2.put("/api/notifications/:id/mark-read", async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }
      const [notification] = await db.select().from(notifications).where(
        and6(
          eq9(notifications.id, id),
          eq9(notifications.userId, userId)
        )
      ).limit(1);
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: "Notification not found"
        });
      }
      const [updated] = await db.update(notifications).set({
        openedAt: /* @__PURE__ */ new Date()
      }).where(eq9(notifications.id, id)).returning();
      res.json({
        success: true,
        notification: updated
      });
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to mark notification as read"
      });
    }
  });
  app2.put("/api/notifications/mark-all-read", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }
      await db.update(notifications).set({
        openedAt: /* @__PURE__ */ new Date()
      }).where(
        and6(
          eq9(notifications.userId, userId),
          isNull(notifications.openedAt)
        )
      );
      res.json({
        success: true,
        message: "All notifications marked as read"
      });
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to mark all notifications as read"
      });
    }
  });
  app2.delete("/api/notifications/:id", async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized"
        });
      }
      const [notification] = await db.select().from(notifications).where(
        and6(
          eq9(notifications.id, id),
          eq9(notifications.userId, userId)
        )
      ).limit(1);
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: "Notification not found"
        });
      }
      await db.delete(notifications).where(eq9(notifications.id, id));
      res.json({
        success: true,
        message: "Notification deleted"
      });
    } catch (error) {
      console.error("Delete notification error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete notification"
      });
    }
  });
  app2.post("/api/notifications/create", async (req, res) => {
    try {
      const {
        userId,
        memberId,
        type = "in_app",
        title,
        message,
        data
      } = req.body;
      if (!title || !message) {
        return res.status(400).json({
          success: false,
          error: "Title and message are required"
        });
      }
      const [notification] = await db.insert(notifications).values({
        userId,
        memberId,
        type,
        status: "pending",
        title,
        message,
        data: data ? JSON.stringify(data) : null
      }).returning();
      res.json({
        success: true,
        notification
      });
    } catch (error) {
      console.error("Create notification error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create notification"
      });
    }
  });
}
var init_notificationRoutes = __esm({
  "server/notificationRoutes.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/userProfileRoutes.ts
import { eq as eq10, and as and7, desc as desc5 } from "drizzle-orm";
import { z as z6 } from "zod";
function registerUserProfileRoutes(app2) {
  app2.get("/api/user/profile", requireAuth2, async (req, res) => {
    try {
      const userId = req.user.id;
      const [profile] = await db.select().from(users).where(eq10(users.id, userId)).limit(1);
      if (!profile) {
        return res.status(404).json({
          error: "Profile not found"
        });
      }
      const { password, passwordResetToken, emailVerificationToken, twoFactorSecret, ...safeProfile } = profile;
      res.json(safeProfile);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        error: "Failed to get profile"
      });
    }
  });
  app2.put("/api/user/profile", requireAuth2, async (req, res) => {
    try {
      const userId = req.user.id;
      const validation = updateProfileSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Validation error",
          details: validation.error.errors
        });
      }
      const updateData = validation.data;
      if (updateData.email) {
        const [existingUser] = await db.select().from(users).where(and7(
          eq10(users.email, updateData.email),
          // Not the current user
          // @ts-ignore - Type mismatch but works
          eq10(users.id, userId) === false
        )).limit(1);
        if (existingUser) {
          return res.status(400).json({
            error: "Email already in use"
          });
        }
      }
      const [updatedProfile] = await db.update(users).set({
        ...updateData,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq10(users.id, userId)).returning();
      if (!updatedProfile) {
        return res.status(404).json({
          error: "Profile not found"
        });
      }
      await db.insert(auditLogs).values({
        userId,
        action: "UPDATE",
        resource: "user_profile",
        resourceId: userId,
        description: "Updated profile information",
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"]
      });
      const { password, passwordResetToken, emailVerificationToken, twoFactorSecret, ...safeProfile } = updatedProfile;
      res.json({
        success: true,
        message: "Profile updated successfully",
        profile: safeProfile
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        error: "Failed to update profile"
      });
    }
  });
  app2.put("/api/user/preferences", requireAuth2, async (req, res) => {
    try {
      const userId = req.user.id;
      const validation = updatePreferencesSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Validation error",
          details: validation.error.errors
        });
      }
      const preferences = validation.data;
      await db.update(users).set({
        notes: JSON.stringify({ preferences }),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq10(users.id, userId));
      await db.insert(auditLogs).values({
        userId,
        action: "UPDATE",
        resource: "user_preferences",
        resourceId: userId,
        description: "Updated user preferences",
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"]
      });
      res.json({
        success: true,
        message: "Preferences updated successfully",
        preferences
      });
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({
        error: "Failed to update preferences"
      });
    }
  });
  app2.get("/api/user/sessions", requireAuth2, async (req, res) => {
    try {
      const userId = req.user.id;
      const sessions = await db.select().from(userSessions).where(and7(
        eq10(userSessions.userId, userId),
        eq10(userSessions.isActive, true)
      )).orderBy(desc5(userSessions.lastActivity)).limit(50);
      res.json(sessions);
    } catch (error) {
      console.error("Get sessions error:", error);
      res.status(500).json({
        error: "Failed to get sessions"
      });
    }
  });
  app2.delete("/api/user/sessions/:id", requireAuth2, async (req, res) => {
    try {
      const userId = req.user.id;
      const sessionId = req.params.id;
      const [session3] = await db.select().from(userSessions).where(and7(
        eq10(userSessions.id, sessionId),
        eq10(userSessions.userId, userId)
      )).limit(1);
      if (!session3) {
        return res.status(404).json({
          error: "Session not found"
        });
      }
      await db.update(userSessions).set({
        isActive: false
      }).where(eq10(userSessions.id, sessionId));
      await db.insert(auditLogs).values({
        userId,
        action: "DELETE",
        resource: "user_session",
        resourceId: sessionId,
        description: "Terminated user session",
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"]
      });
      res.json({
        success: true,
        message: "Session terminated successfully"
      });
    } catch (error) {
      console.error("Terminate session error:", error);
      res.status(500).json({
        error: "Failed to terminate session"
      });
    }
  });
  app2.get("/api/user/activity", requireAuth2, async (req, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 20;
      const activities = await db.select().from(auditLogs).where(eq10(auditLogs.userId, userId)).orderBy(desc5(auditLogs.timestamp)).limit(Math.min(limit, 100));
      res.json(activities);
    } catch (error) {
      console.error("Get activity error:", error);
      res.status(500).json({
        error: "Failed to get activity"
      });
    }
  });
  app2.post("/api/user/avatar", requireAuth2, async (req, res) => {
    try {
      res.status(501).json({
        error: "Avatar upload not yet implemented",
        message: "This feature will be available soon"
      });
    } catch (error) {
      console.error("Upload avatar error:", error);
      res.status(500).json({
        error: "Failed to upload avatar"
      });
    }
  });
  app2.delete("/api/user/avatar", requireAuth2, async (req, res) => {
    try {
      const userId = req.user.id;
      await db.update(users).set({
        profileImageUrl: null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq10(users.id, userId));
      await db.insert(auditLogs).values({
        userId,
        action: "DELETE",
        resource: "user_avatar",
        resourceId: userId,
        description: "Removed profile avatar",
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"]
      });
      res.json({
        success: true,
        message: "Avatar removed successfully"
      });
    } catch (error) {
      console.error("Remove avatar error:", error);
      res.status(500).json({
        error: "Failed to remove avatar"
      });
    }
  });
}
var updateProfileSchema, updatePreferencesSchema;
var init_userProfileRoutes = __esm({
  "server/userProfileRoutes.ts"() {
    "use strict";
    init_rbacService();
    init_db();
    init_schema();
    updateProfileSchema = z6.object({
      firstName: z6.string().min(2, "First name must be at least 2 characters").optional(),
      lastName: z6.string().min(2, "Last name must be at least 2 characters").optional(),
      email: z6.string().email("Invalid email address").optional(),
      phone: z6.string().min(10, "Phone number must be at least 10 digits").optional(),
      department: z6.string().optional(),
      jobTitle: z6.string().optional(),
      notes: z6.string().optional()
    });
    updatePreferencesSchema = z6.object({
      emailNotifications: z6.boolean().optional(),
      smsNotifications: z6.boolean().optional(),
      inAppNotifications: z6.boolean().optional(),
      dashboardView: z6.string().optional(),
      timezone: z6.string().optional(),
      language: z6.string().optional()
    });
  }
});

// server/objectAcl.ts
function isPermissionAllowed(requested, granted) {
  if (requested === "read" /* READ */) {
    return ["read" /* READ */, "write" /* WRITE */].includes(granted);
  }
  return granted === "write" /* WRITE */;
}
function createObjectAccessGroup(group) {
  switch (group.type) {
    // Implement the case for each type of access group to instantiate.
    //
    // For example:
    // case "USER_LIST":
    //   return new UserListAccessGroup(group.id);
    // case "EMAIL_DOMAIN":
    //   return new EmailDomainAccessGroup(group.id);
    // case "GROUP_MEMBER":
    //   return new GroupMemberAccessGroup(group.id);
    // case "SUBSCRIBER":
    //   return new SubscriberAccessGroup(group.id);
    default:
      throw new Error(`Unknown access group type: ${group.type}`);
  }
}
async function setObjectAclPolicy(objectFile, aclPolicy) {
  const [exists] = await objectFile.exists();
  if (!exists) {
    throw new Error(`Object not found: ${objectFile.name}`);
  }
  await objectFile.setMetadata({
    metadata: {
      [ACL_POLICY_METADATA_KEY]: JSON.stringify(aclPolicy)
    }
  });
}
async function getObjectAclPolicy(objectFile) {
  const [metadata] = await objectFile.getMetadata();
  const aclPolicy = metadata?.metadata?.[ACL_POLICY_METADATA_KEY];
  if (!aclPolicy) {
    return null;
  }
  return JSON.parse(aclPolicy);
}
async function canAccessObject({
  userId,
  objectFile,
  requestedPermission
}) {
  const aclPolicy = await getObjectAclPolicy(objectFile);
  if (!aclPolicy) {
    return false;
  }
  if (aclPolicy.visibility === "public" && requestedPermission === "read" /* READ */) {
    return true;
  }
  if (!userId) {
    return false;
  }
  if (aclPolicy.owner === userId) {
    return true;
  }
  for (const rule of aclPolicy.aclRules || []) {
    const accessGroup = createObjectAccessGroup(rule.group);
    if (await accessGroup.hasMember(userId) && isPermissionAllowed(requestedPermission, rule.permission)) {
      return true;
    }
  }
  return false;
}
var ACL_POLICY_METADATA_KEY;
var init_objectAcl = __esm({
  "server/objectAcl.ts"() {
    "use strict";
    ACL_POLICY_METADATA_KEY = "custom:aclPolicy";
  }
});

// server/objectStorage.ts
var objectStorage_exports = {};
__export(objectStorage_exports, {
  ObjectNotFoundError: () => ObjectNotFoundError,
  ObjectStorageService: () => ObjectStorageService,
  getObjectStorageClient: () => getObjectStorageClient,
  parseObjectPath: () => parseObjectPath,
  signObjectURL: () => signObjectURL
});
import { Storage } from "@google-cloud/storage";
import { randomUUID as randomUUID2 } from "crypto";
function getObjectStorageClient() {
  if (!objectStorageClient) {
    objectStorageClient = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  }
  return objectStorageClient;
}
function parseObjectPath(path3) {
  if (!path3.startsWith("/")) {
    path3 = `/${path3}`;
  }
  const pathParts = path3.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }
  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");
  return {
    bucketName,
    objectName
  };
}
async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec
}) {
  try {
    const storage2 = getObjectStorageClient();
    const bucket = storage2.bucket(bucketName);
    const file = bucket.file(objectName);
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: method.toLowerCase(),
      expires: Date.now() + ttlSec * 1e3
    });
    return signedUrl;
  } catch (error) {
    throw new Error(
      `Failed to sign object URL: ${error instanceof Error ? error.message : "Unknown error"}. Make sure Google Cloud Storage is properly configured.`
    );
  }
}
var objectStorageClient, ObjectNotFoundError, ObjectStorageService;
var init_objectStorage = __esm({
  "server/objectStorage.ts"() {
    "use strict";
    init_objectAcl();
    objectStorageClient = null;
    ObjectNotFoundError = class _ObjectNotFoundError extends Error {
      constructor() {
        super("Object not found");
        this.name = "ObjectNotFoundError";
        Object.setPrototypeOf(this, _ObjectNotFoundError.prototype);
      }
    };
    ObjectStorageService = class {
      constructor() {
      }
      // Gets the public object search paths.
      getPublicObjectSearchPaths() {
        const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
        const paths = Array.from(
          new Set(
            pathsStr.split(",").map((path3) => path3.trim()).filter((path3) => path3.length > 0)
          )
        );
        if (paths.length === 0) {
          console.warn(
            "PUBLIC_OBJECT_SEARCH_PATHS not set. Object storage features will be disabled. Create a bucket in 'Object Storage' tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
          );
          return [];
        }
        return paths;
      }
      // Gets the private object directory.
      getPrivateObjectDir() {
        const dir = process.env.PRIVATE_OBJECT_DIR || "";
        if (!dir) {
          console.warn(
            "PRIVATE_OBJECT_DIR not set. Object storage upload features will be disabled. Create a bucket in 'Object Storage' tool and set PRIVATE_OBJECT_DIR env var."
          );
          return null;
        }
        return dir;
      }
      // Search for a public object from the search paths.
      async searchPublicObject(filePath) {
        const searchPaths = this.getPublicObjectSearchPaths();
        if (searchPaths.length === 0) {
          return null;
        }
        for (const searchPath of searchPaths) {
          const fullPath = `${searchPath}/${filePath}`;
          const { bucketName, objectName } = parseObjectPath(fullPath);
          const bucket = getObjectStorageClient().bucket(bucketName);
          const file = bucket.file(objectName);
          const [exists] = await file.exists();
          if (exists) {
            return file;
          }
        }
        return null;
      }
      // Downloads an object to the response.
      async downloadObject(file, res, cacheTtlSec = 3600) {
        try {
          const [metadata] = await file.getMetadata();
          const aclPolicy = await getObjectAclPolicy(file);
          const isPublic = aclPolicy?.visibility === "public";
          res.set({
            "Content-Type": metadata.contentType || "application/octet-stream",
            "Content-Length": metadata.size,
            "Cache-Control": `${isPublic ? "public" : "private"}, max-age=${cacheTtlSec}`
          });
          const stream = file.createReadStream();
          stream.on("error", (err) => {
            console.error("Stream error:", err);
            if (!res.headersSent) {
              res.status(500).json({ error: "Error streaming file" });
            }
          });
          stream.pipe(res);
        } catch (error) {
          console.error("Error downloading file:", error);
          if (!res.headersSent) {
            res.status(500).json({ error: "Error downloading file" });
          }
        }
      }
      // Gets the upload URL for an object entity.
      async getObjectEntityUploadURL() {
        const privateObjectDir = this.getPrivateObjectDir();
        if (!privateObjectDir) {
          throw new Error(
            "Object storage upload is not configured. PRIVATE_OBJECT_DIR environment variable is missing."
          );
        }
        const objectId = randomUUID2();
        const fullPath = `${privateObjectDir}/uploads/${objectId}`;
        const { bucketName, objectName } = parseObjectPath(fullPath);
        return signObjectURL({
          bucketName,
          objectName,
          method: "PUT",
          ttlSec: 900
        });
      }
      // Gets the object entity file from the object path.
      async getObjectEntityFile(objectPath) {
        if (!objectPath.startsWith("/objects/")) {
          throw new ObjectNotFoundError();
        }
        const parts = objectPath.slice(1).split("/");
        if (parts.length < 2) {
          throw new ObjectNotFoundError();
        }
        const entityId = parts.slice(1).join("/");
        let entityDir = this.getPrivateObjectDir();
        if (!entityDir) {
          throw new Error("Object storage is not configured. PRIVATE_OBJECT_DIR environment variable is missing.");
        }
        if (!entityDir.endsWith("/")) {
          entityDir = `${entityDir}/`;
        }
        const objectEntityPath = `${entityDir}${entityId}`;
        const { bucketName, objectName } = parseObjectPath(objectEntityPath);
        const bucket = getObjectStorageClient().bucket(bucketName);
        const objectFile = bucket.file(objectName);
        const [exists] = await objectFile.exists();
        if (!exists) {
          throw new ObjectNotFoundError();
        }
        return objectFile;
      }
      normalizeObjectEntityPath(rawPath) {
        if (!rawPath.startsWith("https://storage.googleapis.com/")) {
          return rawPath;
        }
        const url = new URL(rawPath);
        const rawObjectPath = url.pathname;
        let objectEntityDir = this.getPrivateObjectDir();
        if (!objectEntityDir) {
          return rawObjectPath;
        }
        if (!objectEntityDir.endsWith("/")) {
          objectEntityDir = `${objectEntityDir}/`;
        }
        if (!rawObjectPath.startsWith(objectEntityDir)) {
          return rawObjectPath;
        }
        const entityId = rawObjectPath.slice(objectEntityDir.length);
        return `/objects/${entityId}`;
      }
      // Tries to set the ACL policy for the object entity and return the normalized path.
      async trySetObjectEntityAclPolicy(rawPath, aclPolicy) {
        const normalizedPath = this.normalizeObjectEntityPath(rawPath);
        if (!normalizedPath.startsWith("/")) {
          return normalizedPath;
        }
        const objectFile = await this.getObjectEntityFile(normalizedPath);
        await setObjectAclPolicy(objectFile, aclPolicy);
        return normalizedPath;
      }
      // Checks if the user can access the object entity.
      async canAccessObjectEntity({
        userId,
        objectFile,
        requestedPermission
      }) {
        return canAccessObject({
          userId,
          objectFile,
          requestedPermission: requestedPermission ?? "read" /* READ */
        });
      }
    };
  }
});

// server/publicRoutes.ts
var publicRoutes_exports = {};
__export(publicRoutes_exports, {
  registerPublicRoutes: () => registerPublicRoutes
});
import { z as z7 } from "zod";
import { eq as eq11, sql as sql7 } from "drizzle-orm";
import crypto4 from "crypto";
function generateVerificationToken2() {
  return crypto4.randomBytes(32).toString("hex");
}
function registerPublicRoutes(app2) {
  app2.post("/api/applicants/register", async (req, res) => {
    try {
      const registrationData = individualRegistrationSchema.parse(req.body);
      const existingApplicant = await db.select().from(applicants).where(eq11(applicants.email, registrationData.email)).limit(1);
      if (existingApplicant.length > 0) {
        return res.status(409).json({
          error: "Email already registered",
          message: "An applicant with this email address already exists."
        });
      }
      const applicantId = await nextApplicationId("individual");
      const verificationToken = generateVerificationToken2();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1e3);
      const [newApplicant] = await db.insert(applicants).values({
        applicantId,
        firstName: registrationData.firstName,
        surname: registrationData.surname,
        email: registrationData.email,
        status: "registered",
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }).returning();
      const sendEmailsWithTimeout = async () => {
        const fullName = `${registrationData.firstName} ${registrationData.surname}`;
        const welcomeEmail = generateWelcomeEmail(fullName, applicantId);
        await sendEmail({
          to: registrationData.email,
          from: "sysadmin@estateagentscouncil.org",
          ...welcomeEmail
        });
        const baseUrl = process.env.NODE_ENV === "production" ? "https://mms.estateagentscouncil.org" : "http://localhost:5000";
        const verificationEmail = generateVerificationEmail(fullName, verificationToken, baseUrl);
        await sendEmail({
          to: registrationData.email,
          from: "sysadmin@estateagentscouncil.org",
          ...verificationEmail
        });
        console.log(`Welcome and verification emails sent to: ${registrationData.email}`);
      };
      await Promise.race([
        sendEmailsWithTimeout(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Email sending timeout")), 5e3))
      ]).catch((emailError) => {
        console.error("Failed to send welcome/verification emails:", emailError);
      });
      res.status(201).json({
        success: true,
        applicantId,
        message: "Registration successful! Please check your email for your Applicant ID and verification instructions."
      });
    } catch (error) {
      console.error("Individual registration error:", error);
      if (error instanceof z7.ZodError) {
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
  app2.post("/api/organization-applicants/register", async (req, res) => {
    try {
      const registrationData = organizationRegistrationSchema.parse(req.body);
      const existingApplicant = await db.select().from(organizationApplicants).where(eq11(organizationApplicants.email, registrationData.email)).limit(1);
      if (existingApplicant.length > 0) {
        return res.status(409).json({
          error: "Email already registered",
          message: "An organization applicant with this email address already exists."
        });
      }
      const existingCompanyInApplicants = await db.select().from(organizationApplicants).where(sql7`LOWER(${organizationApplicants.companyName}) = LOWER(${registrationData.companyName})`).limit(1);
      if (existingCompanyInApplicants.length > 0) {
        return res.status(409).json({
          error: "Company already registered",
          message: "An organization with this company name has already been registered. Please contact support if you believe this is an error."
        });
      }
      const existingCompanyInOrgs = await db.select().from(organizations).where(sql7`LOWER(${organizations.name}) = LOWER(${registrationData.companyName})`).limit(1);
      if (existingCompanyInOrgs.length > 0) {
        return res.status(409).json({
          error: "Company already exists",
          message: "An organization with this company name already exists in our system. Please contact support if you believe this is an error."
        });
      }
      const applicantId = await nextApplicationId("organization");
      const verificationToken = generateVerificationToken2();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1e3);
      const [newApplicant] = await db.insert(organizationApplicants).values({
        applicantId,
        companyName: registrationData.companyName,
        email: registrationData.email,
        status: "registered",
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }).returning();
      const sendEmailWithTimeout = async () => {
        const verificationEmail = generateOrgApplicantVerificationEmail(
          registrationData.companyName,
          verificationToken
        );
        await sendEmail({
          to: registrationData.email,
          from: "sysadmin@estateagentscouncil.org",
          ...verificationEmail
        });
        console.log(`Organization verification email sent to: ${registrationData.email}`);
      };
      await Promise.race([
        sendEmailWithTimeout(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Email sending timeout")), 5e3))
      ]).catch((emailError) => {
        console.error("Failed to send organization verification email:", emailError);
      });
      res.status(201).json({
        success: true,
        applicantId,
        message: "Registration successful! Please check your email for verification instructions."
      });
    } catch (error) {
      console.error("Organization registration error:", error);
      if (error instanceof z7.ZodError) {
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
  app2.post("/api/applicants/verify-email", async (req, res) => {
    try {
      const { token, applicantId } = req.body;
      if (!token) {
        return res.status(400).json({
          error: "Verification token is required"
        });
      }
      const [individualApplicant] = await db.select().from(applicants).where(eq11(applicants.emailVerificationToken, token)).limit(1);
      if (individualApplicant) {
        if (individualApplicant.emailVerificationExpires && /* @__PURE__ */ new Date() > individualApplicant.emailVerificationExpires) {
          return res.status(400).json({
            error: "Verification token has expired",
            message: "Please request a new verification email."
          });
        }
        await db.update(applicants).set({
          emailVerified: true,
          status: "email_verified",
          emailVerificationToken: null,
          emailVerificationExpires: null,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq11(applicants.id, individualApplicant.id));
        return res.json({
          success: true,
          applicantId: individualApplicant.applicantId,
          applicantType: "individual",
          message: "Email verified successfully! You can now continue with your application."
        });
      }
      const [orgApplicant] = await db.select().from(organizationApplicants).where(eq11(organizationApplicants.emailVerificationToken, token)).limit(1);
      if (orgApplicant) {
        if (orgApplicant.emailVerificationExpires && /* @__PURE__ */ new Date() > orgApplicant.emailVerificationExpires) {
          return res.status(400).json({
            error: "Verification token has expired",
            message: "Please request a new verification email."
          });
        }
        await db.update(organizationApplicants).set({
          emailVerified: true,
          status: "email_verified",
          emailVerificationToken: null,
          emailVerificationExpires: null,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq11(organizationApplicants.id, orgApplicant.id));
        return res.json({
          success: true,
          applicantId: orgApplicant.applicantId,
          applicantType: "organization",
          message: "Email verified successfully! You can now continue with your application."
        });
      }
      return res.status(404).json({
        error: "Invalid verification token",
        message: "The verification token is invalid or has already been used."
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({
        error: "Verification failed",
        message: "An error occurred during email verification. Please try again."
      });
    }
  });
  app2.post("/api/applicants/resend-emails", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          error: "Email is required"
        });
      }
      const [individualApplicant] = await db.select().from(applicants).where(eq11(applicants.email, email)).limit(1);
      if (individualApplicant) {
        const verificationToken = generateVerificationToken2();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1e3);
        await db.update(applicants).set({
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpires,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq11(applicants.id, individualApplicant.id));
        const fullName = `${individualApplicant.firstName} ${individualApplicant.surname}`;
        const welcomeEmail = generateWelcomeEmail(fullName, individualApplicant.applicantId);
        await Promise.race([
          (async () => {
            await sendEmail({
              to: email,
              from: "sysadmin@estateagentscouncil.org",
              ...welcomeEmail
            });
            const baseUrl = process.env.NODE_ENV === "production" ? "https://mms.estateagentscouncil.org" : "http://localhost:5000";
            const verificationEmail = generateVerificationEmail(fullName, verificationToken, baseUrl);
            await sendEmail({
              to: email,
              from: "sysadmin@estateagentscouncil.org",
              ...verificationEmail
            });
          })(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Email sending timeout")), 5e3))
        ]).catch((emailError) => {
          console.error("Failed to resend emails:", emailError);
        });
        return res.json({
          success: true,
          message: "Welcome and verification emails have been resent. Please check your inbox."
        });
      }
      const [orgApplicant] = await db.select().from(organizationApplicants).where(eq11(organizationApplicants.email, email)).limit(1);
      if (orgApplicant) {
        const verificationToken = generateVerificationToken2();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1e3);
        await db.update(organizationApplicants).set({
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpires,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq11(organizationApplicants.id, orgApplicant.id));
        await Promise.race([
          (async () => {
            const verificationEmail = generateOrgApplicantVerificationEmail(
              orgApplicant.companyName,
              verificationToken
            );
            await sendEmail({
              to: email,
              from: "sysadmin@estateagentscouncil.org",
              ...verificationEmail
            });
          })(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Email sending timeout")), 5e3))
        ]).catch((emailError) => {
          console.error("Failed to resend emails:", emailError);
        });
        return res.json({
          success: true,
          message: "Verification email has been resent. Please check your inbox."
        });
      }
      return res.status(404).json({
        error: "Email not found",
        message: "No applicant found with this email address."
      });
    } catch (error) {
      console.error("Resend emails error:", error);
      res.status(500).json({
        error: "Failed to resend emails",
        message: "An error occurred while resending emails. Please try again."
      });
    }
  });
  app2.post("/api/applicants/login", async (req, res) => {
    try {
      const { email, applicantId } = req.body;
      if (!email || !applicantId) {
        return res.status(400).json({
          error: "Email and Applicant ID are required"
        });
      }
      const [individualApplicant] = await db.select().from(applicants).where(eq11(applicants.email, email)).limit(1);
      if (individualApplicant && individualApplicant.applicantId === applicantId) {
        if (!individualApplicant.emailVerified) {
          return res.status(401).json({
            error: "Email not verified",
            message: "Please verify your email address before logging in."
          });
        }
        return res.json({
          success: true,
          applicant: individualApplicant,
          applicantType: "individual",
          message: "Login successful"
        });
      }
      const [orgApplicant] = await db.select().from(organizationApplicants).where(eq11(organizationApplicants.email, email)).limit(1);
      if (orgApplicant && orgApplicant.applicantId === applicantId) {
        if (!orgApplicant.emailVerified) {
          return res.status(401).json({
            error: "Email not verified",
            message: "Please verify your email address before logging in."
          });
        }
        return res.json({
          success: true,
          applicant: orgApplicant,
          applicantType: "organization",
          message: "Login successful"
        });
      }
      return res.status(401).json({
        error: "Invalid credentials",
        message: "The email and Applicant ID combination is incorrect."
      });
    } catch (error) {
      console.error("Applicant login error:", error);
      res.status(500).json({
        error: "Login failed",
        message: "An error occurred during login. Please try again."
      });
    }
  });
  app2.get("/api/public/verify/:membershipNumber", async (req, res) => {
    try {
      const { membershipNumber } = req.params;
      if (!membershipNumber) {
        return res.status(400).json({ error: "Membership number is required" });
      }
      const member = await storage.getMemberByMembershipNumber(membershipNumber);
      if (member) {
        return res.json({
          type: "member",
          membershipNumber: member.membershipNumber,
          firstName: member.firstName,
          lastName: member.lastName,
          memberType: member.memberType,
          status: member.membershipStatus,
          // Use 'status' for consistency with frontend
          createdAt: member.createdAt,
          expiryDate: member.expiryDate
        });
      }
      const organization = await storage.getOrganizationByRegistrationNumber(membershipNumber);
      if (organization) {
        return res.json({
          type: "organization",
          membershipNumber: organization.registrationNumber,
          name: organization.name,
          organizationType: organization.businessType,
          status: organization.status,
          // Use 'status' for consistency with frontend
          createdAt: organization.createdAt,
          expiryDate: organization.expiryDate
        });
      }
      return res.status(404).json({ error: "Registration not found" });
    } catch (error) {
      console.error("Public verification error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/public/verify", async (req, res) => {
    const membershipNumber = req.query.member;
    if (membershipNumber) {
      return res.redirect(307, `/api/public/verify/${encodeURIComponent(membershipNumber)}`);
    }
    return res.status(400).json({ error: "Membership number is required" });
  });
  app2.get("/api/public/members", async (req, res) => {
    try {
      const members3 = await storage.getAllMembers();
      const publicMembers = members3.filter((member) => member.membershipStatus === "active").map((member) => ({
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
  app2.get("/api/public/organizations", async (req, res) => {
    try {
      const organizations4 = await storage.getAllOrganizations();
      const publicOrganizations = organizations4.filter((org) => org.status === "active").map((org) => ({
        id: org.id,
        name: org.name,
        registrationNumber: org.registrationNumber,
        membershipStatus: org.status
      }));
      res.json(publicOrganizations);
    } catch (error) {
      console.error("Public organizations directory error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/public/applications/:applicationId", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const application = await storage.getApplicationById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Application tracking error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/cases/track", async (req, res) => {
    try {
      const { caseNumber, email } = req.query;
      if (!caseNumber && !email) {
        return res.status(400).json({ error: "Case number or email is required" });
      }
      let caseData;
      if (caseNumber) {
        caseData = await storage.getCaseByCaseNumber(caseNumber);
      } else if (email) {
        const cases2 = await storage.getCasesByEmail(email);
        caseData = cases2[0];
      }
      if (!caseData) {
        return res.status(404).json({ error: "Case not found" });
      }
      res.json(caseData);
    } catch (error) {
      console.error("Case tracking error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  const caseReportSchema = z7.object({
    reporterName: z7.string().min(2),
    reporterEmail: z7.string().email(),
    reporterPhone: z7.string().optional(),
    caseType: z7.enum(["complaint", "violation", "malpractice", "misconduct", "fraud", "breach_of_duty"]),
    respondentType: z7.enum(["individual", "firm"]),
    respondentName: z7.string().min(2),
    respondentLicense: z7.string().optional(),
    incidentDate: z7.string().optional(),
    incidentLocation: z7.string().optional(),
    description: z7.string().min(50),
    evidence: z7.string().optional(),
    witnesses: z7.string().optional(),
    previousAction: z7.string().optional(),
    expectedOutcome: z7.string().optional()
  });
  app2.post("/api/cases/report", async (req, res) => {
    try {
      const caseData = caseReportSchema.parse(req.body);
      const newCase = await storage.createCase({
        title: `${caseData.caseType.toUpperCase()}: ${caseData.respondentName}`,
        description: caseData.description,
        type: caseData.caseType,
        priority: "medium",
        status: "open",
        submittedBy: caseData.reporterName,
        submittedByEmail: caseData.reporterEmail
      });
      const emailData = {
        reporterName: caseData.reporterName,
        caseNumber: newCase.caseNumber,
        caseType: caseData.caseType,
        respondentName: caseData.respondentName
      };
      await Promise.race([
        sendEmail({
          to: caseData.reporterEmail,
          from: "sysadmin@estateagentscouncil.org",
          subject: `Case Report Received - ${newCase.caseNumber}`,
          html: `
            <h2>Case Report Received</h2>
            <p>Dear ${emailData.reporterName},</p>
            <p>Thank you for submitting your case to the Estate Agents Council of Zimbabwe.</p>
            <p><strong>Case Number:</strong> ${emailData.caseNumber}</p>
            <p><strong>Case Type:</strong> ${emailData.caseType}</p>
            <p><strong>Respondent:</strong> ${emailData.respondentName}</p>
            <p>Your case will be reviewed within 5 business days. We may contact you for additional information.</p>
            <p>You can track your case status using the case number above at: https://mms.estateagentscouncil.org/cases/track</p>
            <br>
            <p>Best regards,<br>Estate Agents Council of Zimbabwe</p>
          `
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Email timeout")), 5e3))
      ]).catch((err) => {
        console.error("Failed to send case notification email:", err);
      });
      res.status(201).json({
        success: true,
        caseNumber: newCase.caseNumber,
        message: "Case reported successfully. A confirmation email has been sent."
      });
    } catch (error) {
      console.error("Case reporting error:", error);
      if (error instanceof z7.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors
        });
      }
      return res.status(500).json({ error: "Failed to report case" });
    }
  });
}
var individualRegistrationSchema, organizationRegistrationSchema;
var init_publicRoutes = __esm({
  "server/publicRoutes.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_storage();
    init_namingSeries();
    init_emailService();
    individualRegistrationSchema = z7.object({
      firstName: z7.string().min(2, "First name must be at least 2 characters"),
      surname: z7.string().min(2, "Surname must be at least 2 characters"),
      email: z7.string().email("Invalid email address")
    });
    organizationRegistrationSchema = z7.object({
      companyName: z7.string().min(2, "Company name must be at least 2 characters"),
      email: z7.string().email("Invalid email address")
    });
  }
});

// server/organizationPortalRoutes.ts
var organizationPortalRoutes_exports = {};
__export(organizationPortalRoutes_exports, {
  setupOrganizationPortalRoutes: () => setupOrganizationPortalRoutes
});
function setupOrganizationPortalRoutes(app2) {
  app2.get("/api/organization-portal/:organizationId", requireAuth, async (req, res) => {
    try {
      const { organizationId } = req.params;
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const orgDetails = await storage.getOrganizationWithDetails(organizationId);
      if (!orgDetails) {
        return res.status(404).json({ message: "Organization not found" });
      }
      const isMemberOfOrg = orgDetails.members.some((m) => m.email === user.email);
      const isPREA = orgDetails.preaMember?.email === user.email;
      if (!isMemberOfOrg && !isPREA && !["admin", "super_admin", "staff"].includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json({
        ...orgDetails,
        isPREA,
        canManage: isPREA || ["admin", "super_admin", "staff"].includes(user.role)
      });
    } catch (error) {
      console.error("Get organization details error:", error);
      res.status(500).json({ message: error.message || "Failed to fetch organization details" });
    }
  });
  app2.get("/api/organization-portal/member/:email", requireAuth, async (req, res) => {
    try {
      const { email } = req.params;
      const user = req.user;
      if (user.email !== email && !["admin", "super_admin", "staff"].includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      const member = await storage.getMemberByEmail(email);
      if (!member || !member.organizationId) {
        return res.status(404).json({ message: "No organization found for this member" });
      }
      const orgDetails = await storage.getOrganizationWithDetails(member.organizationId);
      if (!orgDetails) {
        return res.status(404).json({ message: "Organization not found" });
      }
      const isPREA = orgDetails.preaMember?.email === email;
      res.json({
        ...orgDetails,
        isPREA,
        canManage: isPREA || ["admin", "super_admin", "staff"].includes(user.role)
      });
    } catch (error) {
      console.error("Get organization by member error:", error);
      res.status(500).json({ message: error.message || "Failed to fetch organization" });
    }
  });
  app2.post("/api/organization-portal/:organizationId/directors", requireAuth, async (req, res) => {
    try {
      const { organizationId } = req.params;
      const directorData = req.body;
      const user = req.user;
      const org = await storage.getOrganization(organizationId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }
      const preaMember = org.preaMemberId ? await storage.getMember(org.preaMemberId) : null;
      const isPREA = preaMember?.email === user.email;
      const isAdmin = ["admin", "super_admin", "staff"].includes(user.role);
      if (!isPREA && !isAdmin) {
        return res.status(403).json({ message: "Only PREA or admin can add directors" });
      }
      const director = await storage.createDirector({
        ...directorData,
        organizationId
      });
      res.json(director);
    } catch (error) {
      console.error("Add director error:", error);
      res.status(500).json({ message: error.message || "Failed to add director" });
    }
  });
  app2.put("/api/organization-portal/:organizationId/directors/:directorId", requireAuth, async (req, res) => {
    try {
      const { organizationId, directorId } = req.params;
      const updates = req.body;
      const user = req.user;
      const org = await storage.getOrganization(organizationId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }
      const preaMember = org.preaMemberId ? await storage.getMember(org.preaMemberId) : null;
      const isPREA = preaMember?.email === user.email;
      const isAdmin = ["admin", "super_admin", "staff"].includes(user.role);
      if (!isPREA && !isAdmin) {
        return res.status(403).json({ message: "Only PREA or admin can update directors" });
      }
      const director = await storage.updateDirector(directorId, updates);
      res.json(director);
    } catch (error) {
      console.error("Update director error:", error);
      res.status(500).json({ message: error.message || "Failed to update director" });
    }
  });
  app2.delete("/api/organization-portal/:organizationId/directors/:directorId", requireAuth, async (req, res) => {
    try {
      const { organizationId, directorId } = req.params;
      const user = req.user;
      const org = await storage.getOrganization(organizationId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }
      const preaMember = org.preaMemberId ? await storage.getMember(org.preaMemberId) : null;
      const isPREA = preaMember?.email === user.email;
      const isAdmin = ["admin", "super_admin", "staff"].includes(user.role);
      if (!isPREA && !isAdmin) {
        return res.status(403).json({ message: "Only PREA or admin can delete directors" });
      }
      await storage.deleteDirector(directorId);
      res.json({ message: "Director deleted successfully" });
    } catch (error) {
      console.error("Delete director error:", error);
      res.status(500).json({ message: error.message || "Failed to delete director" });
    }
  });
  app2.put("/api/organization-portal/:organizationId/prea", requireAuth, async (req, res) => {
    try {
      const { organizationId } = req.params;
      const { memberId } = req.body;
      const user = req.user;
      const isAdmin = ["admin", "super_admin", "staff"].includes(user.role);
      if (!isAdmin) {
        return res.status(403).json({ message: "Only admin can designate PREA" });
      }
      const member = await storage.getMember(memberId);
      if (!member || member.organizationId !== organizationId) {
        return res.status(400).json({ message: "Member not found or doesn't belong to this organization" });
      }
      if (member.memberType !== "principal_real_estate_agent") {
        return res.status(400).json({ message: "Member must be a Principal Real Estate Agent" });
      }
      const org = await storage.updateOrganizationPREA(organizationId, memberId);
      res.json(org);
    } catch (error) {
      console.error("Update PREA error:", error);
      res.status(500).json({ message: error.message || "Failed to update PREA" });
    }
  });
  app2.get("/api/organization-portal/:organizationId/members", requireAuth, async (req, res) => {
    try {
      const { organizationId } = req.params;
      const user = req.user;
      const org = await storage.getOrganization(organizationId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }
      const members3 = await storage.getMembersByOrganization(organizationId);
      const isMemberOfOrg = members3.some((m) => m.email === user.email);
      const preaMember = org.preaMemberId ? await storage.getMember(org.preaMemberId) : null;
      const isPREA = preaMember?.email === user.email;
      const isAdmin = ["admin", "super_admin", "staff"].includes(user.role);
      if (!isMemberOfOrg && !isPREA && !isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(members3);
    } catch (error) {
      console.error("Get organization members error:", error);
      res.status(500).json({ message: error.message || "Failed to fetch members" });
    }
  });
}
var init_organizationPortalRoutes = __esm({
  "server/organizationPortalRoutes.ts"() {
    "use strict";
    init_storage();
    init_clerkAuth();
  }
});

// server/services/idMigration.ts
var idMigration_exports = {};
__export(idMigration_exports, {
  executeIdFormatMigration: () => executeIdFormatMigration,
  getMigrationStatus: () => getMigrationStatus,
  previewIdFormatMigration: () => previewIdFormatMigration
});
import { sql as sql8 } from "drizzle-orm";
function getEnrollmentYear(joiningDate, createdAt) {
  if (joiningDate) {
    return joiningDate.getFullYear();
  }
  if (createdAt) {
    return createdAt.getFullYear();
  }
  return (/* @__PURE__ */ new Date()).getFullYear();
}
function isNewFormat(id) {
  if (!id) return false;
  const newFormatRegex = /^EAC-(MBR|ORG)-\d{4}-\d{4}$/;
  return newFormatRegex.test(id);
}
async function isMigrationCompleted() {
  try {
    const result = await db.execute(sql8`
      SELECT value FROM system_settings 
      WHERE key = 'id_format_migration_2025_completed'
    `);
    return result.rows.length > 0 && result.rows[0]?.value === "true";
  } catch (error) {
    return false;
  }
}
async function markMigrationCompleted() {
  await db.execute(sql8`
    CREATE TABLE IF NOT EXISTS system_settings (
      key VARCHAR(255) PRIMARY KEY,
      value TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await db.execute(sql8`
    INSERT INTO system_settings (key, value) 
    VALUES ('id_format_migration_2025_completed', 'true')
    ON CONFLICT (key) 
    DO UPDATE SET value = 'true', created_at = NOW()
  `);
}
async function previewIdFormatMigration() {
  console.log("\u{1F50D} Running ID format migration preview...");
  const memberRecords = await db.execute(sql8`
    SELECT id, membership_number, joining_date, created_at 
    FROM members 
    ORDER BY created_at ASC
  `);
  const orgRecords = await db.execute(sql8`
    SELECT id, registration_number, registration_date, created_at 
    FROM organizations 
    ORDER BY created_at ASC
  `);
  const memberChanges = [];
  const memberCountersByYear = {};
  for (const memberRow of memberRecords.rows) {
    const member = memberRow;
    if (isNewFormat(member.membership_number)) {
      continue;
    }
    const year = getEnrollmentYear(member.joining_date, member.created_at);
    if (!memberCountersByYear[year]) {
      memberCountersByYear[year] = 1;
    } else {
      memberCountersByYear[year]++;
    }
    const newId = `EAC-MBR-${year}-${String(memberCountersByYear[year]).padStart(4, "0")}`;
    memberChanges.push({
      id: member.id,
      old: member.membership_number,
      new: newId,
      year
    });
  }
  const orgChanges = [];
  const orgCountersByYear = {};
  for (const orgRow of orgRecords.rows) {
    const org = orgRow;
    if (isNewFormat(org.registration_number)) {
      continue;
    }
    const year = getEnrollmentYear(org.registration_date, org.created_at);
    if (!orgCountersByYear[year]) {
      orgCountersByYear[year] = 1;
    } else {
      orgCountersByYear[year]++;
    }
    const newId = `EAC-ORG-${year}-${String(orgCountersByYear[year]).padStart(4, "0")}`;
    orgChanges.push({
      id: org.id,
      old: org.registration_number,
      new: newId,
      year
    });
  }
  return {
    members: memberChanges,
    organizations: orgChanges,
    summary: {
      totalMembers: memberChanges.length,
      totalOrganizations: orgChanges.length,
      membersByYear: memberCountersByYear,
      orgsByYear: orgCountersByYear
    }
  };
}
async function executeIdFormatMigration() {
  console.log("\u{1F680} Starting ID format migration execution...");
  if (await isMigrationCompleted()) {
    console.log("\u2705 Migration already completed - skipping");
    return {
      success: true,
      membersUpdated: 0,
      organizationsUpdated: 0
    };
  }
  try {
    const preview = await previewIdFormatMigration();
    console.log(`\u{1F4CA} Migration preview: ${preview.summary.totalMembers} members, ${preview.summary.totalOrganizations} organizations`);
    const result = await db.transaction(async (tx) => {
      let membersUpdated = 0;
      let organizationsUpdated = 0;
      for (const change of preview.members) {
        await tx.execute(sql8`
          UPDATE members 
          SET membership_number = ${change.new}
          WHERE id = ${change.id}
        `);
        membersUpdated++;
        console.log(`Updated member ${change.id}: ${change.old} \u2192 ${change.new}`);
      }
      for (const change of preview.organizations) {
        await tx.execute(sql8`
          UPDATE organizations 
          SET registration_number = ${change.new}
          WHERE id = ${change.id}
        `);
        organizationsUpdated++;
        console.log(`Updated organization ${change.id}: ${change.old} \u2192 ${change.new}`);
      }
      for (const [year, count2] of Object.entries(preview.summary.membersByYear)) {
        await tx.insert(namingSeriesCounters).values({
          seriesCode: "member_ind",
          year: parseInt(year),
          counter: count2
        }).onConflictDoUpdate({
          target: [namingSeriesCounters.seriesCode, namingSeriesCounters.year],
          set: {
            counter: sql8`GREATEST(${namingSeriesCounters.counter}, ${count2})`
          }
        });
      }
      for (const [year, count2] of Object.entries(preview.summary.orgsByYear)) {
        await tx.insert(namingSeriesCounters).values({
          seriesCode: "member_org",
          year: parseInt(year),
          counter: count2
        }).onConflictDoUpdate({
          target: [namingSeriesCounters.seriesCode, namingSeriesCounters.year],
          set: {
            counter: sql8`GREATEST(${namingSeriesCounters.counter}, ${count2})`
          }
        });
      }
      return { membersUpdated, organizationsUpdated };
    });
    await markMigrationCompleted();
    console.log(`\u2705 Migration completed successfully! Updated ${result.membersUpdated} members and ${result.organizationsUpdated} organizations`);
    return {
      success: true,
      membersUpdated: result.membersUpdated,
      organizationsUpdated: result.organizationsUpdated
    };
  } catch (error) {
    console.error("\u274C Migration failed:", error);
    return {
      success: false,
      membersUpdated: 0,
      organizationsUpdated: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
async function getMigrationStatus() {
  const completed = await isMigrationCompleted();
  const membersOldFormat = await db.execute(sql8`
    SELECT COUNT(*) as count FROM members 
    WHERE membership_number IS NOT NULL 
    AND NOT (membership_number ~ '^EAC-MBR-\\d{4}-\\d{4}$')
  `);
  const orgsOldFormat = await db.execute(sql8`
    SELECT COUNT(*) as count FROM organizations 
    WHERE registration_number IS NOT NULL 
    AND NOT (registration_number ~ '^EAC-ORG-\\d{4}-\\d{4}$')
  `);
  const oldMemberCount = parseInt(membersOldFormat.rows[0]?.count || "0");
  const oldOrgCount = parseInt(orgsOldFormat.rows[0]?.count || "0");
  return {
    completed,
    needsMigration: oldMemberCount > 0 || oldOrgCount > 0,
    recordsInOldFormat: {
      members: oldMemberCount,
      organizations: oldOrgCount
    }
  };
}
var init_idMigration = __esm({
  "server/services/idMigration.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/services/googlePayService.ts
var googlePayService_exports = {};
__export(googlePayService_exports, {
  getGooglePayConfig: () => getGooglePayConfig,
  processGooglePayPayment: () => processGooglePayPayment,
  refundGooglePayPayment: () => refundGooglePayPayment,
  verifyGooglePayToken: () => verifyGooglePayToken
});
import { eq as eq12 } from "drizzle-orm";
async function processGooglePayPayment(paymentRequest) {
  try {
    if (!paymentRequest.paymentToken || paymentRequest.paymentToken.length < 10) {
      return {
        success: false,
        status: "failed",
        message: "Invalid Google Pay payment token",
        error: "INVALID_TOKEN"
      };
    }
    const amountNum = parseFloat(paymentRequest.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return {
        success: false,
        status: "failed",
        message: "Invalid payment amount",
        error: "INVALID_AMOUNT"
      };
    }
    const transactionId = `GPAY-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const paymentNumber = `PAY-GPAY-${Date.now()}`;
    const paymentData = {
      paymentNumber,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency || "USD",
      paymentMethod: "google_pay",
      status: "completed",
      // In production, this might be "processing" initially
      purpose: paymentRequest.purpose,
      description: paymentRequest.description,
      transactionId,
      externalPaymentId: transactionId,
      gatewayResponse: JSON.stringify({
        paymentToken: paymentRequest.paymentToken.substring(0, 20) + "...",
        processedAt: (/* @__PURE__ */ new Date()).toISOString(),
        gateway: "google_pay",
        memberId: paymentRequest.memberId
      }),
      paymentDate: /* @__PURE__ */ new Date(),
      netAmount: paymentRequest.amount,
      paidBy: paymentRequest.memberId || "guest",
      relatedTo: paymentRequest.memberId,
      relatedType: "member"
    };
    const [payment] = await db.insert(payments).values(paymentData).returning();
    console.log(`Google Pay payment processed: ${transactionId}`);
    return {
      success: true,
      paymentId: payment.id,
      transactionId,
      status: "completed",
      message: "Payment processed successfully via Google Pay"
    };
  } catch (error) {
    console.error("Google Pay payment error:", error);
    return {
      success: false,
      status: "failed",
      message: "Payment processing failed",
      error: error.message
    };
  }
}
async function verifyGooglePayToken(token) {
  try {
    if (!token || token.length < 10) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Google Pay token verification error:", error);
    return false;
  }
}
function getGooglePayConfig() {
  return {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["MASTERCARD", "VISA", "AMEX"]
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "stripe",
            // or your payment gateway
            gatewayMerchantId: process.env.GOOGLE_PAY_MERCHANT_ID || "merchant_id"
          }
        }
      }
    ],
    merchantInfo: {
      merchantName: "Estate Agents Council of Zimbabwe",
      merchantId: process.env.GOOGLE_PAY_MERCHANT_ID || "merchant_id"
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPrice: "0.00",
      currencyCode: "USD",
      countryCode: "ZW"
    }
  };
}
async function refundGooglePayPayment(paymentId, amount, reason) {
  try {
    const [payment] = await db.select().from(payments).where(eq12(payments.id, paymentId)).limit(1);
    if (!payment) {
      return {
        success: false,
        status: "failed",
        message: "Payment not found",
        error: "PAYMENT_NOT_FOUND"
      };
    }
    if (payment.paymentMethod !== "google_pay") {
      return {
        success: false,
        status: "failed",
        message: "Payment was not made via Google Pay",
        error: "INVALID_PAYMENT_METHOD"
      };
    }
    const refundTransactionId = `GPAY-REFUND-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    await db.update(payments).set({
      status: "refunded",
      refundAmount: amount,
      refundReason: reason,
      refundedAt: /* @__PURE__ */ new Date(),
      gatewayResponse: JSON.stringify({
        ...JSON.parse(payment.gatewayResponse || "{}"),
        refundedAt: (/* @__PURE__ */ new Date()).toISOString(),
        refundReason: reason,
        refundTransactionId
      })
    }).where(eq12(payments.id, paymentId));
    return {
      success: true,
      paymentId,
      transactionId: refundTransactionId,
      status: "refunded",
      message: "Payment refunded successfully"
    };
  } catch (error) {
    console.error("Google Pay refund error:", error);
    return {
      success: false,
      status: "failed",
      message: "Refund processing failed",
      error: error.message
    };
  }
}
var init_googlePayService = __esm({
  "server/services/googlePayService.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/services/certificateService.ts
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
async function generateQRCode(membershipNumber) {
  const verificationUrl = `https://mms.estateagentscouncil.org/verify?member=${membershipNumber}`;
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 200,
      margin: 1
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error("QR Code generation error:", error);
    throw error;
  }
}
function formatMemberType(type) {
  const typeMap = {
    "real_estate_agent": "Real Estate Agent",
    "property_manager": "Property Manager",
    "principal_agent": "Principal Real Estate Agent",
    "negotiator": "Real Estate Negotiator",
    "real_estate_firm": "Real Estate Firm",
    "property_management_firm": "Property Management Firm",
    "brokerage_firm": "Brokerage Firm",
    "real_estate_development_firm": "Real Estate Development Firm"
  };
  return typeMap[type] || type.replace(/_/g, " ").toUpperCase();
}
function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}
async function generateCertificate(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "portrait",
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
      const qrCodeDataUrl = await generateQRCode(data.membershipNumber);
      const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const centerX = pageWidth / 2;
      const egyptianBlue = "#1034A6";
      const powderBlue = "#B0E0E6";
      const gold = "#FFD700";
      doc.lineWidth(3);
      doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke(egyptianBlue);
      doc.lineWidth(1);
      doc.rect(40, 40, pageWidth - 80, pageHeight - 80).stroke(powderBlue);
      doc.save();
      doc.circle(centerX, 100, 40).fillAndStroke(powderBlue, egyptianBlue);
      doc.fontSize(14).fillColor(egyptianBlue).text("EACZ", centerX - 20, 92);
      doc.restore();
      doc.fontSize(16).fillColor(egyptianBlue).font("Helvetica-Bold").text("ESTATE AGENTS COUNCIL OF ZIMBABWE", 50, 160, {
        align: "center",
        width: pageWidth - 100
      });
      doc.fontSize(28).fillColor(gold).font("Helvetica-Bold").text("CERTIFICATE OF REGISTRATION", 50, 210, {
        align: "center",
        width: pageWidth - 100
      });
      const memberTypeText = data.type === "individual" ? "Individual Member" : "Company Member";
      doc.fontSize(14).fillColor(egyptianBlue).font("Helvetica").text(memberTypeText, 50, 260, {
        align: "center",
        width: pageWidth - 100
      });
      doc.moveTo(150, 290).lineTo(pageWidth - 150, 290).stroke(powderBlue);
      doc.fontSize(11).fillColor("#333333").font("Helvetica").text("This is to certify that", 50, 320, {
        align: "center",
        width: pageWidth - 100
      });
      doc.fontSize(20).fillColor(egyptianBlue).font("Helvetica-Bold").text(data.name, 50, 345, {
        align: "center",
        width: pageWidth - 100
      });
      const typeDisplay = data.type === "individual" ? formatMemberType(data.memberType || "") : formatMemberType(data.businessType || "");
      doc.fontSize(12).fillColor("#666666").font("Helvetica-Oblique").text(typeDisplay, 50, 380, {
        align: "center",
        width: pageWidth - 100
      });
      doc.fontSize(11).fillColor("#333333").font("Helvetica").text("is registered with the Estate Agents Council of Zimbabwe", 50, 410, {
        align: "center",
        width: pageWidth - 100
      });
      const detailsY = 450;
      const detailsBoxHeight = 120;
      doc.rect(100, detailsY, pageWidth - 200, detailsBoxHeight).fillAndStroke("#F5F5F5", egyptianBlue);
      const leftX = 120;
      const rightX = centerX + 20;
      let detailY = detailsY + 20;
      doc.fontSize(10).fillColor("#666666").font("Helvetica").text("Membership Number:", leftX, detailY);
      doc.fontSize(12).fillColor(egyptianBlue).font("Helvetica-Bold").text(data.membershipNumber, leftX, detailY + 15);
      doc.fontSize(10).fillColor("#666666").font("Helvetica").text("Date of Registration:", leftX, detailY + 45);
      doc.fontSize(11).fillColor("#333333").font("Helvetica").text(formatDate(data.registrationDate), leftX, detailY + 60);
      doc.fontSize(10).fillColor("#666666").font("Helvetica").text("Date of Expiry:", rightX, detailY);
      doc.fontSize(11).fillColor("#333333").font("Helvetica").text(formatDate(data.expiryDate), rightX, detailY + 15);
      doc.fontSize(10).fillColor("#666666").font("Helvetica").text("Status:", rightX, detailY + 45);
      doc.fontSize(11).fillColor("#22c55e").font("Helvetica-Bold").text("ACTIVE", rightX, detailY + 60);
      const qrY = 600;
      const qrSize = 120;
      doc.image(qrCodeBuffer, centerX - qrSize / 2, qrY, {
        width: qrSize,
        height: qrSize
      });
      doc.fontSize(8).fillColor("#999999").font("Helvetica").text("Scan to verify authenticity", 50, qrY + qrSize + 10, {
        align: "center",
        width: pageWidth - 100
      });
      const sigY = 750;
      doc.moveTo(centerX - 100, sigY).lineTo(centerX + 100, sigY).stroke(egyptianBlue);
      doc.fontSize(18).fillColor(egyptianBlue).font("Helvetica-Oblique").text("Registrar", centerX - 100, sigY - 30, {
        align: "center",
        width: 200
      });
      doc.fontSize(9).fillColor("#666666").font("Helvetica").text("Estate Agents Council of Zimbabwe", centerX - 100, sigY + 10, {
        align: "center",
        width: 200
      });
      doc.fontSize(8).fillColor("#999999").font("Helvetica").text(
        "\xA9 Estate Agents Council of Zimbabwe. All rights reserved.",
        50,
        pageHeight - 50,
        {
          align: "center",
          width: pageWidth - 100
        }
      );
      doc.fontSize(7).text(
        "This is an official document. Any alteration or unauthorized use is prohibited.",
        50,
        pageHeight - 35,
        {
          align: "center",
          width: pageWidth - 100
        }
      );
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
async function sendCertificateEmail(data) {
  try {
    const certificatePDF = await generateCertificate(data);
    const typeDisplay = data.type === "individual" ? "Membership" : "Organization";
    const subject = `Your ${typeDisplay} Certificate - EACZ`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
          .header { background: linear-gradient(135deg, #1034A6 0%, #B0E0E6 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .certificate-box { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; color: white; }
          .details { background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1034A6; }
          .button { display: inline-block; background: #1034A6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>\u{1F389} Congratulations!</h1>
            <p style="font-size: 18px; margin: 10px 0 0 0;">Your Registration is Complete</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>We are delighted to inform you that your ${data.type === "individual" ? "membership" : "organization registration"} with the Estate Agents Council of Zimbabwe has been <strong>approved and activated</strong>.</p>

            <div class="certificate-box">
              <h3 style="margin-top: 0;">Your Membership Certificate is Ready!</h3>
              <p style="font-size: 14px; margin: 5px 0;">Please find your official registration certificate attached to this email</p>
            </div>

            <div class="details">
              <h3 style="color: #1034A6; margin-top: 0;">Your Membership Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Membership Number:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #1034A6;">${data.membershipNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">${data.type === "individual" ? "Member Type:" : "Business Type:"}</td>
                  <td style="padding: 8px 0; font-weight: bold;">${data.type === "individual" ? formatMemberType(data.memberType || "") : formatMemberType(data.businessType || "")}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Registration Date:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${formatDate(data.registrationDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Expiry Date:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${formatDate(data.expiryDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Status:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #22c55e;">ACTIVE</td>
                </tr>
              </table>
            </div>

            <p><strong>What's included with your membership:</strong></p>
            <ul>
              <li>Official Registration Certificate (attached)</li>
              <li>Access to the Member Portal</li>
              <li>CPD training and certification programs</li>
              <li>Professional networking opportunities</li>
              <li>Industry updates and newsletters</li>
              <li>Public verification on our website</li>
            </ul>

            <p><strong>Verify Your Certificate:</strong></p>
            <p>Your certificate includes a QR code that anyone can scan to verify your registration status. You can also verify online at:</p>
            <p><a href="https://mms.estateagentscouncil.org/verify?member=${data.membershipNumber}">https://mms.estateagentscouncil.org/verify</a></p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://mms.estateagentscouncil.org" class="button">Access Member Portal</a>
            </div>

            <p><strong>Important:</strong> Please keep your certificate safe. You can download additional copies from your member portal.</p>

            <p>If you have any questions or need assistance, please contact us at <a href="mailto:info@eacz.co.zw">info@eacz.co.zw</a></p>

            <p>Welcome to the EACZ family!</p>

            <p>Best regards,<br>
            <strong>Estate Agents Council of Zimbabwe</strong></p>
          </div>
          <div class="footer">
            <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
            <p style="font-size: 12px; color: #999;">Certificate Number: ${data.membershipNumber}</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const text2 = `
      Congratulations ${data.name}!

      Your ${data.type === "individual" ? "membership" : "organization registration"} with the Estate Agents Council of Zimbabwe has been approved and activated.

      Your Membership Details:
      - Membership Number: ${data.membershipNumber}
      - ${data.type === "individual" ? "Member Type" : "Business Type"}: ${data.type === "individual" ? formatMemberType(data.memberType || "") : formatMemberType(data.businessType || "")}
      - Registration Date: ${formatDate(data.registrationDate)}
      - Expiry Date: ${formatDate(data.expiryDate)}
      - Status: ACTIVE

      Your official registration certificate is attached to this email.

      Verify your certificate online at:
      https://mms.estateagentscouncil.org/verify?member=${data.membershipNumber}

      Access your member portal:
      https://mms.estateagentscouncil.org

      If you have any questions, contact us at info@eacz.co.zw

      Welcome to the EACZ family!

      \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
    `;
    const result = await sendEmail({
      to: data.email,
      from: "sysadmin@estateagentscouncil.org",
      subject,
      html,
      text: text2,
      attachments: [{
        filename: `EACZ_Certificate_${data.membershipNumber}.pdf`,
        content: certificatePDF,
        contentType: "application/pdf"
      }]
    });
    return result;
  } catch (error) {
    console.error("Certificate email error:", error);
    return false;
  }
}
var init_certificateService = __esm({
  "server/services/certificateService.ts"() {
    "use strict";
    init_emailService();
  }
});

// server/services/applicationWorkflowService.ts
var applicationWorkflowService_exports = {};
__export(applicationWorkflowService_exports, {
  approveAndCreateMember: () => approveAndCreateMember,
  generateAdminNotificationEmail: () => generateAdminNotificationEmail,
  generateDocumentReviewEmail: () => generateDocumentReviewEmail,
  generatePaymentReviewEmail: () => generatePaymentReviewEmail,
  generateUnderReviewEmail: () => generateUnderReviewEmail,
  moveToDocumentReview: () => moveToDocumentReview,
  moveToPaymentReview: () => moveToPaymentReview,
  moveToUnderReview: () => moveToUnderReview
});
import { eq as eq13 } from "drizzle-orm";
function generateUnderReviewEmail(applicantName, applicationId, applicationType) {
  const typeDisplay = applicationType === "individual" ? "Individual Membership" : "Organization Registration";
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
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `
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

    \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  return { subject, html, text: text2 };
}
function generateDocumentReviewEmail(applicantName, applicationId, applicationType) {
  const typeDisplay = applicationType === "individual" ? "Individual Membership" : "Organization Registration";
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
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `
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

    \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  return { subject, html, text: text2 };
}
function generatePaymentReviewEmail(applicantName, applicationId, applicationType) {
  const typeDisplay = applicationType === "individual" ? "Individual Membership" : "Organization Registration";
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
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `
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

    \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  return { subject, html, text: text2 };
}
function generateAdminNotificationEmail(adminName, applicationId, applicantName, stage, applicationType) {
  const typeDisplay = applicationType === "individual" ? "Individual Membership" : "Organization Registration";
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
          <p>\xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text2 = `
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

    \xA9 2024 Estate Agents Council of Zimbabwe. All rights reserved.
  `;
  return { subject, html, text: text2 };
}
async function moveToUnderReview(data) {
  const { applicationId, applicationType, reviewerId } = data;
  if (applicationType === "individual") {
    await db.update(individualApplications).set({
      status: "under_review",
      reviewedBy: reviewerId,
      reviewStartedAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq13(individualApplications.id, applicationId));
    const [app2] = await db.select().from(individualApplications).where(eq13(individualApplications.id, applicationId));
    if (app2) {
      const personal = typeof app2.personal === "string" ? JSON.parse(app2.personal) : app2.personal;
      const applicantName = `${personal.firstName} ${personal.lastName}`;
      const email = generateUnderReviewEmail(applicantName, app2.applicationId, "individual");
      await sendEmail({
        to: app2.applicantEmail,
        from: "sysadmin@estateagentscouncil.org",
        ...email
      });
      const admins = await storage.getUsersByRole("admin");
      const memberManagers = await storage.getUsersByRole("member_manager");
      const notifyUsers = [...admins, ...memberManagers];
      for (const user of notifyUsers) {
        const adminEmail = generateAdminNotificationEmail(
          user.fullName || user.email,
          app2.applicationId,
          applicantName,
          "Under Review",
          "individual"
        );
        await sendEmail({
          to: user.email,
          from: "sysadmin@estateagentscouncil.org",
          ...adminEmail
        });
      }
    }
  } else {
    await db.update(organizationApplications).set({
      status: "under_review",
      reviewedBy: reviewerId,
      reviewedAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq13(organizationApplications.id, applicationId));
    const [app2] = await db.select().from(organizationApplications).where(eq13(organizationApplications.id, applicationId));
    if (app2) {
      const company = typeof app2.company === "string" ? JSON.parse(app2.company) : app2.company;
      const companyName = company.name || "Organization";
      const email = generateUnderReviewEmail(companyName, app2.applicationId, "organization");
      await sendEmail({
        to: app2.applicantEmail,
        from: "sysadmin@estateagentscouncil.org",
        ...email
      });
      const admins = await storage.getUsersByRole("admin");
      const memberManagers = await storage.getUsersByRole("member_manager");
      const notifyUsers = [...admins, ...memberManagers];
      for (const user of notifyUsers) {
        const adminEmail = generateAdminNotificationEmail(
          user.fullName || user.email,
          app2.applicationId,
          companyName,
          "Under Review",
          "organization"
        );
        await sendEmail({
          to: user.email,
          from: "sysadmin@estateagentscouncil.org",
          ...adminEmail
        });
      }
    }
  }
}
async function moveToDocumentReview(data) {
  const { applicationId, applicationType, reviewerId } = data;
  if (applicationType === "individual") {
    await db.update(individualApplications).set({
      status: "document_review",
      reviewedBy: reviewerId,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq13(individualApplications.id, applicationId));
    const [app2] = await db.select().from(individualApplications).where(eq13(individualApplications.id, applicationId));
    if (app2) {
      const personal = typeof app2.personal === "string" ? JSON.parse(app2.personal) : app2.personal;
      const applicantName = `${personal.firstName} ${personal.lastName}`;
      const email = generateDocumentReviewEmail(applicantName, app2.applicationId, "individual");
      await sendEmail({
        to: app2.applicantEmail,
        from: "sysadmin@estateagentscouncil.org",
        ...email
      });
      const admins = await storage.getUsersByRole("admin");
      for (const admin of admins) {
        const adminEmail = generateAdminNotificationEmail(
          admin.fullName || admin.email,
          app2.applicationId,
          applicantName,
          "Document Review",
          "individual"
        );
        await sendEmail({
          to: admin.email,
          from: "sysadmin@estateagentscouncil.org",
          ...adminEmail
        });
      }
    }
  } else {
    await db.update(organizationApplications).set({
      status: "document_review",
      reviewedBy: reviewerId,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq13(organizationApplications.id, applicationId));
    const [app2] = await db.select().from(organizationApplications).where(eq13(organizationApplications.id, applicationId));
    if (app2) {
      const company = typeof app2.company === "string" ? JSON.parse(app2.company) : app2.company;
      const companyName = company.name || "Organization";
      const email = generateDocumentReviewEmail(companyName, app2.applicationId, "organization");
      await sendEmail({
        to: app2.applicantEmail,
        from: "sysadmin@estateagentscouncil.org",
        ...email
      });
      const admins = await storage.getUsersByRole("admin");
      for (const admin of admins) {
        const adminEmail = generateAdminNotificationEmail(
          admin.fullName || admin.email,
          app2.applicationId,
          companyName,
          "Document Review",
          "organization"
        );
        await sendEmail({
          to: admin.email,
          from: "sysadmin@estateagentscouncil.org",
          ...adminEmail
        });
      }
    }
  }
}
async function moveToPaymentReview(data) {
  const { applicationId, applicationType, reviewerId } = data;
  if (applicationType === "individual") {
    await db.update(individualApplications).set({
      status: "payment_received",
      // Use existing enum value
      reviewedBy: reviewerId,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq13(individualApplications.id, applicationId));
    const [app2] = await db.select().from(individualApplications).where(eq13(individualApplications.id, applicationId));
    if (app2) {
      const personal = typeof app2.personal === "string" ? JSON.parse(app2.personal) : app2.personal;
      const applicantName = `${personal.firstName} ${personal.lastName}`;
      const email = generatePaymentReviewEmail(applicantName, app2.applicationId, "individual");
      await sendEmail({
        to: app2.applicantEmail,
        from: "sysadmin@estateagentscouncil.org",
        ...email
      });
      const admins = await storage.getUsersByRole("admin");
      for (const admin of admins) {
        const adminEmail = generateAdminNotificationEmail(
          admin.fullName || admin.email,
          app2.applicationId,
          applicantName,
          "Payment Review",
          "individual"
        );
        await sendEmail({
          to: admin.email,
          from: "sysadmin@estateagentscouncil.org",
          ...adminEmail
        });
      }
    }
  } else {
    await db.update(organizationApplications).set({
      status: "payment_received",
      reviewedBy: reviewerId,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq13(organizationApplications.id, applicationId));
    const [app2] = await db.select().from(organizationApplications).where(eq13(organizationApplications.id, applicationId));
    if (app2) {
      const company = typeof app2.company === "string" ? JSON.parse(app2.company) : app2.company;
      const companyName = company.name || "Organization";
      const email = generatePaymentReviewEmail(companyName, app2.applicationId, "organization");
      await sendEmail({
        to: app2.applicantEmail,
        from: "sysadmin@estateagentscouncil.org",
        ...email
      });
      const admins = await storage.getUsersByRole("admin");
      for (const admin of admins) {
        const adminEmail = generateAdminNotificationEmail(
          admin.fullName || admin.email,
          app2.applicationId,
          companyName,
          "Payment Review",
          "organization"
        );
        await sendEmail({
          to: admin.email,
          from: "sysadmin@estateagentscouncil.org",
          ...adminEmail
        });
      }
    }
  }
}
async function approveAndCreateMember(data) {
  const { applicationId, applicationType, reviewerId, notes } = data;
  if (applicationType === "individual") {
    const [app2] = await db.select().from(individualApplications).where(eq13(individualApplications.id, applicationId));
    if (!app2) {
      throw new Error("Application not found");
    }
    const personal = typeof app2.personal === "string" ? JSON.parse(app2.personal) : app2.personal;
    const membershipNumber = app2.applicationId.replace("APP-", "EAC-");
    const expiryDate = /* @__PURE__ */ new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const [newMember] = await db.insert(members).values({
      membershipNumber,
      firstName: personal.firstName,
      lastName: personal.lastName,
      email: app2.applicantEmail,
      phone: personal.phone || "",
      memberType: app2.memberType,
      membershipStatus: "active",
      expiryDate,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    await db.update(individualApplications).set({
      status: "approved",
      reviewedBy: reviewerId,
      reviewNotes: notes,
      approvedAt: /* @__PURE__ */ new Date(),
      createdMemberId: newMember.id,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq13(individualApplications.id, applicationId));
    try {
      await sendCertificateEmail({
        type: "individual",
        membershipNumber,
        name: `${personal.firstName} ${personal.lastName}`,
        memberType: app2.memberType,
        registrationDate: /* @__PURE__ */ new Date(),
        expiryDate,
        email: app2.applicantEmail
      });
      console.log(`Certificate sent successfully to ${app2.applicantEmail}`);
    } catch (certError) {
      console.error("Failed to send certificate:", certError);
    }
    return newMember;
  } else {
    const [app2] = await db.select().from(organizationApplications).where(eq13(organizationApplications.id, applicationId));
    if (!app2) {
      throw new Error("Application not found");
    }
    const company = typeof app2.company === "string" ? JSON.parse(app2.company) : app2.company;
    const registrationNumber = app2.applicationId.replace("APP-", "EAC-");
    const expiryDate = /* @__PURE__ */ new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const [newOrg] = await db.insert(organizations).values({
      organizationId: registrationNumber,
      name: company.name,
      businessType: app2.businessType,
      registrationNumber,
      email: app2.applicantEmail,
      phone: company.phone || "",
      physicalAddress: company.physicalAddress || "",
      status: "active",
      expiryDate,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    await db.update(organizationApplications).set({
      status: "approved",
      reviewedBy: reviewerId,
      reviewNotes: notes,
      approvedAt: /* @__PURE__ */ new Date(),
      createdOrganizationId: newOrg.id,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq13(organizationApplications.id, applicationId));
    try {
      await sendCertificateEmail({
        type: "organization",
        membershipNumber: registrationNumber,
        name: company.name,
        businessType: app2.businessType,
        registrationDate: /* @__PURE__ */ new Date(),
        expiryDate,
        email: app2.applicantEmail
      });
      console.log(`Certificate sent successfully to ${app2.applicantEmail}`);
    } catch (certError) {
      console.error("Failed to send certificate:", certError);
    }
    return newOrg;
  }
}
var init_applicationWorkflowService = __esm({
  "server/services/applicationWorkflowService.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_storage();
    init_emailService();
    init_certificateService();
  }
});

// server/routes.ts
var routes_exports = {};
__export(routes_exports, {
  registerRoutes: () => registerRoutes
});
import { createServer } from "http";
import { z as z8 } from "zod";
import multer from "multer";
import { eq as eq14 } from "drizzle-orm";
import { randomUUID as randomUUID3, randomBytes as randomBytes4 } from "crypto";
function requireAuth3(req, res, next) {
  console.log("Auth middleware: req.isAuthenticated():", req.isAuthenticated());
  console.log("Auth middleware: req.user:", req.user);
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}
function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
        requiredRoles: allowedRoles,
        userRole
      });
    }
    next();
  };
}
function requireUserOrApplicantAuth(req, res, next) {
  console.log("Combined auth middleware: req.isAuthenticated():", req.isAuthenticated());
  console.log("Combined auth middleware: req.user:", req.user);
  console.log("Combined auth middleware: req.session.applicantId:", req.session.applicantId);
  if (req.isAuthenticated()) {
    req.authType = "user";
    req.authUserId = req.user.id;
    return next();
  }
  if (req.session.applicantId && req.session.applicantDbId) {
    req.authType = "applicant";
    req.authUserId = req.session.applicantDbId;
    req.applicantId = req.session.applicantId;
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
}
async function checkApplicationAuthorization(userId, applicationId, applicationType) {
  if (!applicationId) {
    return { authorized: false, reason: "Application ID is required" };
  }
  try {
    let application = null;
    let appType = applicationType;
    if (appType === "individual") {
      const individualApp = await db.select().from(individualApplications).where(eq14(individualApplications.id, applicationId)).limit(1);
      if (individualApp.length === 0) {
        return { authorized: false, reason: "Individual application not found" };
      }
      application = individualApp[0];
    } else if (appType === "organization") {
      const orgApp = await db.select().from(organizationApplications).where(eq14(organizationApplications.id, applicationId)).limit(1);
      if (orgApp.length === 0) {
        return { authorized: false, reason: "Organization application not found" };
      }
      application = orgApp[0];
    } else {
      const [individualApp] = await db.select().from(individualApplications).where(eq14(individualApplications.id, applicationId)).limit(1);
      if (individualApp) {
        application = individualApp;
        appType = "individual";
      } else {
        const [orgApp] = await db.select().from(organizationApplications).where(eq14(organizationApplications.id, applicationId)).limit(1);
        if (orgApp) {
          application = orgApp;
          appType = "organization";
        }
      }
      if (!application) {
        return { authorized: false, reason: "Application not found in either individual or organization applications" };
      }
    }
    if (application.createdByUserId === userId) {
      console.log(`Authorization granted: User ${userId} owns application ${applicationId} (${appType})`);
      return { authorized: true, application };
    }
    const user = await storage.getUser(userId);
    if (user?.role === "admin") {
      console.log(`Authorization granted: User ${userId} has admin role for application ${applicationId} (${appType})`);
      return { authorized: true, application };
    }
    console.log(`Authorization denied: User ${userId} does not own application ${applicationId} (${appType}) and is not admin`);
    return {
      authorized: false,
      reason: "You do not have permission to upload documents for this application"
    };
  } catch (error) {
    console.error("Authorization check error:", error);
    return {
      authorized: false,
      reason: "Error checking application authorization"
    };
  }
}
async function logSecurityEvent(action, userId, applicationId, details, success) {
  try {
    console.log(`[SECURITY AUDIT] ${action}:`, {
      userId,
      applicationId,
      success,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...details
    });
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
}
async function registerRoutes(app2) {
  const { registerPublicRoutes: registerPublicRoutes2 } = await Promise.resolve().then(() => (init_publicRoutes(), publicRoutes_exports));
  registerPublicRoutes2(app2);
  setupClerkAuth(app2);
  setupAuth(app2);
  setupAuthRoutes(app2);
  registerUserProfileRoutes(app2);
  registerApplicationRoutes(app2);
  registerNotificationRoutes(app2);
  const { setupOrganizationPortalRoutes: setupOrganizationPortalRoutes2 } = await Promise.resolve().then(() => (init_organizationPortalRoutes(), organizationPortalRoutes_exports));
  setupOrganizationPortalRoutes2(app2);
  app2.post("/api/applicants/register", async (req, res) => {
    try {
      const { firstName, surname, email } = req.body;
      if (!firstName || !surname || !email) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "firstName, surname and email are required"
        });
      }
      const existingApplicant = await storage.getApplicantByEmail(email);
      if (existingApplicant) {
        return res.status(409).json({
          error: "Email already registered",
          applicantId: existingApplicant.applicantId
        });
      }
      const applicant = await storage.createApplicant({
        firstName,
        surname,
        email
      });
      const { sendEmail: sendEmail2, generateWelcomeEmail: generateWelcomeEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
      const fullName = `${firstName} ${surname}`;
      const welcomeEmail = generateWelcomeEmail2(fullName, applicant.applicantId);
      const welcomeEmailSent = await sendEmail2({
        to: email,
        from: "noreply@estateagentscouncil.org",
        ...welcomeEmail
      });
      const baseUrl = "https://mms.estateagentscouncil.org";
      const { generateVerificationEmail: generateVerificationEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
      const verificationEmail = generateVerificationEmail2(fullName, applicant.emailVerificationToken, baseUrl);
      const verificationEmailSent = await sendEmail2({
        to: email,
        from: "noreply@estateagentscouncil.org",
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
      console.error("Registration error:", error);
      console.error("Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      res.status(500).json({
        error: "Registration failed",
        message: "An error occurred during registration. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/applicants/login", async (req, res) => {
    try {
      const { applicantId, email } = req.body;
      if (!applicantId || !email) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "applicantId and email are required"
        });
      }
      const applicantIdPattern = /^APP-(MBR|ORG)-\d{4}-\d{4}$/;
      if (!applicantIdPattern.test(applicantId)) {
        return res.status(400).json({
          error: "Invalid applicant ID format",
          details: "Applicant ID must be in format APP-MBR-YYYY-XXXX or APP-ORG-YYYY-XXXX"
        });
      }
      const applicant = await storage.getApplicantByApplicantId(applicantId);
      if (!applicant) {
        return res.status(401).json({
          error: "Invalid credentials",
          details: "Applicant ID not found"
        });
      }
      if (applicant.email !== email) {
        return res.status(401).json({
          error: "Invalid credentials",
          details: "Email address does not match the applicant ID"
        });
      }
      if (!applicant.emailVerified) {
        return res.status(403).json({
          error: "Email not verified",
          details: "Please verify your email address before continuing with your application"
        });
      }
      req.session.applicantId = applicant.applicantId;
      req.session.applicantDbId = applicant.id;
      console.log("Login - Saving session:", {
        sessionId: req.sessionID,
        applicantId: applicant.applicantId,
        applicantDbId: applicant.id
      });
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({
            error: "Session error",
            details: "Failed to save session"
          });
        }
        console.log("Login - Session saved successfully:", {
          sessionId: req.sessionID,
          applicantId: req.session.applicantId
        });
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
      });
    } catch (error) {
      console.error("Applicant login error:", error);
      res.status(500).json({
        error: "Login failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/applicants/verify-email", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({
          error: "Verification token required"
        });
      }
      const applicant = await storage.getApplicantByVerificationToken(token);
      if (!applicant) {
        return res.status(404).json({
          error: "Invalid verification token"
        });
      }
      if (applicant.emailVerificationExpires && /* @__PURE__ */ new Date() > applicant.emailVerificationExpires) {
        return res.status(410).json({
          error: "Verification token has expired"
        });
      }
      if (applicant.emailVerified) {
        return res.status(200).json({
          success: true,
          message: "Email already verified",
          applicantId: applicant.applicantId
        });
      }
      const verifiedApplicant = await storage.verifyApplicantEmail(applicant.id);
      res.status(200).json({
        success: true,
        message: "Email successfully verified! You can now continue with your application.",
        applicantId: verifiedApplicant.applicantId
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({
        error: "Email verification failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/applicants/:id/status", async (req, res) => {
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
      console.error("Get applicant status error:", error);
      res.status(500).json({
        error: "Failed to get applicant status",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/applicants/:applicantId/save-draft", async (req, res) => {
    try {
      const { applicantId } = req.params;
      const { applicationData } = req.body;
      if (!applicationData) {
        return res.status(400).json({
          error: "Application data required"
        });
      }
      const applicantIdPattern = /^APP-(MBR|ORG)-\d{4}-\d{4}$/;
      if (!applicantIdPattern.test(applicantId)) {
        return res.status(400).json({
          error: "Invalid applicant ID format",
          details: "Applicant ID must be in format APP-MBR-YYYY-XXXX or APP-ORG-YYYY-XXXX"
        });
      }
      console.log("Save draft - Session check:", {
        sessionId: req.sessionID,
        sessionApplicantId: req.session.applicantId,
        requestApplicantId: applicantId,
        sessionData: req.session
      });
      if (!req.session.applicantId || req.session.applicantId !== applicantId) {
        console.error("Session authorization failed:", {
          hasSession: !!req.session,
          sessionApplicantId: req.session.applicantId,
          requestApplicantId: applicantId
        });
        return res.status(401).json({
          error: "Unauthorized",
          details: "You can only save drafts for your own application"
        });
      }
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
      const draftApplication = await storage.saveApplicationDraft(applicant.id, applicationData);
      res.status(200).json({
        success: true,
        message: "Application draft saved successfully",
        draftId: draftApplication.id,
        lastSaved: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Save draft error:", error);
      res.status(500).json({
        error: "Failed to save draft",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/applicants/:applicantId/load-draft", async (req, res) => {
    try {
      const { applicantId } = req.params;
      const applicantIdPattern = /^APP-(MBR|ORG)-\d{4}-\d{4}$/;
      if (!applicantIdPattern.test(applicantId)) {
        return res.status(400).json({
          error: "Invalid applicant ID format",
          details: "Applicant ID must be in format APP-MBR-YYYY-XXXX or APP-ORG-YYYY-XXXX"
        });
      }
      if (!req.session.applicantId || req.session.applicantId !== applicantId) {
        return res.status(401).json({
          error: "Unauthorized",
          details: "You can only access drafts for your own application"
        });
      }
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
      console.error("Load draft error:", error);
      res.status(500).json({
        error: "Failed to load draft",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/organization-applicants/register", async (req, res) => {
    try {
      const registrationSchema = insertOrganizationApplicantSchema.pick({
        companyName: true,
        email: true
      });
      const validatedData = registrationSchema.parse(req.body);
      const { companyName, email } = validatedData;
      const existingApplicant = await storage.getOrganizationApplicantByEmail(email);
      if (existingApplicant) {
        return res.status(409).json({
          error: "Organization applicant already exists",
          details: "An organization application with this email address already exists"
        });
      }
      const organizationApplicant = await storage.createOrganizationApplicant({
        companyName,
        email
      });
      try {
        const { sendEmail: sendEmail2, generateOrgApplicantVerificationEmail: generateOrgApplicantVerificationEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
        const emailContent = generateOrgApplicantVerificationEmail2(
          companyName,
          organizationApplicant.emailVerificationToken
        );
        await sendEmail2({
          to: email,
          from: "sysadmin@estateagentscouncil.org",
          subject: emailContent.subject,
          html: emailContent.html
        });
        console.log(`Organization verification email sent to: ${email}`);
      } catch (emailError) {
        console.error("Failed to send organization verification email:", emailError);
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
      console.error("Organization registration error:", error);
      res.status(500).json({
        error: "Failed to register organization applicant",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/organization-applicants/login", async (req, res) => {
    try {
      const loginSchema = z8.object({
        applicantId: z8.string().regex(/^ORG-APP-\d{4}-\d{4}$/, "Invalid organization applicant ID format"),
        email: z8.string().email("Invalid email format")
      });
      const { applicantId, email } = loginSchema.parse(req.body);
      const organizationApplicant = await storage.getOrganizationApplicantByApplicantId(applicantId);
      if (!organizationApplicant) {
        return res.status(401).json({
          error: "Invalid credentials",
          details: "Organization applicant ID not found"
        });
      }
      if (organizationApplicant.email !== email) {
        return res.status(401).json({
          error: "Invalid credentials"
        });
      }
      if (!organizationApplicant.emailVerified) {
        return res.status(403).json({
          error: "Email verification required",
          details: "Please verify your email address before logging in"
        });
      }
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
      console.error("Organization login error:", error);
      res.status(500).json({
        error: "Failed to login organization applicant",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/organization-applicants/verify-email", async (req, res) => {
    try {
      const verifySchema = z8.object({
        token: z8.string().min(1, "Verification token is required")
      });
      const { token } = verifySchema.parse(req.body);
      const organizationApplicant = await storage.getOrganizationApplicantByVerificationToken(token);
      if (!organizationApplicant) {
        return res.status(400).json({
          error: "Invalid or expired verification token"
        });
      }
      if (organizationApplicant.emailVerificationExpires && organizationApplicant.emailVerificationExpires < /* @__PURE__ */ new Date()) {
        return res.status(400).json({
          error: "Verification token has expired",
          details: "Please request a new verification email"
        });
      }
      if (organizationApplicant.emailVerified) {
        return res.status(400).json({
          error: "Email is already verified"
        });
      }
      const verifiedApplicant = await storage.verifyOrganizationApplicantEmail(organizationApplicant.id);
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
      console.error("Organization email verification error:", error);
      res.status(500).json({
        error: "Failed to verify email",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/organization-applicants/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const orgApplicantIdPattern = /^ORG-APP-\d{4}-\d{4}$/;
      if (!orgApplicantIdPattern.test(id)) {
        return res.status(400).json({
          error: "Invalid applicant ID format"
        });
      }
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
      console.error("Organization status check error:", error);
      res.status(500).json({
        error: "Failed to check organization applicant status",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertMemberApplicationSchema.parse(req.body);
      const application = await storage.createMemberApplication(validatedData);
      try {
        const { sendEmail: sendEmail2, generateApplicationConfirmationEmail: generateApplicationConfirmationEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
        const applicantName = `${validatedData.firstName} ${validatedData.lastName}`;
        const applicationId = application.applicationNumber || `APP-${Date.now()}`;
        const feeAmount = validatedData.applicationFee || 75;
        const confirmationEmail = generateApplicationConfirmationEmail2(
          applicantName,
          applicationId,
          "individual",
          parseFloat(feeAmount.toString())
        );
        await sendEmail2({
          to: validatedData.email,
          from: "sysadmin@estateagentscouncil.org",
          ...confirmationEmail
        });
        console.log(`Application confirmation email sent to: ${validatedData.email}`);
      } catch (emailError) {
        console.error("Failed to send application confirmation email:", emailError);
      }
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getPendingApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const application = await storage.updateMemberApplication(id, updates);
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/members", async (req, res) => {
    try {
      const members3 = await storage.getAllMembers();
      res.json(members3);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/members/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const member = await storage.getMember(id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/members/verify/:identifier", async (req, res) => {
    try {
      const { identifier } = req.params;
      let member;
      if (identifier.startsWith("REA-")) {
        member = await storage.getMemberByMembershipNumber(identifier);
      } else {
        member = await storage.getMemberByEmail(identifier);
      }
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json({
        membershipNumber: member.membershipNumber,
        firstName: member.firstName,
        lastName: member.lastName,
        memberType: member.memberType,
        status: member.membershipStatus,
        expiryDate: member.expiryDate
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/organizations", async (req, res) => {
    try {
      const organizations4 = await storage.getAllOrganizations();
      res.json(organizations4);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/organizations", async (req, res) => {
    try {
      const validatedData = insertOrganizationSchema.parse(req.body);
      const organization = await storage.createOrganization(validatedData);
      res.status(201).json(organization);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/cases", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const validatedQuery = casesQuerySchema2.safeParse(req.query);
      if (!validatedQuery.success) {
        return res.status(400).json({
          message: "Invalid query parameters",
          errors: validatedQuery.error.errors
        });
      }
      const { status, priority, type, assignedTo, search } = validatedQuery.data;
      let cases2;
      if (priority === "high" || priority === "critical") {
        cases2 = await storage.getCasesByPriority(priority);
      } else if (status) {
        cases2 = await storage.getCasesByStatus(status);
      } else {
        cases2 = await storage.getAllCases();
      }
      if (type) {
        cases2 = cases2.filter((c) => c.type === type);
      }
      if (assignedTo) {
        cases2 = cases2.filter((c) => c.assignedTo === assignedTo);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        cases2 = cases2.filter(
          (c) => c.title.toLowerCase().includes(searchLower) || c.description.toLowerCase().includes(searchLower) || c.caseNumber.toLowerCase().includes(searchLower)
        );
      }
      res.json(cases2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/cases", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const validatedData = insertCaseSchema.parse(req.body);
      const caseItem = await storage.createCase(validatedData);
      res.status(201).json(caseItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/cases/:id", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const caseItem = await storage.getCase(id);
      if (!caseItem) {
        return res.status(404).json({ message: "Case not found" });
      }
      res.json(caseItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/cases/:id", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const validatedUpdates = caseUpdateSchema2.parse(req.body);
      const caseItem = await storage.updateCase(id, validatedUpdates);
      res.json(caseItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/cases/:id/assign", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = caseAssignmentSchema2.parse(req.body);
      const caseItem = await storage.assignCase(id, validatedData.assignedTo);
      res.json(caseItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/cases/bulk-action", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const validatedData = bulkCaseActionSchema2.parse(req.body);
      const { caseIds, action, assignedTo, resolution } = validatedData;
      let result;
      if (action === "assign") {
        if (!assignedTo) {
          return res.status(400).json({ message: "assignedTo is required for bulk assign" });
        }
        result = await storage.bulkAssignCases(caseIds, assignedTo);
      } else if (action === "resolve") {
        result = await storage.bulkResolveCases(caseIds, resolution);
      } else if (action === "close") {
        result = await storage.bulkCloseCases(caseIds);
      }
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/cases/reports/export", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { format = "json", status, priority } = req.query;
      let cases2;
      if (status) {
        cases2 = await storage.getCasesByStatus(status);
      } else {
        cases2 = await storage.getAllCases();
      }
      if (priority) {
        cases2 = cases2.filter((c) => c.priority === priority);
      }
      if (format === "csv") {
        const csvHeaders = "Case Number,Title,Type,Priority,Status,Assigned To,Created Date\n";
        const csvRows = cases2.map(
          (c) => `${c.caseNumber},"${c.title}",${c.type},${c.priority},${c.status},"${c.assignedTo || "Unassigned"}",${c.createdAt}`
        ).join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", 'attachment; filename="cases-export.csv"');
        res.send(csvHeaders + csvRows);
      } else {
        res.json(cases2);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/cases/staff", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const staff = await storage.getStaffUsers();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/cpd-activities", async (req, res) => {
    try {
      const activities = await storage.getCpdActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/cpd-activities", async (req, res) => {
    try {
      const validatedData = insertCpdActivitySchema.parse(req.body);
      const activity = await storage.createCpdActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/renewals", authorizeRole(STAFF_ROLES), async (req, res) => {
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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/renewals/current", async (req, res) => {
    try {
      const currentRenewal = await storage.getCurrentMemberRenewal();
      res.json(currentRenewal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/renewals/:id/remind", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.sendRenewalReminder(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/renewals/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;
      const renewal = await storage.completeRenewal(id);
      res.json(renewal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/renewals/:id", authorizeRole(MEMBER_MANAGER_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || id.trim() === "") {
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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/renewals/:id/increment-reminder", authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || id.trim() === "") {
        return res.status(400).json({ message: "Renewal ID is required" });
      }
      const renewal = await storage.incrementRenewalReminder(id);
      res.json(renewal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/renewals/generate", authorizeRole(ADMIN_ROLES), async (req, res) => {
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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/member-activities", async (req, res) => {
    try {
      const activities = await storage.getMemberActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/member-activities", async (req, res) => {
    try {
      const validatedData = insertMemberActivitySchema.parse(req.body);
      const activity = await storage.createMemberActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/events", async (req, res) => {
    try {
      const { upcoming } = req.query;
      let events2;
      if (upcoming === "true") {
        events2 = await storage.getUpcomingEvents();
      } else {
        events2 = await storage.getAllEvents();
      }
      res.json(events2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/events/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/payments/member/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const payments2 = await storage.getPaymentsByMember(memberId);
      res.json(payments2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/payments/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const payment = await storage.updatePaymentStatus(id, status);
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/documents", async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/documents/member/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const documents2 = await storage.getDocumentsByMember(memberId);
      res.json(documents2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/documents/application/:applicationId", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const documents2 = await storage.getDocumentsByApplication(applicationId);
      res.json(documents2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/documents/:id/verify", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const { id } = req.params;
      const document = await storage.verifyDocument(id, req.user.id);
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/members", requireAuth3, async (req, res) => {
    try {
      const allMembers = await storage.getAllMembersWithOrganizations();
      res.json(allMembers);
    } catch (error) {
      console.error("Admin members fetch error:", error);
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });
  app2.put("/api/members/:id", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const member = await storage.getMember(id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      const updatedMember = await storage.updateMember(id, updates);
      res.json(updatedMember);
    } catch (error) {
      console.error("Admin member update error:", error);
      res.status(500).json({ message: "Failed to update member" });
    }
  });
  app2.put("/api/admin/members/:id/assign-organization", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const { organizationId } = req.body;
      const member = await storage.getMember(id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      if (organizationId) {
        const organization = await storage.getOrganization(organizationId);
        if (!organization) {
          return res.status(404).json({ message: "Organization not found" });
        }
      }
      const updatedMember = await storage.updateMember(id, { organizationId: organizationId || null });
      res.json({
        message: organizationId ? "Member assigned to organization successfully" : "Member removed from organization",
        member: updatedMember
      });
    } catch (error) {
      console.error("Assign organization error:", error);
      res.status(500).json({ message: "Failed to assign organization" });
    }
  });
  app2.post("/api/admin/members/simplified-add", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
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
      if (!firstName || !surname || !dateOfBirth || !countryOfResidence || !nationality || !email || !memberType || !educationLevel || !employmentStatus) {
        return res.status(400).json({
          message: "Missing required fields",
          details: "All fields except organization name are required"
        });
      }
      const existingMember = await storage.getMemberByEmail(email);
      if (existingMember) {
        return res.status(409).json({
          message: "Email already exists",
          details: "A member with this email address already exists"
        });
      }
      const { nextMemberNumber: nextMemberNumber2 } = await Promise.resolve().then(() => (init_namingSeries(), namingSeries_exports));
      const membershipNumber = await nextMemberNumber2("individual");
      const memberData = {
        firstName,
        lastName: surname,
        email,
        dateOfBirth: new Date(dateOfBirth),
        countryOfResidence,
        nationality,
        memberType,
        membershipNumber,
        membershipStatus: "pending",
        // Additional fields based on form data
        isMatureEntry: educationLevel === "mature_entry" ? true : false
      };
      const newMember = await storage.createMember(memberData);
      try {
        const { sendEmail: sendEmail2, generateNewMemberWelcomeEmail: generateNewMemberWelcomeEmail2, generateMemberVerificationEmail: generateMemberVerificationEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
        const fullName = `${firstName} ${surname}`;
        const { generateVerificationToken: generateVerificationToken3, getVerificationExpiry: getVerificationExpiry2 } = await Promise.resolve().then(() => (init_applicantUtils(), applicantUtils_exports));
        const verificationToken = generateVerificationToken3();
        const welcomeEmail = generateNewMemberWelcomeEmail2(fullName, membershipNumber, educationLevel, employmentStatus);
        const baseUrl = "https://mms.estateagentscouncil.org";
        const welcomeEmailSent = await sendEmail2({
          to: email,
          from: "noreply@estateagentscouncil.org",
          ...welcomeEmail
        });
        const verificationEmail = generateMemberVerificationEmail2(fullName, email, membershipNumber, verificationToken, baseUrl);
        const verificationEmailSent = await sendEmail2({
          to: email,
          from: "noreply@estateagentscouncil.org",
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
            emailVerified: false
            // Member email verification status
          },
          emailsSent: {
            welcome: welcomeEmailSent,
            verification: verificationEmailSent
          }
        });
      } catch (emailError) {
        console.error("Email sending error:", emailError);
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
            emailVerified: false
            // Member email verification status
          },
          emailError: emailError.message
        });
      }
    } catch (error) {
      console.error("Simplified add member error:", error);
      res.status(500).json({
        message: "Failed to create member",
        details: error.message || "Unknown error occurred"
      });
    }
  });
  app2.post("/api/admin/members/create-with-clerk", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
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
      if (!firstName || !surname || !dateOfBirth || !email || !memberType || !educationLevel || !countryOfResidence || !nationality || !employmentStatus) {
        return res.status(400).json({
          message: "Missing required fields",
          details: "All fields except organization name are required"
        });
      }
      const existingMember = await storage.getMemberByEmail(email);
      if (existingMember) {
        return res.status(409).json({
          message: "Email already exists",
          details: "A member with this email address already exists"
        });
      }
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: "User already exists",
          details: "A user with this email address already exists"
        });
      }
      const isPREA = memberType === "principal_agent";
      const accountType = isPREA ? "PREA" : "Member";
      let clerkUserId = null;
      const isDevelopmentMode = process.env.NODE_ENV === "development" && !process.env.CLERK_SECRET_KEY;
      if (isDevelopmentMode) {
        console.log(`[DEV MODE] Creating member without Clerk. Account type: ${accountType}`);
        clerkUserId = null;
      } else {
        try {
          const { clerkClient: clerkClient2 } = await Promise.resolve().then(() => (init_clerkAuth(), clerkAuth_exports));
          if (!clerkClient2) {
            return res.status(500).json({
              message: "Clerk authentication not configured",
              details: "Cannot create user account without Clerk integration. Set CLERK_SECRET_KEY environment variable."
            });
          }
          const tempPassword = Math.random().toString(36).slice(-12) + "A1!";
          const sanitizedUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "_");
          const clerkUser = await clerkClient2.users.createUser({
            emailAddress: [email],
            username: sanitizedUsername,
            password: tempPassword,
            firstName,
            lastName: surname,
            skipPasswordRequirement: false,
            skipPasswordChecks: true,
            // Skip Clerk's password validation since we generate our own
            publicMetadata: {
              accountType,
              memberType,
              role: "member"
            },
            privateMetadata: {
              educationLevel: educationLevel || "",
              employmentStatus: employmentStatus || "",
              tempPassword
              // Store temp password in private metadata for reference
            }
          });
          clerkUserId = clerkUser.id;
          console.log(`Created Clerk user ${clerkUserId} with account type: ${accountType}`);
        } catch (clerkError) {
          console.error("Clerk user creation error:", clerkError);
          const errorDetails = clerkError.errors?.[0]?.message || clerkError.message || "Clerk API error";
          console.error("Full Clerk error:", JSON.stringify(clerkError, null, 2));
          if (errorDetails.includes("already exists") || errorDetails.includes("duplicate")) {
            console.warn(`Email ${email} already exists in Clerk, creating member without Clerk integration`);
            clerkUserId = null;
          } else {
            return res.status(500).json({
              message: "Failed to create user account",
              details: errorDetails
            });
          }
        }
      }
      const { nextMemberNumber: nextMemberNumber2 } = await Promise.resolve().then(() => (init_namingSeries(), namingSeries_exports));
      const membershipNumber = await nextMemberNumber2("individual");
      let newUser;
      if (isDevelopmentMode) {
        const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
        const tempPassword = await hashPassword2("Welcome123!");
        const userData = {
          clerkId: null,
          email,
          firstName,
          lastName: surname,
          password: tempPassword,
          role: null,
          status: "active",
          emailVerified: false
        };
        newUser = await storage.createUser(userData);
        console.log(`[DEV MODE] Created User record ${newUser.id} without Clerk (temp password: Welcome123!)`);
      } else {
        const userData = {
          clerkId: clerkUserId,
          email,
          firstName,
          lastName: surname,
          password: "",
          // Empty password for Clerk-managed users
          role: null,
          status: "active",
          emailVerified: false
          // Will be verified through Clerk
        };
        newUser = await storage.createUser(userData);
        console.log(`Created User record ${newUser.id} for Clerk user ${clerkUserId}`);
      }
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
        membershipStatus: "pending",
        isMatureEntry: educationLevel === "mature_entry" ? true : false
      };
      const newMember = await storage.createMember(memberData);
      console.log(`Created Member record ${newMember.id} with membership number ${membershipNumber}`);
      try {
        const { sendEmail: sendEmail2, generateNewMemberWelcomeEmail: generateNewMemberWelcomeEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
        const fullName = `${firstName} ${surname}`;
        const welcomeEmail = generateNewMemberWelcomeEmail2(
          fullName,
          membershipNumber,
          educationLevel,
          employmentStatus
        );
        const welcomeEmailSent = await sendEmail2({
          to: email,
          from: "noreply@estateagentscouncil.org",
          ...welcomeEmail
        });
        console.log(`Welcome email sent to ${email}: ${welcomeEmailSent}`);
        const successMessage = isDevelopmentMode ? `[DEV MODE] Member created successfully! ${accountType} account type assigned. Temp password: Welcome123!` : `Member created successfully! ${accountType} account has been set up. Verification email has been sent.`;
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
          ...isDevelopmentMode && { devMode: true, tempPassword: "Welcome123!" }
        });
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        const errorMessage = isDevelopmentMode ? `[DEV MODE] Member created successfully with ${accountType} account type. Temp password: Welcome123!` : `Member created successfully with ${accountType} account, but email notification failed to send.`;
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
          emailError: isDevelopmentMode ? void 0 : emailError.message,
          ...isDevelopmentMode && { devMode: true, tempPassword: "Welcome123!" }
        });
      }
    } catch (error) {
      console.error("Create member with Clerk error:", error);
      res.status(500).json({
        message: "Failed to create member",
        details: error.message || "Unknown error occurred"
      });
    }
  });
  app2.get("/api/organizations/current/members", requireAuth3, async (req, res) => {
    try {
      const allMembers = await storage.getAllMembers();
      const userMember = allMembers.find((m) => m.userId === req.user?.id);
      if (!userMember?.organizationId) {
        return res.status(400).json({
          error: "User must be associated with an organization to view members"
        });
      }
      const organizationId = userMember.organizationId;
      const members3 = allMembers.filter((m) => m.organizationId === organizationId);
      res.json(members3);
    } catch (error) {
      console.error("Error fetching organization members:", error);
      res.status(500).json({
        error: "Failed to fetch organization members"
      });
    }
  });
  app2.post("/api/organizations/current/members/bulk-import", requireAuth3, upload.single("csvFile"), async (req, res) => {
    try {
      const allMembers = await storage.getAllMembers();
      const userMember = allMembers.find((m) => m.userId === req.user?.id);
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
      const csvContent = req.file.buffer.toString("utf-8");
      const lines = csvContent.split("\n").filter((line) => line.trim().length > 0);
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
        errors: []
      };
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const requiredHeaders = ["firstname", "lastname", "email", "phone", "membershiptype"];
      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
      if (missingHeaders.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required headers: ${missingHeaders.join(", ")}`,
          errors: [{ row: 0, error: `Required headers: ${requiredHeaders.join(", ")}` }]
        });
      }
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        try {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index] || "";
          });
          if (!rowData.firstname || !rowData.lastname || !rowData.email) {
            results.failed++;
            results.errors.push({
              row: i,
              error: `Missing required data: ${!rowData.firstname ? "firstname " : ""}${!rowData.lastname ? "lastname " : ""}${!rowData.email ? "email" : ""}`.trim()
            });
            continue;
          }
          const membershipNumber = await nextMemberNumber("individual");
          const memberData = {
            firstName: rowData.firstname,
            lastName: rowData.lastname,
            email: rowData.email,
            phone: rowData.phone || "",
            memberType: rowData.membershiptype,
            membershipNumber,
            organizationId,
            // Force organization association
            membershipStatus: "active",
            registrationDate: /* @__PURE__ */ new Date(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3)
            // 1 year from now
          };
          await storage.createMember(memberData);
          const { generateVerificationToken: generateVerificationToken3 } = await Promise.resolve().then(() => (init_applicantUtils(), applicantUtils_exports));
          const tempPassword = generateVerificationToken3();
          const userData = {
            email: rowData.email,
            password: await hashPassword(tempPassword),
            firstName: rowData.firstname,
            lastName: rowData.lastname,
            phone: rowData.phone || "",
            role: null,
            // Members don't have system roles - they access through different authentication
            status: "active",
            emailVerified: false,
            passwordChangedAt: /* @__PURE__ */ new Date(),
            organizationId
            // Associate user with organization
          };
          try {
            await storage.createUser(userData);
          } catch (userError) {
            console.warn(`Failed to create user account for ${rowData.email}:`, userError.message);
          }
          try {
            console.log(`Welcome email would be sent to ${rowData.email} with member number ${membershipNumber}`);
          } catch (emailError) {
            console.warn(`Failed to send welcome email to ${rowData.email}:`, emailError.message);
          }
          results.succeeded++;
        } catch (error) {
          console.error(`Error processing row ${i}:`, error);
          results.failed++;
          results.errors.push({
            row: i,
            error: error.message || "Unknown error occurred"
          });
        }
      }
      results.success = results.succeeded > 0;
      res.json(results);
    } catch (error) {
      console.error("Bulk import error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during bulk import",
        errors: [{ row: 0, error: "Server error occurred" }]
      });
    }
  });
  app2.post("/api/admin/members/bulk-import", requireAuth3, authorizeRole(STAFF_ROLES), upload.single("csvFile"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No CSV file uploaded",
          errors: [{ row: 0, error: "CSV file is required" }]
        });
      }
      const csvContent = req.file.buffer.toString("utf-8");
      const lines = csvContent.split("\n").filter((line) => line.trim().length > 0);
      if (lines.length < 2) {
        return res.status(400).json({
          success: false,
          message: "CSV file must contain at least a header row and one data row",
          errors: [{ row: 0, error: "CSV file is empty or contains only headers" }]
        });
      }
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const requiredFields = ["firstname", "lastname", "email", "dateofbirth", "countryofresidence", "nationality", "membertype", "educationlevel", "employmentstatus"];
      const missingFields = requiredFields.filter((field) => !headers.includes(field));
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Missing required columns in CSV",
          errors: [{ row: 0, error: `Missing required columns: ${missingFields.join(", ")}` }]
        });
      }
      const results = {
        success: true,
        processed: 0,
        succeeded: 0,
        failed: 0,
        errors: [],
        members: []
      };
      for (let i = 1; i < lines.length; i++) {
        const rowNumber = i + 1;
        const values = lines[i].split(",").map((v) => v.trim());
        results.processed++;
        try {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index] || "";
          });
          const missingRowFields = requiredFields.filter((field) => !rowData[field] || rowData[field].trim() === "");
          if (missingRowFields.length > 0) {
            results.errors.push({
              row: rowNumber,
              error: `Missing required fields: ${missingRowFields.join(", ")}`,
              data: rowData
            });
            results.failed++;
            continue;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(rowData.email)) {
            results.errors.push({
              row: rowNumber,
              field: "email",
              error: "Invalid email format",
              data: rowData
            });
            results.failed++;
            continue;
          }
          const existingMember = await storage.getMemberByEmail(rowData.email);
          if (existingMember) {
            results.errors.push({
              row: rowNumber,
              field: "email",
              error: "Email already exists in system",
              data: rowData
            });
            results.failed++;
            continue;
          }
          const birthDate = new Date(rowData.dateofbirth);
          if (isNaN(birthDate.getTime())) {
            results.errors.push({
              row: rowNumber,
              field: "dateOfBirth",
              error: "Invalid date format. Use YYYY-MM-DD",
              data: rowData
            });
            results.failed++;
            continue;
          }
          const today = /* @__PURE__ */ new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18 || age > 80) {
            results.errors.push({
              row: rowNumber,
              field: "dateOfBirth",
              error: "Age must be between 18 and 80 years",
              data: rowData
            });
            results.failed++;
            continue;
          }
          const validMemberTypes = ["real_estate_agent", "property_manager", "principal_agent", "negotiator"];
          if (!validMemberTypes.includes(rowData.membertype)) {
            results.errors.push({
              row: rowNumber,
              field: "memberType",
              error: `Invalid member type. Must be one of: ${validMemberTypes.join(", ")}`,
              data: rowData
            });
            results.failed++;
            continue;
          }
          const validEducationLevels = ["normal_entry", "mature_entry"];
          if (!validEducationLevels.includes(rowData.educationlevel)) {
            results.errors.push({
              row: rowNumber,
              field: "educationLevel",
              error: `Invalid education level. Must be one of: ${validEducationLevels.join(", ")}`,
              data: rowData
            });
            results.failed++;
            continue;
          }
          const validEmploymentStatuses = ["employed", "self_employed"];
          if (!validEmploymentStatuses.includes(rowData.employmentstatus)) {
            results.errors.push({
              row: rowNumber,
              field: "employmentStatus",
              error: `Invalid employment status. Must be one of: ${validEmploymentStatuses.join(", ")}`,
              data: rowData
            });
            results.failed++;
            continue;
          }
          if (rowData.educationlevel === "mature_entry" && age < 27) {
            results.errors.push({
              row: rowNumber,
              field: "educationLevel",
              error: "Mature Entry requires age 27 years and above",
              data: rowData
            });
            results.failed++;
            continue;
          }
          if (rowData.employmentstatus === "employed" && (!rowData.organizationname || rowData.organizationname.trim() === "")) {
            results.errors.push({
              row: rowNumber,
              field: "organizationName",
              error: "Organization name is required when employment status is employed",
              data: rowData
            });
            results.failed++;
            continue;
          }
          const membershipNumber = await nextMemberNumber("individual");
          const memberData = {
            firstName: rowData.firstname,
            lastName: rowData.lastname,
            email: rowData.email,
            dateOfBirth: birthDate,
            countryOfResidence: rowData.countryofresidence,
            nationality: rowData.nationality,
            memberType: rowData.membertype,
            membershipNumber,
            membershipStatus: "active",
            // Bulk imported members are active immediately
            isMatureEntry: rowData.educationlevel === "mature_entry"
          };
          const newMember = await storage.createMember(memberData);
          const { generateVerificationToken: generateVerificationToken3 } = await Promise.resolve().then(() => (init_applicantUtils(), applicantUtils_exports));
          const tempPassword = generateVerificationToken3();
          const userData = {
            email: rowData.email,
            password: await hashPassword(tempPassword),
            firstName: rowData.firstname,
            lastName: rowData.lastname,
            phone: "",
            // Optional for bulk import
            role: null,
            // Members don't have system roles - they access through different authentication
            status: "active",
            emailVerified: false,
            passwordChangedAt: /* @__PURE__ */ new Date()
          };
          try {
            await storage.createUser(userData);
          } catch (userError) {
            console.error(`Failed to create user account for ${rowData.email}:`, userError);
          }
          try {
            const { sendEmail: sendEmail2, generateApprovedMemberWelcomeEmail: generateApprovedMemberWelcomeEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
            const fullName = `${rowData.firstname} ${rowData.lastname}`;
            const baseUrl = "https://mms.estateagentscouncil.org";
            const passwordResetToken = generateVerificationToken3();
            const welcomeEmail = generateApprovedMemberWelcomeEmail2(
              fullName,
              rowData.email,
              membershipNumber,
              passwordResetToken,
              baseUrl
            );
            const emailSent = await sendEmail2({
              to: rowData.email,
              from: "noreply@estateagentscouncil.org",
              ...welcomeEmail
            });
            console.log(`Welcome email sent to ${fullName} (${rowData.email}): ${emailSent}`);
          } catch (emailError) {
            console.error(`Failed to send welcome email to ${rowData.email}:`, emailError);
          }
          results.members.push({
            firstName: newMember.firstName,
            lastName: newMember.lastName,
            email: newMember.email,
            membershipNumber: newMember.membershipNumber
          });
          results.succeeded++;
        } catch (memberError) {
          console.error(`Failed to create member for row ${rowNumber}:`, memberError);
          results.errors.push({
            row: rowNumber,
            error: `Failed to create member: ${memberError.message}`,
            data: values
          });
          results.failed++;
        }
      }
      results.success = results.succeeded > 0;
      res.status(200).json(results);
    } catch (error) {
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
  app2.get("/api/admin/organizations", requireAuth3, async (req, res) => {
    try {
      const allOrganizations = await storage.getAllOrganizationsWithMembers();
      res.json(allOrganizations);
    } catch (error) {
      console.error("Admin organizations fetch error:", error);
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });
  app2.get("/api/admin/applicants", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const applicants2 = await storage.listApplicants();
      res.json(applicants2 || []);
    } catch (error) {
      console.error("Admin applicants fetch error:", error);
      res.status(500).json({ message: "Failed to fetch applicants" });
    }
  });
  app2.get("/api/admin/organization-applicants", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const orgApplicants = await storage.listOrganizationApplicants();
      res.json(orgApplicants || []);
    } catch (error) {
      console.error("Admin organization applicants fetch error:", error);
      res.status(500).json({ message: "Failed to fetch organization applicants" });
    }
  });
  app2.put("/api/admin/applicants/:id", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const currentApplicant = await storage.getApplicant(id);
      if (!currentApplicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      const applicant = await storage.updateApplicant(id, updates);
      if (updates.status === "approved" && currentApplicant.status !== "approved") {
        console.log(`Converting approved applicant ${applicant.applicantId} to member...`);
        try {
          const passwordResetToken = randomBytes4(32).toString("hex");
          const passwordResetExpires = new Date(Date.now() + 24 * 60 * 60 * 1e3);
          const hashedPassword = await hashPassword("temp_" + randomBytes4(8).toString("hex"));
          const membershipNumber = applicant.applicantId.replace("APP-", "EAC-");
          const newUser = await storage.createUser({
            email: applicant.email,
            password: hashedPassword,
            firstName: applicant.firstName,
            lastName: applicant.surname,
            role: "member_manager",
            // Set as member role
            status: "active",
            emailVerified: applicant.emailVerified,
            passwordResetToken,
            passwordResetExpires
          });
          const newMember = await storage.createMember({
            userId: newUser.id,
            firstName: applicant.firstName,
            lastName: applicant.surname,
            email: applicant.email,
            memberType: "real_estate_agent",
            // Default type, can be customized
            membershipStatus: "active",
            membershipNumber,
            // Use converted application ID
            joinedDate: /* @__PURE__ */ new Date(),
            expiryDate: new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() + 1))
            // 1 year from now
          });
          const { sendEmail: sendEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
          const { generateApprovedMemberWelcomeEmail: generateApprovedMemberWelcomeEmail2 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
          const welcomeEmail = generateApprovedMemberWelcomeEmail2(
            `${applicant.firstName} ${applicant.surname}`,
            applicant.email,
            newMember.membershipNumber || "Pending",
            passwordResetToken,
            "https://mms.estateagentscouncil.org"
          );
          const emailSent = await sendEmail2({
            to: applicant.email,
            from: "noreply@estateagentscouncil.org",
            ...welcomeEmail
          });
          console.log(`Member ${membershipNumber} created successfully. Welcome email sent: ${emailSent}`);
          res.json({
            ...applicant,
            memberCreated: true,
            membershipNumber: newMember.membershipNumber,
            userId: newUser.id,
            memberId: newMember.id,
            emailSent
          });
        } catch (memberCreationError) {
          console.error("Member creation error:", memberCreationError);
          res.json({
            ...applicant,
            memberCreated: false,
            error: "Applicant approved but member account creation failed: " + memberCreationError.message
          });
        }
      } else {
        res.json(applicant);
      }
    } catch (error) {
      console.error("Update applicant error:", error);
      res.status(500).json({ message: "Failed to update applicant" });
    }
  });
  app2.put("/api/admin/organization-applicants/:id", requireAuth3, authorizeRole(STAFF_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const orgApplicant = await storage.updateOrganizationApplicant(id, updates);
      res.json(orgApplicant);
    } catch (error) {
      console.error("Update organization applicant error:", error);
      res.status(500).json({ message: "Failed to update organization applicant" });
    }
  });
  app2.get("/api/admin/applications", requireAuth3, async (req, res) => {
    try {
      const applications = await storage.getPendingApplications();
      res.json(applications);
    } catch (error) {
      console.error("Admin applications fetch error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  app2.get("/api/settings", requireAuth3, authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const settingsRows = await db.select().from(systemSettings);
      const settings = {};
      for (const row of settingsRows) {
        try {
          settings[row.key] = JSON.parse(row.value);
        } catch {
          settings[row.key] = row.value;
        }
      }
      const defaults = {
        // Organization Settings
        organizationName: "Estate Agents Council of Zimbabwe",
        contactEmail: "admin@eacz.org",
        phone: "+263 4 123456",
        website: "https://eacz.org",
        // Business Settings
        membershipFee: 500,
        applicationFee: 100,
        renewalDeadline: 30,
        cpdRequirement: 20,
        // User Management Settings
        maxLoginAttempts: 3,
        sessionTimeout: 60,
        passwordMinLength: 8,
        accountLockout: 15,
        // Security Settings
        jwtExpiry: 24,
        refreshTokenExpiry: 7,
        apiRateLimit: 1e3,
        // Email Settings
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpUsername: "noreply@eacz.org",
        // Notification Preferences
        welcomeEmail: true,
        paymentReminder: true
      };
      const finalSettings = { ...defaults, ...settings };
      res.json(finalSettings);
    } catch (error) {
      console.error("Settings fetch error:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  app2.put("/api/settings", requireAuth3, authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const updates = req.body;
      const userId = req.user?.id;
      console.log("Settings update request - User ID:", userId);
      console.log("Settings update request - Number of settings:", Object.keys(updates).length);
      console.log("Settings update request - Keys:", Object.keys(updates).join(", "));
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const savedSettings = [];
      const failedSettings = [];
      for (const [key, value] of Object.entries(updates)) {
        try {
          const jsonValue = JSON.stringify(value);
          await db.insert(systemSettings).values({
            key,
            value: jsonValue,
            updatedBy: userId,
            updatedAt: /* @__PURE__ */ new Date()
          }).onConflictDoUpdate({
            target: systemSettings.key,
            set: {
              value: jsonValue,
              updatedBy: userId,
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
          savedSettings.push(key);
          console.log(`\u2713 Saved setting: ${key} = ${jsonValue}`);
        } catch (settingError) {
          console.error(`\u2717 Failed to save setting ${key}:`, settingError.message);
          failedSettings.push({ key, error: settingError.message });
        }
      }
      console.log(`Settings update complete - Saved: ${savedSettings.length}, Failed: ${failedSettings.length}`);
      if (failedSettings.length > 0) {
        return res.status(207).json({
          message: "Settings partially updated",
          saved: savedSettings.length,
          failed: failedSettings.length,
          failures: failedSettings
        });
      }
      res.json({
        message: "Settings updated successfully",
        count: savedSettings.length,
        saved: savedSettings
      });
    } catch (error) {
      console.error("Settings update error:", error);
      res.status(500).json({ message: "Failed to update settings", error: error.message });
    }
  });
  app2.get("/api/members/profile", requireAuth3, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      let member = await storage.getMemberByUserId(userId);
      if (!member && req.user?.email) {
        member = await storage.getMemberByEmail(req.user.email);
      }
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Member profile fetch error:", error);
      res.status(500).json({ message: "Failed to fetch member profile" });
    }
  });
  app2.put("/api/members/profile", requireAuth3, async (req, res) => {
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
    } catch (error) {
      console.error("Member profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app2.put("/api/members/professional", requireAuth3, async (req, res) => {
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
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : void 0,
        nationalId: req.body.nationalId,
        memberType: req.body.memberType
      };
      await storage.updateMember(member.id, updates);
      res.json({ message: "Professional details updated successfully" });
    } catch (error) {
      console.error("Professional details update error:", error);
      res.status(500).json({ message: "Failed to update professional details" });
    }
  });
  app2.put("/api/auth/change-password", requireAuth3, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isValid = await storage.verifyPassword(user.email, currentPassword);
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      await storage.updateUserPassword(req.user.id, newPassword);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.get("/api/members/documents", requireAuth3, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const member = await storage.getMemberByUserId(userId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      const documents2 = await storage.getDocumentsByMember(member.id);
      res.json(documents2);
    } catch (error) {
      console.error("Member documents fetch error:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  app2.get("/api/members/payments", requireAuth3, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const member = await storage.getMemberByUserId(userId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      const payments2 = await storage.getPaymentsByMember(member.id);
      res.json(payments2);
    } catch (error) {
      console.error("Member payments fetch error:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });
  app2.get("/api/organization/profile", requireAuth3, async (req, res) => {
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
    } catch (error) {
      console.error("Organization profile fetch error:", error);
      res.status(500).json({ message: "Failed to fetch organization profile" });
    }
  });
  app2.put("/api/organization/profile", requireAuth3, async (req, res) => {
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
    } catch (error) {
      console.error("Organization profile update error:", error);
      res.status(500).json({ message: "Failed to update organization profile" });
    }
  });
  app2.get("/api/organization/members", requireAuth3, async (req, res) => {
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
      const orgMembers = allMembers.filter((m) => m.organizationId === member.organizationId);
      res.json(orgMembers);
    } catch (error) {
      console.error("Organization members fetch error:", error);
      res.status(500).json({ message: "Failed to fetch organization members" });
    }
  });
  app2.get("/api/admin/users", requireAuth3, async (req, res) => {
    try {
      const users4 = await storage.getAllUsers();
      res.json(users4);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/users/role/:role", requireAuth3, async (req, res) => {
    try {
      const { role } = req.params;
      const users4 = await storage.getUsersByRole(role);
      res.json(users4);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/admin/users/:id", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/users/:id/lock", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const { lockedUntil } = req.body;
      const user = await storage.lockUser(id, new Date(lockedUntil));
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/users/:id/unlock", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.unlockUser(id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/users/welcome-emails", requireAuth3, async (req, res) => {
    try {
      const { userIds } = req.body;
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "User IDs array is required" });
      }
      const users4 = await Promise.all(
        userIds.map((id) => storage.getUser(id))
      );
      const validUsers = users4.filter((user) => user !== void 0);
      console.log(
        `Sending welcome emails to ${validUsers.length} users:`,
        validUsers.map((u) => u.email)
      );
      res.json({
        success: true,
        message: `Welcome emails queued for ${validUsers.length} users`,
        emailsSent: validUsers.length
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/users/password-reset-emails", requireAuth3, async (req, res) => {
    try {
      const { userIds } = req.body;
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "User IDs array is required" });
      }
      const users4 = await Promise.all(
        userIds.map((id) => storage.getUser(id))
      );
      const validUsers = users4.filter((user) => user !== void 0);
      console.log(
        `Sending password reset emails to ${validUsers.length} users:`,
        validUsers.map((u) => u.email)
      );
      res.json({
        success: true,
        message: `Password reset emails queued for ${validUsers.length} users`,
        emailsSent: validUsers.length
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/payments", authorizeRole(["admin", "accountant", "super_admin", "staff"]), async (req, res) => {
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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/finance/stats", authorizeRole(FINANCE_ROLES), async (req, res) => {
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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/payments/recent", authorizeRole(FINANCE_ROLES), async (req, res) => {
    try {
      const payments2 = await storage.getRecentPayments(10);
      res.json(payments2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/admin/payments/:id/status", authorizeRole(FINANCE_ROLES), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const validStatuses = ["pending", "processing", "completed", "failed", "cancelled", "refunded"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      const payment = await storage.updatePayment(id, { status });
      res.json(payment);
    } catch (error) {
      console.error("Update payment status error:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/payments/record", authorizeRole(FINANCE_ROLES), async (req, res) => {
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
        status: "completed",
        paidAt: paidAt ? new Date(paidAt) : /* @__PURE__ */ new Date(),
        memberId,
        organizationId
      });
      res.json(payment);
    } catch (error) {
      console.error("Record payment error:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/settings", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/settings/:key", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const { key } = req.params;
      if (!key || key.trim() === "") {
        return res.status(400).json({ message: "Setting key is required" });
      }
      const setting = await storage.getSetting(key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/admin/settings", authorizeRole(ADMIN_ROLES), async (req, res) => {
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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  const { previewIdFormatMigration: previewIdFormatMigration2, executeIdFormatMigration: executeIdFormatMigration2, getMigrationStatus: getMigrationStatus2 } = await Promise.resolve().then(() => (init_idMigration(), idMigration_exports));
  app2.get("/api/admin/migration/id-format/status", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const status = await getMigrationStatus2();
      res.json(status);
    } catch (error) {
      console.error("Migration status check error:", error);
      res.status(500).json({ message: "Failed to check migration status" });
    }
  });
  app2.get("/api/admin/migration/id-format/preview", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const preview = await previewIdFormatMigration2();
      res.json(preview);
    } catch (error) {
      console.error("Migration preview error:", error);
      res.status(500).json({ message: "Failed to generate migration preview" });
    }
  });
  app2.post("/api/admin/migration/id-format/execute", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      console.log("\u{1F680} Starting ID format migration execution by admin:", req.user?.email);
      const result = await executeIdFormatMigration2();
      if (result.success) {
        console.log("\u2705 ID format migration completed successfully");
        res.json({
          success: true,
          message: `Migration completed! Updated ${result.membersUpdated} members and ${result.organizationsUpdated} organizations`,
          membersUpdated: result.membersUpdated,
          organizationsUpdated: result.organizationsUpdated
        });
      } else {
        console.error("\u274C ID format migration failed:", result.error);
        res.status(500).json({
          success: false,
          message: "Migration failed",
          error: result.error
        });
      }
    } catch (error) {
      console.error("Migration execution error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to execute migration",
        error: error.message
      });
    }
  });
  app2.put("/api/admin/settings/:key", authorizeRole(ADMIN_ROLES), async (req, res) => {
    try {
      const { key } = req.params;
      if (!key || key.trim() === "") {
        return res.status(400).json({ message: "Setting key is required" });
      }
      const validatedBody = singleSettingUpdateSchema.safeParse(req.body);
      if (!validatedBody.success) {
        return res.status(400).json({
          message: "Invalid request body",
          errors: validatedBody.error.errors
        });
      }
      const { value, description } = validatedBody.data;
      const updatedSetting = await storage.updateSetting(key, value, description, req.user?.id);
      res.json(updatedSetting);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/payments/range", requireAuth3, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const payments2 = await storage.getPaymentsByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
      res.json(payments2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/payments/method/:method", requireAuth3, async (req, res) => {
    try {
      const { method } = req.params;
      const payments2 = await storage.getPaymentsByMethod(method);
      res.json(payments2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/payments/:id/refund", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const { refundAmount, reason } = req.body;
      const payment = await storage.processRefund(id, refundAmount, reason);
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/payments/:id/installments", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const installments = await storage.getInstallmentsByPayment(id);
      res.json(installments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/payments/google-pay", async (req, res) => {
    try {
      const { processGooglePayPayment: processGooglePayPayment2 } = await Promise.resolve().then(() => (init_googlePayService(), googlePayService_exports));
      const paymentRequest = req.body;
      const result = await processGooglePayPayment2(paymentRequest);
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        status: "failed",
        message: "Payment processing failed",
        error: error.message
      });
    }
  });
  app2.get("/api/payments/google-pay/config", (req, res) => {
    try {
      const { getGooglePayConfig: getGooglePayConfig2 } = (init_googlePayService(), __toCommonJS(googlePayService_exports));
      const config = getGooglePayConfig2();
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/payments/google-pay/verify-token", async (req, res) => {
    try {
      const { verifyGooglePayToken: verifyGooglePayToken2 } = await Promise.resolve().then(() => (init_googlePayService(), googlePayService_exports));
      const { token } = req.body;
      const isValid = await verifyGooglePayToken2(token);
      res.json({ valid: isValid });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/payments/google-pay/:id/refund", requireAuth3, async (req, res) => {
    try {
      const { refundGooglePayPayment: refundGooglePayPayment2 } = await Promise.resolve().then(() => (init_googlePayService(), googlePayService_exports));
      const { id } = req.params;
      const { amount, reason } = req.body;
      const result = await refundGooglePayPayment2(id, amount, reason);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        status: "failed",
        message: "Refund processing failed",
        error: error.message
      });
    }
  });
  app2.get("/api/admin/applications", requireAuth3, async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/organization-applications", requireAuth3, async (req, res) => {
    try {
      const applications = await storage.getAllOrganizationApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/organization-applications/:id", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getOrganizationApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Organization application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/organization-applications/:id/review", requireAuth3, async (req, res) => {
    try {
      console.log("Organization review request:", { id: req.params.id, action: req.body.action, userId: req.user?.id });
      const { id } = req.params;
      const { action, notes } = req.body;
      if (!["approve", "approved", "reject", "rejected"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'approve', 'approved', 'reject', or 'rejected'" });
      }
      const isApprove = ["approve", "approved"].includes(action);
      const updates = {
        status: isApprove ? "accepted" : "rejected",
        // reviewNotes: notes,
        // reviewedBy: req.user?.id,
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (isApprove) {
      } else {
      }
      const updatedApplication = await storage.updateOrganizationApplication(id, updates);
      res.json(updatedApplication);
    } catch (error) {
      console.error("Organization application review error:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/applications/status/:status", requireAuth3, async (req, res) => {
    try {
      const { status } = req.params;
      const applications = await storage.getApplicationsByStatus(status);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/applications/stage/:stage", requireAuth3, async (req, res) => {
    try {
      const { stage } = req.params;
      const applications = await storage.getApplicationsByStage(stage);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/applications/:id/assign", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const { reviewerId } = req.body;
      const application = await storage.assignApplicationReviewer(id, reviewerId);
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/applications/:id/move-to-under-review", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const { applicationType } = req.body;
      const { moveToUnderReview: moveToUnderReview2 } = await Promise.resolve().then(() => (init_applicationWorkflowService(), applicationWorkflowService_exports));
      await moveToUnderReview2({
        applicationId: id,
        applicationType: applicationType || "individual",
        reviewerId: req.user?.id || ""
      });
      res.json({ success: true, message: "Application moved to Under Review stage" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/applications/:id/move-to-document-review", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const { applicationType } = req.body;
      const { moveToDocumentReview: moveToDocumentReview2 } = await Promise.resolve().then(() => (init_applicationWorkflowService(), applicationWorkflowService_exports));
      await moveToDocumentReview2({
        applicationId: id,
        applicationType: applicationType || "individual",
        reviewerId: req.user?.id || ""
      });
      res.json({ success: true, message: "Application moved to Document Review stage" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/applications/:id/move-to-payment-review", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const { applicationType } = req.body;
      const { moveToPaymentReview: moveToPaymentReview2 } = await Promise.resolve().then(() => (init_applicationWorkflowService(), applicationWorkflowService_exports));
      await moveToPaymentReview2({
        applicationId: id,
        applicationType: applicationType || "individual",
        reviewerId: req.user?.id || ""
      });
      res.json({ success: true, message: "Application moved to Payment Review stage" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/applications/:id/approve-final", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const { applicationType, notes } = req.body;
      const { approveAndCreateMember: approveAndCreateMember2 } = await Promise.resolve().then(() => (init_applicationWorkflowService(), applicationWorkflowService_exports));
      const result = await approveAndCreateMember2({
        applicationId: id,
        applicationType: applicationType || "individual",
        reviewerId: req.user?.id || "",
        notes
      });
      res.json({
        success: true,
        message: "Application approved and member/organization created",
        record: result
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/applications/:id/review", requireAuth3, async (req, res) => {
    try {
      console.log("Review application request:", { id: req.params.id, action: req.body.action, userId: req.user?.id });
      const { id } = req.params;
      const { action, notes } = req.body;
      if (!["approve", "approved", "reject", "rejected"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'approve', 'approved', 'reject', or 'rejected'" });
      }
      const isApprove = ["approve", "approved"].includes(action);
      const updates = {
        status: isApprove ? "accepted" : "rejected",
        reviewNotes: notes,
        reviewedBy: req.user?.id,
        reviewStartedAt: /* @__PURE__ */ new Date()
      };
      if (isApprove) {
        updates.approvedAt = /* @__PURE__ */ new Date();
      } else {
        updates.rejectedAt = /* @__PURE__ */ new Date();
        if (notes) {
          updates.rejectionReason = notes;
        }
      }
      const updatedApplication = await storage.updateMemberApplication(id, updates);
      res.json(updatedApplication);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/applications/:id/workflows", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const workflows = await storage.getWorkflowsByApplication(id);
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/workflows/stage/:stage", requireAuth3, async (req, res) => {
    try {
      const { stage } = req.params;
      const workflows = await storage.getWorkflowsByStage(stage);
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/workflows/assignee/:userId", requireAuth3, async (req, res) => {
    try {
      const { userId } = req.params;
      const workflows = await storage.getWorkflowsByAssignee(userId);
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/users/:id/permissions", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const permissions = await storage.getUserPermissions(id);
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/users/:id/permissions/check", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const { permission, resource } = req.query;
      const hasPermission = await storage.checkUserPermission(
        id,
        permission,
        resource
      );
      res.json({ hasPermission });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/notifications/user/:userId", requireAuth3, async (req, res) => {
    try {
      const { userId } = req.params;
      const notifications2 = await storage.getUserNotifications(userId);
      res.json(notifications2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/notifications/member/:memberId", requireAuth3, async (req, res) => {
    try {
      const { memberId } = req.params;
      const notifications2 = await storage.getMemberNotifications(memberId);
      res.json(notifications2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/notifications/:id/opened", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.markNotificationOpened(id);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/notifications/pending", requireAuth3, async (req, res) => {
    try {
      const notifications2 = await storage.getPendingNotifications();
      res.json(notifications2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/admin/audit-logs", requireAuth3, async (req, res) => {
    try {
      const { userId, resource, action } = req.query;
      const logs = await storage.getAuditLogs({
        userId,
        resource,
        action
      });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.get("/api/users/:id/sessions", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const sessions = await storage.getUserSessions(id);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/sessions/:id/deactivate", requireAuth3, async (req, res) => {
    try {
      const { id } = req.params;
      const session3 = await storage.deactivateSession(id);
      res.json(session3);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/admin/sessions/cleanup", requireAuth3, async (req, res) => {
    try {
      const count2 = await storage.cleanupExpiredSessions();
      res.json({ cleanedSessions: count2 });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  registerPaymentRoutes(app2);
  const objectStorageService = new ObjectStorageService();
  app2.post("/api/uploads/presign", requireUserOrApplicantAuth, async (req, res) => {
    try {
      const { docType, fileSize, mimeType, fileName, applicationId } = req.body;
      const userId = req.authUserId || "unknown";
      if (!docType || !fileSize || !mimeType || !fileName) {
        await logSecurityEvent(
          "PRESIGN_VALIDATION_FAILED",
          userId,
          applicationId || "unknown",
          { reason: "Missing required parameters", docType, fileName },
          false
        );
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Document type, file size, MIME type, and filename are required",
          code: "MISSING_PRESIGN_PARAMETERS"
        });
      }
      if (applicationId) {
        const authResult = await checkApplicationAuthorization(userId, applicationId);
        if (!authResult.authorized) {
          await logSecurityEvent(
            "PRESIGN_AUTHORIZATION_DENIED",
            userId,
            applicationId,
            { reason: authResult.reason, docType, fileName },
            false
          );
          return res.status(403).json({
            type: "https://tools.ietf.org/html/rfc7807",
            title: "Forbidden",
            status: 403,
            detail: authResult.reason,
            code: "INSUFFICIENT_PERMISSIONS"
          });
        }
        console.log(`Authorization granted for presign: User ${userId} can upload ${docType} to application ${applicationId}`);
      }
      const typeConfig = DOCUMENT_TYPE_CONFIG[docType];
      if (!typeConfig) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Invalid document type",
          code: "INVALID_DOCUMENT_TYPE"
        });
      }
      if (fileSize > typeConfig.maxSize) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: `File size (${(fileSize / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size of ${(typeConfig.maxSize / 1024 / 1024).toFixed(1)}MB for ${typeConfig.label}`,
          code: "FILE_SIZE_EXCEEDED"
        });
      }
      if (!typeConfig.allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: `File type '${mimeType}' not allowed for ${typeConfig.label}. Allowed types: ${typeConfig.allowedMimeTypes.join(", ")}`,
          code: "INVALID_FILE_TYPE"
        });
      }
      const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
      if (!typeConfig.allowedExtensions.includes(extension)) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: `File extension '${extension}' not allowed for ${typeConfig.label}. Allowed extensions: ${typeConfig.allowedExtensions.join(", ")}`,
          code: "INVALID_FILE_EXTENSION"
        });
      }
      const fileKey = `uploads/${docType}/${Date.now()}-${randomUUID3()}${extension}`;
      const privateObjectDir = objectStorageService.getPrivateObjectDir();
      if (!privateObjectDir) {
        throw new Error("Object storage upload is not configured. PRIVATE_OBJECT_DIR environment variable is missing.");
      }
      const fullPath = `${privateObjectDir}/${fileKey}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const signedURL = await signObjectURL({
        bucketName,
        objectName,
        method: "PUT",
        ttlSec: 900
        // 15 minutes
      });
      await logSecurityEvent(
        "PRESIGN_SUCCESS",
        userId,
        applicationId || "unknown",
        { docType, fileName, fileKey },
        true
      );
      res.json({
        uploadUrl: signedURL,
        fileKey,
        expiresIn: 900,
        maxSize: typeConfig.maxSize,
        allowedMimeTypes: typeConfig.allowedMimeTypes,
        message: "Presigned URL generated successfully. Upload your file then call /api/uploads/finalize to complete the process."
      });
    } catch (error) {
      console.error("Presign error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to generate presigned URL",
        code: "PRESIGN_ERROR"
      });
    }
  });
  const uploadRateLimit = /* @__PURE__ */ new Map();
  const MAX_UPLOADS_PER_HOUR = 10;
  const RATE_LIMIT_WINDOW = 60 * 60 * 1e3;
  function checkRateLimit(ip) {
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
  app2.post("/api/uploads/presign-public", async (req, res) => {
    try {
      const { docType, fileSize, mimeType, fileName } = req.body;
      const clientIP = req.ip || req.connection.remoteAddress || "unknown";
      if (!checkRateLimit(clientIP)) {
        return res.status(429).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Too Many Requests",
          status: 429,
          detail: "Upload rate limit exceeded. Please try again later.",
          code: "RATE_LIMIT_EXCEEDED"
        });
      }
      if (!docType || !fileSize || !mimeType || !fileName) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Document type, file size, MIME type, and filename are required",
          code: "MISSING_PRESIGN_PARAMETERS"
        });
      }
      const allowedAppDocTypes = ["id_or_passport", "birth_certificate", "o_level_cert", "a_level_cert", "equivalent_cert"];
      if (!allowedAppDocTypes.includes(docType)) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: `Document type '${docType}' not allowed for public uploads. Allowed types: ${allowedAppDocTypes.join(", ")}`,
          code: "INVALID_DOCUMENT_TYPE"
        });
      }
      const typeConfig = DOCUMENT_TYPE_CONFIG[docType];
      if (!typeConfig) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Invalid document type configuration",
          code: "INVALID_DOCUMENT_TYPE"
        });
      }
      if (fileSize > typeConfig.maxSize) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: `File size (${(fileSize / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size of ${(typeConfig.maxSize / 1024 / 1024).toFixed(1)}MB for ${typeConfig.label}`,
          code: "FILE_SIZE_EXCEEDED"
        });
      }
      if (!typeConfig.allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: `File type '${mimeType}' not allowed for ${typeConfig.label}. Allowed types: ${typeConfig.allowedMimeTypes.join(", ")}`,
          code: "INVALID_FILE_TYPE"
        });
      }
      const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
      if (!typeConfig.allowedExtensions.includes(extension)) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: `File extension '${extension}' not allowed for ${typeConfig.label}. Allowed extensions: ${typeConfig.allowedExtensions.join(", ")}`,
          code: "INVALID_FILE_EXTENSION"
        });
      }
      if (!req.session.draftId) {
        req.session.draftId = randomUUID3();
        console.log(`Created new draft session: ${req.session.draftId}`);
      }
      const draftId = req.session.draftId;
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileKey = `applications/drafts/${draftId}/${docType}/${randomUUID3()}-${sanitizedFileName}`;
      const privateObjectDir = objectStorageService.getPrivateObjectDir();
      if (!privateObjectDir) {
        throw new Error("Object storage upload is not configured. PRIVATE_OBJECT_DIR environment variable is missing.");
      }
      const fullPath = `${privateObjectDir}/${fileKey}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const signedURL = await signObjectURL({
        bucketName,
        objectName,
        method: "PUT",
        ttlSec: 300
        // 5 minutes
      });
      console.log(`Public presign successful - Draft: ${draftId}, DocType: ${docType}, File: ${sanitizedFileName}`);
      res.json({
        uploadUrl: signedURL,
        objectPath: fileKey,
        draftId,
        expiresIn: 300,
        maxSize: typeConfig.maxSize,
        allowedMimeTypes: typeConfig.allowedMimeTypes
      });
    } catch (error) {
      console.error("Public presign error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to generate presigned URL",
        code: "PRESIGN_ERROR"
      });
    }
  });
  app2.post("/api/uploads/finalize", requireUserOrApplicantAuth, async (req, res) => {
    try {
      const { fileKey, docType, fileName, mimeType, applicationId, applicationType } = req.body;
      const userId = req.authUserId || "unknown";
      if (!fileKey || !docType || !fileName || !mimeType) {
        await logSecurityEvent(
          "FINALIZE_VALIDATION_FAILED",
          userId,
          applicationId || "unknown",
          { reason: "Missing required parameters", docType, fileName, fileKey },
          false
        );
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "File key, document type, filename, and MIME type are required",
          code: "MISSING_FINALIZE_PARAMETERS"
        });
      }
      if (applicationId) {
        const authResult = await checkApplicationAuthorization(userId, applicationId, applicationType);
        if (!authResult.authorized) {
          await logSecurityEvent(
            "FINALIZE_AUTHORIZATION_DENIED",
            userId,
            applicationId,
            { reason: authResult.reason, docType, fileName, fileKey, applicationType },
            false
          );
          return res.status(403).json({
            type: "https://tools.ietf.org/html/rfc7807",
            title: "Forbidden",
            status: 403,
            detail: authResult.reason,
            code: "INSUFFICIENT_PERMISSIONS"
          });
        }
        console.log(`Authorization granted for finalize: User ${userId} can finalize ${docType} upload for application ${applicationId}`);
      }
      const privateObjectDir = objectStorageService.getPrivateObjectDir();
      if (!privateObjectDir) {
        throw new Error("Object storage not configured");
      }
      const fullPath = `${privateObjectDir}/${fileKey}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = getObjectStorageClient().bucket(bucketName);
      const file = bucket.file(objectName);
      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Not Found",
          status: 404,
          detail: "Uploaded file not found. Please upload the file first using the presigned URL.",
          code: "FILE_NOT_FOUND"
        });
      }
      const [fileBuffer] = await file.download();
      const validationResult = await FileValidator.validateFile(
        fileBuffer,
        fileName,
        mimeType,
        { documentType: docType }
      );
      if (!validationResult.isValid) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "File Validation Failed",
          status: 400,
          detail: validationResult.errors.join("; "),
          code: "FILE_VALIDATION_FAILED",
          errors: validationResult.errors,
          warnings: validationResult.warnings
        });
      }
      const fileHash = validationResult.fileInfo.hash;
      const fileSizeActual = validationResult.fileInfo.size;
      const existingDoc = await db.select().from(uploadedDocuments2).where(eq14(uploadedDocuments2.sha256, fileHash)).limit(1);
      if (existingDoc.length > 0) {
        const duplicate = existingDoc[0];
        return res.status(409).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Duplicate File",
          status: 409,
          detail: "A file with identical content already exists",
          code: "DUPLICATE_FILE",
          conflictInfo: {
            existingFileId: duplicate.id,
            existingFileName: duplicate.fileName,
            existingDocType: duplicate.docType,
            uploadedAt: duplicate.createdAt
          }
        });
      }
      const [documentRecord] = await db.insert(uploadedDocuments2).values({
        applicationType: applicationType || "individual",
        applicationIdFk: applicationId || "",
        docType,
        fileKey,
        fileName,
        mime: mimeType,
        sizeBytes: fileSizeActual,
        sha256: fileHash,
        status: "uploaded"
      }).returning();
      await logSecurityEvent(
        "FINALIZE_SUCCESS",
        userId,
        applicationId || "unknown",
        { docType, fileName, fileKey, documentId: documentRecord.id, fileHash, fileSize: fileSizeActual },
        true
      );
      res.status(201).json({
        documentId: documentRecord.id,
        fileKey,
        fileName,
        docType,
        fileHash,
        fileSize: fileSizeActual,
        status: "uploaded",
        warnings: validationResult.warnings,
        message: "File uploaded and validated successfully"
      });
    } catch (error) {
      console.error("Finalize upload error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to finalize upload",
        code: "FINALIZE_ERROR"
      });
    }
  });
  app2.post("/api/object-storage/upload-url", async (req, res) => {
    try {
      const { documentType, fileSize, mimeType, fileName } = req.body;
      if (!documentType || !fileSize || !mimeType || !fileName) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Document type, file size, MIME type, and filename are required for secure uploads",
          code: "MISSING_UPLOAD_PARAMETERS"
        });
      }
      const { DOCUMENT_TYPE_CONFIG: DOCUMENT_TYPE_CONFIG2 } = await Promise.resolve().then(() => (init_fileValidation(), fileValidation_exports));
      if (!DOCUMENT_TYPE_CONFIG2[documentType]) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Invalid document type",
          code: "INVALID_DOCUMENT_TYPE"
        });
      }
      const typeConfig = DOCUMENT_TYPE_CONFIG2[documentType];
      if (fileSize > typeConfig.maxSize) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: `File size (${(fileSize / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size of ${(typeConfig.maxSize / 1024 / 1024).toFixed(1)}MB for ${typeConfig.label}`,
          code: "FILE_SIZE_EXCEEDED"
        });
      }
      if (!typeConfig.allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: `File type '${mimeType}' not allowed for ${typeConfig.label}. Allowed types: ${typeConfig.allowedMimeTypes.join(", ")}`,
          code: "INVALID_FILE_TYPE"
        });
      }
      const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
      if (!typeConfig.allowedExtensions.includes(extension)) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: `File extension '${extension}' not allowed for ${typeConfig.label}. Allowed extensions: ${typeConfig.allowedExtensions.join(", ")}`,
          code: "INVALID_FILE_EXTENSION"
        });
      }
      const { ObjectStorageService: ObjectStorageService2 } = await Promise.resolve().then(() => (init_objectStorage(), objectStorage_exports));
      const objectStorageService2 = new ObjectStorageService2();
      const uploadUrl = await objectStorageService2.getObjectEntityUploadURL();
      res.json({
        uploadUrl,
        constraints: {
          maxSize: typeConfig.maxSize,
          allowedMimeTypes: typeConfig.allowedMimeTypes,
          allowedExtensions: typeConfig.allowedExtensions
        }
      });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: error.message || "Object storage is not configured properly",
        code: "UPLOAD_URL_ERROR"
      });
    }
  });
  app2.post("/api/object-storage/validate-file", async (req, res) => {
    try {
      const { uploadUrl, documentType, fileName, mimeType } = req.body;
      if (!uploadUrl || !documentType || !fileName || !mimeType) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Upload URL, document type, filename, and MIME type are required",
          code: "MISSING_VALIDATION_PARAMETERS"
        });
      }
      const response = await fetch(uploadUrl);
      if (!response.ok) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "Bad Request",
          status: 400,
          detail: "Failed to access uploaded file for validation",
          code: "FILE_ACCESS_ERROR"
        });
      }
      const fileBuffer = Buffer.from(await response.arrayBuffer());
      const { FileValidator: FileValidator2 } = await Promise.resolve().then(() => (init_fileValidation(), fileValidation_exports));
      const validationResult = await FileValidator2.validateFile(
        fileBuffer,
        fileName,
        mimeType,
        { documentType }
      );
      if (!validationResult.isValid) {
        return res.status(400).json({
          type: "https://tools.ietf.org/html/rfc7807",
          title: "File Validation Failed",
          status: 400,
          detail: validationResult.errors.join("; "),
          code: "FILE_VALIDATION_FAILED",
          errors: validationResult.errors,
          warnings: validationResult.warnings
        });
      }
      res.json({
        valid: true,
        fileHash: validationResult.fileInfo.hash,
        fileSize: validationResult.fileInfo.size,
        warnings: validationResult.warnings,
        message: "File validation successful"
      });
    } catch (error) {
      console.error("File validation error:", error);
      res.status(500).json({
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to validate uploaded file",
        code: "FILE_VALIDATION_ERROR"
      });
    }
  });
  app2.post("/api/uploads/simple", async (req, res) => {
    try {
      const {
        applicationId,
        applicationType,
        documentType,
        fileName,
        fileData,
        // base64 encoded
        mimeType
      } = req.body;
      if (!applicationId || !applicationType || !documentType || !fileName || !fileData || !mimeType) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "applicationId, applicationType, documentType, fileName, fileData, and mimeType are required"
        });
      }
      const base64Data = fileData.split(",")[1] || fileData;
      const sizeBytes = Math.ceil(base64Data.length * 3 / 4);
      const { DOCUMENT_TYPE_CONFIG: DOCUMENT_TYPE_CONFIG2 } = await Promise.resolve().then(() => (init_fileValidation(), fileValidation_exports));
      if (DOCUMENT_TYPE_CONFIG2[documentType]) {
        const typeConfig = DOCUMENT_TYPE_CONFIG2[documentType];
        const maxDbSize = Math.min(typeConfig.maxSize, 5 * 1024 * 1024);
        if (sizeBytes > maxDbSize) {
          return res.status(400).json({
            error: "File too large",
            details: `File size exceeds maximum of ${(maxDbSize / 1024 / 1024).toFixed(1)}MB for database storage`
          });
        }
        if (!typeConfig.allowedMimeTypes.includes(mimeType)) {
          return res.status(400).json({
            error: "Invalid file type",
            details: `File type '${mimeType}' not allowed. Allowed types: ${typeConfig.allowedMimeTypes.join(", ")}`
          });
        }
      }
      const document = await storage.createUploadedDocument({
        applicationIdFk: applicationId,
        applicationType,
        docType: documentType,
        fileName,
        fileData: base64Data,
        mime: mimeType,
        sizeBytes,
        status: "uploaded"
      });
      res.status(200).json({
        success: true,
        message: "Document uploaded successfully",
        documentId: document.id,
        fileName,
        sizeBytes
      });
    } catch (error) {
      console.error("Simple upload error:", error);
      res.status(500).json({
        error: "Upload failed",
        details: error.message || "Failed to upload document"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
var ADMIN_ROLES, FINANCE_ROLES, STAFF_ROLES, MEMBER_MANAGER_ROLES, PAYMENT_SORT_FIELDS, paginationQuerySchema, paymentsQuerySchema, renewalsQuerySchema, upload, financeStatsQuerySchema, settingsUpdateSchema, singleSettingUpdateSchema, renewalUpdateSchema, generateRenewalsSchema, casesQuerySchema2, caseUpdateSchema2, caseAssignmentSchema2, bulkCaseActionSchema2;
var init_routes = __esm({
  "server/routes.ts"() {
    "use strict";
    init_auth();
    init_clerkAuth();
    init_authRoutes();
    init_storage();
    init_paymentRoutes();
    init_applicationRoutes();
    init_notificationRoutes();
    init_userProfileRoutes();
    init_schema();
    init_db();
    init_objectStorage();
    init_fileValidation();
    init_auth();
    init_namingSeries();
    ADMIN_ROLES = ["admin", "super_admin"];
    FINANCE_ROLES = ["admin", "accountant", "super_admin"];
    STAFF_ROLES = ["admin", "member_manager", "super_admin", "staff"];
    MEMBER_MANAGER_ROLES = ["admin", "member_manager", "super_admin"];
    PAYMENT_SORT_FIELDS = ["createdAt", "amount", "status", "paymentNumber"];
    paginationQuerySchema = z8.object({
      limit: z8.string().optional().transform((val) => val ? parseInt(val) : void 0).refine((val) => val === void 0 || !isNaN(val) && val > 0 && val <= 1e3, {
        message: "Limit must be a positive number between 1 and 1000"
      }),
      offset: z8.string().optional().transform((val) => val ? parseInt(val) : void 0).refine((val) => val === void 0 || !isNaN(val) && val >= 0, {
        message: "Offset must be a non-negative number"
      })
    });
    paymentsQuerySchema = paginationQuerySchema.extend({
      status: z8.string().optional(),
      type: z8.string().optional(),
      search: z8.string().optional(),
      sortBy: z8.enum(PAYMENT_SORT_FIELDS).optional(),
      sortOrder: z8.enum(["asc", "desc"]).optional()
    });
    renewalsQuerySchema = paginationQuerySchema.extend({
      year: z8.string().optional().transform((val) => val ? parseInt(val) : void 0).refine((val) => val === void 0 || !isNaN(val) && val >= 2020 && val <= 2030, {
        message: "Year must be between 2020 and 2030"
      }),
      status: z8.string().optional(),
      search: z8.string().optional()
    });
    upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024
        // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== "text/csv" && !file.originalname.toLowerCase().endsWith(".csv")) {
          return cb(new Error("Only CSV files are allowed"));
        }
        cb(null, true);
      }
    });
    financeStatsQuerySchema = z8.object({
      startDate: z8.string().optional().transform((val) => val ? new Date(val) : void 0).refine((val) => val === void 0 || !isNaN(val.getTime()), {
        message: "Start date must be a valid date"
      }),
      endDate: z8.string().optional().transform((val) => val ? new Date(val) : void 0).refine((val) => val === void 0 || !isNaN(val.getTime()), {
        message: "End date must be a valid date"
      })
    });
    settingsUpdateSchema = z8.object({
      settings: z8.array(z8.object({
        key: z8.string().min(1).max(100).regex(/^[a-zA-Z0-9_.-]+$/, {
          message: "Key must contain only alphanumeric characters, underscores, dots, and hyphens"
        }),
        value: z8.string().max(1e4),
        description: z8.string().max(500).optional()
      })).min(1).max(50)
    });
    singleSettingUpdateSchema = z8.object({
      value: z8.string().min(1).max(1e4),
      description: z8.string().max(500).optional()
    });
    renewalUpdateSchema = z8.object({
      status: z8.enum(["pending", "reminded", "overdue", "completed", "lapsed"]).optional(),
      renewalFee: z8.string().optional().refine((val) => val === void 0 || !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: "Renewal fee must be a valid non-negative number"
      }),
      notes: z8.string().max(1e3).optional(),
      dueDate: z8.string().optional().transform((val) => val ? new Date(val) : void 0).refine((val) => val === void 0 || !isNaN(val.getTime()), {
        message: "Due date must be a valid date"
      })
    });
    generateRenewalsSchema = z8.object({
      year: z8.number().int().min(2020).max(2030),
      defaultFee: z8.number().positive().max(1e4).optional()
    });
    casesQuerySchema2 = paginationQuerySchema.extend({
      status: z8.string().optional(),
      priority: z8.string().optional(),
      type: z8.string().optional(),
      assignedTo: z8.string().optional(),
      search: z8.string().optional()
    });
    caseUpdateSchema2 = insertCaseSchema.partial().extend({
      resolution: z8.string().optional()
    });
    caseAssignmentSchema2 = z8.object({
      assignedTo: z8.string().uuid("Invalid user ID format").optional()
    });
    bulkCaseActionSchema2 = z8.object({
      caseIds: z8.array(z8.string().uuid("Invalid case ID format")).min(1).max(100),
      action: z8.enum(["resolve", "assign", "close"]),
      assignedTo: z8.string().uuid("Invalid user ID format").optional(),
      // For bulk assign
      resolution: z8.string().optional()
      // For bulk resolve
    });
  }
});

// server/index.ts
import dotenv from "dotenv";

// server/utils/env.ts
import { z } from "zod";
var envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("5000"),
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL URL"),
  DATABASE_URL_UNPOOLED: z.string().url().optional(),
  // Security
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters for security"),
  // Clerk Authentication
  CLERK_SECRET_KEY: z.string().startsWith("sk_", "CLERK_SECRET_KEY must start with sk_"),
  VITE_CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_", "VITE_CLERK_PUBLISHABLE_KEY must start with pk_"),
  // Email Service (ZeptoMail)
  Send_Mail_Token: z.string().min(50, "Send_Mail_Token is required for email service"),
  Host: z.string().min(1, "Email Host is required"),
  Sender_Address: z.string().email("Sender_Address must be a valid email"),
  // PayNow (Zimbabwe Payments) - Optional
  PAYNOW_INTEGRATION_ID: z.string().optional(),
  PAYNOW_INTEGRATION_KEY: z.string().uuid().optional(),
  PAYNOW_RETURN_URL: z.string().url().optional(),
  PAYNOW_RESULT_URL: z.string().url().optional(),
  // Base URL
  BASE_URL: z.string().url().optional(),
  // Google Cloud Storage - Optional
  GOOGLE_CLOUD_PROJECT_ID: z.string().optional(),
  GOOGLE_CLOUD_PRIVATE_KEY: z.string().optional(),
  GOOGLE_CLOUD_CLIENT_EMAIL: z.string().email().optional()
});
function validateEnv() {
  try {
    const env2 = envSchema.parse(process.env);
    console.log("\u2705 Environment variables validated successfully");
    return env2;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("\u274C Invalid environment variables:");
      console.error("");
      error.errors.forEach((err) => {
        const path3 = err.path.join(".");
        console.error(`  \u2022 ${path3}: ${err.message}`);
      });
      console.error("");
      console.error("\u{1F4A1} Please check your .env.local file and ensure all required variables are set correctly.");
      console.error("");
      process.exit(1);
    }
    throw error;
  }
}

// server/index.ts
import express2 from "express";

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv.config({ path: ".env.local" });
var env = validateEnv();
var app = express2();
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const { initializeApplicationCounters: initializeApplicationCounters2 } = await Promise.resolve().then(() => (init_namingSeries(), namingSeries_exports));
  await initializeApplicationCounters2();
  const { SessionService: SessionService2 } = await Promise.resolve().then(() => (init_sessionService(), sessionService_exports));
  SessionService2.startCleanup();
  log("Session cleanup service initialized");
  const { registerRoutes: registerRoutes2 } = await Promise.resolve().then(() => (init_routes(), routes_exports));
  const server = await registerRoutes2(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})();
