import { randomUUID } from 'crypto';

// Note: generateApplicantId() function has been removed
// Use nextApplicationId('individual') from services/namingSeries.ts instead

/**
 * Generate a secure email verification token
 */
export function generateVerificationToken(): string {
  return randomUUID().replace(/-/g, '');
}

/**
 * Calculate verification token expiry (24 hours from now)
 */
export function getVerificationExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
}