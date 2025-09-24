import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

interface SimpleUploaderProps {
  onComplete?: (uploadedUrl: string) => void;
  children: React.ReactNode;
  buttonClassName?: string;
  accept?: string;
  documentType?: string;
  maxSize?: number;
  usePublicEndpoint?: boolean;
}

export function SimpleUploader({ 
  onComplete, 
  children, 
  buttonClassName = "",
  accept = "*/*",
  documentType = "application_fee_pop",
  maxSize = 5 * 1024 * 1024, // 5MB default
  usePublicEndpoint = false
}: SimpleUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    console.log('Starting upload for file:', selectedFile.name);

    try {
      // Get secure upload URL from backend with validation
      const endpoint = usePublicEndpoint ? '/api/uploads/presign-public' : '/api/uploads/presign';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          docType: documentType,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type,
          fileName: selectedFile.name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const responseData = await response.json();
      const { uploadUrl } = responseData;
      console.log('Got upload URL:', uploadUrl);

      // Upload file directly to Google Cloud Storage
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      console.log('File uploaded successfully');
      
      // Use objectPath from response for public endpoint, fallback to extracting from URL for private
      const finalPath = usePublicEndpoint && responseData.objectPath 
        ? responseData.objectPath 
        : new URL(uploadUrl).pathname;
      
      toast({
        title: "Upload successful",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });

      onComplete?.(finalPath);
      setSelectedFile(null);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          onChange={handleFileSelect}
          accept={accept}
          className="flex-1"
        />
        {selectedFile && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {selectedFile && (
        <div className="text-sm text-muted-foreground">
          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className={buttonClassName}
      >
        {uploading ? (
          <>
            <Upload className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {children}
          </>
        )}
      </Button>
    </div>
  );
}