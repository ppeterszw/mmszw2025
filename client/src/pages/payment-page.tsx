import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Banknote, ArrowLeft } from "lucide-react";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { useLocation } from "wouter";

const paymentMethods = [
  {
    id: "paynow",
    name: "Paynow",
    description: "Pay using EcoCash, OneMoney, or Bank Transfer",
    icon: Smartphone,
    badges: ["Mobile Money", "Bank Transfer"],
    available: true,
  },
  {
    id: "stripe",
    name: "Credit/Debit Card",
    description: "Pay securely with Visa, Mastercard, or American Express",
    icon: CreditCard,
    badges: ["Visa", "Mastercard", "Amex"],
    available: true,
  },
  {
    id: "cash",
    name: "Cash Payment",
    description: "Pay in person at our offices",
    icon: Banknote,
    badges: ["In Person"],
    available: true,
  },
];

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [, setLocation] = useLocation();

  const paymentSummary = {
    membershipFee: 150.00,
    applicationFee: 25.00,
    processingFee: 5.00,
    totalAmount: 180.00,
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      return;
    }

    switch (selectedMethod) {
      case "paynow":
        // Integrate with Paynow using provided credentials
        // Integration ID: 21044, Key: b1f1b8fb-0ae5-47f4-aa6e-0f250c38fa64
        window.open("https://www.paynow.co.zw/payment/erpnext-usd", "_blank");
        break;
      case "stripe":
        // Redirect to Stripe checkout
        setLocation("/payment/stripe");
        break;
      case "cash":
        // Show cash payment instructions
        setLocation("/payment/cash-instructions");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FormHeader 
        title="Payment"
        subtitle="Complete your membership payment"
      />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLocation("/member-portal")}
            className="mr-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Payment Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Annual Membership Fee</span>
                <span className="font-medium text-card-foreground" data-testid="fee-membership">
                  ${paymentSummary.membershipFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application Fee</span>
                <span className="font-medium text-card-foreground" data-testid="fee-application">
                  ${paymentSummary.applicationFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium text-card-foreground" data-testid="fee-processing">
                  ${paymentSummary.processingFee.toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-card-foreground">Total Amount</span>
                <span className="text-lg font-bold text-egyptian-blue" data-testid="total-amount">
                  ${paymentSummary.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="relative">
                    <Label
                      htmlFor={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMethod === method.id 
                          ? 'border-egyptian-blue bg-egyptian-blue/5' 
                          : 'border-border hover:border-egyptian-blue/50'
                      }`}
                      data-testid={`payment-method-${method.id}`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} className="mr-4" />
                      <method.icon className="w-5 h-5 mr-3 text-egyptian-blue" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-card-foreground">{method.name}</span>
                          <div className="flex space-x-2">
                            {method.badges.map((badge, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            
            <div className="mt-8 flex space-x-4">
              <Button 
                type="button" 
                variant="outline"
                className="flex-1"
                onClick={() => setLocation("/member-portal")}
                data-testid="button-cancel-payment"
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                className="flex-1 gradient-button text-white border-0"
                onClick={handlePayment}
                disabled={!selectedMethod}
                data-testid="button-proceed-payment"
              >
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <FormFooter />
    </div>
  );
}
