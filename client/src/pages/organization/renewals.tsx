import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormHeader } from "@/components/ui/form-header";
import { Sidebar } from "@/components/navigation/Sidebar";
import { 
  Building2, Users, FileText, CreditCard, Award,
  Calendar, CheckCircle, Clock, AlertTriangle, Bell,
  RefreshCw, DollarSign, FileCheck, User
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function OrganizationRenewalsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Mock renewal data
  const mockRenewalInfo = {
    currentExpiryDate: new Date("2025-01-01"),
    renewalDueDate: new Date("2024-12-01"),
    daysUntilExpiry: 28,
    renewalFee: 2500.00,
    currency: "USD",
    status: "due_soon",
    lastRenewalDate: new Date("2024-01-01"),
    renewalPeriod: "12 months"
  };

  const mockRenewalHistory = [
    {
      id: "ren-1",
      renewalDate: new Date("2024-01-01"),
      expiryDate: new Date("2025-01-01"),
      fee: 2500.00,
      status: "completed",
      paymentMethod: "paynow",
      receiptNumber: "RCP-REN-2024-001"
    },
    {
      id: "ren-2",
      renewalDate: new Date("2023-01-01"),
      expiryDate: new Date("2024-01-01"),
      fee: 2200.00,
      status: "completed",
      paymentMethod: "cash",
      receiptNumber: "RCP-REN-2023-001"
    },
    {
      id: "ren-3",
      renewalDate: new Date("2022-01-01"),
      expiryDate: new Date("2023-01-01"),
      fee: 2000.00,
      status: "completed",
      paymentMethod: "stripe",
      receiptNumber: "RCP-REN-2022-001"
    }
  ];

  const sidebarItems = [
    { icon: Building2, label: "Dashboard", href: "/organization/dashboard" },
    { icon: User, label: "Principal Agent", href: "/organization/principal" },
    { icon: Users, label: "Agents", href: "/organization/agents" },
    { icon: FileText, label: "Documents", href: "/organization/documents" },
    { icon: Award, label: "Certificate", href: "/organization/certificate" },
    { icon: CreditCard, label: "Payments", href: "/organization/payments" },
    { icon: Calendar, label: "Renewals", href: "/organization/renewals", active: true }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "current": return "bg-green-100 text-green-800";
      case "due_soon": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "current": return "Current";
      case "due_soon": return "Due Soon";
      case "overdue": return "Overdue";
      case "expired": return "Expired";
      default: return status.replace(/_/g, " ");
    }
  };

  const getUrgencyLevel = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 7) return "critical";
    if (daysUntilExpiry <= 30) return "warning";
    return "normal";
  };

  const handleRenewNow = () => {
    toast({
      title: "Renewal Process Started",
      description: "Redirecting to renewal payment..."
    });
  };

  const handleSetReminder = () => {
    toast({
      title: "Reminder Set",
      description: "You will be notified about upcoming renewal deadlines."
    });
  };

  const urgencyLevel = getUrgencyLevel(mockRenewalInfo.daysUntilExpiry);

  return (
    <div className="min-h-screen gradient-bg">
      <FormHeader 
        title="EACZ Organization Portal"
        subtitle="Renewal Management"
      />
      
      <div className="flex min-h-screen">
        <Sidebar 
          items={sidebarItems}
          title="Organization Portal"
          subtitle="Manage your organization"
        />
        
        <main className="flex-1 p-6 pt-6 ml-64">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Renewal Management</h1>
              <p className="text-blue-100">Manage your organization registration renewals</p>
            </div>

            {/* Renewal Status Alert */}
            {urgencyLevel !== "normal" && (
              <Card className={`mb-6 ${urgencyLevel === "critical" || urgencyLevel === "expired" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`w-6 h-6 ${urgencyLevel === "critical" || urgencyLevel === "expired" ? "text-red-600" : "text-yellow-600"}`} />
                    <div className="flex-1">
                      <h3 className={`font-semibold ${urgencyLevel === "critical" || urgencyLevel === "expired" ? "text-red-900" : "text-yellow-900"}`}>
                        {urgencyLevel === "expired" ? "Registration Expired!" : 
                         urgencyLevel === "critical" ? "Urgent: Registration Expires Soon!" : 
                         "Renewal Reminder"}
                      </h3>
                      <p className={`text-sm ${urgencyLevel === "critical" || urgencyLevel === "expired" ? "text-red-700" : "text-yellow-700"}`}>
                        {urgencyLevel === "expired" 
                          ? `Your registration expired ${Math.abs(mockRenewalInfo.daysUntilExpiry)} days ago. Renew immediately to avoid penalties.`
                          : `Your registration expires in ${mockRenewalInfo.daysUntilExpiry} days. Renew now to avoid service interruption.`}
                      </p>
                    </div>
                    <Button 
                      className={urgencyLevel === "critical" || urgencyLevel === "expired" ? "bg-red-600 hover:bg-red-700" : "bg-yellow-600 hover:bg-yellow-700"} 
                      onClick={handleRenewNow}
                    >
                      Renew Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Status */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  Current Registration Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Registration Valid</h3>
                    <p className="text-sm text-gray-600">Until {mockRenewalInfo.currentExpiryDate.toLocaleDateString()}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 ${urgencyLevel === "critical" ? "bg-gradient-to-r from-red-500 to-red-600" : urgencyLevel === "warning" ? "bg-gradient-to-r from-yellow-500 to-yellow-600" : "bg-gradient-to-r from-blue-500 to-blue-600"} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Days Until Expiry</h3>
                    <p className={`text-2xl font-bold ${urgencyLevel === "critical" ? "text-red-600" : urgencyLevel === "warning" ? "text-yellow-600" : "text-blue-600"}`}>
                      {mockRenewalInfo.daysUntilExpiry}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Renewal Fee</h3>
                    <p className="text-xl font-bold text-purple-600">${mockRenewalInfo.renewalFee.toFixed(2)}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <RefreshCw className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Renewal Period</h3>
                    <p className="text-sm text-gray-600">{mockRenewalInfo.renewalPeriod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Renewal Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900">Renewal Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      className="w-full gradient-button text-white border-0"
                      onClick={handleRenewNow}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Renew Registration Now
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => setLocation('/organization/payments')}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      View Payment Options
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                      onClick={handleSetReminder}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Set Renewal Reminder
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => setLocation('/organization/documents')}
                    >
                      <FileCheck className="w-4 h-4 mr-2" />
                      Update Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900">Renewal Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Current organization documents</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Valid principal agent appointment</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Professional indemnity insurance</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Trust account compliance certificate</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Payment of renewal fees</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm text-gray-700">Audited financial statements (if applicable)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Renewal History */}
            <Card className="bg-white/95 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-900">Renewal History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRenewalHistory.map((renewal) => (
                    <div key={renewal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Registration Renewed
                          </h3>
                          <p className="text-sm text-gray-600">
                            Renewed: {renewal.renewalDate.toLocaleDateString()} • 
                            Valid until: {renewal.expiryDate.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-blue-600">
                            Receipt: {renewal.receiptNumber}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${renewal.fee.toFixed(2)}</p>
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}