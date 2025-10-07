import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { AdminHeader } from "@/components/AdminHeader";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { ModernModal } from "@/components/ui/modern-modal";
import { QuickActions } from "@/components/QuickActions";
import {
  DollarSign, TrendingUp, TrendingDown, Calendar,
  CreditCard, Download, Search, Filter, Eye, FileText, RefreshCw, BarChart3, Receipt,
  Check, X, Clock, AlertCircle, Edit, Plus, UserCheck, Building2
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Payment, Member, Organization } from "@shared/schema";

interface FinanceStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  membershipFees: number;
  applicationFees: number;
  eventFees: number;
  renewalFees: number;
  revenueByMethod: { method: string; amount: number }[];
}

interface PaymentWithDetails extends Payment {
  member?: Member;
  organization?: Organization;
  reference?: string; // Alias for referenceNumber
  paidAt?: Date | null; // Alias for paymentDate
}

export default function FinanceDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null);
  const [paymentDetailsModalOpen, setPaymentDetailsModalOpen] = useState(false);
  const [recordPaymentModalOpen, setRecordPaymentModalOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [paymentForm, setPaymentForm] = useState({
    memberId: "",
    organizationId: "",
    amount: "",
    purpose: "membership_fee",
    paymentMethod: "cash",
    reference: "",
    description: "",
    paidAt: new Date().toISOString().split('T')[0]
  });

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    setLocation("/auth");
    return null;
  }

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  const { data: financeStats = {} as FinanceStats, isLoading: statsLoading } = useQuery<FinanceStats>({
    queryKey: ["/api/admin/finance/stats"],
  });

  const { data: payments = [], isLoading: paymentsLoading, refetch } = useQuery<PaymentWithDetails[]>({
    queryKey: ["/api/admin/payments"],
  });

  const { data: recentTransactions = [] } = useQuery<PaymentWithDetails[]>({
    queryKey: ["/api/admin/payments/recent"],
  });

  // Update payment status mutation
  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PUT", `/api/admin/payments/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/finance/stats"] });
      toast({
        title: "Success",
        description: "Payment status updated successfully"
      });
      setPaymentDetailsModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment status",
        variant: "destructive"
      });
    }
  });

  // Record manual payment mutation
  const recordPaymentMutation = useMutation({
    mutationFn: async (data: typeof paymentForm) => {
      return apiRequest("POST", "/api/admin/payments/record", {
        ...data,
        amount: parseFloat(data.amount) * 100, // Convert to cents
        status: "completed"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/finance/stats"] });
      toast({
        title: "Success",
        description: "Payment recorded successfully"
      });
      setRecordPaymentModalOpen(false);
      setPaymentForm({
        memberId: "",
        organizationId: "",
        amount: "",
        purpose: "membership_fee",
        paymentMethod: "cash",
        reference: "",
        description: "",
        paidAt: new Date().toISOString().split('T')[0]
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record payment",
        variant: "destructive"
      });
    }
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchQuery ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesType = typeFilter === "all" || payment.purpose === typeFilter;
    const matchesMethod = methodFilter === "all" || payment.paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesType && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "failed":
        return <X className="w-3 h-3" />;
      case "cancelled":
        return <X className="w-3 h-3" />;
      case "processing":
        return <RefreshCw className="w-3 h-3 animate-spin" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  const exportFinanceData = () => {
    const csvContent = [
      ["Payment ID", "Reference", "Type", "Method", "Amount", "Status", "Date", "Payer", "Description"].join(","),
      ...filteredPayments.map(payment => [
        payment.id,
        payment.reference || "",
        payment.purpose || "",
        payment.paymentMethod || "",
        payment.amount,
        payment.status || "",
        payment.createdAt ? new Date(payment.createdAt).toISOString().split('T')[0] : "",
        payment.member ? `${payment.member.firstName} ${payment.member.lastName}` :
        payment.organization ? payment.organization.name : "",
        `"${payment.description || ""}"`
      ].join(","))
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eacz-finance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const viewPaymentDetails = (payment: PaymentWithDetails) => {
    setSelectedPayment(payment);
    setPaymentDetailsModalOpen(true);
  };

  const handleRecordPayment = () => {
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    recordPaymentMutation.mutate(paymentForm);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentPage="finance" />

      <div className="p-6">
        <PageBreadcrumb items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "Finance Dashboard" }
        ]} className="mb-6" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Finance Dashboard</h1>
          <p className="text-muted-foreground">Monitor payments, revenue, and financial performance</p>
        </div>

        {/* Quick Actions */}
        <QuickActions
          title="Quick Actions"
          description="Streamline your financial operations"
          actions={[
            {
              icon: Plus,
              label: "Record Payment",
              action: () => setRecordPaymentModalOpen(true),
              color: "text-emerald-600",
              bg: "bg-emerald-100",
              testId: "button-record-payment"
            },
            {
              icon: Download,
              label: "Export Data",
              action: exportFinanceData,
              color: "text-blue-600",
              bg: "bg-blue-100",
              testId: "button-export-data"
            },
            {
              icon: BarChart3,
              label: "Generate Reports",
              action: () => toast({ title: "Feature Coming Soon", description: "Financial reports will be available soon." }),
              color: "text-purple-600",
              bg: "bg-purple-100",
              testId: "button-generate-reports"
            },
            {
              icon: RefreshCw,
              label: "Renewal Fees",
              action: () => setLocation("/admin/renewals"),
              color: "text-amber-600",
              bg: "bg-amber-100",
              testId: "button-renewal-fees"
            },
            {
              icon: Receipt,
              label: "Create Invoice",
              action: () => toast({ title: "Feature Coming Soon", description: "Invoice generation will be available soon." }),
              color: "text-violet-600",
              bg: "bg-violet-100",
              testId: "button-create-invoice"
            },
            {
              icon: RefreshCw,
              label: "Refresh Data",
              action: () => refetch(),
              color: "text-cyan-600",
              bg: "bg-cyan-100",
              testId: "button-refresh-data"
            }
          ]}
        />

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={DollarSign}
            title="Total Revenue"
            value={formatCurrency(financeStats.totalRevenue || 0)}
            trend="↗ 8%"
            trendText="from last month"
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />

          <StatsCard
            icon={TrendingUp}
            title="Monthly Revenue"
            value={formatCurrency(financeStats.monthlyRevenue || 0)}
            trend="↗ 15%"
            trendText="this month"
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />

          <StatsCard
            icon={CreditCard}
            title="Pending Payments"
            value={financeStats.pendingPayments?.toString() || "0"}
            trend="3 urgent"
            trendText="require attention"
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
          />

          <StatsCard
            icon={Calendar}
            title="Completed Today"
            value={financeStats.completedPayments?.toString() || "0"}
            trend="↗ 12%"
            trendText="vs yesterday"
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">All Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Membership Fees</span>
                      <span className="font-semibold text-green-700">{formatCurrency(financeStats.membershipFees || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Application Fees</span>
                      <span className="font-semibold text-blue-700">{formatCurrency(financeStats.applicationFees || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Event Fees</span>
                      <span className="font-semibold text-purple-700">{formatCurrency(financeStats.eventFees || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium">Renewal Fees</span>
                      <span className="font-semibold text-orange-700">{formatCurrency(financeStats.renewalFees || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => viewPaymentDetails(transaction)}>
                        <div className="flex-1">
                          <p className="font-medium">{formatCurrency(parseFloat(transaction.amount))}</p>
                          <p className="text-sm text-gray-600">{transaction.purpose?.replace(/_/g, ' ') || 'N/A'} • {transaction.paymentMethod?.replace(/_/g, ' ')}</p>
                        </div>
                        <Badge className={`${getStatusColor(transaction.status || '')} flex items-center gap-1`}>
                          {getStatusIcon(transaction.status || '')}
                          {transaction.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* All Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Management
                    </CardTitle>
                    <CardDescription className="mt-2">
                      View and manage all payments ({filteredPayments.length} of {payments.length})
                    </CardDescription>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search payments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="membership_fee">Membership</SelectItem>
                        <SelectItem value="application_fee">Application</SelectItem>
                        <SelectItem value="event_fee">Event</SelectItem>
                        <SelectItem value="renewal_fee">Renewal</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={methodFilter} onValueChange={setMethodFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="paynow_ecocash">PayNow Ecocash</SelectItem>
                        <SelectItem value="paynow_onemoney">PayNow OneMoney</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="stripe_card">Card</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={exportFinanceData}
                      disabled={filteredPayments.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="text-center py-8">Loading payments...</div>
                ) : filteredPayments.length > 0 ? (
                  <div className="space-y-2">
                    {filteredPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => viewPaymentDetails(payment)}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{payment.description || payment.purpose?.replace(/_/g, ' ')}</p>
                              {payment.reference && (
                                <Badge variant="outline" className="text-xs">#{payment.reference}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {payment.member ? `${payment.member.firstName} ${payment.member.lastName}` :
                               payment.organization ? payment.organization.name : 'N/A'} •
                              {payment.paymentMethod?.replace(/_/g, ' ')} •
                              {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 flex-shrink-0">
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(parseFloat(payment.amount))}</p>
                            <Badge className={`${getStatusColor(payment.status || '')} flex items-center gap-1 mt-1`}>
                              {getStatusIcon(payment.status || '')}
                              {payment.status}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); viewPaymentDetails(payment); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Payments Found</h3>
                    <p className="text-gray-500 mb-4">No payments match your current filters.</p>
                    <Button onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setTypeFilter("all");
                      setMethodFilter("all");
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Payment Analytics</CardTitle>
                <CardDescription>Detailed financial insights and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytics Dashboard Coming Soon</h3>
                  <p className="text-gray-500">Advanced analytics and reporting features will be available here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <ModernModal
          open={paymentDetailsModalOpen}
          onOpenChange={setPaymentDetailsModalOpen}
          title="Payment Details"
          subtitle={`Payment ID: ${selectedPayment.id}`}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-muted-foreground">Amount</Label>
                <p className="text-2xl font-bold">{formatCurrency(parseFloat(selectedPayment.amount))}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge className={`${getStatusColor(selectedPayment.status || '')} flex items-center gap-1 w-fit mt-1`}>
                  {getStatusIcon(selectedPayment.status || '')}
                  {selectedPayment.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Payment Method</Label>
                <p className="font-medium mt-1">{selectedPayment.paymentMethod?.replace(/_/g, ' ') || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Reference</Label>
                <p className="font-medium mt-1">{selectedPayment.reference || 'N/A'}</p>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Purpose</Label>
              <p className="font-medium mt-1">{selectedPayment.purpose?.replace(/_/g, ' ') || 'N/A'}</p>
            </div>

            {selectedPayment.description && (
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1">{selectedPayment.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Created</Label>
                <p className="mt-1">{selectedPayment.createdAt ? new Date(selectedPayment.createdAt).toLocaleString() : 'N/A'}</p>
              </div>
              {selectedPayment.paidAt && (
                <div>
                  <Label className="text-muted-foreground">Paid At</Label>
                  <p className="mt-1">{new Date(selectedPayment.paidAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {selectedPayment.member && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Member
                </Label>
                <p className="font-medium mt-1">
                  {selectedPayment.member.firstName} {selectedPayment.member.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{selectedPayment.member.email}</p>
              </div>
            )}

            {selectedPayment.organization && (
              <div className="p-4 bg-green-50 rounded-lg">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Organization
                </Label>
                <p className="font-medium mt-1">{selectedPayment.organization.name}</p>
                <p className="text-sm text-muted-foreground">{selectedPayment.organization.email}</p>
              </div>
            )}

            {selectedPayment.status === 'pending' && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => updatePaymentStatusMutation.mutate({ id: selectedPayment.id, status: 'completed' })}
                  disabled={updatePaymentStatusMutation.isPending}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => updatePaymentStatusMutation.mutate({ id: selectedPayment.id, status: 'failed' })}
                  disabled={updatePaymentStatusMutation.isPending}
                >
                  <X className="w-4 h-4 mr-2" />
                  Mark as Failed
                </Button>
              </div>
            )}
          </div>
        </ModernModal>
      )}

      {/* Record Payment Modal */}
      <ModernModal
        open={recordPaymentModalOpen}
        onOpenChange={setRecordPaymentModalOpen}
        title="Record Manual Payment"
        subtitle="Record a payment that was made offline"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (USD) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="100.00"
              />
            </div>
            <div>
              <Label htmlFor="paidAt">Payment Date *</Label>
              <Input
                id="paidAt"
                type="date"
                value={paymentForm.paidAt}
                onChange={(e) => setPaymentForm({ ...paymentForm, paidAt: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purpose">Payment Type *</Label>
              <Select value={paymentForm.purpose} onValueChange={(value) => setPaymentForm({ ...paymentForm, purpose: value })}>
                <SelectTrigger id="purpose">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="membership_fee">Membership Fee</SelectItem>
                  <SelectItem value="application_fee">Application Fee</SelectItem>
                  <SelectItem value="event_fee">Event Fee</SelectItem>
                  <SelectItem value="renewal_fee">Renewal Fee</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select value={paymentForm.paymentMethod} onValueChange={(value) => setPaymentForm({ ...paymentForm, paymentMethod: value })}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="paynow_ecocash">PayNow Ecocash</SelectItem>
                  <SelectItem value="paynow_onemoney">PayNow OneMoney</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="reference">Reference Number</Label>
            <Input
              id="reference"
              value={paymentForm.reference}
              onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
              placeholder="e.g., CHQ123456, TXN789012"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={paymentForm.description}
              onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
              placeholder="Additional payment details..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setRecordPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} disabled={recordPaymentMutation.isPending}>
              {recordPaymentMutation.isPending ? "Recording..." : "Record Payment"}
            </Button>
          </div>
        </div>
      </ModernModal>
    </div>
  );
}
