import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemberHeader } from "@/components/MemberHeader";
import {
  CreditCard, Calendar, CheckCircle, AlertTriangle,
  Clock, Receipt, DollarSign, TrendingUp, Shield,
  ArrowRight, Download, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";

interface Subscription {
  id: string;
  planName: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  autoRenew: boolean;
  paymentMethod: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  date: Date;
  purpose: string;
  paymentMethod: string;
  referenceNumber: string;
}

export default function MemberSubscriptions() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Mock subscription data
  const mockSubscription: Subscription = {
    id: "sub-1",
    planName: "Professional Member - Annual",
    status: 'active',
    amount: 500,
    currency: "USD",
    billingCycle: 'annual',
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    nextBillingDate: new Date("2025-01-01"),
    autoRenew: true,
    paymentMethod: "PayNow EcoCash"
  };

  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["/api/members/subscription"],
    enabled: !!user,
    initialData: mockSubscription
  });

  const { data: upcomingPayments = [] } = useQuery({
    queryKey: ["/api/payments/upcoming"],
    enabled: !!user,
  });

  const updateAutoRenewMutation = useMutation({
    mutationFn: async (autoRenew: boolean) => {
      const response = await fetch("/api/members/subscription/auto-renew", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoRenew }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update auto-renew");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members/subscription"] });
      toast({
        title: "Success",
        description: "Auto-renew settings updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update auto-renew settings.",
        variant: "destructive",
      });
    },
  });

  const renewSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: subscription?.amount || 500,
          purpose: "renewal",
          paymentMethod: "paynow_ecocash",
        }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to initiate renewal");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.paynow?.redirectUrl) {
        window.location.href = data.paynow.redirectUrl;
      } else {
        toast({
          title: "Success",
          description: "Renewal payment initiated. Check your phone for payment prompt.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initiate renewal payment.",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Expired</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const daysUntilExpiry = subscription ? Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader currentPage="subscriptions" />

      <div className="p-6">
        <main className="w-full max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Membership & Subscriptions</h1>
            <p className="text-muted-foreground">Manage your membership plan, payments, and renewals</p>
          </div>

          {/* Current Subscription Card */}
          <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{subscription?.planName}</h2>
                  <div className="flex items-center space-x-2">
                    {subscription && getStatusBadge(subscription.status)}
                    <span className="text-sm opacity-90">
                      {subscription?.billingCycle === 'annual' ? 'Billed Annually' :
                       subscription?.billingCycle === 'monthly' ? 'Billed Monthly' : 'Billed Quarterly'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">${subscription?.amount}</div>
                  <div className="text-sm opacity-90">per {subscription?.billingCycle === 'annual' ? 'year' : subscription?.billingCycle === 'monthly' ? 'month' : 'quarter'}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Next Billing</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {subscription?.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Days Remaining</span>
                  </div>
                  <div className="text-lg font-semibold">{daysUntilExpiry} days</div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium">Payment Method</span>
                  </div>
                  <div className="text-lg font-semibold">{subscription?.paymentMethod}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Auto-Renew: {subscription?.autoRenew ? 'On' : 'Off'}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    onClick={() => updateAutoRenewMutation.mutate(!subscription?.autoRenew)}
                  >
                    {subscription?.autoRenew ? 'Turn Off' : 'Turn On'} Auto-Renew
                  </Button>
                  {daysUntilExpiry < 60 && (
                    <Button
                      size="sm"
                      className="bg-white text-blue-600 hover:bg-white/90"
                      onClick={() => renewSubscriptionMutation.mutate()}
                    >
                      Renew Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                  Total Paid This Year
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${subscription?.amount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">100% of subscription</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                  Member Since
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {subscription?.startDate ? new Date(subscription.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Active member</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-purple-600" />
                  Coverage Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Protected</div>
                <p className="text-xs text-muted-foreground mt-1">Full benefits active</p>
              </CardContent>
            </Card>
          </div>

          {/* Available Plans */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Available Membership Plans</CardTitle>
              <CardDescription>Choose the plan that best fits your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Monthly Plan */}
                <Card className="border-2 hover:border-blue-500 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Plan</CardTitle>
                    <CardDescription>Perfect for short-term needs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$50<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        All basic features
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        CPD tracking
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Event access
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline">Select Plan</Button>
                  </CardContent>
                </Card>

                {/* Quarterly Plan */}
                <Card className="border-2 hover:border-blue-500 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">Quarterly Plan</CardTitle>
                    <CardDescription>Save 10% with quarterly billing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$135<span className="text-sm font-normal text-muted-foreground">/quarter</span></div>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        All monthly features
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Priority support
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        10% savings
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline">Select Plan</Button>
                  </CardContent>
                </Card>

                {/* Annual Plan - Popular */}
                <Card className="border-2 border-blue-500 bg-blue-50 relative">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-semibold rounded-bl">
                    MOST POPULAR
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Annual Plan</CardTitle>
                    <CardDescription>Best value - Save 20%</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$500<span className="text-sm font-normal text-muted-foreground">/year</span></div>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        All quarterly features
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Premium support
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        20% savings
                      </li>
                      <li className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Exclusive benefits
                      </li>
                    </ul>
                    <Button className="w-full gradient-button text-white border-0">Current Plan</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">EcoCash</div>
                      <div className="text-sm text-muted-foreground">+263 77 123 4567</div>
                    </div>
                  </div>
                  <Badge>Primary</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">OneMoney</div>
                      <div className="text-sm text-muted-foreground">Not connected</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <Button variant="outline" className="w-full">
                  + Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
