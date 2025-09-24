import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleUploader } from "@/components/SimpleUploader";
import { Building2, CheckCircle, FileText, AlertCircle, Upload, Home } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import type { Member } from "@shared/schema";

const organizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  type: z.enum(["real_estate_firm", "property_management_firm", "brokerage_firm", "development_firm"]),
  registrationNumber: z.string().min(1, "Registration number is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  principalAgentId: z.string().min(1, "Principal agent is required"),
  trustAccountDetails: z.string().min(1, "Trust account details are required"),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

const requiredDocuments = [
  { id: "incorporation", label: "Certificate of Incorporation", required: true },
  { id: "trustAccount", label: "Trust Account Confirmation", required: true },
  { id: "annualReturns", label: "3 Annual Return Forms", required: true },
  { id: "cr6Form", label: "CR6 Form (Director Proof)", required: true },
  { id: "cr11Forms", label: "CR11 Forms (Certified Copy)", required: true },
  { id: "taxClearance", label: "Tax Clearance Certificate", required: true },
  { id: "policeClearance", label: "Police Clearance for Directors", required: true },
];

export default function OrganizationRegistration() {
  const [activeTab, setActiveTab] = useState("requirements");
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string[]>>({});
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: allMembers = [] } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  // Filter members to get only principal agents
  const principalAgents = allMembers.filter(member => 
    member.memberType === "principal_real_estate_agent"
  );

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      type: "real_estate_firm",
      registrationNumber: "",
      email: "",
      phone: "",
      address: "",
      principalAgentId: "",
      trustAccountDetails: "",
    },
  });

  const createOrganizationMutation = useMutation({
    mutationFn: async (data: OrganizationFormData) => {
      const res = await apiRequest("POST", "/api/organizations", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organizations"] });
      toast({
        title: "Organization Registered",
        description: "Organization has been successfully registered.",
      });
      setLocation("/admin-dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDocumentUpload = async () => {
    console.log('Organization handleDocumentUpload called');
    try {
      const res = await apiRequest("POST", "/api/object-storage/upload-url");
      console.log('Organization upload URL response:', res.status, res.ok);
      if (!res.ok) {
        throw new Error('Failed to get upload URL');
      }
      const { uploadUrl } = await res.json();
      console.log('Organization upload URL data:', uploadUrl);
      return {
        method: "PUT" as const,
        url: uploadUrl,
      };
    } catch (error) {
      console.error('Error getting upload URL:', error);
      toast({
        title: "Upload Error",
        description: "Document upload is not available. Please contact support.",
        variant: "destructive",
      });
      throw new Error('Document upload is not available. Please contact support.');
    }
  };

  const handleDocumentComplete = (documentType: string) => (result: any) => {
    const uploadedFiles = result.successful.map((file: any) => file.uploadURL);
    setUploadedDocuments(prev => ({
      ...prev,
      [documentType]: [...(prev[documentType] || []), ...uploadedFiles]
    }));
  };

  const onSubmit = (data: OrganizationFormData) => {
    const allRequirementsChecked = requiredDocuments.every(doc => checkedRequirements[doc.id]);
    
    if (!allRequirementsChecked) {
      toast({
        title: "Requirements Not Met",
        description: "Please check all requirement boxes before submitting.",
        variant: "destructive",
      });
      return;
    }

    createOrganizationMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <FormHeader 
        title="Register Real Estate Organization"
        subtitle="Estate Agents Council of Zimbabwe"
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[{ label: "Organization Registration" }]} />
        {/* Return to Home Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/")}
            className="flex items-center"
            data-testid="button-return-home"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </div>

        {/* Tabbed Form - Single form wrapper for entire component */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="requirements" data-testid="tab-requirements">Requirements</TabsTrigger>
                <TabsTrigger value="details" data-testid="tab-details">Organization Details</TabsTrigger>
                <TabsTrigger value="contact" data-testid="tab-contact">Contact & Trust</TabsTrigger>
                <TabsTrigger value="documents" data-testid="tab-documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="requirements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Registration Requirements
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please ensure you have all required documents before proceeding
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {requiredDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-3">
                          <Checkbox
                            checked={checkedRequirements[doc.id] || false}
                            onCheckedChange={(checked) => 
                              setCheckedRequirements(prev => ({ ...prev, [doc.id]: !!checked }))
                            }
                            data-testid={`checkbox-requirement-${doc.id}`}
                          />
                          <span className="text-sm text-card-foreground">{doc.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="w-5 h-5 mr-2" />
                      Organization Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter organization name" 
                                data-testid="input-org-name"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-org-type">
                                  <SelectValue placeholder="Select organization type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="real_estate_firm">Real Estate Firm</SelectItem>
                                <SelectItem value="property_management_firm">Property Management Firm</SelectItem>
                                <SelectItem value="brokerage_firm">Brokerage Firm</SelectItem>
                                <SelectItem value="development_firm">Real Estate Development Firm</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="registrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Registration Number *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter registration number" 
                                data-testid="input-registration-number"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="principalAgentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Principal Agent *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-principal-agent">
                                  <SelectValue placeholder="Select principal agent" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {principalAgents.map((agent) => (
                                  <SelectItem key={agent.id} value={agent.id}>
                                    {agent.firstName} {agent.lastName} ({agent.membershipNumber})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="w-5 h-5 mr-2" />
                      Contact & Trust Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h3 className="text-lg font-medium text-card-foreground mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email"
                                  placeholder="Enter email address" 
                                  data-testid="input-org-email"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel"
                                  placeholder="Enter phone number" 
                                  data-testid="input-org-phone"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Physical Address *</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    rows={3}
                                    placeholder="Enter physical address" 
                                    data-testid="textarea-org-address"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="text-lg font-medium text-card-foreground mb-4">Trust Account Information</h3>
                      <FormField
                        control={form.control}
                        name="trustAccountDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trust Account Details *</FormLabel>
                            <FormControl>
                              <Textarea 
                                rows={3}
                                placeholder="Enter trust account details including bank name, account number, and account holder details" 
                                data-testid="textarea-trust-account"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Required Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {requiredDocuments.map((docType) => (
                        <Card key={docType.id} className="border-dashed">
                          <CardHeader>
                            <CardTitle className="text-sm">{docType.label}</CardTitle>
                          </CardHeader>
                          <CardContent className="text-center">
                            <SimpleUploader
                              onComplete={(url) => handleDocumentComplete(docType.id)({ successful: [{ uploadURL: url }] })}
                              buttonClassName="w-full"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            >
                              Upload {docType.label}
                            </SimpleUploader>
                            {uploadedDocuments[docType.id] && uploadedDocuments[docType.id].length > 0 && (
                              <div className="mt-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                                <p className="text-xs text-green-600">
                                  {uploadedDocuments[docType.id].length} file(s) uploaded
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Form Actions - Now properly inside the form */}
            <div className="flex justify-between pt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setLocation("/admin-dashboard")}
                data-testid="button-save-draft"
              >
                Save as Draft
              </Button>
              
              <Button 
                type="submit"
                className="gradient-button text-white border-0"
                disabled={createOrganizationMutation.isPending}
                data-testid="button-submit-organization"
              >
                {createOrganizationMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <FormFooter />
    </div>
  );
}