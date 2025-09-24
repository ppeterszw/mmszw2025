import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/AdminHeader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  RefreshCw, Users, Clock, CheckCircle, AlertTriangle,
  Send, DollarSign, Search, Download, Calendar, Mail
} from "lucide-react";

interface RenewalWithMember {
  id: string;
  renewalYear: number;
  dueDate: string;
  status: string;
  remindersSent: number;
  lastReminderDate?: string;
  renewalDate?: string;
  renewalFee: string;
  paymentId?: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    membershipNumber: string;
    email: string;
    memberType: string;
  };
}

export default function AdminRenewals() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const currentYear = new Date().getFullYear();

  const { data: renewals = [], isLoading } = useQuery<RenewalWithMember[]>({
    queryKey: ["/api/renewals"],
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
        description: `Renewal ${action}d successfully.`
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

  const filteredRenewals = renewals.filter(renewal => {
    const matchesSearch = 
      renewal.member?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.member?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.member?.membershipNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || renewal.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const overdueRenewals = renewals.filter(r => r.status === "overdue");
  const pendingRenewals = renewals.filter(r => r.status === "pending");
  const completedRenewals = renewals.filter(r => r.status === "completed");
  const totalRenewalFees = completedRenewals.reduce((sum, r) => sum + parseFloat(r.renewalFee || "0"), 0);

  const sendBulkReminders = async () => {
    const pendingAndOverdue = renewals.filter(r => r.status === "pending" || r.status === "overdue");
    for (const renewal of pendingAndOverdue) {
      await sendReminderMutation.mutateAsync(renewal.id);
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    return Math.ceil((Date.now() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <AdminHeader currentPage="renewals" title="EACZ Admin Renewals" subtitle="Manage membership renewals and reminders" />
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Membership Renewals</h1>
              <p className="text-muted-foreground">Monitor and manage member renewals for {currentYear}</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Renewals</p>
                      <p className="text-2xl font-bold">{renewals.length}</p>
                    </div>
                    <RefreshCw className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Completed</p>
                      <p className="text-2xl font-bold">{completedRenewals.length}</p>
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
                      <p className="text-2xl font-bold">{pendingRenewals.length}</p>
                    </div>
                    <Clock className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">Overdue</p>
                      <p className="text-2xl font-bold">{overdueRenewals.length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Summary */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Renewal Revenue Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Collected</p>
                    <p className="text-2xl font-bold text-green-600">${totalRenewalFees.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pending Amount</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      ${(pendingRenewals.reduce((sum, r) => sum + parseFloat(r.renewalFee || "0"), 0)).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Overdue Amount</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${(overdueRenewals.reduce((sum, r) => sum + parseFloat(r.renewalFee || "0"), 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search and Actions */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by name or membership number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        data-testid="input-search-renewals"
                      />
                    </div>
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                      <option value="completed">Completed</option>
                      <option value="reminded">Reminded</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={sendBulkReminders}
                      disabled={sendReminderMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Send Bulk Reminders
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Renewals Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Renewals ({filteredRenewals.length})</TabsTrigger>
                <TabsTrigger value="overdue">Overdue ({overdueRenewals.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingRenewals.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedRenewals.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>All Renewals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">Loading renewals...</div>
                    ) : filteredRenewals.length > 0 ? (
                      <div className="space-y-4">
                        {filteredRenewals.map((renewal) => (
                          <div key={renewal.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                  {getStatusIcon(renewal.status)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {renewal.member?.firstName} {renewal.member?.lastName}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {renewal.member?.membershipNumber} • {renewal.member?.memberType}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Due: {new Date(renewal.dueDate).toLocaleDateString()} • 
                                    Fee: ${renewal.renewalFee}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <Badge className={getStatusColor(renewal.status)}>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(renewal.status)}
                                    <span>{renewal.status.charAt(0).toUpperCase() + renewal.status.slice(1)}</span>
                                  </div>
                                </Badge>
                                
                                <div className="flex items-center space-x-1">
                                  {(renewal.status === "pending" || renewal.status === "overdue") && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => sendReminderMutation.mutate(renewal.id)}
                                        disabled={sendReminderMutation.isPending}
                                      >
                                        <Send className="w-4 h-4 mr-1" />
                                        Remind
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
                                    </>
                                  )}
                                  {renewal.status === "completed" && renewal.renewalDate && (
                                    <span className="text-xs text-green-600">
                                      Renewed: {new Date(renewal.renewalDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {renewal.status === "overdue" && (
                              <div className="mt-2 p-2 bg-red-50 rounded border-l-4 border-red-400">
                                <p className="text-sm text-red-700">
                                  ⚠️ Overdue by {getDaysOverdue(renewal.dueDate)} days
                                  {renewal.remindersSent > 0 && ` • ${renewal.remindersSent} reminder(s) sent`}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No renewals found</h3>
                        <p className="text-gray-500">
                          {searchTerm || filterStatus !== "all" 
                            ? "Try adjusting your search or filter criteria." 
                            : "Renewal records will appear here."}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="overdue" className="space-y-4">
                <div className="grid gap-4">
                  {overdueRenewals.map((renewal) => (
                    <Card key={renewal.id} className="border-red-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg text-red-700">
                              {renewal.member?.firstName} {renewal.member?.lastName}
                            </CardTitle>
                            <p className="text-sm text-red-600">
                              Overdue by {getDaysOverdue(renewal.dueDate)} days
                            </p>
                          </div>
                          <Badge className={getStatusColor(renewal.status)}>
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

              <TabsContent value="pending" className="space-y-4">
                <div className="grid gap-4">
                  {pendingRenewals.map((renewal) => (
                    <Card key={renewal.id} className="border-yellow-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg text-yellow-700">
                              {renewal.member?.firstName} {renewal.member?.lastName}
                            </CardTitle>
                            <p className="text-sm text-yellow-600">
                              Due: {new Date(renewal.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(renewal.status)}>
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

              <TabsContent value="completed" className="space-y-4">
                <div className="grid gap-4">
                  {completedRenewals.map((renewal) => (
                    <Card key={renewal.id} className="border-green-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg text-green-700">
                              {renewal.member?.firstName} {renewal.member?.lastName}
                            </CardTitle>
                            <p className="text-sm text-green-600">
                              Renewed: {renewal.renewalDate ? new Date(renewal.renewalDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <Badge className={getStatusColor(renewal.status)}>
                            completed
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}