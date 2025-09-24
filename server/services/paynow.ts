import crypto from 'crypto';

interface PaynowConfig {
  id: string;
  key: string;
  returnUrl: string;
  resultUrl: string;
  baseUrl?: string;
}

interface PaynowInitiateParams {
  amount: number;
  currency: string;
  reference: string;
  email: string;
  returnUrl?: string;
  resultUrl?: string;
}

interface PaynowInitiateResponse {
  success: boolean;
  redirectUrl?: string;
  pollUrl?: string;
  providerRef?: string;
  error?: string;
}

interface PaynowIPNPayload {
  reference: string;
  paynowreference: string;
  amount: string;
  status: string;
  pollurl: string;
  hash: string;
}

/**
 * Paynow Payment Gateway Service
 * Handles payment initiation and verification for Zimbabwe local payments
 */
export class PaynowService {
  private config: PaynowConfig;

  constructor(config: PaynowConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || 'https://www.paynow.co.zw'
    };
  }

  /**
   * Initiate a payment with Paynow
   */
  async initiatePayment(params: PaynowInitiateParams): Promise<PaynowInitiateResponse> {
    try {
      const paymentData = {
        id: this.config.id,
        reference: params.reference,
        amount: params.amount.toString(),
        additionalinfo: params.email,
        returnurl: params.returnUrl || this.config.returnUrl,
        resulturl: params.resultUrl || this.config.resultUrl,
        authemail: params.email,
        status: 'Message'
      };

      // Generate hash for security
      const hash = this.generateHash(paymentData);
      const payload = { ...paymentData, hash };

      // Convert to form data
      const formData = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(`${this.config.baseUrl}/interface/initiatetransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      const responseText = await response.text();
      const responseData = this.parsePaynowResponse(responseText);

      if (responseData.status?.toLowerCase() === 'ok') {
        return {
          success: true,
          redirectUrl: responseData.browserurl,
          pollUrl: responseData.pollurl,
          providerRef: responseData.paynowreference
        };
      } else {
        return {
          success: false,
          error: responseData.error || 'Payment initiation failed'
        };
      }
    } catch (error) {
      console.error('Paynow initiation error:', error);
      return {
        success: false,
        error: 'Payment service unavailable'
      };
    }
  }

  /**
   * Verify IPN (Instant Payment Notification) from Paynow
   */
  verifyIPN(payload: PaynowIPNPayload): boolean {
    try {
      const dataToHash = {
        reference: payload.reference,
        paynowreference: payload.paynowreference,
        amount: payload.amount,
        status: payload.status,
        pollurl: payload.pollurl
      };

      const expectedHash = this.generateHash(dataToHash);
      return expectedHash.toUpperCase() === payload.hash.toUpperCase();
    } catch (error) {
      console.error('IPN verification error:', error);
      return false;
    }
  }

  /**
   * Poll payment status
   */
  async pollPaymentStatus(pollUrl: string): Promise<{
    success: boolean;
    status?: string;
    amount?: string;
    reference?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(pollUrl);
      const responseText = await response.text();
      const responseData = this.parsePaynowResponse(responseText);

      return {
        success: true,
        status: responseData.status,
        amount: responseData.amount,
        reference: responseData.reference
      };
    } catch (error) {
      console.error('Poll payment error:', error);
      return {
        success: false,
        error: 'Unable to check payment status'
      };
    }
  }

  /**
   * Generate security hash for Paynow requests
   */
  private generateHash(data: Record<string, string>): string {
    // Sort data by keys and concatenate values
    const sortedKeys = Object.keys(data).sort();
    const values = sortedKeys.map(key => data[key]).join('');
    const stringToHash = values + this.config.key;
    
    return crypto
      .createHash('sha512')
      .update(stringToHash)
      .digest('hex')
      .toUpperCase();
  }

  /**
   * Parse Paynow response format (key=value pairs)
   */
  private parsePaynowResponse(responseText: string): Record<string, string> {
    const lines = responseText.trim().split('\n');
    const result: Record<string, string> = {};

    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        result[key.toLowerCase()] = valueParts.join('=');
      }
    });

    return result;
  }

  /**
   * Get payment status text
   */
  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'Paid': 'Payment successful',
      'Awaiting Delivery': 'Payment received, awaiting delivery confirmation',
      'Delivered': 'Payment completed and delivery confirmed',
      'Cancelled': 'Payment was cancelled',
      'Failed': 'Payment failed',
      'Pending': 'Payment is pending',
      'Sent': 'Payment has been sent for processing',
      'Created': 'Payment created but not yet processed'
    };

    return statusMap[status] || `Status: ${status}`;
  }
}

/**
 * Factory function to create Paynow service instance
 */
export function createPaynowService(): PaynowService {
  const config: PaynowConfig = {
    id: process.env.PAYNOW_ID || '',
    key: process.env.PAYNOW_KEY || '',
    returnUrl: process.env.PAYNOW_RETURN_URL || `${process.env.BASE_URL}/api/public/paynow/return`,
    resultUrl: process.env.PAYNOW_RESULT_URL || `${process.env.BASE_URL}/api/system/paynow/ipn`
  };

  if (!config.id || !config.key) {
    throw new Error('Paynow configuration missing. Please set PAYNOW_ID and PAYNOW_KEY environment variables.');
  }

  return new PaynowService(config);
}

/**
 * Payment status helpers
 */
export const PaynowStatus = {
  PAID: 'Paid',
  AWAITING_DELIVERY: 'Awaiting Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  FAILED: 'Failed',
  PENDING: 'Pending',
  SENT: 'Sent',
  CREATED: 'Created'
} as const;

export function isPaymentSuccessful(status: string): boolean {
  return [PaynowStatus.PAID, PaynowStatus.AWAITING_DELIVERY, PaynowStatus.DELIVERED].includes(status as any);
}

export function isPaymentFailed(status: string): boolean {
  return [PaynowStatus.CANCELLED, PaynowStatus.FAILED].includes(status as any);
}

export function isPaymentPending(status: string): boolean {
  return [PaynowStatus.PENDING, PaynowStatus.SENT, PaynowStatus.CREATED].includes(status as any);
}