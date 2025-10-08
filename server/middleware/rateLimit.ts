/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DDoS attacks
 *
 * Installation required:
 *   npm install express-rate-limit
 */

import rateLimit from 'express-rate-limit';
import { RATE_LIMIT, HTTP_STATUS } from '../constants';

/**
 * General API rate limiter
 * Applied to all /api/* routes
 */
export const apiRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.API.WINDOW_MS,
  max: RATE_LIMIT.API.MAX_REQUESTS,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT.API.WINDOW_MS / 1000 / 60) + ' minutes'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Store in memory by default (use Redis in production for distributed systems)
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks on login/register
 */
export const authRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH.WINDOW_MS,
  max: RATE_LIMIT.AUTH.MAX_REQUESTS,
  skipSuccessfulRequests: true, // Don't count successful logins
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT.AUTH.WINDOW_MS / 1000 / 60) + ' minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for public application submissions
 * Prevents spam applications
 */
export const applicationRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.APPLICATION.WINDOW_MS,
  max: RATE_LIMIT.APPLICATION.MAX_REQUESTS,
  message: {
    success: false,
    error: {
      code: 'APPLICATION_RATE_LIMIT_EXCEEDED',
      message: 'Too many applications submitted. Please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT.APPLICATION.WINDOW_MS / 1000 / 60) + ' minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limit for authenticated users (they have other protections)
  skip: (req) => !!req.user,
});

/**
 * Rate limiter for public endpoints (verification, search, etc.)
 * More lenient than auth but still protective
 */
export const publicRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.PUBLIC.WINDOW_MS,
  max: RATE_LIMIT.PUBLIC.MAX_REQUESTS,
  message: {
    success: false,
    error: {
      code: 'PUBLIC_RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again in a few minutes.',
      retryAfter: Math.ceil(RATE_LIMIT.PUBLIC.WINDOW_MS / 1000 / 60) + ' minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for sensitive operations
 * Password resets, email verification, etc.
 */
export const sensitiveOperationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 attempts per hour
  message: {
    success: false,
    error: {
      code: 'SENSITIVE_OPERATION_RATE_LIMIT',
      message: 'Too many attempts for this sensitive operation. Please try again later.',
      retryAfter: '1 hour'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Custom rate limiter factory
 * Create custom rate limiters with specific settings
 */
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    skipSuccessfulRequests: options.skipSuccessfulRequests,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: options.message || 'Too many requests, please try again later.'
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

/**
 * Rate limiter for file uploads
 * Prevents spam of large file uploads
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 uploads per 15 minutes
  message: {
    success: false,
    error: {
      code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
      message: 'Too many file uploads. Please try again later.',
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for bulk operations (imports, exports)
 * Very strict to prevent resource exhaustion
 */
export const bulkOperationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Only 5 bulk operations per hour
  message: {
    success: false,
    error: {
      code: 'BULK_OPERATION_RATE_LIMIT',
      message: 'Too many bulk operations. Please try again later.',
      retryAfter: '1 hour'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});
