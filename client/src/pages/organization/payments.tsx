import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrganizationHeader } from "@/components/OrganizationHeader";
import { 
  Building2, Users, FileText, CreditCard, Award,
  DollarSign, Calendar, CheckCircle, Clock, AlertTriangle,
  Plus, Search, Filter, Download, Eye, User
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function OrganizationPaymentsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock payments data
  const mockPayments = [
    {
      id: "pay-1",
      description: "Annual Organization Fee 2024",
      amount: 2500.00,
      currency: "USD",
      status: "completed",
      paymentMethod: "paynow",
      paymentDate: new Date("2024-01-15"),
      dueDate: new Date("2024-01-31"),
      referenceNumber: "PAY-ORG-2024-001",
      receiptNumber: "RCP-001-2024"
    },
    {
      id: "pay-2",
      description: "Trust Account Certificate Fee",
      amount: 150.00,
      currency: "USD",
      status: "completed",
      paymentMethod: "cash",
      paymentDate: new Date("2024-02-10"),
      dueDate: new Date("2024-02-15"),
      referenceNumber: "PAY-ORG-2024-002",
      receiptNumber: "RCP-002-2024"
    },
    {
      id: "pay-3",
      description: "Document Processing Fee",
      amount: 75.00,
      currency: "USD",
      status: "pending",
      paymentMethod: "stripe",
      paymentDate: null,
      dueDate: new Date("2024-12-31"),
      referenceNumber: "PAY-ORG-2024-003",
      receiptNumber: null
    },
    {
      id: "pay-4",
      description: "Principal Agent Change Fee",
      amount: 200.00,
      currency: "USD",
      status: "overdue",
      paymentMethod: null,
      paymentDate: null,
      dueDate: new Date("2024-11-30"),
      referenceNumber: "PAY-ORG-2024-004",
      receiptNumber: null
    }
  ];


  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "processing": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "overdue": return <AlertTriangle className="w-4 h-4" />;
      case "processing": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "paynow": return "PayNow";
      case "stripe": return "Credit Card";
      case "cash": return "Cash";
      case "bank_transfer": return "Bank Transfer";
      default: return method || "Pending";
    }
  };

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPaid = mockPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = mockPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

  const handleMakePayment = (paymentId: string) => {
    toast({
      title: "Payment Initiated",
      description: "Redirecting to payment gateway..."
    });
  };

  const handleDownloadReceipt = (receiptNumber: string) => {
    toast({
      title: "Download Started",
      description: `Downloading receipt ${receiptNumber}...`
    });
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <OrganizationHeader currentPage="payments" title="EACZ Organization Portal" subtitle="Payment Management" />
        
        <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Management</h1>
          <p className="text-muted-foreground">Manage your organization's payments and financial obligations</p>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Paid</p>
                        <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">${totalPending.toFixed(2)}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Overdue</p>
                        <p className="text-2xl font-bold text-red-600">${totalOverdue.toFixed(2)}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Payments</p>
                        <p className="text-2xl font-bold text-blue-600">{mockPayments.length}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search payments by description or reference number..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                    </select>
                    <Button className="gradient-button text-white border-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Make Payment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payments List */}
            <Card className="bg-white/95 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-900">Payment History ({filteredPayments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{payment.description}</h3>
                            <p className="text-sm text-gray-600">
                              Reference: {payment.referenceNumber} • Due: {payment.dueDate.toLocaleDateString()}
                            </p>
                            <p className="text-xs text-blue-600">
                              {payment.paymentDate && `Paid: ${payment.paymentDate.toLocaleDateString()}`}
                              {payment.receiptNumber && ` • Receipt: ${payment.receiptNumber}`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">${payment.amount.toFixed(2)} {payment.currency}</p>
                            <p className="text-sm text-gray-600">{getPaymentMethodDisplay(payment.paymentMethod || "pending")}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(payment.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(payment.status)}
                              <span>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                            </div>
                          </Badge>
                          
                          <div className="flex items-center space-x-1">
                            {payment.status === "completed" && payment.receiptNumber && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadReceipt(payment.receiptNumber)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            {(payment.status === "pending" || payment.status === "overdue") && (
                              <Button 
                                size="sm"
                                className="gradient-button text-white border-0"
                                onClick={() => handleMakePayment(payment.id)}
                              >
                                Pay Now
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile view details */}
                      <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-bold text-gray-900">${payment.amount.toFixed(2)} {payment.currency}</p>
                            <p className="text-sm text-gray-600">{getPaymentMethodDisplay(payment.paymentMethod || "pending")}</p>
                          </div>
                          {(payment.status === "pending" || payment.status === "overdue") && (
                            <Button 
                              size="sm"
                              className="gradient-button text-white border-0"
                              onClick={() => handleMakePayment(payment.id)}
                            >
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredPayments.length === 0 && (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm || filterStatus !== "all" 
                          ? "Try adjusting your search or filter criteria." 
                          : "Payment history will appear here as you make payments."}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}