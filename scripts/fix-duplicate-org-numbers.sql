-- Fix Duplicate Organization Registration Numbers
-- This script ensures all organizations have unique registration numbers

-- Show current state
SELECT '=== BEFORE FIX ===' as status;
SELECT id, name, registration_number, created_at
FROM organizations
ORDER BY registration_number;

-- Fix duplicate EAC-ORG-2025-0001
-- Keep BYO Real Estate as 0001 (created first)
-- Change Premier Estate Agents to 0004 (next available after 0003)
UPDATE organizations
SET registration_number = 'EAC-ORG-2025-0004'
WHERE id = '5074e87c-19f3-4579-873c-3f81a0e2f1bf'
  AND name = 'Premier Estate Agents';

-- Show updated state
SELECT '=== AFTER FIX ===' as status;
SELECT id, name, registration_number, created_at
FROM organizations
ORDER BY registration_number;

-- Verify no duplicates remain
SELECT '=== DUPLICATE CHECK ===' as status;
SELECT registration_number, COUNT(*) as count
FROM organizations
GROUP BY registration_number
HAVING COUNT(*) > 1;
