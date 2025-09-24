import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormHeader } from "@/components/ui/form-header";
import { Sidebar } from "@/components/navigation/Sidebar";
import { 
  Building2, Users, FileText, CreditCard, Award,
  Upload, Download, Eye, Trash2, Plus,
  CheckCircle, Clock, AlertTriangle, File, User,
  Calendar
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function OrganizationDocumentsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Mock documents data
  const mockDocuments = [
    {
      id: "doc-1",
      name: "Certificate of Incorporation",
      type: "incorporation_certificate",
      uploadDate: new Date("2024-01-15"),
      status: "approved",
      size: "2.4 MB",
      url: "/documents/incorporation.pdf"
    },
    {
      id: "doc-2",
      name: "Business License",
      type: "business_license",
      uploadDate: new Date("2024-02-01"),
      status: "approved",
      size: "1.8 MB",
      url: "/documents/business_license.pdf"
    },
    {
      id: "doc-3",
      name: "Trust Account Certificate",
      type: "trust_account",
      uploadDate: new Date("2024-02-15"),
      status: "submitted_for_approval",
      size: "3.2 MB",
      url: "/documents/trust_account.pdf"
    },
    {
      id: "doc-4",
      name: "Professional Indemnity Insurance",
      type: "insurance",
      uploadDate: new Date("2024-03-01"),
      status: "approved",
      size: "1.5 MB",
      url: "/documents/insurance.pdf"
    }
  ];

  const sidebarItems = [
    { icon: Building2, label: "Dashboard", href: "/organization/dashboard" },
    { icon: User, label: "Principal Agent", href: "/organization/principal" },
    { icon: Users, label: "Agents", href: "/organization/agents" },
    { icon: FileText, label: "Documents", href: "/organization/documents", active: true },
    { icon: Award, label: "Certificate", href: "/organization/certificate" },
    { icon: CreditCard, label: "Payments", href: "/organization/payments" },
    { icon: Calendar, label: "Renewals", href: "/organization/renewals" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "submitted_for_approval": return "bg-blue-100 text-blue-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "submitted_for_approval": return <Clock className="w-4 h-4" />;
      case "rejected": return <AlertTriangle className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "Approved";
      case "submitted_for_approval": return "Submitted for Approval";
      case "rejected": return "Rejected";
      default: return status.replace(/_/g, " ");
    }
  };

  const requiredDocuments = [
    { type: "Certificate of Incorporation", description: "Official company registration document" },
    { type: "Business License", description: "Valid business operating license" },
    { type: "Trust Account Certificate", description: "Trust account compliance certificate" },
    { type: "Professional Indemnity Insurance", description: "Current insurance coverage certificate" },
    { type: "Audited Financial Statements", description: "Latest audited financial statements" },
    { type: "Principal Agent Certificate", description: "Principal agent qualification certificate" }
  ];

  const handleUpload = () => {
    toast({
      title: "Upload Started",
      description: "Document upload initiated successfully."
    });
  };

  const handleDownload = (docName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${docName}...`
    });
  };

  const handleDelete = (docName: string) => {
    toast({
      title: "Document Deleted",
      description: `${docName} has been removed.`,
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      <FormHeader 
        title="EACZ Organization Portal"
        subtitle="Document Management"
      />
      
      <div className="flex min-h-screen">
        <Sidebar 
          items={sidebarItems}
          title="Organization Portal"
          subtitle="Manage your organization"
        />
        
        <main className="flex-1 p-6 pt-6 ml-64">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Document Management</h1>
              <p className="text-blue-100">Manage your organization's required documents</p>
              
              {/* Status Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Documents</p>
                        <p className="text-2xl font-bold text-gray-900">{mockDocuments.length}</p>
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
                        <p className="text-2xl font-bold text-green-600">{mockDocuments.filter(d => d.status === 'approved').length}</p>
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
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-blue-600">{mockDocuments.filter(d => d.status === 'submitted_for_approval').length}</p>
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
                  <CardTitle className="flex items-center text-gray-900">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Documents
                  </CardTitle>
                  <Button className="gradient-button text-white border-0" onClick={handleUpload}>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {requiredDocuments.map((doc, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center mb-2">
                        <FileText className="w-5 h-5 text-primary mr-2" />
                        <h3 className="font-medium">{doc.type}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                      <div className="flex items-center justify-between">
                        {mockDocuments.some(d => d.name.includes(doc.type.split(' ')[0])) ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Uploaded
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Upload className="w-3 h-3 mr-1" />
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
                <CardTitle className="flex items-center text-gray-900">
                  <FileText className="w-5 h-5 mr-2" />
                  Uploaded Documents ({mockDocuments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDocuments.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{document.name}</h3>
                          <p className="text-sm text-gray-600">
                            Uploaded: {document.uploadDate.toLocaleDateString()} • {document.size}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(document.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(document.status)}
                            <span>{getStatusText(document.status)}</span>
                          </div>
                        </Badge>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownload(document.name)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownload(document.name)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(document.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Guidelines */}
            <Card className="bg-white/95 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
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
                      <p className="text-sm text-gray-600">Upload files in PDF format for official documents</p>
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
                      <p className="text-sm text-gray-600">Ensure documents are clear, legible, and up-to-date</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Verification</p>
                      <p className="text-sm text-gray-600">Documents will be reviewed by EACZ staff within 5-7 business days</p>
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