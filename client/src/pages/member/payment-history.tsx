import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormFooter } from "@/components/ui/form-footer";
import { MemberHeader } from "@/components/MemberHeader";
import { 
  CreditCard, DollarSign, Download, Calendar, 
  CheckCircle, XCircle, Clock, AlertTriangle,
  User, Building2, FileText, Receipt, Plus
} from "lucide-react";
import { useLocation } from "wouter";
import type { Payment } from "@shared/schema";

export default function PaymentHistory() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Mock payments data for now since API is having issues
  const mockPayments = [
    {
      id: "payment-1",
      amount: "500.00",
      currency: "USD",
      paymentMethod: "ecocash" as const,
      status: "completed" as const,
      purpose: "Annual Membership Fee",
      referenceNumber: "PAY001",
      transactionId: "TXN123456",
      paymentDate: new Date("2024-01-15"),
      createdAt: new Date("2024-01-15"),
      description: "Annual Membership Fee 2024"
    },
    {
      id: "payment-2",
      amount: "150.00",
      currency: "USD",
      paymentMethod: "bank_transfer" as const,
      status: "completed" as const,
      purpose: "CPD Workshop Fee",
      referenceNumber: "PAY002",
      transactionId: "TXN789012",
      paymentDate: new Date("2024-02-20"),
      createdAt: new Date("2024-02-20"),
      description: "CPD Workshop: Real Estate Valuations"
    },
    {
      id: "payment-3",
      amount: "75.00",
      currency: "USD",
      paymentMethod: "stripe" as const,
      status: "pending" as const,
      purpose: "Event Registration",
      referenceNumber: "PAY003",
      transactionId: null,
      paymentDate: null,
      createdAt: new Date("2024-03-01"),
      description: "Ethics Seminar Registration"
    }
  ];

  const payments = mockPayments;
  const isLoading = false;
  const upcomingPayments = mockPayments.filter(p => p.status === "pending");


  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "refunded":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "paynow":
        return "PayNow";
      case "stripe":
        return "Credit/Debit Card";
      case "bank_transfer":
        return "Bank Transfer";
      case "cash":
        return "Cash";
      default:
        return method;
    }
  };

  const exportPayments = () => {
    const csvContent = [
      ["Date", "Description", "Amount", "Method", "Status", "Reference"].join(","),
      ...payments.map(payment => [
        new Date(payment.paymentDate || payment.createdAt || "").toLocaleDateString(),
        payment.description || "Payment",
        `$${payment.amount}`,
        getPaymentMethodDisplay(payment.paymentMethod || ""),
        payment.status || "",
        payment.referenceNumber || ""
      ].join(","))
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eacz-payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedPayments = payments.filter(p => p.status === "completed");
  const pendingPayments = payments.filter(p => p.status === "pending");
  const totalPaid = completedPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader currentPage="payments" />
      
      <div className="p-6">
        <main className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Payment History</h1>
            <p className="text-muted-foreground">View your payment history and manage your billing</p>
          </div>
          {/* Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Total Paid</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">All time payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedPayments.length}</div>
                <p className="text-xs text-muted-foreground">Successful payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingPayments.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actions</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={exportPayments}
                  className="w-full"
                  disabled={payments.length === 0}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="history" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Payment History</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment History ({payments.length})
                    </CardTitle>
                    <Button 
                      variant="outline"
                      onClick={exportPayments}
                      disabled={payments.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Loading payment history...</div>
                  ) : payments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-left py-3 px-4">Description</th>
                            <th className="text-left py-3 px-4">Amount</th>
                            <th className="text-left py-3 px-4">Method</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Reference</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <tr key={payment.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                  {new Date(payment.paymentDate || payment.createdAt || "").toLocaleDateString()}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium">{payment.description || "Payment"}</div>
                                  <div className="text-sm text-gray-500">
                                    Invoice #{payment.referenceNumber || payment.id.slice(-8)}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-semibold text-green-600">
                                  ${payment.amount}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                                  {getPaymentMethodDisplay(payment.paymentMethod || "")}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={getPaymentStatusColor(payment.status || "")}>
                                  <div className="flex items-center space-x-1">
                                    {getPaymentStatusIcon(payment.status || "")}
                                    <span>{payment.status}</span>
                                  </div>
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-mono text-sm">
                                  {payment.referenceNumber || "N/A"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Receipt className="w-4 h-4 mr-1" />
                                    Receipt
                                  </Button>
                                  {(payment.status as any) === "failed" && (
                                    <Button
                                      size="sm"
                                      className="gradient-button text-white border-0"
                                      onClick={() => setLocation("/payment")}
                                    >
                                      Retry
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Payment History</h3>
                      <p className="text-gray-500 mb-4">
                        You haven't made any payments yet.
                      </p>
                      <Button 
                        className="gradient-button text-white border-0"
                        onClick={() => setLocation("/payment")}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Make a Payment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Upcoming Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingPayments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{payment.description}</h3>
                              <p className="text-sm text-gray-600">
                                Due: {new Date(payment.paymentDate || "").toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-semibold">${payment.amount}</div>
                              <div className="text-sm text-gray-500">Amount due</div>
                            </div>
                            <Button 
                              className="gradient-button text-white border-0"
                              onClick={() => setLocation("/payment")}
                            >
                              Pay Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Upcoming Payments</h3>
                      <p className="text-gray-500">
                        You're all caught up! No payments are currently due.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Schedule Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Payment Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Annual Membership Fee</h3>
                        <p className="text-sm text-gray-600">Renews every January</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$150.00</div>
                        <div className="text-sm text-gray-500">Annual</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">CPD Event Fees</h3>
                        <p className="text-sm text-gray-600">Per event registration</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$25.00 - $75.00</div>
                        <div className="text-sm text-gray-500">Per event</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Late Payment Fee</h3>
                        <p className="text-sm text-gray-600">Applied after 30 days</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$25.00</div>
                        <div className="text-sm text-gray-500">One-time</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
        
      <FormFooter />
    </div>
  );
}