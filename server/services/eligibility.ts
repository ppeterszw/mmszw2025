import { z } from 'zod';

// Validation schemas for input data
const oLevelSchema = z.object({
  subjects: z.array(z.string()),
  hasEnglish: z.boolean(),
  hasMath: z.boolean(),
  passesCount: z.number()
});

const aLevelSchema = z.object({
  subjects: z.array(z.string()),
  passesCount: z.number()
}).optional();

const equivalentQualificationSchema = z.object({
  type: z.string(),
  institution: z.string(),
  levelMap: z.string(), // How it maps to A-Level equivalent
  evidenceDocId: z.string().optional()
}).optional();

const personalSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dob: z.string(), // ISO date string
  nationalId: z.string().optional(),
  email: z.string().email(),
  phone: z.object({
    countryCode: z.string(),
    number: z.string()
  }).optional(),
  address: z.string().optional(),
  countryOfResidence: z.string(),
  currentEmployer: z.string().optional()
});

interface IndividualEligibilityInput {
  personal: z.infer<typeof personalSchema>;
  oLevel: z.infer<typeof oLevelSchema>;
  aLevel?: z.infer<typeof aLevelSchema>;
  equivalentQualification?: z.infer<typeof equivalentQualificationSchema>;
}

interface EligibilityResult {
  ok: boolean;
  mature?: boolean;
  reason?: string;
  requirements?: string[];
  warnings?: string[];
}

interface OrganizationEligibilityInput {
  orgProfile: {
    legalName: string;
    tradingName?: string;
    regNo?: string;
    taxNo?: string;
    address?: string;
    emails: string[];
    phones?: string[];
  };
  trustAccount: {
    bankName: string;
    branch?: string;
    accountNoMasked?: string;
  };
  preaMemberId: string;
  directors: Array<{
    name: string;
    nationalId?: string;
    memberId?: string;
  }>;
}

/**
 * Check individual member eligibility based on education and age requirements
 */
export function checkIndividualEligibility(input: IndividualEligibilityInput): EligibilityResult {
  try {
    // Validate input
    personalSchema.parse(input.personal);
    oLevelSchema.parse(input.oLevel);
    if (input.aLevel) aLevelSchema.parse(input.aLevel);
    if (input.equivalentQualification) equivalentQualificationSchema.parse(input.equivalentQualification);

    const requirements: string[] = [];
    const warnings: string[] = [];

    // Calculate age at submission
    const dob = new Date(input.personal.dob);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();
    const adjustedAge = (now.getMonth() < dob.getMonth() || 
      (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())) 
      ? age - 1 : age;

    // Check O-Level requirements
    if (input.oLevel.passesCount < 5) {
      return {
        ok: false,
        reason: 'Must have at least 5 O-Level passes'
      };
    }

    if (!input.oLevel.hasEnglish) {
      return {
        ok: false,
        reason: 'Must have O-Level English pass'
      };
    }

    if (!input.oLevel.hasMath) {
      return {
        ok: false,
        reason: 'Must have O-Level Mathematics pass'
      };
    }

    // Age-based requirements
    const isMatureEntry = adjustedAge >= 27;

    if (!isMatureEntry) {
      // Normal entry - requires A-Level or equivalent
      const hasALevel = input.aLevel && input.aLevel.passesCount >= 2;
      const hasEquivalent = input.equivalentQualification && 
        input.equivalentQualification.evidenceDocId;

      if (!hasALevel && !hasEquivalent) {
        return {
          ok: false,
          reason: 'Applicants under 27 must have either 2+ A-Level passes or certified equivalent qualification'
        };
      }

      if (hasALevel) {
        requirements.push('Provide certified A-Level certificate');
      }

      if (hasEquivalent && !hasALevel) {
        requirements.push('Provide certified evidence of equivalent qualification');
      }
    } else {
      // Mature entry - A-Level not required but beneficial
      if (input.aLevel && input.aLevel.passesCount >= 2) {
        warnings.push('A-Level qualifications will strengthen your application');
      }
    }

    // Required documents for all applicants
    requirements.push(
      'Upload certified O-Level certificate',
      'Upload valid ID or Passport',
      'Upload birth certificate'
    );

    return {
      ok: true,
      mature: isMatureEntry,
      requirements,
      warnings: warnings.length > 0 ? warnings : undefined
    };

  } catch (error) {
    return {
      ok: false,
      reason: 'Invalid application data provided'
    };
  }
}

/**
 * Check organization eligibility and requirements
 */
