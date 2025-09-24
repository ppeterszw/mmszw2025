import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
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
import { Sidebar } from "@/components/navigation/Sidebar";
import { 
  Users, Plus, Search, Mail, Phone, 
  Edit, Eye, Crown, UserPlus, Building2,
  CheckCircle, XCircle, Clock, AlertTriangle,
  FileText, Calendar, DollarSign, Settings,
  GraduationCap
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Member } from "@shared/schema";

export default function OrganizationMemberManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberDetailModalOpen, setMemberDetailModalOpen] = useState(false);
  const [inviteMemberModalOpen, setInviteMemberModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["/api/organization/members"],
    enabled: !!user,
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Member> }) =>
      apiRequest("PUT", `/api/organization/members/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organization/members"] });
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

  const inviteMemberMutation = useMutation({
    mutationFn: (email: string) =>
      apiRequest("POST", "/api/organization/members/invite", { email }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invitation sent successfully."
      });
      setInviteMemberModalOpen(false);
      setInviteEmail("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive"
      });
    }
  });

  const sidebarItems = [
    { icon: Building2, label: "Organization", href: "/organization/profile" },
    { icon: Users, label: "Members", href: "/organization/members", active: true },
    { icon: FileText, label: "Documents", href: "/organization/documents" },
    { icon: DollarSign, label: "Payments", href: "/organization/payments" },
    { icon: Calendar, label: "Events", href: "/organization/events" },
    { icon: Settings, label: "Settings", href: "/organization/settings" },
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchQuery || 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.membershipNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || member.membershipStatus === statusFilter;

    return matchesSearch && matchesStatus;
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

  const activeMembers = members.filter(m => m.membershipStatus === "active");
  const pendingMembers = members.filter(m => m.membershipStatus === "pending");
  const principalAgent = members.find(m => m.memberType === "principal_real_estate_agent");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      <Sidebar items={sidebarItems} title="Organization Portal" subtitle="EACZ Member Management" />
      
      <div className="pl-64">
        <FormHeader 
          title="Member Management"
          subtitle="Manage your organization's registered members"
        />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{members.length}</div>
                <p className="text-xs text-muted-foreground">All members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeMembers.length}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingMembers.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Principal Agent</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-purple-600">
                  {principalAgent ? "Assigned" : "Not Set"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {principalAgent ? principalAgent.firstName + " " + principalAgent.lastName : "Required"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                className="gradient-button text-white border-0"
                onClick={() => setLocation("/member-registration")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
              <Button 
                variant="outline"
                onClick={() => setInviteMemberModalOpen(true)}
                data-testid="button-invite-member"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
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
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="standby">Standby</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Members Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Organization Members ({filteredMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading members...</div>
              ) : filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredMembers.map((member) => (
                    <Card key={member.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              {member.memberType === "principal_real_estate_agent" ? (
                                <Crown className="w-6 h-6 text-purple-600" />
                              ) : (
                                <Users className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {member.firstName} {member.lastName}
                                {member.memberType === "principal_real_estate_agent" && (
                                  <Crown className="w-4 h-4 inline ml-2 text-purple-600" />
                                )}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {member.membershipNumber}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(member.membershipStatus || "")}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(member.membershipStatus || "")}
                              <span>{member.membershipStatus}</span>
                            </div>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                            {member.memberType.replace(/_/g, " ")}
                          </div>

                          <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                            <a 
                              href={`mailto:${member.email}`}
                              className="text-primary hover:underline"
                            >
                              {member.email}
                            </a>
                          </div>

                          {member.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                              <a 
                                href={`tel:${member.phone}`}
                                className="text-primary hover:underline"
                              >
                                {member.phone}
                              </a>
                            </div>
                          )}

                          {member.cpdPoints !== undefined && (
                            <div className="pt-2 border-t">
                              <span className="text-sm font-medium">
                                CPD Points: {member.cpdPoints}
                              </span>
                            </div>
                          )}

                          <div className="flex space-x-2 pt-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedMember(member);
                                setMemberDetailModalOpen(true);
                              }}
                              data-testid={`button-view-member-${member.id}`}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>

                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setLocation(`/member-registration?edit=${member.id}`)}
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
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Members Found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || statusFilter !== "all" 
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
        
        <FormFooter />
      </div>

      {/* Modern Invite Member Modal */}
      <ModernModal
        open={inviteMemberModalOpen}
        onOpenChange={setInviteMemberModalOpen}
        title="Invite New Member"
        subtitle="Send an invitation to join your organization"
        icon={UserPlus}
        colorVariant="green"
        maxWidth="xl"
        footer={{
          secondary: {
            label: "Cancel",
            onClick: () => {
              setInviteMemberModalOpen(false);
              setInviteEmail("");
            },
            testId: "button-cancel-invite"
          },
          primary: {
            label: "Send Invitation",
            onClick: () => inviteMemberMutation.mutate(inviteEmail),
            loading: inviteMemberMutation.isPending,
            testId: "button-send-invite"
          }
        }}
      >
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              The invited member will receive an email with instructions to join your organization and complete their registration with EACZ.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <Input 
              type="email" 
              placeholder="member@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              data-testid="input-invite-email"
              className="w-full"
            />
          </div>
        </div>
      </ModernModal>

      {/* Modern Member Detail Modal */}
      {selectedMember && (
        <ModernModal
          open={memberDetailModalOpen}
          onOpenChange={setMemberDetailModalOpen}
          title={`${selectedMember.firstName} ${selectedMember.lastName}`}
          subtitle={`${selectedMember.membershipNumber || 'N/A'} • ${selectedMember.memberType.replace(/_/g, ' ')}`}
          icon={Users}
          colorVariant="blue"
          maxWidth="2xl"
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
              label: "Edit Details",
              onClick: () => {
                setMemberDetailModalOpen(false);
                setSelectedMember(null);
                setLocation(`/member-registration?edit=${selectedMember.id}`);
              },
              testId: "button-edit-member-details"
            }
          }}
        >
          <div className="space-y-6">
            {/* Status Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Member Status & Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-blue-700 mb-2 block">Member Type</label>
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 rounded-lg text-blue-800 font-medium capitalize">
                    {selectedMember.memberType.replace(/_/g, " ")}
                    {selectedMember.memberType === "principal_real_estate_agent" && (
                      <Crown className="w-4 h-4 inline ml-2 text-purple-600" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-blue-700 mb-2 block">Status</label>
                  <Select 
                    value={selectedMember.membershipStatus || ""} 
                    onValueChange={(value) => updateMemberMutation.mutate({
                      id: selectedMember.id,
                      updates: { membershipStatus: value as any }
                    })}
                  >
                    <SelectTrigger className="border-blue-300 focus:border-blue-500 bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="standby">Standby</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-purple-700 mb-2 block">Email</label>
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-lg text-purple-800 font-medium">
                    {selectedMember.email}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-purple-700 mb-2 block">Phone</label>
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-lg text-purple-800 font-medium">
                    {selectedMember.phone || "Not provided"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Performance */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Professional Development
              </h3>
              <div className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 rounded-lg text-emerald-800 font-bold">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                  CPD Points: {selectedMember.cpdPoints || 0}
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            {selectedMember.memberType !== "principal_real_estate_agent" && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                  <Crown className="w-5 h-5 mr-2" />
                  Administrative Actions
                </h3>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => updateMemberMutation.mutate({
                    id: selectedMember.id,
                    updates: { memberType: "principal_real_estate_agent" as any }
                  })}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Make Principal Agent
                </Button>
              </div>
            )}
          </div>
        </ModernModal>
      )}
    </div>
  );
}