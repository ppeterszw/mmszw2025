import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/navigation/Sidebar";
import { FormHeader } from "@/components/ui/form-header";
import { 
  FileText, Upload, Download, Eye, Search, Filter,
  Calendar, CheckCircle, AlertTriangle, Clock,
  User, CreditCard, Building2, Award
} from "lucide-react";
import { useLocation } from "wouter";

export default function MemberDocuments() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock documents data
  const mockDocuments = [
    {
      id: "1",
      name: "Professional Certificate",
      type: "certificate",
      status: "verified",
      uploadDate: "2024-01-15",
      size: "2.4 MB",
      description: "EACZ Professional Certificate"
    },
    {
      id: "2", 
      name: "Education Transcript",
      type: "education",
      status: "pending",
      uploadDate: "2024-01-10",
      size: "1.8 MB",
      description: "University Degree Transcript"
    },
    {
      id: "3",
      name: "Identity Document",
      type: "identity",
      status: "verified",
      uploadDate: "2024-01-05",
      size: "0.9 MB",
      description: "National ID Copy"
    },
    {
      id: "4",
      name: "Work Experience Letter",
      type: "experience",
      status: "under_review",
      uploadDate: "2024-01-12",
      size: "1.2 MB",
      description: "Employment Reference Letter"
    }
  ];

  const { data: documents = mockDocuments, isLoading } = useQuery({
    queryKey: ["/api/members/documents"],
    enabled: !!user
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "under_review":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "under_review":
        return <Badge className="bg-orange-100 text-orange-800">Under Review</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "certificate":
        return <Award className="w-5 h-5 text-blue-600" />;
      case "education":
        return <FileText className="w-5 h-5 text-purple-600" />;
      case "identity":
        return <User className="w-5 h-5 text-green-600" />;
      case "experience":
        return <Building2 className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredDocuments = (documents as any[] || []).filter((doc: any) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const sidebarItems = [
    { icon: User, label: "Dashboard", href: "/member-portal" },
    { icon: User, label: "My Profile", href: "/member/profile" },
    { icon: FileText, label: "My Documents", href: "/member/documents", active: true },
    { icon: Calendar, label: "Events", href: "/member/events" },
    { icon: CreditCard, label: "Payment History", href: "/member/payments" },
  ];

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      <Sidebar title="Member Portal" subtitle="Welcome back" items={sidebarItems} />
      <div className="ml-64 flex-1">
        <div className="p-6">
          <FormHeader
            title="My Documents"
            subtitle="Manage and view your uploaded documents"
          />

          <div className="max-w-6xl mx-auto space-y-6">
            {/* Document Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Verified</p>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                    <CheckCircle className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Pending</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                    <Clock className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Under Review</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total</p>
                      <p className="text-2xl font-bold">4</p>
                    </div>
                    <FileText className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upload and Filters */}
            <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-900">Document Management</CardTitle>
                  <Button className="gradient-button text-white border-0" data-testid="button-upload-document">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-documents"
                    />
                  </div>
                  
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="certificate">Certificates</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="identity">Identity</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Documents List */}
                <div className="space-y-4">
                  {filteredDocuments.map((document) => (
                    <div key={document.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getTypeIcon(document.type)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{document.name}</h3>
                            <p className="text-sm text-gray-600">{document.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-gray-500">Size: {document.size}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(document.status)}
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" data-testid={`button-view-${document.id}`}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" data-testid={`button-download-${document.id}`}>
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-600">Upload your first document to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Award className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Professional Certificate</h4>
                        <p className="text-sm text-gray-600">EACZ membership certificate</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                    </div>
                  </div>
                  
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-medium">Identity Document</h4>
                        <p className="text-sm text-gray-600">National ID or passport</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                    </div>
                  </div>
                  
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Education Transcript</h4>
                        <p className="text-sm text-gray-600">University degree transcript</p>
                      </div>
                      <Clock className="w-5 h-5 text-yellow-600 ml-auto" />
                    </div>
                  </div>
                  
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-6 h-6 text-orange-600" />
                      <div>
                        <h4 className="font-medium">Work Experience</h4>
                        <p className="text-sm text-gray-600">Employment reference letters</p>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-orange-600 ml-auto" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}