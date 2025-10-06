-- Simplified Migration Script for Schema Fixes
-- Date: 2025-10-06

BEGIN;

-- ============================================================================
-- STEP 1: Add missing enum values
-- ============================================================================

-- Add missing application_status values
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'payment_pending';
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'payment_received';
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'under_review';
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'approved';

-- Add missing member_type value
ALTER TYPE member_type ADD VALUE IF NOT EXISTS 'property_developer';

-- Add missing event_type value
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'meeting';

-- ============================================================================
-- STEP 2: Add missing table columns
-- ============================================================================

-- Add missing columns to applicants table
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS password_reset_token TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP;

-- Add missing columns to uploaded_documents table
ALTER TABLE uploaded_documents ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE uploaded_documents ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;

-- ============================================================================
-- STEP 3: Modify existing columns
-- ============================================================================

-- Make users.password nullable (for Clerk-only users)
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Change users default role from 'admin' to 'staff'
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'staff';

-- Set NOT NULL constraints only if no NULL values exist
DO $$
BEGIN
  -- individual_applications.applicant_email
  IF NOT EXISTS (SELECT 1 FROM individual_applications WHERE applicant_email IS NULL LIMIT 1) THEN
    ALTER TABLE individual_applications ALTER COLUMN applicant_email SET NOT NULL;
  END IF;

  -- individual_applications.member_type
  IF NOT EXISTS (SELECT 1 FROM individual_applications WHERE member_type IS NULL LIMIT 1) THEN
    ALTER TABLE individual_applications ALTER COLUMN member_type SET NOT NULL;
  END IF;

  -- individual_applications.personal
  IF NOT EXISTS (SELECT 1 FROM individual_applications WHERE personal IS NULL LIMIT 1) THEN
    ALTER TABLE individual_applications ALTER COLUMN personal SET NOT NULL;
  END IF;

  -- organization_applications.applicant_email
  IF NOT EXISTS (SELECT 1 FROM organization_applications WHERE applicant_email IS NULL LIMIT 1) THEN
    ALTER TABLE organization_applications ALTER COLUMN applicant_email SET NOT NULL;
  END IF;

  -- organization_applications.business_type
  IF NOT EXISTS (SELECT 1 FROM organization_applications WHERE business_type IS NULL LIMIT 1) THEN
    ALTER TABLE organization_applications ALTER COLUMN business_type SET NOT NULL;
  END IF;

  -- organization_applications.company
  IF NOT EXISTS (SELECT 1 FROM organization_applications WHERE company IS NULL LIMIT 1) THEN
    ALTER TABLE organization_applications ALTER COLUMN company SET NOT NULL;
  END IF;
END $$;

-- ============================================================================
-- STEP 4: Create directors table if it doesn't exist
-- ============================================================================

CREATE TABLE IF NOT EXISTS directors (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id VARCHAR NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  national_id TEXT,
  email TEXT,
  phone TEXT,
  position TEXT,
  appointed_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add foreign key if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'directors_organization_id_fkey'
  ) THEN
    ALTER TABLE directors ADD CONSTRAINT directors_organization_id_fkey
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

COMMIT;

-- Verification
SELECT 'Migration completed successfully!' as status;
