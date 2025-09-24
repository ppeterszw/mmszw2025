import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { 
  Calendar, DollarSign, Clock, CheckCircle, 
  AlertTriangle, RefreshCw, Send, CreditCard
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Users, Building2, GraduationCap } from "lucide-react";
import type { MemberRenewal, Member, Payment } from "@shared/schema";

interface RenewalWithMember extends MemberRenewal {
  member?: Member;
  payment?: Payment;
}

export default function RenewalManagement() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: renewals = [], isLoading } = useQuery<RenewalWithMember[]>({
    queryKey: ["/api/renewals"],
    enabled: !!user,
  });

  const { data: memberRenewal } = useQuery<RenewalWithMember>({
    queryKey: ["/api/renewals/current"],
    enabled: !!user && user.role !== "admin",
  });

  const sendReminderMutation = useMutation({
    mutationFn: (renewalId: string) => 
      apiRequest("POST", `/api/renewals/${renewalId}/remind`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/renewals"] });
      toast({
        title: "Reminder Sent",
        description: "Renewal reminder has been sent successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive"
      });
    }
  });

  const processRenewalMutation = useMutation({
    mutationFn: ({ renewalId, action }: { renewalId: string; action: string }) => 
      apiRequest("POST", `/api/renewals/${renewalId}/${action}`),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/renewals"] });
      toast({
        title: "Success",
        description: `Renewal ${action} successfully.`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process renewal. Please try again.",
        variant: "destructive"
      });
    }
  });

  const currentYear = new Date().getFullYear();
  const overdueRenewals = renewals.filter(r => r.status === "overdue");
  const pendingRenewals = renewals.filter(r => r.status === "pending");
  const completedRenewals = renewals.filter(r => r.status === "completed");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reminded":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "lapsed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "reminded":
        return <Send className="w-4 h-4" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <RefreshCw className="w-4 h-4" />;
    }
  };

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const sidebarItems = [
    { icon: Users, label: "Dashboard", href: "/admin-dashboard" },
    { 
      icon: Users, 
      label: "Members", 
      href: "/admin-dashboard/members",
      children: [
        { label: "All Members", href: "/admin-dashboard/members" },
        { label: "Applications", href: "/admin-dashboard/applications" },
        { label: "Document Verification", href: "/admin-dashboard/documents" }
      ]
    },
    { 
      icon: Building2, 
      label: "Organizations", 
      href: "/admin-dashboard/organizations",
      children: [
        { label: "All Organizations", href: "/admin-dashboard/organizations" },
        { label: "Register Organization", href: "/organization-registration" }
      ]
    },
    { 
      icon: AlertTriangle, 
      label: "Cases", 
      href: "/case-management",
      children: [
        { label: "All Cases", href: "/case-management" },
        { label: "Pending Cases", href: "/case-management?status=open" }
      ]
    },
    { icon: Calendar, label: "Events", href: "/event-management" },
    { icon: GraduationCap, label: "CPD Management", href: "/cpd-tracking" },
    { icon: RefreshCw, label: "Renewals", href: "/renewals", active: true },
    { icon: Users, label: "Member Directory", href: "/member-directory" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {isAdmin && <Sidebar items={sidebarItems} title="EACZ Admin" subtitle="Management System" />}
      
      <div className={isAdmin ? "ml-64" : ""}>
        <FormHeader 
        title="Membership Renewals"
        subtitle={isAdmin ? "Manage member renewals and reminders" : "Manage your membership renewal"}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <PageBreadcrumb items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "Renewals" }
        ]} className="mb-6" />
        {isAdmin ? (
          <>
            {/* Admin Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Renewals</CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{renewals.length}</div>
                  <p className="text-xs text-muted-foreground">For {currentYear}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingRenewals.length}</div>
                  <p className="text-xs text-muted-foreground">Awaiting payment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{overdueRenewals.length}</div>
                  <p className="text-xs text-muted-foreground">Past due date</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{completedRenewals.length}</div>
                  <p className="text-xs text-muted-foreground">Renewed</p>
                  <Progress 
                    value={(completedRenewals.length / renewals.length) * 100} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingRenewals.length})</TabsTrigger>
                <TabsTrigger value="overdue">Overdue ({overdueRenewals.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {renewals.slice(0, 10).map((renewal) => (
                    <Card key={renewal.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {renewal.member?.firstName} {renewal.member?.lastName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {renewal.member?.membershipNumber}
                            </p>
                          </div>
                          <Badge className={getStatusColor(renewal.status || "")}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(renewal.status || "")}
                              <span>{renewal.status}</span>
                            </div>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Due Date:</span>
                            <span>{new Date(renewal.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Renewal Fee:</span>
                            <span>${renewal.renewalFee}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Reminders Sent:</span>
                            <span>{renewal.remindersSent}</span>
                          </div>
                          
                          {renewal.status === "pending" && (
                            <div className="flex space-x-2 pt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => sendReminderMutation.mutate(renewal.id)}
                                disabled={sendReminderMutation.isPending}
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Send Reminder
                              </Button>
                              <Button 
                                size="sm" 
                                className="gradient-button text-white border-0"
                                onClick={() => processRenewalMutation.mutate({ 
                                  renewalId: renewal.id, 
                                  action: "complete" 
                                })}
                              >
                                Mark Paid
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="space-y-6">
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    These members have pending renewal payments. Consider sending reminders to those approaching the due date.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingRenewals.map((renewal) => (
                    <Card key={renewal.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {renewal.member?.firstName} {renewal.member?.lastName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(renewal.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(renewal.status || "")}>
                            pending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendReminderMutation.mutate(renewal.id)}
                            disabled={sendReminderMutation.isPending}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Send Reminder
                          </Button>
                          <Button 
                            size="sm" 
                            className="gradient-button text-white border-0"
                            onClick={() => processRenewalMutation.mutate({ 
                              renewalId: renewal.id, 
                              action: "complete" 
                            })}
                          >
                            Mark Paid
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="overdue" className="space-y-6">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    These members have overdue renewals. Immediate action may be required.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {overdueRenewals.map((renewal) => (
                    <Card key={renewal.id} className="border-red-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg text-red-700">
                              {renewal.member?.firstName} {renewal.member?.lastName}
                            </CardTitle>
                            <p className="text-sm text-red-600">
                              Overdue by {Math.ceil((Date.now() - new Date(renewal.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days
                            </p>
                          </div>
                          <Badge className={getStatusColor(renewal.status || "")}>
                            overdue
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendReminderMutation.mutate(renewal.id)}
                            disabled={sendReminderMutation.isPending}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Final Notice
                          </Button>
                          <Button 
                            size="sm" 
                            className="gradient-button text-white border-0"
                            onClick={() => processRenewalMutation.mutate({ 
                              renewalId: renewal.id, 
                              action: "complete" 
                            })}
                          >
                            Mark Paid
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          // Member View
          <div className="max-w-4xl mx-auto">
            {memberRenewal ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Your {currentYear} Membership Renewal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(memberRenewal.status || "")}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(memberRenewal.status || "")}
                          <span>{memberRenewal.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{new Date(memberRenewal.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Renewal Fee</p>
                      <p className="font-medium">${memberRenewal.renewalFee}</p>
                    </div>
                  </div>

                  {memberRenewal.status === "pending" && (
                    <Alert>
                      <Calendar className="h-4 w-4" />
                      <AlertDescription>
                        Your membership renewal is due on {new Date(memberRenewal.dueDate).toLocaleDateString()}. 
                        Please complete your payment to maintain active status.
                      </AlertDescription>
                    </Alert>
                  )}

                  {memberRenewal.status === "overdue" && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Your membership renewal is overdue. Please complete your payment immediately to avoid suspension.
                      </AlertDescription>
                    </Alert>
                  )}

                  {memberRenewal.status === "completed" && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your membership has been successfully renewed for {currentYear}. Thank you!
                      </AlertDescription>
                    </Alert>
                  )}

                  {(memberRenewal.status === "pending" || memberRenewal.status === "overdue") && (
                    <div className="flex space-x-4">
                      <Button 
                        className="gradient-button text-white border-0"
                        onClick={() => setLocation("/payment")}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Renewal Fee
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setLocation("/member-portal")}
                      >
                        Back to Portal
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Renewal Required</h3>
                  <p className="text-muted-foreground mb-4">
                    Your membership is current and no renewal is needed at this time.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation("/member-portal")}
                  >
                    Back to Portal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        </div>
      </div>
      
      <FormFooter />
    </div>
  );
}