import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function PayNowPaymentTest() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amount: "100",
    purpose: "membership",
    paymentMethod: "paynow_ecocash",
    phoneNumber: "",
    email: "",
    description: "Test payment",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStatus(null);

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          purpose: formData.purpose,
          paymentMethod: formData.paymentMethod,
          phoneNumber: formData.phoneNumber || undefined,
          email: formData.email || undefined,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentId(data.payment.id);

        if (data.payment.method === "redirect" && data.paynow?.redirectUrl) {
          toast({
            title: "Redirecting to PayNow",
            description: "You will be redirected to complete your payment.",
          });
          // In production, redirect to PayNow
          window.open(data.paynow.redirectUrl, '_blank');
          startPolling(data.payment.id);
        } else if (data.payment.method === "express") {
          toast({
            title: "Payment Initiated",
            description: data.paynow?.instructions || "Check your phone for the payment prompt.",
          });
          startPolling(data.payment.id);
        } else {
          toast({
            title: "Payment Created",
            description: `Payment ID: ${data.payment.paymentNumber}`,
          });
        }
      } else {
        toast({
          title: "Payment Failed",
          description: data.error || "Failed to create payment",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (id: string) => {
    setPolling(true);
    setPaymentStatus("pending");

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/${id}/status`, {
          credentials: "include",
        });
        const data = await response.json();

        if (data.success) {
          setPaymentStatus(data.payment.status);

          if (data.payment.status === "completed") {
            clearInterval(interval);
            setPolling(false);
            toast({
              title: "Payment Successful!",
              description: "Your payment has been completed.",
            });
          } else if (["failed", "cancelled"].includes(data.payment.status)) {
            clearInterval(interval);
            setPolling(false);
            toast({
              title: "Payment Failed",
              description: `Payment status: ${data.payment.status}`,
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000); // Poll every 3 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(interval);
      setPolling(false);
      if (paymentStatus === "pending") {
        toast({
          title: "Polling Timeout",
          description: "Payment status check timed out. Please check manually.",
          variant: "destructive",
        });
      }
    }, 300000);
  };

  const getStatusBadge = () => {
    if (!paymentStatus) return null;

    switch (paymentStatus) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge>{paymentStatus}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">PayNow Payment Test</h1>
          <p className="text-blue-100">Test Zimbabwe Mobile Money Integration</p>
        </div>

        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Test Payment
            </CardTitle>
            <CardDescription>
              Use this form to test PayNow EcoCash/OneMoney integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Select
                    value={formData.purpose}
                    onValueChange={(value) => setFormData({ ...formData, purpose: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="membership">Membership</SelectItem>
                      <SelectItem value="application">Application</SelectItem>
                      <SelectItem value="renewal">Renewal</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paynow_ecocash">PayNow EcoCash</SelectItem>
                    <SelectItem value="paynow_onemoney">PayNow OneMoney</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional - for Express Checkout)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+263771234567"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Provide phone number for direct mobile prompt. Leave empty for web redirect.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="test@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-button text-white border-0"
                disabled={loading || polling}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Payment...
                  </>
                ) : polling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Waiting for Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Initiate Payment
                  </>
                )}
              </Button>
            </form>

            {paymentId && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Payment Status:</span>
                  {getStatusBadge()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Payment ID: {paymentId}
                </div>
                {polling && (
                  <div className="mt-2 text-xs text-blue-600">
                    Checking payment status every 3 seconds...
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Test Instructions:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <strong>Express Checkout:</strong> Enter your EcoCash/OneMoney number to receive a direct payment prompt</li>
                <li>• <strong>Web Redirect:</strong> Leave phone number empty to be redirected to PayNow website</li>
                <li>• <strong>Testing:</strong> Use sandbox credentials for testing in development mode</li>
                <li>• <strong>Status:</strong> Payment status will update automatically when payment is completed</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-100">
            Integration ID: {import.meta.env.VITE_PAYNOW_INTEGRATION_ID || "21044"}
          </p>
        </div>
      </div>
    </div>
  );
}
