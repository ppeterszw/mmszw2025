import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModernModal } from "@/components/ui/modern-modal";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { AdminHeader } from "@/components/AdminHeader";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { useAuth } from "@/hooks/use-auth";
import { 
  FileText, Clock, CheckCircle, XCircle, 
  Eye, User, Calendar, Search, Filter,
  Download, AlertTriangle, MessageSquare, Mail,
  Edit, UserCheck, UserX, Settings, Shield, Archive
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface IndividualApplicant {
  id: string;
  applicantId: string;
  firstName: string;
  surname: string;
  email: string;
  status: string;
  emailVerified: boolean;
  applicationStartedAt?: Date;
  applicationCompletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Member {
  id: string;
  membershipNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  memberType: string;
  membershipStatus: string;
  joiningDate?: Date;
  expiryDate?: Date;
  cpdPoints: number;
  organizationName?: string;
  emailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function AgentsApplicationsReview() {
  const [selectedApplicant, setSelectedApplicant] = useState<IndividualApplicant | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviewNotes, setReviewNotes] = useState("");
  const [activeTab, setActiveTab] = useState("applications");
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

  const { data: applicants = [], isLoading, refetch } = useQuery<IndividualApplicant[]>({
    queryKey: ["/api/admin/applicants"],
  });

  const { data: members = [], isLoading: membersLoading } = useQuery<Member[]>({
    queryKey: ["/api/admin/members"],
  });

  const updateApplicantMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<IndividualApplicant> }) =>
      apiRequest("PUT", `/api/admin/applicants/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applicants"] });
      toast({
        title: "Success",
        description: "Application status updated successfully."
      });
      setSelectedApplicant(null);
      setReviewNotes("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update application.",
        variant: "destructive"
      });
    }
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
      setReviewNotes("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update member.",
        variant: "destructive"
      });
    }
  });

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = !searchQuery || 
      `${applicant.firstName} ${applicant.surname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.applicantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchQuery || 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || member.membershipStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filter by status for different tabs
  const registeredApplicants = filteredApplicants.filter(app => app.status === "registered");
  const emailVerifiedApplicants = filteredApplicants.filter(app => app.status === "email_verified");
  const reviewingApplicants = filteredApplicants.filter(app => app.status === "under_review");
  const processedApplicants = filteredApplicants.filter(app => 
    app.status === "approved" || app.status === "rejected"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "email_verified":
        return "bg-blue-100 text-blue-800";
      case "registered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "standby":
        return "bg-blue-100 text-blue-800";
      case "revoked":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "under_review":
        return <AlertTriangle className="w-4 h-4" />;
      case "email_verified":
        return <Mail className="w-4 h-4" />;
      case "registered":
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = (status: string) => {
    if (selectedApplicant) {
      updateApplicantMutation.mutate({
        id: selectedApplicant.id,
        updates: { status }
      });
    }
  };

  const handleMemberStatusUpdate = (status: string) => {
    if (selectedMember) {
      updateMemberMutation.mutate({
        id: selectedMember.id,
        updates: { membershipStatus: status }
      });
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentPage="members" />
      
      <div className="p-6">
        <PageBreadcrumb items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "AgentsHUB", href: "/admin-dashboard/members" },
          { label: "Individual Applications Review" }
        ]} className="mb-6" />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">AgentsHUB - Individual Member Management</h1>
          <p className="text-muted-foreground">Manage individual estate agent members and applications</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search-applications"
              />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Total: {filteredApplicants.length} applications
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications" data-testid="tab-applications">
              Applications ({filteredApplicants.length})
            </TabsTrigger>
            <TabsTrigger value="members" data-testid="tab-members">
              Members ({filteredMembers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            {isLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-secondary rounded-lg h-32"></div>
                ))}
              </div>
            ) : filteredApplicants.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Agent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Applicant ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Email Verified</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplicants.map((applicant) => (
                        <TableRow key={applicant.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                              <span>{applicant.firstName} {applicant.surname}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">{applicant.applicantId}</span>
                          </TableCell>
                          <TableCell>{applicant.email}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(applicant.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(applicant.status)}
                                <span className="capitalize">{applicant.status.replace('_', ' ')}</span>
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {applicant.emailVerified ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm">Verified</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-500">
                                <XCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm">Not Verified</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                                onClick={() => setSelectedApplicant(applicant)}
                                data-testid={`button-view-applicant-${applicant.id}`}
                                title="Review Application"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => updateApplicantMutation.mutate({
                                  id: applicant.id,
                                  updates: { status: "approved" }
                                })}
                                disabled={updateApplicantMutation.isPending}
                                data-testid={`button-approve-applicant-${applicant.id}`}
                                title="Approve Application"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => updateApplicantMutation.mutate({
                                  id: applicant.id,
                                  updates: { status: "rejected" }
                                })}
                                disabled={updateApplicantMutation.isPending}
                                data-testid={`button-reject-applicant-${applicant.id}`}
                                title="Reject Application"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 w-8 p-0 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                                onClick={() => updateApplicantMutation.mutate({
                                  id: applicant.id,
                                  updates: { status: "under_review" }
                                })}
                                disabled={updateApplicantMutation.isPending}
                                data-testid={`button-review-applicant-${applicant.id}`}
                                title="Set Under Review"
                              >
                                <AlertTriangle className="w-4 h-4" />
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
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Applications Found</h3>
                <p className="text-gray-500">Applications matching your criteria will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            {membersLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-secondary rounded-lg h-32"></div>
                ))}
              </div>
            ) : filteredMembers.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Current Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Membership #</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>CPD Points</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            {member.firstName} {member.lastName}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">{member.membershipNumber}</span>
                          </TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {member.memberType?.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getMemberStatusColor(member.membershipStatus)}>
                              {member.membershipStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">{member.cpdPoints}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                                onClick={() => setSelectedMember(member)}
                                data-testid={`button-view-member-${member.id}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 w-8 p-0 text-purple-600 border-purple-200 hover:bg-purple-50"
                                data-testid={`button-edit-member-${member.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 w-8 p-0 text-orange-600 border-orange-200 hover:bg-orange-50"
                                data-testid={`button-manage-member-${member.id}`}
                              >
                                <Settings className="w-4 h-4" />
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
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Members Found</h3>
                <p className="text-gray-500">All active members will appear here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* View Applicant Details Modal */}
        <ModernModal
          open={!!selectedApplicant}
          onOpenChange={() => setSelectedApplicant(null)}
          title={selectedApplicant ? `${selectedApplicant.firstName} ${selectedApplicant.surname}` : "Applicant Details"}
          subtitle="Review and process individual agent application"
          icon={UserCheck}
          colorVariant="indigo"
          maxWidth="2xl"
          footer={{
            primary: {
              label: "Close",
              onClick: () => setSelectedApplicant(null),
              testId: "button-close-applicant"
            }
          }}
        >
          {selectedApplicant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Application ID</label>
                  <div className="p-2 border rounded font-mono text-sm">
                    {selectedApplicant.applicantId}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email Status</label>
                  <div className="p-2 border rounded">
                    {selectedApplicant.emailVerified ? "Verified" : "Not Verified"}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <div className="p-2 border rounded">{selectedApplicant.email}</div>
              </div>

              <div>
                <label className="text-sm font-medium">Current Status</label>
                <div className="p-2 border rounded capitalize">
                  {selectedApplicant.status.replace('_', ' ')}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Review Notes</label>
                <Textarea
                  placeholder="Add notes about this application..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="mt-1"
                  data-testid="textarea-review-notes"
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleStatusUpdate("under_review")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  data-testid="button-under-review"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Under Review
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate("approved")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  data-testid="button-approve"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate("rejected")}
                  variant="destructive"
                  data-testid="button-reject"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </ModernModal>

        {/* View Member Details Modal */}
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : "Member Details"}
              </DialogTitle>
            </DialogHeader>
            
            {selectedMember && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Member Number</label>
                        <div className="p-2 bg-muted rounded font-mono text-sm">
                          {selectedMember.membershipNumber}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <div className="p-2 bg-muted rounded">
                          {selectedMember.firstName} {selectedMember.lastName}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <div className="p-2 bg-muted rounded">{selectedMember.email}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Member Type</label>
                        <div className="p-2 bg-muted rounded capitalize">
                          {selectedMember.memberType?.replace('_', ' ')}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Organization</label>
                        <div className="p-2 bg-muted rounded">
                          {selectedMember.organizationName || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Membership Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <div className="p-2 bg-muted rounded">
                          <Badge className={getMemberStatusColor(selectedMember.membershipStatus)}>
                            {selectedMember.membershipStatus}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">CPD Points</label>
                        <div className="p-2 bg-muted rounded text-lg font-semibold">
                          {selectedMember.cpdPoints}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Joining Date</label>
                        <div className="p-2 bg-muted rounded">
                          {selectedMember.joiningDate ? new Date(selectedMember.joiningDate).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                        <div className="p-2 bg-muted rounded">
                          {selectedMember.expiryDate ? new Date(selectedMember.expiryDate).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email Verified</label>
                        <div className="p-2 bg-muted rounded">
                          {selectedMember.emailVerified ? (
                            <span className="text-green-600 font-medium">✓ Verified</span>
                          ) : (
                            <span className="text-red-600 font-medium">✗ Not Verified</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Actions</h3>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleMemberStatusUpdate("active")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      data-testid="button-activate-member"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                    <Button 
                      onClick={() => handleMemberStatusUpdate("pending")}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      data-testid="button-pending-member"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Set Pending
                    </Button>
                    <Button 
                      onClick={() => handleMemberStatusUpdate("standby")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="button-standby-member"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Standby
                    </Button>
                    <Button 
                      onClick={() => handleMemberStatusUpdate("revoked")}
                      variant="destructive"
                      data-testid="button-revoke-member"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}