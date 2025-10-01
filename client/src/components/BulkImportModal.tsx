import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { ModernModal } from "@/components/ui/modern-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload, Download, FileText, Users, Building2,
  CheckCircle, XCircle, AlertTriangle,
  Eye, Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface BulkImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "members" | "organizations";
  onSuccess?: () => void;
}

interface ImportResult {
  success: number;
  failed: number;
  total: number;
  errors: Array<{ row: number; error: string; data: any }>;
}

export function BulkImportModal({ open, onOpenChange, type, onSuccess }: BulkImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await apiRequest("POST", "/api/admin/bulk-import", formData);
      return await response.json() as ImportResult;
    },
    onSuccess: (data) => {
      setImportResults(data);
      if (onSuccess) onSuccess();
      queryClient.invalidateQueries({ queryKey: [`/api/admin/${type}`] });
      toast({
        title: "Import Completed",
        description: `Successfully imported ${data.success} out of ${data.total} records.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import data. Please check your file format.",
        variant: "destructive"
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
      setImportResults(null);
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    importMutation.mutate(selectedFile, {
      onSettled: () => {
        setIsProcessing(false);
        setProgress(100);
        clearInterval(progressInterval);
      }
    });
  };

  const downloadTemplate = () => {
    let csvContent = "";
    let filename = "";

    if (type === "members") {
      csvContent = [
        "firstName,lastName,email,phone,memberType,nationalId,address",
        "John,Doe,john.doe@email.com,+263123456789,real_estate_agent,12-123456A12,123 Main St Harare",
        "Jane,Smith,jane.smith@email.com,+263987654321,property_manager,12-654321B21,456 Oak Ave Bulawayo"
      ].join("\n");
      filename = "members_template.csv";
    } else {
      csvContent = [
        "name,email,phone,type,registrationNumber,address",
        "ABC Real Estate,contact@abcrealestate.co.zw,+263123456789,real_estate_firm,REF-2024-001,123 Business Park Harare",
        "XYZ Properties,info@xyzproperties.co.zw,+263987654321,property_management_firm,PMF-2024-002,456 Commercial St Bulawayo"
      ].join("\n");
      filename = "organizations_template.csv";
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportResults(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <ModernModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Bulk Import ${type === "members" ? "Members" : "Organizations"}`}
      subtitle={`Import multiple ${type} from CSV file`}
      icon={type === "members" ? Users : Building2}
      colorVariant="indigo"
      maxWidth="4xl"
      footer={{
        secondary: {
          label: "Cancel",
          onClick: () => onOpenChange(false),
          disabled: isProcessing
        },
        primary: selectedFile && !importResults ? {
          label: isProcessing ? "Processing..." : "Start Import",
          onClick: handleImport,
          disabled: !selectedFile || isProcessing,
          loading: isProcessing
        } : importResults ? {
          label: "Import More",
          onClick: resetImport
        } : undefined
      }}
    >
      <div className="space-y-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="template" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Template
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2" disabled={!importResults}>
              <FileText className="w-4 h-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload CSV File
              </h3>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                  <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-lg font-medium text-indigo-700 mb-2">
                      {selectedFile ? selectedFile.name : "Choose CSV file"}
                    </div>
                    <div className="text-sm text-indigo-600">
                      Click to browse or drag and drop your CSV file here
                    </div>
                  </Label>
                  <Input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {selectedFile && (
                  <div className="bg-white/60 p-4 rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <div>
                          <div className="font-medium text-indigo-800">{selectedFile.name}</div>
                          <div className="text-sm text-indigo-600">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetImport}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-indigo-700 font-medium">Processing import...</span>
                      <span className="text-indigo-600">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Make sure your CSV file follows the exact format shown in the template.
                Invalid formats may result in import errors.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="template" className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Download Template
              </h3>

              <div className="space-y-4">
                <p className="text-green-700">
                  Download the CSV template with the correct format for importing {type}.
                  The template includes sample data to help you understand the required structure.
                </p>

                <Button
                  onClick={downloadTemplate}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download {type === "members" ? "Members" : "Organizations"} Template
                </Button>

                <div className="bg-white/60 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Required Fields:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {type === "members" ? (
                      <>
                        <Badge variant="outline" className="text-green-700 border-green-300">firstName</Badge>
                        <Badge variant="outline" className="text-green-700 border-green-300">lastName</Badge>
                        <Badge variant="outline" className="text-green-700 border-green-300">email</Badge>
                        <Badge variant="outline" className="text-green-700 border-green-300">phone</Badge>
                        <Badge variant="outline" className="text-green-700 border-green-300">memberType</Badge>
                        <Badge variant="outline" className="text-green-700 border-green-300">nationalId</Badge>
                      </>
                    ) : (
                      <>
                        <Badge variant="outline" className="text-green-700 border-green-300">name</Badge>
                        <Badge variant="outline" className="text-green-700 border-green-300">email</Badge>
                        <Badge variant="outline" className="text-green-700 border-green-300">phone</Badge>
                        <Badge variant="outline" className="text-green-700 border-green-300">type</Badge>
                        <Badge variant="outline" className="text-green-700 border-green-300">registrationNumber</Badge>
                        <Badge variant="outline" className="text-green-700 border-green-300">address</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {importResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-800">{importResults.success}</div>
                    <div className="text-sm text-green-600">Successful</div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border border-red-200 text-center">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-800">{importResults.failed}</div>
                    <div className="text-sm text-red-600">Failed</div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200 text-center">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-800">{importResults.total}</div>
                    <div className="text-sm text-blue-600">Total</div>
                  </div>
                </div>

                {importResults.errors.length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Import Errors ({importResults.errors.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {importResults.errors.map((error, index) => (
                        <div key={index} className="bg-white/60 p-3 rounded-lg border border-orange-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium text-orange-800">Row {error.row}</div>
                              <div className="text-sm text-orange-700">{error.error}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-orange-600 hover:text-orange-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ModernModal>
  );
}