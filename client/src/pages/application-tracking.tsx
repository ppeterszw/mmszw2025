import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, FileText, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";

interface ApplicationStatus {
  applicationId: string;
  applicationType: 'individual' | 'organization';
  status: string;
  submittedAt: string | null;
  feeStatus: string;
  feeAmount: number;
  feeCurrency: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    fromStatus: string | null;
    toStatus: string;
    comment: string | null;
    createdAt: string;
  }>;
}

export default function ApplicationTracking() {
  const [applicationId, setApplicationId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [, setLocation] = useLocation();

  const { data: applicationStatus, isLoading, error } = useQuery<ApplicationStatus>({
    queryKey: ["/api/public/applications", applicationId],
    enabled: hasSearched && applicationId.length > 0,
  });

  const handleSearch = () => {
    if (applicationId.trim()) {
      setHasSearched(true);
    }
  };

  const handleReset = () => {
    setApplicationId("");
    setHasSearched(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return <FileText className="w-4 h-4" />;
      case "under_review":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "needs_applicant_action":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "needs_applicant_action":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFeeStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "settled":
        return "bg-green-100 text-green-800";
      case "proof_uploaded":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <FormHeader 
        title="Track Your Application"
        subtitle="Monitor your membership application progress in real time"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Search Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50/50 mb-8">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Application Lookup</CardTitle>
                  <CardDescription className="text-indigo-100 mt-1">
                    Enter your application ID to check the status of your membership application
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label htmlFor="applicationId" className="text-sm font-medium text-gray-700">Application ID</Label>
                <div className="relative">
                  <Input
                    id="applicationId"
                    type="text"
                    placeholder="e.g., MBR-APP-0001 or ORG-APP-0001"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    className="pl-10 border-2 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200 rounded-lg h-12"
                    data-testid="input-application-id"
                  />
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleSearch}
                  disabled={!applicationId.trim() || isLoading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                  data-testid="button-search"
                >
                  <Search className="w-4 h-4" />
                  <span>{isLoading ? "Searching..." : "Track Application"}</span>
                </Button>
                
                {hasSearched && (
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg"
                    data-testid="button-reset"
                  >
                    Search Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {error && (
            <Alert className="mb-8 border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <AlertDescription className="text-red-800 font-medium">
                  Application not found. Please check your application ID and try again.
                </AlertDescription>
              </div>
            </Alert>
          )}

          {applicationStatus && (
            <div className="space-y-8">
              {/* Application Overview */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50/50">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        {getStatusIcon(applicationStatus.status)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">Application Status</CardTitle>
                        <p className="text-emerald-100 mt-1">Real-time application tracking</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(applicationStatus.status)} px-3 py-2 rounded-full font-medium shadow-lg`}>
                      <span className="capitalize">{applicationStatus.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Application ID</Label>
                      <p className="font-mono text-sm">{applicationStatus.applicationId}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Application Type</Label>
                      <p className="capitalize">{applicationStatus.applicationType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Submitted Date</Label>
                      <p>{applicationStatus.submittedAt ? new Date(applicationStatus.submittedAt).toLocaleDateString() : "Not submitted yet"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                      <p>{new Date(applicationStatus.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Status */}
              <Card className="bg-white/95 backdrop-blur">
                <CardHeader>
                  <CardTitle>Application Fee</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{applicationStatus.feeCurrency} {applicationStatus.feeAmount}</p>
                      <p className="text-sm text-muted-foreground">Application processing fee</p>
                    </div>
                    <Badge className={getFeeStatusColor(applicationStatus.feeStatus)}>
                      {applicationStatus.feeStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  {applicationStatus.feeStatus === 'pending' && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Payment is required to proceed with your application. You can pay online or upload proof of payment.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Status History */}
              {applicationStatus.statusHistory && applicationStatus.statusHistory.length > 0 && (
                <Card className="bg-white/95 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Application Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applicationStatus.statusHistory.map((entry, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-egyptian-blue rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium capitalize">
                                {entry.toStatus.replace('_', ' ')}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(entry.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {entry.comment && (
                              <p className="text-sm text-muted-foreground mt-1">{entry.comment}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      
      <FormFooter />
    </div>
  );
}