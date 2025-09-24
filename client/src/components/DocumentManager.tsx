import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, Filter, Download, Eye, Trash2, Upload, 
  FileText, CheckCircle, AlertCircle, Clock, X,
  SortAsc, SortDesc, Grid, List, Folder, FileCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { EnhancedDocumentUploader } from "./EnhancedDocumentUploader";

// Document type categories for better organization
const DOCUMENT_CATEGORIES = {
  education: {
    label: "Education Documents",
    icon: FileText,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  },
  identity: {
    label: "Identity Documents", 
    icon: FileCheck,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  },
  legal: {
    label: "Legal Documents",
    icon: FileText,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
  },
  financial: {
    label: "Financial Documents",
    icon: FileText,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  }
};

interface Document {
  id: string;
  docType: string;
  fileName: string;
  mime: string;
  sizeBytes: number;
  status: 'uploaded' | 'verified' | 'rejected';
  sha256?: string;
  fileKey?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentManagerProps {
  applicationId: string;
  applicationStatus?: string;
  canUpload?: boolean;
  canDelete?: boolean;
  showCategories?: boolean;
  maxFiles?: number;
}

export function DocumentManager({
  applicationId,
  applicationStatus,
  canUpload = true,
  canDelete = true,
  showCategories = true,
  maxFiles = 20
}: DocumentManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size" | "type">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showUploader, setShowUploader] = useState(false);
  const { toast } = useToast();

  // Fetch documents for the application
  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ['/api/public/applications', applicationId, 'documents'],
    enabled: !!applicationId
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/public/applications/${applicationId}/documents/${documentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
      return response.json();
    },
    onSuccess: (_, documentId) => {
      queryClient.invalidateQueries({
        queryKey: ['/api/public/applications', applicationId, 'documents']
      });
      toast({
        title: "Document deleted",
        description: "Document has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete document.",
        variant: "destructive",
      });
    }
  });

  // Document type configurations
  const documentTypeConfig = {
    // Education documents
    o_level_cert: { label: "O-Level Certificate", category: "education" },
    a_level_cert: { label: "A-Level Certificate", category: "education" },
    equivalent_cert: { label: "Equivalent Certificate", category: "education" },
    
    // Identity documents
    id_or_passport: { label: "ID or Passport", category: "identity" },
    birth_certificate: { label: "Birth Certificate", category: "identity" },
    police_clearance_director: { label: "Police Clearance", category: "identity" },
    
    // Legal documents
    certificate_incorporation: { label: "Certificate of Incorporation", category: "legal" },
    partnership_agreement: { label: "Partnership Agreement", category: "legal" },
    cr6: { label: "CR6 Form", category: "legal" },
    cr11: { label: "CR11 Form", category: "legal" },
    
    // Financial documents
    bank_trust_letter: { label: "Bank Trust Letter", category: "financial" },
    tax_clearance: { label: "Tax Clearance", category: "financial" },
    annual_return_1: { label: "Annual Return (Year 1)", category: "financial" },
    annual_return_2: { label: "Annual Return (Year 2)", category: "financial" },
    annual_return_3: { label: "Annual Return (Year 3)", category: "financial" },
    application_fee_pop: { label: "Application Fee Proof", category: "financial" },
  } as const;

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    const typedDocuments = documents as Document[];
    let filtered = typedDocuments.filter((doc: Document) => {
      const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           documentTypeConfig[doc.docType as keyof typeof documentTypeConfig]?.label
                             .toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || 
                             documentTypeConfig[doc.docType as keyof typeof documentTypeConfig]?.category === selectedCategory;
      
      const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort documents
    filtered.sort((a: Document, b: Document) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.fileName.localeCompare(b.fileName);
          break;
        case "date":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "size":
          comparison = a.sizeBytes - b.sizeBytes;
          break;
        case "type":
          const aType = documentTypeConfig[a.docType as keyof typeof documentTypeConfig]?.label || a.docType;
          const bType = documentTypeConfig[b.docType as keyof typeof documentTypeConfig]?.label || b.docType;
          comparison = aType.localeCompare(bType);
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [documents, searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // Group documents by category
  const documentsByCategory = useMemo(() => {
    const grouped = filteredAndSortedDocuments.reduce((acc: Record<string, Document[]>, doc: Document) => {
      const category = documentTypeConfig[doc.docType as keyof typeof documentTypeConfig]?.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);
    
    return grouped;
  }, [filteredAndSortedDocuments]);

  // Handle file upload completion
  const handleUploadComplete = (files: { fileKey: string; fileName: string; mimeType: string; size: number }[]) => {
    queryClient.invalidateQueries({
      queryKey: ['/api/public/applications', applicationId, 'documents']
    });
    setShowUploader(false);
    toast({
      title: "Upload complete",
      description: `${files.length} document(s) uploaded successfully.`,
    });
  };

  // Handle document download/view
  const handleDocumentAction = (doc: Document, action: 'view' | 'download') => {
    const url = `/api/object-storage/download?key=${encodeURIComponent(doc.fileKey || '')}`;
    if (action === 'download') {
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fileName;
      link.click();
    } else {
      window.open(url, '_blank');
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'uploaded':
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return CheckCircle;
      case 'rejected':
        return AlertCircle;
      case 'uploaded':
      default:
        return Clock;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load documents. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Document Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {(documents as Document[]).length} document(s) • {filteredAndSortedDocuments.length} shown
          </p>
        </div>
        
        {canUpload && (
          <Button
            onClick={() => setShowUploader(!showUploader)}
            className="gap-2"
            data-testid="button-toggle-uploader"
          >
            {showUploader ? <X className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {showUploader ? 'Close Uploader' : 'Upload Documents'}
          </Button>
        )}
      </div>

      {/* Upload Interface */}
      {showUploader && canUpload && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload New Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedDocumentUploader
              allowMultiple={true}
              maxFiles={maxFiles}
              onComplete={handleUploadComplete}
              applicationId={applicationId}
              className="max-w-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-documents"
              />
            </div>

            {/* Category Filter */}
            {showCategories && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48" data-testid="select-category-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(DOCUMENT_CATEGORIES).map(([key, category]) => (
                    <SelectItem key={key} value={key}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-40" data-testid="select-status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Options */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                data-testid="button-sort-order"
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none"
                data-testid="button-list-view"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
                data-testid="button-grid-view"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Display */}
      {filteredAndSortedDocuments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Folder className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || selectedCategory !== "all" || selectedStatus !== "all" 
                ? "Try adjusting your search or filters."
                : "Upload your first document to get started."}
            </p>
            {canUpload && !showUploader && (
              <Button onClick={() => setShowUploader(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div>
          {showCategories ? (
            // Category-based view
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({filteredAndSortedDocuments.length})</TabsTrigger>
                {Object.entries(DOCUMENT_CATEGORIES).map(([key, category]) => {
                  const count = documentsByCategory[key]?.length || 0;
                  return (
                    <TabsTrigger key={key} value={key}>
                      {category.label.split(' ')[0]} ({count})
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="all">
                <DocumentList
                  documents={filteredAndSortedDocuments}
                  viewMode={viewMode}
                  canDelete={canDelete}
                  onDelete={(id) => deleteDocumentMutation.mutate(id)}
                  onAction={handleDocumentAction}
                  documentTypeConfig={documentTypeConfig}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>

              {Object.entries(DOCUMENT_CATEGORIES).map(([key, category]) => (
                <TabsContent key={key} value={key}>
                  <DocumentList
                    documents={documentsByCategory[key] || []}
                    viewMode={viewMode}
                    canDelete={canDelete}
                    onDelete={(id) => deleteDocumentMutation.mutate(id)}
                    onAction={handleDocumentAction}
                    documentTypeConfig={documentTypeConfig}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getStatusIcon={getStatusIcon}
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            // Simple list view
            <DocumentList
              documents={filteredAndSortedDocuments}
              viewMode={viewMode}
              canDelete={canDelete}
              onDelete={(id) => deleteDocumentMutation.mutate(id)}
              onAction={handleDocumentAction}
              documentTypeConfig={documentTypeConfig}
              getStatusBadgeColor={getStatusBadgeColor}
              getStatusIcon={getStatusIcon}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Document List Component
interface DocumentListProps {
  documents: Document[];
  viewMode: "grid" | "list";
  canDelete: boolean;
  onDelete: (id: string) => void;
  onAction: (doc: Document, action: 'view' | 'download') => void;
  documentTypeConfig: any;
  getStatusBadgeColor: (status: string) => string;
  getStatusIcon: (status: string) => any;
}

function DocumentList({
  documents,
  viewMode,
  canDelete,
  onDelete,
  onAction,
  documentTypeConfig,
  getStatusBadgeColor,
  getStatusIcon
}: DocumentListProps) {
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="document-grid">
        {documents.map((doc) => {
          const StatusIcon = getStatusIcon(doc.status);
          const typeConfig = documentTypeConfig[doc.docType as keyof typeof documentTypeConfig];
          
          return (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <FileText className="w-8 h-8 text-gray-400" />
                  <Badge className={cn("text-xs", getStatusBadgeColor(doc.status))}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {doc.status}
                  </Badge>
                </div>
                
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1 truncate" title={doc.fileName}>
                  {doc.fileName}
                </h4>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {typeConfig?.label || doc.docType}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{formatFileSize(doc.sizeBytes)}</span>
                  <span>{formatDate(doc.createdAt)}</span>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAction(doc, 'view')}
                    className="flex-1"
                    data-testid={`button-view-${doc.id}`}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAction(doc, 'download')}
                    className="flex-1"
                    data-testid={`button-download-${doc.id}`}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(doc.id)}
                      className="text-red-600 hover:text-red-700"
                      data-testid={`button-delete-${doc.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="document-list">
      {documents.map((doc) => {
        const StatusIcon = getStatusIcon(doc.status);
        const typeConfig = documentTypeConfig[doc.docType as keyof typeof documentTypeConfig];
        
        return (
          <Card key={doc.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-gray-400 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {doc.fileName}
                    </h4>
                    <Badge className={cn("text-xs flex-shrink-0", getStatusBadgeColor(doc.status))}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {doc.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{typeConfig?.label || doc.docType}</span>
                    <span>{formatFileSize(doc.sizeBytes)}</span>
                    <span>{formatDate(doc.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAction(doc, 'view')}
                    data-testid={`button-view-${doc.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAction(doc, 'download')}
                    data-testid={`button-download-${doc.id}`}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(doc.id)}
                      className="text-red-600 hover:text-red-700"
                      data-testid={`button-delete-${doc.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}