import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StatsCard } from "@/components/ui/stats-card";
import { ModernModal } from "@/components/ui/modern-modal";
import { AdminPageLayout } from "@/components/AdminPageLayout";
import {
  Users, Building2, Clock, AlertTriangle, Plus,
  Eye, CheckCircle, XCircle, TrendingUp,
  FileText, Calendar, UserPlus, BarChart3
} from "lucide-react";
import { useLocation } from "wouter";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MemberApplication, Case } from "@shared/schema";

// Transformed application type with flattened JSONB fields
interface TransformedApplication extends MemberApplication {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  dateOfBirth?: string | Date;
  currentStage?: string;
}

// Add Member Form Schema - matching AgentsHUB SimplifiedAddMemberForm
const addMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  surname: z.string().min(1, "Surname is required").max(50, "Surname must be less than 50 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine(date => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 80;
  }, "Age must be between 18 and 80 years"),
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  nationality: z.string().min(1, "Nationality is required"),
  email: z.string().email("Invalid email address"),
  memberType: z.enum(["real_estate_agent", "property_manager", "principal_real_estate_agent", "real_estate_negotiator"], {
    errorMap: () => ({ message: "Please select a member type" })
  }),
  educationLevel: z.enum(["normal_entry", "mature_entry"], {
    errorMap: () => ({ message: "Please select education/entry type" })
  }),
  employmentStatus: z.enum(["self_employed", "employed"], {
    errorMap: () => ({ message: "Please select employment status" })
  }),
  organizationName: z.string().optional(),
}).refine(data => {
  // If employed, organization name is required
  if (data.employmentStatus === "employed" && !data.organizationName?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Organization/firm name is required when employed",
  path: ["organizationName"]
});

type AddMemberFormData = z.infer<typeof addMemberSchema>;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, logoutMutation } = useAuth();
  const { toast } = useToast();

  // Modal states
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [registerOrgModalOpen, setRegisterOrgModalOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);

  // Add Member Form Hook - matching AgentsHUB SimplifiedAddMemberForm
  const memberForm = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      dateOfBirth: "",
      countryOfResidence: "Zimbabwe",
      nationality: "Zimbabwean",
      email: "",
      memberType: undefined,
      educationLevel: undefined,
      employmentStatus: undefined,
      organizationName: "",
    },
  });

  const [orgForm, setOrgForm] = useState({
    name: "",
    type: "",
    email: "",
    phone: "",
    address: "",
    registrationNumber: ""
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    type: "",
    startDate: "",
    endDate: "",
    location: "",
    address: "",
    instructor: "",
    capacity: "",
    price: "",
    cpdPoints: ""
  });

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

  const { data: stats = {} } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: allApplications = [] } = useQuery<TransformedApplication[]>({
    queryKey: ["/api/applications"],
  });

  // Filter for pending applications - match actual status values from database
  const pendingApplications = allApplications.filter(app => 
    ['submitted', 'under_review', 'document_verification', 'pending_approval', 'awaiting_documents'].includes(app.status || app.currentStage || '')
  );

  const { data: recentCases = [] } = useQuery<Case[]>({
    queryKey: ["/api/cases", { status: "open" }],
    queryFn: () => fetch("/api/cases?status=open").then(res => res.json())
  });

  // Application approval/rejection mutation
  const reviewApplicationMutation = useMutation({
    mutationFn: ({ id, action, notes }: { id: string; action: string; notes?: string }) =>
      apiRequest("POST", `/api/applications/${id}/review`, { action, notes }),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `Application ${action === 'approve' ? 'approved' : 'rejected'} successfully.`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process application.",
        variant: "destructive"
      });
    }
  });

  // Add Member mutation - using the same endpoint as AgentsHUB
  const addMemberMutation = useMutation({
    mutationFn: async (data: AddMemberFormData) => {
      return apiRequest("POST", "/api/admin/members/simplified-add", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      toast({
        title: "Success",
        description: "Member added successfully!"
      });
      setAddMemberModalOpen(false);
      memberForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add member. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Add Member form submission handler
  const onSubmitAddMember = async (data: AddMemberFormData) => {
    // Calculate age to validate entry type
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() - 
      (today.getMonth() < birthDate.getMonth() || 
       (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);

    // Validate mature entry age requirement
    if (data.educationLevel === "mature_entry" && age < 27) {
      memberForm.setError("educationLevel", {
        message: "Mature Entry requires age 27 years and above"
      });
      return;
    }

    addMemberMutation.mutate(data);
  };

  // Watch employment status for conditional fields
  const watchEmploymentStatus = memberForm.watch("employmentStatus");

  // Register Organization mutation
  const registerOrgMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/organizations", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Organization registered successfully!"
      });
      setRegisterOrgModalOpen(false);
      setOrgForm({
        name: "",
        type: "",
        email: "",
        phone: "",
        address: "",
        registrationNumber: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to register organization.",
        variant: "destructive"
      });
    }
  });

  // Create Event mutation
  const createEventMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/events", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Event created successfully!"
      });
      setCreateEventModalOpen(false);
      setEventForm({
        title: "",
        description: "",
        type: "",
        startDate: "",
        endDate: "",
        location: "",
        address: "",
        instructor: "",
        capacity: "",
        price: "",
        cpdPoints: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event.",
        variant: "destructive"
      });
    }
  });

  const handleApproveApplication = (applicationId: string) => {
    reviewApplicationMutation.mutate({
      id: applicationId,
      action: 'approve'
    });
  };

  const handleRejectApplication = (applicationId: string) => {
    reviewApplicationMutation.mutate({
      id: applicationId,
      action: 'reject'
    });
  };

  const quickActions = [
    {
      icon: UserPlus,
      label: "Add Member",
      action: () => setAddMemberModalOpen(true),
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      icon: Building2,
      label: "Register Organization",
      action: () => setRegisterOrgModalOpen(true),
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      icon: Calendar,
      label: "Create Event",
      action: () => setCreateEventModalOpen(true),
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      icon: FileText,
      label: "Generate Reports",
      action: () => {},
      color: "text-orange-600",
      bg: "bg-orange-100"
    }
  ];

  return (
    <AdminPageLayout currentPage="dashboard">
      {/* Main Content */}
      <div className="p-6">
        <PageBreadcrumb items={[{ label: "Admin Dashboard" }]} />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent">Admin Dashboard</h1>
          <p className="text-gray-600">Estate Agents Council of Zimbabwe - Management Overview</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Users}
            title="Total Members"
            value={(stats as any)?.totalMembers?.toString() || "0"}
            trend="↗ 12%"
            trendText="from last month"
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
            data-testid="stat-total-members"
          />
          
          <StatsCard
            icon={Building2}
            title="Active Organizations"
            value={(stats as any)?.activeOrganizations?.toString() || "0"}
            trend="↗ 5%"
            trendText="from last month"
            iconColor="text-green-600"
            iconBg="bg-green-100"
            data-testid="stat-active-organizations"
          />
          
          <StatsCard
            icon={Clock}
            title="Pending Applications"
            value={(stats as any)?.pendingApplications?.toString() || "0"}
            trend="2 urgent"
            trendText="require attention"
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
            data-testid="stat-pending-applications"
          />
          
          <StatsCard
            icon={AlertTriangle}
            title="Open Cases"
            value={(stats as any)?.openCases?.toString() || "0"}
            trend="3 critical"
            trendText="need review"
            iconColor="text-red-600"
            iconBg="bg-red-100"
            data-testid="stat-open-cases"
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 border-2 border-gray-100 bg-gradient-to-br from-white to-cyan-50/30 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-egyptian-blue/5 to-powder-blue/5 border-b-2 border-gray-100">
            <CardTitle className="text-xl bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent">
              Quick Actions
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Frequently used operations and tasks</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap sm:flex-nowrap gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col items-center p-6 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 flex-1 min-w-0 border-2 border-gray-200 hover:border-egyptian-blue hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  onClick={action.action}
                  data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className={`w-14 h-14 ${action.bg} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                    <action.icon className={`w-7 h-7 ${action.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-center text-gray-700">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Applications */}
          <Card className="border-2 border-gray-100 bg-gradient-to-br from-white to-orange-50/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50/50 to-yellow-50/50 border-b-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    Pending Applications
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {pendingApplications.length} application{pendingApplications.length !== 1 ? 's' : ''} awaiting review
                  </p>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setLocation("/admin-dashboard/applications")}
                  className="text-orange-600 hover:text-orange-700 font-semibold"
                  data-testid="link-view-all-applications"
                >
                  View All →
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {pendingApplications.length > 0 ? (
                <div className="space-y-4">
                  {pendingApplications.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl bg-gradient-to-br from-white to-blue-50/30 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                          <span className="text-base font-bold text-orange-600">
                            {application.firstName?.[0] || 'U'}{application.lastName?.[0] || 'N'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800" data-testid={`application-name-${application.id}`}>
                            {application.firstName || 'Unknown'} {application.lastName || 'Name'}
                          </p>
                          <p className="text-sm text-gray-600 font-medium" data-testid={`application-type-${application.id}`}>
                            {application.memberType.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Status: <span className="font-semibold text-orange-600">{application.status || 'Pending'}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md"
                          onClick={() => handleApproveApplication(application.id)}
                          disabled={reviewApplicationMutation.isPending}
                          data-testid={`button-approve-${application.id}`}
                        >
                          {reviewApplicationMutation.isPending ? "Processing..." : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="shadow-md"
                          onClick={() => handleRejectApplication(application.id)}
                          disabled={reviewApplicationMutation.isPending}
                          data-testid={`button-reject-${application.id}`}
                        >
                          {reviewApplicationMutation.isPending ? "Processing..." : "Reject"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No pending applications</p>
                  <p className="text-sm text-gray-400 mt-1">All applications have been processed</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Cases */}
          <Card className="border-2 border-gray-100 bg-gradient-to-br from-white to-red-50/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50/50 to-orange-50/50 border-b-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Recent Cases
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {recentCases.length} active case{recentCases.length !== 1 ? 's' : ''} requiring attention
                  </p>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setLocation("/case-management")}
                  className="text-red-600 hover:text-red-700 font-semibold"
                  data-testid="link-view-all-cases"
                >
                  View All →
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {recentCases.length > 0 ? (
                <div className="space-y-4">
                  {recentCases.slice(0, 3).map((caseItem) => (
                    <div key={caseItem.id} className="p-4 border-2 border-gray-100 rounded-xl bg-gradient-to-br from-white to-blue-50/30 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          variant={caseItem.priority === 'high' ? 'destructive' :
                                  caseItem.priority === 'medium' ? 'default' : 'secondary'}
                          className="font-semibold"
                          data-testid={`case-priority-${caseItem.id}`}
                        >
                          {caseItem.priority?.toUpperCase()} Priority
                        </Badge>
                        <span className="text-xs font-semibold text-gray-500" data-testid={`case-number-${caseItem.id}`}>
                          {caseItem.caseNumber}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2" data-testid={`case-title-${caseItem.id}`}>
                        {caseItem.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2" data-testid={`case-description-${caseItem.id}`}>
                        {caseItem.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-gray-500">
                            Submitted by
                          </span>
                          <span className="text-sm font-bold text-gray-700">
                            {caseItem.submittedBy || "Anonymous"}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="link"
                          onClick={() => setLocation(`/case-management/${caseItem.id}`)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                          data-testid={`button-view-case-${caseItem.id}`}
                        >
                          View Details →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No recent cases</p>
                  <p className="text-sm text-gray-400 mt-1">All cases have been resolved</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Member Modal - Modern and colorful matching AgentsHUB */}
      <ModernModal
        open={addMemberModalOpen}
        onOpenChange={setAddMemberModalOpen}
        title="Add New Individual Member"
        subtitle="Create a new member profile. An email notification will be sent for verification and profile completion."
        icon={UserPlus}
        colorVariant="blue"
        maxWidth="2xl"
        footer={{
          secondary: {
            label: "Cancel",
            onClick: () => setAddMemberModalOpen(false),
            testId: "button-cancel-add-member"
          },
          primary: {
            label: addMemberMutation.isPending ? "Adding..." : "Add Member",
            onClick: () => memberForm.handleSubmit(onSubmitAddMember)(),
            loading: addMemberMutation.isPending,
            disabled: addMemberMutation.isPending,
            testId: "button-submit-add-member"
          }
        }}
      >
        <Form {...memberForm}>
          <form onSubmit={memberForm.handleSubmit(onSubmitAddMember)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={memberForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter first name" data-testid="input-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={memberForm.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surname *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter surname" data-testid="input-surname" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={memberForm.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-date-of-birth" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={memberForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} placeholder="Enter email address" data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={memberForm.control}
                  name="countryOfResidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country of Residence *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                          <SelectItem value="South Africa">South Africa</SelectItem>
                          <SelectItem value="Botswana">Botswana</SelectItem>
                          <SelectItem value="Namibia">Namibia</SelectItem>
                          <SelectItem value="Zambia">Zambia</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={memberForm.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-nationality">
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Zimbabwean">Zimbabwean</SelectItem>
                          <SelectItem value="South African">South African</SelectItem>
                          <SelectItem value="Botswanan">Botswanan</SelectItem>
                          <SelectItem value="Namibian">Namibian</SelectItem>
                          <SelectItem value="Zambian">Zambian</SelectItem>
                          <SelectItem value="British">British</SelectItem>
                          <SelectItem value="American">American</SelectItem>
                          <SelectItem value="Australian">Australian</SelectItem>
                          <SelectItem value="Canadian">Canadian</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary">Professional Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={memberForm.control}
                  name="memberType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-member-type">
                            <SelectValue placeholder="Select member type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="real_estate_agent">Real Estate Agent</SelectItem>
                          <SelectItem value="property_manager">Property Manager</SelectItem>
                          <SelectItem value="principal_real_estate_agent">Principal Real Estate Agent</SelectItem>
                          <SelectItem value="real_estate_negotiator">Real Estate Negotiator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={memberForm.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education/Entry Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-education-level">
                            <SelectValue placeholder="Select entry type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal_entry">Normal Entry</SelectItem>
                          <SelectItem value="mature_entry">Mature Entry (27+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={memberForm.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-employment-status">
                            <SelectValue placeholder="Select employment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="self_employed">Self Employed</SelectItem>
                          <SelectItem value="employed">Employed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchEmploymentStatus === "employed" && (
                  <FormField
                    control={memberForm.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization/Firm Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter organization name" data-testid="input-organization-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </form>
        </Form>
      </ModernModal>

      {/* Register Organization Modal */}
      <ModernModal
        open={registerOrgModalOpen}
        onOpenChange={setRegisterOrgModalOpen}
        title="Register Organization"
        subtitle="Register a new real estate firm with EACZ"
        icon={Building2}
        colorVariant="green"
        maxWidth="2xl"
        footer={{
          secondary: {
            label: "Cancel",
            onClick: () => setRegisterOrgModalOpen(false),
            testId: "button-cancel-register-org"
          },
          primary: {
            label: "Register Organization",
            onClick: () => registerOrgMutation.mutate(orgForm),
            loading: registerOrgMutation.isPending,
            testId: "button-submit-register-org"
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="orgName" className="text-sm font-medium">Organization Name *</Label>
              <Input
                id="orgName"
                value={orgForm.name}
                onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                placeholder="Enter organization name"
                data-testid="input-org-name"
              />
            </div>
            <div>
              <Label htmlFor="orgType" className="text-sm font-medium">Organization Type *</Label>
              <Select value={orgForm.type} onValueChange={(value) => setOrgForm({ ...orgForm, type: value })}>
                <SelectTrigger data-testid="select-org-type">
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real_estate_firm">Real Estate Firm</SelectItem>
                  <SelectItem value="property_management_firm">Property Management Firm</SelectItem>
                  <SelectItem value="brokerage_firm">Brokerage Firm</SelectItem>
                  <SelectItem value="real_estate_development_firm">Real Estate Development Firm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="orgEmail" className="text-sm font-medium">Email *</Label>
              <Input
                id="orgEmail"
                type="email"
                value={orgForm.email}
                onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })}
                placeholder="Enter organization email"
                data-testid="input-org-email"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="orgPhone" className="text-sm font-medium">Phone</Label>
              <Input
                id="orgPhone"
                value={orgForm.phone}
                onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })}
                placeholder="Enter phone number"
                data-testid="input-org-phone"
              />
            </div>
            <div>
              <Label htmlFor="regNumber" className="text-sm font-medium">Registration Number</Label>
              <Input
                id="regNumber"
                value={orgForm.registrationNumber}
                onChange={(e) => setOrgForm({ ...orgForm, registrationNumber: e.target.value })}
                placeholder="Enter registration number"
                data-testid="input-org-reg-number"
              />
            </div>
            <div>
              <Label htmlFor="orgAddress" className="text-sm font-medium">Address</Label>
              <Textarea
                id="orgAddress"
                value={orgForm.address}
                onChange={(e) => setOrgForm({ ...orgForm, address: e.target.value })}
                placeholder="Enter organization address"
                rows={3}
                data-testid="textarea-org-address"
              />
            </div>
          </div>
        </div>
      </ModernModal>

      {/* Create Event Modal */}
      <ModernModal
        open={createEventModalOpen}
        onOpenChange={setCreateEventModalOpen}
        title="Create Event"
        subtitle="Create a new training or educational event"
        icon={Calendar}
        colorVariant="purple"
        maxWidth="3xl"
        footer={{
          secondary: {
            label: "Cancel",
            onClick: () => setCreateEventModalOpen(false),
            testId: "button-cancel-create-event"
          },
          primary: {
            label: "Create Event",
            onClick: () => createEventMutation.mutate({
              ...eventForm,
              capacity: eventForm.capacity ? parseInt(eventForm.capacity) : null,
              price: eventForm.price ? parseFloat(eventForm.price) : null,
              cpdPoints: eventForm.cpdPoints ? parseInt(eventForm.cpdPoints) : 0,
              startDate: eventForm.startDate ? new Date(eventForm.startDate) : null,
              endDate: eventForm.endDate ? new Date(eventForm.endDate) : null
            }),
            loading: createEventMutation.isPending,
            testId: "button-submit-create-event"
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventTitle" className="text-sm font-medium">Event Title *</Label>
              <Input
                id="eventTitle"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Enter event title"
                data-testid="input-event-title"
              />
            </div>
            <div>
              <Label htmlFor="eventType" className="text-sm font-medium">Event Type *</Label>
              <Select value={eventForm.type} onValueChange={(value) => setEventForm({ ...eventForm, type: value })}>
                <SelectTrigger data-testid="select-event-type">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="eventDescription" className="text-sm font-medium">Description</Label>
              <Textarea
                id="eventDescription"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Enter event description"
                rows={3}
                data-testid="textarea-event-description"
              />
            </div>
            <div>
              <Label htmlFor="instructor" className="text-sm font-medium">Instructor</Label>
              <Input
                id="instructor"
                value={eventForm.instructor}
                onChange={(e) => setEventForm({ ...eventForm, instructor: e.target.value })}
                placeholder="Enter instructor name"
                data-testid="input-event-instructor"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium">Start Date *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={eventForm.startDate}
                  onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                  data-testid="input-event-start-date"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={eventForm.endDate}
                  onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                  data-testid="input-event-end-date"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Input
                id="location"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                placeholder="Enter event location"
                data-testid="input-event-location"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-sm font-medium">Address</Label>
              <Input
                id="address"
                value={eventForm.address}
                onChange={(e) => setEventForm({ ...eventForm, address: e.target.value })}
                placeholder="Enter venue address"
                data-testid="input-event-address"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="capacity" className="text-sm font-medium">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                  placeholder="Max attendees"
                  data-testid="input-event-capacity"
                />
              </div>
              <div>
                <Label htmlFor="price" className="text-sm font-medium">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={eventForm.price}
                  onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                  placeholder="0.00"
                  data-testid="input-event-price"
                />
              </div>
              <div>
                <Label htmlFor="cpdPoints" className="text-sm font-medium">CPD Points</Label>
                <Input
                  id="cpdPoints"
                  type="number"
                  value={eventForm.cpdPoints}
                  onChange={(e) => setEventForm({ ...eventForm, cpdPoints: e.target.value })}
                  placeholder="Points"
                  data-testid="input-event-cpd-points"
                />
              </div>
            </div>
          </div>
        </div>
      </ModernModal>
    </AdminPageLayout>
  );
}
