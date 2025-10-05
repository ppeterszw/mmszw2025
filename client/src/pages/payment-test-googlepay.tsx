/**
 * Google Pay Payment Test Page
 * Test page for Google Pay payment integration
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GooglePayButton } from "@/components/GooglePayButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GooglePayTestPage() {
  const [amount, setAmount] = useState("100.00");
  const [purpose, setPurpose] = useState("membership");
  const [description, setDescription] = useState("Membership Fee Payment");
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    paymentId?: string;
    transactionId?: string;
    error?: string;
  } | null>(null);

  const handlePaymentSuccess = (paymentId: string, transactionId: string) => {
    setPaymentResult({
      success: true,
      paymentId,
      transactionId
    });
  };

  const handlePaymentError = (error: string) => {
    setPaymentResult({
      success: false,
      error
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Google Pay Payment Test</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Configure your test payment parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Payment Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger id="purpose">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="membership">Membership Fee</SelectItem>
                  <SelectItem value="application">Application Fee</SelectItem>
                  <SelectItem value="renewal">Renewal Fee</SelectItem>
                  <SelectItem value="event">Event Registration</SelectItem>
                  <SelectItem value="fine">Fine Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter payment description"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pay with Google Pay</CardTitle>
            <CardDescription>
              Click the button below to process payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GooglePayButton
              amount={amount}
              currency="USD"
              description={description}
              purpose={purpose}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </CardContent>
        </Card>

        {paymentResult && (
          <Card className={paymentResult.success ? "border-green-500" : "border-red-500"}>
            <CardHeader>
              <CardTitle className={paymentResult.success ? "text-green-600" : "text-red-600"}>
                {paymentResult.success ? "Payment Successful" : "Payment Failed"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentResult.success ? (
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Payment ID:</strong> {paymentResult.paymentId}
                  </p>
                  <p className="text-sm">
                    <strong>Transaction ID:</strong> {paymentResult.transactionId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Payment has been recorded successfully in the database
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-red-600">
                    <strong>Error:</strong> {paymentResult.error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-sm">Developer Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>Current Implementation:</strong> Demo mode with simulated tokens
            </p>
            <p>
              <strong>Production Setup Required:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Register with Google Pay API</li>
              <li>Configure merchant ID</li>
              <li>Set up payment gateway integration (Stripe recommended)</li>
              <li>Add Google Pay button script to index.html</li>
              <li>Implement proper token decryption in backend</li>
              <li>Add environment variables for API credentials</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
