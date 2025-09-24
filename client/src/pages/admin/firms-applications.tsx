import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { AdminHeader } from "@/components/AdminHeader";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { useAuth } from "@/hooks/use-auth";
import { 
  FileText, Clock, CheckCircle, XCircle, 
  Eye, Building2, Calendar, Search,
  Download, AlertTriangle, MessageSquare, Mail
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OrganizationApplicant {
  id: string;
  applicantId: string;
  companyName: string;
  email: string;
  status: string;
  emailVerified: boolean;
  applicationStartedAt?: Date;
  applicationCompletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function FirmsApplicationsReview() {
  const [selectedApplicant, setSelectedApplicant] = useState<OrganizationApplicant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviewNotes, setReviewNotes] = useState("");
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

  const { data: orgApplicants = [], isLoading, refetch } = useQuery<OrganizationApplicant[]>({
    queryKey: ["/api/admin/organization-applicants"],
  });

  const updateOrgApplicantMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<OrganizationApplicant> }) =>
      apiRequest("PUT", `/api/admin/organization-applicants/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organization-applicants"] });
      toast({
        title: "Success",
        description: "Organization application status updated successfully."
      });
      setSelectedApplicant(null);
      setReviewNotes("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update organization application.",
        variant: "destructive"
      });
    }
  });

  const filteredApplicants = orgApplicants.filter(applicant => {
    const matchesSearch = !searchQuery || 
      applicant.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.applicantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;

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
      updateOrgApplicantMutation.mutate({
        id: selectedApplicant.id,
        updates: { status }
      });
    }
  };

  const ApplicationCard = ({ applicant }: { applicant: OrganizationApplicant }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {applicant.companyName}
              </CardTitle>
              <p className="text-sm text-muted-foreground font-mono">
                {applicant.applicantId}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(applicant.status)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(applicant.status)}
              <span className="capitalize">{applicant.status.replace('_', ' ')}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
            {applicant.email}
          </div>
          
          {applicant.emailVerified && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Email Verified
            </div>
          )}

          {applicant.createdAt && (
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              Applied: {new Date(applicant.createdAt).toLocaleDateString()}
            </div>
          )}

          <div className="flex space-x-2 pt-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedApplicant(applicant)}
                  data-testid={`button-view-org-applicant-${applicant.id}`}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{applicant.companyName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Application ID</label>
                      <div className="p-2 border rounded font-mono text-sm">
                        {applicant.applicantId}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Status</label>
                      <div className="p-2 border rounded">
                        {applicant.emailVerified ? "Verified" : "Not Verified"}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Company Email</label>
                    <div className="p-2 border rounded">{applicant.email}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Current Status</label>
                    <div className="p-2 border rounded capitalize">
                      {applicant.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Review Notes</label>
                    <Textarea
                      placeholder="Add notes about this organization application..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="mt-1"
                      data-testid="textarea-org-review-notes"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleStatusUpdate("under_review")}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      data-testid="button-org-under-review"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Under Review
                    </Button>
                    <Button 
                      onClick={() => handleStatusUpdate("approved")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      data-testid="button-org-approve"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleStatusUpdate("rejected")}
                      variant="destructive"
                      data-testid="button-org-reject"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentPage="organizations" />
      
      <div className="p-6">
        <PageBreadcrumb items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "FirmsHUB", href: "/admin-dashboard/organizations" },
          { label: "Organization Applications Review" }
        ]} className="mb-6" />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Organization Applications</h1>
          <p className="text-muted-foreground">Review and manage real estate firm and organization membership applications</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search organization applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search-org-applications"
              />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Total: {filteredApplicants.length} applications
          </div>
        </div>

        <Tabs defaultValue="registered" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="registered" data-testid="tab-org-registered">
              Registered ({registeredApplicants.length})
            </TabsTrigger>
            <TabsTrigger value="verified" data-testid="tab-org-verified">
              Email Verified ({emailVerifiedApplicants.length})
            </TabsTrigger>
            <TabsTrigger value="review" data-testid="tab-org-review">
              Under Review ({reviewingApplicants.length})
            </TabsTrigger>
            <TabsTrigger value="processed" data-testid="tab-org-processed">
              Processed ({processedApplicants.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registered" className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : registeredApplicants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredApplicants.map((applicant) => (
                  <ApplicationCard key={applicant.id} applicant={applicant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No New Organization Registrations</h3>
                <p className="text-gray-500">All new organization registrations will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="verified" className="mt-6">
            {emailVerifiedApplicants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {emailVerifiedApplicants.map((applicant) => (
                  <ApplicationCard key={applicant.id} applicant={applicant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Email Verified Applications</h3>
                <p className="text-gray-500">Organization applications with verified emails will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="review" className="mt-6">
            {reviewingApplicants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviewingApplicants.map((applicant) => (
                  <ApplicationCard key={applicant.id} applicant={applicant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Applications Under Review</h3>
                <p className="text-gray-500">Organization applications currently being reviewed will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="processed" className="mt-6">
            {processedApplicants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedApplicants.map((applicant) => (
                  <ApplicationCard key={applicant.id} applicant={applicant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Processed Applications</h3>
                <p className="text-gray-500">Approved and rejected organization applications will appear here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <FormFooter />
    </div>
  );
}