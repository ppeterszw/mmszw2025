import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, X, FileText, AlertCircle, CheckCircle, 
  Eye, Download, Trash2, RefreshCw, Image as ImageIcon,
  FileVideo, FileAudio, File as FileIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

// Document type categories with allowed file types
const DOCUMENT_TYPE_CONFIG = {
  // Individual documents
  o_level_cert: { 
    label: "O-Level Certificate", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024, // 20MB
    description: "Upload your O-Level certificate",
    color: "from-blue-500 to-blue-600"
  },
  a_level_cert: { 
    label: "A-Level Certificate", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload your A-Level certificate",
    color: "from-green-500 to-green-600"
  },
  equivalent_cert: { 
    label: "Equivalent Certificate", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload equivalent qualification certificate",
    color: "from-purple-500 to-purple-600"
  },
  id_or_passport: { 
    label: "ID or Passport", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload your national ID or passport",
    color: "from-indigo-500 to-indigo-600"
  },
  birth_certificate: { 
    label: "Birth Certificate", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload your birth certificate",
    color: "from-pink-500 to-pink-600"
  },
  // Organization documents  
  bank_trust_letter: { 
    label: "Bank Trust Letter", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload bank trust account letter",
    color: "from-teal-500 to-teal-600"
  },
  certificate_incorporation: { 
    label: "Certificate of Incorporation", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload certificate of incorporation",
    color: "from-orange-500 to-orange-600"
  },
  partnership_agreement: { 
    label: "Partnership Agreement", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload partnership agreement document",
    color: "from-red-500 to-red-600"
  },
  cr6: { 
    label: "CR6 Form", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload CR6 form",
    color: "from-cyan-500 to-cyan-600"
  },
  cr11: { 
    label: "CR11 Form", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload CR11 form",
    color: "from-emerald-500 to-emerald-600"
  },
  tax_clearance: { 
    label: "Tax Clearance", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload tax clearance certificate",
    color: "from-yellow-500 to-yellow-600"
  },
  annual_return_1: { 
    label: "Annual Return (Year 1)", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload first year annual return",
    color: "from-blue-500 to-cyan-500"
  },
  annual_return_2: { 
    label: "Annual Return (Year 2)", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload second year annual return",
    color: "from-green-500 to-teal-500"
  },
  annual_return_3: { 
    label: "Annual Return (Year 3)", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload third year annual return",
    color: "from-purple-500 to-pink-500"
  },
  police_clearance_director: { 
    label: "Police Clearance (Director)", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload police clearance for director",
    color: "from-slate-500 to-slate-600"
  },
  // Payment documents
  application_fee_pop: { 
    label: "Application Fee Proof of Payment", 
    accept: ".pdf,.jpg,.jpeg,.png,.svg",
    maxSize: 20 * 1024 * 1024,
    description: "Upload proof of payment for application fee",
    color: "from-emerald-500 to-green-500"
  }
} as const;

type DocumentType = keyof typeof DOCUMENT_TYPE_CONFIG;

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
  uploadUrl?: string;
  fileKey?: string;
  documentId?: string;
  fileHash?: string;
}

