-- Create missing tables for EACZ Member Management System
-- Missing tables: applicants, organization_applicants, app_login_tokens,
-- uploaded_documents, status_history, registry_decisions, event_registrations,
-- member_activities, member_renewals, member_achievement_badges

-- 1. Applicants table (Individual applicant pre-registration)
CREATE TABLE IF NOT EXISTS applicants (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verification_token TEXT,
  email_verification_expires TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Organization Applicants table
CREATE TABLE IF NOT EXISTS organization_applicants (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verification_token TEXT,
  email_verification_expires TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. App Login Tokens table
CREATE TABLE IF NOT EXISTS app_login_tokens (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  application_type VARCHAR NOT NULL,
  application_id_fk VARCHAR NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Uploaded Documents table
CREATE TABLE IF NOT EXISTS uploaded_documents (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  application_type VARCHAR NOT NULL,
  application_id_fk VARCHAR NOT NULL,
  doc_type VARCHAR NOT NULL,
  file_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime TEXT,
  size_bytes INTEGER,
  sha256 TEXT,
  status VARCHAR DEFAULT 'uploaded',
  rejection_reason TEXT,
  verifier_user_id VARCHAR,
  verified_at TIMESTAMP,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Status History table
CREATE TABLE IF NOT EXISTS status_history (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  application_type VARCHAR NOT NULL,
  application_id_fk VARCHAR NOT NULL,
  from_status VARCHAR,
  to_status VARCHAR NOT NULL,
  actor_user_id VARCHAR,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Registry Decisions table
CREATE TABLE IF NOT EXISTS registry_decisions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  application_type VARCHAR NOT NULL,
  application_id_fk VARCHAR NOT NULL,
  decision VARCHAR NOT NULL,
  reasons TEXT,
  decided_by VARCHAR,
  decided_at TIMESTAMP DEFAULT NOW()
);

-- 7. Event Registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR REFERENCES events(id),
  member_id VARCHAR REFERENCES members(id),
  payment_status VARCHAR DEFAULT 'pending',
  registration_date TIMESTAMP DEFAULT NOW(),
  attended BOOLEAN DEFAULT false
);

-- 8. Member Activities table
CREATE TABLE IF NOT EXISTS member_activities (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id VARCHAR REFERENCES members(id),
  activity_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 9. Member Renewals table
CREATE TABLE IF NOT EXISTS member_renewals (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id VARCHAR REFERENCES members(id),
  renewal_year INTEGER NOT NULL,
  due_date TIMESTAMP NOT NULL,
  status VARCHAR DEFAULT 'pending',
  payment_reference TEXT,
  renewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 10. Member Achievement Badges table
CREATE TABLE IF NOT EXISTS member_achievement_badges (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id VARCHAR REFERENCES members(id),
  badge_id VARCHAR REFERENCES achievement_badges(id),
  awarded_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(member_id, badge_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_applicants_email ON applicants(email);
CREATE INDEX IF NOT EXISTS idx_org_applicants_email ON organization_applicants(email);
CREATE INDEX IF NOT EXISTS idx_uploaded_docs_app_id ON uploaded_documents(application_id_fk);
CREATE INDEX IF NOT EXISTS idx_status_history_app_id ON status_history(application_id_fk);
CREATE INDEX IF NOT EXISTS idx_registry_decisions_app_id ON registry_decisions(application_id_fk);
CREATE INDEX IF NOT EXISTS idx_event_registrations_member ON event_registrations(member_id);
CREATE INDEX IF NOT EXISTS idx_member_activities_member ON member_activities(member_id);
CREATE INDEX IF NOT EXISTS idx_member_renewals_member ON member_renewals(member_id);
