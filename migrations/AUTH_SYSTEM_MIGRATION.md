# Authentication System Database Migration Guide

## Issue
The authentication system requires the `users` table to have the complete schema with all authentication-related fields. The production database may be missing some columns.

## Required Columns in `users` Table

The following columns must exist in the `users` table for the authentication system to work:

```sql
-- Core user fields
id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()
email TEXT NOT NULL UNIQUE
password TEXT NOT NULL
first_name TEXT
last_name TEXT
phone TEXT
role user_role DEFAULT 'admin'
status user_status DEFAULT 'active'

-- Authentication fields
permissions TEXT
last_login_at TIMESTAMP
login_attempts INTEGER DEFAULT 0
locked_until TIMESTAMP
password_changed_at TIMESTAMP
email_verified BOOLEAN DEFAULT FALSE
email_verification_token TEXT
password_reset_token TEXT
password_reset_expires TIMESTAMP

-- 2FA fields (future use)
two_factor_enabled BOOLEAN DEFAULT FALSE
two_factor_secret TEXT

-- Profile fields
profile_image_url TEXT
department TEXT
job_title TEXT
notes TEXT

-- Clerk integration
clerk_id TEXT UNIQUE

-- Audit fields
created_by VARCHAR
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

## Migration Steps

### Option 1: Using Drizzle Kit (Recommended)

1. **Set DATABASE_URL environment variable to production database:**
   ```bash
   export DATABASE_URL="your_production_database_url"
   ```

2. **Generate migration:**
   ```bash
   npx drizzle-kit generate
   ```

3. **Review the generated migration in `migrations/` directory**

4. **Apply migration:**
   ```bash
   npx drizzle-kit push
   ```

### Option 2: Manual SQL Migration

If you prefer to run SQL manually, execute the following SQL on your production database:

```sql
-- Add missing columns to users table (if they don't exist)
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
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by VARCHAR;

-- Ensure proper defaults
ALTER TABLE users ALTER COLUMN login_attempts SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT FALSE;
ALTER TABLE users ALTER COLUMN two_factor_enabled SET DEFAULT FALSE;
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT NOW();
```

### Option 3: Using Neon Dashboard

1. Go to Neon dashboard: https://console.neon.tech/
2. Navigate to your project (mmszw2025)
3. Go to SQL Editor
4. Paste the SQL from Option 2 above
5. Execute the SQL

## Verification

After running the migration, verify the schema:

```sql
-- Check users table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

## Testing Authentication Endpoints

Once migration is complete, test the endpoints:

```bash
# Test registration
curl -X POST https://mms.estateagentscouncil.org/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#","firstName":"Test","lastName":"User"}'

# Test login
curl -X POST https://mms.estateagentscouncil.org/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'

# Test current user (should fail with 401 if not logged in)
curl https://mms.estateagentscouncil.org/api/auth/me
```

## Troubleshooting

### Error: "column does not exist"
- This means the migration hasn't been applied yet
- Run the SQL migration from Option 2 above

### Error: "Invalid JSON"
- Check that Content-Type header is set to application/json
- Verify JSON is properly formatted

### Error: "Registration failed"
- Check server logs for detailed error message
- Verify all required columns exist in database
- Ensure database connection is working

## Next Steps

After successful migration:

1. Update frontend to use new authentication endpoints
2. Test all authentication flows (register, login, password reset, etc.)
3. Configure email service (ZeptoMail) for verification emails
4. Test RBAC permissions with different user roles
5. Monitor session management and cleanup
