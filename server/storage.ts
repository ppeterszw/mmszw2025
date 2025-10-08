import {
  users, organizations, members, cases, events, directors,
  eventRegistrations, payments, documents, userSessions, applicationWorkflows,
  paymentInstallments, notifications, userPermissions, auditLogs, applicants,
  organizationApplicants, individualApplications, organizationApplications, memberRenewals, systemSettings,
  type User, type InsertUser, type Member, type InsertMember,
  type Organization, type InsertOrganization, type Director, type InsertDirector,
  type MemberApplication,
  type InsertMemberApplication, type Case, type InsertCase,
  type Event, type InsertEvent, type Payment, type InsertPayment,
  type Document, type InsertDocument, type UserSession, type InsertUserSession,
  type ApplicationWorkflow, type InsertApplicationWorkflow, type PaymentInstallment,
  type InsertPaymentInstallment, type Notification, type InsertNotification,
  type UserPermission, type InsertUserPermission, type AuditLog, type InsertAuditLog,
  type Applicant, type InsertApplicant, type OrganizationApplicant, type InsertOrganizationApplicant,
  type OrganizationApplication, type InsertOrganizationApplication,
  type MemberRenewal, type InsertMemberRenewal, type SystemSettings, type InsertSystemSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, count, sql, or } from "drizzle-orm";
import session from "express-session";
import { NeonSessionStore } from "./neonSessionStore";
import { hashPassword, comparePasswords } from "./auth";
import crypto from "crypto";

// Migration function to convert plaintext passwords to hashed passwords
async function migrateToHashedPasswords() {
  try {
    console.log("Checking for plaintext passwords to migrate...");
    
    // Find users with plaintext passwords (no "." in password)
    const plainTextUsers = await db.select().from(users).where(sql`password NOT LIKE '%.%'`);
    
    if (plainTextUsers.length === 0) {
      console.log("No plaintext passwords found. Migration not needed.");
      return;
    }
    
    console.log(`Found ${plainTextUsers.length} users with plaintext passwords. Migrating...`);
    
    for (const user of plainTextUsers) {
      const hashedPassword = await hashPassword(user.password);
      await db.update(users)
        .set({ 
          password: hashedPassword,
          passwordChangedAt: new Date()
        })
        .where(eq(users.id, user.id));
      
      console.log(`Migrated password for user: ${user.email}`);
    }
    
    console.log(`Successfully migrated ${plainTextUsers.length} passwords to hashed format.`);
  } catch (error) {
    console.error("Error during password migration:", error);
    throw error;
  }
}

export interface IStorage {
  // Enhanced User Management operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  lockUser(id: string, lockedUntil: Date): Promise<User>;
  unlockUser(id: string): Promise<User>;
  updateLastLogin(id: string): Promise<User>;
  incrementLoginAttempts(id: string): Promise<User>;
  resetLoginAttempts(id: string): Promise<User>;
  verifyPassword(email: string, password: string): Promise<boolean>;
  updateUserPassword(id: string, newPassword: string): Promise<User>;

  // Clerk integration methods
  getUserByClerkId(clerkId: string): Promise<User | undefined>;
  createUserFromClerk(clerkData: { clerkId: string; email: string; firstName: string; lastName: string }): Promise<User>;

  // Applicant operations
  createApplicant(applicant: InsertApplicant): Promise<Applicant>;
  getApplicant(id: string): Promise<Applicant | undefined>;
  getApplicantByEmail(email: string): Promise<Applicant | undefined>;
  getApplicantByApplicantId(applicantId: string): Promise<Applicant | undefined>;
  getApplicantByVerificationToken(token: string): Promise<Applicant | undefined>;
  updateApplicant(id: string, updates: Partial<Applicant>): Promise<Applicant>;
  verifyApplicantEmail(id: string): Promise<Applicant>;
  listApplicants(): Promise<Applicant[]>;
  
  // Organization Applicant operations
  createOrganizationApplicant(applicant: InsertOrganizationApplicant): Promise<OrganizationApplicant>;
  getOrganizationApplicant(id: string): Promise<OrganizationApplicant | undefined>;
  getOrganizationApplicantByEmail(email: string): Promise<OrganizationApplicant | undefined>;
  getOrganizationApplicantByApplicantId(applicantId: string): Promise<OrganizationApplicant | undefined>;
  getOrganizationApplicantByVerificationToken(token: string): Promise<OrganizationApplicant | undefined>;
  updateOrganizationApplicant(id: string, updates: Partial<OrganizationApplicant>): Promise<OrganizationApplicant>;
  verifyOrganizationApplicantEmail(id: string): Promise<OrganizationApplicant>;
  listOrganizationApplicants(): Promise<OrganizationApplicant[]>;
  
  // Application draft operations
  saveApplicationDraft(applicantId: string, applicationData: any): Promise<{ id: string; applicationData: any; updatedAt: Date }>;
  loadApplicationDraft(applicantId: string): Promise<{ id: string; applicationData: any; updatedAt: Date } | null>;
  
  // Member operations
  getMember(id: string): Promise<Member | undefined>;
  getMemberByUserId(userId: string): Promise<Member | undefined>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  getMemberByMembershipNumber(number: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, updates: Partial<Member>): Promise<Member>;
  getAllMembers(): Promise<Member[]>;
  
  // Organization operations
  getOrganization(id: string): Promise<Organization | undefined>;
  getOrganizationByRegistrationNumber(number: string): Promise<Organization | undefined>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization>;
  getAllOrganizations(): Promise<Organization[]>;
  
  // Enhanced Application operations
  getMemberApplication(id: string): Promise<MemberApplication | undefined>;
  createMemberApplication(app: InsertMemberApplication): Promise<MemberApplication>;
  updateMemberApplication(id: string, updates: Partial<MemberApplication>): Promise<MemberApplication>;
  getPendingApplications(): Promise<MemberApplication[]>;
  getApplicationsByStatus(status: string): Promise<MemberApplication[]>;
  getApplicationsByStage(stage: string): Promise<MemberApplication[]>;
  getAllApplications(): Promise<MemberApplication[]>;
  assignApplicationReviewer(id: string, reviewerId: string): Promise<MemberApplication>;
  
  // Organization Application operations
  getOrganizationApplication(id: string): Promise<OrganizationApplication | undefined>;
  createOrganizationApplication(app: InsertOrganizationApplication): Promise<OrganizationApplication>;
  updateOrganizationApplication(id: string, updates: Partial<OrganizationApplication>): Promise<OrganizationApplication>;
  getAllOrganizationApplications(): Promise<OrganizationApplication[]>;
  getOrganizationApplicationsByStatus(status: string): Promise<OrganizationApplication[]>;
  assignOrganizationApplicationReviewer(id: string, reviewerId: string): Promise<OrganizationApplication>;
  
  // Application Workflow operations
  createApplicationWorkflow(workflow: InsertApplicationWorkflow): Promise<ApplicationWorkflow>;
  getWorkflowsByApplication(applicationId: string): Promise<ApplicationWorkflow[]>;
  updateWorkflowStage(id: string, updates: Partial<ApplicationWorkflow>): Promise<ApplicationWorkflow>;
  getWorkflowsByStage(stage: string): Promise<ApplicationWorkflow[]>;
  getWorkflowsByAssignee(userId: string): Promise<ApplicationWorkflow[]>;
  
