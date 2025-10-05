# CLAUDE.md - Estate Agents Council of Zimbabwe

## Project Overview
Estate Agents Council of Zimbabwe (EACZ) is a comprehensive member management system for regulating real estate professionals in Zimbabwe. This system manages member registrations, applications, renewals, CPD activities, cases, events, payments, and organizational compliance.

### System Purpose
- **Member Management**: Registration and lifecycle management of real estate professionals
- **Application Processing**: Handle individual and organization membership applications
- **Regulatory Compliance**: Track CPD points, renewals, and professional standards
- **Case Management**: Handle complaints, disputes, and violations
- **Event Management**: Organize and track professional development events
- **Financial Management**: Process payments, fees, and installments
- **Organizational Oversight**: Manage real estate firms and their compliance

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk (integrated)
- **Payments**: Stripe + PayNow (Zimbabwe)
- **Email**: ZeptoMail
- **File Storage**: Google Cloud Storage (optional)

## Development Commands

### Start Development Server
```bash
# Local development with local database
DATABASE_URL=postgresql://macbook@localhost:5432/eacz_dev PORT=5002 SESSION_SECRET=development-secret-key-for-testing-only npm run dev

# Or with Neon production database
DATABASE_URL=postgresql://neondb_owner:npg_6RkPzLfj0Noi@ep-wispy-unit-ad5uuk40-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require PORT=5002 SESSION_SECRET=development-secret-key-for-testing-only npm run dev
```

### Database Commands
```bash
# With local database
DATABASE_URL=postgresql://macbook@localhost:5432/eacz_dev npx drizzle-kit push
psql postgresql://macbook@localhost:5432/eacz_dev

# With Neon production database
DATABASE_URL=postgresql://neondb_owner:npg_6RkPzLfj0Noi@ep-wispy-unit-ad5uuk40-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require npx drizzle-kit push
```

### Build and Deployment
```bash
# Test production build
npm run build

# Deploy to Vercel (after configuring environment variables)
vercel --prod
```