interface EnhancedDocumentUploaderProps {
  documentType?: DocumentType;
  allowMultiple?: boolean;
  maxFiles?: number;
  onComplete?: (files: { fileKey: string; fileName: string; mimeType: string; size: number }[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  applicationId?: string;
}

export function EnhancedDocumentUploader({
  documentType,
  allowMultiple = false,
  maxFiles = 5,
  onComplete,
  onError,
  disabled = false,
  className,
  applicationId
}: EnhancedDocumentUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | "">(documentType || "");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const typeConfig = selectedDocType ? DOCUMENT_TYPE_CONFIG[selectedDocType] : null;

  // Cleanup function
  useEffect(() => {
    return () => {
      // Cleanup object URLs
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      // Abort any ongoing uploads
      abortControllersRef.current.forEach(controller => controller.abort());
    };
  }, []);

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    if (file.type.startsWith('video/')) return FileVideo;
    if (file.type.startsWith('audio/')) return FileAudio;
    if (file.type === 'application/pdf') return FileText;
    return FileIcon;
  };

  // Create preview for image files
  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        resolve(url);
      } else {
        resolve(undefined);
      }
    });
  };

  // Validate file
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!selectedDocType) {
      return { valid: false, error: "Please select a document type first" };
    }

    const config = DOCUMENT_TYPE_CONFIG[selectedDocType];
    
    // Check file size
    if (file.size > config.maxSize) {
      const maxSizeMB = (config.maxSize / 1024 / 1024).toFixed(1);
      return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
    }

    // Check file type
    const allowedTypes = config.accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeTypeAllowed = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type;
      }
      return file.type.includes(type);
    });

    if (!mimeTypeAllowed) {
      return { valid: false, error: `File type not allowed. Accepted: ${config.accept}` };
    }

    return { valid: true };
  };

  // Handle file selection
  const handleFileSelection = async (selectedFiles: FileList) => {
    if (!selectedFiles.length || disabled) return;

    // Check if document type is selected
    if (!selectedDocType) {
      toast({
        title: "Document type required",
        description: "Please select a document type before uploading files.",
        variant: "destructive",
      });
      return;
    }

    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const validation = validateFile(file);
      
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive",
        });
        continue;
      }

      // Check total file limit
      if (files.length + newFiles.length >= maxFiles) {
        toast({
          title: "File limit reached",
          description: `Maximum ${maxFiles} files allowed`,
          variant: "destructive",
        });
        break;
      }

      const preview = await createPreview(file);
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        status: 'pending',
        progress: 0
      };

      newFiles.push(uploadedFile);
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      
      // Auto-upload files immediately after selection for better UX
      setTimeout(async () => {
        const uploadResults = await Promise.allSettled(newFiles.map(uploadFile));
        
        // Filter successful uploads and call onComplete
        const successfulUploads = uploadResults
          .filter((result): result is PromiseFulfilledResult<NonNullable<Awaited<ReturnType<typeof uploadFile>>>> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

        if (successfulUploads.length > 0 && onComplete) {
          onComplete(successfulUploads);
        }
      }, 100);
    }
  };

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
  }, [disabled, selectedDocType, files.length, maxFiles]);

  // Upload single file and return result
  const uploadFile = async (uploadedFile: UploadedFile): Promise<{ fileKey: string; fileName: string; mimeType: string; size: number } | null> => {
    const abortController = new AbortController();
    abortControllersRef.current.set(uploadedFile.id, abortController);

    try {
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, status: 'uploading' as const, progress: 10 }
          : f
      ));

      // Step 1: Get secure presigned URL from backend with validation
      const presignResponse = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType: selectedDocType,
          fileSize: uploadedFile.file.size,
          mimeType: uploadedFile.file.type,
          fileName: uploadedFile.file.name,
          applicationId: applicationId
        }),
        signal: abortController.signal
      });

      if (!presignResponse.ok) {
        const errorData = await presignResponse.json().catch(() => ({ detail: 'Failed to get presigned URL' }));
        throw new Error(errorData.detail || `Presign request failed: ${presignResponse.status}`);
      }

      const { uploadUrl, fileKey, expiresIn, maxSize, allowedMimeTypes } = await presignResponse.json();
      
      // Update progress
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, progress: 25 }
          : f
      ));

      // Step 2: Upload file to Google Cloud Storage using presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: uploadedFile.file,
        headers: { 'Content-Type': uploadedFile.file.type },
        signal: abortController.signal
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      // Update progress after upload
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, progress: 70 }
          : f
      ));

      // Step 3: Finalize upload - server validates, hashes, checks duplicates, and persists
      const finalizeResponse = await fetch('/api/uploads/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileKey,
          docType: selectedDocType,
          fileName: uploadedFile.file.name,
          mimeType: uploadedFile.file.type,
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
        } else if (finalizeResponse.status === 404) {
          throw new Error('Uploaded file not found. Please try uploading again.');
        } else {
          throw new Error(errorData.detail || `Upload finalization failed: ${finalizeResponse.status}`);
        }
      }

      const finalizeResult = await finalizeResponse.json();
      
      // Update progress to completion
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
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

      toast({
        title: "Upload successful",
        description: `${uploadedFile.file.name} uploaded successfully.`,
      });

      // Return success result for caller
      return {
        fileKey,
        fileName: uploadedFile.file.name,
        mimeType: uploadedFile.file.type,
        size: uploadedFile.file.size
      };

    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Upload was cancelled
        setFiles(prev => prev.filter(f => f.id !== uploadedFile.id));
        return null;
      }

      console.error('Upload error:', error);
      
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { 
              ...f, 
              status: 'error' as const, 
              error: error.message || 'Upload failed',
              progress: 0
            }
          : f
      ));

      toast({
        title: "Upload failed",
        description: `${uploadedFile.file.name}: ${error.message}`,
        variant: "destructive",
      });

      onError?.(error.message);
      return null;
    } finally {
      abortControllersRef.current.delete(uploadedFile.id);
    }
  };

  // Upload all pending files
  const uploadAllFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    if (pendingFiles.length === 0) {
      toast({
        title: "No files to upload",
        description: "All files have already been uploaded.",
        variant: "destructive",
      });
      return;
    }

    // Upload files concurrently and collect results
    const uploadResults = await Promise.allSettled(pendingFiles.map(uploadFile));

    // Filter successful uploads and call onComplete
    const successfulUploads = uploadResults
      .filter((result): result is PromiseFulfilledResult<NonNullable<Awaited<ReturnType<typeof uploadFile>>>> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    if (successfulUploads.length > 0) {
      onComplete?.(successfulUploads);
    }
  };

  // Remove file
  const removeFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      // Abort upload if in progress
      const controller = abortControllersRef.current.get(fileId);
      if (controller) {
        controller.abort();
        abortControllersRef.current.delete(fileId);
      }

      // Clean up preview URL
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }

      setFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  // Retry failed upload
  const retryUpload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file && file.status === 'error') {
      const updatedFile = { ...file, status: 'pending' as const, error: undefined };
      setFiles(prev => prev.map(f => f.id === fileId ? updatedFile : f));
      uploadFile(updatedFile);
    }
  };

  // Clear all files
  const clearAllFiles = () => {
    // Abort all uploads
    abortControllersRef.current.forEach(controller => controller.abort());
    abortControllersRef.current.clear();

    // Clean up preview URLs
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    setFiles([]);
  };

  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === 'completed').length;
  const uploadingFiles = files.filter(f => f.status === 'uploading').length;
  const errorFiles = files.filter(f => f.status === 'error').length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Document Type Selection */}
      {!documentType && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Document Type
          </label>
          <Select
            value={selectedDocType}
            onValueChange={(value) => setSelectedDocType(value as DocumentType)}
            disabled={disabled}
          >
            <SelectTrigger data-testid="select-document-type">
              <SelectValue placeholder="Select document type..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DOCUMENT_TYPE_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key} data-testid={`option-${key}`}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {typeConfig && (
            <p className="text-xs text-gray-500">
              {typeConfig.description} • Max size: {(typeConfig.maxSize / 1024 / 1024).toFixed(1)}MB • 
              Formats: {typeConfig.accept}
            </p>
          )}
        </div>
      )}

      {/* Upload Area */}
      <Card className={cn(
        "border-2 border-dashed transition-all duration-300 hover:shadow-lg",
        isDragging 
          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 shadow-xl" 
          : typeConfig 
            ? `border-gray-300 hover:border-blue-400 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900`
            : "border-gray-200 bg-gray-50 dark:bg-gray-800",
        disabled && "opacity-50 cursor-not-allowed"
      )}>
        <CardContent className="p-8">
          <div
            className="text-center space-y-6 cursor-pointer"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !disabled && selectedDocType && fileInputRef.current?.click()}
          >
            <div className={cn(
              "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-300",
              typeConfig 
                ? `bg-gradient-to-r ${typeConfig.color} text-white shadow-lg` 
                : "bg-gray-100 dark:bg-gray-700 text-gray-400"
            )}>
              <Upload className={cn(
                "w-8 h-8 transition-transform",
                isDragging && "scale-110"
              )} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {isDragging ? "Drop files here" : selectedDocType ? `Upload ${typeConfig?.label}` : "Select document type first"}
              </p>
              <p className="text-sm text-gray-500">
                {selectedDocType ? "Drag and drop files or click to browse" : "Choose a document type to continue"}
              </p>
              {typeConfig && (
                <div className="inline-flex items-center space-x-2 text-xs bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border">
                  <span>Max {(typeConfig.maxSize / 1024 / 1024).toFixed(0)}MB</span>
                  <span>•</span>
                  <span>PNG, JPEG, PDF, SVG</span>
                </div>
              )}
            </div>
            {selectedDocType && (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={disabled}
                className={cn(
                  "text-white border-0 shadow-lg hover:shadow-xl transition-all",
                  typeConfig ? `bg-gradient-to-r ${typeConfig.color}` : "bg-gradient-to-r from-blue-500 to-blue-600"
                )}
                data-testid="button-browse-files"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            )}
            <Input
              ref={fileInputRef}
              type="file"
              multiple={allowMultiple}
              accept={typeConfig?.accept}
              onChange={(e) => e.target.files && handleFileSelection(e.target.files)}
              className="hidden"
              disabled={disabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Files ({totalFiles})
            </h3>
            <div className="flex gap-2">
              {files.some(f => f.status === 'pending') && (
                <Button
                  size="sm"
                  onClick={uploadAllFiles}
                  disabled={disabled}
                  data-testid="button-upload-all"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload All
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={clearAllFiles}
                disabled={disabled}
                data-testid="button-clear-all"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Status Summary */}
          {(completedFiles > 0 || uploadingFiles > 0 || errorFiles > 0) && (
            <div className="flex gap-2 text-sm">
              {completedFiles > 0 && (
                <Badge variant="secondary" className="text-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {completedFiles} completed
                </Badge>
              )}
              {uploadingFiles > 0 && (
                <Badge variant="secondary" className="text-blue-600">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  {uploadingFiles} uploading
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

          {/* Individual Files */}
          <div className="space-y-2" data-testid="file-list">
            {files.map((uploadedFile) => {
              const FileIcon = getFileIcon(uploadedFile.file);
              
              return (
                <Card key={uploadedFile.id} className={cn(
                  "p-4 transition-all duration-200 hover:shadow-md",
                  uploadedFile.status === 'completed' && "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 shadow-sm",
                  uploadedFile.status === 'error' && "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800",
                  uploadedFile.status === 'uploading' && "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800",
                  uploadedFile.status === 'pending' && "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200 dark:border-gray-700"
                )}>
                  <div className="flex items-center gap-3">
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0 relative">
                      {uploadedFile.preview ? (
                        <img
                          src={uploadedFile.preview}
                          alt={uploadedFile.file.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ) : (
                        <div className={cn(
                          "w-12 h-12 rounded-lg border-2 flex items-center justify-center shadow-sm transition-all",
                          typeConfig 
                            ? `bg-gradient-to-br ${typeConfig.color} text-white border-transparent` 
                            : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500"
                        )}>
                          <FileIcon className="w-6 h-6" />
                        </div>
                      )}
                      
                      {/* Status overlay indicator with improved styling */}
                      {uploadedFile.status === 'completed' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {uploadedFile.status === 'error' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                          <AlertCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {uploadedFile.status === 'uploading' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                          <RefreshCw className="w-3 h-3 text-white animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {uploadedFile.file.name}
                        </p>
                        {uploadedFile.status === 'completed' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                        )}
                        {uploadedFile.status === 'error' && (
                          <Badge variant="destructive">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                        {uploadedFile.status === 'uploading' && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            {uploadedFile.progress}%
                          </Badge>
                        )}
                        {uploadedFile.status === 'pending' && (
                          <Badge variant="outline">
                            Ready to upload
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        {uploadedFile.status === 'completed' && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">Successfully uploaded</span>
                          </>
                        )}
                      </div>

                      {/* Enhanced Progress bar */}
                      {(uploadedFile.status === 'uploading' || (uploadedFile.status === 'completed' && uploadedFile.progress === 100)) && (
                        <div className="mt-2">
                          <Progress 
                            value={uploadedFile.progress} 
                            className={cn(
                              "h-2",
                              uploadedFile.status === 'completed' && "bg-green-100 dark:bg-green-900"
                            )}
                          />
                          {uploadedFile.status === 'uploading' && (
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Uploading...</span>
                              <span>{uploadedFile.progress}%</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Error message */}
                      {uploadedFile.error && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded">
                          <p className="text-xs text-red-700 dark:text-red-400">
                            <AlertCircle className="w-3 h-3 inline mr-1" />
                            {uploadedFile.error}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {uploadedFile.status === 'completed' && uploadedFile.uploadUrl && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(uploadedFile.uploadUrl, '_blank')}
                            data-testid={`button-view-${uploadedFile.id}`}
                            title="View file"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = uploadedFile.uploadUrl!;
                              link.download = uploadedFile.file.name;
                              link.click();
                            }}
                            data-testid={`button-download-${uploadedFile.id}`}
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {uploadedFile.status === 'error' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => retryUpload(uploadedFile.id)}
                          disabled={disabled}
                          data-testid={`button-retry-${uploadedFile.id}`}
                          title="Retry upload"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {uploadedFile.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => uploadFile(uploadedFile)}
                          disabled={disabled}
                          data-testid={`button-upload-${uploadedFile.id}`}
                          title="Start upload"
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(uploadedFile.id)}
                        disabled={disabled && uploadedFile.status === 'uploading'}
                        data-testid={`button-remove-${uploadedFile.id}`}
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}