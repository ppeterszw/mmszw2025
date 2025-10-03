-- Migration: Add Authentication System Columns to Users Table
-- Date: 2025-10-03
-- Purpose: Add columns required for the comprehensive authentication system

-- Add missing columns to users table (safely with IF NOT EXISTS)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by VARCHAR;

-- Add unique constraint on clerk_id (commented out - will error if already exists)
-- Uncomment and run separately if needed:
-- ALTER TABLE users ADD CONSTRAINT users_clerk_id_unique UNIQUE (clerk_id);

-- Ensure proper defaults for existing columns
ALTER TABLE users ALTER COLUMN login_attempts SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT FALSE;
ALTER TABLE users ALTER COLUMN two_factor_enabled SET DEFAULT FALSE;
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT NOW();

-- Update existing NULL values to have proper defaults
UPDATE users SET login_attempts = 0 WHERE login_attempts IS NULL;
UPDATE users SET email_verified = FALSE WHERE email_verified IS NULL;
UPDATE users SET two_factor_enabled = FALSE WHERE two_factor_enabled IS NULL;

-- Verification query (optional - comment out for execution)
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'users'
-- ORDER BY ordinal_position;
