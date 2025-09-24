import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, FileText, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import logoUrl from "@assets/eaclogo_1756763778691.png";

interface CaseStatus {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  priority: string;
  type: string;
  submittedBy: string;
  submittedByEmail: string;
  createdAt: string;
  updatedAt: string;
  resolution?: string;
}

export default function CaseTracking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"case" | "email">("case");
  const [hasSearched, setHasSearched] = useState(false);
  const [, setLocation] = useLocation();

  const { data: caseStatus, isLoading, error } = useQuery<CaseStatus>({
    queryKey: ["/api/cases/track", searchQuery, searchType],
    enabled: hasSearched && searchQuery.length > 0,
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setHasSearched(true);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setHasSearched(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <Clock className="w-4 h-4" />;
      case "in_progress":
        return <AlertCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "closed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "default";
      case "in_progress":
        return "secondary";
      case "resolved":
        return "outline";
      case "closed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "secondary";
      case "medium":
        return "default";
      case "high":
        return "destructive";
      case "critical":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="gradient-bg py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
                <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">Track Your Case</h1>
                <p className="text-blue-100 text-sm">Monitor the progress of your submitted cases</p>
              </div>
            </div>
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              onClick={() => setLocation("/")}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto">
          <PageBreadcrumb items={[
            { label: "Case Management", href: "/case-management" },
            { label: "Track Your Case" }
          ]} className="mb-6" />
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 p-2">
              <img src={logoUrl} alt="Estate Agents Council Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Case</h1>
            <p className="text-gray-600">Check the status and progress of a case you have submitted to the council.</p>
          </div>

          {/* Search Card */}
          <Card className="bg-white border shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Find Your Case
              </CardTitle>
              <CardDescription>
                Search for a case using the methods below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={searchType} onValueChange={(value) => setSearchType(value as "case" | "email")}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="case">Case Number</TabsTrigger>
                  <TabsTrigger value="email">Email Address</TabsTrigger>
                </TabsList>
                
                <TabsContent value="case" className="space-y-4">
                  <div>
                    <Label htmlFor="case-number">Case Tracking Number</Label>
                    <Input
                      id="case-number"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter case number (e.g., CASE-2024-001247)"
                      className="mt-2"
                      data-testid="input-case-number"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="email" className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter the email used when submitting the case"
                      className="mt-2"
                      data-testid="input-email"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex space-x-2 mt-4">
                <Button 
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isLoading}
                  className="gradient-button text-white border-0"
                  data-testid="button-track-case"
                >
                  {isLoading ? "Searching..." : "Track Case"}
                </Button>
                {hasSearched && (
                  <Button 
                    variant="outline"
                    onClick={handleReset}
                    data-testid="button-reset-search"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Case Status</CardTitle>
              <CardDescription>
                The current status of the searched case will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!hasSearched && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Please enter a case number or email to see the status.</p>
                </div>
              )}

              {hasSearched && isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-egyptian-blue mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching for case...</p>
                </div>
              )}

              {hasSearched && error && (
                <Alert className="border-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Case not found. Please check your case number or email and try again.
                  </AlertDescription>
                </Alert>
              )}

              {hasSearched && caseStatus && !isLoading && (
                <div className="space-y-6">
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-card-foreground mb-1" data-testid="case-title">
                          {caseStatus.title}
                        </h3>
                        <p className="text-sm text-muted-foreground" data-testid="case-number">
                          Case Number: {caseStatus.caseNumber}
                        </p>
                      </div>
                      <Badge 
                        variant={getStatusColor(caseStatus.status)} 
                        className="flex items-center gap-1"
                        data-testid="case-status-badge"
                      >
                        {getStatusIcon(caseStatus.status)}
                        {caseStatus.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Type:</span>
                        <p className="text-muted-foreground" data-testid="case-type">
                          {caseStatus.type.replace("_", " ").toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Priority:</span>
                        <Badge 
                          variant={getPriorityColor(caseStatus.priority)} 
                          className="ml-2"
                          data-testid="case-priority"
                        >
                          {caseStatus.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <p className="text-muted-foreground" data-testid="case-submitted-date">
                          {new Date(caseStatus.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <p className="text-muted-foreground" data-testid="case-updated-date">
                          {new Date(caseStatus.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {caseStatus.resolution && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <span className="font-medium text-sm">Resolution:</span>
                        <p className="text-muted-foreground mt-1" data-testid="case-resolution">
                          {caseStatus.resolution}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <Button 
                      onClick={() => setLocation("/cases/report")}
                      variant="outline"
                      data-testid="button-report-new-case"
                    >
                      Report Another Case
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Links */}
          <div className="text-center mt-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-gray-900 font-semibold mb-4">Need More Help?</h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>For additional assistance or inquiries about your case,</p>
                <p>contact the Estate Agents Council of Zimbabwe directly.</p>
                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => setLocation("/cases/report")}
                  >
                    Report a New Case
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FormFooter />
    </div>
  );
}