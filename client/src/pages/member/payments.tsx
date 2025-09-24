import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberHeader } from "@/components/MemberHeader";
import { 
  CreditCard, Download, Search, Filter, Calendar,
  User, FileText, Building2, CheckCircle, XCircle,
  AlertCircle, DollarSign, Receipt, Clock
} from "lucide-react";
import { useLocation } from "wouter";

export default function MemberPayments() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Mock payments data
  const mockPayments = [
    {
      id: "PAY-2024-001",
      description: "Annual Membership Fee 2024",
      amount: 500,
      currency: "USD",
      status: "completed",
      type: "membership",
      paymentMethod: "Stripe",
      date: "2024-01-15",
      receiptUrl: "/receipts/PAY-2024-001.pdf",
      transactionId: "txn_1234567890"
    },
    {
      id: "PAY-2024-002", 
      description: "Real Estate Conference Registration",
      amount: 150,
      currency: "USD",
      status: "completed",
      type: "event",
      paymentMethod: "PayNow",
      date: "2024-01-20",
      receiptUrl: "/receipts/PAY-2024-002.pdf",
      transactionId: "pn_9876543210"
    },
    {
      id: "PAY-2024-003",
      description: "Property Investment Workshop",
      amount: 75,
      currency: "USD", 
      status: "pending",
      type: "training",
      paymentMethod: "Stripe",
      date: "2024-02-05",
      receiptUrl: null,
      transactionId: "txn_pending123"
    },
    {
      id: "PAY-2024-004",
      description: "Certificate Replacement Fee",
      amount: 25,
      currency: "USD",
      status: "failed",
      type: "certificate",
      paymentMethod: "PayNow", 
      date: "2024-01-30",
      receiptUrl: null,
      transactionId: "pn_failed456"
    },
    {
      id: "PAY-2023-012",
      description: "Annual Membership Fee 2023",
      amount: 450,
      currency: "USD",
      status: "completed",
      type: "membership",
      paymentMethod: "Cash",
      date: "2023-12-15",
      receiptUrl: "/receipts/PAY-2023-012.pdf",
      transactionId: "cash_202312"
    }
  ];

  const { data: payments = mockPayments, isLoading } = useQuery({
    queryKey: ["/api/members/payments"],
    enabled: !!user
  }) as { data: typeof mockPayments; isLoading: boolean };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "refunded":
        return <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "stripe":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "paynow":
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case "cash":
        return <Receipt className="w-4 h-4 text-gray-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesType = filterType === "all" || payment.type === filterType;
    
    if (dateRange === "thisYear") {
      const paymentYear = new Date(payment.date).getFullYear();
      const currentYear = new Date().getFullYear();
      return matchesSearch && matchesStatus && matchesType && paymentYear === currentYear;
    } else if (dateRange === "lastYear") {
      const paymentYear = new Date(payment.date).getFullYear();
      const lastYear = new Date().getFullYear() - 1;
      return matchesSearch && matchesStatus && matchesType && paymentYear === lastYear;
    }
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate totals
  const totalAmount = filteredPayments.reduce((sum, payment) => {
    return payment.status === "completed" ? sum + payment.amount : sum;
  }, 0);

  const completedPayments = filteredPayments.filter(p => p.status === "completed").length;
  const pendingPayments = filteredPayments.filter(p => p.status === "pending").length;
  const failedPayments = filteredPayments.filter(p => p.status === "failed").length;


  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <MemberHeader currentPage="payments" title="EACZ Member Portal" subtitle="View and manage your payment records" />
        <div className="p-6">

        <div className="max-w-6xl mx-auto space-y-6">
            {/* Payment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Paid</p>
                      <p className="text-2xl font-bold">${totalAmount}</p>
                    </div>
                    <DollarSign className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Completed</p>
                      <p className="text-2xl font-bold">{completedPayments}</p>
                    </div>
                    <CheckCircle className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Pending</p>
                      <p className="text-2xl font-bold">{pendingPayments}</p>
                    </div>
                    <Clock className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">Failed</p>
                      <p className="text-2xl font-bold">{failedPayments}</p>
                    </div>
                    <XCircle className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-900">Payment Records</CardTitle>
                  <Button className="gradient-button text-white border-0" data-testid="button-download-statement">
                    <Download className="w-4 h-4 mr-2" />
                    Download Statement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search payments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-payments"
                    />
                  </div>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="membership">Membership</SelectItem>
                      <SelectItem value="event">Events</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="certificate">Certificates</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="thisYear">This Year</SelectItem>
                      <SelectItem value="lastYear">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payments List */}
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getStatusIcon(payment.status)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{payment.description}</h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-600">
                                ID: {payment.id}
                              </span>
                              <span className="text-sm text-gray-600">
                                {new Date(payment.date).toLocaleDateString()}
                              </span>
                              <div className="flex items-center space-x-1">
                                {getPaymentMethodIcon(payment.paymentMethod)}
                                <span className="text-sm text-gray-600">{payment.paymentMethod}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {payment.currency} ${payment.amount}
                            </div>
                            {getStatusBadge(payment.status)}
                          </div>
                          
                          <div className="flex space-x-2">
                            {payment.receiptUrl && (
                              <Button size="sm" variant="outline" data-testid={`button-receipt-${payment.id}`}>
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            {payment.status === "failed" && (
                              <Button size="sm" className="gradient-button text-white border-0" data-testid={`button-retry-${payment.id}`}>
                                Retry
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {payment.transactionId && (
                        <div className="mt-2 text-xs text-gray-500">
                          Transaction ID: {payment.transactionId}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredPayments.length === 0 && (
                  <div className="text-center py-8">
                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                    <p className="text-gray-600">No payment records match your current filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Available Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Credit/Debit Card</h4>
                        <p className="text-sm text-gray-600">Visa, Mastercard via Stripe</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-medium">Mobile Money</h4>
                        <p className="text-sm text-gray-600">EcoCash, OneMoney via PayNow</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Receipt className="w-6 h-6 text-gray-600" />
                      <div>
                        <h4 className="font-medium">Cash Payment</h4>
                        <p className="text-sm text-gray-600">In-person at EACZ offices</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}