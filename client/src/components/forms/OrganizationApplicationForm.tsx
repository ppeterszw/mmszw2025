import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Upload, Building2, User, FileText, Plus, Trash2, Phone, MapPin, CreditCard, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Principal Agent schema for dynamic table
const principalAgentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  qualifications: z.string().min(1, "Qualifications are required"),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  registrationNumber: z.string().optional(),
  role: z.string().min(1, "Role is required"),
});

// Trust Account schema for dynamic table
const trustAccountSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountName: z.string().min(1, "Account name is required"),
  branchCode: z.string().min(1, "Branch code is required"),
});

const organizationApplicationSchema = z.object({
  // Company Information
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  tradingName: z.string().optional(),
  registrationNumber: z.string().min(1, "Registration number is required"),
  vatNumber: z.string().optional(),
  dateOfIncorporation: z.string().min(1, "Date of incorporation is required"),
  companyType: z.enum(["private_company", "public_company", "partnership", "sole_proprietorship", "trust", "other"],
    { required_error: "Company type is required" }),

  // Contact Information
  email: z.string().email("Invalid email address"),
  phoneCountryCode: z.string().min(1, "Country code is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  fax: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),

  // Address Information
  physicalAddress: z.string().min(10, "Physical address must be at least 10 characters"),
  postalAddress: z.string().min(10, "Postal address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postalCode: z.string().min(4, "Postal code is required"),

  // Business Details
  businessDescription: z.string().min(50, "Business description must be at least 50 characters"),
  yearsInOperation: z.string().min(1, "Years in operation is required"),
  numberOfEmployees: z.string().min(1, "Number of employees is required"),
  branchOffices: z.string().optional(),

  // Principal Real Estate Agent Details (dynamic)
  principalAgents: z.array(principalAgentSchema).min(1, "At least one principal agent is required"),

  // Trust Account Details (dynamic)
  trustAccounts: z.array(trustAccountSchema).min(1, "At least one trust account is required"),

  // Compliance & Legal
  hasValidLicense: z.boolean(),
  hasProfessionalIndemnity: z.boolean(),
  hasPublicLiability: z.boolean(),
  hasBeenPenalized: z.boolean(),
  penaltyDetails: z.string().optional(),

  // Terms and Conditions
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  agreeToCodeOfConduct: z.boolean().refine((val) => val === true, {
    message: "You must agree to the code of conduct",
  }),
});

type OrganizationApplicationFormData = z.infer<typeof organizationApplicationSchema>;

const countryCodes = [
  { country: "Zimbabwe", code: "+263" },
  { country: "South Africa", code: "+27" },
  { country: "Botswana", code: "+267" },
  { country: "Zambia", code: "+260" },
  { country: "Mozambique", code: "+258" },
  { country: "United Kingdom", code: "+44" },
  { country: "United States", code: "+1" },
];

const steps = [
  { id: 1, title: "Company Details", icon: Building2, description: "Basic company information" },
  { id: 2, title: "Contact & Address", icon: MapPin, description: "Contact details and address" },
  { id: 3, title: "Directors & Principal Agent", icon: User, description: "Company directors and principal agent" },
  { id: 4, title: "Document Uploads", icon: FileText, description: "Required business documents" },
  { id: 5, title: "Payment", icon: CheckCircle, description: "Registration fee payment" },
  { id: 6, title: "Final Checklist", icon: CheckCircle, description: "Review and confirmation" },
];

interface OrganizationApplicationFormProps {
  onSubmit: (data: OrganizationApplicationFormData & { documents: string[] }) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<OrganizationApplicationFormData>;
}

export function OrganizationApplicationForm({ onSubmit, isLoading = false, initialData }: OrganizationApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [countryCodeSearch, setCountryCodeSearch] = useState("");

  const form = useForm<OrganizationApplicationFormData>({
    resolver: zodResolver(organizationApplicationSchema),
    defaultValues: {
      companyName: "",
      tradingName: "",
      registrationNumber: "",
      vatNumber: "",
      dateOfIncorporation: "",
      email: "",
      phoneCountryCode: "+263",
      phone: "",
      fax: "",
      website: "",
      physicalAddress: "",
      postalAddress: "",
      city: "",
      province: "",
      postalCode: "",
      businessDescription: "",
      yearsInOperation: "",
      numberOfEmployees: "",
      branchOffices: "",
      principalAgents: [
        {
          name: "",
          qualifications: "",
          yearsOfExperience: "",
          registrationNumber: "",
          role: "",
        }
      ],
      trustAccounts: [
        {
          bankName: "",
          accountNumber: "",
          accountName: "",
          branchCode: "",
        }
      ],
      hasValidLicense: false,
      hasProfessionalIndemnity: false,
      hasPublicLiability: false,
      hasBeenPenalized: false,
      penaltyDetails: "",
      agreeToTerms: false,
      agreeToCodeOfConduct: false,
      ...initialData,
    },
  });

  // Principal agents field array
  const { fields: principalAgentFields, append: appendAgent, remove: removeAgent } = useFieldArray({
    control: form.control,
    name: "principalAgents",
  });

  // Trust accounts field array
  const { fields: trustAccountFields, append: appendTrustAccount, remove: removeTrustAccount } = useFieldArray({
    control: form.control,
    name: "trustAccounts",
  });

  const addPrincipalAgent = () => {
    appendAgent({
      name: "",
      qualifications: "",
      yearsOfExperience: "",
      registrationNumber: "",
      role: "",
    });
  };

  const addTrustAccount = () => {
    appendTrustAccount({
      bankName: "",
      accountNumber: "",
      accountName: "",
      branchCode: "",
    });
  };

  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.country.toLowerCase().includes(countryCodeSearch.toLowerCase()) ||
      country.code.includes(countryCodeSearch)
  );

  const selectedPhoneCountryCode = form.watch("phoneCountryCode");
  const hasBeenPenalized = form.watch("hasBeenPenalized");

  const handleStepSubmit = async () => {
    // Define fields for each step
    const stepFields = {
      1: ["companyName", "registrationNumber", "dateOfIncorporation", "companyType"],
      2: ["email", "phoneCountryCode", "phone", "physicalAddress", "postalAddress", "city", "province", "postalCode"],
      3: ["businessDescription", "yearsInOperation", "numberOfEmployees", "principalAgents", "trustAccounts", "hasValidLicense", "hasProfessionalIndemnity", "hasPublicLiability", "hasBeenPenalized", ...(hasBeenPenalized ? ["penaltyDetails"] : [])],
      4: [], // Document upload handled separately
      5: [] // Payment step - add payment fields if needed
    };

    const currentStepFields = stepFields[currentStep as keyof typeof stepFields] || [];

    // Validate only current step fields
    const isValid = await form.trigger(currentStepFields as any);

    if (isValid) {
      // Special validation for step 3 - check principal agents and trust accounts
      if (currentStep === 3) {
        const agents = form.getValues("principalAgents");
        const hasValidAgent = agents.some(agent =>
          agent.name && agent.qualifications && agent.yearsOfExperience && agent.role
        );
        if (!hasValidAgent) {
          form.setError("principalAgents", {
            type: "manual",
            message: "At least one complete principal agent entry is required"
          });
          return;
        }

        const trustAccounts = form.getValues("trustAccounts");
        const hasValidTrustAccount = trustAccounts.some(account =>
          account.bankName && account.accountNumber && account.accountName && account.branchCode
        );
        if (!hasValidTrustAccount) {
          form.setError("trustAccounts", {
            type: "manual",
            message: "At least one complete trust account entry is required"
          });
          return;
        }
      }

      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFinalSubmit = (data: OrganizationApplicationFormData) => {
    onSubmit({ ...data, documents: uploadedDocuments });
  };

  const handleDocumentUpload = async () => {
    try {
      // Get upload URL from Object Storage service
      const response = await fetch('/api/object-storage/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const data = await response.json();
      return {
        method: "PUT" as const,
        url: data.uploadUrl,
      };
    } catch (error) {
      console.error('Error getting upload URL:', error);
      throw new Error('Document upload is not available. Please contact support.');
    }
  };

  const handleDocumentComplete = (result: any) => {
    const newDocuments = result.successful.map((file: any) => file.uploadURL);
    setUploadedDocuments(prev => [...prev, ...newDocuments]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  currentStep >= step.id
                    ? 'bg-egyptian-blue text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                data-testid={`step-${step.id}`}
              >
                <step.icon size={20} />
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-egyptian-blue' : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <Progress value={((currentStep - 1) / (steps.length - 1)) * 100} className="mt-4" />
      </div>

      <Card>
        <form onSubmit={form.handleSubmit(currentStep === 6 ? handleFinalSubmit : handleStepSubmit)}>
          {/* Step Content */}
          {currentStep === 1 && (
            <CardContent className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Details
                </CardTitle>
              </CardHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter company name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tradingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trading Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter trading name (if different)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Registration Number *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter registration number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VAT Registration Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter VAT number (if applicable)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfIncorporation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Incorporation *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="private_company">Private Company</SelectItem>
                          <SelectItem value="public_company">Public Company</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                          <SelectItem value="trust">Trust</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          )}

          {currentStep === 2 && (
            <CardContent className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Contact & Address
                </CardTitle>
              </CardHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="Enter email address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <FormField
                        control={form.control}
                        name="phoneCountryCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                    placeholder="Search..."
                                    value={countryCodeSearch}
                                    onChange={(e) => setCountryCodeSearch(e.target.value)}
                                    className="mb-2"
                                  />
                                </div>
                                {filteredCountryCodes.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    {country.code} {country.country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter phone number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="fax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fax Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter fax number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address Information
                  </h3>

                  <div className="grid grid-cols-1 gap-6 mt-4">
                    <FormField
                      control={form.control}
                      name="physicalAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Physical Address *</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Enter complete physical address" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Address *</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Enter complete postal address" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter province" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter postal code" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {currentStep === 3 && (
            <CardContent className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Directors & Principal Agent
                </CardTitle>
              </CardHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="yearsInOperation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years in Operation *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" placeholder="Enter years in operation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfEmployees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" placeholder="Enter number of employees" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your business activities, services offered, and areas of specialization"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branchOffices"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Offices</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="List any branch offices with their addresses (if applicable)"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Principal Real Estate Agents</h3>
                    <Button
                      type="button"
                      onClick={addPrincipalAgent}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Agent
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {principalAgentFields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Agent {index + 1}</h4>
                          {principalAgentFields.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeAgent(index)}
                              variant="outline"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`principalAgents.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter full name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`principalAgents.${index}.qualifications`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Qualifications *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter qualifications" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`principalAgents.${index}.yearsOfExperience`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Experience *</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" min="0" placeholder="Enter years" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`principalAgents.${index}.registrationNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>EACZ Registration Number</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter registration number" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="md:col-span-2">
                            <FormField
                              control={form.control}
                              name={`principalAgents.${index}.role`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Role in Organization *</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., Managing Director, Principal Agent" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {currentStep === 3 && (
            <CardContent className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Trust Accounts & Compliance
                </CardTitle>
              </CardHeader>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Trust Account Details</h3>
                    <Button
                      type="button"
                      onClick={addTrustAccount}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Account
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {trustAccountFields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Trust Account {index + 1}</h4>
                          {trustAccountFields.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeTrustAccount(index)}
                              variant="outline"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`trustAccounts.${index}.bankName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bank Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter bank name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`trustAccounts.${index}.accountNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Number *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter account number" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`trustAccounts.${index}.accountName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter account name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`trustAccounts.${index}.branchCode`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Branch Code *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter branch code" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Compliance & Legal Requirements</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hasValidLicense"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              The organization holds all required business licenses and permits
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasProfessionalIndemnity"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              The organization has professional indemnity insurance coverage
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasPublicLiability"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              The organization has public liability insurance coverage
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasBeenPenalized"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              The organization or its directors have been penalized by a regulatory body
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {hasBeenPenalized && (
                      <FormField
                        control={form.control}
                        name="penaltyDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Penalty Details *</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Please provide details of any penalties or regulatory actions"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {currentStep === 4 && (
            <CardContent className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Document Upload
                </CardTitle>
              </CardHeader>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Required Documents</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Certificate of Incorporation</li>
                    <li>• Memorandum and Articles of Association</li>
                    <li>• CR6 (Register of Directors)</li>
                    <li>• Trust Account Bank Statements (last 3 months)</li>
                    <li>• Professional Indemnity Insurance Certificate</li>
                    <li>• Public Liability Insurance Certificate</li>
                    <li>• Principal Agents' Qualification Certificates</li>
                    <li>• Principal Agents' CVs</li>
                    <li>• Any other relevant business permits or licenses</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg">
                  <ObjectUploader
                    {...({
                      uploader: handleDocumentUpload,
                      onComplete: handleDocumentComplete,
                      allowedFileTypes: ['image/*', 'application/pdf', '.doc', '.docx'],
                      maxFileSize: 10 * 1024 * 1024, // 10MB
                      multiple: true
                    } as any)}
                  />
                </div>

                {uploadedDocuments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Uploaded Documents:</h4>
                    <div className="space-y-2">
                      {uploadedDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="secondary">Document {index + 1}</Badge>
                          <span className="text-sm text-green-600">✓ Uploaded successfully</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}

          {currentStep === 5 && (
            <CardContent className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment
                </CardTitle>
              </CardHeader>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Registration Fee</h4>
                  <p className="text-sm text-blue-700">
                    The organization registration fee is $500 USD. You can choose to pay in full or set up an installment plan.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Payment Options</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-300 rounded-lg p-4 hover:bg-gray-100 cursor-pointer">
                        <h5 className="font-medium">PayNow EcoCash</h5>
                        <p className="text-sm text-gray-600">Pay using EcoCash mobile payment</p>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-4 hover:bg-gray-100 cursor-pointer">
                        <h5 className="font-medium">PayNow OneMoney</h5>
                        <p className="text-sm text-gray-600">Pay using OneMoney mobile payment</p>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-4 hover:bg-gray-100 cursor-pointer">
                        <h5 className="font-medium">Credit/Debit Card</h5>
                        <p className="text-sm text-gray-600">International card payments via Stripe</p>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-4 hover:bg-gray-100 cursor-pointer">
                        <h5 className="font-medium">Bank Transfer</h5>
                        <p className="text-sm text-gray-600">Direct bank transfer</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Payment Plan Options</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="paymentPlan" value="full" className="text-blue-600" defaultChecked />
                      <label className="text-sm">
                        <strong>Full Payment:</strong> Pay $500 USD now
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="paymentPlan" value="installments" className="text-blue-600" />
                      <label className="text-sm">
                        <strong>Installment Plan:</strong> Pay $200 USD now, then $150 USD monthly for 2 months
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {currentStep === 6 && (
            <CardContent className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Final Checklist
                </CardTitle>
              </CardHeader>

              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Before You Submit</h4>
                  <p className="text-sm text-yellow-700">
                    Please review all information carefully. Once submitted, changes will require
                    administrative approval. Ensure all required documents have been uploaded.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Company Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {form.watch("companyName")}</p>
                      <p><strong>Registration:</strong> {form.watch("registrationNumber")}</p>
                      <p><strong>Type:</strong> {form.watch("companyType")}</p>
                      <p><strong>Email:</strong> {form.watch("email")}</p>
                      <p><strong>Phone:</strong> {form.watch("phoneCountryCode")} {form.watch("phone")}</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Principal Agents</h4>
                    <div className="space-y-2 text-sm">
                      {form.watch("principalAgents").map((agent, index) => (
                        <div key={index} className="border-b pb-1">
                          <p><strong>{agent.name}</strong> - {agent.role}</p>
                          <p>{agent.yearsOfExperience} years experience</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Trust Accounts</h4>
                    <div className="space-y-2 text-sm">
                      {form.watch("trustAccounts").map((account, index) => (
                        <div key={index} className="border-b pb-1">
                          <p><strong>{account.bankName}</strong></p>
                          <p>Account: {account.accountNumber}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Documents</h4>
                    <div className="text-sm">
                      <p>{uploadedDocuments.length} document(s) uploaded</p>
                      {uploadedDocuments.length === 0 && (
                        <p className="text-red-500">⚠️ No documents uploaded</p>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the <span className="text-egyptian-blue underline cursor-pointer">
                              Terms and Conditions
                            </span> of the Estate Agents Council of Zimbabwe
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreeToCodeOfConduct"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to abide by the <span className="text-egyptian-blue underline cursor-pointer">
                              Code of Conduct
                            </span> for Real Estate Practitioners
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          )}

          <div className="flex justify-between items-center p-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
            </div>

            <Button type="submit" disabled={isLoading}>
              {currentStep === 6 ? (isLoading ? "Submitting..." : "Submit Application") : "Next"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}