import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ModernModal } from "@/components/ui/modern-modal";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { AdminHeader } from "@/components/AdminHeader";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { BulkMemberImportDialog } from "@/components/BulkMemberImportDialog";
import { useAuth } from "@/hooks/use-auth";
import { 
  Building2, Search, Plus, Edit, Eye, Download, 
  Mail, Phone, MapPin, Users, CheckCircle, 
  XCircle, Clock, AlertTriangle, FileText, Settings, Calendar
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Organization, Member } from "@shared/schema";

interface OrganizationWithMembers extends Organization {
  members?: Member[];
  memberCount?: number;
}

export default function OrganizationManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedOrg, setSelectedOrg] = useState<OrganizationWithMembers | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

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

  const { data: organizations = [], isLoading, refetch } = useQuery<OrganizationWithMembers[]>({
    queryKey: ["/api/admin/organizations"],
  });

  const updateOrgMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Organization> }) =>
      apiRequest("PUT", `/api/organizations/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organizations"] });
      toast({
        title: "Success",
        description: "Organization updated successfully."
      });
      setSelectedOrg(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update organization.",
        variant: "destructive"
      });
    }
  });

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = !searchQuery || 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || org.membershipStatus === statusFilter;
    const matchesType = typeFilter === "all" || org.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "standby":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "revoked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "expired":
      case "revoked":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleStatusChange = (orgId: string, newStatus: string) => {
    updateOrgMutation.mutate({
      id: orgId,
      updates: { membershipStatus: newStatus as any }
    });
  };

  const exportOrganizations = () => {
    const csvContent = [
      ["Name", "Registration Number", "Type", "Status", "Email", "Phone", "Address", "Members"].join(","),
      ...filteredOrganizations.map(org => [
        `"${org.name}"`,
        org.registrationNumber || "",
        org.type.replace(/_/g, " "),
        org.membershipStatus || "",
        org.email,
        org.phone || "",
        `"${org.address || ""}"`,
        org.memberCount || 0
      ].join(","))
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eacz-organizations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentPage="organizations" />
      
      <div className="p-6">
        <PageBreadcrumb items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "Organization Management" }
        ]} className="mb-6" />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Organization Management</h1>
          <p className="text-muted-foreground">Manage all registered real estate firms and organizations</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button
              onClick={() => setLocation("/organization-registration")}
              className="h-24 flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 text-green-700 border-0"
              data-testid="button-add-organization"
            >
              <Building2 className="w-6 h-6 mb-2" />
              <span className="text-sm">Register Organization</span>
            </Button>
            <BulkMemberImportDialog onSuccess={() => {}} />
            <Button
              onClick={() => setLocation("/admin-dashboard/firms-applications")}
              className="h-24 flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 border-0"
              data-testid="button-review-applications"
            >
              <FileText className="w-6 h-6 mb-2" />
              <span className="text-sm">Review Applications</span>
            </Button>
            <Button
              onClick={exportOrganizations}
              className="h-24 flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-700 border-0"
              data-testid="button-export-organizations"
            >
              <Download className="w-6 h-6 mb-2" />
              <span className="text-sm">Export List</span>
            </Button>
            <Button
              onClick={() => setLocation("/admin-dashboard/renewals")}
              className="h-24 flex flex-col items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-700 border-0"
              data-testid="button-manage-renewals"
            >
              <Calendar className="w-6 h-6 mb-2" />
              <span className="text-sm">Manage Renewals</span>
            </Button>
            <Button
              onClick={() => toast({ title: "Feature Coming Soon", description: "Compliance monitoring feature will be available soon." })}
              className="h-24 flex flex-col items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 border-0"
              data-testid="button-compliance-check"
            >
              <AlertTriangle className="w-6 h-6 mb-2" />
              <span className="text-sm">Compliance Check</span>
            </Button>
            <Button
              onClick={() => toast({ title: "Feature Coming Soon", description: "Bulk email feature will be available soon." })}
              className="h-24 flex flex-col items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-0"
              data-testid="button-send-notifications"
            >
              <Mail className="w-6 h-6 mb-2" />
              <span className="text-sm">Send Notifications</span>
            </Button>
          </div>
        </div>
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              className="gradient-button text-white border-0"
              onClick={() => setLocation("/organization-registration")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Organization
            </Button>
            <Button 
              variant="outline"
              onClick={exportOrganizations}
              disabled={filteredOrganizations.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search-organizations"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="standby">Standby</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="real_estate_firm">Real Estate Firm</SelectItem>
                <SelectItem value="property_management_firm">Property Management</SelectItem>
                <SelectItem value="brokerage_firm">Brokerage Firm</SelectItem>
                <SelectItem value="development_firm">Development Firm</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Organizations Grid */}
        {isLoading ? (
          <div className="text-center py-8">Loading organizations...</div>
        ) : filteredOrganizations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrganizations.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{org.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {org.registrationNumber}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(org.membershipStatus || "")}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(org.membershipStatus || "")}
                        <span>{org.membershipStatus}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                      {org.type.replace(/_/g, " ")}
                    </div>

                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                      {org.memberCount || 0} members
                    </div>

                    {org.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                        <a 
                          href={`mailto:${org.email}`}
                          className="text-primary hover:underline truncate"
                        >
                          {org.email}
                        </a>
                      </div>
                    )}

                    {org.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <a 
                          href={`tel:${org.phone}`}
                          className="text-primary hover:underline"
                        >
                          {org.phone}
                        </a>
                      </div>
                    )}

                    {org.address && (
                      <div className="flex items-start text-sm">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground" />
                        <span className="line-clamp-2">{org.address}</span>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedOrg(org)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                      </Dialog>

                      <ModernModal
                        open={!!selectedOrg && selectedOrg.id === org.id}
                        onOpenChange={() => setSelectedOrg(null)}
                        title={selectedOrg?.name || org.name}
                        subtitle={`Organization Details - ${selectedOrg?.registrationNumber || org.registrationNumber}`}
                        icon={Building2}
                        colorVariant="purple"
                        maxWidth="2xl"
                      >
                        {selectedOrg && (
                          <div className="space-y-6">
                            {/* Status & Basic Info Section */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Status & Classification
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-semibold text-purple-700 mb-2 block">Membership Status</label>
                                  <Select 
                                    value={selectedOrg.membershipStatus || ""} 
                                    onValueChange={(value) => handleStatusChange(selectedOrg.id, value)}
                                  >
                                    <SelectTrigger className="border-purple-300 focus:border-purple-500 bg-white/80">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="standby">Standby</SelectItem>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="expired">Expired</SelectItem>
                                      <SelectItem value="revoked">Revoked</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-purple-700 mb-2 block">Organization Type</label>
                                  <div className="p-3 bg-purple-100 border border-purple-300 rounded-lg text-purple-800 font-medium capitalize">
                                    {selectedOrg.type.replace(/_/g, " ")}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Registration Info Section */}
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200">
                              <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Registration Information
                              </h3>
                              <div>
                                <label className="text-sm font-semibold text-indigo-700 mb-2 block">Registration Number</label>
                                <div className="p-3 bg-indigo-100 border border-indigo-300 rounded-lg font-mono text-indigo-800 font-bold text-center">
                                  {selectedOrg.registrationNumber || "Not assigned"}
                                </div>
                              </div>
                            </div>

                            {/* Contact Information Section */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                <Mail className="w-5 h-5 mr-2" />
                                Contact Information
                              </h3>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="text-sm font-semibold text-blue-700 mb-2 block">Email Address</label>
                                  <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg text-blue-800 font-medium">{selectedOrg.email}</div>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-blue-700 mb-2 block">Phone Number</label>
                                  <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg text-blue-800 font-medium">{selectedOrg.phone || "Not provided"}</div>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-semibold text-blue-700 mb-2 block">Physical Address</label>
                                <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg text-blue-800 font-medium">
                                  {selectedOrg.address || "Not provided"}
                                </div>
                              </div>
                            </div>

                            {/* Quick Actions Section */}
                            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200">
                              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Settings className="w-5 h-5 mr-2" />
                                Quick Actions
                              </h3>
                              <div className="flex space-x-3">
                                <Button 
                                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                                  onClick={() => setLocation(`/admin-dashboard/organizations/${selectedOrg.id}`)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Details
                                </Button>
                                <Button 
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                                  onClick={() => setLocation(`/admin-dashboard/organizations/${selectedOrg.id}/members`)}
                                >
                                  <Users className="w-4 h-4 mr-2" />
                                  View Members ({selectedOrg.memberCount || 0})
                                </Button>
                                <Button 
                                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                                  onClick={() => {
                                    toast({
                                      title: "Email Sent",
                                      description: `Notification sent to ${selectedOrg.name}`,
                                    });
                                  }}
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Email
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </ModernModal>

                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setLocation(`/admin-dashboard/organizations/${org.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Organizations Found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all" 
                  ? "Try adjusting your search criteria or filters."
                  : "Get started by registering your first organization."
                }
              </p>
              <Button 
                className="gradient-button text-white border-0"
                onClick={() => setLocation("/organization-registration")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Register Organization
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <FormFooter />
    </div>
  );
}