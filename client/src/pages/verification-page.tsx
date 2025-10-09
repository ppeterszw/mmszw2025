import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, CheckCircle, XCircle, User, Calendar, AlertTriangle, Building2, Shield, ChevronRight, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import logoUrl from "@assets/eaclogo_1756763778691.png";

interface VerificationResult {
  type: "member" | "organization";
  membershipNumber: string;
  firstName?: string;
  lastName?: string;
  memberType?: string;
  name?: string;
  organizationType?: string;
  status: string;
  expiryDate: string;
  organizationName?: string;
  registrationDate?: string;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  membershipNumber: string;
  email: string;
  memberType: string;
  membershipStatus: string;
}

interface Organization {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  membershipStatus: string;
}

// Simple reCAPTCHA component placeholder
function ReCaptcha({ onVerify }: { onVerify: (token: string) => void }) {
  const [isVerified, setIsVerified] = useState(false);
  
  const handleVerify = () => {
    // Simulate reCAPTCHA verification
    setIsVerified(true);
    onVerify("verified_token_placeholder");
  };

  return (
    <div className="border-2 border-dashed border-teal-300 rounded-xl p-6 text-center bg-gradient-to-br from-teal-50 to-teal-100/50">
      <div className="flex items-center justify-center space-x-3">
        <input 
          type="checkbox" 
          id="captcha" 
          checked={isVerified}
          onChange={handleVerify}
          className="w-5 h-5 text-teal-600 focus:ring-teal-500 border-teal-300 rounded"
        />
        <label htmlFor="captcha" className="text-sm font-medium text-teal-800">
          I'm not a robot
        </label>
        <Shield className="w-5 h-5 text-teal-600" />
      </div>
      <p className="text-xs text-teal-600 mt-2">Security verification required</p>
    </div>
  );
}

