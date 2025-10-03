#!/bin/bash

# Test login endpoint
echo "Testing login for sysadmin@estateagentscouncil.org..."
echo ""

curl -X POST "https://mms.estateagentscouncil.org/api/auth/login" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF' | python3 -m json.tool
{
  "email": "sysadmin@estateagentscouncil.org",
  "password": "minaNA!20210117"
}
EOF
