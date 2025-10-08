#!/bin/bash

# Fix Member ID Format Migration Script
# This script updates member and organization IDs to the correct format

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Member ID Format Fix Migration${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ Error: DATABASE_URL environment variable is not set${NC}"
  echo ""
  echo "Please set DATABASE_URL before running this script:"
  echo "  export DATABASE_URL=\"postgresql://...\" "
  echo ""
  exit 1
fi

echo -e "${GREEN}✓ DATABASE_URL is set${NC}"
echo ""

# Show what will be updated
echo -e "${YELLOW}Checking current member IDs...${NC}"
psql "$DATABASE_URL" -c "
  SELECT
    'Members with old format' as type,
    COUNT(*) as count
  FROM members
  WHERE membership_number NOT LIKE 'EAC-MBR-%'
    AND membership_number NOT LIKE 'EAC-ORG-%'
  UNION ALL
  SELECT
    'Organizations with old format' as type,
    COUNT(*) as count
  FROM organizations
  WHERE registration_number NOT LIKE 'EAC-ORG-%'
    AND registration_number NOT LIKE 'APP-ORG-%';
"

echo ""
echo -e "${YELLOW}This will update:${NC}"
echo "  - Individual member IDs to format: EAC-MBR-YYYY-XXXX"
echo "  - Organization IDs to format: EAC-ORG-YYYY-XXXX"
echo ""

# Ask for confirmation
read -p "Do you want to proceed with the migration? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
  echo -e "${RED}Migration cancelled${NC}"
  exit 0
fi

echo ""
echo -e "${GREEN}Starting migration...${NC}"
echo ""

# Apply migration
psql "$DATABASE_URL" -f migrations/fix_member_id_format.sql

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Migration completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Show updated counts
echo -e "${YELLOW}Updated member IDs:${NC}"
psql "$DATABASE_URL" -c "
  SELECT
    'Members with EAC-MBR format' as type,
    COUNT(*) as count
  FROM members
  WHERE membership_number LIKE 'EAC-MBR-%'
  UNION ALL
  SELECT
    'Organizations with EAC-ORG format' as type,
    COUNT(*) as count
  FROM organizations
  WHERE registration_number LIKE 'EAC-ORG-%';
"

echo ""
echo -e "${GREEN}✓ All member IDs have been updated to the correct format!${NC}"
