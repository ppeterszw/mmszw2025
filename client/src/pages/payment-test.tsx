import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormHeader } from "@/components/ui/form-header";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, DollarSign, CheckCircle, AlertTriangle } from "lucide-react";

export default function PaymentTestPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const testPayment = async (amount: number, description: string) => {
    setIsLoading(true);
    setPaymentResult(null);

    try {
      const response = await fetch('/api/payment/paynow/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          reference: `TEST-${Date.now()}`,
          email: 'test@eacz.org',
          phone: '+263771234567',
          description,
          paymentType: 'test'
        })
      });

      const result = await response.json();
      setPaymentResult(result);

      if (result.success) {
        toast({
          title: "Payment Test Successful",
          description: "PayNow payment initiated successfully!"
        });
      } else {
        toast({
          title: "Payment Test Failed",
          description: result.error || "Payment initiation failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment test error:', error);
      toast({
        title: "Test Error",
        description: "Failed to test payment integration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <FormHeader 
        title="EACZ Payment Integration"
        subtitle="Test Payment System"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Payment Integration Test</h1>
            <p className="text-blue-100">Test the improved PayNow payment workflow</p>
          </div>

          {/* Test Controls */}
          <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <CreditCard className="w-5 h-5 mr-2" />
                PayNow Integration Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => testPayment(10.00, "Test Payment - $10")}
                  disabled={isLoading}
                  className="gradient-button text-white border-0"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Test $10 Payment
                </Button>
                
                <Button
                  onClick={() => testPayment(25.50, "Test Payment - $25.50")}
                  disabled={isLoading}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Test $25.50 Payment
                </Button>
                
                <Button
                  onClick={() => testPayment(100.00, "Test Payment - $100")}
                  disabled={isLoading}
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Test $100 Payment
                </Button>
              </div>
              
              {isLoading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-600">Testing payment integration...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Result */}
          {paymentResult && (
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  {paymentResult.success ? (
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  )}
                  Payment Test Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      paymentResult.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {paymentResult.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  
                  {paymentResult.success && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Reference:</span>
                        <span className="text-blue-600 font-mono">{paymentResult.reference}</span>
                      </div>
                      
                      {paymentResult.paymentUrl && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium block mb-2">Payment URL:</span>
                          <a 
                            href={paymentResult.paymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {paymentResult.paymentUrl}
                          </a>
                        </div>
                      )}
                      
                      {paymentResult.message && (
                        <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                          <p className="text-blue-800">{paymentResult.message}</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  {!paymentResult.success && (
                    <>
                      <div className="p-3 bg-red-50 border-l-4 border-red-400">
                        <p className="text-red-800">{paymentResult.error}</p>
                      </div>
                      
                      {paymentResult.errorCode && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Error Code:</span>
                          <span className="text-red-600 font-mono">{paymentResult.errorCode}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integration Status */}
          <Card className="bg-white/95 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-gray-900">Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Enhanced Validation</h3>
                  <p className="text-sm text-gray-600">Improved input validation and error handling</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Better Logging</h3>
                  <p className="text-sm text-gray-600">Comprehensive error logging and debugging</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Status Tracking</h3>
                  <p className="text-sm text-gray-600">Enhanced payment status tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}