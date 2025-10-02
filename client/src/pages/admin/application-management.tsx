import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModernModal } from "@/components/ui/modern-modal";
import { Textarea } from "@/components/ui/textarea";
import { AdminHeader } from "@/components/AdminHeader";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { useAuth } from "@/hooks/use-auth";
import {
  FileText, Clock, CheckCircle, XCircle,
  Eye, User, Building2, Search,
  AlertTriangle, Mail, UserCheck, UserX, File, Download
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

interface UploadedDocument {
  id: string;
  applicationType: "individual" | "organization";
  applicationIdFk: string;
  docType: string;
  fileKey: string;
  fileName: string;
  mime?: string;
  sizeBytes?: number;
  status: "uploaded" | "verified" | "rejected";
  verifierUserId?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type Applicant = (IndividualApplicant | OrganizationApplicant) & { type: 'individual' | 'organization' };

export default function ApplicationManagement() {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [documentNotes, setDocumentNotes] = useState("");
  const [activeTab, setActiveTab] = useState("registered");
  const [mainTab, setMainTab] = useState<"applications" | "documents">("applications");
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

  const { data: individualApplicants = [], isLoading: loadingIndividual } = useQuery<IndividualApplicant[]>({
    queryKey: ["/api/admin/applicants"],
  });

  const { data: organizationApplicants = [], isLoading: loadingOrganization } = useQuery<OrganizationApplicant[]>({
    queryKey: ["/api/admin/organization-applicants"],
  });

  const { data: documents = [], isLoading: loadingDocuments } = useQuery<UploadedDocument[]>({
    queryKey: ["/api/admin/documents"],
  });

  const updateIndividualMutation = useMutation({
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

  const updateOrganizationMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<OrganizationApplicant> }) =>
      apiRequest("PUT", `/api/admin/organization-applicants/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organization-applicants"] });
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

  const updateDocumentMutation = useMutation({
    mutationFn: ({ applicationId, documentId, status, notes }: {
      applicationId: string;
      documentId: string;
      status: "verified" | "rejected";
      notes?: string
    }) =>
      apiRequest("PUT", `/api/admin/applications/${applicationId}/documents/${documentId}/verify`, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      toast({
        title: "Success",
        description: "Document status updated successfully."
      });
      setSelectedDocument(null);
      setDocumentNotes("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update document.",
        variant: "destructive"
      });
    }
  });

  // Combine all applicants with type tag
  const allApplicants: Applicant[] = [
    ...individualApplicants.map(app => ({ ...app, type: 'individual' as const })),
    ...organizationApplicants.map(app => ({ ...app, type: 'organization' as const }))
  ];

  const isLoading = loadingIndividual || loadingOrganization;

  // Filter applicants by search query
  const filteredApplicants = allApplicants.filter(applicant => {
    const name = applicant.type === 'individual'
      ? `${(applicant as IndividualApplicant).firstName} ${(applicant as IndividualApplicant).surname}`
      : (applicant as OrganizationApplicant).companyName;

    const matchesSearch = !searchQuery ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.applicantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Filter documents by search query
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.applicationIdFk.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Filter by status for different tabs (Applicants)
  const registeredApplicants = filteredApplicants.filter(app => app.status === "registered");
  const emailVerifiedApplicants = filteredApplicants.filter(app => app.status === "email_verified");
  const reviewingApplicants = filteredApplicants.filter(app => app.status === "under_review");
  const approvedApplicants = filteredApplicants.filter(app => app.status === "approved");
  const rejectedApplicants = filteredApplicants.filter(app => app.status === "rejected");

  // Filter by status for different tabs (Documents)
  const uploadedDocuments = filteredDocuments.filter(doc => doc.status === "uploaded");
  const verifiedDocuments = filteredDocuments.filter(doc => doc.status === "verified");
  const rejectedDocuments = filteredDocuments.filter(doc => doc.status === "rejected");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "email_verified":
        return "bg-blue-100 text-blue-800";
      case "registered":
      case "uploaded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "verified":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "under_review":
        return <AlertTriangle className="w-4 h-4" />;
      case "email_verified":
        return <Mail className="w-4 h-4" />;
      case "registered":
      case "uploaded":
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = (status: string) => {
    if (!selectedApplicant) return;

    if (selectedApplicant.type === 'individual') {
      updateIndividualMutation.mutate({
        id: selectedApplicant.id,
        updates: { status }
      });
    } else {
      updateOrganizationMutation.mutate({
        id: selectedApplicant.id,
        updates: { status }
      });
    }
  };

  const handleDocumentVerification = (status: "verified" | "rejected") => {
    if (!selectedDocument) return;

    updateDocumentMutation.mutate({
      applicationId: selectedDocument.applicationIdFk,
      documentId: selectedDocument.id,
      status,
      notes: documentNotes
    });
  };

  const getApplicantName = (applicant: Applicant) => {
    return applicant.type === 'individual'
      ? `${(applicant as IndividualApplicant).firstName} ${(applicant as IndividualApplicant).surname}`
      : (applicant as OrganizationApplicant).companyName;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDocType = (docType: string) => {
    return docType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const ApplicantTable = ({ applicants }: { applicants: Applicant[] }) => (
    <div className="bg-white rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left py-3 px-4 font-semibold">Name</th>
            <th className="text-left py-3 px-4 font-semibold">Type</th>
            <th className="text-left py-3 px-4 font-semibold">Applicant ID</th>
            <th className="text-left py-3 px-4 font-semibold">Email</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-left py-3 px-4 font-semibold">Email Verified</th>
            <th className="text-left py-3 px-4 font-semibold">Applied Date</th>
            <th className="text-left py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant, index) => (
            <tr
              key={applicant.id}
              className={`border-b cursor-pointer transition-colors ${
                index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50/30 hover:bg-blue-100/40'
              }`}
              onClick={() => {
                setSelectedApplicant(applicant);
              }}
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    {applicant.type === 'individual' ? (
                      <User className="w-4 h-4 text-primary" />
                    ) : (
                      <Building2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="font-medium">{getApplicantName(applicant)}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline" className="capitalize">
                  {applicant.type === 'individual' ? 'Individual' : 'Organization'}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <span className="font-mono text-sm">{applicant.applicantId}</span>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm">{applicant.email}</span>
              </td>
              <td className="py-3 px-4">
                <Badge className={getStatusColor(applicant.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(applicant.status)}
                    <span className="capitalize">{applicant.status.replace('_', ' ')}</span>
                  </div>
                </Badge>
              </td>
              <td className="py-3 px-4">
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
              </td>
              <td className="py-3 px-4">
                <span className="text-sm">
                  {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApplicant(applicant);
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    <span className="text-xs">Review</span>
                  </Button>
                  {applicant.status !== "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-green-600 border-green-200 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (applicant.type === 'individual') {
                          updateIndividualMutation.mutate({
                            id: applicant.id,
                            updates: { status: "approved" }
                          });
                        } else {
                          updateOrganizationMutation.mutate({
                            id: applicant.id,
                            updates: { status: "approved" }
                          });
                        }
                      }}
                      disabled={updateIndividualMutation.isPending || updateOrganizationMutation.isPending}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      <span className="text-xs">Approve</span>
                    </Button>
                  )}
                  {applicant.status !== "rejected" && applicant.status !== "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (applicant.type === 'individual') {
                          updateIndividualMutation.mutate({
                            id: applicant.id,
                            updates: { status: "rejected" }
                          });
                        } else {
                          updateOrganizationMutation.mutate({
                            id: applicant.id,
                            updates: { status: "rejected" }
                          });
                        }
                      }}
                      disabled={updateIndividualMutation.isPending || updateOrganizationMutation.isPending}
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      <span className="text-xs">Reject</span>
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const DocumentsTable = ({ documents }: { documents: UploadedDocument[] }) => (
    <div className="bg-white rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left py-3 px-4 font-semibold">Document Name</th>
            <th className="text-left py-3 px-4 font-semibold">Document Type</th>
            <th className="text-left py-3 px-4 font-semibold">Application Type</th>
            <th className="text-left py-3 px-4 font-semibold">Size</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-left py-3 px-4 font-semibold">Upload Date</th>
            <th className="text-left py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document, index) => (
            <tr
              key={document.id}
              className={`border-b cursor-pointer transition-colors ${
                index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50/30 hover:bg-blue-100/40'
              }`}
              onClick={() => {
                setSelectedDocument(document);
                setDocumentNotes(document.notes || "");
              }}
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <File className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{document.fileName}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline">
                  {formatDocType(document.docType)}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline" className="capitalize">
                  {document.applicationType}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm">{formatFileSize(document.sizeBytes)}</span>
              </td>
              <td className="py-3 px-4">
                <Badge className={getStatusColor(document.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(document.status)}
                    <span className="capitalize">{document.status}</span>
                  </div>
                </Badge>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm">
                  {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDocument(document);
                      setDocumentNotes(document.notes || "");
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    <span className="text-xs">View</span>
                  </Button>
                  {document.status === "uploaded" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDocumentMutation.mutate({
                            applicationId: document.applicationIdFk,
                            documentId: document.id,
                            status: "verified",
                            notes: ""
                          });
                        }}
                        disabled={updateDocumentMutation.isPending}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        <span className="text-xs">Verify</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDocument(document);
                          setDocumentNotes(document.notes || "");
                        }}
                        disabled={updateDocumentMutation.isPending}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        <span className="text-xs">Reject</span>
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentPage="applications" />

      <div className="p-6">
        <PageBreadcrumb items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "Application Management" }
        ]} className="mb-6" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Application Management</h1>
          <p className="text-muted-foreground">Review and manage all membership applications and uploaded documents</p>
        </div>

        {/* Main Tabs: Applications vs Documents */}
        <Tabs value={mainTab} onValueChange={(value) => setMainTab(value as "applications" | "documents")} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="documents">Documents Review</TabsTrigger>
          </TabsList>
        </Tabs>

        {mainTab === "applications" ? (
          <>
            {/* Search and Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Card className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{individualApplicants.length} Individual</span>
                  </div>
                </Card>
                <Card className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{organizationApplicants.length} Organization</span>
                  </div>
                </Card>
                <Card className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{allApplicants.length} Total</span>
                  </div>
                </Card>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="registered">
                  Registered ({registeredApplicants.length})
                </TabsTrigger>
                <TabsTrigger value="email_verified">
                  Email Verified ({emailVerifiedApplicants.length})
                </TabsTrigger>
                <TabsTrigger value="under_review">
                  Under Review ({reviewingApplicants.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedApplicants.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedApplicants.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="registered" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">Loading applications...</div>
                  </div>
                ) : registeredApplicants.length > 0 ? (
                  <ApplicantTable applicants={registeredApplicants} />
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Registered Applications</h3>
                    <p className="text-gray-500">Applications in registered status will appear here.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="email_verified" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">Loading applications...</div>
                  </div>
                ) : emailVerifiedApplicants.length > 0 ? (
                  <ApplicantTable applicants={emailVerifiedApplicants} />
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Email Verified Applications</h3>
                    <p className="text-gray-500">Applications with verified emails will appear here.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="under_review" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">Loading applications...</div>
                  </div>
                ) : reviewingApplicants.length > 0 ? (
                  <ApplicantTable applicants={reviewingApplicants} />
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Applications Under Review</h3>
                    <p className="text-gray-500">Applications currently being reviewed will appear here.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">Loading applications...</div>
                  </div>
                ) : approvedApplicants.length > 0 ? (
                  <ApplicantTable applicants={approvedApplicants} />
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Approved Applications</h3>
                    <p className="text-gray-500">Approved applications will appear here.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">Loading applications...</div>
                  </div>
                ) : rejectedApplicants.length > 0 ? (
                  <ApplicantTable applicants={rejectedApplicants} />
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Rejected Applications</h3>
                    <p className="text-gray-500">Rejected applications will appear here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            {/* Documents Review Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Card className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{uploadedDocuments.length} Pending Review</span>
                  </div>
                </Card>
                <Card className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{verifiedDocuments.length} Verified</span>
                  </div>
                </Card>
                <Card className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">{rejectedDocuments.length} Rejected</span>
                  </div>
                </Card>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-lg">
                <TabsTrigger value="uploaded">
                  Pending Review ({uploadedDocuments.length})
                </TabsTrigger>
                <TabsTrigger value="verified">
                  Verified ({verifiedDocuments.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedDocuments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="uploaded" className="mt-6">
                {loadingDocuments ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">Loading documents...</div>
                  </div>
                ) : uploadedDocuments.length > 0 ? (
                  <DocumentsTable documents={uploadedDocuments} />
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Pending Documents</h3>
                    <p className="text-gray-500">Documents awaiting review will appear here.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="verified" className="mt-6">
                {loadingDocuments ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">Loading documents...</div>
                  </div>
                ) : verifiedDocuments.length > 0 ? (
                  <DocumentsTable documents={verifiedDocuments} />
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Verified Documents</h3>
                    <p className="text-gray-500">Verified documents will appear here.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected" className="mt-6">
                {loadingDocuments ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">Loading documents...</div>
                  </div>
                ) : rejectedDocuments.length > 0 ? (
                  <DocumentsTable documents={rejectedDocuments} />
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Rejected Documents</h3>
                    <p className="text-gray-500">Rejected documents will appear here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Application Review Modal */}
        <ModernModal
          open={!!selectedApplicant}
          onOpenChange={() => setSelectedApplicant(null)}
          title={selectedApplicant ? getApplicantName(selectedApplicant) : "Application Details"}
          subtitle={selectedApplicant?.type === 'individual' ? "Individual Application Review" : "Organization Application Review"}
          icon={selectedApplicant?.type === 'individual' ? UserCheck : Building2}
          colorVariant="indigo"
          maxWidth="2xl"
          footer={{
            primary: {
              label: "Close",
              onClick: () => setSelectedApplicant(null)
            }
          }}
        >
          {selectedApplicant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Application Type</label>
                  <div className="p-2 border rounded capitalize">
                    {selectedApplicant.type}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Application ID</label>
                  <div className="p-2 border rounded font-mono text-sm">
                    {selectedApplicant.applicantId}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email Status</label>
                  <div className="p-2 border rounded">
                    {selectedApplicant.emailVerified ? (
                      <span className="text-green-600 font-medium">✓ Verified</span>
                    ) : (
                      <span className="text-red-600 font-medium">✗ Not Verified</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Status</label>
                  <div className="p-2 border rounded capitalize">
                    {selectedApplicant.status.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <div className="p-2 border rounded">{selectedApplicant.email}</div>
              </div>

              <div>
                <label className="text-sm font-medium">Review Notes</label>
                <Textarea
                  placeholder="Add notes about this application..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={() => handleStatusUpdate("under_review")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  disabled={updateIndividualMutation.isPending || updateOrganizationMutation.isPending}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Set Under Review
                </Button>
                <Button
                  onClick={() => handleStatusUpdate("approved")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={updateIndividualMutation.isPending || updateOrganizationMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusUpdate("rejected")}
                  variant="destructive"
                  disabled={updateIndividualMutation.isPending || updateOrganizationMutation.isPending}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </ModernModal>

        {/* Document Review Modal */}
        <ModernModal
          open={!!selectedDocument}
          onOpenChange={() => {
            setSelectedDocument(null);
            setDocumentNotes("");
          }}
          title={selectedDocument?.fileName || "Document Details"}
          subtitle="Document Review and Verification"
          icon={File}
          colorVariant="purple"
          maxWidth="2xl"
          footer={{
            primary: {
              label: "Close",
              onClick: () => {
                setSelectedDocument(null);
                setDocumentNotes("");
              }
            }
          }}
        >
          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Document Type</label>
                  <div className="p-2 border rounded">
                    {formatDocType(selectedDocument.docType)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">File Size</label>
                  <div className="p-2 border rounded">
                    {formatFileSize(selectedDocument.sizeBytes)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Application Type</label>
                  <div className="p-2 border rounded capitalize">
                    {selectedDocument.applicationType}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Status</label>
                  <div className="p-2 border rounded capitalize">
                    <Badge className={getStatusColor(selectedDocument.status)}>
                      {selectedDocument.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">File Name</label>
                <div className="p-2 border rounded font-mono text-sm">{selectedDocument.fileName}</div>
              </div>

              <div>
                <label className="text-sm font-medium">Uploaded On</label>
                <div className="p-2 border rounded">
                  {selectedDocument.createdAt ? new Date(selectedDocument.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Review Notes</label>
                <Textarea
                  placeholder="Add notes about this document..."
                  value={documentNotes}
                  onChange={(e) => setDocumentNotes(e.target.value)}
                  className="mt-1"
                />
              </div>

              {selectedDocument.status === "uploaded" && (
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={() => handleDocumentVerification("verified")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={updateDocumentMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Document
                  </Button>
                  <Button
                    onClick={() => handleDocumentVerification("rejected")}
                    variant="destructive"
                    disabled={updateDocumentMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Document
                  </Button>
                </div>
              )}

              {selectedDocument.status !== "uploaded" && selectedDocument.notes && (
                <div>
                  <label className="text-sm font-medium">Previous Notes</label>
                  <div className="p-2 border rounded bg-gray-50">
                    {selectedDocument.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </ModernModal>
      </div>
    </div>
  );
}
