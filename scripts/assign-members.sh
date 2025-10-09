#!/bin/bash

# Assign Members to Organizations Script
# This script assigns unassigned members to organizations

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Assign Members to Organizations${NC}"
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

# Run the SQL script
psql "$DATABASE_URL" -f scripts/assign-members-to-organizations.sql

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Assignment completed!${NC}"
echo -e "${GREEN}========================================${NC}"
