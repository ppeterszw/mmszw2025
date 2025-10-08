/**
 * Environment Variable Validation
 * Validates all required environment variables at startup
 */

import { z } from 'zod';

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),

  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),
  DATABASE_URL_UNPOOLED: z.string().url().optional(),

  // Security
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters for security'),

  // Clerk Authentication
  CLERK_SECRET_KEY: z.string().startsWith('sk_', 'CLERK_SECRET_KEY must start with sk_'),
  VITE_CLERK_PUBLISHABLE_KEY: z.string().startsWith('pk_', 'VITE_CLERK_PUBLISHABLE_KEY must start with pk_'),

  // Email Service (ZeptoMail)
  Send_Mail_Token: z.string().min(50, 'Send_Mail_Token is required for email service'),
  Host: z.string().min(1, 'Email Host is required'),
  Sender_Address: z.string().email('Sender_Address must be a valid email'),

  // PayNow (Zimbabwe Payments) - Optional
  PAYNOW_INTEGRATION_ID: z.string().optional(),
  PAYNOW_INTEGRATION_KEY: z.string().uuid().optional(),
  PAYNOW_RETURN_URL: z.string().url().optional(),
  PAYNOW_RESULT_URL: z.string().url().optional(),

  // Base URL
  BASE_URL: z.string().url().optional(),

  // Google Cloud Storage - Optional
  GOOGLE_CLOUD_PROJECT_ID: z.string().optional(),
  GOOGLE_CLOUD_PRIVATE_KEY: z.string().optional(),
  GOOGLE_CLOUD_CLIENT_EMAIL: z.string().email().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Throws error and exits if validation fails
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      console.error('');

      error.errors.forEach((err) => {
        const path = err.path.join('.');
        console.error(`  • ${path}: ${err.message}`);
      });

      console.error('');
      console.error('💡 Please check your .env.local file and ensure all required variables are set correctly.');
      console.error('');

      process.exit(1);
    }

    throw error;
  }
}

/**
 * Get validated environment variables
 * Call validateEnv() first during app initialization
 */
export function getEnv(): Env {
  return envSchema.parse(process.env);
}