### Testing Commands
```bash
# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Project Structure

### Key Directories
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared schema and types
- `migrations/` - Database migration files

### Important Files
- `shared/schema.ts` - Database schema definitions
- `server/clerkAuth.ts` - Clerk authentication middleware
- `server/storage.ts` - Database operations layer
- `client/src/components/ClerkAuthComponents.tsx` - Clerk UI components
- `.env.local` - Development environment variables
- `drizzle.config.ts` - Database configuration

## Authentication
- **System**: Clerk authentication
- **Database Integration**: Users table with `clerk_id` field
- **Components**: Located in `client/src/components/ClerkAuthComponents.tsx`

## Database
- **Database**: PostgreSQL (Neon Database for production)
- **ORM**: Drizzle
- **Local DB**: `eacz_dev` (development)
- **Production DB**: Neon Database - `neondb` (serverless PostgreSQL)
- **Connection**: Pooled connection with SSL required
- **Schema**: Defined in `shared/schema.ts`

## Environment Variables
Key environment variables in `.env.local`:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Express session secret
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk frontend key
- `CLERK_SECRET_KEY` - Clerk backend key

## Core System Entities

### User Types & Roles
- **super_admin**: Full system access and configuration
- **admin**: Administrative functions and oversight
- **member_manager**: Manage member lifecycles and applications
- **case_manager**: Handle cases, complaints, and disputes
- **staff**: Application processing and document verification
- **accountant**: Financial operations and payment processing
- **reviewer**: Application and document review
- **applicant**: Pre-registration status for new applicants

### Member Types (Professional Categories)
- **real_estate_agent**: Basic real estate agent license
- **property_manager**: Property management specialization
- **principal_real_estate_agent**: Senior agent with additional responsibilities
- **real_estate_negotiator**: Specialized negotiation roles

### Organization Types
- **real_estate_firm**: Standard real estate businesses
- **property_management_firm**: Property management companies
- **brokerage_firm**: Real estate brokerage services
- **real_estate_development_firm**: Property development companies

### Application Workflow Stages
1. **initial_review**: Basic application validation
2. **document_verification**: Document authenticity checks
3. **background_check**: Professional and criminal background verification
4. **committee_review**: Board/committee evaluation
5. **final_approval**: Final decision and certification
6. **certificate_generation**: License/certificate issuance

### Payment Methods
- **cash**: Cash payments (tracked)
- **paynow_ecocash**: PayNow via EcoCash (Zimbabwe)
- **paynow_onemoney**: PayNow via OneMoney (Zimbabwe)
- **stripe_card**: International card payments via Stripe
- **bank_transfer**: Direct bank transfers
- **cheque**: Check payments

## Database Schema Overview

### Core Tables
- **users**: System users and authentication (with Clerk integration)
- **members**: Registered professional members
- **organizations**: Real estate firms and companies
- **applicants**: Individual applicants (pre-registration)
- **organization_applicants**: Organization applicants (pre-registration)

### Application Management
- **member_applications**: Individual membership applications
- **organization_applications**: Organization membership applications
- **individual_applications**: Detailed individual application data
- **application_workflows**: Workflow tracking and stage management
- **uploaded_documents**: Document management and verification

### Regulatory & Compliance
- **member_renewals**: Annual membership renewals
- **cpd_activities**: Continuing Professional Development tracking
- **achievement_badges**: Professional achievements and certifications
- **cases**: Complaints, disputes, and violations
- **audit_logs**: System activity and compliance tracking

### Events & Finance
- **events**: Professional development events and training
- **event_registrations**: Event attendance tracking
- **payments**: All financial transactions
- **payment_installments**: Payment plan management
- **notifications**: System communications

### System Management
- **user_sessions**: Active user session tracking
- **user_permissions**: Granular permission management
- **system_settings**: Application configuration
- **naming_series_counters**: Auto-numbering for IDs

## Key Business Processes

### Member Registration Flow
1. **Pre-registration**: Create applicant record with email verification
2. **Application**: Complete detailed membership application
3. **Document Upload**: Submit required professional documents
4. **Payment**: Process application fees
5. **Review Process**: Multi-stage verification and approval
6. **Membership**: Issue membership number and certificate
7. **Annual Renewal**: Yearly renewal with CPD requirements

### Organization Registration Flow
1. **Company Pre-registration**: Register organization details
2. **Principal Agent Assignment**: Assign responsible principal agent
3. **Trust Account Verification**: Verify financial compliance
4. **Document Submission**: Corporate and regulatory documents
5. **Fee Payment**: Organization registration fees
6. **Approval Process**: Regulatory compliance review
7. **Registration**: Issue organization registration number

### Case Management Process
1. **Case Creation**: Log complaints or violations
2. **Assignment**: Assign to case manager
3. **Investigation**: Gather evidence and documentation
4. **Resolution**: Mediation, penalties, or dismissal
5. **Follow-up**: Monitor compliance and outcomes

## Production Environment

### Production Stack
- **Database**: Neon Database (PostgreSQL) - Serverless PostgreSQL for production scaling
- **Authentication**: Clerk - Production-ready authentication service with full user management
- **Email Service**: ZeptoMail - Reliable transactional email delivery service
- **Hosting**: Vercel (recommended) - Serverless deployment platform
- **File Storage**: Google Cloud Storage (configured)
- **Payments**: Stripe (international) + PayNow (Zimbabwe local)

### Production Configuration

#### Neon Database Setup
- Production PostgreSQL database hosted on Neon
- Automatic connection pooling and scaling
- Built-in backups and point-in-time recovery
- Connection string format: `postgresql://username:password@host/database`
- Database name: `eacz_production`

#### Clerk Production Settings
- Production Clerk application with live keys
- Custom domain configuration for authentication flows
- User management dashboard for admin operations
- Production webhook endpoints for user events
- Multi-factor authentication enabled

#### ZeptoMail Configuration
- Production email service for all system notifications
- Member registration confirmation emails
- Application status updates and notifications
- Case management communications
- Event registration confirmations
- Payment receipts and invoices

