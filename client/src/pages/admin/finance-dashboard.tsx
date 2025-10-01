import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { AdminHeader } from "@/components/AdminHeader";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { 
  DollarSign, TrendingUp, TrendingDown, Calendar,
  CreditCard, Download, Search, Filter, Eye, FileText, RefreshCw, BarChart3, Receipt
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { Payment } from "@shared/schema";

interface FinanceStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  membershipFees: number;
  applicationFees: number;
  eventFees: number;
  renewalFees: number;
}

export default function FinanceDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    setLocation("/auth");
    return null;
  }

  // Show loading while checking authentication
  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  const { data: financeStats = {} as FinanceStats, isLoading: statsLoading } = useQuery<FinanceStats>({
    queryKey: ["/api/admin/finance/stats"],
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
  });

  const { data: recentTransactions = [] } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments/recent"],
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchQuery || 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesType = typeFilter === "all" || payment.purpose === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100); // Assuming amounts are stored in cents
  };

  const exportFinanceData = () => {
    const csvContent = [
      ["Payment ID", "Type", "Amount", "Status", "Date", "Description"].join(","),
      ...filteredPayments.map(payment => [
        payment.id,
        payment.purpose,
        payment.amount,
        payment.status,
        payment.createdAt ? new Date(payment.createdAt).toISOString().split('T')[0] : "",
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
              <p className="text-sm text-muted-foreground mt-1">Streamline your financial operations</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button
              onClick={() => toast({ title: "Feature Coming Soon", description: "Manual payment recording will be available soon." })}
              className="group relative h-32 rounded-3xl bg-gradient-to-br from-emerald-400 via-emerald-300 to-teal-300 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 border-0 shadow-lg hover:shadow-xl hover:shadow-emerald-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
              data-testid="button-record-payment"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/10 to-transparent" />
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <DollarSign className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Record Payment</span>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
            </Button>

            <Button
              onClick={exportFinanceData}
              className="group relative h-32 rounded-3xl bg-gradient-to-br from-blue-400 via-blue-300 to-sky-300 hover:from-blue-500 hover:via-blue-400 hover:to-sky-400 border-0 shadow-lg hover:shadow-xl hover:shadow-blue-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
              data-testid="button-export-data"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent" />
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Download className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Export Data</span>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
            </Button>

            <Button
              onClick={() => toast({ title: "Feature Coming Soon", description: "Financial reports will be available soon." })}
              className="group relative h-32 rounded-3xl bg-gradient-to-br from-purple-400 via-purple-300 to-pink-300 hover:from-purple-500 hover:via-purple-400 hover:to-pink-400 border-0 shadow-lg hover:shadow-xl hover:shadow-purple-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
              data-testid="button-generate-reports"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent" />
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Generate Reports</span>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
            </Button>

            <Button
              onClick={() => setLocation("/admin-dashboard/renewals")}
              className="group relative h-32 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-300 hover:from-amber-500 hover:via-orange-400 hover:to-yellow-400 border-0 shadow-lg hover:shadow-xl hover:shadow-amber-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
              data-testid="button-renewal-fees"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 to-transparent" />
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <RefreshCw className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Renewal Fees</span>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
            </Button>

            <Button
              onClick={() => toast({ title: "Feature Coming Soon", description: "Invoice generation will be available soon." })}
              className="group relative h-32 rounded-3xl bg-gradient-to-br from-violet-400 via-violet-300 to-fuchsia-300 hover:from-violet-500 hover:via-violet-400 hover:to-fuchsia-400 border-0 shadow-lg hover:shadow-xl hover:shadow-violet-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
              data-testid="button-create-invoice"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-violet-600/10 to-transparent" />
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Receipt className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Create Invoice</span>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
            </Button>

            <Button
              onClick={() => toast({ title: "Feature Coming Soon", description: "Payment reminders will be available soon." })}
              className="group relative h-32 rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-300 to-blue-300 hover:from-cyan-500 hover:via-sky-400 hover:to-blue-400 border-0 shadow-lg hover:shadow-xl hover:shadow-cyan-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
              data-testid="button-payment-reminders"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/10 to-transparent" />
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Payment Reminders</span>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
            </Button>
          </div>
        </div>

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
            data-testid="stat-total-revenue"
          />
          
          <StatsCard
            icon={TrendingUp}
            title="Monthly Revenue"
            value={formatCurrency(financeStats.monthlyRevenue || 0)}
            trend="↗ 15%"
            trendText="this month"
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
            data-testid="stat-monthly-revenue"
          />
          
          <StatsCard
            icon={CreditCard}
            title="Pending Payments"
            value={financeStats.pendingPayments?.toString() || "0"}
            trend="3 urgent"
            trendText="require attention"
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
            data-testid="stat-pending-payments"
          />
          
          <StatsCard
            icon={Calendar}
            title="Completed Today"
            value={financeStats.completedPayments?.toString() || "0"}
            trend="↗ 12%"
            trendText="vs yesterday"
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
            data-testid="stat-completed-payments"
          />
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Membership Fees</span>
                  <span className="font-semibold">{formatCurrency(financeStats.membershipFees || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Application Fees</span>
                  <span className="font-semibold">{formatCurrency(financeStats.applicationFees || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Event Fees</span>
                  <span className="font-semibold">{formatCurrency(financeStats.eventFees || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Renewal Fees</span>
                  <span className="font-semibold">{formatCurrency(financeStats.renewalFees || 0)}</span>
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
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{formatCurrency(parseFloat(transaction.amount))}</p>
                      <p className="text-sm text-gray-600">{transaction.purpose || 'N/A'}</p>
                    </div>
                    <Badge className={getStatusColor(transaction.status || '')}>
                      {transaction.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Management
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-payments"
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

                <Button 
                  variant="outline" 
                  onClick={exportFinanceData}
                  disabled={filteredPayments.length === 0}
                  data-testid="button-export-finance"
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
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.description || "Payment"}</p>
                        <p className="text-sm text-gray-600">
                          {(payment.purpose || 'general').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} •
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(parseFloat(payment.amount))}</p>
                        <Badge className={getStatusColor(payment.status || '')}>
                          {payment.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" data-testid={`button-view-${payment.id}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Payments Found</h3>
                <p className="text-gray-500">No payments match your current filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}