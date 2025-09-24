import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { 
  Search, CheckCircle, XCircle, User, Building2, 
  Calendar, Shield, AlertTriangle, FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Member, Organization } from "@shared/schema";

export default function PublicVerification() {
  const [membershipNumber, setMembershipNumber] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const { toast } = useToast();

  const { data: verificationResult, isLoading, error } = useQuery({
    queryKey: ["/api/public/verify", searchTrigger],
    enabled: !!searchTrigger,
    retry: false,
  });

  const handleSearch = () => {
    if (!membershipNumber.trim()) {
      toast({
        title: "Membership Number Required",
        description: "Please enter a membership number to verify.",
        variant: "destructive"
      });
      return;
    }
    setSearchTrigger(membershipNumber.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatMemberType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      <FormHeader 
        title="EACZ Public Portal" 
        subtitle="Member Verification System"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Verify EACZ Registration
          </h1>
          <p className="text-blue-100">
            Verify if a person or organization is registered with the Estate Agents Council of Zimbabwe
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 bg-white/95 backdrop-blur border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Member Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="membershipNumber">Membership Number</Label>
              <div className="flex gap-2">
                <Input
                  id="membershipNumber"
                  placeholder="Enter membership number (e.g., EAC-MBR-0001)"
                  value={membershipNumber}
                  onChange={(e) => setMembershipNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  data-testid="input-membership-number"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="gradient-button text-white border-0"
                  data-testid="button-verify"
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Enter the membership number exactly as it appears on the certificate or registration documents.
            </p>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchTrigger && (
          <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Verifying membership...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Found</h3>
                  <p className="text-gray-600 mb-4">
                    No registration found for membership number: <strong>{searchTrigger}</strong>
                  </p>
                  <Badge variant="destructive" className="mb-4">
                    Not Registered
                  </Badge>
                  <p className="text-sm text-gray-500">
                    This person or organization is not currently registered with EACZ.
                  </p>
                </div>
              )}

              {verificationResult && !error && (
                <div className="space-y-6">
                  {/* Verification Status */}
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Registration</h3>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Active Member
                    </Badge>
                  </div>

                  {/* Member/Organization Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        {verificationResult.type === "member" ? (
                          <User className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Building2 className="w-5 h-5 text-orange-600" />
                        )}
                        <h4 className="font-semibold text-gray-900">
                          {verificationResult.type === "member" ? "Individual Member" : "Organization"}
                        </h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Name</Label>
                          <p className="text-gray-900">
                            {verificationResult.type === "member" 
                              ? `${verificationResult.firstName} ${verificationResult.lastName}`
                              : verificationResult.name
                            }
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Membership Number</Label>
                          <p className="text-gray-900 font-mono">{verificationResult.membershipNumber}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Registration Type</Label>
                          <p className="text-gray-900">
                            {verificationResult.type === "member" 
                              ? formatMemberType(verificationResult.memberType)
                              : formatMemberType(verificationResult.organizationType)
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Registration Details</h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Registration Date</Label>
                          <p className="text-gray-900">{formatDate(verificationResult.createdAt)}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Status</Label>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={verificationResult.membershipStatus === "active" ? "default" : "secondary"}
                              className={verificationResult.membershipStatus === "active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                              }
                            >
                              {verificationResult.membershipStatus.charAt(0).toUpperCase() + 
                               verificationResult.membershipStatus.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        {verificationResult.expiryDate && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Expiry Date</Label>
                            <p className="text-gray-900">{formatDate(verificationResult.expiryDate)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900 mb-1">Verification Information</h5>
                        <p className="text-sm text-blue-800">
                          This registration has been verified against the official EACZ database. 
                          The information displayed is current as of {new Date().toLocaleDateString()}.
                        </p>
                        {verificationResult.membershipStatus !== "active" && (
                          <div className="mt-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <p className="text-sm text-orange-800">
                              Please note: This registration is currently {verificationResult.membershipStatus}.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <Card className="mt-8 bg-white/95 backdrop-blur border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">About This Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              This verification service allows members of the public to confirm the registration status 
              of real estate professionals and organizations with the Estate Agents Council of Zimbabwe.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">What You Can Verify:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Individual member registration</li>
                  <li>• Organization registration</li>
                  <li>• Current registration status</li>
                  <li>• Registration dates and validity</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Important Notes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Information is updated in real-time</li>
                  <li>• Only active registrations are displayed</li>
                  <li>• Contact EACZ for additional inquiries</li>
                  <li>• This service is free to use</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <FormFooter />
    </div>
  );
}