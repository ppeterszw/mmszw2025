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
import { BulkImportModal } from "@/components/BulkImportModal";
import { QuickActions } from "@/components/QuickActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MultiStepAddOrganizationModal } from "@/components/MultiStepAddOrganizationModal";
import {
  ReviewApplicationsModal,
  ExportDataModal,
  SendNotificationsModal,
  ManageRenewalsModal,
  ComplianceCheckModal
} from "@/components/QuickActionsModals";
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
  const [addOrgModalOpen, setAddOrgModalOpen] = useState(false);
  const [bulkImportModalOpen, setBulkImportModalOpen] = useState(false);
  const [reviewAppsModalOpen, setReviewAppsModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [renewalsModalOpen, setRenewalsModalOpen] = useState(false);
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);
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

    const matchesStatus = statusFilter === "all" || org.status === statusFilter;
    const matchesType = typeFilter === "all" || org.businessType === typeFilter;

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
      updates: { status: newStatus as any }
    });
  };

  const exportOrganizations = () => {
    const csvContent = [
      ["Name", "Registration Number", "Type", "Status", "Email", "Phone", "Address", "Members"].join(","),
      ...filteredOrganizations.map(org => [
        `"${org.name}"`,
        org.registrationNumber || "",
        org.businessType?.replace(/_/g, " ") || "",
        org.status || "",
        org.email,
        org.phone || "",
        `"${org.physicalAddress || ""}"`,
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
        <QuickActions
          title="Quick Actions"
          description="Streamline your organization management workflow"
          actions={[
            {
              icon: Building2,
              label: "Register Org",
              action: () => setAddOrgModalOpen(true),
              color: "text-emerald-600",
              bg: "bg-emerald-100",
              testId: "button-add-organization"
            },
            {
              icon: Users,
              label: "Bulk Import",
              action: () => setBulkImportModalOpen(true),
              color: "text-purple-600",
              bg: "bg-purple-100",
              testId: "button-bulk-import"
            },
            {
              icon: FileText,
              label: "Review Apps",
              action: () => setReviewAppsModalOpen(true),
              color: "text-green-600",
              bg: "bg-green-100",
              testId: "button-review-applications"
            },
            {
              icon: Download,
              label: "Export List",
              action: () => setExportModalOpen(true),
              color: "text-violet-600",
              bg: "bg-violet-100",
              testId: "button-export-organizations"
            },
            {
              icon: Calendar,
              label: "Renewals",
              action: () => setRenewalsModalOpen(true),
              color: "text-orange-600",
              bg: "bg-orange-100",
              testId: "button-manage-renewals"
            },
            {
              icon: AlertTriangle,
              label: "Compliance",
              action: () => setComplianceModalOpen(true),
              color: "text-rose-600",
              bg: "bg-rose-100",
              testId: "button-compliance-check"
            },
            {
              icon: Mail,
              label: "Notifications",
              action: () => setNotificationsModalOpen(true),
              color: "text-cyan-600",
              bg: "bg-cyan-100",
              testId: "button-send-notifications"
            }
          ]}
        />
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Button
              className="gradient-button text-white border-0"
              onClick={() => setAddOrgModalOpen(true)}
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

        {/* Organizations Table */}
        {isLoading ? (
          <div className="text-center py-8">Loading organizations...</div>
        ) : filteredOrganizations.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Registration Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.map((org, index) => (
                    <TableRow
                      key={org.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{org.name}</div>
                            <div className="text-sm text-gray-500">{org.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {org.registrationNumber}
                      </TableCell>
                      <TableCell className="capitalize">
                        {org.businessType?.replace(/_/g, " ") || "Not specified"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(org.status || "")}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(org.status || "")}
                            <span>{org.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                          {org.memberCount || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        {org.phone && (
                          <a href={`tel:${org.phone}`} className="text-primary hover:underline text-sm">
                            {org.phone}
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-purple-600 border-purple-200 hover:bg-purple-50"
                            onClick={() => setSelectedOrg(org)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            <span className="text-xs">View</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => setLocation(`/admin-dashboard/organizations/${org.id}`)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            <span className="text-xs">Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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

        {/* Organization Detail Modal */}
        {selectedOrg && (
          <ModernModal
            open={!!selectedOrg}
            onOpenChange={() => setSelectedOrg(null)}
            title={selectedOrg.name}
            subtitle={`Organization Details - ${selectedOrg.registrationNumber}`}
            icon={Building2}
            colorVariant="purple"
            maxWidth="4xl"
          >
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
                                    value={selectedOrg.status || ""}
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
                                    {selectedOrg.businessType?.replace(/_/g, " ") || "Not specified"}
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
                                  {selectedOrg.physicalAddress || "Not provided"}
                                </div>
                              </div>
                            </div>

                            {/* Members List Section */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Organization Members ({selectedOrg.members?.length || 0})
                              </h3>
                              {selectedOrg.members && selectedOrg.members.length > 0 ? (
                                <div className="space-y-2">
                                  {selectedOrg.members.map((member) => (
                                    <div key={member.id} className="bg-white/80 p-3 rounded-lg border border-green-200 flex items-center justify-between hover:shadow-md transition-shadow">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                          <Users className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                          <div className="font-medium text-green-800">{member.firstName} {member.lastName}</div>
                                          <div className="text-sm text-green-600">{member.membershipNumber}</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-green-700 border-green-300 capitalize">
                                          {member.memberType?.replace(/_/g, " ")}
                                        </Badge>
                                        <Badge className={member.membershipStatus === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                          {member.membershipStatus}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <Users className="w-12 h-12 text-green-300 mx-auto mb-2" />
                                  <p className="text-green-600">No members assigned to this organization yet.</p>
                                </div>
                              )}
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
                      </ModernModal>
        )}
      </div>

      {/* Quick Actions Modals */}
      <MultiStepAddOrganizationModal
        open={addOrgModalOpen}
        onOpenChange={setAddOrgModalOpen}
      />

      <BulkImportModal
        open={bulkImportModalOpen}
        onOpenChange={setBulkImportModalOpen}
        type="organizations"
        onSuccess={refetch}
      />

      <ReviewApplicationsModal
        open={reviewAppsModalOpen}
        onOpenChange={setReviewAppsModalOpen}
        onSuccess={refetch}
        type="organization"
      />

      <ExportDataModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        type="organizations"
      />

      <SendNotificationsModal
        open={notificationsModalOpen}
        onOpenChange={setNotificationsModalOpen}
        onSuccess={refetch}
      />

      <ManageRenewalsModal
        open={renewalsModalOpen}
        onOpenChange={setRenewalsModalOpen}
        onSuccess={refetch}
      />

      <ComplianceCheckModal
        open={complianceModalOpen}
        onOpenChange={setComplianceModalOpen}
        onSuccess={refetch}
      />
    </div>
  );
}