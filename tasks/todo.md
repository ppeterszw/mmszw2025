# Application and Tracking System Implementation Plan

## Project Overview
Develop a full-featured modern, intuitive Registration, Application and Application Tracking System for the Members (Individual and Organization) with the following key requirements:

### Core Requirements:
- **Applicant Registration** → Creates Applicant Account with email verification
- **Email verification** using Application ID as password
- **Multi-step Application Forms** with specific sections for Individual vs Organization
- **Two-path Landing Page** (continue existing vs register new)
- **ID Conversion** APP-ORG/MBR-YYYY-XXXX → EAC-ORG/MBR-YYYY-XXXX upon approval
- **ZeptoMail Integration** for smooth email notifications

## Current State Analysis

### ✅ What Already Exists:
- ZeptoMail email service integration (`server/services/emailService.ts`)
- ID generation system (`server/services/namingSeries.ts`)
- Application creation endpoints (`server/applicationRoutes.ts`)
- Two-path choice pages (`client/src/pages/*-application-choice.tsx`)
- Document upload and payment processing
- Admin workflow management

### ❌ Missing Components:
1. **Backend**: Applicant registration API endpoint (frontend calls `/api/applicants/register` - doesn't exist)
2. **Backend**: Email verification with Applicant ID as password (currently uses OTP)
3. **Frontend**: Multi-step application forms (currently single-page)
4. **Frontend**: Applicant authentication flow integration

## Implementation Tasks

### Phase 1: Backend Applicant Registration API
- [ ] **Create applicant registration endpoints**
  - activeForm: "Creating applicant registration endpoints"
  - status: pending

- [ ] **Implement email verification with Applicant ID as password**
  - activeForm: "Implementing email verification with Applicant ID as password"
  - status: pending

- [ ] **Create applicant authentication middleware**
  - activeForm: "Creating applicant authentication middleware"
  - status: pending

### Phase 2: Frontend Multi-Step Application Forms
- [ ] **Create Individual multi-step application form components**
  - activeForm: "Creating Individual multi-step application form components"
  - status: pending

- [ ] **Create Organization multi-step application form components**
  - activeForm: "Creating Organization multi-step application form components"
  - status: pending

- [ ] **Implement applicant authentication hooks and protected routes**
  - activeForm: "Implementing applicant authentication hooks and protected routes"
  - status: pending

### Phase 3: Email Integration and User Flow
- [ ] **Update email templates for new registration flow**
  - activeForm: "Updating email templates for new registration flow"
  - status: pending

- [ ] **Create email verification pages with Applicant ID login**
  - activeForm: "Creating email verification pages with Applicant ID login"
  - status: pending

- [ ] **Integrate ZeptoMail notifications throughout application workflow**
  - activeForm: "Integrating ZeptoMail notifications throughout application workflow"
  - status: pending

### Phase 4: Testing and Integration
- [ ] **Test complete registration → application → approval workflow**
  - activeForm: "Testing complete registration → application → approval workflow"
  - status: pending

- [ ] **Test email verification and ID-based authentication**
  - activeForm: "Testing email verification and ID-based authentication"
  - status: pending

- [ ] **Verify ID conversion from APP to EAC upon approval**
  - activeForm: "Verifying ID conversion from APP to EAC upon approval"
  - status: pending

## Detailed Implementation Steps

### 1. Applicant Registration API (`server/publicRoutes.ts`)

**Required Endpoints:**
- `POST /api/applicants/register` (Individual)
- `POST /api/organization-applicants/register` (Organization)
- `POST /api/applicants/verify-email` (Email verification with Applicant ID)
- `POST /api/applicants/login` (Applicant ID + verified email authentication)

**Database Changes:**
- Use existing `applicants` and `organization_applicants` tables
- Add `applicantId` generation using existing naming series
- Add email verification token system

### 2. Multi-Step Form Structure

**Individual Application Sections:**
1. Personal Details (name, DOB, national ID, contact info)
2. Address Details
3. Professional Details (education, employment)
4. Required Document Uploads
5. Application Fee Payment
6. Final Checklist and Confirmation

**Organization Application Sections:**
1. Company Details (legal name, trading name, registration)
2. Director/Principal Real Estate Agent Details
3. Required Document Uploads
4. Payment Processing
5. Final Checklist and Confirmations

### 3. Authentication Flow Update

**Current Flow Issues:**
- Frontend calls `/api/applicants/register` (endpoint missing)
- OTP verification vs Applicant ID verification mismatch

**Required Changes:**
- Create missing applicant registration endpoints
- Modify verification to use Applicant ID as password
- Update applicant authentication middleware

## Technical Approach

### Simplicity Guidelines:
- ✅ **Minimal code changes** - build on existing infrastructure
- ✅ **Reuse existing components** - leverage current UI components
- ✅ **Extend current patterns** - follow established code patterns
- ✅ **Simple step-by-step** - break complex forms into manageable steps

### No Breaking Changes:
- Keep existing application creation endpoints functional
- Maintain current admin workflow compatibility
- Preserve existing member authentication system

## Success Criteria

### Functional Requirements:
1. ✅ Applicant can register and receive Applicant ID
2. ✅ Email verification using Applicant ID as password works
3. ✅ Multi-step application forms guide user through process
4. ✅ Two-path landing page directs users correctly
5. ✅ ID conversion works upon approval (APP → EAC)
6. ✅ ZeptoMail sends notifications at each step

### Technical Requirements:
1. ✅ All existing functionality remains intact
2. ✅ New endpoints follow existing patterns
3. ✅ Database schema changes are minimal
4. ✅ Frontend components are reusable and maintainable

## Next Steps
1. **Review this plan** with team/user for approval
2. **Begin Phase 1** with backend applicant registration API
3. **Implement step-by-step** following the Claude Code Rules
4. **Test each component** before moving to next phase

---

## Progress Tracking
- **Total Tasks**: 12
- **Completed**: 0
- **In Progress**: 0
- **Pending**: 12

## Review Section
_To be completed after implementation_

### Changes Made:
_Summary of actual changes implemented_

### Issues Encountered:
_Any problems found and how they were resolved_

### Additional Notes:
_Any relevant information for future development_