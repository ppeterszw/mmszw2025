import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { Sidebar } from "@/components/navigation/Sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Building2, Mail, Phone, MapPin, Users, 
  Edit, Save, FileText, Calendar, 
  DollarSign, Settings, AlertTriangle
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Organization, Member } from "@shared/schema";

const organizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  trustAccountDetails: z.string().optional(),
});

type OrganizationData = z.infer<typeof organizationSchema>;

export default function OrganizationProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: organization, isLoading } = useQuery<Organization>({
    queryKey: ["/api/organization/profile"],
    enabled: !!user,
  });

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["/api/organization/members"],
    enabled: !!user && !!organization,
  });

  const form = useForm<OrganizationData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name || "",
      email: organization?.email || "",
      phone: organization?.phone || "",
      address: organization?.address || "",
      trustAccountDetails: organization?.trustAccountDetails || "",
    },
  });

  const updateOrgMutation = useMutation({
    mutationFn: (data: OrganizationData) =>
      apiRequest("/api/organization/profile", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organization/profile"] });
      toast({
        title: "Success",
        description: "Organization profile updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update organization profile.",
        variant: "destructive"
      });
    }
  });

  const sidebarItems = [
    { icon: Building2, label: "Organization", href: "/organization/profile", active: true },
    { icon: Users, label: "Members", href: "/organization/members" },
    { icon: FileText, label: "Documents", href: "/organization/documents" },
    { icon: DollarSign, label: "Payments", href: "/organization/payments" },
    { icon: Calendar, label: "Events", href: "/organization/events" },
    { icon: Settings, label: "Settings", href: "/organization/settings" },
  ];

  const onSubmit = (data: OrganizationData) => {
    updateOrgMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div>Loading organization profile...</div>
    </div>;
  }

  const activeMembers = members.filter(m => m.membershipStatus === "active");
  const pendingMembers = members.filter(m => m.membershipStatus === "pending");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar items={sidebarItems} title="Organization Portal" subtitle="EACZ Organization Management" />
      
      <div className="pl-64">
        <FormHeader 
          title="Organization Profile"
          subtitle="Manage your organization's information and settings"
        />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Organization Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{organization?.name}</CardTitle>
                  <p className="text-muted-foreground">
                    {organization?.registrationNumber} • {organization?.type?.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Registered: {organization?.registrationDate ? new Date(organization.registrationDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{members.length}</div>
                <p className="text-xs text-muted-foreground">Registered agents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeMembers.length}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingMembers.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 capitalize">
                  {organization?.membershipStatus}
                </div>
                <p className="text-xs text-muted-foreground">Organization status</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="registration">Registration Details</TabsTrigger>
              <TabsTrigger value="financial">Financial Information</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Organization Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-org-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" data-testid="input-org-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-org-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Address</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} data-testid="textarea-org-address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="gradient-button text-white border-0"
                        disabled={updateOrgMutation.isPending}
                        data-testid="button-save-org-profile"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateOrgMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="registration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Registration Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Registration Number</label>
                      <div className="p-2 border rounded bg-gray-50 font-mono">
                        {organization?.registrationNumber || "Not assigned"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Organization Type</label>
                      <div className="p-2 border rounded bg-gray-50 capitalize">
                        {organization?.type?.replace(/_/g, " ")}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Registration Date</label>
                      <div className="p-2 border rounded bg-gray-50">
                        {organization?.registrationDate 
                          ? new Date(organization.registrationDate).toLocaleDateString()
                          : "Not specified"
                        }
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Expiry Date</label>
                      <div className="p-2 border rounded bg-gray-50">
                        {organization?.expiryDate 
                          ? new Date(organization.expiryDate).toLocaleDateString()
                          : "Not specified"
                        }
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Principal Agent</label>
                    <div className="p-2 border rounded bg-gray-50">
                      {organization?.principalAgentId 
                        ? `Principal Agent ID: ${organization.principalAgentId}`
                        : "Not assigned"
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Annual Fee</label>
                      <div className="p-2 border rounded bg-gray-50">
                        ${organization?.annualFee || "Not set"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Payment Status</label>
                      <div className="p-2 border rounded bg-gray-50">
                        Current
                      </div>
                    </div>
                  </div>

                  <div>
                    <Form {...form}>
                      <FormField
                        control={form.control}
                        name="trustAccountDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trust Account Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={4} 
                                placeholder="Enter trust account information including bank name, account number, and other relevant details..."
                                data-testid="textarea-trust-account"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Form>
                  </div>

                  <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    className="gradient-button text-white border-0"
                    disabled={updateOrgMutation.isPending}
                    data-testid="button-save-financial"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Financial Information
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Compliance & Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Principal Agent Assignment</h3>
                        <p className="text-sm text-gray-600">Organization must have an assigned principal agent</p>
                      </div>
                      <div className="flex items-center">
                        {organization?.principalAgentId ? (
                          <span className="text-green-600 font-medium">✓ Assigned</span>
                        ) : (
                          <span className="text-red-600 font-medium">✗ Required</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Trust Account Registration</h3>
                        <p className="text-sm text-gray-600">Valid trust account details on file</p>
                      </div>
                      <div className="flex items-center">
                        {organization?.trustAccountDetails ? (
                          <span className="text-green-600 font-medium">✓ Complete</span>
                        ) : (
                          <span className="text-red-600 font-medium">✗ Required</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Annual Fee Payment</h3>
                        <p className="text-sm text-gray-600">Current year membership fee paid</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 font-medium">✓ Current</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Member Registration</h3>
                        <p className="text-sm text-gray-600">At least one active member registered</p>
                      </div>
                      <div className="flex items-center">
                        {activeMembers.length > 0 ? (
                          <span className="text-green-600 font-medium">✓ {activeMembers.length} Active</span>
                        ) : (
                          <span className="text-red-600 font-medium">✗ Required</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Actions Required</h3>
                    <div className="space-y-2">
                      {!organization?.principalAgentId && (
                        <Button 
                          variant="outline"
                          onClick={() => setLocation("/organization/members?action=assign-principal")}
                        >
                          Assign Principal Agent
                        </Button>
                      )}
                      {!organization?.trustAccountDetails && (
                        <Button 
                          variant="outline"
                          onClick={() => setLocation("/organization/profile?tab=financial")}
                        >
                          Add Trust Account Details
                        </Button>
                      )}
                      {activeMembers.length === 0 && (
                        <Button 
                          variant="outline"
                          onClick={() => setLocation("/member-registration")}
                        >
                          Register First Member
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <FormFooter />
      </div>
    </div>
  );
}