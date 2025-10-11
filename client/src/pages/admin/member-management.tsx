import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ModernModal } from "@/components/ui/modern-modal";
import { FormHeader } from "@/components/ui/form-header";
import { AdminPageLayout } from "@/components/AdminPageLayout";
import { SimplifiedAddMemberForm } from "@/components/SimplifiedAddMemberForm";
import { MultiStepAddMemberModal } from "@/components/MultiStepAddMemberModal";
import { BulkImportModal } from "@/components/BulkImportModal";
import {
  ReviewApplicationsModal,
  ExportDataModal,
  SendNotificationsModal,
  ManageRenewalsModal
} from "@/components/QuickActionsModals";
import { QuickActions } from "@/components/QuickActions";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { 
  Users, Search, Filter, Plus, Edit, 
  Eye, Download, Mail, Phone, CheckCircle, 
  XCircle, Clock, AlertTriangle, MoreVertical,
  Building2, Calendar, RefreshCw, UserPlus, FileText, Ban,
  UserCheck, UserX, Settings, Shield, Archive
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { Member, Organization } from "@shared/schema";

interface MemberWithOrganization extends Member {
  organization?: Organization;
}

export default function MemberManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<MemberWithOrganization | null>(null);
  const [memberDetailModalOpen, setMemberDetailModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [bulkImportModalOpen, setBulkImportModalOpen] = useState(false);
  const [reviewAppsModalOpen, setReviewAppsModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [renewalsModalOpen, setRenewalsModalOpen] = useState(false);
  const [assignOrgModalOpen, setAssignOrgModalOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [, setLocation] = useLocation();
  const { toast} = useToast();
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

  const { data: members = [], isLoading, refetch } = useQuery<MemberWithOrganization[]>({
    queryKey: ["/api/admin/members"],
  });

  const { data: organizations = [] } = useQuery<Organization[]>({
    queryKey: ["/api/organizations"],
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Member> }) =>
      apiRequest("PUT", `/api/members/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      toast({
        title: "Success",
        description: "Member updated successfully."
      });
      setSelectedMember(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update member.",
        variant: "destructive"
      });
    }
  });

  const assignOrganizationMutation = useMutation({
    mutationFn: ({ memberId, organizationId }: { memberId: string; organizationId: string | null }) =>
      apiRequest("PUT", `/api/admin/members/${memberId}/assign-organization`, { organizationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      toast({
        title: "Success",
        description: selectedOrgId ? "Member assigned to organization successfully." : "Member removed from organization."
      });
      setAssignOrgModalOpen(false);
      setSelectedOrgId("");
      setMemberDetailModalOpen(false);
      setSelectedMember(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign organization.",
        variant: "destructive"
      });
    }
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchQuery ||
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.membershipNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || member.membershipStatus === statusFilter;
    const matchesType = typeFilter === "all" || member.memberType === typeFilter;

    // Only show bonafide members (active status)
    const isBonafideMember = member.membershipStatus === "active";

    return matchesSearch && matchesStatus && matchesType && isBonafideMember;
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

  const handleStatusChange = (memberId: string, newStatus: string) => {
    updateMemberMutation.mutate({
      id: memberId,
      updates: { membershipStatus: newStatus as any }
    });
  };

  const exportMembers = () => {
    const csvContent = [
      ["Name", "Membership Number", "Email", "Type", "Status", "Organization", "Join Date"].join(","),
      ...filteredMembers.map(member => [
        `"${member.firstName} ${member.lastName}"`,
        member.membershipNumber || "",
        member.email,
        member.memberType.replace(/_/g, " "),
        member.membershipStatus || "",
        member.organization?.name || "",
        member.createdAt ? new Date(member.createdAt).toLocaleDateString() : ""
      ].join(","))
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eacz-members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{`
        .member-management-page-body {
          position: relative;
        }
        .member-management-page-body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url(/images/bgmain.png);
          background-size: 70%;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.2;
          z-index: 0;
          pointer-events: none;
        }
        .member-management-page-body > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
    <AdminPageLayout currentPage="members" className="member-management-page-body">
      <div className="p-6">
        <PageBreadcrumb items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "Member Management" }
        ]} className="mb-6" />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Member Management</h1>
          <p className="text-muted-foreground">Manage all registered estate agents and professionals</p>
        </div>

        {/* Quick Actions */}
        <QuickActions
          title="Quick Actions"
          description="Streamline your member management workflow"
          actions={[
            {
              icon: UserPlus,
              label: "Add Member",
              action: () => setAddMemberModalOpen(true),
              color: "text-blue-600",
              bg: "bg-blue-100",
              testId: "button-add-member"
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
              action: () => setLocation("/application-management"),
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
              testId: "button-export-members"
            },
            {
              icon: RefreshCw,
              label: "Renewals",
              action: () => setRenewalsModalOpen(true),
              color: "text-orange-600",
              bg: "bg-orange-100",
              testId: "button-manage-renewals"
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
        <div className="mb-8" />
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Button
              className="gradient-button text-white border-0"
              onClick={() => setAddMemberModalOpen(true)}
              data-testid="button-add-member-header"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
            <Button
              variant="outline"
              onClick={exportMembers}
              disabled={filteredMembers.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search-members"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32" data-testid="select-status-filter">
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
              <SelectTrigger className="w-40" data-testid="select-type-filter">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="real_estate_agent">Real Estate Agent</SelectItem>
                <SelectItem value="property_manager">Property Manager</SelectItem>
                <SelectItem value="principal_real_estate_agent">Principal Real Estate Agent</SelectItem>
                <SelectItem value="real_estate_negotiator">Real Estate Negotiator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Members ({filteredMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading members...</div>
            ) : filteredMembers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ background: 'linear-gradient(to right, #1034A6, #B0E0E6)' }}>
                      <th className="text-left py-3 px-4 text-white font-semibold">Full Name</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Membership #</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Member Type</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Organization</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Date Joined</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Expiry Date</th>
                      <th className="text-left py-3 px-4 text-white font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member, index) => (
                      <tr
                        key={member.id}
                        className={`border-b cursor-pointer transition-colors ${
                          index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50/30 hover:bg-blue-100/40'
                        }`}
                        onClick={() => {
                          setSelectedMember(member);
                          setMemberDetailModalOpen(true);
                        }}
                      >
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">
                          {member.membershipNumber}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm capitalize">
                            {member.memberType.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(member.membershipStatus || "")}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(member.membershipStatus || "")}
                              <span>{member.membershipStatus}</span>
                            </div>
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm">
                            {member.organization?.name || "Independent"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm">
                            {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm">
                            {member.createdAt ? (() => {
                              const expiryDate = new Date(member.createdAt);
                              expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                              return expiryDate.toLocaleDateString();
                            })() : "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center flex-wrap gap-2">
                            {member.membershipStatus === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(member.id, "active");
                                }}
                                data-testid={`button-approve-member-${member.id}`}
                              >
                                <UserCheck className="w-3 h-3 mr-1" />
                                <span className="text-xs">Approve</span>
                              </Button>
                            )}
                            {member.membershipStatus === "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(member.id, "revoked");
                                }}
                                data-testid={`button-revoke-member-${member.id}`}
                              >
                                <UserX className="w-3 h-3 mr-1" />
                                <span className="text-xs">Revoke</span>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-purple-600 border-purple-200 hover:bg-purple-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast({
                                  title: "Member Management",
                                  description: `Managing member: ${member.firstName} ${member.lastName}`,
                                });
                                setSelectedMember(member);
                                setMemberDetailModalOpen(true);
                              }}
                              data-testid={`button-manage-member-${member.id}`}
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              <span className="text-xs">Manage</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Members Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all" 
                    ? "Try adjusting your search criteria or filters."
                    : "Get started by adding your first member."
                  }
                </p>
                <Button 
                  className="gradient-button text-white border-0"
                  onClick={() => setLocation("/member-registration")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Member
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Modals */}
      <BulkImportModal
        open={bulkImportModalOpen}
        onOpenChange={setBulkImportModalOpen}
        type="members"
        onSuccess={refetch}
      />

      <ReviewApplicationsModal
        open={reviewAppsModalOpen}
        onOpenChange={setReviewAppsModalOpen}
        onSuccess={refetch}
      />

      <ExportDataModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        type="members"
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

      {/* Modern Member Management Modal */}
      {selectedMember && (
        <ModernModal
          open={memberDetailModalOpen}
          onOpenChange={setMemberDetailModalOpen}
          title={`${selectedMember.firstName} ${selectedMember.lastName}`}
          subtitle={`Member ID: ${selectedMember.membershipNumber || 'N/A'} • ${selectedMember.memberType.replace(/_/g, ' ')}`}
          icon={Users}
          colorVariant="blue"
          maxWidth="3xl"
          footer={{
            secondary: {
              label: "Close",
              onClick: () => {
                setMemberDetailModalOpen(false);
                setSelectedMember(null);
              },
              testId: "button-close-member-detail"
            },
            primary: {
              label: "Edit Profile",
              onClick: () => {
                setMemberDetailModalOpen(false);
                setSelectedMember(null);
                setLocation(`/member-registration?edit=${selectedMember.id}`);
              },
              testId: "button-edit-member-profile"
            }
          }}
        >
          <div className="space-y-6">
            {/* Status & Performance Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Member Status & Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-emerald-700 mb-2 block">Membership Status</label>
                  <Select 
                    value={selectedMember.membershipStatus || ""} 
                    onValueChange={(value) => handleStatusChange(selectedMember.id, value)}
                  >
                    <SelectTrigger className="border-emerald-300 focus:border-emerald-500 bg-white/80">
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
                  <label className="text-sm font-semibold text-emerald-700 mb-2 block">CPD Points Earned</label>
                  <div className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 rounded-lg font-bold text-emerald-800">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                      0 points
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-semibold text-blue-700 mb-2 block">Email Address</label>
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 rounded-lg text-blue-800 font-medium">
                    {selectedMember.email}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-blue-700 mb-2 block">Phone Number</label>
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 rounded-lg text-blue-800 font-medium">
                    {selectedMember.phone || "Not provided"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-blue-700 mb-2 block">National ID</label>
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 rounded-lg text-blue-800 font-medium">
                    {selectedMember.nationalId || "Not provided"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Professional Information Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-purple-700 mb-2 block">Member Type</label>
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-lg text-purple-800 font-medium capitalize">
                    {selectedMember.memberType.replace(/_/g, " ")}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-purple-700 mb-2 block">Organization</label>
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-lg text-purple-800 font-medium">
                    {selectedMember.organization?.name || "Independent Practitioner"}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-semibold text-purple-700 mb-2 block">Join Date</label>
                <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-lg text-purple-800 font-medium">
                  {selectedMember.createdAt ? new Date(selectedMember.createdAt).toLocaleDateString() : "Not available"}
                </div>
              </div>
            </div>
            
            {/* Quick Actions Section */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    setMemberDetailModalOpen(false);
                    setSelectedMember(null);
                    setLocation(`/certificate?member=${selectedMember.id}`);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    setSelectedOrgId(selectedMember.organizationId || "");
                    setAssignOrgModalOpen(true);
                  }}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Assign Organization
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => handleStatusChange(selectedMember.id, "active")}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Activate Member
                </Button>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    toast({
                      title: "Email Sent",
                      description: `Notification sent to ${selectedMember.firstName} ${selectedMember.lastName}`,
                    });
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </div>
          </div>
        </ModernModal>
      )}

      {/* Multi-Step Add Member Modal */}
      <MultiStepAddMemberModal
        open={addMemberModalOpen}
        onOpenChange={setAddMemberModalOpen}
      />

      {/* Other Quick Action Modals */}
      <BulkImportModal open={bulkImportModalOpen} onOpenChange={setBulkImportModalOpen} type="members" />
      <ReviewApplicationsModal open={reviewAppsModalOpen} onOpenChange={setReviewAppsModalOpen} />
      <ExportDataModal open={exportModalOpen} onOpenChange={setExportModalOpen} type="members" />
      <ManageRenewalsModal open={renewalsModalOpen} onOpenChange={setRenewalsModalOpen} />
      <SendNotificationsModal open={notificationsModalOpen} onOpenChange={setNotificationsModalOpen} />

      {/* Assign Organization Modal */}
      {selectedMember && (
        <ModernModal
          open={assignOrgModalOpen}
          onOpenChange={setAssignOrgModalOpen}
          title="Assign Organization"
          subtitle={`Assign ${selectedMember.firstName} ${selectedMember.lastName} to an organization`}
          icon={Building2}
          colorVariant="purple"
          maxWidth="xl"
          footer={{
            secondary: {
              label: "Cancel",
              onClick: () => {
                setAssignOrgModalOpen(false);
                setSelectedOrgId("");
              },
              variant: "outline",
            },
            primary: {
              label: assignOrganizationMutation.isPending ? "Assigning..." : "Assign Organization",
              onClick: () => {
                assignOrganizationMutation.mutate({
                  memberId: selectedMember.id,
                  organizationId: selectedOrgId || null
                });
              },
              disabled: assignOrganizationMutation.isPending,
              loading: assignOrganizationMutation.isPending,
            }
          }}
        >
          <div className="space-y-6">
            {/* Current Organization */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Current Organization
              </h3>
              <div className="bg-blue-100 p-3 rounded-lg border border-blue-300">
                <p className="text-sm font-medium text-blue-800">
                  {selectedMember.organization?.name || "Independent Practitioner"}
                </p>
              </div>
            </div>

            {/* Select Organization */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Select New Organization
              </h3>
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger className="w-full border-purple-300 focus:border-purple-500 bg-white">
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Independent Practitioner (No Organization)</SelectItem>
                  {organizations
                    .filter(org => org.status === 'active')
                    .map(org => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name} ({org.registrationNumber})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Info Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">Note</h4>
                  <p className="text-sm text-amber-700">
                    Assigning a member to an organization links them to that firm's activities and compliance records.
                    Select "Independent Practitioner" to remove organization assignment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModernModal>
      )}
    </AdminPageLayout>
    </>
  );
}