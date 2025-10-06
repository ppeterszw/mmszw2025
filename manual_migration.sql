-- Manual Migration Script for Schema Fixes
-- Date: 2025-10-06
-- Purpose: Apply all schema changes identified in audit

-- IMPORTANT: Run this in a transaction for safety
BEGIN;

-- ============================================================================
-- STEP 1: Add missing enum values (safe operations)
-- ============================================================================

-- Add missing application_status values
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'payment_pending' AND enumtypid = 'application_status'::regtype) THEN
    ALTER TYPE application_status ADD VALUE 'payment_pending';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'payment_received' AND enumtypid = 'application_status'::regtype) THEN
    ALTER TYPE application_status ADD VALUE 'payment_received';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'under_review' AND enumtypid = 'application_status'::regtype) THEN
    ALTER TYPE application_status ADD VALUE 'under_review';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'approved' AND enumtypid = 'application_status'::regtype) THEN
    ALTER TYPE application_status ADD VALUE 'approved';
  END IF;
END $$;

-- Add missing member_type value
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'property_developer' AND enumtypid = 'member_type'::regtype) THEN
    ALTER TYPE member_type ADD VALUE 'property_developer';
  END IF;
END $$;

-- Add missing event_type value
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'meeting' AND enumtypid = 'event_type'::regtype) THEN
    ALTER TYPE event_type ADD VALUE 'meeting';
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Add missing table columns (safe operations)
-- ============================================================================

-- Add missing columns to applicants table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applicants' AND column_name = 'password') THEN
    ALTER TABLE applicants ADD COLUMN password TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applicants' AND column_name = 'password_reset_token') THEN
    ALTER TABLE applicants ADD COLUMN password_reset_token TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applicants' AND column_name = 'password_reset_expires') THEN
    ALTER TABLE applicants ADD COLUMN password_reset_expires TIMESTAMP;
  END IF;
END $$;

-- Add missing columns to uploaded_documents table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'uploaded_documents' AND column_name = 'rejection_reason') THEN
    ALTER TABLE uploaded_documents ADD COLUMN rejection_reason TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'uploaded_documents' AND column_name = 'verified_at') THEN
    ALTER TABLE uploaded_documents ADD COLUMN verified_at TIMESTAMP;
  END IF;
END $$;

-- ============================================================================
-- STEP 3: Modify existing columns (careful operations)
-- ============================================================================

-- Make users.password nullable (for Clerk-only users)
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Change users default role from 'admin' to 'staff'
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'staff';

-- Make individual_applications.applicant_email NOT NULL
DO $$
BEGIN
  -- First check if there are any NULL values
  IF NOT EXISTS (SELECT 1 FROM individual_applications WHERE applicant_email IS NULL) THEN
    ALTER TABLE individual_applications ALTER COLUMN applicant_email SET NOT NULL;
  ELSE
    RAISE NOTICE 'WARNING: Cannot set applicant_email to NOT NULL - NULL values exist';
  END IF;
END $$;

-- Make individual_applications.member_type NOT NULL
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM individual_applications WHERE member_type IS NULL) THEN
    ALTER TABLE individual_applications ALTER COLUMN member_type SET NOT NULL;
  ELSE
    RAISE NOTICE 'WARNING: Cannot set member_type to NOT NULL - NULL values exist';
  END IF;
END $$;

-- Make individual_applications.personal NOT NULL
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM individual_applications WHERE personal IS NULL) THEN
    ALTER TABLE individual_applications ALTER COLUMN personal SET NOT NULL;
  ELSE
    RAISE NOTICE 'WARNING: Cannot set personal to NOT NULL - NULL values exist';
  END IF;
END $$;

-- Make organization_applications.applicant_email NOT NULL
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM organization_applications WHERE applicant_email IS NULL) THEN
    ALTER TABLE organization_applications ALTER COLUMN applicant_email SET NOT NULL;
  ELSE
    RAISE NOTICE 'WARNING: Cannot set applicant_email to NOT NULL - NULL values exist';
  END IF;
END $$;

-- Make organization_applications.business_type NOT NULL
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM organization_applications WHERE business_type IS NULL) THEN
    ALTER TABLE organization_applications ALTER COLUMN business_type SET NOT NULL;
  ELSE
    RAISE NOTICE 'WARNING: Cannot set business_type to NOT NULL - NULL values exist';
  END IF;
END $$;

-- Make organization_applications.company NOT NULL
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM organization_applications WHERE company IS NULL) THEN
    ALTER TABLE organization_applications ALTER COLUMN company SET NOT NULL;
  ELSE
    RAISE NOTICE 'WARNING: Cannot set company to NOT NULL - NULL values exist';
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
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT directors_organization_id_fkey
    FOREIGN KEY (organization_id)
    REFERENCES organizations(id)
    ON DELETE CASCADE
);

-- ============================================================================
-- STEP 5: Verification queries
-- ============================================================================

-- Verify enum values were added
SELECT
  'application_status' as enum_name,
  COUNT(*) FILTER (WHERE enumlabel = 'payment_pending') as has_payment_pending,
  COUNT(*) FILTER (WHERE enumlabel = 'payment_received') as has_payment_received,
  COUNT(*) FILTER (WHERE enumlabel = 'under_review') as has_under_review,
  COUNT(*) FILTER (WHERE enumlabel = 'approved') as has_approved
FROM pg_enum
WHERE enumtypid = 'application_status'::regtype;

SELECT
  'member_type' as enum_name,
  COUNT(*) FILTER (WHERE enumlabel = 'property_developer') as has_property_developer
FROM pg_enum
WHERE enumtypid = 'member_type'::regtype;

SELECT
  'event_type' as enum_name,
  COUNT(*) FILTER (WHERE enumlabel = 'meeting') as has_meeting
FROM pg_enum
WHERE enumtypid = 'event_type'::regtype;

-- Verify new columns exist
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('applicants', 'uploaded_documents', 'directors')
  AND column_name IN ('password', 'password_reset_token', 'password_reset_expires',
                      'rejection_reason', 'verified_at')
ORDER BY table_name, column_name;

-- Verify users table changes
SELECT
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('password', 'role');

COMMIT;

-- ============================================================================
-- Post-migration notes:
-- ============================================================================
-- 1. Enum renames (case_status, organization_type, membership_status) require
--    manual data migration and are not included in this script
-- 2. These renames are non-critical and can be handled separately if needed
-- 3. The database will continue to work with existing enum values
-- ============================================================================
