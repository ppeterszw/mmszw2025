import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, X, FileText, AlertCircle, CheckCircle, 
  RefreshCw, Trash2, FolderOpen, Archive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Document type mapping for bulk uploads
const BULK_DOCUMENT_TYPES = {
  // Individual documents
  o_level_cert: "O-Level Certificate",
  a_level_cert: "A-Level Certificate", 
  equivalent_cert: "Equivalent Certificate",
  id_or_passport: "ID or Passport",
  birth_certificate: "Birth Certificate",
  
  // Organization documents
  bank_trust_letter: "Bank Trust Letter",
  certificate_incorporation: "Certificate of Incorporation",
  partnership_agreement: "Partnership Agreement", 
  cr6: "CR6 Form",
  cr11: "CR11 Form",
  tax_clearance: "Tax Clearance",
  annual_return_1: "Annual Return (Year 1)",
  annual_return_2: "Annual Return (Year 2)",
  annual_return_3: "Annual Return (Year 3)",
  police_clearance_director: "Police Clearance (Director)",
  
  // Payment documents
  application_fee_pop: "Application Fee Proof of Payment"
} as const;

type DocumentType = keyof typeof BULK_DOCUMENT_TYPES;

interface BulkFile {
  id: string;
  file: File;
  documentType?: DocumentType;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
  uploadUrl?: string;
}

