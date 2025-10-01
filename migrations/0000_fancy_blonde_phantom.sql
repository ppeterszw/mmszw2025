CREATE TYPE "public"."activity_type" AS ENUM('login', 'logout', 'profile_update', 'document_upload', 'payment', 'case_submission', 'event_registration', 'status_change', 'password_change', 'role_change', 'access_granted', 'access_denied');--> statement-breakpoint
CREATE TYPE "public"."applicant_status" AS ENUM('registered', 'email_verified', 'application_started', 'application_completed', 'under_review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."application_stage" AS ENUM('initial_review', 'document_verification', 'background_check', 'committee_review', 'final_approval', 'certificate_generation');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('draft', 'submitted', 'pre_validation', 'eligibility_review', 'document_review', 'needs_applicant_action', 'ready_for_registry', 'accepted', 'rejected', 'withdrawn', 'expired');--> statement-breakpoint
CREATE TYPE "public"."application_type" AS ENUM('individual', 'organization');--> statement-breakpoint
CREATE TYPE "public"."badge_difficulty" AS ENUM('bronze', 'silver', 'gold', 'platinum');--> statement-breakpoint
CREATE TYPE "public"."badge_type" AS ENUM('profile_basic', 'profile_complete', 'documents_verified', 'cpd_achiever', 'event_participant', 'payment_complete', 'early_bird', 'community_contributor', 'certificate_holder', 'organization_member');--> statement-breakpoint
CREATE TYPE "public"."case_priority" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."case_status" AS ENUM('open', 'in_progress', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."case_type" AS ENUM('complaint', 'inquiry', 'dispute', 'violation');--> statement-breakpoint
CREATE TYPE "public"."decision" AS ENUM('accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('uploaded', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('o_level_cert', 'a_level_cert', 'equivalent_cert', 'id_or_passport', 'birth_certificate', 'bank_trust_letter', 'certificate_incorporation', 'partnership_agreement', 'cr6', 'cr11', 'tax_clearance', 'annual_return_1', 'annual_return_2', 'annual_return_3', 'police_clearance_director', 'application_fee_pop');--> statement-breakpoint
CREATE TYPE "public"."education_level" AS ENUM('o_level', 'a_level', 'bachelors', 'hnd', 'masters', 'doctorate');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('workshop', 'seminar', 'training', 'conference');--> statement-breakpoint
CREATE TYPE "public"."member_type" AS ENUM('real_estate_agent', 'property_manager', 'principal_real_estate_agent', 'real_estate_negotiator');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('active', 'standby', 'revoked', 'pending', 'expired');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('pending', 'sent', 'delivered', 'failed', 'opened');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('email', 'sms', 'push', 'in_app');--> statement-breakpoint
CREATE TYPE "public"."organization_type" AS ENUM('real_estate_firm', 'property_management_firm', 'brokerage_firm', 'real_estate_development_firm');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'paynow_ecocash', 'paynow_onemoney', 'stripe_card', 'bank_transfer', 'cheque');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "public"."renewal_status" AS ENUM('pending', 'reminded', 'completed', 'overdue', 'lapsed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'member_manager', 'case_manager', 'super_admin', 'staff', 'accountant', 'reviewer');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended', 'locked', 'pending_verification');--> statement-breakpoint
CREATE TABLE "achievement_badges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" "badge_type" NOT NULL,
	"difficulty" "badge_difficulty" DEFAULT 'bronze',
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"criteria" text NOT NULL,
	"points" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "app_login_tokens" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_type" "application_type" NOT NULL,
	"application_id_fk" varchar NOT NULL,
	"email" text NOT NULL,
	"code" varchar(6) NOT NULL,
	"attempts" integer DEFAULT 0,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applicants" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" text NOT NULL,
	"first_name" text NOT NULL,
	"surname" text NOT NULL,
	"email" text NOT NULL,
	"status" "applicant_status" DEFAULT 'registered',
	"email_verified" boolean DEFAULT false,
	"email_verification_token" text,
	"email_verification_expires" timestamp,
	"application_started_at" timestamp,
	"application_completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "applicants_applicant_id_unique" UNIQUE("applicant_id"),
	CONSTRAINT "applicants_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "application_workflows" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" varchar NOT NULL,
	"stage" "application_stage" NOT NULL,
	"status" text NOT NULL,
	"assigned_to" varchar,
	"started_at" timestamp,
	"completed_at" timestamp,
	"due_date" timestamp,
	"notes" text,
	"documents" text,
	"estimated_duration_hours" integer DEFAULT 24,
	"actual_duration_hours" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"resource_id" text,
	"old_values" text,
	"new_values" text,
	"ip_address" text,
	"user_agent" text,
	"timestamp" timestamp DEFAULT now(),
	"severity" text DEFAULT 'info',
	"description" text
);
--> statement-breakpoint
CREATE TABLE "cases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_number" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" "case_type" NOT NULL,
	"priority" "case_priority" DEFAULT 'medium',
	"status" "case_status" DEFAULT 'open',
	"submitted_by" text,
	"submitted_by_email" text,
	"member_id" varchar,
	"organization_id" varchar,
	"assigned_to" varchar,
	"resolution" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cases_case_number_unique" UNIQUE("case_number")
);
--> statement-breakpoint
CREATE TABLE "cpd_activities" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" varchar,
	"event_id" varchar,
	"activity_title" text NOT NULL,
	"activity_type" text NOT NULL,
	"points_earned" integer DEFAULT 0,
	"completion_date" timestamp,
	"certificate_url" text,
	"verified_by" varchar,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" varchar,
	"organization_id" varchar,
	"application_id" varchar,
	"document_type" text NOT NULL,
	"file_name" text NOT NULL,
	"file_path" text NOT NULL,
	"file_size" integer,
	"mime_type" text,
	"is_verified" boolean DEFAULT false,
	"verified_by" varchar,
	"verification_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar,
	"member_id" varchar,
	"payment_status" "payment_status" DEFAULT 'pending',
	"registration_date" timestamp DEFAULT now(),
	"attended" boolean DEFAULT false,
	"certificate_issued" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "event_type" NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"location" text,
	"address" text,
	"instructor" text,
	"capacity" integer,
	"price" numeric(10, 2),
	"cpd_points" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "individual_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" text NOT NULL,
	"status" "application_status" DEFAULT 'draft',
	"personal" text NOT NULL,
	"o_level" text NOT NULL,
	"a_level" text,
	"equivalent_qualification" text,
	"mature_entry" boolean DEFAULT false,
	"fee_required" boolean DEFAULT true,
	"fee_amount" integer,
	"fee_currency" varchar(8) DEFAULT 'USD',
	"fee_status" varchar(16) DEFAULT 'pending',
	"fee_payment_id" varchar(36),
	"fee_proof_doc_id" varchar(36),
	"submitted_at" timestamp,
	"created_by_user_id" varchar,
	"member_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "individual_applications_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
