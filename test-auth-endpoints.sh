#!/bin/bash

# Test Authentication Endpoints
BASE_URL="https://mms.estateagentscouncil.org"
TEMP_EMAIL="test-$(date +%s)@example.com"

echo "=========================================="
echo "Testing Authentication System"
echo "=========================================="
echo ""

# Test 1: GET /api/auth/me (should fail - not authenticated)
echo "1. Testing GET /api/auth/me (unauthenticated)..."
curl -s -X GET "$BASE_URL/api/auth/me" | python3 -m json.tool
echo ""
echo ""

# Test 2: POST /api/auth/register (should succeed)
echo "2. Testing POST /api/auth/register..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEMP_EMAIL\",\"password\":\"TestPass123!\",\"firstName\":\"Test\",\"lastName\":\"User\",\"role\":\"staff\"}")
echo "$REGISTER_RESPONSE" | python3 -m json.tool
echo ""
echo ""

# Test 3: POST /api/auth/login with wrong password (should fail)
echo "3. Testing POST /api/auth/login (wrong password)..."
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEMP_EMAIL\",\"password\":\"WrongPassword\"}" | python3 -m json.tool
echo ""
echo ""

# Test 4: POST /api/auth/forgot-password
echo "4. Testing POST /api/auth/forgot-password..."
curl -s -X POST "$BASE_URL/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEMP_EMAIL\"}" | python3 -m json.tool
echo ""
echo ""

# Test 5: GET /api/auth/sessions (should fail - not authenticated)
echo "5. Testing GET /api/auth/sessions (unauthenticated)..."
curl -s -X GET "$BASE_URL/api/auth/sessions" | python3 -m json.tool
echo ""
echo ""

echo "=========================================="
echo "Test Complete!"
echo "=========================================="
