/**
 * PayNow Payment Integration Service for Zimbabwe
 * Supports EcoCash and OneMoney payments
 */

import crypto from 'crypto';
import { db } from '../db';
import { payments, paymentInstallments } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface PayNowConfig {
  integrationId: string;
  integrationKey: string;
  returnUrl: string;
  resultUrl: string;
  merchantName?: string;
}

interface PaymentInitiationRequest {
  amount: number;
  reference: string;
  description: string;
  email?: string;
  phone?: string;
  paymentMethod: 'ecocash' | 'onemoney';
}

interface PaymentStatusResponse {
  status: 'paid' | 'pending' | 'cancelled' | 'failed';
  pollUrl: string;
  reference: string;
  paynowReference: string;
  amount: number;
  hash: string;
}

export class PayNowService {
  private config: PayNowConfig;
  private baseUrl: string;

  constructor(config: PayNowConfig) {
    this.config = config;
    // Always use production URL as PayNow doesn't have a public sandbox
    // Test with small amounts in development
    this.baseUrl = 'https://www.paynow.co.zw';
  }

  /**
   * Generate HMAC SHA512 hash for request verification
   */
  private generateHash(data: Record<string, any>): string {
    const values = Object.keys(data)
      .sort()
      .map(key => data[key])
      .join('');

    const hashString = values + this.config.integrationKey;
    return crypto
      .createHmac('sha512', this.config.integrationKey)
      .update(hashString)
      .digest('hex')
      .toUpperCase();
  }

  /**
   * Verify hash from PayNow callback
   */
  private verifyHash(data: Record<string, any>, receivedHash: string): boolean {
    const calculatedHash = this.generateHash(data);
    return calculatedHash === receivedHash.toUpperCase();
  }

  /**
   * Initiate a mobile money payment
   */
  async initiatePayment(request: PaymentInitiationRequest): Promise<{
    success: boolean;
    redirectUrl?: string;
    pollUrl?: string;
    reference?: string;
    error?: string;
  }> {
    try {
      const paymentData: Record<string, any> = {
        id: this.config.integrationId,
        reference: request.reference,
        amount: request.amount.toFixed(2),
        additionalinfo: request.description,
        returnurl: this.config.returnUrl,
        resulturl: this.config.resultUrl,
        status: 'Message',
      };

      // Add optional fields
      if (request.email) {
        paymentData.authemail = request.email;
      }
      if (request.phone) {
        paymentData.phone = request.phone;
      }

      // Generate hash
      paymentData.hash = this.generateHash(paymentData);

      // Convert to URL encoded form data
      const formData = new URLSearchParams(paymentData);

      // Send request to PayNow
      const endpoint = request.paymentMethod === 'ecocash'
        ? '/interface/initiatetransaction'
        : '/interface/remotetransaction';

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const responseText = await response.text();
      const responseData = this.parsePayNowResponse(responseText);

      if (responseData.status?.toLowerCase() === 'ok') {
        return {
          success: true,
          redirectUrl: responseData.browserurl,
          pollUrl: responseData.pollurl,
          reference: request.reference,
        };
      } else {
        return {
          success: false,
          error: responseData.error || 'Payment initiation failed',
        };
      }
    } catch (error: any) {
      console.error('PayNow initiation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to initiate payment',
      };
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(pollUrl: string): Promise<PaymentStatusResponse | null> {
    try {
      const response = await fetch(pollUrl, {
        method: 'GET',
      });

      const responseText = await response.text();
      const data = this.parsePayNowResponse(responseText);

      return {
        status: this.mapPayNowStatus(data.status),
        pollUrl,
        reference: data.reference || '',
        paynowReference: data.paynowreference || '',
        amount: parseFloat(data.amount || '0'),
        hash: data.hash || '',
      };
    } catch (error: any) {
      console.error('PayNow status check error:', error);
      return null;
    }
  }

  /**
   * Process PayNow callback/webhook
   */
  async processCallback(callbackData: Record<string, any>): Promise<{
    success: boolean;
    paymentId?: string;
    status?: string;
    error?: string;
  }> {
    try {
      // Verify hash
      const { hash, ...dataToVerify } = callbackData;
      if (!this.verifyHash(dataToVerify, hash)) {
        return {
          success: false,
          error: 'Invalid hash - potential security issue',
        };
      }

      const reference = callbackData.reference;
      const status = this.mapPayNowStatus(callbackData.status);
      const paynowReference = callbackData.paynowreference;
      const amount = parseFloat(callbackData.amount || '0');

      // Find payment by reference
      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.referenceNumber, reference))
        .limit(1);

      if (!payment) {
        return {
          success: false,
          error: 'Payment not found',
        };
      }

      // Update payment status
      const updateData: any = {
        status,
        externalPaymentId: paynowReference,
        gatewayResponse: JSON.stringify(callbackData),
        updatedAt: new Date(),
      };

      if (status === 'completed') {
        updateData.paymentDate = new Date();
      } else if (status === 'failed') {
        updateData.failureReason = callbackData.error || 'Payment failed';
      }

      await db
        .update(payments)
        .set(updateData)
        .where(eq(payments.id, payment.id));

      return {
        success: true,
        paymentId: payment.id,
        status,
      };
    } catch (error: any) {
      console.error('PayNow callback processing error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process callback',
      };
    }
  }