CREATE TABLE "member_achievement_badges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" varchar,
	"badge_id" varchar,
	"earned_at" timestamp DEFAULT now(),
	"is_visible" boolean DEFAULT true,
	"progress" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "member_activities" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" varchar,
	"user_id" varchar,
	"activity_type" "activity_type" NOT NULL,
	"description" text NOT NULL,
	"details" text,
	"ip_address" text,
	"user_agent" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "member_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_number" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"date_of_birth" timestamp,
	"national_id" text,
	"member_type" "member_type" NOT NULL,
	"organization_id" varchar,
	"status" "application_status" DEFAULT 'draft',
	"current_stage" "application_stage" DEFAULT 'initial_review',
	"application_fee" numeric(10, 2),
	"fee_payment_status" "payment_status" DEFAULT 'pending',
	"payment_id" varchar,
	"education_level" "education_level",
	"work_experience" integer,
	"current_employer" text,
	"job_title" text,
	"documents_uploaded" boolean DEFAULT false,
	"documents_verified" boolean DEFAULT false,
	"background_check_passed" boolean,
	"interview_scheduled" boolean DEFAULT false,
	"interview_date" timestamp,
	"interview_notes" text,
	"review_notes" text,
	"rejection_reason" text,
	"reviewed_by" varchar,
	"submitted_at" timestamp,
	"review_started_at" timestamp,
	"approved_at" timestamp,
	"rejected_at" timestamp,
	"expires_at" timestamp,
	"priority" integer DEFAULT 3,
	"estimated_processing_days" integer DEFAULT 30,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "member_applications_application_number_unique" UNIQUE("application_number")
);
--> statement-breakpoint
CREATE TABLE "member_renewals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" varchar,
	"renewal_year" integer NOT NULL,
	"due_date" timestamp NOT NULL,
	"status" "renewal_status" DEFAULT 'pending',
	"reminders_sent" integer DEFAULT 0,
	"last_reminder_date" timestamp,
	"renewal_date" timestamp,
	"renewal_fee" numeric(10, 2),
	"payment_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"organization_id" varchar,
	"membership_number" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"date_of_birth" timestamp,
	"national_id" text,
	"member_type" "member_type" NOT NULL,
	"membership_status" "membership_status" DEFAULT 'pending',
	"joining_date" timestamp,
	"expiry_date" timestamp,
	"cpd_points" integer DEFAULT 0,
	"annual_fee" numeric(10, 2),
	"is_mature_entry" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "members_membership_number_unique" UNIQUE("membership_number"),
	CONSTRAINT "members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "naming_series_counters" (
	"series_code" varchar NOT NULL,
	"year" integer NOT NULL,
	"counter" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"member_id" varchar,
	"type" "notification_type" NOT NULL,
	"status" "notification_status" DEFAULT 'pending',
	"title" text NOT NULL,
	"message" text NOT NULL,
	"data" text,
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"opened_at" timestamp,
	"external_id" text,
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organization_applicants" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" text NOT NULL,
	"company_name" text NOT NULL,
	"email" text NOT NULL,
	"status" "applicant_status" DEFAULT 'registered',
	"email_verified" boolean DEFAULT false,
	"email_verification_token" text,
	"email_verification_expires" timestamp,
	"application_started_at" timestamp,
	"application_completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "organization_applicants_applicant_id_unique" UNIQUE("applicant_id"),
	CONSTRAINT "organization_applicants_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "organization_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" text NOT NULL,
	"status" "application_status" DEFAULT 'draft',
	"org_profile" text NOT NULL,
	"trust_account" text NOT NULL,
	"prea_member_id" varchar,
	"directors" text,
	"fee_required" boolean DEFAULT true,
	"fee_amount" integer,
	"fee_currency" varchar(8) DEFAULT 'USD',
	"fee_status" varchar(16) DEFAULT 'pending',
	"fee_payment_id" varchar(36),
	"fee_proof_doc_id" varchar(36),
	"submitted_at" timestamp,
	"created_by_user_id" varchar,
	"member_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "organization_applications_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "organization_type" NOT NULL,
	"registration_number" text,
	"email" text NOT NULL,
	"phone" text,
	"address" text,
	"principal_agent_id" varchar,
	"membership_status" "membership_status" DEFAULT 'pending',
	"registration_date" timestamp,
	"expiry_date" timestamp,
	"annual_fee" numeric(10, 2),
	"trust_account_details" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "organizations_registration_number_unique" UNIQUE("registration_number")
);
--> statement-breakpoint
CREATE TABLE "payment_installments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" varchar NOT NULL,
	"installment_number" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"due_date" timestamp NOT NULL,
	"paid_date" timestamp,
	"status" "payment_status" DEFAULT 'pending',
	"transaction_id" text,
	"late_fee" numeric(10, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_number" text NOT NULL,
	"member_id" varchar,
	"organization_id" varchar,
	"application_id" varchar,
	"event_id" varchar,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD',
	"payment_method" "payment_method" NOT NULL,
	"status" "payment_status" DEFAULT 'pending',
	"purpose" text NOT NULL,
	"description" text,
	"reference_number" text,
	"transaction_id" text,
	"external_payment_id" text,
	"gateway_response" text,
	"payment_date" timestamp,
	"due_date" timestamp,
	"processed_by" varchar,
	"receipt_url" text,
	"notes" text,
	"fees" numeric(10, 2) DEFAULT '0',
	"net_amount" numeric(10, 2),
	"refund_amount" numeric(10, 2) DEFAULT '0',
	"refund_reason" text,
	"refunded_at" timestamp,
	"failure_reason" text,
	"retry_count" integer DEFAULT 0,
	"last_retry_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_payment_number_unique" UNIQUE("payment_number")
);
--> statement-breakpoint
CREATE TABLE "registry_decisions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_type" "application_type" NOT NULL,
	"application_id_fk" varchar NOT NULL,
	"decision" "decision" NOT NULL,
	"reasons" text,
	"decided_by" varchar,
	"decided_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "status_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_type" "application_type" NOT NULL,
	"application_id_fk" varchar NOT NULL,
	"from_status" "application_status",
	"to_status" "application_status" NOT NULL,
	"actor_user_id" varchar,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_by" varchar,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "uploaded_documents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_type" "application_type" NOT NULL,
	"application_id_fk" varchar NOT NULL,
	"doc_type" "document_type" NOT NULL,
	"file_key" text NOT NULL,
	"file_name" text NOT NULL,
	"mime" text,
	"size_bytes" integer,
	"sha256" text,
	"status" "document_status" DEFAULT 'uploaded',
	"verifier_user_id" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_permissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"permission" text NOT NULL,
	"resource" text,
	"granted_by" varchar,
	"granted_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"session_token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"location" text,
	"device_type" text,
	"is_active" boolean DEFAULT true,
	"last_activity" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"phone" text,
	"role" "user_role" DEFAULT 'admin',
	"status" "user_status" DEFAULT 'active',
	"permissions" text,
	"last_login_at" timestamp,
	"login_attempts" integer DEFAULT 0,
	"locked_until" timestamp,
	"password_changed_at" timestamp,
	"email_verified" boolean DEFAULT false,
	"email_verification_token" text,
	"password_reset_token" text,
	"password_reset_expires" timestamp,
	"two_factor_enabled" boolean DEFAULT false,
	"two_factor_secret" text,
	"profile_image_url" text,
	"department" text,
	"job_title" text,
	"notes" text,
	"clerk_id" text,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
