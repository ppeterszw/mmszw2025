/**
 * Error Handling Utility
 * Provides user-friendly error messages and prevents information disclosure
 */

import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ErrorCode, HTTP_STATUS } from '../constants';

/**
 * Custom Application Error
 * Use this for controlled error handling
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error creators
 */
export const Errors = {
  notFound: (resource: string) =>
    new AppError(
      HTTP_STATUS.NOT_FOUND,
      `${resource} not found`,
      ErrorCode.NOT_FOUND
    ),

  unauthorized: (message: string = 'Authentication required') =>
    new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      message,
      ErrorCode.UNAUTHORIZED
    ),

  forbidden: (message: string = 'You do not have permission to perform this action') =>
    new AppError(
      HTTP_STATUS.FORBIDDEN,
      message,
      ErrorCode.FORBIDDEN
    ),

  badRequest: (message: string) =>
    new AppError(
      HTTP_STATUS.BAD_REQUEST,
      message,
      ErrorCode.INVALID_INPUT
    ),

  validation: (message: string, details?: any) =>
    new AppError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      message,
      ErrorCode.VALIDATION_ERROR,
      details
    ),

  conflict: (message: string) =>
    new AppError(
      HTTP_STATUS.CONFLICT,
      message,
      ErrorCode.DUPLICATE_KEY
    ),

  internal: (message: string = 'An unexpected error occurred') =>
    new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message,
      ErrorCode.INTERNAL_ERROR
    ),
};

/**
 * PostgreSQL error code mappings
 */
const PG_ERROR_CODES: Record<string, { status: number; code: ErrorCode; message: string }> = {
  '23505': {
    status: HTTP_STATUS.CONFLICT,
    code: ErrorCode.DUPLICATE_KEY,
    message: 'A record with that value already exists'
  },
  '23503': {
    status: HTTP_STATUS.BAD_REQUEST,
    code: ErrorCode.FOREIGN_KEY_VIOLATION,
    message: 'Referenced record not found or cannot be deleted'
  },
  '23502': {
    status: HTTP_STATUS.BAD_REQUEST,
    code: ErrorCode.MISSING_REQUIRED_FIELD,
    message: 'Required field is missing'
  },
  '22P02': {
    status: HTTP_STATUS.BAD_REQUEST,
    code: ErrorCode.INVALID_INPUT,
    message: 'Invalid data format'
  },
  '42P01': {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: ErrorCode.INTERNAL_ERROR,
    message: 'Database configuration error'
  },
};

/**
 * Extract user-friendly field name from PostgreSQL error
 */
function extractFieldName(detail?: string): string | undefined {
  if (!detail) return undefined;

  // Extract field name from constraint violation
  // Example: "Key (email)=(test@test.com) already exists."
  const keyMatch = detail.match(/Key \(([^)]+)\)/);
  if (keyMatch) {
    return keyMatch[1].replace(/_/g, ' ');
  }

  return undefined;
}

/**
 * Format Zod validation errors
 */
function formatZodError(error: ZodError): { message: string; details: any[] } {
  const details = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  const fieldNames = details.map(d => d.field).filter(Boolean).join(', ');
  const message = fieldNames
    ? `Validation failed for: ${fieldNames}`
    : 'Validation failed';

  return { message, details };
}

/**
 * Main error handler
 * Converts any error into a consistent, user-friendly response
 */
export function handleError(error: any, req: Request, res: Response): void {
  // Log error internally (with full details)
  const errorLog = {
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    ip: req.ip,
    user: req.user?.id,
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    },
  };

  console.error('Error:', JSON.stringify(errorLog, null, 2));

  // Determine response details
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'An unexpected error occurred';
  let code = ErrorCode.INTERNAL_ERROR;
  let details: any = undefined;

  // Handle different error types
  if (error instanceof AppError) {
    // Custom application errors
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
    details = error.details;
  } else if (error instanceof ZodError) {
    // Zod validation errors
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    code = ErrorCode.VALIDATION_ERROR;
    const formatted = formatZodError(error);
    message = formatted.message;
    details = formatted.details;
  } else if (error.code && PG_ERROR_CODES[error.code]) {
    // PostgreSQL errors
    const pgError = PG_ERROR_CODES[error.code];
    statusCode = pgError.status;
    code = pgError.code;
    message = pgError.message;

    // Add field information if available
    const fieldName = extractFieldName(error.detail);
    if (fieldName) {
      message = `${message}: ${fieldName}`;
    }
  } else if (error.name === 'UnauthorizedError') {
    // JWT/Auth errors
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    code = ErrorCode.UNAUTHORIZED;
    message = 'Invalid or expired authentication token';
  } else if (error.message?.includes('ECONNREFUSED')) {
    // Database connection errors
    statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
    code = ErrorCode.SERVICE_UNAVAILABLE;
    message = 'Service temporarily unavailable. Please try again later.';
  }

  // Build response
  const response: any = {
    success: false,
    error: {
      code,
      message,
    },
  };

  // Include details in development mode
  if (process.env.NODE_ENV === 'development') {
    response.error.details = details || {
      originalError: error.message,
      stack: error.stack?.split('\n').slice(0, 5), // First 5 lines only
    };
  } else if (details) {
    // In production, only include safe details (like validation errors)
    response.error.details = details;
  }

  // Send response
  res.status(statusCode).json(response);
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: Function) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      handleError(error, req, res);
    });
  };
}

/**
 * Error response helpers
 */
export const ErrorResponse = {
  /**
   * Send not found error
   */
  notFound: (res: Response, resource: string = 'Resource') => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: {
        code: ErrorCode.NOT_FOUND,
        message: `${resource} not found`,
      },
    });
  },

  /**
   * Send unauthorized error
   */
  unauthorized: (res: Response, message: string = 'Authentication required') => {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: ErrorCode.UNAUTHORIZED,
        message,
      },
    });
  },

  /**
   * Send forbidden error
   */
  forbidden: (res: Response, message: string = 'Permission denied') => {
    res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      error: {
        code: ErrorCode.FORBIDDEN,
        message,
      },
    });
  },

  /**
   * Send validation error
   */
  validation: (res: Response, message: string, details?: any) => {
    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message,
        details,
      },
    });
  },

  /**
   * Send success response
   */
  success: (res: Response, data: any, statusCode: number = HTTP_STATUS.OK) => {
    res.status(statusCode).json({
      success: true,
      data,
    });
  },
};

/**
 * Example usage in routes:
 *
 * // Using AppError
 * app.get("/api/members/:id", async (req, res) => {
 *   const member = await storage.getMember(req.params.id);
 *   if (!member) {
 *     throw Errors.notFound('Member');
 *   }
 *   res.json(member);
 * });
 *
 * // Using asyncHandler
 * app.get("/api/members/:id", asyncHandler(async (req, res) => {
 *   const member = await storage.getMember(req.params.id);
 *   if (!member) {
 *     throw Errors.notFound('Member');
 *   }
 *   ErrorResponse.success(res, member);
 * }));
 *
 * // Using ErrorResponse helpers
 * app.get("/api/members/:id", async (req, res) => {
 *   try {
 *     const member = await storage.getMember(req.params.id);
 *     if (!member) {
 *       return ErrorResponse.notFound(res, 'Member');
 *     }
 *     ErrorResponse.success(res, member);
 *   } catch (error) {
 *     handleError(error, req, res);
 *   }
 * });
 */
