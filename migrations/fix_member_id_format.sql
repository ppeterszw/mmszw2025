-- Fix Member ID Format Migration
-- This script updates all member and organization IDs to the correct format:
-- Individual Members: EAC-MBR-YYYY-XXXX
-- Organizations: EAC-ORG-YYYY-XXXX

-- Fix individual member IDs (from REA-YYYY-XXXXXX to EAC-MBR-YYYY-XXXX)
UPDATE members
SET membership_number = 'EAC-MBR-' || SUBSTRING(membership_number FROM 5)
WHERE membership_number LIKE 'REA-%'
  AND membership_number NOT LIKE 'EAC-%';

-- Fix any members with wrong format (ensure they follow EAC-MBR-YYYY-XXXX)
-- This handles cases where IDs might have been manually created
UPDATE members
SET membership_number = 'EAC-MBR-' ||
  EXTRACT(YEAR FROM joined_date)::text || '-' ||
  LPAD(SUBSTRING(membership_number FROM '(\d+)$'), 4, '0')
WHERE membership_number NOT LIKE 'EAC-MBR-%'
  AND membership_number NOT LIKE 'EAC-ORG-%';

-- Fix organization registration numbers (from REF/PMF/BRK-YYYY-XXX to EAC-ORG-YYYY-XXXX)
UPDATE organizations
SET registration_number = 'EAC-ORG-' ||
  EXTRACT(YEAR FROM created_at)::text || '-' ||
  LPAD(SUBSTRING(registration_number FROM '(\d+)$'), 4, '0')
WHERE registration_number NOT LIKE 'EAC-ORG-%'
  AND registration_number NOT LIKE 'APP-ORG-%';

-- Display summary of changes
SELECT 'Members Updated' as type, COUNT(*) as count
FROM members
WHERE membership_number LIKE 'EAC-MBR-%'
UNION ALL
SELECT 'Organizations Updated' as type, COUNT(*) as count
FROM organizations
WHERE registration_number LIKE 'EAC-ORG-%';