ALTER TABLE "application_workflows" ADD CONSTRAINT "application_workflows_application_id_member_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."member_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_workflows" ADD CONSTRAINT "application_workflows_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cpd_activities" ADD CONSTRAINT "cpd_activities_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cpd_activities" ADD CONSTRAINT "cpd_activities_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cpd_activities" ADD CONSTRAINT "cpd_activities_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_application_id_member_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."member_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "individual_applications" ADD CONSTRAINT "individual_applications_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "individual_applications" ADD CONSTRAINT "individual_applications_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_achievement_badges" ADD CONSTRAINT "member_achievement_badges_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_achievement_badges" ADD CONSTRAINT "member_achievement_badges_badge_id_achievement_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."achievement_badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_activities" ADD CONSTRAINT "member_activities_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_activities" ADD CONSTRAINT "member_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_applications" ADD CONSTRAINT "member_applications_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_applications" ADD CONSTRAINT "member_applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_renewals" ADD CONSTRAINT "member_renewals_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_renewals" ADD CONSTRAINT "member_renewals_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_applications" ADD CONSTRAINT "organization_applications_prea_member_id_members_id_fk" FOREIGN KEY ("prea_member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_applications" ADD CONSTRAINT "organization_applications_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_applications" ADD CONSTRAINT "organization_applications_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_installments" ADD CONSTRAINT "payment_installments_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_processed_by_users_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registry_decisions" ADD CONSTRAINT "registry_decisions_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_verifier_user_id_users_id_fk" FOREIGN KEY ("verifier_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_granted_by_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;