#### Environment Variables (Production)
```bash
# Database
DATABASE_URL=postgresql://username:password@neon-host/eacz_production

# Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Email Service
Sender_Address="sysadmin@estateagentscouncil.org"
Host="api.zeptomail.eu"
Send_Mail_Token="yA6KbHtf7A/zwm0EFkQ5hpnd9I1j/6A/gS2ztiu3e5QkLIPnjKFqhBRvJ9e6JDHZ24SFsK0EaY4Ydtu9uokNd5ExPYMALpTGTuv4P2uV48xh8ciEYNYljJWhA7UTEKJJeRkmCig0RfAgWA=="

# Security
SESSION_SECRET="secure-production-session-secret"

# Payments
STRIPE_SECRET_KEY="sk_live_..."

# File Storage
GOOGLE_CLOUD_PROJECT_ID="eacz-production"
GOOGLE_CLOUD_PRIVATE_KEY="production-service-account-key"
GOOGLE_CLOUD_CLIENT_EMAIL="service@eacz-production.iam.gserviceaccount.com"
```

#### Deployment Process
1. **Environment Setup**: Configure all production environment variables
2. **Database Migration**: Apply schema migrations to Neon database
3. **Clerk Configuration**: Set up production domain and authentication flows
4. **ZeptoMail Setup**: Configure email templates and sending domains
5. **DNS Configuration**: Set up custom domain and SSL certificates
6. **Monitoring Setup**: Configure error tracking and performance monitoring

#### Production Security
- All secrets stored in Vercel environment variables
- HTTPS enforcement for all endpoints
- Clerk handles password security and user data protection
- Database connections encrypted in transit
- Email tokens secured with ZeptoMail authentication

#### Scaling Considerations
- Neon Database auto-scales based on connection demand
- Vercel serverless functions scale automatically
- Clerk authentication handles unlimited users
- ZeptoMail provides high-volume email delivery
- Google Cloud Storage scales for document management

## Recent Changes
- Integrated Clerk authentication system
- Added `clerk_id` field to users table
- Created Clerk authentication components
- Updated server middleware for Clerk integration
- Completed full-stack authentication flow
- **Migrated to Neon Database** (serverless PostgreSQL for production)
- **Prepared Vercel deployment configuration**
- Created comprehensive deployment documentation (DEPLOYMENT.md)
- Updated environment variables for production deployment
- Successfully tested production build process

## Development Notes
- Always use the DATABASE_URL and SESSION_SECRET when running dev server
- Clerk integration is complete and ready for testing
- Database migrations should be managed with `drizzle-kit push` for Neon compatibility
- Multiple background dev servers may be running - check port 5002 for main server
- Demo data is auto-populated on server startup
- System supports both individual and organization workflows
- PayNow integration configured for Zimbabwe local payments
- Email verification flows implemented for all applicant types
- **Production database**: Neon Database (serverless PostgreSQL with connection pooling)
- **Deployment platform**: Vercel (configured with vercel.json)
- See DEPLOYMENT.md for complete deployment instructions
- Build output: `dist/public/` (frontend) and `dist/index.js` (backend)

## Applicatin and Tracking System

Develop a full featured modern, intuitive Registration ,Application and Application Tracking System for the Members  (Individual and Organization) Application workflow with Email Notification. Applicant Registration process creates an Applicant Account which is then converted to a Member (Customer) and User Account upon Application Approval by dropping the APP from APP-ORG/MBR-YYYY-XXXX and replacing it with EAC and keep the rest of the naming series ID. Applicant ID, Member ID and User ID fields are not editable. They are Auto generated by the System. For Email Notification we are using ZeptoMail and you are going to create a smooth Integration with Zeptomail and i wiil provide the API IDs, Sender Email Address and API Key. The Application workflow should follow:
Applicant Registration - Applicant receives an Email to Verify their Email Address and use their Application ID as their Password. The Applicant then signs in and continues their Multi-Step Application Form for Individual Members: (Application form broken down into these sections: Personal Details, Address, Professional Details, Required Document Uploads, Application Fee Payments, Final Checklist and Confirmation Section), 

Application form for Organizational Members with sections: Company Details,  Director,Principal Real Estate Agent Details, Required document uploads, Payments, Final Checklist and Confirmations)

1. Individual or Organization Applicant is presented with a page showing two Card choices:
a. If you have already Registered click here to continue your application form. Application Login page opens and Applicant enters their email address and applicant ID as the password.
b. Register to apply for Membership Button

## Claude Code Rules:
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
8. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY
9. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY

CRITICAL: When debugging, you MUST trace through the ENTIRE code flow step by step. No assumptions. No shortcuts.