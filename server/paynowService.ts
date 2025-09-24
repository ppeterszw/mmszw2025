interface PaynowConfig {
  integrationId: string;
  integrationKey: string;
  paymentLink: string;
}

interface PaynowPaymentRequest {
  amount: number;
  currency: string;
  reference: string;
  email: string;
  phone?: string;
  description: string;
  returnUrl?: string;
  resultUrl?: string;
  memberId?: string;
  paymentType?: string;
}

interface PaynowPaymentResponse {
  success: boolean;
  error?: string;
  paymentUrl?: string;
  pollUrl?: string;
  hash?: string;
  reference?: string;
  errorCode?: string;
  paynowReference?: string;
}

export class PaynowService {
  private config: PaynowConfig;

  constructor() {
    this.config = {
      integrationId: process.env.PAYNOW_INTEGRATION_ID || "21044",
      integrationKey: process.env.PAYNOW_INTEGRATION_KEY || "b1f1b8fb-0ae5-47f4-aa6e-0f250c38fa64",
      paymentLink: process.env.PAYNOW_PAYMENT_LINK || "erpnext-usd"
    };
  }

  private generateHash(data: Record<string, string>): string {
    const crypto = require('crypto');
    const sortedKeys = Object.keys(data).sort();
    const queryString = sortedKeys
      .map(key => `${key}=${data[key]}`)
      .join('&');
    
    const hashString = queryString + this.config.integrationKey;
    return crypto.createHash('sha512').update(hashString).digest('hex').toUpperCase();
  }

  private parsePaynowResponse(response: string): PaynowPaymentResponse {
    const lines = response.split('\n');
    const data: Record<string, string> = {};
    
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        data[key.trim()] = value.trim();
      }
    });

    console.log('PayNow Response Data:', data);

    if (data.status === 'Ok') {
      return {
        success: true,
        paymentUrl: data.browserurl,
        pollUrl: data.pollurl,
        hash: data.hash,
        reference: data.reference,
        paynowReference: data.paynowreference
      };
    } else {
      return {
        success: false,
        error: data.error || 'Payment initiation failed',
        errorCode: data.errorcode
      };
    }
  }

  async initiatePayment(request: PaynowPaymentRequest): Promise<PaynowPaymentResponse> {
    try {
      // Validate required fields
      if (!request.amount || request.amount <= 0) {
        return {
          success: false,
          error: 'Invalid payment amount'
        };
      }

      if (!request.email || !this.isValidEmail(request.email)) {
        return {
          success: false,
          error: 'Valid email address is required'
        };
      }

      if (!request.reference || request.reference.length < 3) {
        return {
          success: false,
          error: 'Payment reference is required and must be at least 3 characters'
        };
      }

      const baseUrl = 'https://mms.estateagentscouncil.org';

      const paymentData: Record<string, string> = {
        id: this.config.integrationId,
        reference: request.reference,
        amount: request.amount.toFixed(2),
        email: request.email,
        additionalinfo: request.description || 'EACZ Payment',
        returnurl: request.returnUrl || `${baseUrl}/payment/return`,
        resulturl: request.resultUrl || `${baseUrl}/api/payment/paynow/callback`,
        status: 'Message'
      };

      // Add phone number if provided and valid
      if (request.phone && this.isValidPhoneNumber(request.phone)) {
        paymentData.phone = request.phone;
      }

      console.log('PayNow Payment Data:', { ...paymentData, hash: '[HIDDEN]' });

      // Generate hash
      const hash = this.generateHash(paymentData);
      paymentData.hash = hash;

      // Prepare form data
      const formData = new URLSearchParams(paymentData);

      const response = await fetch('https://www.paynow.co.zw/interface/initiatetransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'EACZ-System/1.0'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('PayNow Raw Response:', responseText);
      
      const result = this.parsePaynowResponse(responseText);
      
      if (!result.success && result.error) {
        console.error('PayNow Error:', result.error, 'Code:', result.errorCode);
      }
      
      return result;

    } catch (error) {
      console.error('Paynow payment initiation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initiate payment. Please try again or contact support.'
      };
    }
  }

  async verifyPayment(pollUrl: string): Promise<{ success: boolean; status?: string; error?: string; amount?: string; reference?: string }> {
    try {
      if (!pollUrl || !pollUrl.startsWith('https://')) {
        return {
          success: false,
          error: 'Invalid poll URL provided'
        };
      }

      const verificationData = {
        id: this.config.integrationId
      };
      
      const response = await fetch(pollUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'EACZ-System/1.0'
        },
        body: new URLSearchParams({
          ...verificationData,
          hash: this.generateHash(verificationData)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('PayNow Verification Response:', responseText);
      
      const lines = responseText.split('\n');
      const data: Record<string, string> = {};
      
      lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          data[key.trim()] = value.trim();
        }
      });

      return {
        success: data.status === 'Paid',
        status: data.status,
        amount: data.amount,
        reference: data.reference
      };

    } catch (error) {
      console.error('Paynow payment verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify payment'
      };
    }
  }

  // Validation helpers
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Zimbabwe phone number validation (supports +263, 263, 07, 08, 09)
    const phoneRegex = /^(\+263|263|0)[7-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  // Get payment status description
  getPaymentStatusDescription(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid': return 'Payment completed successfully';
      case 'awaiting delivery': return 'Payment received, awaiting delivery confirmation';
      case 'delivered': return 'Payment completed and delivered';
      case 'cancelled': return 'Payment was cancelled';
      case 'disputed': return 'Payment is under dispute';
      case 'refunded': return 'Payment has been refunded';
      default: return 'Payment status unknown';
    }
  }
}

export const paynowService = new PaynowService();