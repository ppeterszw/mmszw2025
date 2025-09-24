import type { AchievementBadge, MemberAchievementBadge, Member, Document, Payment, CpdActivity } from "@shared/schema";

// Default achievement badges configuration
export const defaultAchievementBadges: Omit<AchievementBadge, "id" | "createdAt">[] = [
  // Profile Completion Badges
  {
    name: "Getting Started",
    description: "Complete your basic profile information",
    type: "profile_basic",
    difficulty: "bronze",
    icon: "User",
    color: "#CD7F32",
    criteria: JSON.stringify({
      requirements: ["firstName", "lastName", "email"],
      threshold: 3
    }),
    points: 10,
    isActive: true
  },
  {
    name: "Profile Master",
    description: "Complete your entire profile with all details",
    type: "profile_complete",
    difficulty: "gold",
    icon: "Crown",
    color: "#FFD700",
    criteria: JSON.stringify({
      requirements: ["basicInfo", "contactDetails", "dateOfBirth", "organization", "memberType"],
      threshold: 5
    }),
    points: 50,
    isActive: true
  },
  
  // Document Verification Badges
  {
    name: "Document Collector",
    description: "Upload your first professional document",
    type: "documents_verified",
    difficulty: "bronze",
    icon: "FileText",
    color: "#CD7F32",
    criteria: JSON.stringify({
      requirements: ["documentCount"],
      threshold: 1
    }),
    points: 15,
    isActive: true
  },
  {
    name: "Verified Professional",
    description: "Complete all required document uploads",
    type: "documents_verified",
    difficulty: "silver",
    icon: "Shield",
    color: "#C0C0C0",
    criteria: JSON.stringify({
      requirements: ["documentCount"],
      threshold: 3
    }),
    points: 30,
    isActive: true
  },
  
  // CPD Achievement Badges
  {
    name: "Learning Enthusiast",
    description: "Earn your first CPD points",
    type: "cpd_achiever",
    difficulty: "bronze",
    icon: "GraduationCap",
    color: "#CD7F32",
    criteria: JSON.stringify({
      requirements: ["cpdPoints"],
      threshold: 5
    }),
    points: 20,
    isActive: true
  },
  {
    name: "CPD Champion",
    description: "Accumulate 25 CPD points",
    type: "cpd_achiever",
    difficulty: "silver",
    icon: "Award",
    color: "#C0C0C0",
    criteria: JSON.stringify({
      requirements: ["cpdPoints"],
      threshold: 25
    }),
    points: 40,
    isActive: true
  },
  {
    name: "Master Learner",
    description: "Reach 50 CPD points",
    type: "cpd_achiever",
    difficulty: "gold",
    icon: "Trophy",
    color: "#FFD700",
    criteria: JSON.stringify({
      requirements: ["cpdPoints"],
      threshold: 50
    }),
    points: 75,
    isActive: true
  },
  
  // Event Participation Badges
  {
    name: "Event Attendee",
    description: "Attend your first EACZ event",
    type: "event_participant",
    difficulty: "bronze",
    icon: "Calendar",
    color: "#CD7F32",
    criteria: JSON.stringify({
      requirements: ["eventAttendance"],
      threshold: 1
    }),
    points: 15,
    isActive: true
  },
  {
    name: "Community Connector",
    description: "Attend 5 EACZ events",
    type: "event_participant",
    difficulty: "silver",
    icon: "Star",
    color: "#C0C0C0",
    criteria: JSON.stringify({
      requirements: ["eventAttendance"],
      threshold: 5
    }),
    points: 35,
    isActive: true
  },
  
  // Payment Completion Badges
  {
    name: "Financial Contributor",
    description: "Complete your first payment",
    type: "payment_complete",
    difficulty: "bronze",
    icon: "CheckCircle",
    color: "#CD7F32",
    criteria: JSON.stringify({
      requirements: ["paymentCompleted"],
      threshold: 1
    }),
    points: 25,
    isActive: true
  },
  {
    name: "Membership Supporter",
    description: "Complete membership fee payment",
    type: "payment_complete",
    difficulty: "silver",
    icon: "Medal",
    color: "#C0C0C0",
    criteria: JSON.stringify({
      requirements: ["membershipPayment"],
      threshold: 1
    }),
    points: 40,
    isActive: true
  },
  
  // Special Recognition Badges
  {
    name: "Early Adopter",
    description: "Among the first members to join the digital platform",
    type: "early_bird",
    difficulty: "platinum",
    icon: "Sparkles",
    color: "#E5E4E2",
    criteria: JSON.stringify({
      requirements: ["registrationDate"],
      threshold: "2024-06-01"
    }),
    points: 100,
    isActive: true
  },
  {
    name: "Organization Member",
    description: "Successfully join a real estate organization",
    type: "organization_member",
    difficulty: "bronze",
    icon: "Building2",
    color: "#CD7F32",
    criteria: JSON.stringify({
      requirements: ["organizationMembership"],
      threshold: 1
    }),
    points: 20,
    isActive: true
  }
];

