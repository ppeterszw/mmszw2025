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
import { CheckCircle, Upload, User, GraduationCap, FileText, Plus, Trash2, Phone, MapPin } from "lucide-react";
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

const applicationSchema = z.object({
  // Basic Information
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
  physicalAddress: z.string().min(10, "Physical address must be at least 10 characters"),
  residentialAddress: z.string().min(10, "Residential address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  // Professional Details
  memberType: z.enum(["real_estate_agent", "property_manager", "principal_real_estate_agent", "real_estate_negotiator"]),
  organizationId: z.string().optional(),
  // Employment Status
  employmentStatus: z.enum(["employed", "self_employed"]),
  currentEmployer: z.string().optional(),
  jobTitle: z.string().optional(),
  natureOfEstablishment: z.string().optional(),
  // Business Experience
  businessExperience: z.array(businessExperienceSchema).min(0, "Business experience will be validated on step 2"),
  // Education
  educationLevel: z.enum(["o_level", "a_level", "bachelors", "hnd", "masters", "doctorate"]),
  isMatureEntry: z.boolean().default(false),
  hasOLevelMathsEnglish: z.boolean().default(false),
  hasALevelOrEquivalent: z.boolean().default(false),
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

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  onSubmit: (data: ApplicationFormData & { documents: string[] }) => void;
  organizations: Array<{ id: string; name: string }>;
  isLoading?: boolean;
}

const steps = [
  { id: 1, title: "Personal Information", icon: User },
  { id: 2, title: "Professional Details", icon: User },
  { id: 3, title: "Education Background", icon: GraduationCap },
  { id: 4, title: "Document Upload", icon: FileText },
  { id: 5, title: "Review & Submit", icon: CheckCircle },
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

export function ApplicationForm({ onSubmit, organizations, isLoading }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [countryCodeSearch, setCountryCodeSearch] = useState("");

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "male",
      dateOfBirth: "",
      nationality: "Zimbabwean",
      nationalId: "",
      passportNumber: "",
      email: "",
      phoneCountryCode: "+263",
      phone: "",
      physicalAddress: "",
      residentialAddress: "",
      city: "",
      postalCode: "",
      country: "Zimbabwe",
      memberType: "real_estate_agent",
      organizationId: "",
      employmentStatus: "employed",
      currentEmployer: "",
      jobTitle: "",
      natureOfEstablishment: "",
      businessExperience: [{
        employer: "",
        businessType: "",
        jobTitle: "",
        dateFrom: "",
        dateTo: "",
      }],
      educationLevel: "o_level",
      isMatureEntry: false,
      hasOLevelMathsEnglish: false,
      hasALevelOrEquivalent: false,
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

  const employmentStatus = form.watch("employmentStatus");
  const selectedPhoneCountryCode = form.watch("phoneCountryCode");

  const handleStepSubmit = async () => {
    // Define fields for each step
    const stepFields = {
      1: ["firstName", "lastName", "gender", "dateOfBirth", "nationality", "nationalId", "email", "phoneCountryCode", "phone", "physicalAddress", "residentialAddress", "city", "country"],
      2: ["memberType", "employmentStatus", ...(employmentStatus === "employed" ? ["currentEmployer", "jobTitle"] : []), ...(employmentStatus === "self_employed" ? ["natureOfEstablishment"] : [])],
      3: ["educationLevel", "hasOLevelMathsEnglish", "hasALevelOrEquivalent"],
      4: [] // Document upload handled separately
    };

    const currentStepFields = stepFields[currentStep as keyof typeof stepFields] || [];
    
    // Validate only current step fields
    const isValid = await form.trigger(currentStepFields as any);
    
    if (isValid) {
      // Special validation for step 2 - check business experience
      if (currentStep === 2) {
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
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFinalSubmit = (data: ApplicationFormData) => {
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
      // Fallback - return a placeholder that won't work but won't crash the app
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
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center ${index > 0 ? 'ml-4' : ''}`}>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    currentStep >= step.id 
                      ? 'bg-egyptian-blue text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                  data-testid={`step-${step.id}`}
                >
                  {step.id}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-egyptian-blue' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-12 h-px bg-border ml-4"></div>
              )}
            </div>
          ))}
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="mt-4" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(currentStep === 5 ? handleFinalSubmit : handleStepSubmit)}>
          {/* Step Content */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">Please provide your basic personal details and contact information.</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Basic Information
                  </h3>
                  
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
                </div>
                
                {/* Contact Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Contact Information
                  </h3>
                  
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
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Professional Details
                </CardTitle>
                <p className="text-sm text-muted-foreground">Please provide your professional information and membership preferences.</p>
              </CardHeader>
              <CardContent className="space-y-6">
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
                  {employmentStatus === "employed" && (
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
                  
                  {employmentStatus === "self_employed" && (
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
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education Background
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Document Upload
                </CardTitle>
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

          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Review & Submit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-sm text-muted-foreground mb-4">
                  Please review your application details before submission:
                </div>
                
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="font-medium mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                      {form.watch('passportNumber') && (
                        <div>
                          <label className="font-medium text-muted-foreground">Passport Number:</label>
                          <p>{form.watch('passportNumber')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h4 className="font-medium mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-muted-foreground">Email:</label>
                        <p>{form.watch('email')}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Phone:</label>
                        <p>{form.watch('phone')}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="font-medium text-muted-foreground">Physical Address:</label>
                        <p>{form.watch('physicalAddress')}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">City:</label>
                        <p>{form.watch('city')}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Country:</label>
                        <p>{form.watch('country')}</p>
                      </div>
                      {form.watch('postalCode') && (
                        <div>
                          <label className="font-medium text-muted-foreground">Postal Code:</label>
                          <p>{form.watch('postalCode')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Professional Details */}
                  <div>
                    <h4 className="font-medium mb-3">Professional Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-muted-foreground">Member Type:</label>
                        <p>{form.watch('memberType')?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      </div>
                      {form.watch('organizationId') && organizations.find(org => org.id === form.watch('organizationId')) && (
                        <div>
                          <label className="font-medium text-muted-foreground">Organization:</label>
                          <p>{organizations.find(org => org.id === form.watch('organizationId'))?.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Education Background */}
                  <div>
                    <h4 className="font-medium mb-3">Education Background</h4>
                    <div className="text-sm">
                      <div>
                        <label className="font-medium text-muted-foreground">Education Level:</label>
                        <p>{form.watch('educationLevel')?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Documents Uploaded:</label>
                    <p className="text-sm text-green-600">{uploadedDocuments.length} document(s)</p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    By submitting this application, I confirm that all information provided is accurate and complete.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

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
              className="bg-egyptian-blue hover:bg-egyptian-blue/90"
              disabled={isLoading}
              data-testid="button-next"
            >
              {currentStep === 5 ? (isLoading ? "Submitting..." : "Submit Application") : "Next"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
