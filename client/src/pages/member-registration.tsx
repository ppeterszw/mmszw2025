import { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFieldArray } from "react-hook-form";
import { businessExperienceSchema, type BusinessExperienceItem } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EnhancedDocumentUploader } from "@/components/EnhancedDocumentUploader";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { CheckCircle, Upload, FileText, User, ArrowLeft, AlertTriangle, Plus, Trash, Save } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useApplicantAuth } from "@/hooks/use-applicant-auth";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import type { Organization } from "@shared/schema";

const personalInfoSchema = z.object({
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  firstNames: z.string().min(2, "First names must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  countryOfBirth: z.string().min(1, "Country of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  email: z.string().email("Invalid email address"),
  phoneCountryCode: z.string().min(1, "Country code is required"),
  phone: z.string().min(6, "Phone number must be at least 6 digits"),
  employmentStatus: z.enum(["employed", "self_employed"]),
  currentEmployer: z.string().optional(),
  employmentCapacity: z.string().optional(),
  natureOfEstablishment: z.string().optional(),
  businessExperience: businessExperienceSchema,
}).refine((data) => {
  // Conditional validation for employment status
  if (data.employmentStatus === "employed") {
    return data.currentEmployer && data.currentEmployer.length > 0 &&
           data.employmentCapacity && data.employmentCapacity.length > 0;
  } else if (data.employmentStatus === "self_employed") {
    return data.natureOfEstablishment && data.natureOfEstablishment.length > 0;
  }
  return true;
}, {
  message: "Please provide required employment details",
  path: ["employmentStatus"],
});

const documentsSchema = z.object({
  identityDocument: z.string().min(1, "Identity document required"),
  birthCertificate: z.string().min(1, "Birth certificate required"),
  educationalCertificates: z.array(z.string()).min(1, "Educational certificates required"),
  proofOfEmployment: z.string().optional(),
  otherDocuments: z.array(z.string()).optional(),
});

const declarationsSchema = z.object({
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
  agreeToCodeOfConduct: z.boolean().refine(val => val === true, "You must agree to the code of conduct"),
  confirmTruthfulness: z.boolean().refine(val => val === true, "You must confirm the truthfulness of information"),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type DocumentsData = z.infer<typeof documentsSchema>;
type DeclarationsData = z.infer<typeof declarationsSchema>;

const sections = [
  { id: 1, title: "Personal Details", status: "current" },
  { id: 2, title: "Documents", status: "upcoming" },
  { id: 3, title: "Declarations", status: "upcoming" },
  { id: 4, title: "Payment", status: "upcoming" },
];

// Country codes data with search functionality
const countryCodes = [
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
];

export default function MemberRegistration() {
  const [currentSection, setCurrentSection] = useState(1);
  const [applicationData, setApplicationData] = useState<Partial<PersonalInfoData & DocumentsData & DeclarationsData>>({});
  const [, setLocation] = useLocation();
  const { applicant, saveDraftMutation, loadDraftQuery } = useApplicantAuth();
  
  // Load existing draft on component mount
  const draftQuery = loadDraftQuery(applicant?.applicantId || "");

  // Use the separate firstName and surname fields from applicant
  const firstNames = applicant?.firstName || "";
  const surname = applicant?.surname || "";

  // Form hooks - must be declared before useEffect that references them
  const personalForm = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      surname: surname, // Prefill with parsed surname
      firstNames: firstNames, // Prefill with parsed first names
      dateOfBirth: "",
      countryOfBirth: "",
      nationality: "",
      email: applicant?.email || "", // Prefill with logged-in applicant's email
      phoneCountryCode: "+263",
      phone: "",
      employmentStatus: "employed",
      currentEmployer: "",
      employmentCapacity: "",
      natureOfEstablishment: "",
      businessExperience: [
        {
          employer: "",
          typeOfBusiness: "",
          jobTitle: "",
          dateFrom: "",
          dateTo: "",
        }
      ],
    },
  });

  const documentsForm = useForm<DocumentsData>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      identityDocument: "",
      birthCertificate: "",
      educationalCertificates: [],
      proofOfEmployment: "",
      otherDocuments: [],
    },
  });

  const declarationsForm = useForm<DeclarationsData>({
    resolver: zodResolver(declarationsSchema),
    defaultValues: {
      agreeToTerms: false,
      agreeToCodeOfConduct: false,
      confirmTruthfulness: false,
    },
  });
  
  useEffect(() => {
    if (draftQuery.data && draftQuery.data.success) {
      const draftData = draftQuery.data.applicationData;
      console.log("Loading draft data:", draftData);
      setApplicationData(draftData);
      
      // Hydrate the forms with loaded draft data
      if (draftData.personalInfo) {
        console.log("Hydrating personal form with:", draftData.personalInfo);
        personalForm.reset(draftData.personalInfo);
      }
      if (draftData.documents) {
        console.log("Hydrating documents form with:", draftData.documents);
        documentsForm.reset(draftData.documents);
      }
      if (draftData.declarations) {
        console.log("Hydrating declarations form with:", draftData.declarations);
        declarationsForm.reset(draftData.declarations);
      }
    }
  }, [draftQuery.data, personalForm, documentsForm, declarationsForm]);

  // Handle saving draft
  const handleSaveDraft = () => {
    if (!applicant?.applicantId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your application draft.",
        variant: "destructive",
      });
      return;
    }
    
    // Capture current form values based on current section  
    let currentFormData = {};
    switch (currentSection) {
      case 1:
        currentFormData = { personalInfo: personalForm.getValues() };
        break;
      case 2:
        currentFormData = { documents: documentsForm.getValues() };
        break;
      case 3:
        currentFormData = { declarations: declarationsForm.getValues() };
        break;
    }
    
    // Merge current form data with existing application data
    const updatedApplicationData = { ...applicationData, ...currentFormData };
    
    saveDraftMutation.mutate({
      applicantId: applicant.applicantId,
      applicationData: updatedApplicationData
    }, {
      onSuccess: () => {
        // Update local state with saved data
        setApplicationData(updatedApplicationData);
        
        // Invalidate and refetch the draft query to keep cache in sync
        queryClient.invalidateQueries({
          queryKey: ["/api/applicants", applicant.applicantId, "load-draft"]
        });
        
        console.log("Draft saved successfully:", updatedApplicationData);
      }
    });
  };
  const { toast } = useToast();
  const [employerExists, setEmployerExists] = useState<boolean | null>(null);
  const [employerCheckLoading, setEmployerCheckLoading] = useState(false);
  const [countryCodeSearch, setCountryCodeSearch] = useState("");

  const { data: organizations = [] } = useQuery<Organization[]>({
    queryKey: ["/api/organizations"],
  });

  // Function to check if employer exists in registered organizations
  const checkEmployerExists = (employerName: string) => {
    if (!employerName.trim()) {
      setEmployerExists(null);
      return;
    }

    setEmployerCheckLoading(true);
    
    // Check if the entered employer name matches any registered organization
    const exists = organizations.some(org => 
      org.name.toLowerCase().includes(employerName.toLowerCase().trim()) ||
      employerName.toLowerCase().includes(org.name.toLowerCase())
    );
    
    setEmployerExists(exists);
    setEmployerCheckLoading(false);
  };

  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.country.toLowerCase().includes(countryCodeSearch.toLowerCase()) ||
      country.code.includes(countryCodeSearch)
  );

  const selectedPhoneCountryCode = personalForm.watch("phoneCountryCode");
  const employmentStatus = personalForm.watch("employmentStatus");

  // Set up useFieldArray for dynamic business experience
  const { fields, append, remove } = useFieldArray({
    control: personalForm.control,
    name: "businessExperience",
  });

  const submitApplicationMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/applications", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your membership application has been submitted successfully.",
      });
      setLocation("/auth");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSectionSubmit = (data: any) => {
    console.log('handleSectionSubmit called with:', data);
    console.log('Current section:', currentSection);
    setApplicationData(prev => ({ ...prev, ...data }));
    if (currentSection < 4) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handleDocumentUpload = async () => {
    console.log('handleDocumentUpload called');
    try {
      // Get upload URL from Object Storage service
      const response = await fetch('/api/object-storage/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Upload URL response:', response.status, response.ok);
      
      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }
      
      const data = await response.json();
      console.log('Upload URL data:', data);
      return {
        method: "PUT" as const,
        url: data.uploadUrl,
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

  const handleDocumentComplete = (result: any) => {
    const uploadedFiles = result.successful.map((file: any) => file.uploadURL);
  };

  const getSectionStatus = (sectionId: number) => {
    if (sectionId < currentSection) return "completed";
    if (sectionId === currentSection) return "current";
    return "upcoming";
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/50">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <p className="text-blue-100 mt-1">Please provide your personal details as they appear on your official documents</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...personalForm}>
                <form onSubmit={personalForm.handleSubmit(handleSectionSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={personalForm.control}
                      name="surname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Surname *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter surname" 
                              data-testid="input-surname"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalForm.control}
                      name="firstNames"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Names *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter first names" 
                              data-testid="input-first-names"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth *</FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                              data-testid="input-date-of-birth"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalForm.control}
                      name="countryOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country of Birth *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-country-birth">
                                <SelectValue placeholder="Select country of birth..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="zimbabwe">Zimbabwe</SelectItem>
                              <SelectItem value="south_africa">South Africa</SelectItem>
                              <SelectItem value="botswana">Botswana</SelectItem>
                              <SelectItem value="zambia">Zambia</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalForm.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-nationality">
                                <SelectValue placeholder="Select nationality..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="zimbabwean">Zimbabwean</SelectItem>
                              <SelectItem value="south_african">South African</SelectItem>
                              <SelectItem value="botswana">Botswana</SelectItem>
                              <SelectItem value="zambian">Zambian</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="Enter email address" 
                              data-testid="input-email"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel>Phone Number *</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <FormField
                          control={personalForm.control}
                          name="phoneCountryCode"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-country-code">
                                    <SelectValue>
                                      {selectedPhoneCountryCode && (
                                        <span className="flex items-center">
                                          {countryCodes.find(c => c.code === selectedPhoneCountryCode)?.flag}
                                          <span className="ml-2">{selectedPhoneCountryCode}</span>
                                        </span>
                                      )}
                                    </SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <div className="p-2">
                                    <Input
                                      placeholder="Search countries..."
                                      value={countryCodeSearch}
                                      onChange={(e) => setCountryCodeSearch(e.target.value)}
                                      className="mb-2"
                                      data-testid="input-country-search"
                                    />
                                  </div>
                                  {filteredCountryCodes.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                      <span className="flex items-center">
                                        <span className="mr-2">{country.flag}</span>
                                        <span className="mr-2">{country.country}</span>
                                        <Badge variant="outline" className="ml-auto">{country.code}</Badge>
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="md:col-span-2">
                          <FormField
                            control={personalForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    type="tel"
                                    placeholder="Enter phone number"
                                    data-testid="input-phone"
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
                    
                    <FormField
                      control={personalForm.control}
                      name="employmentStatus"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Employment Status *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                              data-testid="radio-employment-status"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="employed" id="employed" data-testid="radio-employed" />
                                <FormLabel htmlFor="employed" className="font-normal">
                                  Employed
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="self_employed" id="self_employed" data-testid="radio-self-employed" />
                                <FormLabel htmlFor="self_employed" className="font-normal">
                                  Self-Employed
                                </FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {employmentStatus === "employed" && (
                      <>
                        <FormField
                          control={personalForm.control}
                          name="currentEmployer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Employer *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your current employer's name"
                                  data-testid="input-employer"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    checkEmployerExists(e.target.value);
                                  }}
                                />
                              </FormControl>
                              {employerCheckLoading && (
                                <p className="text-sm text-muted-foreground">Checking if organization is registered...</p>
                              )}
                              {employerExists === false && field.value && field.value.trim() && (
                                <div className="flex items-start space-x-2 mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <div className="text-sm text-yellow-700">
                                    <p className="font-medium">Organization not found in our registry</p>
                                    <p className="mt-1">
                                      Please ensure your organization is registered with EACZ. You can proceed with your application, 
                                      but your employer verification may take longer during the review process.
                                    </p>
                                  </div>
                                </div>
                              )}
                              {employerExists === true && field.value && field.value.trim() && (
                                <div className="flex items-start space-x-2 mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <div className="text-sm text-green-700">
                                    <p className="font-medium">Organization found in our registry</p>
                                    <p className="mt-1">Your employer is registered with EACZ.</p>
                                  </div>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={personalForm.control}
                          name="employmentCapacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capacity in which employed *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-capacity">
                                    <SelectValue placeholder="Select capacity..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="agent">Estate Agent</SelectItem>
                                  <SelectItem value="real_estate_negotiator">Real Estate Negotiator</SelectItem>
                                  <SelectItem value="manager">Property Manager</SelectItem>
                                  <SelectItem value="principal">Principal Agent</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {employmentStatus === "self_employed" && (
                      <FormField
                        control={personalForm.control}
                        name="natureOfEstablishment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nature of Establishment *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Describe the nature of your establishment" 
                                data-testid="input-nature-establishment"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-base font-semibold">Business Experience Details *</FormLabel>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => append({
                          employer: "",
                          typeOfBusiness: "",
                          jobTitle: "",
                          dateFrom: "",
                          dateTo: "",
                        })}
                        data-testid="button-add-experience"
                        className="flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Experience</span>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-muted/20">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm text-muted-foreground">
                              Experience Entry {index + 1}
                            </h4>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => remove(index)}
                                data-testid={`button-remove-experience-${index}`}
                                className="flex items-center space-x-1"
                              >
                                <Trash className="w-3 h-3" />
                                <span className="sr-only">Remove experience</span>
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={personalForm.control}
                              name={`businessExperience.${index}.employer`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Employer *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter employer name"
                                      data-testid={`input-employer-${index}`}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={personalForm.control}
                              name={`businessExperience.${index}.typeOfBusiness`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Type of Business *</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid={`select-typeOfBusiness-${index}`}>
                                        <SelectValue placeholder="Select business type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-[200px]">
                                      {/* Real Estate Jobs */}
                                      <SelectItem value="Real Estate Agent">Real Estate Agent</SelectItem>
                                      <SelectItem value="Estate Agent">Estate Agent</SelectItem>
                                      <SelectItem value="Property Manager">Property Manager</SelectItem>
                                      <SelectItem value="Real Estate Broker">Real Estate Broker</SelectItem>
                                      <SelectItem value="Property Developer">Property Developer</SelectItem>
                                      <SelectItem value="Real Estate Consultant">Real Estate Consultant</SelectItem>
                                      <SelectItem value="Property Valuer">Property Valuer</SelectItem>
                                      <SelectItem value="Real Estate Appraiser">Real Estate Appraiser</SelectItem>
                                      <SelectItem value="Property Investment Advisor">Property Investment Advisor</SelectItem>
                                      <SelectItem value="Commercial Property Agent">Commercial Property Agent</SelectItem>
                                      <SelectItem value="Residential Property Agent">Residential Property Agent</SelectItem>
                                      <SelectItem value="Property Auctioneer">Property Auctioneer</SelectItem>
                                      <SelectItem value="Property Portfolio Manager">Property Portfolio Manager</SelectItem>
                                      <SelectItem value="Real Estate Marketing Manager">Real Estate Marketing Manager</SelectItem>
                                      <SelectItem value="Property Leasing Agent">Property Leasing Agent</SelectItem>
                                      <SelectItem value="Property Sales Manager">Property Sales Manager</SelectItem>
                                      <SelectItem value="Real Estate Investment Manager">Real Estate Investment Manager</SelectItem>
                                      <SelectItem value="Property Asset Manager">Property Asset Manager</SelectItem>
                                      <SelectItem value="Real Estate Finance Specialist">Real Estate Finance Specialist</SelectItem>
                                      <SelectItem value="Property Maintenance Manager">Property Maintenance Manager</SelectItem>
                                      <SelectItem value="Facilities Manager">Facilities Manager</SelectItem>
                                      <SelectItem value="Property Inspector">Property Inspector</SelectItem>
                                      <SelectItem value="Real Estate Analyst">Real Estate Analyst</SelectItem>
                                      
                                      {/* Construction & Development */}
                                      <SelectItem value="Construction Manager">Construction Manager</SelectItem>
                                      <SelectItem value="Project Manager">Project Manager</SelectItem>
                                      <SelectItem value="Architect">Architect</SelectItem>
                                      <SelectItem value="Civil Engineer">Civil Engineer</SelectItem>
                                      <SelectItem value="Structural Engineer">Structural Engineer</SelectItem>
                                      <SelectItem value="Quantity Surveyor">Quantity Surveyor</SelectItem>
                                      <SelectItem value="Land Surveyor">Land Surveyor</SelectItem>
                                      <SelectItem value="Urban Planner">Urban Planner</SelectItem>
                                      <SelectItem value="Building Inspector">Building Inspector</SelectItem>
                                      <SelectItem value="Construction Supervisor">Construction Supervisor</SelectItem>
                                      
                                      {/* Legal & Financial */}
                                      <SelectItem value="Property Lawyer">Property Lawyer</SelectItem>
                                      <SelectItem value="Conveyancer">Conveyancer</SelectItem>
                                      <SelectItem value="Legal Advisor">Legal Advisor</SelectItem>
                                      <SelectItem value="Financial Advisor">Financial Advisor</SelectItem>
                                      <SelectItem value="Mortgage Broker">Mortgage Broker</SelectItem>
                                      <SelectItem value="Property Finance Broker">Property Finance Broker</SelectItem>
                                      <SelectItem value="Banking Professional">Banking Professional</SelectItem>
                                      <SelectItem value="Insurance Broker">Insurance Broker</SelectItem>
                                      <SelectItem value="Property Insurance Specialist">Property Insurance Specialist</SelectItem>
                                      <SelectItem value="Accountant">Accountant</SelectItem>
                                      <SelectItem value="Tax Advisor">Tax Advisor</SelectItem>
                                      
                                      {/* Government & Regulatory */}
                                      <SelectItem value="Government Official">Government Official</SelectItem>
                                      <SelectItem value="Municipal Officer">Municipal Officer</SelectItem>
                                      <SelectItem value="Planning Officer">Planning Officer</SelectItem>
                                      <SelectItem value="Building Control Officer">Building Control Officer</SelectItem>
                                      <SelectItem value="Housing Officer">Housing Officer</SelectItem>
                                      <SelectItem value="Land Registry Officer">Land Registry Officer</SelectItem>
                                      
                                      {/* Business & Management */}
                                      <SelectItem value="Business Owner">Business Owner</SelectItem>
                                      <SelectItem value="Managing Director">Managing Director</SelectItem>
                                      <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                                      <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                                      <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                                      <SelectItem value="Administrative Manager">Administrative Manager</SelectItem>
                                      <SelectItem value="Executive Assistant">Executive Assistant</SelectItem>
                                      
                                      {/* Academia & Education */}
                                      <SelectItem value="Academic">Academic</SelectItem>
                                      <SelectItem value="Professor">Professor</SelectItem>
                                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                                      <SelectItem value="Teacher">Teacher</SelectItem>
                                      <SelectItem value="Researcher">Researcher</SelectItem>
                                      <SelectItem value="Training Manager">Training Manager</SelectItem>
                                      
                                      {/* Other Professional Services */}
                                      <SelectItem value="Consultant">Consultant</SelectItem>
                                      <SelectItem value="Freelancer">Freelancer</SelectItem>
                                      <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                                      <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
                                      <SelectItem value="Retired">Retired</SelectItem>
                                      <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={personalForm.control}
                              name={`businessExperience.${index}.jobTitle`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Job Title *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your job title"
                                      data-testid={`input-jobTitle-${index}`}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="md:col-span-1"></div>

                            <FormField
                              control={personalForm.control}
                              name={`businessExperience.${index}.dateFrom`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date From *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="date"
                                      data-testid={`input-dateFrom-${index}`}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={personalForm.control}
                              name={`businessExperience.${index}.dateTo`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date To</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="date"
                                      placeholder="Leave empty if current"
                                      data-testid={`input-dateTo-${index}`}
                                      {...field}
                                    />
                                  </FormControl>
                                  <p className="text-sm text-muted-foreground">
                                    Leave empty if this is your current position
                                  </p>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/")}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={saveDraftMutation.isPending}
                        data-testid="button-save-draft"
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saveDraftMutation.isPending ? "Saving..." : "Save Draft"}
                      </Button>
                      <Button
                        type="submit"
                        className="gradient-button text-white border-0"
                        data-testid="button-continue-to-documents"
                      >
                        Continue to Documents
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/50">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Documents</CardTitle>
                  <p className="text-purple-100 mt-1">Upload required documents for your application</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...documentsForm}>
                <form onSubmit={documentsForm.handleSubmit(handleSectionSubmit, (errors) => {
                  console.log('Form validation errors:', errors);
                  toast({
                    title: "Form Validation Error",
                    description: "Please check the form fields and try again.",
                    variant: "destructive",
                  });
                })} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="p-6 border-2 border-gradient-to-r from-indigo-200 to-indigo-300 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 h-full shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-indigo-900">Identity Document *</h4>
                      </div>
                      <p className="text-sm text-indigo-700 mb-4">Upload your National ID or Passport</p>
                      <EnhancedDocumentUploader
                        documentType="id_or_passport"
                        allowMultiple={false}
                        maxFiles={1}
                        onComplete={(files) => {
                          if (files.length > 0) {
                            const fileKey = files[0].fileKey;
                            console.log('Setting identityDocument to:', fileKey);
                            documentsForm.setValue('identityDocument', fileKey);
                            console.log('Form values after setting identity:', documentsForm.getValues());
                            handleDocumentComplete({ successful: [{ uploadURL: fileKey }] });
                          }
                        }}
                        data-testid="uploader-identity-document"
                      />
                    </div>

                    <div className="p-6 border-2 border-gradient-to-r from-pink-200 to-pink-300 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100/50 h-full shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-pink-900">Birth Certificate *</h4>
                      </div>
                      <p className="text-sm text-pink-700 mb-4">Upload your birth certificate</p>
                      <EnhancedDocumentUploader
                        documentType="birth_certificate"
                        allowMultiple={false}
                        maxFiles={1}
                        onComplete={(files) => {
                          if (files.length > 0) {
                            const fileKey = files[0].fileKey;
                            console.log('Setting birthCertificate to:', fileKey);
                            documentsForm.setValue('birthCertificate', fileKey);
                            console.log('Form values after setting birth cert:', documentsForm.getValues());
                            handleDocumentComplete({ successful: [{ uploadURL: fileKey }] });
                          }
                        }}
                        data-testid="uploader-birth-certificate"
                      />
                    </div>

                    <div className="p-6 border rounded-lg h-full md:col-span-2">
                      <h4 className="font-medium mb-2">Educational Certificates *</h4>
                      <p className="text-sm text-muted-foreground mb-4">Upload your educational qualifications (O-Level, A-Level, Degree, etc.)</p>
                      <EnhancedDocumentUploader
                        documentType="o_level_cert"
                        allowMultiple={true}
                        maxFiles={5}
                        onComplete={(files) => {
                          if (files.length > 0) {
                            const fileKeys = files.map(f => f.fileKey);
                            console.log('Setting educationalCertificates to include:', fileKeys);
                            const currentCerts = documentsForm.getValues('educationalCertificates') || [];
                            documentsForm.setValue('educationalCertificates', [...currentCerts, ...fileKeys]);
                            console.log('Form values after setting educational certs:', documentsForm.getValues());
                            handleDocumentComplete({ successful: files.map(f => ({ uploadURL: f.fileKey })) });
                          }
                        }}
                        data-testid="uploader-educational-certificates"
                      />
                    </div>

                    <div className="p-6 border rounded-lg h-full md:col-span-2">
                      <h4 className="font-medium mb-2">Proof of Employment</h4>
                      <p className="text-sm text-muted-foreground mb-4">Employment letter or contract (optional)</p>
                      <EnhancedDocumentUploader
                        allowMultiple={false}
                        maxFiles={1}
                        onComplete={(files) => {
                          if (files.length > 0) {
                            const fileKey = files[0].fileKey;
                            documentsForm.setValue('proofOfEmployment', fileKey);
                            handleDocumentComplete({ successful: [{ uploadURL: fileKey }] });
                          }
                        }}
                        data-testid="uploader-proof-employment"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentSection(1)}
                      data-testid="button-back-to-personal"
                    >
                      Back
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={saveDraftMutation.isPending}
                        data-testid="button-save-draft"
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saveDraftMutation.isPending ? "Saving..." : "Save Draft"}
                      </Button>
                      <Button
                        type="submit"
                        className="gradient-button text-white border-0"
                        data-testid="button-continue-to-declarations"
                        onClick={() => console.log('Continue to Declarations button clicked')}
                      >
                        Continue to Declarations
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Declarations</CardTitle>
              <p className="text-muted-foreground">Please read and accept the following declarations</p>
            </CardHeader>
            <CardContent>
              <Form {...declarationsForm}>
                <form onSubmit={declarationsForm.handleSubmit(handleSectionSubmit)} className="space-y-6">
                  <div className="space-y-8">
                    <FormField
                      control={declarationsForm.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-4 space-y-0 p-6 border rounded-lg">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-agree-terms"
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-2 leading-relaxed flex-1">
                            <FormLabel className="text-base font-medium">
                              I agree to the Terms and Conditions of the Estate Agents Council of Zimbabwe
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              By checking this box, you agree to abide by all terms and conditions set forth by the EACZ.
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={declarationsForm.control}
                      name="agreeToCodeOfConduct"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-4 space-y-0 p-6 border rounded-lg">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-agree-code-conduct"
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-2 leading-relaxed flex-1">
                            <FormLabel className="text-base font-medium">
                              I agree to the Code of Conduct for Estate Agents
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              You commit to maintaining professional standards and ethical practices in all dealings.
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={declarationsForm.control}
                      name="confirmTruthfulness"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-4 space-y-0 p-6 border rounded-lg">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-confirm-truthfulness"
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-2 leading-relaxed flex-1">
                            <FormLabel className="text-base font-medium">
                              I confirm that all information provided is true and accurate
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              False information may result in rejection of your application or termination of membership.
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentSection(2)}
                      data-testid="button-back-to-documents"
                    >
                      Back
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={saveDraftMutation.isPending}
                        data-testid="button-save-draft"
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saveDraftMutation.isPending ? "Saving..." : "Save Draft"}
                      </Button>
                      <Button
                        type="submit"
                        className="gradient-button text-white border-0"
                        data-testid="button-continue-to-payment"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <p className="text-muted-foreground">Complete your application with payment</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted p-6 rounded-lg">
                  <h4 className="font-medium mb-2">Application Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Application Fee:</span>
                      <span>$50.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span>$10.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Amount:</span>
                      <span>$60.00</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentSection(3)}
                    data-testid="button-back-to-declarations"
                  >
                    Back
                  </Button>
                  <Button
                    className="gradient-button text-white border-0"
                    onClick={() => setLocation("/payment")}
                    data-testid="button-proceed-to-payment"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FormHeader 
        title="Individual Member Application"
        subtitle="Complete your individual application with the Estate Agents Council of Zimbabwe"
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[{ label: "Individual Member Application" }]} />
        

        {/* Modern Section Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section, index) => (
              <div key={section.id} className="relative">
                <div className={`flex flex-col items-center p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                  getSectionStatus(section.id) === 'current' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border-blue-300' :
                  getSectionStatus(section.id) === 'completed' ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-800 border-green-200 shadow-sm' :
                  'bg-gradient-to-br from-gray-50 to-slate-50 text-gray-600 border-gray-200 hover:border-gray-300'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-3 transition-all duration-300 ${
                    getSectionStatus(section.id) === 'current' ? 'bg-white text-blue-600 shadow-lg' :
                    getSectionStatus(section.id) === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' :
                    'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600'
                  }`}>
                    {getSectionStatus(section.id) === 'completed' ? <CheckCircle className="w-6 h-6" /> : index + 1}
                  </div>
                  <span className="font-semibold text-center text-sm mb-2">{section.title}</span>
                  <Badge 
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      getSectionStatus(section.id) === 'current' ? 'bg-white/20 text-white border-white/30' :
                      getSectionStatus(section.id) === 'completed' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200' :
                      'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    {getSectionStatus(section.id) === 'current' ? 'Active' :
                     getSectionStatus(section.id) === 'completed' ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
                {index < sections.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-gray-300 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section Content */}
        {renderSection()}
      </div>
      <FormFooter />
    </div>
  );
}