interface BulkDocumentUploaderProps {
  applicationId: string;
  onComplete?: (uploadedFiles: Array<{ fileKey: string; fileName: string; mimeType: string; size: number; docType: string }>) => void;
  onError?: (error: string) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export function BulkDocumentUploader({
  applicationId,
  onComplete,
  onError,
  maxFiles = 10,
  disabled = false
}: BulkDocumentUploaderProps) {
  const [files, setFiles] = useState<BulkFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  // Handle file selection
  const handleFileSelection = useCallback((selectedFiles: FileList) => {
    if (disabled) return;
    
    const newFiles: BulkFile[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Check total file limit
      if (files.length + newFiles.length >= maxFiles) {
        toast({
          title: "File limit reached",
          description: `Maximum ${maxFiles} files allowed`,
          variant: "destructive",
        });
        break;
      }

      // Basic file validation
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        continue;
      }

      const bulkFile: BulkFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        status: 'pending',
        progress: 0
      };

      newFiles.push(bulkFile);
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Files added",
        description: `${newFiles.length} file(s) added for upload`,
      });
    }
  }, [disabled, files.length, maxFiles, toast]);

  // Handle drag and drop
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length) {
      handleFileSelection(droppedFiles);
    }
  }, [disabled, handleFileSelection]);

  // Update document type for a file
  const updateFileDocumentType = (fileId: string, docType: DocumentType) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, documentType: docType } : f
    ));
  };

  // Remove file
  const removeFile = (fileId: string) => {
    const controller = abortControllersRef.current.get(fileId);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(fileId);
    }
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Upload single file
  const uploadSingleFile = async (bulkFile: BulkFile): Promise<void> => {
    if (!bulkFile.documentType) {
      throw new Error("Document type not specified");
    }

    const abortController = new AbortController();
    abortControllersRef.current.set(bulkFile.id, abortController);

    try {
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === bulkFile.id 
          ? { ...f, status: 'uploading' as const, progress: 10 }
          : f
      ));

      // Step 1: Get secure presigned URL from backend with validation
      const presignResponse = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType: bulkFile.documentType,
          fileSize: bulkFile.file.size,
          mimeType: bulkFile.file.type,
          fileName: bulkFile.file.name,
          applicationId: applicationId
        }),
        signal: abortController.signal
      });

      if (!presignResponse.ok) {
        const errorData = await presignResponse.json().catch(() => ({ detail: 'Failed to get presigned URL' }));
        throw new Error(errorData.detail || `Presign request failed: ${presignResponse.status}`);
      }

      const { uploadUrl, fileKey } = await presignResponse.json();
      
      // Update progress
      setFiles(prev => prev.map(f => 
        f.id === bulkFile.id 
          ? { ...f, progress: 25 }
          : f
      ));

      // Step 2: Upload file to Google Cloud Storage using presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: bulkFile.file,
        headers: { 'Content-Type': bulkFile.file.type },
        signal: abortController.signal
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      // Update progress after upload
      setFiles(prev => prev.map(f => 
        f.id === bulkFile.id 
          ? { ...f, progress: 70 }
          : f
      ));

      // Step 3: Finalize upload - server validates, hashes, checks duplicates, and persists
      const finalizeResponse = await fetch('/api/uploads/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileKey,
          docType: bulkFile.documentType,
          fileName: bulkFile.file.name,
          mimeType: bulkFile.file.type,
          applicationId: applicationId,
          applicationType: 'individual' // Can be made dynamic if needed
        }),
        signal: abortController.signal
      });

      if (!finalizeResponse.ok) {
        const errorData = await finalizeResponse.json().catch(() => ({ detail: 'Failed to finalize upload' }));
        
        // Handle specific error cases with improved messaging
        if (finalizeResponse.status === 409) {
          // Duplicate file detected
          const { conflictInfo } = errorData;
          const conflictMessage = conflictInfo ? 
            `This file has already been uploaded as "${conflictInfo.existingFileName}" (${conflictInfo.existingDocType}) on ${new Date(conflictInfo.uploadedAt).toLocaleDateString()}.` :
            'A file with identical content already exists.';
          
          throw new Error(`Duplicate file detected: ${conflictMessage}`);
        } else if (finalizeResponse.status === 400) {
          if (errorData.code === 'FILE_VALIDATION_FAILED') {
            const errors = errorData.errors ? errorData.errors.join('; ') : errorData.detail;
            throw new Error(`File validation failed: ${errors}`);
          } else {
            throw new Error(errorData.detail || 'File validation failed');
          }
        } else if (finalizeResponse.status === 403) {
          throw new Error('You do not have permission to upload documents for this application.');
        } else if (finalizeResponse.status === 404) {
          throw new Error('Uploaded file not found. Please try uploading again.');
        } else {
          throw new Error(errorData.detail || `Upload finalization failed: ${finalizeResponse.status}`);
        }
      }

      const finalizeResult = await finalizeResponse.json();

      // Mark as completed with finalize result data
      setFiles(prev => prev.map(f => 
        f.id === bulkFile.id 
          ? { 
              ...f, 
              status: 'completed' as const, 
              progress: 100,
              uploadUrl,
              fileKey,
              documentId: finalizeResult.documentId,
              fileHash: finalizeResult.fileHash
            }
          : f
      ));

      console.log('Upload completed successfully:', finalizeResult);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Upload was cancelled
        return;
      }

      console.error('Upload error:', error);
      
      setFiles(prev => prev.map(f => 
        f.id === bulkFile.id 
          ? { 
              ...f, 
              status: 'error' as const, 
              error: error.message || 'Upload failed',
              progress: 0
            }
          : f
      ));

      throw error;
    } finally {
      abortControllersRef.current.delete(bulkFile.id);
    }
  };

  // Upload all files
  const uploadAllFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' && f.documentType);
    
    if (pendingFiles.length === 0) {
      toast({
        title: "No files ready",
        description: "All files need document types assigned before upload.",
        variant: "destructive",
      });
      return;
    }

    // Check for files without document types
    const filesWithoutTypes = files.filter(f => f.status === 'pending' && !f.documentType);
    if (filesWithoutTypes.length > 0) {
      toast({
        title: "Document types missing",
        description: `${filesWithoutTypes.length} file(s) need document types assigned.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    let completed = 0;
    const total = pendingFiles.length;
    const uploadedFiles: Array<{ fileKey: string; fileName: string; mimeType: string; size: number; docType: string }> = [];

    try {
      // Upload files with controlled concurrency (3 at a time)
      const batchSize = 3;
      for (let i = 0; i < pendingFiles.length; i += batchSize) {
        const batch = pendingFiles.slice(i, i + batchSize);
        
        await Promise.allSettled(batch.map(async (file) => {
          try {
            await uploadSingleFile(file);
            completed++;
            setUploadProgress((completed / total) * 100);
            
            // Extract file key from upload URL if available
            const uploadedFile = files.find(f => f.id === file.id);
            if (uploadedFile?.uploadUrl) {
              const url = new URL(uploadedFile.uploadUrl);
              uploadedFiles.push({
                fileKey: url.pathname,
                fileName: file.file.name,
                mimeType: file.file.type,
                size: file.file.size,
                docType: file.documentType!
              });
            }
          } catch (error) {
            completed++;
            setUploadProgress((completed / total) * 100);
            console.error(`Failed to upload ${file.file.name}:`, error);
          }
        }));
      }

      const successCount = files.filter(f => f.status === 'completed').length;
      const errorCount = files.filter(f => f.status === 'error').length;

      if (successCount > 0) {
        toast({
          title: "Bulk upload completed",
          description: `${successCount} file(s) uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}.`,
        });
        onComplete?.(uploadedFiles);
      }

      if (errorCount > 0 && successCount === 0) {
        toast({
          title: "Upload failed",
          description: `All ${errorCount} file(s) failed to upload.`,
          variant: "destructive",
        });
        onError?.("Bulk upload failed");
      }

    } catch (error) {
      console.error('Bulk upload error:', error);
      toast({
        title: "Upload error",
        description: "An error occurred during bulk upload.",
        variant: "destructive",
      });
      onError?.(error instanceof Error ? error.message : "Bulk upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Clear all files
  const clearAllFiles = () => {
    // Abort all uploads
    abortControllersRef.current.forEach(controller => controller.abort());
    abortControllersRef.current.clear();
    setFiles([]);
    setUploadProgress(0);
  };

  // Auto-detect document type based on filename
  const suggestDocumentType = (filename: string): DocumentType | undefined => {
    const lower = filename.toLowerCase();
    
    if (lower.includes('o-level') || lower.includes('olevel')) return 'o_level_cert';
    if (lower.includes('a-level') || lower.includes('alevel')) return 'a_level_cert';
    if (lower.includes('id') || lower.includes('passport')) return 'id_or_passport';
    if (lower.includes('birth')) return 'birth_certificate';
    if (lower.includes('incorporation')) return 'certificate_incorporation';
    if (lower.includes('partnership')) return 'partnership_agreement';
    if (lower.includes('cr6')) return 'cr6';
    if (lower.includes('cr11')) return 'cr11';
    if (lower.includes('tax')) return 'tax_clearance';
    if (lower.includes('bank') || lower.includes('trust')) return 'bank_trust_letter';
    if (lower.includes('police')) return 'police_clearance_director';
    if (lower.includes('payment') || lower.includes('proof')) return 'application_fee_pop';
    
    return undefined;
  };

  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === 'completed').length;
  const errorFiles = files.filter(f => f.status === 'error').length;
  const pendingFiles = files.filter(f => f.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Bulk Document Upload
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload multiple documents at once with automatic organization
          </p>
        </div>
        
        {totalFiles > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearAllFiles}
              disabled={isUploading}
              data-testid="button-clear-all-bulk"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button
              onClick={uploadAllFiles}
              disabled={isUploading || pendingFiles === 0}
              data-testid="button-upload-all-bulk"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload All ({pendingFiles})
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Upload Progress</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Status Summary */}
      {totalFiles > 0 && (
        <div className="flex gap-2 text-sm">
          {pendingFiles > 0 && (
            <Badge variant="secondary" className="text-blue-600">
              {pendingFiles} pending
            </Badge>
          )}
          {completedFiles > 0 && (
            <Badge variant="secondary" className="text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              {completedFiles} completed
            </Badge>
          )}
          {errorFiles > 0 && (
            <Badge variant="destructive">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errorFiles} failed
            </Badge>
          )}
        </div>
      )}

      {/* Drop Zone */}
      <Card className={cn(
        "border-2 border-dashed transition-colors",
        isDragging && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
        disabled && "opacity-50 cursor-not-allowed"
      )}>
        <CardContent className="p-8">
          <div
            className="text-center space-y-4"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="flex justify-center">
              {isDragging ? (
                <FolderOpen className="w-16 h-16 text-blue-500" />
              ) : (
                <Archive className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {isDragging ? "Drop files here" : "Drag and drop multiple files"}
              </p>
              <p className="text-sm text-gray-500">
                or click to browse and select multiple files
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: PDF, JPG, PNG, DOC, DOCX • Max 10MB per file • Up to {maxFiles} files
              </p>
            </div>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              size="lg"
              data-testid="button-browse-bulk-files"
            >
              <Upload className="w-5 h-5 mr-2" />
              Select Multiple Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => e.target.files && handleFileSelection(e.target.files)}
              className="hidden"
              disabled={disabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {totalFiles > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Selected Files ({totalFiles})
          </h4>
          
          {files.some(f => f.status === 'pending' && !f.documentType) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please assign document types to all files before uploading. Files with similar names have suggested types.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3" data-testid="bulk-file-list">
            {files.map((bulkFile) => {
              const suggestedType = suggestDocumentType(bulkFile.file.name);
              
              return (
                <Card key={bulkFile.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-gray-400 flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {bulkFile.file.name}
                          </h5>
                          {bulkFile.status === 'completed' && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Uploaded
                            </Badge>
                          )}
                          {bulkFile.status === 'error' && (
                            <Badge variant="destructive">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                          {bulkFile.status === 'uploading' && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Uploading...
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Size: {(bulkFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                        
                        {bulkFile.status === 'uploading' && (
                          <Progress value={bulkFile.progress} className="h-1 mb-2" />
                        )}
                        
                        {bulkFile.status === 'error' && bulkFile.error && (
                          <p className="text-xs text-red-600 mb-2">{bulkFile.error}</p>
                        )}
                        
                        {/* Document Type Selection */}
                        {bulkFile.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <Select
                              value={bulkFile.documentType || ""}
                              onValueChange={(value) => updateFileDocumentType(bulkFile.id, value as DocumentType)}
                            >
                              <SelectTrigger className="w-64" data-testid={`select-doc-type-${bulkFile.id}`}>
                                <SelectValue placeholder="Select document type..." />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(BULK_DOCUMENT_TYPES).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>
                                    {label}
                                    {key === suggestedType && " (Suggested)"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {suggestedType && !bulkFile.documentType && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateFileDocumentType(bulkFile.id, suggestedType)}
                                data-testid={`button-suggest-${bulkFile.id}`}
                              >
                                Use Suggested
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {bulkFile.status === 'error' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setFiles(prev => prev.map(f => 
                                f.id === bulkFile.id 
                                  ? { ...f, status: 'pending' as const, error: undefined }
                                  : f
                              ));
                            }}
                            data-testid={`button-retry-${bulkFile.id}`}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFile(bulkFile.id)}
                          disabled={bulkFile.status === 'uploading'}
                          data-testid={`button-remove-${bulkFile.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}