export function checkOrganizationEligibility(
  input: OrganizationEligibilityInput,
  docMap: Record<string, boolean> = {},
  preaIsActive: boolean = false,
  preaIsDirector: boolean = false
): EligibilityResult {
  try {
    const requirements: string[] = [];
    const warnings: string[] = [];

    // Basic organization profile validation
    if (!input.orgProfile.legalName || input.orgProfile.legalName.trim().length < 2) {
      return {
        ok: false,
        reason: 'Valid organization legal name is required'
      };
    }

    if (!input.orgProfile.emails || input.orgProfile.emails.length === 0) {
      return {
        ok: false,
        reason: 'At least one email address is required'
      };
    }

    // Trust account validation
    if (!input.trustAccount.bankName || input.trustAccount.bankName.trim().length < 2) {
      return {
        ok: false,
        reason: 'Trust account bank name is required'
      };
    }

    // PREA (Principal Registered Estate Agent) validation
    if (!input.preaMemberId) {
      return {
        ok: false,
        reason: 'Principal Registered Estate Agent (PREA) must be declared'
      };
    }

    if (!preaIsActive) {
      return {
        ok: false,
        reason: 'Principal Registered Estate Agent must be an active individual member'
      };
    }

    if (!preaIsDirector) {
      warnings.push('Verify that the PREA is listed as a director in CR6 form');
    }

    // Directors validation
    if (!input.directors || input.directors.length === 0) {
      return {
        ok: false,
        reason: 'At least one director must be listed'
      };
    }

    // Required documents checklist
    const requiredDocs = [
      { key: 'bank_trust_letter', label: 'Trust Account letter from Commercial Bank' },
      { key: 'certificate_incorporation', label: 'Certificate of Incorporation OR Partnership Agreement' },
      { key: 'annual_return_1', label: 'Annual Return Form 1' },
      { key: 'annual_return_2', label: 'Annual Return Form 2' },
      { key: 'annual_return_3', label: 'Annual Return Form 3' },
      { key: 'cr6', label: 'CR6 Form (Director Proof)' },
      { key: 'cr11', label: 'Certified CR11 Forms' },
      { key: 'tax_clearance', label: 'Tax Clearance Certificate' }
    ];

    // Police clearance for each director
    input.directors.forEach((director, index) => {
      const docKey = `police_clearance_director_${index + 1}`;
      requiredDocs.push({
        key: docKey,
        label: `Police Clearance letter for ${director.name}`
      });
    });

    // Check which documents are missing
    const missingDocs = requiredDocs.filter(doc => !docMap[doc.key]);
    if (missingDocs.length > 0) {
      requirements.push(
        'Upload all required documents:',
        ...missingDocs.map(doc => `- ${doc.label}`)
      );
    }

    // Business logic validations
    const hasIncorporationCert = docMap['certificate_incorporation'];
    const hasPartnershipAgreement = docMap['partnership_agreement'];

    if (!hasIncorporationCert && !hasPartnershipAgreement) {
      requirements.push('Provide either Certificate of Incorporation OR Partnership Agreement');
    }

    // Verify PREA is among directors
    const preaInDirectors = input.directors.some(director => 
      director.memberId === input.preaMemberId
    );

    if (!preaInDirectors) {
      warnings.push('Ensure the PREA is listed among the directors');
    }

    return {
      ok: requirements.length === 0,
      reason: requirements.length > 0 ? 'Missing required documents or information' : undefined,
      requirements: requirements.length > 0 ? requirements : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };

  } catch (error) {
    return {
      ok: false,
      reason: 'Invalid organization data provided'
    };
  }
}

/**
 * Validate specific document requirements based on application type
 */
export function validateDocumentRequirements(
  applicationType: 'individual' | 'organization',
  uploadedDocs: string[],
  additionalContext?: any
): EligibilityResult {
  const missing: string[] = [];

  if (applicationType === 'individual') {
    const required = ['o_level_cert', 'id_or_passport', 'birth_certificate'];
    
    // Check for mature entry vs normal entry
    if (additionalContext?.matureEntry === false) {
      if (!uploadedDocs.includes('a_level_cert') && !uploadedDocs.includes('equivalent_cert')) {
        missing.push('A-Level certificate OR equivalent qualification evidence');
      }
    }

    required.forEach(docType => {
      if (!uploadedDocs.includes(docType)) {
        missing.push(getDocumentDisplayName(docType));
      }
    });

  } else if (applicationType === 'organization') {
    const required = [
      'bank_trust_letter',
      'cr6',
      'cr11', 
      'tax_clearance',
      'annual_return_1',
      'annual_return_2', 
      'annual_return_3'
    ];

    // Must have either incorporation or partnership
    if (!uploadedDocs.includes('certificate_incorporation') && 
        !uploadedDocs.includes('partnership_agreement')) {
      missing.push('Certificate of Incorporation OR Partnership Agreement');
    }

    required.forEach(docType => {
      if (!uploadedDocs.includes(docType)) {
        missing.push(getDocumentDisplayName(docType));
      }
    });

    // Police clearance for directors
    const directorCount = additionalContext?.directorCount || 1;
    for (let i = 1; i <= directorCount; i++) {
      if (!uploadedDocs.includes(`police_clearance_director_${i}`)) {
        missing.push(`Police Clearance for Director ${i}`);
      }
    }
  }

  return {
    ok: missing.length === 0,
    reason: missing.length > 0 ? 'Missing required documents' : undefined,
    requirements: missing.length > 0 ? missing : undefined
  };
}

/**
 * Get user-friendly document names
 */
function getDocumentDisplayName(docType: string): string {
  const names: Record<string, string> = {
    'o_level_cert': 'O-Level Certificate',
    'a_level_cert': 'A-Level Certificate', 
    'equivalent_cert': 'Equivalent Qualification Certificate',
    'id_or_passport': 'ID or Passport',
    'birth_certificate': 'Birth Certificate',
    'bank_trust_letter': 'Bank Trust Account Letter',
    'certificate_incorporation': 'Certificate of Incorporation',
    'partnership_agreement': 'Partnership Agreement',
    'cr6': 'CR6 Form',
    'cr11': 'CR11 Form',
    'tax_clearance': 'Tax Clearance Certificate',
    'annual_return_1': 'Annual Return Form 1',
    'annual_return_2': 'Annual Return Form 2', 
    'annual_return_3': 'Annual Return Form 3',
    'police_clearance_director': 'Police Clearance for Director'
  };

  return names[docType] || docType;
}