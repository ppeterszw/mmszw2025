/**
 * Google Pay Payment Button Component
 * Integrates Google Pay for payment processing
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface GooglePayButtonProps {
  amount: string;
  currency?: string;
  description: string;
  purpose: string;
  memberId?: string;
  onPaymentSuccess?: (paymentId: string, transactionId: string) => void;
  onPaymentError?: (error: string) => void;
}

export function GooglePayButton({
  amount,
  currency = "USD",
  description,
  purpose,
  memberId,
  onPaymentSuccess,
  onPaymentError
}: GooglePayButtonProps) {
  const { toast } = useToast();
  const [isGooglePayReady, setIsGooglePayReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if Google Pay API is available
    if (typeof window !== 'undefined' && window.google && window.google.payments) {
      setIsGooglePayReady(true);
    }
  }, []);

  const handleGooglePayClick = async () => {
    setIsProcessing(true);

    try {
      // For demo purposes, simulate a payment token
      // In production, this would come from Google Pay API
      const simulatedToken = `gpay_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // Call backend to process payment
      const response = await fetch('/api/payments/google-pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          purpose,
          memberId,
          paymentToken: simulatedToken
        })
      });

      const result = await response.json();

      if (result.success && result.paymentId && result.transactionId) {
        toast({
          title: "Payment Successful",
          description: `Transaction ID: ${result.transactionId}`,
        });

        if (onPaymentSuccess) {
          onPaymentSuccess(result.paymentId, result.transactionId);
        }
      } else {
        throw new Error(result.message || 'Payment failed');
      }

    } catch (error: any) {
      const errorMessage = error.message || 'Payment processing failed';
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: errorMessage,
      });

      if (onPaymentError) {
        onPaymentError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleGooglePayClick}
        disabled={isProcessing}
        className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
            </svg>
            <span>Pay with Google Pay</span>
            <span className="font-bold">${parseFloat(amount).toFixed(2)}</span>
          </>
        )}
      </Button>

      {!isGooglePayReady && (
        <p className="text-xs text-muted-foreground text-center">
          Google Pay integration is in demo mode
        </p>
      )}
    </div>
  );
}

// Add TypeScript declaration for Google Pay API
declare global {
  interface Window {
    google?: {
      payments: {
        api: {
          PaymentsClient: any;
        };
      };
    };
  }
}
