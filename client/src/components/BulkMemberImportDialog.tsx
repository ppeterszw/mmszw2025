import { useState, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  FileText
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BulkImportResult {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ row: number; field?: string; error: string; data?: any }>;
  members?: Array<{ firstName: string; lastName: string; email: string; membershipNumber: string }>;
}

interface BulkMemberImportDialogProps {
  onSuccess?: () => void;
  endpoint?: string;
  invalidateKeys?: string[];
}

export function BulkMemberImportDialog({ 
  onSuccess,
  endpoint = "/api/admin/members/bulk-import",
  invalidateKeys = ["/api/admin/members"]
}: BulkMemberImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const bulkImportMutation = useMutation({
    mutationFn: async (file: File): Promise<BulkImportResult> => {
      const formData = new FormData();
      formData.append('csvFile', file);
      const res = await apiRequest("POST", endpoint, formData);
      return await res.json();
    },
    onSuccess: (result: BulkImportResult) => {
      setImportResult(result);
      // Invalidate all specified query keys
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      if (result.success && result.succeeded > 0) {
        toast({
          title: "Import Completed",
          description: `Successfully imported ${result.succeeded} members. ${result.failed > 0 ? `${result.failed} failed.` : ''}`
        });
      }
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to process bulk import. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file.",
        variant: "destructive"
      });
      return;
    }

    setCsvFile(file);
    setImportResult(null);

    // Preview CSV content
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').slice(0, 6); // Preview first 6 lines
      const preview = lines.map(line => line.split(',').map(cell => cell.trim()));
      setCsvPreview(preview);
    };
    reader.readAsText(file);
  }, [toast]);

  const handleImport = useCallback(() => {
    if (!csvFile) return;
    setIsProcessing(true);
    bulkImportMutation.mutate(csvFile, {
      onSettled: () => setIsProcessing(false)
    });
  }, [csvFile, bulkImportMutation]);

  const downloadTemplate = useCallback(() => {
    const headers = [
      'firstName',
      'lastName', 
      'email',
      'dateOfBirth',
      'countryOfResidence',
      'nationality',
      'memberType',
      'educationLevel',
      'employmentStatus',
      'organizationName'
    ];

    const sampleData = [
      'John',
      'Doe',
      'john.doe@example.com',
      '1985-03-15',
      'Zimbabwe',
      'Zimbabwean',
      'real_estate_agent',
      'normal_entry',
      'employed',
      'ABC Real Estate Ltd'
    ];

    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk-member-import-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const resetDialog = useCallback(() => {
    setCsvFile(null);
    setCsvPreview([]);
    setImportResult(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetDialog();
    }}>
      <DialogTrigger asChild>
        <Button
          className="h-24 flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 border-0"
          data-testid="button-bulk-import-members"
        >
          <Users className="w-6 h-6 mb-2" />
          <span className="text-sm">Bulk Import</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Bulk Member Import
          </DialogTitle>
          <DialogDescription>
            Import multiple members from a CSV file. User accounts will be created and email notifications sent automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">CSV Template</CardTitle>
              <CardDescription>
                Download the template to see the required format and column headers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadTemplate} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download CSV Template
              </Button>
              
              <div className="mt-4 text-xs text-muted-foreground">
                <p><strong>Required columns:</strong></p>
                <p>firstName, lastName, email, dateOfBirth, countryOfResidence, nationality, memberType, educationLevel, employmentStatus</p>
                <p className="mt-2"><strong>Optional columns:</strong> organizationName (required if employmentStatus is 'employed')</p>
                <p className="mt-2"><strong>Member Types:</strong> real_estate_agent, property_manager, principal_agent, negotiator</p>
                <p><strong>Education Level:</strong> normal_entry, mature_entry</p>
                <p><strong>Employment Status:</strong> employed, self_employed</p>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csv-upload">Select CSV File</Label>
            <Input
              id="csv-upload"
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isProcessing}
              data-testid="input-csv-upload"
            />
          </div>

          {/* CSV Preview */}
          {csvPreview.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">File Preview</CardTitle>
                <CardDescription>
                  First few rows of your CSV file (showing max 6 rows)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse border border-gray-200">
                    <tbody>
                      {csvPreview.map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex === 0 ? "bg-gray-50 font-semibold" : ""}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border border-gray-200 px-2 py-1">
                              {cell || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import Progress */}
          {isProcessing && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Processing import...</span>
                  </div>
                  <Progress value={undefined} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    Creating member accounts and sending email notifications...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import Results */}
          {importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {importResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Badge variant="outline">
                    Total: {importResult.processed}
                  </Badge>
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Success: {importResult.succeeded}
                  </Badge>
                  {importResult.failed > 0 && (
                    <Badge variant="secondary" className="text-red-700 bg-red-100">
                      <XCircle className="w-3 h-3 mr-1" />
                      Failed: {importResult.failed}
                    </Badge>
                  )}
                </div>

                {importResult.members && importResult.members.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-green-700">Successfully Created Members:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {importResult.members.map((member, index) => (
                        <div key={index} className="text-xs p-2 bg-green-50 rounded border">
                          <strong>{member.firstName} {member.lastName}</strong> ({member.email}) - {member.membershipNumber}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-red-700">Import Errors:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {importResult.errors.map((error, index) => (
                        <Alert key={index} className="text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          <AlertDescription>
                            <strong>Row {error.row}:</strong> {error.field && `${error.field} - `}{error.error}
                            {error.data && (
                              <div className="mt-1 text-gray-600">
                                {JSON.stringify(error.data, null, 2)}
                              </div>
                            )}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isProcessing}
              data-testid="button-cancel-import"
            >
              {importResult ? 'Close' : 'Cancel'}
            </Button>
            {csvFile && !importResult && (
              <Button
                onClick={handleImport}
                disabled={isProcessing}
                data-testid="button-start-import"
              >
                {isProcessing ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Start Import
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}