# Authentication & Authorization System Documentation

## Overview

This document describes the robust authentication and authorization system implemented for the Estate Agents Council of Zimbabwe (EACZ) application.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Security Features](#security-features)
4. [API Endpoints](#api-endpoints)
5. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
6. [Session Management](#session-management)
7. [Email Notifications](#email-notifications)
8. [Configuration](#configuration)
9. [Usage Examples](#usage-examples)
10. [Best Practices](#best-practices)

---

## Features

✅ **Secure Authentication**
- Password hashing using scrypt
- Password strength validation
- Account lockout after failed attempts
- Email verification

✅ **Role-Based Access Control (RBAC)**
- 7 predefined roles with specific permissions
- 40+ granular permissions
- Middleware for route protection

✅ **Session Management**
- Idle timeout (60 minutes)
- Absolute timeout (8 hours)
- Automatic session cleanup
- Multi-device session tracking

✅ **Email Notifications**
- Welcome emails with verification
- Password reset emails
- Password change confirmations
- Account lockout notifications
- Login notifications (optional)

✅ **Password Management**
- Forgot password flow
- Password reset with secure tokens
- Password change (authenticated)
- Password history (future enhancement)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATION                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    AUTH ROUTES LAYER                        │
│  • Registration      • Email Verification                   │
│  • Login/Logout      • Password Management                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌────────────┐
│ AuthService  │ │  RBAC    │ │  Session   │
│              │ │ Service  │ │  Service   │
│• Password    │ │• Roles   │ │• Timeouts  │
│  Hashing     │ │• Perms   │ │• Cleanup   │
│• Validation  │ │• Checks  │ │• Tracking  │
│• Tokens      │ │          │ │            │
└──────┬───────┘ └────┬─────┘ └─────┬──────┘
       │              │              │
       └──────────────┼──────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │    EMAIL NOTIFICATIONS   │
        │  • Welcome               │
        │  • Password Reset        │
        │  • Security Alerts       │
        └──────────────────────────┘
```

---

## Security Features

### 1. Password Security

**Hashing Algorithm:** scrypt (built-in Node.js crypto)
- Industry-standard password hashing
- Salt generated per password
- Timing-safe equality checks

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### 2. Account Lockout

**Configuration:**
- Max attempts: 5 failed logins
- Lockout duration: 30 minutes
- Automatic unlock after duration

**Process:**
1. Failed login attempts are tracked
2. After 5 failures, account locks for 30 minutes
3. Email notification sent to user
4. Automatic unlock after timer expires

### 3. Session Security

**Timeout Mechanisms:**
- **Idle Timeout:** 60 minutes of inactivity
- **Absolute Timeout:** 8 hours max session duration
- Sessions automatically cleaned every hour

**Security Headers:**
- `X-Session-Timeout-Remaining`: Minutes left
- `X-Session-Warning`: Set when < 5 minutes remain

### 4. Token Security

**Password Reset Tokens:**
- Cryptographically secure (32 bytes random)
- Expire after 1 hour
- Single-use only

**Email Verification Tokens:**
- Cryptographically secure (32 bytes random)
- Expire after 24 hours
- Single-use only

---

## API Endpoints

### Authentication

#### **POST /api/auth/register**
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "staff"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "staff"
  }
}
```

#### **POST /api/auth/login**
Login user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "staff",
    "emailVerified": true,
    "permissions": ["member:read", "case:read", ...]
  }
}
```

#### **POST /api/auth/logout**
Logout current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### **GET /api/auth/me**
Get current authenticated user.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "staff",
  "emailVerified": true,
  "permissions": ["member:read", "case:read", ...]
}
```

### Email Verification

#### **GET /api/auth/verify-email/:token**
Verify email address.

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### **POST /api/auth/resend-verification**
Resend verification email (requires auth).

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

### Password Management

#### **POST /api/auth/forgot-password**
Request password reset.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent"
}
```

#### **POST /api/auth/reset-password**
Reset password with token.

**Request:**
```json
{
  "token": "reset-token-here",
  "newPassword": "NewSecureP@ss123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### **POST /api/auth/change-password**
Change password (requires auth).

**Request:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewSecureP@ss123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Session Management

#### **GET /api/auth/sessions**
Get active sessions (requires auth).

**Response:**
```json
{
  "sessions": [
    {
      "createdAt": "2025-10-03T10:00:00Z",
      "lastActivity": "2025-10-03T11:30:00Z",
      "expiresAt": "2025-10-03T18:00:00Z",
      "ipAddress": "192.168.1.1",
      "device": "Mozilla/5.0..."
    }
  ]
}
```

#### **DELETE /api/auth/sessions**
Logout from all devices (requires auth).

**Response:**
```json
{
  "success": true,
  "message": "Logged out from all devices"
}
```

---

## Role-Based Access Control (RBAC)

### Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|----------------|
| **super_admin** | Full system access | All permissions |
| **admin** | Administrative access | Most permissions except system settings |
| **member_manager** | Member management | Member CRUD, application review, document verification |
| **case_manager** | Case management | Case CRUD, member/org read access |
| **accountant** | Financial management | Payment CRUD, reports, member/org read |
| **reviewer** | Application reviewer | Application/document review, member/org read |
| **staff** | Basic staff access | Read-only access to most resources |

### Permission Categories

**User Management:** `user:create`, `user:read`, `user:update`, `user:delete`, `user:manage_roles`

**Member Management:** `member:create`, `member:read`, `member:update`, `member:delete`, `member:approve`, `member:suspend`

**Application Management:** `application:read`, `application:review`, `application:approve`, `application:reject`

**Case Management:** `case:create`, `case:read`, `case:update`, `case:delete`, `case:assign`, `case:close`

**Payment Management:** `payment:read`, `payment:process`, `payment:refund`, `payment:reports`

**Document Management:** `document:read`, `document:upload`, `document:verify`, `document:delete`

**Event Management:** `event:create`, `event:read`, `event:update`, `event:delete`

**Organization Management:** `organization:create`, `organization:read`, `organization:update`, `organization:delete`

**System Administration:** `system:settings`, `system:logs`, `system:backup`

### Using RBAC Middleware

**Require Authentication:**
```typescript
import { requireAuth } from "./auth/rbacService";

app.get("/api/protected", requireAuth, (req, res) => {
  // Only authenticated users
});
```

**Require Specific Permission:**
```typescript
import { requirePermission, Permission } from "./auth/rbacService";

app.post(
  "/api/members",
  requirePermission(Permission.MEMBER_CREATE),
  (req, res) => {
    // Only users with member:create permission
  }
);
```

**Require Any Permission:**
```typescript
import { requireAnyPermission, Permission } from "./auth/rbacService";

app.get(
  "/api/members/:id",
  requireAnyPermission(
    Permission.MEMBER_READ,
    Permission.MEMBER_UPDATE
  ),
  (req, res) => {
    // Users with either permission
  }
);
```

**Require Specific Role:**
```typescript
import { requireRole } from "./auth/rbacService";

app.post(
  "/api/system/backup",
  requireRole("super_admin"),
  (req, res) => {
    // Only super admins
  }
);
```

---

## Session Management

### Configuration

```typescript
const SESSION_CONFIG = {
  IDLE_TIMEOUT_MINUTES: 60,        // 1 hour idle
  ABSOLUTE_TIMEOUT_HOURS: 8,       // 8 hours max
  CLEANUP_INTERVAL_MINUTES: 60,    // Clean every hour
};
```

### Session Lifecycle

1. **Creation:** Session created on successful login
2. **Activity Tracking:** Last activity timestamp updated on each request
3. **Idle Check:** Session expires after 60 minutes of inactivity
4. **Absolute Check:** Session expires after 8 hours regardless
5. **Cleanup:** Expired sessions automatically cleaned hourly

### Session Warnings

The system provides client-side warnings:
- Response header: `X-Session-Timeout-Remaining` (minutes)
- Response header: `X-Session-Warning` when < 5 minutes

---

## Email Notifications

All emails are sent via ZeptoMail and include professional HTML templates.

### Email Types

1. **Welcome Email**
   - Sent on registration
   - Includes email verification link
   - Link expires in 24 hours

2. **Password Reset Email**
   - Sent on forgot password request
   - Includes reset link
   - Link expires in 1 hour

3. **Password Changed Confirmation**
   - Sent after password change
   - Security notification
   - Includes support contact

4. **Account Locked Notification**
   - Sent when account locked
   - Shows unlock time
   - Includes support contact

5. **Login Notification** (Optional)
   - Sent for suspicious logins
   - Shows login details (IP, device, time)
   - Security alert

---

## Configuration

### Environment Variables

```bash
# Session
SESSION_SECRET=your-secret-key-change-in-production

# Database
DATABASE_URL=postgresql://...

# Email
ZEPTOMAIL_API_KEY=your-api-key
ZEPTOMAIL_FROM_EMAIL=sysadmin@estateagentscouncil.org

# Base URL
BASE_URL=https://mms.estateagentscouncil.org
```

### Customization

**Password Requirements:** Edit `server/auth/authService.ts`
```typescript
const AUTH_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  // ...
};
```

**Session Timeouts:** Edit `server/auth/sessionService.ts`
```typescript
const SESSION_CONFIG = {
  IDLE_TIMEOUT_MINUTES: 60,
  ABSOLUTE_TIMEOUT_HOURS: 8,
  CLEANUP_INTERVAL_MINUTES: 60,
};
```

**Role Permissions:** Edit `server/auth/rbacService.ts`
```typescript
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  custom_role: [
    Permission.MEMBER_READ,
    Permission.CASE_READ,
    // ...
  ],
};
```

---

## Usage Examples

### Frontend Integration

**Login Form:**
```typescript
async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Important for cookies
  });

  if (response.ok) {
    const { user } = await response.json();
    // Store user in state
  }
}
```

**Check Authentication:**
```typescript
async function checkAuth() {
  const response = await fetch('/api/auth/me', {
    credentials: 'include',
  });

  if (response.ok) {
    const user = await response.json();
    return user;
  }
  return null;
}
```

**Session Timeout Warning:**
```typescript
// Check session timeout header
const remaining = response.headers.get('X-Session-Timeout-Remaining');
const warning = response.headers.get('X-Session-Warning');

if (warning && parseInt(remaining) < 5) {
  // Show "Session expiring soon" warning
  showSessionWarning(remaining);
}
```

---

## Best Practices

### 1. Always Use HTTPS in Production
```typescript
cookie: {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict',
}
```

### 2. Implement Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
});

app.post('/api/auth/login', loginLimiter, ...);
```

### 3. Log Security Events
```typescript
// Log failed logins
console.warn(`Failed login attempt for ${email} from ${ip}`);

// Log successful logins
console.info(`User ${userId} logged in from ${ip}`);
```

### 4. Implement CSRF Protection
```typescript
import csrf from 'csurf';

app.use(csrf({ cookie: true }));
```

### 5. Regular Security Audits
- Review permission assignments
- Check for inactive accounts
- Monitor failed login attempts
- Review session activity

---

## Troubleshooting

### Issue: Session Expires Too Quickly
**Solution:** Increase `IDLE_TIMEOUT_MINUTES` in `sessionService.ts`

### Issue: Password Too Weak Error
**Solution:** Review password requirements in `authService.ts` `AUTH_CONFIG`

### Issue: Email Not Sending
**Solution:** Check ZeptoMail configuration and API key

### Issue: Account Locked Unexpectedly
**Solution:** Check `MAX_LOGIN_ATTEMPTS` and `LOCKOUT_DURATION_MINUTES`

---

## Future Enhancements

- [ ] Two-Factor Authentication (2FA)
- [ ] OAuth/Social Login
- [ ] Password History (prevent reuse)
- [ ] Biometric Authentication
- [ ] Audit Log for All Auth Events
- [ ] IP Whitelisting
- [ ] Device Management
- [ ] Account Recovery Questions

---

## Support

For questions or issues:
- **Email:** support@estateagentscouncil.org
- **Documentation:** `/docs/authentication`
- **GitHub Issues:** [Repository Issues]

---

**Last Updated:** October 3, 2025
**Version:** 1.0.0
