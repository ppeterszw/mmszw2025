# replit.md

## Overview

This is a full-stack Estate Agents Council of Zimbabwe (EACZ) management system built with React, TypeScript, Express.js, and PostgreSQL. The application manages individual and organizational members, handles membership applications, case management, event scheduling, and payment processing for the Estate Agents Council. It features role-based access control, document management with Google Cloud Storage, and payment integration with Paynow and Stripe.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### September 22, 2025
- **Admin User Profile Management**: Implemented comprehensive user profile dropdown in admin dashboard
  - Added UserProfileDropdown component with profile editing and password change functionality
  - Created backend API endpoints for profile updates (/api/user/profile) and password changes (/api/user/password)
  - Integrated Zeptomail email notifications for profile and password changes
  - Enhanced security with password verification and proper form validation
  - Updated UnifiedPortalHeader to include modern profile management interface

- **Session Timeout & Activity Tracking**: Added automatic logout functionality with user activity monitoring
  - Implemented 5-minute inactivity timeout with 30-second warning before logout
  - Activity tracking monitors mouse movement, clicks, keyboard input, scrolling, and touch events
  - SessionTimeoutProvider component wraps authenticated content
  - useSessionTimeout hook manages timeout logic and integrates with authentication system
  - Automatic timer reset on any user activity to prevent premature logout

- **Centered Notification System**: Moved all system notifications to center of screen
  - Updated ToastViewport positioning to display notifications in screen center instead of bottom right
  - Applied to all notification types: login success, profile updates, application submissions, etc.
  - Enhanced pointer event handling to prevent empty viewport from blocking UI interactions
  - Maintains proper toast animations and auto-dismiss functionality

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom EACZ branding (Egyptian blue theme)
- **State Management**: TanStack React Query for server state and React Hook Form for form management
- **Routing**: Wouter for client-side routing with protected routes
- **Authentication**: Context-based auth with session management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Passport.js with local strategy using scrypt password hashing
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **API Design**: RESTful endpoints with Zod schema validation

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless connection
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Key Entities**: Users, Members, Organizations, Applications, Cases, Events, Payments, Documents
- **Enums**: Comprehensive enums for member types, organization types, case statuses, payment methods
- **Relationships**: Well-defined foreign key relationships between entities

### File Storage
- **Provider**: Google Cloud Storage with object-level ACL
- **Integration**: Custom ObjectStorageService with access control policies
- **Upload Handling**: Uppy.js dashboard for file uploads with progress tracking
- **Security**: Object-level permissions and access group management

### Authentication & Authorization
- **Strategy**: Session-based authentication with role-based access control
- **User Roles**: admin, member_manager, case_manager, super_admin
- **Session Management**: Secure session storage with PostgreSQL backend
- **Password Security**: Scrypt-based password hashing with salt

### Payment Integration
- **Local Provider**: Paynow integration for EcoCash, OneMoney, and bank transfers
- **International**: Stripe integration for credit/debit card payments
- **Cash Payments**: In-person payment tracking and management
- **Fee Structure**: Configurable membership fees, application fees, and processing fees

### Document Management
- **Certificate Generation**: Digital certificate templates with QR codes
- **Document Upload**: Required document verification for applications
- **Storage**: Cloud-based document storage with access controls
- **Verification**: Public certificate verification system

### Application Processing
- **Requirements Checking**: Automated validation of education and age requirements
- **Document Verification**: Administrative review of uploaded documents
- **Approval Workflow**: Multi-step application approval process
- **Bulk Operations**: Support for bulk member and organization imports

## External Dependencies

### Database & Storage
- **@neondatabase/serverless**: PostgreSQL database connection
- **@google-cloud/storage**: Cloud file storage and management
- **drizzle-orm**: Type-safe database ORM and query builder

### Payment Processing
- **@stripe/stripe-js & @stripe/react-stripe-js**: International payment processing
- **Paynow API**: Local Zimbabwe payment gateway integration

### UI & Components
- **@radix-ui/***: Comprehensive accessible UI component primitives
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation with Zod integration

### File Handling
- **@uppy/core, @uppy/dashboard, @uppy/aws-s3, @uppy/react**: File upload management
- **class-variance-authority**: Type-safe component variant management

### Development & Build
- **vite**: Fast development server and build tool
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds

### Authentication & Security
- **passport & passport-local**: Authentication middleware
- **express-session & connect-pg-simple**: Session management
- **crypto**: Built-in Node.js cryptographic functions for password hashing

### Form & Validation
- **react-hook-form**: Performant form state management
- **zod**: Runtime type validation and schema parsing
- **@hookform/resolvers**: Form validation resolver integration