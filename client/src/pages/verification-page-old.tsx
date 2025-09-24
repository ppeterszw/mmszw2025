import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, CheckCircle, XCircle, User, Calendar } from "lucide-react";
import logoUrl from "@assets/eaclogo_1756763778691.png";
import { useLocation } from "wouter";

interface VerificationResult {
  membershipNumber: string;
  firstName: string;
  lastName: string;
  memberType: string;
  status: string;
  expiryDate: string;
}

export default function VerificationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"membership" | "name" | "qr">("membership");
  const [hasSearched, setHasSearched] = useState(false);
  const [, setLocation] = useLocation();

  const { data: verificationResult, isLoading, error } = useQuery<VerificationResult>({
    queryKey: ["/api/members/verify", searchQuery],
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

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 p-2">
              <img src={logoUrl} alt="Estate Agents Council Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Member Verification</h1>
            <p className="text-blue-100">Verify Estate Agents Council of Zimbabwe Registration</p>
          </div>

          {/* Search Card */}
          <Card className="bg-white/95 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Verify Registration
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter membership number, full name, or scan QR code to verify registration
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search-query">Search Query</Label>
                  <Input
                    id="search-query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter membership number (e.g., REA-2024-001247) or full name"
                    className="mt-2"
                    data-testid="input-search-query"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isLoading}
                    className="bg-egyptian-blue hover:bg-egyptian-blue/90"
                    data-testid="button-search"
                  >
                    {isLoading ? "Searching..." : "Verify Member"}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleReset}
                    data-testid="button-reset"
                  >
                    Reset
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setLocation("/auth")}
                    data-testid="button-back-to-login"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {hasSearched && (
            <Card className="bg-white/95 backdrop-blur">
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Verifying registration...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      Registration Not Found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      No active registration found for the provided information.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please verify the information and try again, or contact EACZ for assistance.
                    </p>
                  </div>
                ) : verificationResult ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">
                        Registration Verified ✓
                      </h3>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                          <p className="font-semibold text-card-foreground" data-testid="verified-name">
                            {verificationResult.firstName} {verificationResult.lastName}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Membership Number</Label>
                          <p className="font-semibold text-card-foreground" data-testid="verified-membership-number">
                            {verificationResult.membershipNumber}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Member Type</Label>
                          <p className="font-semibold text-card-foreground" data-testid="verified-member-type">
                            {verificationResult.memberType.replace(/_/g, ' ').toUpperCase()}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                          <Badge 
                            variant={verificationResult.status === 'active' ? 'default' : 'secondary'}
                            data-testid="verified-status"
                          >
                            {verificationResult.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Valid Until</Label>
                        <p className="font-semibold text-card-foreground" data-testid="verified-expiry">
                          {new Date(verificationResult.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                          <p className="font-medium text-green-800">Valid Registration</p>
                          <p className="text-sm text-green-600">
                            This person is a registered member of the Estate Agents Council of Zimbabwe.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        This verification is valid only when accessed through the official EACZ portal.
                        <br />
                        Verification performed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
