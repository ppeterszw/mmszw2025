-- Assign Members to Organizations
-- This script assigns members who don't have an organization to available organizations

-- Step 1: View current state
SELECT
  '=== BEFORE ASSIGNMENT ===' as status,
  COUNT(*) FILTER (WHERE organization_id IS NULL) as unassigned_members,
  COUNT(*) FILTER (WHERE organization_id IS NOT NULL) as assigned_members,
  COUNT(*) as total_members
FROM members;

-- Step 2: Show available organizations
SELECT '=== AVAILABLE ORGANIZATIONS ===' as info;
SELECT id, registration_number, name, status
FROM organizations
WHERE status = 'active'
ORDER BY name;

-- Step 3: Show unassigned members
SELECT '=== UNASSIGNED MEMBERS ===' as info;
SELECT membership_number, first_name, last_name, email
FROM members
WHERE organization_id IS NULL
ORDER BY membership_number;

-- Step 4: Assign unassigned members to organizations
-- You can customize these assignments based on your needs

-- Assign Sarah Ndlovu to BYO Real Estate
UPDATE members
SET organization_id = 'a664e1f4-55c0-41de-9b2f-48d880b0090b'
WHERE membership_number = 'EAC-MBR-2025-0001'
  AND organization_id IS NULL;

-- Assign David Moyo to Premier Estate Agents
UPDATE members
SET organization_id = '5074e87c-19f3-4579-873c-3f81a0e2f1bf'
WHERE membership_number = 'EAC-MBR-2025-0002'
  AND organization_id IS NULL;

-- Assign Phillip Peter (ppeterszw@gmail.com) to Harare Property Management
UPDATE members
SET organization_id = '2a4fbf4b-950e-47af-b7f9-b1dd6184f74c'
WHERE membership_number = 'EAC-MBR-2025-0003'
  AND organization_id IS NULL;

-- Assign Arie Ben to BYO Real Estate
UPDATE members
SET organization_id = 'a664e1f4-55c0-41de-9b2f-48d880b0090b'
WHERE membership_number = 'EAC-MBR-2025-0006'
  AND organization_id IS NULL;

-- Assign Phillip Peter (commerzbank) to Premier Estate Agents
UPDATE members
SET organization_id = '5074e87c-19f3-4579-873c-3f81a0e2f1bf'
WHERE membership_number = 'EAC-MBR-2025-0007'
  AND organization_id IS NULL;

-- Step 5: Show results
SELECT '=== AFTER ASSIGNMENT ===' as status;

SELECT
  m.membership_number,
  m.first_name,
  m.last_name,
  o.registration_number as org_number,
  o.name as organization_name
FROM members m
LEFT JOIN organizations o ON m.organization_id = o.id
ORDER BY m.membership_number;

-- Step 6: Summary
SELECT
  '=== SUMMARY ===' as status,
  COUNT(*) FILTER (WHERE organization_id IS NULL) as unassigned_members,
  COUNT(*) FILTER (WHERE organization_id IS NOT NULL) as assigned_members,
  COUNT(*) as total_members
FROM members;