export default function VerificationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [membershipType, setMembershipType] = useState<"individual" | "organization" | "">("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualSearch, setManualSearch] = useState("");
  const [searchType, setSearchType] = useState<"membership" | "name" | "email">("membership");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dropdown");
  const [, setLocation] = useLocation();

  // Fetch members and organizations for dropdowns
  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["/api/public/members"],
    enabled: membershipType === "individual",
  });

  const { data: organizations = [] } = useQuery<Organization[]>({
    queryKey: ["/api/public/organizations"],
    enabled: membershipType === "organization",
  });

  const { data: verificationResult, isLoading, error } = useQuery<VerificationResult>({
    queryKey: [`/api/public/verify/${searchQuery}`],
    enabled: hasSearched && searchQuery.length > 0 && captchaVerified,
  });

  const handleSearch = () => {
    if (!captchaVerified) {
      return;
    }

    let query = "";
    if (activeTab === "dropdown") {
      if (membershipType === "individual") {
        const member = members.find(m => m.id === selectedMember);
        query = member?.membershipNumber || "";
      } else {
        const org = organizations.find(o => o.id === selectedMember);
        query = org?.registrationNumber || "";
      }
    } else {
      query = manualSearch;
    }

    if (query.trim()) {
      setSearchQuery(query);
      setHasSearched(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setMembershipType("");
    setSearchQuery("");
    setManualSearch("");
    setSelectedMember("");
    setDropdownSearch("");
    setShowSuggestions(false);
    setHasSearched(false);
    setCaptchaVerified(false);
    setActiveTab("dropdown");
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "standby":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "revoked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMemberTypeDisplay = (type: string) => {
    switch (type) {
      case "real_estate_agent":
        return "Real Estate Agent";
      case "property_manager":
        return "Property Manager";
      case "principal_agent":
        return "Principal Agent";
      case "negotiator":
        return "Negotiator";
      default:
        return type.replace("_", " ").toUpperCase();
    }
  };

  const filteredMembers = members.filter(member => 
    member.membershipStatus === "active" &&
    (member.firstName.toLowerCase().includes(selectedMember.toLowerCase()) ||
     member.lastName.toLowerCase().includes(selectedMember.toLowerCase()) ||
     member.membershipNumber.toLowerCase().includes(selectedMember.toLowerCase()))
  );

  const filteredOrganizations = organizations.filter(org => 
    org.membershipStatus === "active" &&
    (org.name.toLowerCase().includes(selectedMember.toLowerCase()) ||
     org.registrationNumber.toLowerCase().includes(selectedMember.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 200px height */}
      <div className="h-[200px] bg-gradient-to-r from-egyptian-blue via-powder-blue to-egyptian-blue relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col justify-center items-center text-center">
            {/* Logo */}
            <div className="w-20 h-20 bg-white/95 rounded-2xl flex items-center justify-center p-3 shadow-2xl mb-4 backdrop-blur-sm">
              <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Member Verification Portal
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-white/95 max-w-2xl font-medium drop-shadow">
              Verify if a person or organization is registered with the Estate Agents Council of Zimbabwe
            </p>

            {/* Return Button */}
            <Button
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
              onClick={() => setLocation("/")}
              data-testid="button-home"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <PageBreadcrumb items={[
            { label: "Member Verification" }
          ]} className="mb-6" />

          {/* Verification Form */}
          <Card className="bg-white border shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Verify Registration
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  Step {currentStep} of 3
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Step 1: Member Type Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Select Member Type</Label>
                    <RadioGroup 
                      value={membershipType} 
                      onValueChange={(value: "individual" | "organization") => {
                        setMembershipType(value);
                        setSelectedMember("");
                        setDropdownSearch("");
                        setManualSearch("");
                        setHasSearched(false);
                      }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual" className="flex items-center cursor-pointer">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          <div>
                            <div className="font-medium">Individual Member</div>
                            <div className="text-sm text-muted-foreground">Real estate agents, property managers</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="organization" id="organization" />
                        <Label htmlFor="organization" className="flex items-center cursor-pointer">
                          <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                          <div>
                            <div className="font-medium">Organization/Firm</div>
                            <div className="text-sm text-muted-foreground">Real estate companies, agencies</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleNextStep}
                      disabled={!membershipType}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="button-next-step1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Search Method */}
              {currentStep === 2 && membershipType && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Choose Search Method for {membershipType === "individual" ? "Individual Members" : "Organizations"}
                    </Label>
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="dropdown">Select from List</TabsTrigger>
                        <TabsTrigger value="membership">Membership Number</TabsTrigger>
                        <TabsTrigger value="email">Email Address</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="dropdown" className="space-y-4">
                        <div className="relative">
                          <Label htmlFor="memberSelect">
                            Search Registered {membershipType === "individual" ? "Members by Full Name" : "Organizations by Name"}
                          </Label>
                          <Input
                            id="memberSelect"
                            type="text"
                            placeholder={`Type full name to search ${membershipType === "individual" ? "registered members" : "registered organizations"}...`}
                            value={dropdownSearch}
                            onChange={(e) => {
                              setDropdownSearch(e.target.value);
                              setShowSuggestions(e.target.value.length > 0);
                              setSelectedMember("");
                            }}
                            onFocus={() => setShowSuggestions(dropdownSearch.length > 0)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            data-testid="input-dropdown-search"
                          />
                          
                          {/* Suggestions Dropdown */}
                          {showSuggestions && dropdownSearch.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                              {membershipType === "individual" ? (
                                members
                                  .filter(member => 
                                    member.membershipStatus === "active" &&
                                    (member.firstName.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
                                     member.lastName.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
                                     `${member.firstName} ${member.lastName}`.toLowerCase().includes(dropdownSearch.toLowerCase()))
                                  )
                                  .slice(0, 10)
                                  .map((member) => (
                                    <div
                                      key={member.id}
                                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                      onClick={() => {
                                        setSelectedMember(member.id);
                                        setDropdownSearch(`${member.firstName} ${member.lastName}`);
                                        setShowSuggestions(false);
                                      }}
                                    >
                                      <div className="font-medium">{member.firstName} {member.lastName}</div>
                                      <div className="text-sm text-gray-500">{member.membershipNumber} • {member.memberType}</div>
                                    </div>
                                  ))
                              ) : (
                                organizations
                                  .filter(org => 
                                    org.membershipStatus === "active" &&
                                    org.name.toLowerCase().includes(dropdownSearch.toLowerCase())
                                  )
                                  .slice(0, 10)
                                  .map((org) => (
                                    <div
                                      key={org.id}
                                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                                      onClick={() => {
                                        setSelectedMember(org.id);
                                        setDropdownSearch(org.name);
                                        setShowSuggestions(false);
                                      }}
                                    >
                                      <div className="font-medium">{org.name}</div>
                                      <div className="text-sm text-gray-500">{org.registrationNumber}</div>
                                    </div>
                                  ))
                              )}
                              
                              {/* No results message */}
                              {membershipType === "individual" && 
                               members.filter(member => 
                                 member.membershipStatus === "active" &&
                                 (member.firstName.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
                                  member.lastName.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
                                  `${member.firstName} ${member.lastName}`.toLowerCase().includes(dropdownSearch.toLowerCase()))
                               ).length === 0 && (
                                <div className="px-3 py-2 text-gray-500 text-sm">
                                  No registered members found matching "{dropdownSearch}"
                                </div>
                              )}
                              
                              {membershipType === "organization" && 
                               organizations.filter(org => 
                                 org.membershipStatus === "active" &&
                                 org.name.toLowerCase().includes(dropdownSearch.toLowerCase())
                               ).length === 0 && (
                                <div className="px-3 py-2 text-gray-500 text-sm">
                                  No registered organizations found matching "{dropdownSearch}"
                                </div>
                              )}
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground mt-1">
                            Start typing the {membershipType === "individual" ? "member's full name" : "organization name"} to search registered {membershipType === "individual" ? "members" : "organizations"}
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="membership" className="space-y-4">
                        <div>
                          <Label htmlFor="membershipSearch">Membership Number</Label>
                          <Input
                            id="membershipSearch"
                            type="text"
                            placeholder="e.g., EAC-MBR-24-0001"
                            value={manualSearch}
                            onChange={(e) => setManualSearch(e.target.value)}
                            data-testid="input-membership-search"
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="email" className="space-y-4">
                        <div>
                          <Label htmlFor="emailSearch">Email Address</Label>
                          <Input
                            id="emailSearch"
                            type="email"
                            placeholder="e.g., john@example.com"
                            value={manualSearch}
                            onChange={(e) => setManualSearch(e.target.value)}
                            data-testid="input-email-search"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      onClick={handlePrevStep}
                      variant="outline"
                      data-testid="button-prev-step2"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      disabled={
                        (activeTab === "dropdown" && !selectedMember) ||
                        (activeTab !== "dropdown" && !manualSearch.trim())
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="button-next-step2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Security Verification */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Security Verification</Label>
                    <ReCaptcha onVerify={() => setCaptchaVerified(true)} />
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100/50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-blue-900">Verification Summary</h4>
                    </div>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><strong>Type:</strong> {membershipType === "individual" ? "Individual Member" : "Organization"}</p>
                      <p><strong>Search Method:</strong> {
                        activeTab === "dropdown" ? "Selected from list" :
                        activeTab === "membership" ? "Membership Number" :
                        activeTab === "name" ? "Full Name" : "Email Address"
                      }</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      onClick={handlePrevStep}
                      variant="outline"
                      data-testid="button-prev-step3"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleSearch}
                      disabled={!captchaVerified || isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="button-verify"
                    >
                      {isLoading ? "Verifying..." : "Verify Registration"}
                    </Button>
                  </div>
                  
                  {hasSearched && (
                    <div className="text-center">
                      <Button 
                        variant="outline" 
                        onClick={handleReset}
                        data-testid="button-reset"
                      >
                        Start New Search
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
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
                  No registration found. Please check the details and try again.
                </AlertDescription>
              </div>
            </Alert>
          )}

          {verificationResult && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/50">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xl">Registration Verified</span>
                      <p className="text-green-100 text-sm mt-1">Successfully verified member registration</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(verificationResult.status)} px-3 py-2 rounded-full font-medium shadow-lg`}>
                    {verificationResult.status.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {verificationResult.type === "member" ? (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                        <p className="font-semibold">
                          {verificationResult.firstName} {verificationResult.lastName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Membership Number</Label>
                        <p className="font-mono text-sm">{verificationResult.membershipNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Member Type</Label>
                        <p>{getMemberTypeDisplay(verificationResult.memberType || "")}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Expiry Date</Label>
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {verificationResult.expiryDate ? new Date(verificationResult.expiryDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      {verificationResult.organizationName && (
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-muted-foreground">Organization</Label>
                          <p className="flex items-center">
                            <Building2 className="w-4 h-4 mr-1" />
                            {verificationResult.organizationName}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Organization Name</Label>
                        <p className="font-semibold flex items-center">
                          <Building2 className="w-4 h-4 mr-2" />
                          {verificationResult.name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Registration Number</Label>
                        <p className="font-mono text-sm">{verificationResult.membershipNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Organization Type</Label>
                        <p>{getMemberTypeDisplay(verificationResult.organizationType || "")}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Expiry Date</Label>
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {verificationResult.expiryDate ? new Date(verificationResult.expiryDate).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <Separator />
                
                <div className="text-center text-sm text-muted-foreground">
                  <p className="flex items-center justify-center">
                    <Shield className="w-4 h-4 mr-1" />
                    This verification was completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <FormFooter />
    </div>
  );
}