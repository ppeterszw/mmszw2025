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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

// Step 1: Personal Details
const personalInfoSchema = z.object({
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  firstNames: z.string().min(2, "First names must be at least 2 characters"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  countryOfBirth: z.string().min(1, "Country of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  identityType: z.enum(["national_id", "passport"], { required_error: "Identity type is required" }),
  identityNumber: z.string().min(1, "Identity number is required"),
  email: z.string().email("Invalid email address"),
  phoneCountryCode: z.string().min(1, "Country code is required"),
  phone: z.string().min(6, "Phone number must be at least 6 digits"),
}).refine((data) => {
  // Validate Zimbabwean National ID format: XX-XXXXXXX-X-XX
  if (data.identityType === "national_id") {
    const nationalIdPattern = /^\d{2}-\d{6,7}[A-Z]-\d{2}$/;
    return nationalIdPattern.test(data.identityNumber);
  }
  // Validate Zimbabwean Passport format: XX XXXXXX (2 letters + 6 digits)
  if (data.identityType === "passport") {
    const passportPattern = /^[A-Z]{2}\s?\d{6}$/;
    return passportPattern.test(data.identityNumber);
  }
  return true;
}, {
  message: "Invalid format. National ID: XX-XXXXXXX-X-XX, Passport: XX XXXXXX",
  path: ["identityNumber"],
});

// Step 2: Address Details
const addressSchema = z.object({
  addressType: z.enum(["residential", "company"], { required_error: "Address type is required" }),
  country: z.string().min(1, "Country is required"),
  province: z.string().min(1, "Province/State is required"),
  city: z.string().min(1, "City is required"),
  streetAddress: z.string().min(5, "Street address is required"),
  postalCode: z.string().optional(),
  postalAddress: z.string().optional(),
  postalCity: z.string().optional(),
  postalCountry: z.string().optional(),
  sameAsPhysical: z.boolean().default(false),
});

// Step 3: Professional Details
const professionalDetailsSchema = z.object({
  isEmployed: z.enum(["yes", "no"], { required_error: "Please specify if you are employed" }),
  isFirmRegistered: z.enum(["yes", "no"]).optional(),
  registeredFirmId: z.string().optional(),
  registeredFirmName: z.string().optional(),
  isPrincipalAgent: z.enum(["yes", "no"]).optional(),
  registerFirmLater: z.boolean().default(false),
  employmentCapacity: z.string().optional(),
  businessExperience: businessExperienceSchema,
}).refine((data) => {
  // If employed, firm registration status is required
  if (data.isEmployed === "yes") {
    if (!data.isFirmRegistered) return false;

    // If firm is registered, must select a firm
    if (data.isFirmRegistered === "yes") {
      return !!data.registeredFirmId && !!data.employmentCapacity;
    }

    // If firm not registered, check if principal agent
    if (data.isFirmRegistered === "no") {
      return !!data.isPrincipalAgent;
    }
  }
  return true;
}, {
  message: "Please provide complete employment details",
  path: ["isEmployed"],
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
type AddressData = z.infer<typeof addressSchema>;
type ProfessionalDetailsData = z.infer<typeof professionalDetailsSchema>;
type DocumentsData = z.infer<typeof documentsSchema>;
type DeclarationsData = z.infer<typeof declarationsSchema>;

const sections = [
  { id: 1, title: "Personal Details", status: "current" },
  { id: 2, title: "Address", status: "upcoming" },
  { id: 3, title: "Professional Details", status: "upcoming" },
  { id: 4, title: "Documents", status: "upcoming" },
  { id: 5, title: "Declarations", status: "upcoming" },
  { id: 6, title: "Payment", status: "upcoming" },
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

// Southern Africa Location Data
const locationData = {
  Zimbabwe: {
    provinces: {
      "Harare": ["Harare", "Chitungwiza", "Epworth", "Norton", "Ruwa"],
      "Bulawayo": ["Bulawayo"],
      "Manicaland": ["Mutare", "Rusape", "Chipinge", "Chimanimani", "Nyanga", "Buhera"],
      "Mashonaland Central": ["Bindura", "Mount Darwin", "Shamva", "Guruve", "Mazowe", "Mvurwi"],
      "Mashonaland East": ["Marondera", "Murehwa", "Mutoko", "Goromonzi", "Wedza", "Mudzi"],
      "Mashonaland West": ["Chinhoyi", "Kariba", "Karoi", "Mhangura", "Chegutu", "Kadoma"],
      "Matabeleland North": ["Hwange", "Victoria Falls", "Binga", "Lupane", "Tsholotsho"],
      "Matabeleland South": ["Gwanda", "Beitbridge", "Plumtree", "Gwanda", "Filabusi"],
      "Midlands": ["Gweru", "Kwekwe", "Redcliff", "Zvishavane", "Shurugwi", "Gokwe"],
      "Masvingo": ["Masvingo", "Chiredzi", "Triangle", "Bikita", "Zaka", "Gutu"]
    }
  },
  "South Africa": {
    provinces: {
      "Gauteng": ["Johannesburg", "Pretoria", "Soweto", "Sandton", "Randburg", "Roodepoort", "Benoni", "Boksburg"],
      "Western Cape": ["Cape Town", "Stellenbosch", "Paarl", "George", "Mossel Bay", "Worcester"],
      "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Richards Bay", "Newcastle", "Ladysmith"],
      "Eastern Cape": ["Port Elizabeth", "East London", "Mthatha", "Grahamstown", "Queenstown"],
      "Free State": ["Bloemfontein", "Welkom", "Kroonstad", "Bethlehem", "Sasolburg"],
      "Limpopo": ["Polokwane", "Tzaneen", "Musina", "Thohoyandou", "Lebowakgomo"],
      "Mpumalanga": ["Nelspruit", "Witbank", "Middelburg", "Secunda", "Standerton"],
      "North West": ["Mahikeng", "Rustenburg", "Klerksdorp", "Potchefstroom", "Brits"],
      "Northern Cape": ["Kimberley", "Upington", "Springbok", "De Aar", "Kuruman"]
    }
  },
  Botswana: {
    provinces: {
      "South-East": ["Gaborone", "Ramotswa", "Mochudi", "Lobatse"],
      "Kweneng": ["Molepolole", "Mogoditshane", "Thamaga", "Gabane"],
      "North-East": ["Francistown", "Selebi-Phikwe", "Masunga", "Tonota"],
      "Central": ["Serowe", "Palapye", "Mahalapye", "Bobonong"],
      "North-West": ["Maun", "Ghanzi", "Shakawe", "Gumare"],
      "Southern": ["Kanye", "Jwaneng", "Mmathethe", "Good Hope"],
      "Kgatleng": ["Mochudi", "Oodi", "Rasesa"],
      "Kgalagadi": ["Tsabong", "Hukuntsi", "Werda"],
      "Ghanzi": ["Ghanzi", "Kuke", "Chao"],
      "Chobe": ["Kasane", "Pandamatenga", "Kazungula"]
    }
  },
  Zambia: {
    provinces: {
      "Lusaka": ["Lusaka", "Kafue", "Chongwe", "Chilanga"],
      "Copperbelt": ["Kitwe", "Ndola", "Mufulira", "Chingola", "Luanshya", "Chililabombwe"],
      "Central": ["Kabwe", "Kapiri Mposhi", "Mkushi", "Serenje"],
      "Eastern": ["Chipata", "Katete", "Lundazi", "Petauke"],
      "Luapula": ["Mansa", "Nchelenge", "Samfya", "Kawambwa"],
      "Northern": ["Kasama", "Mbala", "Mpika", "Luwingu"],
      "North-Western": ["Solwezi", "Kasempa", "Zambezi", "Mwinilunga"],
      "Southern": ["Livingstone", "Choma", "Mazabuka", "Monze"],
      "Western": ["Mongu", "Senanga", "Sesheke", "Kaoma"],
      "Muchinga": ["Chinsali", "Isoka", "Nakonde", "Shiwang'andu"]
    }
  },
  Mozambique: {
    provinces: {
      "Maputo City": ["Maputo"],
      "Maputo": ["Matola", "Boane", "Moamba", "Manhiça"],
      "Gaza": ["Xai-Xai", "Chókwè", "Chibuto", "Manjacaze"],
      "Inhambane": ["Inhambane", "Maxixe", "Vilankulo", "Massinga"],
      "Sofala": ["Beira", "Dondo", "Nhamatanda", "Gorongosa"],
      "Manica": ["Chimoio", "Manica", "Gondola", "Sussundenga"],
      "Tete": ["Tete", "Moatize", "Angónia", "Cahora Bassa"],
      "Zambézia": ["Quelimane", "Mocuba", "Gurúè", "Milange"],
      "Nampula": ["Nampula", "Nacala", "Angoche", "Ilha de Moçambique"],
      "Niassa": ["Lichinga", "Cuamba", "Mandimba", "Marrupa"],
      "Cabo Delgado": ["Pemba", "Montepuez", "Mocímboa da Praia", "Palma"]
    }
  },
  Malawi: {
    provinces: {
      "Southern": ["Blantyre", "Zomba", "Mulanje", "Mangochi", "Thyolo", "Nsanje"],
      "Central": ["Lilongwe", "Dedza", "Salima", "Kasungu", "Nkhotakota"],
      "Northern": ["Mzuzu", "Karonga", "Rumphi", "Nkhata Bay", "Likoma"]
    }
  },
  Namibia: {
    provinces: {
      "Khomas": ["Windhoek"],
      "Erongo": ["Swakopmund", "Walvis Bay", "Henties Bay", "Arandis"],
      "Otjozondjupa": ["Otjiwarongo", "Grootfontein", "Okahandja", "Okakarara"],
      "Hardap": ["Mariental", "Rehoboth", "Aranos", "Maltahöhe"],
      "Karas": ["Keetmanshoop", "Lüderitz", "Karasburg", "Oranjemund"],
      "Kavango East": ["Rundu", "Nkurenkuru"],
      "Kavango West": ["Nkurenkuru", "Mpungu"],
      "Kunene": ["Opuwo", "Outjo", "Khorixas", "Kamanjab"],
      "Ohangwena": ["Eenhana", "Okongo", "Endola"],
      "Omaheke": ["Gobabis", "Witvlei", "Aranos"],
      "Omusati": ["Outapi", "Okahao", "Oshikuku"],
      "Oshana": ["Oshakati", "Ondangwa"],
      "Oshikoto": ["Tsumeb", "Omuthiya", "Oniipa"],
      "Zambezi": ["Katima Mulilo", "Ngoma", "Linyanti"]
    }
  }
};

// Get countries from Southern Africa
const southernAfricanCountries = Object.keys(locationData);

export default function MemberRegistration() {
  const [currentSection, setCurrentSection] = useState(1);
  const [applicationData, setApplicationData] = useState<Partial<PersonalInfoData & AddressData & ProfessionalDetailsData & DocumentsData & DeclarationsData>>({});
  const [, setLocation] = useLocation();
  const { applicant, saveDraftMutation, loadDraftQuery } = useApplicantAuth();

  // State for cascading location dropdowns
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  
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
    },
  });

  const addressForm = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      residentialAddress: "",
      residentialCity: "",
      residentialProvince: "",
      residentialPostalCode: "",
      postalAddress: "",
      postalCity: "",
      postalCode: "",
      sameAsResidential: false,
    },
  });

  const professionalForm = useForm<ProfessionalDetailsData>({
    resolver: zodResolver(professionalDetailsSchema),
    defaultValues: {
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
      if (draftData.address) {
        console.log("Hydrating address form with:", draftData.address);
        addressForm.reset(draftData.address);
      }
      if (draftData.professionalDetails) {
        console.log("Hydrating professional form with:", draftData.professionalDetails);
        professionalForm.reset(draftData.professionalDetails);
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
  }, [draftQuery.data, personalForm, addressForm, professionalForm, documentsForm, declarationsForm]);

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
        currentFormData = { address: addressForm.getValues() };
        break;
      case 3:
        currentFormData = { professionalDetails: professionalForm.getValues() };
        break;
      case 4:
        currentFormData = { documents: documentsForm.getValues() };
        break;
      case 5:
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
  const employmentStatus = professionalForm.watch("employmentStatus");

  // Watch employment flow fields
  const isEmployed = professionalForm.watch("isEmployed");
  const isFirmRegistered = professionalForm.watch("isFirmRegistered");
  const isPrincipalAgent = professionalForm.watch("isPrincipalAgent");

  // Set up useFieldArray for dynamic business experience
  const { fields, append, remove } = useFieldArray({
    control: professionalForm.control,
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
    if (currentSection < 6) {
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-gender">
                                <SelectValue placeholder="Select gender..." />
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
                      name="identityType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Identity Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-identity-type">
                                <SelectValue placeholder="Select identity type..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="national_id">National ID</SelectItem>
                              <SelectItem value="passport">Passport</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={personalForm.control}
                      name="identityNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Identity Number *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                personalForm.watch("identityType") === "passport"
                                  ? "e.g., FN 123456"
                                  : "e.g., 63-123456A-21"
                              }
                              data-testid="input-identity-number"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {personalForm.watch("identityType") === "passport"
                              ? "Format: XX XXXXXX (2 letters + 6 digits)"
                              : "Format: XX-XXXXXXX-X-XX"}
                          </FormDescription>
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
                      <div className="grid grid-cols-1 gap-2">
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
                        <div>
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
                        data-testid="button-continue-to-address"
                      >
                        Continue to Address
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
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/50">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Address Information</CardTitle>
                  <p className="text-green-100 mt-1">Please provide your residential and postal address details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...addressForm}>
                <form onSubmit={addressForm.handleSubmit(handleSectionSubmit)} className="space-y-6">
                  <div className="space-y-6">
                    <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50/50 md:col-span-2">
                      <h3 className="font-semibold text-green-900 mb-1">Physical Address</h3>
                      <p className="text-sm text-green-700">Your current address details</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={addressForm.control}
                        name="addressType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-address-type">
                                  <SelectValue placeholder="Select address type..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="residential">Residential Address</SelectItem>
                                <SelectItem value="company">Company Address</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={addressForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country *</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedCountry(value);
                                setSelectedProvince("");
                                addressForm.setValue("province", "");
                                addressForm.setValue("city", "");
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-country">
                                  <SelectValue placeholder="Select country..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {southernAfricanCountries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {selectedCountry && (
                        <FormField
                          control={addressForm.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Province/State *</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setSelectedProvince(value);
                                  addressForm.setValue("city", "");
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger data-testid="select-province">
                                    <SelectValue placeholder="Select province..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.keys(locationData[selectedCountry as keyof typeof locationData]?.provinces || {}).map((province) => (
                                    <SelectItem key={province} value={province}>
                                      {province}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {selectedCountry && selectedProvince && (
                        <FormField
                          control={addressForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-city">
                                    <SelectValue placeholder="Select city..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {(locationData[selectedCountry as keyof typeof locationData]?.provinces[selectedProvince as keyof typeof locationData[keyof typeof locationData]['provinces']] || []).map((city) => (
                                    <SelectItem key={city} value={city}>
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={addressForm.control}
                        name="streetAddress"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Street Address *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your full street address (house number, street name, etc.)"
                                rows={3}
                                data-testid="input-street-address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={addressForm.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter postal code"
                                data-testid="input-postal-code"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-6 md:col-span-2" />

                    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 md:col-span-2">
                      <h3 className="font-semibold text-blue-900 mb-1">Postal Address</h3>
                      <p className="text-sm text-blue-700">Where you receive mail correspondence</p>
                    </div>

                    <FormField
                      control={addressForm.control}
                      name="sameAsPhysical"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg bg-blue-50/30 md:col-span-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-same-as-physical"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium">
                              My postal address is the same as my physical address
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {!addressForm.watch("sameAsPhysical") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={addressForm.control}
                          name="postalAddress"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Postal Address</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter your postal address (P.O. Box, Private Bag, etc.)"
                                  rows={3}
                                  data-testid="input-postal-address"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={addressForm.control}
                          name="postalCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City/Town</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter city or town"
                                  data-testid="input-postal-city"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={addressForm.control}
                          name="postalCountry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter country"
                                  data-testid="input-postal-country"
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

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentSection(1)}
                      data-testid="button-back-to-personal"
                    >
                      Back to Personal Details
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
                        data-testid="button-continue-to-professional"
                      >
                        Continue to Professional Details
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
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50/50">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Professional Details</CardTitle>
                  <p className="text-orange-100 mt-1">Your employment status and real estate business experience</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...professionalForm}>
                <form onSubmit={professionalForm.handleSubmit(handleSectionSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50/50 md:col-span-2">
                      <h3 className="font-semibold text-orange-900 mb-1">Employment Status</h3>
                      <p className="text-sm text-orange-700">Please provide your current employment details</p>
                    </div>

                    <FormField
                      control={professionalForm.control}
                      name="isEmployed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Are you currently employed? *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Reset dependent fields when employment status changes
                              professionalForm.setValue("isFirmRegistered", undefined);
                              professionalForm.setValue("registeredFirmId", "");
                              professionalForm.setValue("registeredFirmName", "");
                              professionalForm.setValue("isPrincipalAgent", undefined);
                              professionalForm.setValue("registerFirmLater", false);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-is-employed">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isEmployed === "yes" && (
                      <FormField
                        control={professionalForm.control}
                        name="isFirmRegistered"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Is your firm registered with EACZ? *</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                // Reset dependent fields
                                professionalForm.setValue("registeredFirmId", "");
                                professionalForm.setValue("registeredFirmName", "");
                                professionalForm.setValue("isPrincipalAgent", undefined);
                                professionalForm.setValue("registerFirmLater", false);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-is-firm-registered">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {isEmployed === "yes" && isFirmRegistered === "yes" && (
                      <>
                        <FormField
                          control={professionalForm.control}
                          name="registeredFirmId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Registered Firm *</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Auto-fill firm name
                                  const selectedOrg = organizations.find(org => org.id === value);
                                  if (selectedOrg) {
                                    professionalForm.setValue("registeredFirmName", selectedOrg.organizationName || selectedOrg.name);
                                  }
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger data-testid="select-registered-firm">
                                    <SelectValue placeholder="Search and select your firm..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {organizations.map((org) => (
                                    <SelectItem key={org.id} value={org.id}>
                                      {org.organizationName || org.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={professionalForm.control}
                          name="employmentCapacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capacity in which employed *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-employment-capacity">
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

                    {isEmployed === "yes" && isFirmRegistered === "no" && (
                      <>
                        <FormField
                          control={professionalForm.control}
                          name="isPrincipalAgent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Are you a Principal Real Estate Agent? *</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Auto-check "register firm later" if not principal agent
                                  if (value === "no") {
                                    professionalForm.setValue("registerFirmLater", true);
                                  } else {
                                    professionalForm.setValue("registerFirmLater", false);
                                  }
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger data-testid="select-is-principal-agent">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {isPrincipalAgent === "no" && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg md:col-span-2">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                <p className="font-medium text-blue-900">Register Firm Later</p>
                                <p className="text-sm text-blue-700 mt-1">
                                  Since you are not a Principal Agent and your firm is not registered, you can proceed with your application.
                                  Your employer will need to register separately with EACZ.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <Separator className="my-6 md:col-span-2" />

                  <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel className="text-base font-semibold">Business Experience Details *</FormLabel>
                        <p className="text-sm text-muted-foreground mt-1">Provide details of your relevant real estate experience</p>
                      </div>
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
                              control={professionalForm.control}
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
                              control={professionalForm.control}
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
                                      <SelectItem value="Real Estate Agent">Real Estate Agent</SelectItem>
                                      <SelectItem value="Property Manager">Property Manager</SelectItem>
                                      <SelectItem value="Real Estate Broker">Real Estate Broker</SelectItem>
                                      <SelectItem value="Property Developer">Property Developer</SelectItem>
                                      <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={professionalForm.control}
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

                            <FormField
                              control={professionalForm.control}
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
                              control={professionalForm.control}
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
                      onClick={() => setCurrentSection(2)}
                      data-testid="button-back-to-address"
                    >
                      Back to Address
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

      case 4:
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
                <form onSubmit={documentsForm.handleSubmit(handleSectionSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border-2 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 shadow-sm">
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
                            documentsForm.setValue('identityDocument', fileKey);
                            handleDocumentComplete({ successful: [{ uploadURL: fileKey }] });
                          }
                        }}
                        usePublicEndpoint={true}
                        data-testid="uploader-identity-document"
                      />
                    </div>

                    <div className="p-6 border-2 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100/50 shadow-sm">
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
                            documentsForm.setValue('birthCertificate', fileKey);
                            handleDocumentComplete({ successful: [{ uploadURL: fileKey }] });
                          }
                        }}
                        usePublicEndpoint={true}
                        data-testid="uploader-birth-certificate"
                      />
                    </div>

                    <div className="p-6 border rounded-lg h-full">
                      <h4 className="font-medium mb-2">Educational Certificates *</h4>
                      <p className="text-sm text-muted-foreground mb-4">Upload O-Level, A-Level certificates</p>
                      <EnhancedDocumentUploader
                        documentType="o_level_cert"
                        allowMultiple={true}
                        maxFiles={5}
                        onComplete={(files) => {
                          if (files.length > 0) {
                            const fileKeys = files.map(f => f.fileKey);
                            const currentCerts = documentsForm.getValues('educationalCertificates') || [];
                            documentsForm.setValue('educationalCertificates', [...currentCerts, ...fileKeys]);
                            handleDocumentComplete({ successful: files.map(f => ({ uploadURL: f.fileKey })) });
                          }
                        }}
                        usePublicEndpoint={true}
                        data-testid="uploader-educational-certificates"
                      />
                    </div>

                    <div className="p-6 border rounded-lg h-full">
                      <h4 className="font-medium mb-2">Proof of Employment (Optional)</h4>
                      <p className="text-sm text-muted-foreground mb-4">Employment letter or contract</p>
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
                        usePublicEndpoint={true}
                        data-testid="uploader-proof-employment"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentSection(3)}
                      data-testid="button-back-to-professional"
                    >
                      Back to Professional Details
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

      case 5:
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
                      onClick={() => setCurrentSection(4)}
                      data-testid="button-back-to-documents"
                    >
                      Back to Documents
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

      case 6:
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
                    onClick={() => setCurrentSection(5)}
                    data-testid="button-back-to-declarations"
                  >
                    Back to Declarations
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
    <div className="min-h-screen bg-background relative">
      <FormHeader
        title="Individual Member Application"
        subtitle="Complete your individual application with the Estate Agents Council of Zimbabwe"
      />
      <div className="w-full px-4 py-8 flex-1 relative z-10">
        <PageBreadcrumb items={[{ label: "Individual Member Application" }]} />
        

        {/* Professional Progress Bar */}
        <div className="mb-8 bg-white border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Application Progress</h3>
              <p className="text-sm text-gray-600">Step {currentSection} of {sections.length}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((currentSection / sections.length) * 100)}%
              </div>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-gray-100 overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${(currentSection / sections.length) * 100}%` }}
            />
          </div>

          {/* Section Steps - Horizontal Single Row */}
          <div className="flex items-center justify-between mt-6 gap-2">
            {sections.map((section, index) => (
              <div key={section.id} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 flex items-center justify-center text-sm font-bold mb-2 transition-all duration-300 ${
                  getSectionStatus(section.id) === 'current' ? 'bg-blue-600 text-white shadow-lg' :
                  getSectionStatus(section.id) === 'completed' ? 'bg-green-500 text-white shadow-md' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {getSectionStatus(section.id) === 'completed' ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`text-xs font-medium text-center ${
                  getSectionStatus(section.id) === 'current' ? 'text-blue-600' :
                  getSectionStatus(section.id) === 'completed' ? 'text-green-600' :
                  'text-gray-500'
                }`}>
                  {section.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section Content */}
        {renderSection()}
      </div>

      {/* Cityscape Background Image - positioned at footer with 30% opacity */}
      <div className="relative">
        <div
          className="absolute bottom-0 left-0 right-0 bg-no-repeat bg-center bg-contain pointer-events-none"
          style={{
            backgroundImage: "url('/assets/images/cityscape-bg.svg')",
            opacity: 0.3,
            backgroundPosition: "center bottom",
            backgroundSize: "40% auto",
            height: "300px",
            zIndex: 0
          }}
        />
        <FormFooter />
      </div>
    </div>
  );
}