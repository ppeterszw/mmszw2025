import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Upload, User, MapPin, Briefcase, FileText, CreditCard, Plus, Trash2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Business Experience schema for dynamic table
const businessExperienceSchema = z.object({
  employer: z.string().min(1, "Employer is required"),
  businessType: z.string().min(1, "Type of business is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  dateFrom: z.string().min(1, "Start date is required"),
  dateTo: z.string().min(1, "End date is required"),
}).refine((data) => {
  if (data.dateFrom && data.dateTo) {
    return new Date(data.dateFrom) < new Date(data.dateTo);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["dateTo"],
});

// Age validation function
const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const individualApplicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine((date) => {
    const age = calculateAge(date);
    return age >= 18;
  }, "You must be at least 18 years old to apply"),
  nationality: z.string().min(1, "Nationality is required"),
  nationalId: z.string().min(1, "National ID is required"),
  passportNumber: z.string().optional(),

  // Contact Information
  email: z.string().email("Invalid email address"),
  phoneCountryCode: z.string().min(1, "Country code is required"),
  phone: z.string().min(6, "Phone number must be at least 6 digits"),

  // Address Information
  physicalAddress: z.string().min(10, "Physical address must be at least 10 characters"),
  residentialAddress: z.string().min(10, "Residential address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().optional(),
  country: z.string().min(2, "Country is required"),

  // Professional Details
  memberType: z.enum(["real_estate_agent", "property_manager", "principal_real_estate_agent", "real_estate_negotiator"]),
  organizationId: z.string().optional(),
  employmentStatus: z.enum(["employed", "self_employed"]),
  currentEmployer: z.string().optional(),
  jobTitle: z.string().optional(),
  natureOfEstablishment: z.string().optional(),
  businessExperience: z.array(businessExperienceSchema).min(0, "Business experience will be validated on step 3"),
  educationLevel: z.enum(["o_level", "a_level", "bachelors", "hnd", "masters", "doctorate"]),
  isMatureEntry: z.boolean().default(false),
  hasOLevelMathsEnglish: z.boolean().default(false),
  hasALevelOrEquivalent: z.boolean().default(false),

  // Payment Information
  paymentMethod: z.enum(["cash", "paynow_ecocash", "paynow_onemoney", "stripe_card", "bank_transfer", "cheque"]),
  paymentPlan: z.enum(["full_payment", "installments"]).default("full_payment"),

  // Final Confirmation
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
  confirmedAccuracy: z.boolean().refine(val => val === true, "You must confirm the accuracy of information"),
}).refine((data) => {
  // Conditional validation for employment status
  if (data.employmentStatus === "employed") {
    return data.currentEmployer && data.currentEmployer.length > 0 &&
           data.jobTitle && data.jobTitle.length > 0;
  } else if (data.employmentStatus === "self_employed") {
    return data.natureOfEstablishment && data.natureOfEstablishment.length > 0;
  }
  return true;
}, {
  message: "Please provide required employment details",
  path: ["employmentStatus"],
});

type IndividualApplicationFormData = z.infer<typeof individualApplicationSchema>;

interface IndividualApplicationFormProps {
  onSubmit: (data: IndividualApplicationFormData & { documents: string[] }) => void;
  organizations: Array<{ id: string; name: string }>;
  isLoading?: boolean;
  initialData?: Partial<IndividualApplicationFormData>;
}

// Updated steps with 6 sections
const steps = [
  { id: 1, title: "Personal Details", icon: User, description: "Basic personal information" },
  { id: 2, title: "Address", icon: MapPin, description: "Contact and address information" },
  { id: 3, title: "Professional Details", icon: Briefcase, description: "Employment and experience" },
  { id: 4, title: "Document Uploads", icon: FileText, description: "Required certificates and documents" },
  { id: 5, title: "Payment", icon: CreditCard, description: "Application fee payment" },
  { id: 6, title: "Final Checklist", icon: CheckCircle, description: "Review and confirmation" },
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
];

// Application fees structure
const applicationFees = {
  real_estate_agent: { amount: 150, currency: "USD", description: "Real Estate Agent License" },
  property_manager: { amount: 200, currency: "USD", description: "Property Manager License" },
  principal_real_estate_agent: { amount: 300, currency: "USD", description: "Principal Real Estate Agent License" },
  real_estate_negotiator: { amount: 125, currency: "USD", description: "Real Estate Negotiator License" },
};

export function IndividualApplicationForm({
  onSubmit,
  organizations,
  isLoading,
  initialData = {}
}: IndividualApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [countryCodeSearch, setCountryCodeSearch] = useState("");

  const form = useForm<IndividualApplicationFormData>({
    resolver: zodResolver(individualApplicationSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      middleName: initialData.middleName || "",
      lastName: initialData.lastName || "",
      gender: initialData.gender || "male",
      dateOfBirth: initialData.dateOfBirth || "",
      nationality: initialData.nationality || "Zimbabwean",
      nationalId: initialData.nationalId || "",
      passportNumber: initialData.passportNumber || "",
      email: initialData.email || "",
      phoneCountryCode: initialData.phoneCountryCode || "+263",
      phone: initialData.phone || "",
      physicalAddress: initialData.physicalAddress || "",
      residentialAddress: initialData.residentialAddress || "",
      city: initialData.city || "",
      postalCode: initialData.postalCode || "",
      country: initialData.country || "Zimbabwe",
      memberType: initialData.memberType || "real_estate_agent",
      organizationId: initialData.organizationId || "",
      employmentStatus: initialData.employmentStatus || "employed",
      currentEmployer: initialData.currentEmployer || "",
      jobTitle: initialData.jobTitle || "",
      natureOfEstablishment: initialData.natureOfEstablishment || "",
      businessExperience: initialData.businessExperience || [{
        employer: "",
        businessType: "",
        jobTitle: "",
        dateFrom: "",
        dateTo: "",
      }],
      educationLevel: initialData.educationLevel || "o_level",
      isMatureEntry: initialData.isMatureEntry || false,
      hasOLevelMathsEnglish: initialData.hasOLevelMathsEnglish || false,
      hasALevelOrEquivalent: initialData.hasALevelOrEquivalent || false,
      paymentMethod: initialData.paymentMethod || "paynow_ecocash",
      paymentPlan: initialData.paymentPlan || "full_payment",
      agreedToTerms: initialData.agreedToTerms || false,
      confirmedAccuracy: initialData.confirmedAccuracy || false,
    },
  });

  // Business experience field array
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control: form.control,
    name: "businessExperience",
  });

  const addExperience = () => {
    appendExperience({
      employer: "",
      businessType: "",
      jobTitle: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.country.toLowerCase().includes(countryCodeSearch.toLowerCase()) ||
      country.code.includes(countryCodeSearch)
  );

  const watchedValues = {
    employmentStatus: form.watch("employmentStatus"),
    selectedPhoneCountryCode: form.watch("phoneCountryCode"),
    memberType: form.watch("memberType"),
    paymentPlan: form.watch("paymentPlan"),
  };

  const handleStepSubmit = async () => {
    // Define fields for each step
    const stepFields = {
      1: ["firstName", "lastName", "gender", "dateOfBirth", "nationality", "nationalId"],
      2: ["email", "phoneCountryCode", "phone", "physicalAddress", "residentialAddress", "city", "country"],
      3: ["memberType", "employmentStatus", ...(watchedValues.employmentStatus === "employed" ? ["currentEmployer", "jobTitle"] : []), ...(watchedValues.employmentStatus === "self_employed" ? ["natureOfEstablishment"] : []), "educationLevel"],
      4: [], // Document upload handled separately
      5: ["paymentMethod", "paymentPlan"],
    };

    const currentStepFields = stepFields[currentStep as keyof typeof stepFields] || [];

    // Validate only current step fields
    const isValid = await form.trigger(currentStepFields as any);

    if (isValid) {
      // Special validation for step 3 - check business experience
      if (currentStep === 3) {
        const businessExp = form.getValues("businessExperience");
        const hasValidExperience = businessExp.some(exp =>
          exp.employer && exp.businessType && exp.jobTitle && exp.dateFrom && exp.dateTo
        );
        if (!hasValidExperience) {
          form.setError("businessExperience", {
            type: "manual",
            message: "At least one complete business experience entry is required"
          });
          return;
        }
      }

      // Special validation for step 4 - check documents
      if (currentStep === 4 && uploadedDocuments.length === 0) {
        // Allow proceeding without documents for now, but show warning
        console.log("Warning: No documents uploaded");
      }

      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFinalSubmit = (data: IndividualApplicationFormData) => {
    onSubmit({ ...data, documents: uploadedDocuments });
  };

  const handleDocumentUpload = async () => {
    try {
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

  const selectedMemberType = watchedValues.memberType;
  const applicationFee = applicationFees[selectedMemberType];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center min-w-0">
              <div className={`flex items-center ${index > 0 ? 'ml-2' : ''}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  data-testid={`step-${step.id}`}
                >
                  {step.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <span className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-border ml-2 hidden sm:block"></div>
              )}
            </div>
          ))}
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="mt-4" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(currentStep === 6 ? handleFinalSubmit : handleStepSubmit)}>
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Details
                </CardTitle>
                <p className="text-sm text-muted-foreground">Please provide your basic personal information.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* First Name, Middle Name, Last Name - 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            data-testid="input-first-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your middle name (optional)"
                            data-testid="input-middle-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            data-testid="input-last-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Gender, Date of Birth - 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-gender">
                              <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            placeholder="dd. mm. yyyy"
                            data-testid="input-date-of-birth"
                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Nationality, National ID - 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-nationality">
                              <SelectValue placeholder="Select your nationality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Zimbabwean">Zimbabwean</SelectItem>
                            <SelectItem value="South African">South African</SelectItem>
                            <SelectItem value="Zambian">Zambian</SelectItem>
                            <SelectItem value="Botswana">Botswana</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>National ID *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your National ID number"
                            data-testid="input-national-id"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Passport Number - Full width */}
                <FormField
                  control={form.control}
                  name="passportNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passport Number (if applicable)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your passport number (optional)"
                          data-testid="input-passport-number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">Please provide your contact and address details.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Address, Phone Number - 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
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
                        control={form.control}
                        name="phoneCountryCode"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-country-code">
                                  <SelectValue>
                                    {watchedValues.selectedPhoneCountryCode && (
                                      <span className="flex items-center">
                                        {countryCodes.find(c => c.code === watchedValues.selectedPhoneCountryCode)?.flag}
                                        <span className="ml-2">{watchedValues.selectedPhoneCountryCode}</span>
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
                          control={form.control}
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
                </div>

                {/* Physical Address - Full width */}
                <FormField
                  control={form.control}
                  name="physicalAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Physical/Postal Address *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your full physical/postal address"
                          data-testid="input-physical-address"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Residential Address - Full width */}
                <FormField
                  control={form.control}
                  name="residentialAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Residential Address *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your current residential address where you live"
                          data-testid="input-residential-address"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City, Postal Code, Country - 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your city"
                            data-testid="input-city"
                            {...field}
                          />
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
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter postal code (optional)"
                            data-testid="input-postal-code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-country">
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                            <SelectItem value="South Africa">South Africa</SelectItem>
                            <SelectItem value="Zambia">Zambia</SelectItem>
                            <SelectItem value="Botswana">Botswana</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Professional Details */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Professional Details
                </CardTitle>
                <p className="text-sm text-muted-foreground">Please provide your professional and employment information.</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Membership Type and Organization */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Membership Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="memberType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Membership Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-member-type">
                              <SelectValue placeholder="Select membership type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="real_estate_agent">Real Estate Agent</SelectItem>
                            <SelectItem value="property_manager">Property Manager</SelectItem>
                            <SelectItem value="principal_real_estate_agent">Principal Real Estate Agent</SelectItem>
                            <SelectItem value="real_estate_negotiator">Real Estate Negotiator</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Associated Real Estate Firm</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-organization">
                              <SelectValue placeholder="Select organization (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizations.map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                {org.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Employment Status Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center border-t pt-6">
                    <User className="w-4 h-4 mr-2" />
                    Employment Status
                  </h3>

                  <FormField
                    control={form.control}
                    name="employmentStatus"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Are you currently *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                            data-testid="radio-employment-status"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="employed" id="employed" />
                              <label
                                htmlFor="employed"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                data-testid="label-employed"
                              >
                                Employed (working for an organization)
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="self_employed" id="self_employed" />
                              <label
                                htmlFor="self_employed"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                data-testid="label-self-employed"
                              >
                                Self-Employed (running own business)
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conditional Fields based on Employment Status */}
                  {watchedValues.employmentStatus === "employed" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                      <FormField
                        control={form.control}
                        name="currentEmployer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Employer *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your current employer/company name"
                                data-testid="input-current-employer"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your current job title/position"
                                data-testid="input-job-title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {watchedValues.employmentStatus === "self_employed" && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <FormField
                        control={form.control}
                        name="natureOfEstablishment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nature of Establishment *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the nature of your business/establishment"
                                data-testid="input-nature-establishment"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Business Experience Section */}
                <div className="space-y-4 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Business Experience Details
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addExperience}
                      className="flex items-center"
                      data-testid="button-add-experience"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {experienceFields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Experience #{index + 1}</h4>
                          {experienceFields.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeExperience(index)}
                              data-testid={`button-remove-experience-${index}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`businessExperience.${index}.employer`}
                            render={({ field: expField }) => (
                              <FormItem>
                                <FormLabel>Employer *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Company/Employer name"
                                    data-testid={`input-employer-${index}`}
                                    {...expField}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`businessExperience.${index}.businessType`}
                            render={({ field: expField }) => (
                              <FormItem>
                                <FormLabel>Type of Business *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Industry/Business type"
                                    data-testid={`input-business-type-${index}`}
                                    {...expField}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`businessExperience.${index}.jobTitle`}
                            render={({ field: expField }) => (
                              <FormItem>
                                <FormLabel>Job Title *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your position/role"
                                    data-testid={`input-exp-job-title-${index}`}
                                    {...expField}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <FormField
                              control={form.control}
                              name={`businessExperience.${index}.dateFrom`}
                              render={({ field: expField }) => (
                                <FormItem>
                                  <FormLabel>Date From *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="date"
                                      data-testid={`input-date-from-${index}`}
                                      {...expField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`businessExperience.${index}.dateTo`}
                              render={({ field: expField }) => (
                                <FormItem>
                                  <FormLabel>Date To *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="date"
                                      data-testid={`input-date-to-${index}`}
                                      {...expField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education Background */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Education Background
                  </h3>

                  <FormField
                    control={form.control}
                    name="educationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highest Education Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-education-level">
                              <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="o_level">O-Level</SelectItem>
                            <SelectItem value="a_level">A-Level</SelectItem>
                            <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                            <SelectItem value="hnd">Higher National Diploma (HND)</SelectItem>
                            <SelectItem value="masters">Master's Degree</SelectItem>
                            <SelectItem value="doctorate">Doctorate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="hasOLevelMathsEnglish"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-o-level-maths-english"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I have O-Level Mathematics and English
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasALevelOrEquivalent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-a-level-equivalent"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I have A-Level or equivalent qualification
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isMatureEntry"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-mature-entry"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I am applying as a mature candidate (25+ years old)
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Document Uploads */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Required Document Uploads
                </CardTitle>
                <p className="text-sm text-muted-foreground">Please upload all required documents for your application.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-sm text-muted-foreground mb-4">
                  Please upload the following required documents:
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Educational Certificates</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload your O-Level, A-Level, or degree certificates
                    </p>
                    <ObjectUploader
                      maxNumberOfFiles={3}
                      maxFileSize={10485760}
                      onGetUploadParameters={handleDocumentUpload}
                      onComplete={handleDocumentComplete}
                      buttonClassName="w-full"
                    >
                      <div className="flex flex-col items-center p-4">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm">Upload Educational Documents</span>
                      </div>
                    </ObjectUploader>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Identity Document</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload a clear copy of your National ID or Passport
                    </p>
                    <ObjectUploader
                      maxNumberOfFiles={1}
                      maxFileSize={10485760}
                      onGetUploadParameters={handleDocumentUpload}
                      onComplete={handleDocumentComplete}
                      buttonClassName="w-full"
                    >
                      <div className="flex flex-col items-center p-4">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm">Upload ID/Passport</span>
                      </div>
                    </ObjectUploader>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Professional Certificates</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload any relevant professional certifications or training certificates
                    </p>
                    <ObjectUploader
                      maxNumberOfFiles={5}
                      maxFileSize={10485760}
                      onGetUploadParameters={handleDocumentUpload}
                      onComplete={handleDocumentComplete}
                      buttonClassName="w-full"
                    >
                      <div className="flex flex-col items-center p-4">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm">Upload Professional Certificates</span>
                      </div>
                    </ObjectUploader>
                  </div>

                  {uploadedDocuments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Uploaded Documents ({uploadedDocuments.length})</h4>
                      <div className="text-sm text-green-600">
                        ✓ {uploadedDocuments.length} document(s) uploaded successfully
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Payment Information */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Application Fee Payment
                </CardTitle>
                <p className="text-sm text-muted-foreground">Select your payment method for the application fee.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fee Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Application Fee Summary</h4>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>{applicationFee.description}</span>
                      <span className="font-medium">{applicationFee.currency} {applicationFee.amount}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2 font-medium">
                      <span>Total Amount</span>
                      <span>{applicationFee.currency} {applicationFee.amount}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Plan */}
                <FormField
                  control={form.control}
                  name="paymentPlan"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Payment Plan *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="full_payment" id="full_payment" />
                            <label
                              htmlFor="full_payment"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Full Payment ({applicationFee.currency} {applicationFee.amount})
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="installments" id="installments" />
                            <label
                              htmlFor="installments"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Installment Plan (3 monthly payments of {applicationFee.currency} {Math.ceil(applicationFee.amount / 3)})
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-payment-method">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="paynow_ecocash">PayNow - EcoCash</SelectItem>
                          <SelectItem value="paynow_onemoney">PayNow - OneMoney</SelectItem>
                          <SelectItem value="stripe_card">Credit/Debit Card (International)</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash Payment (Office)</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Instructions */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Payment Instructions</h4>
                  <p className="text-sm text-muted-foreground">
                    After submitting this application, you will be redirected to complete your payment using the selected method.
                    Your application will be processed once payment is confirmed.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Final Checklist and Confirmation */}
          {currentStep === 6 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Final Checklist & Confirmation
                </CardTitle>
                <p className="text-sm text-muted-foreground">Please review your application and confirm all details are correct.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Application Summary */}
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="font-medium mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="font-medium text-muted-foreground">Full Name:</label>
                        <p>{form.watch('firstName')} {form.watch('middleName') && form.watch('middleName') + ' '}{form.watch('lastName')}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Gender:</label>
                        <p className="capitalize">{form.watch('gender')}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Date of Birth:</label>
                        <p>{form.watch('dateOfBirth')}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Nationality:</label>
                        <p>{form.watch('nationality')}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">National ID:</label>
                        <p>{form.watch('nationalId')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-medium mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="font-medium text-muted-foreground">Email:</label>
                        <p>{form.watch('email')}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Phone:</label>
                        <p>{form.watch('phoneCountryCode')} {form.watch('phone')}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="font-medium text-muted-foreground">Address:</label>
                        <p>{form.watch('physicalAddress')}, {form.watch('city')}, {form.watch('country')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div>
                    <h4 className="font-medium mb-3">Professional Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="font-medium text-muted-foreground">Member Type:</label>
                        <p>{form.watch('memberType')?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Employment Status:</label>
                        <p className="capitalize">{form.watch('employmentStatus')?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Education Level:</label>
                        <p>{form.watch('educationLevel')?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <h4 className="font-medium mb-3">Payment Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="font-medium text-muted-foreground">Payment Plan:</label>
                        <p className="capitalize">{form.watch('paymentPlan')?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Payment Method:</label>
                        <p className="capitalize">{form.watch('paymentMethod')?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Amount:</label>
                        <p>{applicationFee.currency} {applicationFee.amount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="font-medium mb-3">Documents</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-medium text-muted-foreground">Documents Uploaded:</label>
                      <p className={`text-sm ${uploadedDocuments.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {uploadedDocuments.length > 0
                          ? `✓ ${uploadedDocuments.length} document(s) uploaded`
                          : '⚠ No documents uploaded yet'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4 border-t pt-6">
                  <h4 className="font-medium">Terms and Conditions</h4>

                  <FormField
                    control={form.control}
                    name="confirmedAccuracy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-confirmed-accuracy"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I confirm that all information provided in this application is accurate and complete to the best of my knowledge. *
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreedToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-agreed-terms"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the Estate Agents Council of Zimbabwe terms and conditions, code of conduct, and membership requirements. *
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Ready to Submit</h4>
                  <p className="text-sm text-green-700">
                    Once you submit this application, you will receive a confirmation email and be redirected to complete your payment.
                    Your application will be reviewed within 5-7 business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              data-testid="button-previous"
            >
              Previous
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
              data-testid="button-next"
            >
              {currentStep === 6 ? (isLoading ? "Submitting..." : "Submit Application") : "Next"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}