export interface BadgeEligibilityResult {
  eligible: boolean;
  progress: number;
  nextThreshold?: number;
  requirements: string[];
}

export class BadgeService {
  /**
   * Check if a member is eligible for a specific badge
   */
  static checkBadgeEligibility(
    badge: AchievementBadge,
    member: Member,
    documents: Document[] = [],
    payments: Payment[] = [],
    cpdActivities: CpdActivity[] = [],
    eventAttendance: number = 0
  ): BadgeEligibilityResult {
    const criteria = JSON.parse(badge.criteria);
    const requirements = criteria.requirements;
    const threshold = criteria.threshold;
    
    let currentValue = 0;
    let maxValue = threshold;

    switch (badge.type) {
      case "profile_basic":
        currentValue = [member.firstName, member.lastName, member.email].filter(Boolean).length;
        break;
        
      case "profile_complete":
        const profileItems = [
          !!(member.firstName && member.lastName && member.email),
          !!(member.phone && member.nationalId),
          !!member.dateOfBirth,
          !!member.organizationId,
          !!member.memberType
        ];
        currentValue = profileItems.filter(Boolean).length;
        break;
        
      case "documents_verified":
        currentValue = documents.filter(doc => doc.isVerified).length;
        break;
        
      case "cpd_achiever":
        currentValue = member.cpdPoints || 0;
        break;
        
      case "event_participant":
        currentValue = eventAttendance;
        break;
        
      case "payment_complete":
        if (requirements.includes("membershipPayment")) {
          currentValue = payments.filter(p => 
            p.status === "completed" && 
            p.purpose === "membership"
          ).length;
        } else {
          currentValue = payments.filter(p => p.status === "completed").length;
        }
        break;
        
      case "organization_member":
        currentValue = member.organizationId ? 1 : 0;
        break;
        
      case "early_bird":
        if (member.createdAt && new Date(member.createdAt) <= new Date(threshold)) {
          currentValue = 1;
        }
        maxValue = 1;
        break;
        
      default:
        currentValue = 0;
    }

    const progress = maxValue > 0 ? Math.min((currentValue / maxValue) * 100, 100) : 0;
    const eligible = currentValue >= threshold;

    return {
      eligible,
      progress,
      nextThreshold: eligible ? undefined : threshold,
      requirements
    };
  }

  /**
   * Get all badges a member is eligible for but hasn't earned yet
   */
  static getEligibleBadges(
    allBadges: AchievementBadge[],
    earnedBadgeIds: string[],
    member: Member,
    documents: Document[] = [],
    payments: Payment[] = [],
    cpdActivities: CpdActivity[] = [],
    eventAttendance: number = 0
  ): AchievementBadge[] {
    return allBadges.filter(badge => {
      if (!badge.isActive || earnedBadgeIds.includes(badge.id)) {
        return false;
      }
      
      const result = this.checkBadgeEligibility(
        badge, member, documents, payments, cpdActivities, eventAttendance
      );
      
      return result.eligible;
    });
  }

  /**
   * Calculate badge progress for all badges
   */
  static calculateBadgeProgress(
    allBadges: AchievementBadge[],
    earnedBadgeIds: string[],
    member: Member,
    documents: Document[] = [],
    payments: Payment[] = [],
    cpdActivities: CpdActivity[] = [],
    eventAttendance: number = 0
  ): Record<string, number> {
    const progress: Record<string, number> = {};
    
    allBadges.forEach(badge => {
      if (!earnedBadgeIds.includes(badge.id)) {
        const result = this.checkBadgeEligibility(
          badge, member, documents, payments, cpdActivities, eventAttendance
        );
        progress[badge.id] = result.progress;
      }
    });
    
    return progress;
  }

  /**
   * Get badge statistics for a member
   */
  static getBadgeStats(
    allBadges: AchievementBadge[],
    earnedBadges: MemberAchievementBadge[]
  ) {
    const totalBadges = allBadges.filter(b => b.isActive).length;
    const earnedCount = earnedBadges.length;
    const totalPoints = earnedBadges.reduce((sum, badge) => {
      const badgeData = allBadges.find(b => b.id === badge.badgeId);
      return sum + (badgeData?.points || 0);
    }, 0);
    
    const difficultyCount = {
      bronze: earnedBadges.filter(badge => {
        const badgeData = allBadges.find(b => b.id === badge.badgeId);
        return badgeData?.difficulty === "bronze";
      }).length,
      silver: earnedBadges.filter(badge => {
        const badgeData = allBadges.find(b => b.id === badge.badgeId);
        return badgeData?.difficulty === "silver";
      }).length,
      gold: earnedBadges.filter(badge => {
        const badgeData = allBadges.find(b => b.id === badge.badgeId);
        return badgeData?.difficulty === "gold";
      }).length,
      platinum: earnedBadges.filter(badge => {
        const badgeData = allBadges.find(b => b.id === badge.badgeId);
        return badgeData?.difficulty === "platinum";
      }).length
    };

    return {
      totalBadges,
      earnedCount,
      totalPoints,
      completionPercentage: Math.round((earnedCount / totalBadges) * 100),
      difficultyCount
    };
  }
}