  // Case operations
  getCase(id: string): Promise<Case | undefined>;
  getCaseByCaseNumber(number: string): Promise<Case | undefined>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: string, updates: Partial<Case>): Promise<Case>;
  getAllCases(): Promise<Case[]>;
  getCasesByStatus(status: string): Promise<Case[]>;
  getCasesByPriority(priority: string): Promise<Case[]>;
  assignCase(caseId: string, assignedTo?: string): Promise<Case>;
  bulkAssignCases(caseIds: string[], assignedTo: string): Promise<Case[]>;
  bulkResolveCases(caseIds: string[], resolution?: string): Promise<Case[]>;
  bulkCloseCases(caseIds: string[]): Promise<Case[]>;
  getStaffUsers(): Promise<User[]>;
  
  // Event operations
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: Partial<Event>): Promise<Event>;
  getAllEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  
  // Enhanced Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByMember(memberId: string): Promise<Payment[]>;
  getPaymentsByOrganization(organizationId: string): Promise<Payment[]>;
  getPaymentsByApplication(applicationId: string): Promise<Payment[]>;
  updatePaymentStatus(id: string, status: string): Promise<Payment>;
  processRefund(id: string, refundAmount: number, reason: string): Promise<Payment>;
  getAllPayments(): Promise<Payment[]>;
  getRecentPayments(limit: number): Promise<Payment[]>;
  getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<Payment[]>;
  getPaymentsByMethod(method: string): Promise<Payment[]>;
  
  // Payment Installments
  createPaymentInstallment(installment: InsertPaymentInstallment): Promise<PaymentInstallment>;
  getInstallmentsByPayment(paymentId: string): Promise<PaymentInstallment[]>;
  updateInstallmentStatus(id: string, status: string): Promise<PaymentInstallment>;
  
  // Document operations
  createDocument(doc: InsertDocument): Promise<Document>;
  getDocumentsByMember(memberId: string): Promise<Document[]>;
  getDocumentsByApplication(applicationId: string): Promise<Document[]>;
  verifyDocument(id: string, verifierId: string): Promise<Document>;
  
  // Session Management
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserSessions(userId: string): Promise<UserSession[]>;
  updateSessionActivity(sessionId: string): Promise<UserSession>;
  deactivateSession(sessionId: string): Promise<UserSession>;
  cleanupExpiredSessions(): Promise<number>;
  
  // User Permissions
  createUserPermission(permission: InsertUserPermission): Promise<UserPermission>;
  getUserPermissions(userId: string): Promise<UserPermission[]>;
  checkUserPermission(userId: string, permission: string, resource?: string): Promise<boolean>;
  revokeUserPermission(id: string): Promise<UserPermission>;
  
  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  getMemberNotifications(memberId: string): Promise<Notification[]>;
  markNotificationSent(id: string): Promise<Notification>;
  markNotificationDelivered(id: string): Promise<Notification>;
  markNotificationOpened(id: string): Promise<Notification>;
  getPendingNotifications(): Promise<Notification[]>;
  
  // Audit Logging
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(filters?: { userId?: string; resource?: string; action?: string }): Promise<AuditLog[]>;
  
  // Dashboard Statistics
  getDashboardStats(): Promise<{
    totalMembers: number;
    activeOrganizations: number;
    pendingApplications: number;
    openCases: number;
    revenueThisMonth?: number;
    renewalsPending?: number;
  }>;
  
  // Finance Statistics and Payments  
  getFinanceStats(filters?: { startDate?: Date; endDate?: Date }): Promise<{
    totalRevenue: number;
    monthlyRevenue: number;
    pendingPayments: number;
    completedPayments: number;
    membershipFees: number;
    applicationFees: number;
    eventFees: number;
    renewalFees: number;
  }>;
  listPayments(filters?: {
    status?: string;
    type?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ payments: Payment[]; total: number }>;
  listRecentPayments(limit?: number): Promise<Payment[]>;
  
  // Renewals Management
  listRenewals(filters?: {
    year?: number;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ renewals: MemberRenewal[]; total: number }>;
  updateRenewal(id: string, updates: Partial<MemberRenewal>): Promise<MemberRenewal>;
  incrementRenewalReminder(id: string): Promise<MemberRenewal>;
  generateRenewals(year: number, defaultFee?: number): Promise<{ created: number; skipped: number }>;
  
  // System Settings
  getSettings(): Promise<SystemSettings[]>;
  getSetting(key: string): Promise<SystemSettings | undefined>;
  updateSettings(settings: { key: string; value: string; description?: string }[]): Promise<SystemSettings[]>;
  updateSetting(key: string, value: string, description?: string, updatedBy?: string): Promise<SystemSettings>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  private migrationCompleted = false;

  constructor() {
    // Use NeonSessionStore for Neon serverless compatibility
    this.sessionStore = new NeonSessionStore();

    // Run password migration on startup
    this.runPasswordMigration();
  }

  private async runPasswordMigration() {
    if (this.migrationCompleted) return;
    try {
      await migrateToHashedPasswords();
      this.migrationCompleted = true;
    } catch (error) {
      console.error("Failed to run password migration:", error);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Applicant operations
  async createApplicant(insertApplicant: InsertApplicant): Promise<Applicant> {
    const { nextApplicationId } = await import('./services/namingSeries');
    const applicantId = await nextApplicationId('individual');
    
    // Generate verification token and expiry internally
    const { generateVerificationToken, getVerificationExpiry } = await import('./utils/applicantUtils');
    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationExpiry();
    
    const [applicant] = await db
      .insert(applicants)
      .values({ 
        ...insertApplicant, 
        applicantId,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpiry
      })
      .returning();
    return applicant;
  }

  async getApplicant(id: string): Promise<Applicant | undefined> {
    const [applicant] = await db.select().from(applicants).where(eq(applicants.id, id));
    return applicant || undefined;
  }

  async getApplicantByEmail(email: string): Promise<Applicant | undefined> {
    const [applicant] = await db.select().from(applicants).where(eq(applicants.email, email));
    return applicant || undefined;
  }

  async getApplicantByApplicantId(applicantId: string): Promise<Applicant | undefined> {
    const [applicant] = await db.select().from(applicants).where(eq(applicants.applicantId, applicantId));
    return applicant || undefined;
  }

  async getApplicantByVerificationToken(token: string): Promise<Applicant | undefined> {
    const [applicant] = await db.select().from(applicants).where(eq(applicants.emailVerificationToken, token));
    return applicant || undefined;
  }

  async updateApplicant(id: string, updates: Partial<Applicant>): Promise<Applicant> {
    const [applicant] = await db
      .update(applicants)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(applicants.id, id))
      .returning();
    return applicant;
  }

  async verifyApplicantEmail(id: string): Promise<Applicant> {
    const [applicant] = await db
      .update(applicants)
      .set({ 
        emailVerified: true, 
        status: 'email_verified',
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date() 
      })
      .where(eq(applicants.id, id))
      .returning();
    return applicant;
  }

  async listApplicants(): Promise<Applicant[]> {
    return await db.select().from(applicants).orderBy(desc(applicants.createdAt));
  }

  // Organization Applicant operations
  async createOrganizationApplicant(insertOrgApplicant: InsertOrganizationApplicant): Promise<OrganizationApplicant> {
    const { nextApplicationId } = await import('./services/namingSeries');
    const applicantId = await nextApplicationId('organization');
    
    // Generate verification token and expiry internally
    const { generateVerificationToken, getVerificationExpiry } = await import('./utils/applicantUtils');
    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationExpiry();
    
    const [orgApplicant] = await db
      .insert(organizationApplicants)
      .values({ 
        ...insertOrgApplicant, 
        applicantId,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpiry
      })
      .returning();
    return orgApplicant;
  }

  async getOrganizationApplicant(id: string): Promise<OrganizationApplicant | undefined> {
    const [orgApplicant] = await db.select().from(organizationApplicants).where(eq(organizationApplicants.id, id));
    return orgApplicant || undefined;
  }

  async getOrganizationApplicantByEmail(email: string): Promise<OrganizationApplicant | undefined> {
    const [orgApplicant] = await db.select().from(organizationApplicants).where(eq(organizationApplicants.email, email));
    return orgApplicant || undefined;
  }

  async getOrganizationApplicantByApplicantId(applicantId: string): Promise<OrganizationApplicant | undefined> {
    const [orgApplicant] = await db.select().from(organizationApplicants).where(eq(organizationApplicants.applicantId, applicantId));
    return orgApplicant || undefined;
  }

  async getOrganizationApplicantByVerificationToken(token: string): Promise<OrganizationApplicant | undefined> {
    const [orgApplicant] = await db.select().from(organizationApplicants).where(eq(organizationApplicants.emailVerificationToken, token));
    return orgApplicant || undefined;
  }

  async updateOrganizationApplicant(id: string, updates: Partial<OrganizationApplicant>): Promise<OrganizationApplicant> {
    const [orgApplicant] = await db
      .update(organizationApplicants)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizationApplicants.id, id))
      .returning();
    return orgApplicant;
  }

  async verifyOrganizationApplicantEmail(id: string): Promise<OrganizationApplicant> {
    const [orgApplicant] = await db
      .update(organizationApplicants)
      .set({ 
        emailVerified: true, 
        status: 'email_verified',
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date() 
      })
      .where(eq(organizationApplicants.id, id))
      .returning();
    return orgApplicant;
  }

  async listOrganizationApplicants(): Promise<OrganizationApplicant[]> {
    return await db.select().from(organizationApplicants).orderBy(desc(organizationApplicants.createdAt));
  }

  // Application draft operations
  async saveApplicationDraft(applicantId: string, applicationData: any): Promise<{ id: string; applicationData: any; updatedAt: Date }> {
    // First, get the applicant to find their applicant ID
    const applicant = await this.getApplicant(applicantId);
    if (!applicant) {
      throw new Error('Applicant not found');
    }

    // Check if there's already a draft application for this applicant
    const [existingDraft] = await db
      .select()
      .from(individualApplications)
      .where(eq(individualApplications.applicationId, applicant.applicantId));

    const draftData = {
      personal: JSON.stringify(applicationData.personalInfo || {}),
      oLevel: JSON.stringify(applicationData.oLevel || {}),
      aLevel: JSON.stringify(applicationData.aLevel || {}),
      equivalentQualification: JSON.stringify(applicationData.equivalentQualification || {}),
      matureEntry: applicationData.matureEntry || false,
      status: 'draft' as const,
      updatedAt: new Date()
    };

    if (existingDraft) {
      // Update existing draft
      const [updated] = await db
        .update(individualApplications)
        .set(draftData)
        .where(eq(individualApplications.id, existingDraft.id))
        .returning();
      
      return {
        id: updated.id,
        applicationData,
        updatedAt: updated.updatedAt || new Date()
      };
    } else {
      // Create new draft
      const [newDraft] = await db
        .insert(individualApplications)
        .values({
          applicationId: applicant.applicantId,
          ...draftData
        })
        .returning();
      
      return {
        id: newDraft.id,
        applicationData,
        updatedAt: newDraft.updatedAt || new Date()
      };
    }
  }

  async loadApplicationDraft(applicantId: string): Promise<{ id: string; applicationData: any; updatedAt: Date } | null> {
    // First, get the applicant to find their applicant ID
    const applicant = await this.getApplicant(applicantId);
    if (!applicant) {
      throw new Error('Applicant not found');
    }

    // Find the draft application
    const [draft] = await db
      .select()
      .from(individualApplications)
      .where(eq(individualApplications.applicationId, applicant.applicantId));

    if (!draft) {
      return null;
    }

    // Parse the JSON data
    const applicationData = {
      personalInfo: JSON.parse(draft.personal || '{}'),
      oLevel: JSON.parse(draft.oLevel || '{}'),
      aLevel: JSON.parse(draft.aLevel || '{}'),
      equivalentQualification: JSON.parse(draft.equivalentQualification || '{}'),
      matureEntry: draft.matureEntry || false
    };

    return {
      id: draft.id,
      applicationData,
      updatedAt: draft.updatedAt || new Date()
    };
  }

  // Member operations
  async getMember(id: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member || undefined;
  }

  async getMemberByUserId(userId: string): Promise<Member | undefined> {
    // Note: userId field doesn't exist in current schema, using clerkId instead
    const [member] = await db.select().from(members).where(eq(members.clerkId, userId));
    return member || undefined;
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.email, email));
    return member || undefined;
  }

  async getMemberByMembershipNumber(number: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.membershipNumber, number));
    return member || undefined;
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    // Use provided membership number or generate new one
    let membershipNumber = insertMember.membershipNumber;

    if (!membershipNumber) {
      // Only generate if not provided (for direct member creation)
      const { nextMemberNumber } = await import('./services/namingSeries');
      membershipNumber = await nextMemberNumber('individual');
    }

    const [member] = await db
      .insert(members)
      .values({ ...insertMember, membershipNumber })
      .returning();
    return member;
  }

  async updateMember(id: string, updates: Partial<Member>): Promise<Member> {
    const [member] = await db
      .update(members)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();
    return member;
  }

  async getAllMembers(): Promise<Member[]> {
    return await db.select().from(members).orderBy(desc(members.createdAt));
  }

  // Organization operations
  async getOrganization(id: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org || undefined;
  }

  async getOrganizationByRegistrationNumber(number: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.registrationNumber, number));
    return org || undefined;
  }

  async createOrganization(insertOrg: InsertOrganization): Promise<Organization> {
    // Use provided registration number or generate new one
    let registrationNumber = insertOrg.registrationNumber;
    if (!registrationNumber) {
      registrationNumber = `EAC-ORG-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
    }

    // Use provided organizationId or generate new one (same as registration number for consistency)
    let organizationId = insertOrg.organizationId;
    if (!organizationId) {
      organizationId = registrationNumber;
    }

    const [org] = await db
      .insert(organizations)
      .values({ ...insertOrg, organizationId, registrationNumber })
      .returning();
    return org;
  }

  async updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization> {
    const [org] = await db
      .update(organizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return org;
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return await db.select().from(organizations).orderBy(desc(organizations.createdAt));
  }

  async getOrganizationByMemberId(memberId: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.preaMemberId, memberId));
    return org || undefined;
  }

  async getOrganizationWithDetails(organizationId: string) {
    const [organization] = await db.select().from(organizations).where(eq(organizations.id, organizationId));
    if (!organization) return undefined;

    const orgDirectors = await db.select().from(directors)
      .where(and(eq(directors.organizationId, organizationId), eq(directors.isActive, true)))
      .orderBy(asc(directors.lastName));

    const orgMembers = await db.select().from(members)
      .where(eq(members.organizationId, organizationId))
      .orderBy(asc(members.lastName));

    const preaMember = organization.preaMemberId
      ? await db.select().from(members).where(eq(members.id, organization.preaMemberId)).then(rows => rows[0])
      : null;

    return {
      ...organization,
      directors: orgDirectors,
      members: orgMembers,
      preaMember
    };
  }

  // Director operations
  async getDirectorsByOrganization(organizationId: string): Promise<Director[]> {
    return await db.select().from(directors)
      .where(and(eq(directors.organizationId, organizationId), eq(directors.isActive, true)))
      .orderBy(asc(directors.lastName));
  }

  async createDirector(insertDirector: InsertDirector): Promise<Director> {
    const [director] = await db
      .insert(directors)
      .values(insertDirector)
      .returning();
    return director;
  }

  async updateDirector(id: string, updates: Partial<Director>): Promise<Director> {
    const [director] = await db
      .update(directors)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(directors.id, id))
      .returning();
    return director;
  }

  async deleteDirector(id: string): Promise<void> {
    await db
      .update(directors)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(directors.id, id));
  }

  async getMembersByOrganization(organizationId: string): Promise<Member[]> {
    return await db.select().from(members)
      .where(eq(members.organizationId, organizationId))
      .orderBy(asc(members.lastName));
  }

  async updateOrganizationPREA(organizationId: string, memberId: string): Promise<Organization> {
    const [org] = await db
      .update(organizations)
      .set({ preaMemberId: memberId, updatedAt: new Date() })
      .where(eq(organizations.id, organizationId))
      .returning();
    return org;
  }

  // Application operations
  async getMemberApplication(id: string): Promise<MemberApplication | undefined> {
    const [app] = await db.select().from(individualApplications).where(eq(individualApplications.id, id));
    return app || undefined;
  }

  async createMemberApplication(insertApp: InsertMemberApplication): Promise<MemberApplication> {
    // Generate proper application ID in MBR-APP-YYYY-XXXX format
    const { nextApplicationId } = await import('./services/namingSeries');
    const applicationNumber = await nextApplicationId('individual');
    
    const [app] = await db
      .insert(individualApplications)
      .values({ ...insertApp, applicationNumber })
      .returning();
    return app;
  }

  async updateMemberApplication(id: string, updates: Partial<MemberApplication>): Promise<MemberApplication> {
    const [app] = await db
      .update(individualApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(individualApplications.id, id))
      .returning();
    return app;
  }

  // Helper function to transform JSONB fields to flat structure for backward compatibility
  private transformApplication(app: any): any {
    const personal = typeof app.personal === 'string' ? JSON.parse(app.personal) : app.personal || {};
    const education = typeof app.education === 'string' ? JSON.parse(app.education) : app.education || {};

    return {
      ...app,
      firstName: personal.firstName || '',
      lastName: personal.lastName || '',
      phone: personal.phone || '',
      address: personal.address || '',
      nationalId: personal.nationalId || '',
      dateOfBirth: personal.dateOfBirth || null,
      educationLevel: education.level || '',
      institution: education.institution || '',
      yearCompleted: education.yearCompleted || null,
    };
  }

  async getPendingApplications(): Promise<MemberApplication[]> {
    const apps = await db
      .select()
      .from(individualApplications)
      .where(sql`status IN ('submitted', 'payment_pending', 'payment_received', 'under_review')`)
      .orderBy(desc(individualApplications.createdAt));

    return apps.map(app => this.transformApplication(app)) as MemberApplication[];
  }

  // Organization Application operations
  async getOrganizationApplication(id: string): Promise<OrganizationApplication | undefined> {
    const [app] = await db.select().from(organizationApplications).where(eq(organizationApplications.id, id));
    return app || undefined;
  }

  async createOrganizationApplication(insertApp: InsertOrganizationApplication): Promise<OrganizationApplication> {
    // Generate proper application ID in ORG-APP-YYYY-XXXX format
    const { nextApplicationId } = await import('./services/namingSeries');
    const applicationId = await nextApplicationId('organization');
    
    const [app] = await db
      .insert(organizationApplications)
      .values({ ...insertApp, applicationId })
      .returning();
    return app;
  }

  async updateOrganizationApplication(id: string, updates: Partial<OrganizationApplication>): Promise<OrganizationApplication> {
    const [app] = await db
      .update(organizationApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizationApplications.id, id))
      .returning();
    return app;
  }

  async getAllOrganizationApplications(): Promise<OrganizationApplication[]> {
    return await db.select().from(organizationApplications).orderBy(desc(organizationApplications.createdAt));
  }

  async getOrganizationApplicationsByStatus(status: string): Promise<OrganizationApplication[]> {
    return await db
      .select()
      .from(organizationApplications)
      .where(eq(organizationApplications.status, status as any))
      .orderBy(desc(organizationApplications.createdAt));
  }

  async assignOrganizationApplicationReviewer(id: string, reviewerId: string): Promise<OrganizationApplication> {
    const [application] = await db
      .update(organizationApplications)
      .set({ 
        createdByUserId: reviewerId, // Using this field for reviewer assignment temporarily
        updatedAt: new Date()
      })
      .where(eq(organizationApplications.id, id))
      .returning();
    return application;
  }

  // Case operations
  async getCase(id: string): Promise<Case | undefined> {
    const [caseItem] = await db.select().from(cases).where(eq(cases.id, id));
    return caseItem || undefined;
  }

  async getCaseByCaseNumber(number: string): Promise<Case | undefined> {
    const [caseItem] = await db.select().from(cases).where(eq(cases.caseNumber, number));
    return caseItem || undefined;
  }

  async createCase(insertCase: InsertCase): Promise<Case> {
    // Generate case number
    const caseNumber = `CASE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
    
    const [caseItem] = await db
      .insert(cases)
      .values({ ...insertCase, caseNumber })
      .returning();
    return caseItem;
  }

  async updateCase(id: string, updates: Partial<Case>): Promise<Case> {
    const [caseItem] = await db
      .update(cases)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(cases.id, id))
      .returning();
    return caseItem;
  }

  async getAllCases(): Promise<Case[]> {
    return await db.select().from(cases).orderBy(desc(cases.createdAt));
  }

  async getCasesByStatus(status: string): Promise<Case[]> {
    return await db
      .select()
      .from(cases)
      .where(eq(cases.status, status as any))
      .orderBy(desc(cases.createdAt));
  }

  async getCasesByPriority(priority: string): Promise<Case[]> {
    return await db
      .select()
      .from(cases)
      .where(eq(cases.priority, priority as any))
      .orderBy(desc(cases.createdAt));
  }

  async assignCase(caseId: string, assignedTo?: string): Promise<Case> {
    const [caseItem] = await db
      .update(cases)
      .set({ assignedTo, updatedAt: new Date() })
      .where(eq(cases.id, caseId))
      .returning();
    return caseItem;
  }

  async bulkAssignCases(caseIds: string[], assignedTo: string): Promise<Case[]> {
    const updatedCases = [];
    for (const caseId of caseIds) {
      const [caseItem] = await db
        .update(cases)
        .set({ assignedTo, updatedAt: new Date() })
        .where(eq(cases.id, caseId))
        .returning();
      updatedCases.push(caseItem);
    }
    return updatedCases;
  }

  async bulkResolveCases(caseIds: string[], resolution?: string): Promise<Case[]> {
    const updatedCases = [];
    for (const caseId of caseIds) {
      const [caseItem] = await db
        .update(cases)
        .set({ 
          status: 'resolved' as any, 
          resolution: resolution || 'Case resolved via bulk action',
          updatedAt: new Date() 
        })
        .where(eq(cases.id, caseId))
        .returning();
      updatedCases.push(caseItem);
    }
    return updatedCases;
  }

  async bulkCloseCases(caseIds: string[]): Promise<Case[]> {
    const updatedCases = [];
    for (const caseId of caseIds) {
      const [caseItem] = await db
        .update(cases)
        .set({ 
          status: 'closed' as any,
          updatedAt: new Date() 
        })
        .where(eq(cases.id, caseId))
        .returning();
      updatedCases.push(caseItem);
    }
    return updatedCases;
  }

  async getStaffUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(sql`role IN ('admin', 'case_manager', 'staff', 'super_admin')`)
      .orderBy(users.firstName);
  }

  // Event operations
  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const [event] = await db
      .update(events)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return event;
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.startDate));
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(and(
        eq(events.isActive, true),
        sql`${events.startDate} > NOW()`
      ))
      .orderBy(events.startDate);
  }

  // Payment operations
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(insertPayment)
      .returning();
    return payment;
  }

  async getPaymentsByMember(memberId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.memberId, memberId))
      .orderBy(desc(payments.createdAt));
  }

  async updatePaymentStatus(id: string, status: string): Promise<Payment> {
    const [payment] = await db
      .update(payments)
      .set({ status: status as any, paymentDate: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }

  // Document operations
  async createDocument(insertDoc: InsertDocument): Promise<Document> {
    const [doc] = await db
      .insert(documents)
      .values(insertDoc)
      .returning();
    return doc;
  }

  async getDocumentsByMember(memberId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.memberId, memberId))
      .orderBy(desc(documents.createdAt));
  }

  async getDocumentsByApplication(applicationId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.applicationId, applicationId))
      .orderBy(desc(documents.createdAt));
  }

  async verifyDocument(id: string, verifierId: string): Promise<Document> {
    const [doc] = await db
      .update(documents)
      .set({ 
        isVerified: true, 
        verifiedBy: verifierId, 
        verificationDate: new Date() 
      })
      .where(eq(documents.id, id))
      .returning();
    return doc;
  }

  // CPD Activities
  async getCpdActivities(): Promise<any[]> {
    // Placeholder implementation - return mock data for now
    return [
      {
        id: "cpd-1",
        activityTitle: "Real Estate Law Update Workshop",
        activityType: "workshop",
        pointsEarned: 5,
        completionDate: "2024-11-15",
        isVerified: true
      }
    ];
  }

  async createCpdActivity(data: any): Promise<any> {
    // Placeholder implementation
    return { id: `cpd-${Date.now()}`, ...data, isVerified: false };
  }

  // Member Renewals
  async getMemberRenewals(): Promise<any[]> {
    // Placeholder implementation - return mock data for now
    return [
      {
        id: "renewal-1",
        renewalYear: 2024,
        dueDate: "2024-12-31",
        status: "pending",
        remindersSent: 1,
        renewalFee: "150.00",
        member: {
          firstName: "John",
          lastName: "Doe",
          membershipNumber: "REA-2023-001234"
        }
      }
    ];
  }

  async getCurrentMemberRenewal(): Promise<any> {
    // Placeholder implementation
    return {
      id: "renewal-current",
      renewalYear: 2024,
      dueDate: "2024-12-31",
      status: "pending",
      renewalFee: "150.00"
    };
  }

  async sendRenewalReminder(renewalId: string): Promise<void> {
    // Placeholder implementation
    console.log(`Sending renewal reminder for ${renewalId}`);
  }

  async completeRenewal(renewalId: string): Promise<any> {
    // Placeholder implementation
    return { id: renewalId, status: "completed", renewalDate: new Date() };
  }

  // Member Activities (Audit Trail)
  async getMemberActivities(): Promise<any[]> {
    // Placeholder implementation
    return [];
  }

  async createMemberActivity(data: any): Promise<any> {
    // Placeholder implementation
    return { id: `activity-${Date.now()}`, ...data, timestamp: new Date() };
  }

  // Enhanced User Management Methods
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role as any));
  }

  async lockUser(id: string, lockedUntil: Date): Promise<User> {
    return await this.updateUser(id, { 
      status: "locked" as any, 
      lockedUntil,
      updatedAt: new Date()
    });
  }

  async unlockUser(id: string): Promise<User> {
    return await this.updateUser(id, { 
      status: "active" as any, 
      lockedUntil: null,
      loginAttempts: 0,
      updatedAt: new Date()
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return await this.updateUser(id, { 
      lastLoginAt: new Date(),
      loginAttempts: 0,
      updatedAt: new Date()
    });
  }

  async incrementLoginAttempts(id: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        loginAttempts: sql`${users.loginAttempts} + 1`,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async resetLoginAttempts(id: string): Promise<User> {
    return await this.updateUser(id, { loginAttempts: 0, updatedAt: new Date() });
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    if (!user) return false;
    return await comparePasswords(password, user.password);
  }

  async updateUserPassword(id: string, newPassword: string): Promise<User> {
    const hashedPassword = await hashPassword(newPassword);
    return await this.updateUser(id, { 
      password: hashedPassword,
      passwordChangedAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Clerk integration methods
  async getUserByClerkId(clerkId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    return user || undefined;
  }

  async createUserFromClerk(clerkData: { clerkId: string; email: string; firstName: string; lastName: string }): Promise<User> {
    const userData: InsertUser = {
      clerkId: clerkData.clerkId,
      email: clerkData.email,
      firstName: clerkData.firstName,
      lastName: clerkData.lastName,
      password: '',
      role: null,
      status: 'active',
      emailVerified: true
    };

    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  // Enhanced Payment Methods
  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getPaymentsByOrganization(organizationId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.organizationId, organizationId))
      .orderBy(desc(payments.createdAt));
  }

  async getPaymentsByApplication(applicationId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.applicationId, applicationId))
      .orderBy(desc(payments.createdAt));
  }

  async processRefund(id: string, refundAmount: number, reason: string): Promise<Payment> {
    const [payment] = await db
      .update(payments)
      .set({ 
        status: "refunded" as any,
        refundAmount: refundAmount.toString(),
        refundReason: reason,
        refundedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }

  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getRecentPayments(limit: number): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt)).limit(limit);
  }

  async getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(and(
        sql`${payments.createdAt} >= ${startDate}`,
        sql`${payments.createdAt} <= ${endDate}`
      ))
      .orderBy(desc(payments.createdAt));
  }

  async getPaymentsByMethod(method: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.paymentMethod, method as any))
      .orderBy(desc(payments.createdAt));
  }

  // Payment Installments
  async createPaymentInstallment(installment: InsertPaymentInstallment): Promise<PaymentInstallment> {
    const [newInstallment] = await db
      .insert(paymentInstallments)
      .values(installment)
      .returning();
    return newInstallment;
  }

  async getInstallmentsByPayment(paymentId: string): Promise<PaymentInstallment[]> {
    return await db
      .select()
      .from(paymentInstallments)
      .where(eq(paymentInstallments.paymentId, paymentId))
      .orderBy(paymentInstallments.installmentNumber);
  }

  async updateInstallmentStatus(id: string, status: string): Promise<PaymentInstallment> {
    const [installment] = await db
      .update(paymentInstallments)
      .set({ status: status as any, paidDate: new Date() })
      .where(eq(paymentInstallments.id, id))
      .returning();
    return installment;
  }

  // Enhanced Application Methods
  async getApplicationsByStatus(status: string): Promise<MemberApplication[]> {
    const apps = await db
      .select()
      .from(individualApplications)
      .where(eq(individualApplications.status, status as any))
      .orderBy(desc(individualApplications.createdAt));
    return apps.map(app => this.transformApplication(app)) as MemberApplication[];
  }

  async getApplicationsByStage(stage: string): Promise<MemberApplication[]> {
    const apps = await db
      .select()
      .from(individualApplications)
      .where(eq(individualApplications.currentStage, stage as any))
      .orderBy(desc(individualApplications.createdAt));
    return apps.map(app => this.transformApplication(app)) as MemberApplication[];
  }

  async getAllApplications(): Promise<MemberApplication[]> {
    const apps = await db.select().from(individualApplications).orderBy(desc(individualApplications.createdAt));
    return apps.map(app => this.transformApplication(app)) as MemberApplication[];
  }

  async assignApplicationReviewer(id: string, reviewerId: string): Promise<MemberApplication> {
    const [application] = await db
      .update(individualApplications)
      .set({ 
        reviewedBy: reviewerId,
        reviewStartedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(individualApplications.id, id))
      .returning();
    return application;
  }

  // Application Workflow Methods
  async createApplicationWorkflow(workflow: InsertApplicationWorkflow): Promise<ApplicationWorkflow> {
    const [newWorkflow] = await db
      .insert(applicationWorkflows)
      .values(workflow)
      .returning();
    return newWorkflow;
  }

  async getWorkflowsByApplication(applicationId: string): Promise<ApplicationWorkflow[]> {
    return await db
      .select()
      .from(applicationWorkflows)
      .where(eq(applicationWorkflows.applicationId, applicationId))
      .orderBy(applicationWorkflows.createdAt);
  }

  async updateWorkflowStage(id: string, updates: Partial<ApplicationWorkflow>): Promise<ApplicationWorkflow> {
    const [workflow] = await db
      .update(applicationWorkflows)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(applicationWorkflows.id, id))
      .returning();
    return workflow;
  }

  async getWorkflowsByStage(stage: string): Promise<ApplicationWorkflow[]> {
    return await db
      .select()
      .from(applicationWorkflows)
      .where(eq(applicationWorkflows.stage, stage as any))
      .orderBy(desc(applicationWorkflows.createdAt));
  }

  async getWorkflowsByAssignee(userId: string): Promise<ApplicationWorkflow[]> {
    return await db
      .select()
      .from(applicationWorkflows)
      .where(eq(applicationWorkflows.assignedTo, userId))
      .orderBy(desc(applicationWorkflows.createdAt));
  }

  // Session Management
  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const [newSession] = await db
      .insert(userSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getUserSessions(userId: string): Promise<UserSession[]> {
    return await db
      .select()
      .from(userSessions)
      .where(and(
        eq(userSessions.userId, userId),
        eq(userSessions.isActive, true)
      ))
      .orderBy(desc(userSessions.lastActivity));
  }

  async updateSessionActivity(sessionId: string): Promise<UserSession> {
    const [session] = await db
      .update(userSessions)
      .set({ lastActivity: new Date() })
      .where(eq(userSessions.id, sessionId))
      .returning();
    return session;
  }

  async deactivateSession(sessionId: string): Promise<UserSession> {
    const [session] = await db
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.id, sessionId))
      .returning();
    return session;
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await db
      .update(userSessions)
      .set({ isActive: false })
      .where(sql`${userSessions.expiresAt} < NOW()`)
      .returning({ id: userSessions.id });
    return result.length;
  }

  // User Permissions
  async createUserPermission(permission: InsertUserPermission): Promise<UserPermission> {
    const [newPermission] = await db
      .insert(userPermissions)
      .values(permission)
      .returning();
    return newPermission;
  }

  async getUserPermissions(userId: string): Promise<UserPermission[]> {
    return await db
      .select()
      .from(userPermissions)
      .where(and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.isActive, true)
      ));
  }

  async checkUserPermission(userId: string, permission: string, resource?: string): Promise<boolean> {
    const permissions = await db
      .select()
      .from(userPermissions)
      .where(and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.permission, permission),
        eq(userPermissions.isActive, true),
        resource ? eq(userPermissions.resource, resource) : sql`1=1`
      ));
    return permissions.length > 0;
  }

  async revokeUserPermission(id: string): Promise<UserPermission> {
    const [permission] = await db
      .update(userPermissions)
      .set({ isActive: false })
      .where(eq(userPermissions.id, id))
      .returning();
    return permission;
  }

  // Notifications
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getMemberNotifications(memberId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.memberId, memberId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationSent(id: string): Promise<Notification> {
    const [notification] = await db
      .update(notifications)
      .set({ status: "sent" as any, sentAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async markNotificationDelivered(id: string): Promise<Notification> {
    const [notification] = await db
      .update(notifications)
      .set({ status: "delivered" as any, deliveredAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async markNotificationOpened(id: string): Promise<Notification> {
    const [notification] = await db
      .update(notifications)
      .set({ openedAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async getPendingNotifications(): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.status, "pending" as any))
      .orderBy(notifications.scheduledFor || notifications.createdAt);
  }

  // Audit Logging
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db
      .insert(auditLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getAuditLogs(filters?: { userId?: string; resource?: string; action?: string }): Promise<AuditLog[]> {
    const conditions = [];
    
    if (filters?.userId) {
      conditions.push(eq(auditLogs.userId, filters.userId));
    }
    if (filters?.resource) {
      conditions.push(eq(auditLogs.resource, filters.resource));
    }
    if (filters?.action) {
      conditions.push(eq(auditLogs.action, filters.action));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(auditLogs)
        .where(and(...conditions))
        .orderBy(desc(auditLogs.timestamp));
    }
    
    return await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.timestamp));
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<{
    totalMembers: number;
    activeOrganizations: number;
    totalOrganizations: number;
    pendingApplications: number;
    openCases: number;
    totalRevenue: number;
    revenueThisMonth?: number;
    renewalsPending?: number;
    totalUsers: number;
    upcomingEvents: number;
  }> {
    // Get total members count
    const totalMembersResult = await db.select({ count: sql<number>`count(*)` }).from(members);
    const totalMembers = totalMembersResult[0]?.count || 0;

    // Get total organizations count
    const totalOrganizationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(organizations);
    const totalOrganizations = totalOrganizationsResult[0]?.count || 0;

    // Get active organizations count
    const activeOrganizationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(organizations)
      .where(eq(organizations.status, "active"));
    const activeOrganizations = activeOrganizationsResult[0]?.count || 0;

    // Get pending applications count (both individual and organization applications)
    // Status values: draft, submitted, payment_pending, payment_received, under_review, approved, rejected
    const pendingIndividualApplicationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(individualApplications)
      .where(sql`status IN ('submitted', 'payment_pending', 'payment_received', 'under_review')`);
    const pendingIndividualApplications = pendingIndividualApplicationsResult[0]?.count || 0;

    const pendingOrganizationApplicationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(organizationApplications)
      .where(sql`status IN ('submitted', 'payment_pending', 'payment_received', 'under_review')`);
    const pendingOrganizationApplications = pendingOrganizationApplicationsResult[0]?.count || 0;

    const pendingApplications = pendingIndividualApplications + pendingOrganizationApplications;

    // Get open cases count
    const openCasesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(cases)
      .where(eq(cases.status, "open"));
    const openCases = openCasesResult[0]?.count || 0;

    // Get total users count
    const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get upcoming events count (events with start date in the future)
    const upcomingEventsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(sql`${events.startDate} >= NOW()`);
    const upcomingEvents = upcomingEventsResult[0]?.count || 0;

    // Get revenue this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenueResult = await db
      .select({ sum: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` })
      .from(payments)
      .where(and(
        eq(payments.status, "completed"),
        sql`created_at >= ${startOfMonth}`
      ));
    const revenueThisMonth = Number(revenueResult[0]?.sum || 0);

    // Get total revenue (all time)
    const totalRevenueResult = await db
      .select({ sum: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` })
      .from(payments)
      .where(eq(payments.status, "completed"));
    const totalRevenue = Number(totalRevenueResult[0]?.sum || 0);

    // Get pending renewals count (if table exists)
    // Skip this for now as member_renewals table doesn't exist in production
    const renewalsPending = 0;

    return {
      totalMembers,
      activeOrganizations,
      totalOrganizations,
      pendingApplications,
      openCases,
      totalRevenue,
      revenueThisMonth,
      renewalsPending,
      totalUsers,
      upcomingEvents,
    };
  }

  // Finance Statistics  
  async getFinanceStats(filters?: { startDate?: Date; endDate?: Date }): Promise<{
    totalRevenue: number;
    monthlyRevenue: number;
    pendingPayments: number;
    completedPayments: number;
    membershipFees: number;
    applicationFees: number;
    eventFees: number;
    renewalFees: number;
  }> {
    const conditions = [eq(payments.status, "completed")];
    
    if (filters?.startDate) {
      conditions.push(sql`created_at >= ${filters.startDate}`);
    }
    if (filters?.endDate) {
      conditions.push(sql`created_at <= ${filters.endDate}`);
    }

    // Total revenue
    const totalRevenueResult = await db
      .select({ sum: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` })
      .from(payments)
      .where(and(...conditions));
    const totalRevenue = Number(totalRevenueResult[0]?.sum || 0);

    // Monthly revenue (current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyRevenueResult = await db
      .select({ sum: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` })
      .from(payments)
      .where(and(
        eq(payments.status, "completed"),
        sql`created_at >= ${startOfMonth}`
      ));
    const monthlyRevenue = Number(monthlyRevenueResult[0]?.sum || 0);

    // Pending payments count
    const pendingPaymentsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(payments)
      .where(eq(payments.status, "pending"));
    const pendingPayments = pendingPaymentsResult[0]?.count || 0;

    // Completed payments count
    const completedPaymentsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(payments)
      .where(eq(payments.status, "completed"));
    const completedPayments = completedPaymentsResult[0]?.count || 0;

    // Revenue by type (for completed payments)
    const membershipFeesResult = await db
      .select({ sum: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` })
      .from(payments)
      .where(and(
        eq(payments.status, "completed"),
        sql`purpose LIKE '%membership%' OR purpose LIKE '%renewal%'`
      ));
    const membershipFees = Number(membershipFeesResult[0]?.sum || 0);

    const applicationFeesResult = await db
      .select({ sum: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` })
      .from(payments)
      .where(and(
        eq(payments.status, "completed"),
        sql`purpose LIKE '%application%'`
      ));
    const applicationFees = Number(applicationFeesResult[0]?.sum || 0);

    const eventFeesResult = await db
      .select({ sum: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` })
      .from(payments)
      .where(and(
        eq(payments.status, "completed"),
        sql`purpose LIKE '%event%'`
      ));
    const eventFees = Number(eventFeesResult[0]?.sum || 0);

    return {
      totalRevenue,
      monthlyRevenue,
      pendingPayments,
      completedPayments,
      membershipFees,
      applicationFees,
      eventFees,
      renewalFees: membershipFees, // For now, same as membership fees
    };
  }

  // Enhanced Payment Listing
  async listPayments(filters?: {
    status?: string;
    type?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ payments: Payment[]; total: number }> {
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(payments.status, filters.status as any));
    }
    if (filters?.search) {
      conditions.push(sql`(purpose ILIKE ${`%${filters.search}%`} OR payment_number ILIKE ${`%${filters.search}%`})`);
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(payments)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    const total = totalResult[0]?.count || 0;

    // Get paginated results with proper query building
    const baseQuery = db
      .select()
      .from(payments)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Apply sorting
    const sortedQuery = filters?.sortBy === 'amount'
      ? baseQuery.orderBy(filters.sortOrder === 'asc' ? asc(sql`CAST(amount AS DECIMAL)`) : desc(sql`CAST(amount AS DECIMAL)`))
      : baseQuery.orderBy(filters?.sortOrder === 'asc' ? asc(payments.createdAt) : desc(payments.createdAt));

    // Apply pagination
    const paginatedQuery = filters?.limit
      ? sortedQuery.limit(filters.limit)
      : sortedQuery;

    const finalQuery = filters?.offset
      ? paginatedQuery.offset(filters.offset)
      : paginatedQuery;

    const paymentsList = await finalQuery;

    return { payments: paymentsList, total };
  }

  async listRecentPayments(limit = 10): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt))
      .limit(limit);
  }

  // Renewals Management
  async listRenewals(filters?: {
    year?: number;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ renewals: MemberRenewal[]; total: number }> {
    const conditions = [];
    
    if (filters?.year) {
      conditions.push(eq(memberRenewals.renewalYear, filters.year));
    }
    if (filters?.status) {
      conditions.push(eq(memberRenewals.status, filters.status as any));
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(memberRenewals)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    const total = totalResult[0]?.count || 0;

    // Get paginated results with member information
    const baseQuery = db
      .select({
        id: memberRenewals.id,
        memberId: memberRenewals.memberId,
        renewalYear: memberRenewals.renewalYear,
        status: memberRenewals.status,
        dueDate: memberRenewals.dueDate,
        remindersSent: memberRenewals.remindersSent,
        lastReminderDate: memberRenewals.lastReminderDate,
        renewalDate: memberRenewals.renewalDate,
        renewalFee: memberRenewals.renewalFee,
        paymentId: memberRenewals.paymentId,
        createdAt: memberRenewals.createdAt,
        updatedAt: memberRenewals.updatedAt,
        member: {
          id: members.id,
          firstName: members.firstName,
          lastName: members.lastName,
          membershipNumber: members.membershipNumber,
          email: members.email,
          memberType: members.memberType,
        }
      })
      .from(memberRenewals)
      .leftJoin(members, eq(memberRenewals.memberId, members.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(memberRenewals.dueDate));

    // Apply pagination
    const paginatedQuery = filters?.limit
      ? baseQuery.limit(filters.limit)
      : baseQuery;

    const finalQuery = filters?.offset
      ? paginatedQuery.offset(filters.offset)
      : paginatedQuery;

    const renewalsList = await finalQuery;

    return { renewals: renewalsList as any, total };
  }

  async updateRenewal(id: string, updates: Partial<MemberRenewal>): Promise<MemberRenewal> {
    const [renewal] = await db
      .update(memberRenewals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(memberRenewals.id, id))
      .returning();
    return renewal;
  }

  async incrementRenewalReminder(id: string): Promise<MemberRenewal> {
    const [renewal] = await db
      .update(memberRenewals)
      .set({ 
        remindersSent: sql`reminders_sent + 1`,
        lastReminderDate: new Date(),
        updatedAt: new Date()
      })
      .where(eq(memberRenewals.id, id))
      .returning();
    return renewal;
  }

  async generateRenewals(year: number, defaultFee = 50): Promise<{ created: number; skipped: number }> {
    // Get all active members who don't have a renewal for this year
    const activeMembers = await db
      .select()
      .from(members)
      .where(eq(members.membershipStatus, "active"));

    const existingRenewals = await db
      .select({ memberId: memberRenewals.memberId })
      .from(memberRenewals)
      .where(eq(memberRenewals.renewalYear, year));

    const existingMemberIds = new Set(existingRenewals.map(r => r.memberId));
    
    const membersNeedingRenewal = activeMembers.filter(m => !existingMemberIds.has(m.id));

    let created = 0;
    let skipped = 0;

    for (const member of membersNeedingRenewal) {
      try {
        // Calculate due date (e.g., March 31st of the year)
        const dueDate = new Date(year, 2, 31); // March 31st

        await db.insert(memberRenewals).values({
          memberId: member.id,
          renewalYear: year,
          dueDate,
          status: "pending",
          renewalFee: defaultFee.toString(),
          remindersSent: 0,
        });
        created++;
      } catch (error) {
        console.error(`Failed to create renewal for member ${member.id}:`, error);
        skipped++;
      }
    }

    return { created, skipped };
  }

  // System Settings
  async getSettings(): Promise<SystemSettings[]> {
    return await db
      .select()
      .from(systemSettings)
      .orderBy(systemSettings.key);
  }

  async getSetting(key: string): Promise<SystemSettings | undefined> {
    const [setting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, key));
    return setting || undefined;
  }

  async updateSettings(settings: { key: string; value: string; description?: string }[]): Promise<SystemSettings[]> {
    const updatedSettings = [];
    
    for (const setting of settings) {
      const [updated] = await db
        .insert(systemSettings)
        .values({
          key: setting.key,
          value: setting.value,
          description: setting.description,
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: systemSettings.key,
          set: {
            value: setting.value,
            description: setting.description,
            updatedAt: new Date()
          }
        })
        .returning();
      updatedSettings.push(updated);
    }
    
    return updatedSettings;
  }

  async updateSetting(key: string, value: string, description?: string, updatedBy?: string): Promise<SystemSettings> {
    const [setting] = await db
      .insert(systemSettings)
      .values({
        key,
        value,
        description,
        updatedBy,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: {
          value,
          description,
          updatedBy,
          updatedAt: new Date()
        }
      })
      .returning();
    return setting;
  }

  /**
   * Create uploaded document record
   */
  async createUploadedDocument(doc: InsertUploadedDocument): Promise<UploadedDocument> {
    const [document] = await db.insert(uploadedDocuments)
      .values(doc)
      .returning();
    return document;
  }
}

export const storage = new DatabaseStorage();

// Initialize demo data
async function initializeDemoData() {
  try {
    console.log("Initializing demo data...");

    // Force demo data creation for now
    console.log("Force creating demo data...");

    // Create demo users with various roles
    const demoUsers = [
      {
        email: "admin@eacz.com",
        password: "admin123",
        firstName: "System",
        lastName: "Administrator",
        role: "super_admin" as const,
        status: "active" as const,
        department: "IT Administration",
        jobTitle: "System Administrator",
      },
      {
        email: "member.manager@eacz.com", 
        password: "manager123",
        firstName: "Sarah",
        lastName: "Thompson",
        role: "member_manager" as const,
        status: "active" as const,
        department: "Membership Services",
        jobTitle: "Senior Member Manager",
      },
      {
        email: "case.manager@eacz.com",
        password: "case123", 
        firstName: "David",
        lastName: "Wilson",
        role: "case_manager" as const,
        status: "active" as const,
        department: "Legal Affairs",
        jobTitle: "Case Manager",
      },
      {
        email: "staff@eacz.com",
        password: "staff123",
        firstName: "Lisa",
        lastName: "Martinez",
        role: "staff" as const,
        status: "active" as const,
        department: "Applications Review",
        jobTitle: "Senior Staff Member",
      },
      {
        email: "accountant@eacz.com",
        password: "accounts123",
        firstName: "Michael",
        lastName: "Brown",
        role: "accountant" as const,
        status: "active" as const,
        department: "Finance",
        jobTitle: "Chief Accountant",
      }
    ];

    const createdUsers: User[] = [];
    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        console.log(`User ${userData.email} already exists, updating password to match demo data`);
        // Update existing user's password to match demo data
        const hashedPassword = await hashPassword(userData.password);
        await db.update(users)
          .set({ 
            password: hashedPassword,
            passwordChangedAt: new Date()
          })
          .where(eq(users.id, existingUser.id));
        
        // Get the updated user
        const updatedUser = await storage.getUser(existingUser.id);
        createdUsers.push(updatedUser!);
        continue;
      }
      
      // Hash the password before creating the user
      const userWithHashedPassword = {
        ...userData,
        password: await hashPassword(userData.password)
      };
      const user = await storage.createUser(userWithHashedPassword);
      createdUsers.push(user);
    }

    // Create demo organizations
    const demoOrganizations = [
      {
        name: "Premier Estate Agents",
        businessType: "real_estate_agency" as const,
        registrationNumber: "REF-2023-001",
        email: "info@premierestate.com",
        phone: "+263 4 123 4567",
        physicalAddress: "123 Union Avenue, Harare",
        status: "active" as const,
      },
      {
        name: "Harare Property Management",
        businessType: "property_management_firm" as const,
        registrationNumber: "PMF-2023-002",
        email: "contact@harareprop.com",
        phone: "+263 4 234 5678",
        physicalAddress: "456 Second Street, Harare",
        status: "active" as const,
      },
      {
        name: "Zimbabwe Brokerage Services",
        businessType: "brokerage_firm" as const,
        registrationNumber: "BRK-2023-003",
        email: "admin@zim-brokerage.com",
        phone: "+263 4 345 6789",
        physicalAddress: "789 Third Avenue, Bulawayo",
        status: "pending" as const,
      }
    ];

    const createdOrgs: Organization[] = [];
    for (const orgData of demoOrganizations) {
      // Check if organization already exists by registration number
      const existingOrg = await storage.getOrganizationByRegistrationNumber(orgData.registrationNumber);
      if (existingOrg) {
        console.log(`Organization ${orgData.registrationNumber} already exists, skipping creation`);
        createdOrgs.push(existingOrg);
        continue;
      }
      
      const org = await storage.createOrganization(orgData);
      createdOrgs.push(org);
    }

    // Create demo members
    const demoMembers = [
      {
        firstName: "John",
        lastName: "Chikwanha",
        email: "john.chikwanha@gmail.com",
        phone: "+263 77 123 4567",
        membershipNumber: "REA-2023-001234",
        memberType: "principal_real_estate_agent" as const,
        membershipStatus: "active" as const,
        dateOfBirth: new Date("1980-05-15"),
        nationalId: "08-123456-A-15",
        organizationId: createdOrgs[0].id,
        joinedDate: new Date("2023-01-20"),
        expiryDate: new Date("2024-01-20"),
      },
      {
        firstName: "Grace",
        lastName: "Mukamuri",
        email: "grace.mukamuri@yahoo.com",
        phone: "+263 77 234 5678",
        membershipNumber: "REA-2023-002345",
        memberType: "real_estate_agent" as const,
        membershipStatus: "active" as const,
        dateOfBirth: new Date("1985-08-22"),
        nationalId: "08-234567-B-22",
        organizationId: createdOrgs[0].id,
        joinedDate: new Date("2023-02-15"),
        expiryDate: new Date("2024-02-15"),
      },
      {
        firstName: "Tendai",
        lastName: "Moyo",
        email: "tendai.moyo@outlook.com",
        phone: "+263 77 345 6789",
        membershipNumber: "REA-2023-003456",
        memberType: "property_manager" as const,
        membershipStatus: "active" as const,
        dateOfBirth: new Date("1982-03-10"),
        nationalId: "08-345678-C-10",
        organizationId: createdOrgs[1].id,
        joinedDate: new Date("2023-03-25"),
        expiryDate: new Date("2024-03-25"),
      },
      {
        firstName: "Chipo",
        lastName: "Mutumwa",
        email: "chipo.mutumwa@gmail.com",
        phone: "+263 77 456 7890",
        membershipNumber: "REA-2023-004567",
        memberType: "real_estate_negotiator" as const,
        membershipStatus: "pending" as const,
        dateOfBirth: new Date("1990-11-05"),
        nationalId: "08-456789-D-05",
        organizationId: createdOrgs[2].id,
        joinedDate: new Date("2023-04-10"),
        expiryDate: new Date("2024-04-10"),
      }
    ];

    const createdMembers: Member[] = [];
    for (const memberData of demoMembers) {
      // Check if member already exists by email
      const existingMember = await storage.getMemberByEmail(memberData.email);
      if (existingMember) {
        console.log(`Member ${memberData.email} already exists, skipping creation`);
        createdMembers.push(existingMember);
        continue;
      }
      
      const member = await storage.createMember(memberData);
      createdMembers.push(member);
    }

    // Create demo cases
    const demoCases = [
      {
        caseNumber: "CASE-2023-001",
        title: "Unauthorized Property Sale",
        description: "Complaint regarding unauthorized sale of property by agent without proper documentation.",
        type: "complaint" as const,
        priority: "high" as const,
        status: "under_investigation" as const,
        submittedBy: "Anonymous Client",
        submittedByEmail: "client@example.com",
        memberId: createdMembers[0].id,
        assignedTo: createdUsers[2].id, // Case manager
      },
      {
        caseNumber: "CASE-2023-002",
        title: "Property Management Inquiry",
        description: "General inquiry about property management regulations and requirements.",
        type: "inquiry" as const,
        priority: "medium" as const,
        status: "open" as const,
        submittedBy: "Mary Ndoro",
        submittedByEmail: "mary.ndoro@email.com",
        assignedTo: createdUsers[2].id, // Case manager
      },
      {
        caseNumber: "CASE-2023-003",
        title: "Commission Dispute",
        description: "Dispute between agent and client regarding commission payments.",
        type: "dispute" as const,
        priority: "high" as const,
        status: "resolved" as const,
        memberId: createdMembers[1].id,
        assignedTo: createdUsers[2].id, // Case manager
        resolution: "Matter resolved through mediation. Commission payment plan agreed upon.",
      },
      {
        caseNumber: "CASE-2023-004",
        title: "Ethical Violation Report",
        description: "Report of potential ethical violations in property transactions.",
        type: "violation" as const,
        priority: "critical" as const,
        status: "open" as const,
        submittedBy: "Concerned Citizen",
        submittedByEmail: "concerned@example.com",
        memberId: createdMembers[2].id,
        assignedTo: createdUsers[2].id, // Case manager
      }
    ];

    for (const caseData of demoCases) {
      // Check if case already exists by case number
      const existingCase = await storage.getCaseByCaseNumber(caseData.caseNumber);
      if (existingCase) {
        console.log(`Case ${caseData.caseNumber} already exists, skipping creation`);
        continue;
      }
      
      await storage.createCase(caseData);
    }

    // Create demo events
    const demoEvents = [
      {
        title: "Real Estate Law Update Workshop",
        description: "Annual workshop covering updates in real estate law and regulations for 2024.",
        type: "workshop" as const,
        startDate: new Date("2024-02-15T09:00:00Z"),
        endDate: new Date("2024-02-15T17:00:00Z"),
        location: "Harare Conference Center",
        address: "123 Conference Road, Harare",
        instructor: "Advocate Susan Chigara",
        capacity: 100,
        price: "50.00",
        cpdPoints: 8,
        isActive: true,
      },
      {
        title: "Property Valuation Seminar",
        description: "Comprehensive seminar on modern property valuation techniques and market trends.",
        type: "seminar" as const,
        startDate: new Date("2024-03-20T08:30:00Z"),
        endDate: new Date("2024-03-20T16:30:00Z"),
        location: "Bulawayo Business Center",
        address: "456 Business Avenue, Bulawayo",
        instructor: "Dr. Patrick Mutomba",
        capacity: 80,
        price: "75.00",
        cpdPoints: 10,
        isActive: true,
      },
      {
        title: "Digital Marketing for Real Estate",
        description: "Training session on using digital marketing tools to promote real estate services.",
        type: "training" as const,
        startDate: new Date("2024-04-10T10:00:00Z"),
        endDate: new Date("2024-04-11T16:00:00Z"),
        location: "Mutare Training Institute",
        address: "789 Training Street, Mutare",
        instructor: "Ms. Jennifer Katsande",
        capacity: 50,
        price: "120.00",
        cpdPoints: 15,
        isActive: true,
      },
      {
        title: "Annual Real Estate Conference",
        description: "The premier annual conference for real estate professionals in Zimbabwe.",
        type: "conference" as const,
        startDate: new Date("2024-06-15T08:00:00Z"),
        endDate: new Date("2024-06-17T18:00:00Z"),
        location: "Victoria Falls Conference Resort",
        address: "Victoria Falls, Zimbabwe",
        instructor: "Multiple Industry Experts",
        capacity: 300,
        price: "250.00",
        cpdPoints: 25,
        isActive: true,
      }
    ];

    const createdEvents: Event[] = [];
    for (const eventData of demoEvents) {
      // Check if event already exists by title
      const existingEvents = await storage.getAllEvents();
      const existingEvent = existingEvents.find(e => e.title === eventData.title);
      if (existingEvent) {
        console.log(`Event "${eventData.title}" already exists, skipping creation`);
        createdEvents.push(existingEvent);
        continue;
      }
      
      const event = await storage.createEvent(eventData);
      createdEvents.push(event);
    }

    // Create demo payments
    const demoPayments = [
      {
        paymentNumber: "PAY-2023-001",
        memberId: createdMembers[0].id,
        amount: "500.00",
        currency: "USD",
        paymentMethod: "paynow_ecocash" as const,
        status: "completed" as const,
        purpose: "membership",
        description: "Annual membership fee payment",
        referenceNumber: "ECO123456789",
        paymentDate: new Date("2023-01-25"),
        processedBy: createdUsers[4].id, // Accountant
      },
      {
        paymentNumber: "PAY-2023-002",
        memberId: createdMembers[1].id,
        amount: "50.00",
        currency: "USD",
        paymentMethod: "stripe_card" as const,
        status: "completed" as const,
        purpose: "event",
        description: "Real Estate Law Update Workshop registration",
        eventId: createdEvents[0].id,
        transactionId: "pi_stripe_12345",
        paymentDate: new Date("2023-02-10"),
        processedBy: createdUsers[4].id, // Accountant
      },
      {
        paymentNumber: "PAY-2023-003",
        organizationId: createdOrgs[0].id,
        amount: "5000.00",
        currency: "USD",
        paymentMethod: "bank_transfer" as const,
        status: "completed" as const,
        purpose: "membership",
        description: "Organization annual membership fee",
        referenceNumber: "BT987654321",
        paymentDate: new Date("2023-01-30"),
        processedBy: createdUsers[4].id, // Accountant
      },
      {
        paymentNumber: "PAY-2023-004",
        memberId: createdMembers[2].id,
        amount: "75.00",
        currency: "USD",
        paymentMethod: "cash" as const,
        status: "pending" as const,
        purpose: "event",
        description: "Property Valuation Seminar registration",
        eventId: createdEvents[1].id,
        dueDate: new Date("2024-03-15"),
      }
    ];

    for (const paymentData of demoPayments) {
      // Check if payment already exists by payment number
      const existingPayments = await storage.getAllPayments();
      const existingPayment = existingPayments.find(p => p.paymentNumber === paymentData.paymentNumber);
      if (existingPayment) {
        console.log(`Payment ${paymentData.paymentNumber} already exists, skipping creation`);
        continue;
      }
      
      await storage.createPayment(paymentData);
    }

    // Create demo applications
    const demoApplications = [
      {
        applicationId: "APP-2023-001",
        applicantEmail: "robert.banda@gmail.com",
        memberType: "real_estate_agent" as const,
        status: "submitted" as const,
        applicationFee: "100.00",
        paymentStatus: "completed" as const,
        personal: {
          firstName: "Robert",
          lastName: "Banda",
          email: "robert.banda@gmail.com",
          phone: "+263 77 567 8901",
          dateOfBirth: new Date("1988-07-12").toISOString(),
          nationalId: "08-567890-E-12",
        },
        education: {
          educationLevel: "bachelors",
          workExperience: 3,
          currentEmployer: "Independent Agent",
          jobTitle: "Real Estate Agent",
        },
        reviewedBy: createdUsers[3].id, // Staff member
      },
      {
        applicationId: "APP-2023-002",
        applicantEmail: "patricia.matemba@yahoo.com",
        memberType: "property_manager" as const,
        status: "draft" as const,
        applicationFee: "100.00",
        paymentStatus: "pending" as const,
        personal: {
          firstName: "Patricia",
          lastName: "Matemba",
          email: "patricia.matemba@yahoo.com",
          phone: "+263 77 678 9012",
          dateOfBirth: new Date("1992-04-18").toISOString(),
          nationalId: "08-678901-F-18",
        },
        education: {
          educationLevel: "hnd",
          workExperience: 2,
          currentEmployer: "City Properties Ltd",
          jobTitle: "Junior Property Manager",
        },
        reviewedBy: createdUsers[3].id, // Staff member
      }
    ];

    for (const appData of demoApplications) {
      // Check if application already exists by application ID
      const existingApplications = await storage.getAllApplications();
      const existingApp = existingApplications.find(app => app.applicationId === appData.applicationId);
      if (existingApp) {
        console.log(`Application ${appData.applicationId} already exists, skipping creation`);
        continue;
      }

      await storage.createMemberApplication(appData);
    }

    console.log("Demo data initialization completed successfully!");
    console.log(`Created ${createdUsers.length} users, ${createdOrgs.length} organizations, ${createdMembers.length} members`);

  } catch (error) {
    console.error("Error initializing demo data:", error);
  }
}

// Force demo data initialization after a delay to ensure database is ready
setTimeout(() => {
  initializeDemoData().catch(console.error);
}, 2000);
