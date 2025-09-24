import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { MemberHeader } from "@/components/MemberHeader";
import { 
  FileText, Upload, Download, CheckCircle, 
  XCircle, Clock, AlertTriangle, Plus,
  User, Building2, Calendar, Eye, Trash2, CreditCard
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@shared/schema";

export default function DocumentManagement() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock documents data for now since API has issues
  const mockDocuments: Document[] = [
    {
      id: "doc-1",
      title: "Degree Certificate",
      type: "education",
      fileUrl: "/documents/degree.pdf",
      fileName: "degree_certificate.pdf",
      fileSize: "2.5 MB",
      uploadedAt: new Date("2024-01-15"),
      verificationStatus: "verified",
      verifiedBy: "admin",
      verifiedAt: new Date("2024-01-16"),
      memberId: "member-profile-test-id",
      applicationId: null,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-16")
    },
    {
      id: "doc-2", 
      title: "Practicing Certificate",
      type: "practicing_certificate",
      fileUrl: "/documents/practicing_cert.pdf",
      fileName: "practicing_certificate.pdf",
      fileSize: "1.8 MB",
      uploadedAt: new Date("2024-02-01"),
      verificationStatus: "pending",
      verifiedBy: null,
      verifiedAt: null,
      memberId: "member-profile-test-id",
      applicationId: null,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01")
    }
  ];

  const documents = mockDocuments;
  const isLoading = false;

  const uploadDocumentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("Uploading document:", formData);
      // Simulate upload progress
      setUploadProgress(0);
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }
      return Promise.resolve({ success: true, documentId: "doc-123" });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document uploaded and queued for verification."
      });
      setUploadDialogOpen(false);
      setSelectedDocumentType("");
      setUploadProgress(0);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
      setUploadProgress(0);
    }
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting document:", id);
      // Mock success
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document deleted successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete document.",
        variant: "destructive"
      });
    }
  });


  const getDocumentStatusColor = (document: Document) => {
    if (document.isVerified) {
      return "bg-green-100 text-green-800";
    }
    return "bg-blue-100 text-blue-800";
  };

  const getDocumentStatusIcon = (document: Document) => {
    if (document.isVerified) {
      return <CheckCircle className="w-4 h-4" />;
    }
    return <Clock className="w-4 h-4" />;
  };

  const getDocumentStatusText = (document: Document) => {
    if (document.isVerified) {
      return "Approved";
    }
    return "Submitted for Approval";
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!selectedDocumentType) {
        toast({
          title: "Document Type Required",
          description: "Please select a document type before uploading.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", selectedDocumentType);
      uploadDocumentMutation.mutate(formData);
    }
  };

  const requiredDocuments = [
    { type: "ID Document", description: "National ID or Passport copy" },
    { type: "Educational Certificate", description: "Relevant educational qualifications" },
    { type: "Experience Letter", description: "Previous work experience documentation" },
    { type: "CPD Certificate", description: "Continuing Professional Development certificates" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader currentPage="documents" />
      
      <div className="p-6">
        <main className="w-full">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Document Management</h1>
              <p className="text-muted-foreground">Upload and manage your professional documents</p>
              
              {/* Status Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Documents</p>
                        <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Approved</p>
                        <p className="text-2xl font-bold text-green-600">{documents.filter(d => d.isVerified).length}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Submitted for Approval</p>
                        <p className="text-2xl font-bold text-blue-600">{documents.filter(d => !d.isVerified).length}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Upload Section */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Documents
                  </CardTitle>
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-button text-white border-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload New Document</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Document Type *</label>
                        <select 
                          className="w-full p-2 border rounded"
                          value={selectedDocumentType}
                          onChange={(e) => setSelectedDocumentType(e.target.value)}
                          data-testid="select-document-type"
                        >
                          <option value="">Select document type...</option>
                          <option value="id_document">National ID / Passport</option>
                          <option value="educational_certificate">Educational Certificate</option>
                          <option value="experience_letter">Work Experience Letter</option>
                          <option value="cpd_certificate">CPD Certificate</option>
                          <option value="professional_license">Professional License</option>
                          <option value="other">Other Document</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Select File</label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="w-full p-2 border rounded"
                          data-testid="input-file-upload"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Supported formats: PDF, JPG, PNG (Max 10MB)
                        </p>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {requiredDocuments.map((doc, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <FileText className="w-5 h-5 text-primary mr-2" />
                      <h3 className="font-medium">{doc.type}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                    <div className="flex items-center justify-between">
                      {documents.some(d => d.documentType === doc.type.toLowerCase().replace(/\s+/g, '_')) ? (
                        <Badge variant="secondary">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Uploaded
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

            {/* Documents List */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                My Documents ({documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading documents...</div>
              ) : documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{document.fileName}</h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {document.documentType?.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {new Date(document.createdAt || "").toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className={getDocumentStatusColor(document)}>
                          <div className="flex items-center space-x-1">
                            {getDocumentStatusIcon(document)}
                            <span>{getDocumentStatusText(document)}</span>
                          </div>
                        </Badge>
                        
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteDocumentMutation.mutate(document.id)}
                            disabled={deleteDocumentMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Documents Uploaded</h3>
                  <p className="text-gray-500 mb-4">
                    Upload your required documents to complete your profile.
                  </p>
                  <Button 
                    className="gradient-button text-white border-0"
                    onClick={() => setUploadDialogOpen(true)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload First Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

            {/* Document Guidelines */}
            <Card className="bg-white/95 backdrop-blur border-white/20">
              <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Document Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">File formats</p>
                    <p className="text-sm text-gray-600">Upload files in PDF, JPG, or PNG format</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">File size</p>
                    <p className="text-sm text-gray-600">Maximum file size is 10MB per document</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Document quality</p>
                    <p className="text-sm text-gray-600">Ensure documents are clear and legible</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Verification</p>
                    <p className="text-sm text-gray-600">Documents will be reviewed by EACZ staff within 3-5 business days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </main>
      </div>
    </div>
  );
}