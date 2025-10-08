-- Migration: Add JSONB GIN Indexes for Performance
-- Date: 2025-10-08
-- Purpose: Optimize JSONB field queries on individual_applications and organization_applications

-- ============================================================================
-- JSONB GIN Indexes for Full JSONB Search
-- ============================================================================

-- Individual Applications - Personal JSONB field
-- This allows fast queries like: WHERE personal @> '{"nationalId": "12345"}'
CREATE INDEX IF NOT EXISTS idx_individual_apps_personal_gin
ON individual_applications USING GIN (personal jsonb_path_ops);

-- Individual Applications - Education JSONB field
-- This allows fast queries on education data
CREATE INDEX IF NOT EXISTS idx_individual_apps_education_gin
ON individual_applications USING GIN (education jsonb_path_ops);

-- Organization Applications - Company JSONB field
-- This allows fast queries on company data
CREATE INDEX IF NOT EXISTS idx_org_apps_company_gin
ON organization_applications USING GIN (company jsonb_path_ops);

-- ============================================================================
-- Specific Field Indexes for Common Queries
-- ============================================================================

-- Index for searching by national ID inside personal JSONB
-- This allows fast queries like: WHERE personal->>'nationalId' = '12345'
CREATE INDEX IF NOT EXISTS idx_individual_apps_national_id
ON individual_applications ((personal->>'nationalId'))
WHERE personal->>'nationalId' IS NOT NULL;

-- Index for searching by first name inside personal JSONB
CREATE INDEX IF NOT EXISTS idx_individual_apps_first_name
ON individual_applications ((personal->>'firstName'))
WHERE personal->>'firstName' IS NOT NULL;

-- Index for searching by last name inside personal JSONB
CREATE INDEX IF NOT EXISTS idx_individual_apps_last_name
ON individual_applications ((personal->>'lastName'))
WHERE personal->>'lastName' IS NOT NULL;

-- Index for searching by phone inside personal JSONB
CREATE INDEX IF NOT EXISTS idx_individual_apps_phone
ON individual_applications ((personal->>'phone'))
WHERE personal->>'phone' IS NOT NULL;

-- Index for searching by organization legal name inside company JSONB
CREATE INDEX IF NOT EXISTS idx_org_apps_legal_name
ON organization_applications ((company->>'legalName'))
WHERE company->>'legalName' IS NOT NULL;

-- Index for searching by organization registration number inside company JSONB
CREATE INDEX IF NOT EXISTS idx_org_apps_reg_no
ON organization_applications ((company->>'regNo'))
WHERE company->>'regNo' IS NOT NULL;

-- Index for searching by organization tax number inside company JSONB
CREATE INDEX IF NOT EXISTS idx_org_apps_tax_no
ON organization_applications ((company->>'taxNo'))
WHERE company->>'taxNo' IS NOT NULL;

-- ============================================================================
-- Verify Index Creation
-- ============================================================================

-- Query to verify all indexes were created
-- Uncomment to check after running migration:
-- SELECT
--     schemaname,
--     tablename,
--     indexname,
--     indexdef
-- FROM pg_indexes
-- WHERE indexname LIKE '%jsonb%' OR indexname LIKE '%gin%'
-- ORDER BY tablename, indexname;

-- ============================================================================
-- Performance Notes
-- ============================================================================

-- GIN (Generalized Inverted Index) indexes are optimized for JSONB:
--
-- 1. jsonb_path_ops (used above) is faster but only supports containment (@>)
-- 2. Regular GIN supports more operators but is larger and slower
--
-- Index Usage Examples:
--
-- Fast with GIN index:
--   SELECT * FROM individual_applications
--   WHERE personal @> '{"nationalId": "12345"}';
--
-- Fast with expression index:
--   SELECT * FROM individual_applications
--   WHERE personal->>'nationalId' = '12345';
--
-- Performance Impact:
-- - Query speedup: 10-100x faster for JSONB queries
-- - Storage cost: ~10-20% increase in table size
-- - Write overhead: Minimal (GIN indexes are updated efficiently)
