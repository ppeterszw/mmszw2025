import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AdminHeader } from "@/components/AdminHeader";
import {
  DollarSign, TrendingUp, TrendingDown, Users, CreditCard,
  Calendar, Download, Filter, Search, AlertCircle, CheckCircle,
  Clock, ArrowUpRight, ArrowDownRight, PieChart, BarChart3,
  Wallet, Receipt, RefreshCw, FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FinancialMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  failedPayments: number;
  revenueGrowth: number;
  averageTransactionValue: number;
  totalTransactions: number;
}

interface RevenueBreakdown {
  membership: number;
  renewals: number;
  applications: number;
  events: number;
  fines: number;
  other: number;
}

interface PaymentMethodStats {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export default function EnhancedFinanceDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("thisMonth");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock financial data
  const mockMetrics: FinancialMetrics = {
    totalRevenue: 125450.00,
    monthlyRevenue: 28300.00,
    pendingPayments: 12,
    completedPayments: 234,
    failedPayments: 8,
    revenueGrowth: 15.3,
    averageTransactionValue: 425.50,
    totalTransactions: 254
  };

  const mockRevenueBreakdown: RevenueBreakdown = {
    membership: 65000,
    renewals: 35000,
    applications: 15000,
    events: 7450,
    fines: 2000,
    other: 1000
  };

  const mockPaymentMethods: PaymentMethodStats[] = [
    { method: "PayNow EcoCash", count: 142, amount: 72500, percentage: 57.8 },
    { method: "PayNow OneMoney", count: 48, amount: 24600, percentage: 19.6 },
    { method: "Bank Transfer", count: 35, amount: 18200, percentage: 14.5 },
    { method: "Cash", count: 18, amount: 8150, percentage: 6.5 },
    { method: "Card", count: 11, amount: 2000, percentage: 1.6 }
  ];

  const { data: metrics = mockMetrics } = useQuery<FinancialMetrics>({
    queryKey: ["/api/finance/metrics", dateRange],
    enabled: !!user,
  });

  const { data: revenueBreakdown = mockRevenueBreakdown } = useQuery<RevenueBreakdown>({
    queryKey: ["/api/finance/revenue-breakdown", dateRange],
    enabled: !!user,
  });

  const { data: paymentMethodStats = mockPaymentMethods } = useQuery<PaymentMethodStats[]>({
    queryKey: ["/api/finance/payment-methods", dateRange],
    enabled: !!user,
  });

  const { data: recentTransactions = [] } = useQuery<any[]>({
    queryKey: ["/api/payments/recent", dateRange],
    enabled: !!user,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const exportReport = (type: string) => {
    toast({
      title: "Exporting Report",
      description: `Generating ${type} report...`,
    });
    // TODO: Implement actual export functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentPage="finance" title="Finance Dashboard" subtitle="Comprehensive financial analytics and reporting" />

      <div className="p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Finance Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive financial analytics and reporting</p>
          </div>
          <div className="flex space-x-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisQuarter">This Quarter</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => exportReport('comprehensive')}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+{metrics.revenueGrowth}% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-green-100 text-sm mb-1">This Month</p>
                  <p className="text-3xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-1" />
                <span>{metrics.totalTransactions} transactions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Pending Payments</p>
                  <p className="text-3xl font-bold">{metrics.pendingPayments}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Requires attention</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Avg Transaction</p>
                  <p className="text-3xl font-bold">{formatCurrency(metrics.averageTransactionValue)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>{metrics.completedPayments} completed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Revenue Breakdown
              </CardTitle>
              <CardDescription>Revenue distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(revenueBreakdown).map(([category, amount]) => {
                  const percentage = (amount / metrics.totalRevenue) * 100;
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium capitalize">{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Methods
              </CardTitle>
              <CardDescription>Popular payment options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodStats.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{method.method}</div>
                      <div className="text-xs text-muted-foreground">{method.count} transactions</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(method.amount)}</div>
                      <div className="text-xs text-muted-foreground">{method.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Transaction Analysis
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => exportReport('transactions')}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Completed</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-900">{metrics.completedPayments}</div>
                    <div className="text-xs text-green-700 mt-1">92.1% success rate</div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-800">Pending</span>
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">{metrics.pendingPayments}</div>
                    <div className="text-xs text-yellow-700 mt-1">Awaiting confirmation</div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-800">Failed</span>
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-900">{metrics.failedPayments}</div>
                    <div className="text-xs text-red-700 mt-1">3.1% failure rate</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-muted-foreground">Revenue trends chart</p>
                    <p className="text-sm text-muted-foreground">Chart visualization would go here</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comparisons" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Month-over-Month</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</span>
                      <Badge className="bg-green-100 text-green-800">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{metrics.revenueGrowth}%
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Year-over-Year</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</span>
                      <Badge className="bg-green-100 text-green-800">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +23.5%
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
              <p className="text-sm text-muted-foreground mt-1">Common financial operations and shortcuts</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button className="group relative h-32 rounded-3xl bg-gradient-to-br from-emerald-400 via-emerald-300 to-teal-300 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 border-0 shadow-lg hover:shadow-xl hover:shadow-emerald-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/10 to-transparent" />
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Receipt className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Generate Invoice</span>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
            </Button>

            <Button className="group relative h-32 rounded-3xl bg-gradient-to-br from-blue-400 via-blue-300 to-sky-300 hover:from-blue-500 hover:via-blue-400 hover:to-sky-400 border-0 shadow-lg hover:shadow-xl hover:shadow-blue-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent" />
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <FileText className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Financial Report</span>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
            </Button>

            <Button className="group relative h-32 rounded-3xl bg-gradient-to-br from-violet-400 via-violet-300 to-fuchsia-300 hover:from-violet-500 hover:via-violet-400 hover:to-fuchsia-400 border-0 shadow-lg hover:shadow-xl hover:shadow-violet-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-violet-600/10 to-transparent" />
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <RefreshCw className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Process Refund</span>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
            </Button>

            <Button className="group relative h-32 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-300 hover:from-amber-500 hover:via-orange-400 hover:to-yellow-400 border-0 shadow-lg hover:shadow-xl hover:shadow-amber-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 to-transparent" />
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Wallet className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Reconciliation</span>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
