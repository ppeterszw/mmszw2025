import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Eye, User, Building2, Calendar, 
  Download, AlertTriangle, MessageSquare,
  Users, Plus
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MemberApplication, Document } from "@shared/schema";

interface ApplicationWithDocuments extends MemberApplication {
  documents?: Document[];
}

export default function ApplicationReview() {
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithDocuments | null>(null);
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

  const { data: applications = [], isLoading, refetch } = useQuery<ApplicationWithDocuments[]>({
    queryKey: ["/api/applications"],
  });

  // Organization applications query - now enabled with proper API endpoint
  const { data: organizationApplications = [], isLoading: isLoadingOrgApps } = useQuery<any[]>({
    queryKey: ["/api/organization-applications"],
    enabled: true, // Enable now that API endpoint is implemented
  });

  const reviewApplicationMutation = useMutation({
    mutationFn: ({ id, action, notes }: { id: string; action: string; notes?: string }) =>
      apiRequest("POST", `/api/applications/${id}/review`, { action, notes }),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Success",
        description: `Application ${action} successfully.`
      });
      setSelectedApplication(null);
      setReviewNotes("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process application.",
        variant: "destructive"
      });
    }
  });

  // Filter applications with improved logic that matches dashboard
  const pendingApplications = applications.filter(app => 
    ['submitted', 'under_review', 'document_verification', 'pending_approval', 'awaiting_documents'].includes(app.status || app.currentStage || '')
  );
  const underReviewApplications = applications.filter(app => 
    ['eligibility_review', 'committee_review', 'final_review'].includes(app.status || app.currentStage || '')
  );
  const processedApplications = applications.filter(app => 
    ['approved', 'rejected', 'completed'].includes(app.status || '')
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
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
      case "submitted":
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleReview = (action: string) => {
    if (selectedApplication) {
      reviewApplicationMutation.mutate({
        id: selectedApplication.id,
        action,
        notes: reviewNotes || undefined
      });
    }
  };

  const ApplicationCard = ({ application }: { application: ApplicationWithDocuments }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              {application.applicationType === "individual" ? (
                <User className="w-5 h-5 text-primary" />
              ) : (
                <Building2 className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">
                {application.firstName} {application.lastName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {application.applicationType} • {application.memberType.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(application.status || "")}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(application.status || "")}
              <span>{application.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            Applied: {new Date(application.createdAt || "").toLocaleDateString()}
          </div>
          
          <div className="flex items-center text-sm">
            <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
            {application.documents?.length || 0} documents uploaded
          </div>

          <div className="pt-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedApplication(application)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review Application
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Application Review - {application.firstName} {application.lastName}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <div className="p-2 border rounded">
                          {application.firstName} {application.lastName}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <div className="p-2 border rounded">{application.email}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <div className="p-2 border rounded">{application.phone || "Not provided"}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">National ID</label>
                        <div className="p-2 border rounded">{application.nationalId || "Not provided"}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Date of Birth</label>
                        <div className="p-2 border rounded">
                          {application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString() : "Not provided"}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Member Type</label>
                        <div className="p-2 border rounded capitalize">
                          {application.memberType.replace(/_/g, " ")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Education & Experience */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Education & Experience</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Education Level</label>
                        <div className="p-2 border rounded capitalize">
                          {application.educationLevel?.replace(/_/g, " ") || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Work Experience</label>
                        <div className="p-2 border rounded">
                          {application.workExperience || "Not provided"} years
                        </div>
                      </div>
                    </div>
                    {application.currentEmployer && (
                      <div className="mt-4">
                        <label className="text-sm font-medium">Current Employer</label>
                        <div className="p-2 border rounded">{application.currentEmployer}</div>
                      </div>
                    )}
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Uploaded Documents</h3>
                    {application.documents && application.documents.length > 0 ? (
                      <div className="space-y-2">
                        {application.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-500" />
                              <div>
                                <div className="font-medium">{doc.documentType}</div>
                                <div className="text-sm text-gray-500">{doc.fileName}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {doc.isVerified && (
                                <Badge variant="secondary">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 border rounded">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No documents uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Review Notes */}
                  {(application.status === "submitted" || application.currentStage === "eligibility_review") ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Review Notes</h3>
                      <Textarea
                        placeholder="Add review notes or feedback..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                  ) : application.reviewNotes && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Review Notes</h3>
                      <div className="p-3 border rounded bg-gray-50">
                        {application.reviewNotes}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {(application.status === "submitted" || application.currentStage === "eligibility_review") && (
                    <div className="flex space-x-4 pt-4 border-t">
                      <Button 
                        className="gradient-button text-white border-0"
                        onClick={() => handleReview("approved")}
                        disabled={reviewApplicationMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Application
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleReview("rejected")}
                        disabled={reviewApplicationMutation.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Application
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleReview("needs_applicant_action")}
                        disabled={reviewApplicationMutation.isPending}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Request More Info
                      </Button>
                    </div>
                  )}
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
      <AdminHeader currentPage="members" />
      
      <div className="p-6">
        <PageBreadcrumb items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "Application Review" }
        ]} className="mb-6" />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Application Review</h1>
          <p className="text-muted-foreground">Review and process membership applications</p>
        </div>
        
        <Tabs defaultValue="member-applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="member-applications" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Member Applications ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="organization-applications" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Organization Applications ({organizationApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="member-applications" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Individual Member Applications</h2>
              <p className="text-muted-foreground">Applications from individuals seeking membership registration</p>
            </div>
            
            {/* Sub-tabs for different member application statuses */}
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  Pending ({pendingApplications.length})
                </TabsTrigger>
                <TabsTrigger value="under-review">
                  Under Review ({underReviewApplications.length})
                </TabsTrigger>
                <TabsTrigger value="processed">
                  Processed ({processedApplications.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-8">Loading applications...</div>
                ) : pendingApplications.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pendingApplications.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Pending Applications</h3>
                      <p className="text-gray-500">All member applications have been reviewed.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="under-review" className="space-y-6">
                {underReviewApplications.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {underReviewApplications.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Applications Under Review</h3>
                      <p className="text-gray-500">No member applications currently under review.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="processed" className="space-y-6">
                {processedApplications.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {processedApplications.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Processed Applications</h3>
                      <p className="text-gray-500">No member applications have been processed yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="organization-applications" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Organization Applications</h2>
              <p className="text-muted-foreground">Applications from real estate firms and organizations seeking registration</p>
            </div>
            
            {isLoadingOrgApps ? (
              <div className="text-center py-8">Loading organization applications...</div>
            ) : organizationApplications.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {organizationApplications.map((orgApp) => (
                  <Card key={orgApp.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <Badge className={getStatusColor(orgApp.status || "draft")}>
                          {getStatusIcon(orgApp.status || "draft")}
                          <span className="ml-1 capitalize">{orgApp.status?.replace(/_/g, " ") || "Draft"}</span>
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-2" data-testid={`org-app-name-${orgApp.id}`}>
                        {JSON.parse(orgApp.orgProfile || '{}').legalName || 'Organization Name'}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        ID: {orgApp.applicationId || 'Pending'}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Submitted: {orgApp.submittedAt ? new Date(orgApp.submittedAt).toLocaleDateString() : 'Not submitted'}
                      </p>
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={!orgApp.submittedAt}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          disabled={!orgApp.submittedAt}
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Organization Applications</h3>
                  <p className="text-gray-500 mb-4">
                    No organization applications have been submitted yet.
                  </p>
                  <Button variant="outline" disabled>
                    <Plus className="w-4 h-4 mr-2" />
                    No Applications Available
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <FormFooter />
    </div>
  );
}