  /**
   * Parse PayNow response (key=value format)
   */
  private parsePayNowResponse(response: string): Record<string, string> {
    const data: Record<string, string> = {};
    const lines = response.split('\n');

    for (const line of lines) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        data[key.toLowerCase().trim()] = valueParts.join('=').trim();
      }
    }

    return data;
  }

  /**
   * Map PayNow status to our internal status
   */
  private mapPayNowStatus(paynowStatus?: string): 'paid' | 'pending' | 'cancelled' | 'failed' {
    if (!paynowStatus) return 'pending';

    const status = paynowStatus.toLowerCase();

    if (status === 'paid' || status === 'delivered' || status === 'ok') {
      return 'paid';
    } else if (status === 'cancelled' || status === 'canceled') {
      return 'cancelled';
    } else if (status === 'failed' || status === 'error') {
      return 'failed';
    } else {
      return 'pending';
    }
  }

  /**
   * Initiate Express Checkout (for mobile apps)
   */
  async initiateExpressCheckout(request: PaymentInitiationRequest & { phoneNumber: string }): Promise<{
    success: boolean;
    pollUrl?: string;
    instructions?: string;
    error?: string;
  }> {
    try {
      const paymentData: Record<string, any> = {
        id: this.config.integrationId,
        reference: request.reference,
        amount: request.amount.toFixed(2),
        additionalinfo: request.description,
        returnurl: this.config.returnUrl,
        resulturl: this.config.resultUrl,
        phone: request.phoneNumber,
        method: request.paymentMethod === 'ecocash' ? 'ecocash' : 'onemoney',
        status: 'Message',
      };

      paymentData.hash = this.generateHash(paymentData);

      const formData = new URLSearchParams(paymentData);

      const response = await fetch(`${this.baseUrl}/interface/remotetransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const responseText = await response.text();
      const responseData = this.parsePayNowResponse(responseText);

      if (responseData.status?.toLowerCase() === 'ok' || responseData.status?.toLowerCase() === 'sent') {
        return {
          success: true,
          pollUrl: responseData.pollurl,
          instructions: `Please check your ${request.paymentMethod === 'ecocash' ? 'EcoCash' : 'OneMoney'} phone for the payment prompt and enter your PIN to complete the transaction.`,
        };
      } else {
        return {
          success: false,
          error: responseData.error || 'Express checkout failed',
        };
      }
    } catch (error: any) {
      console.error('Express checkout error:', error);
      return {
        success: false,
        error: error.message || 'Failed to initiate express checkout',
      };
    }
  }

  /**
   * Generate payment reference
   */
  static generateReference(prefix: string = 'PAY'): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}

// Export singleton instance
let paynowService: PayNowService | null = null;

export function getPayNowService(): PayNowService {
  if (!paynowService) {
    const config: PayNowConfig = {
      integrationId: process.env.PAYNOW_INTEGRATION_ID || '',
      integrationKey: process.env.PAYNOW_INTEGRATION_KEY || '',
      returnUrl: process.env.PAYNOW_RETURN_URL || `${process.env.BASE_URL}/payment/return`,
      resultUrl: process.env.PAYNOW_RESULT_URL || `${process.env.BASE_URL}/api/payments/paynow/callback`,
      merchantName: 'Estate Agents Council of Zimbabwe',
    };

    paynowService = new PayNowService(config);
  }

  return paynowService;
}
