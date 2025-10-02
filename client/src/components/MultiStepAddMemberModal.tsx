import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ModernModal } from "@/components/ui/modern-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  UserPlus, CheckCircle, User, Briefcase,
  Building2, Mail, Calendar, Globe, Shield,
  ArrowRight, ArrowLeft, Check
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Multi-step Add Member Form Schema
const addMemberSchema = z.object({
  // Step 1: Personal Information
  firstName: z.string().min(1, "First name is required").max(50),
  surname: z.string().min(1, "Surname is required").max(50),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine(date => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 80;
  }, "Age must be between 18 and 80 years"),
  email: z.string().email("Invalid email address"),

  // Step 2: Professional Details
  memberType: z.enum(["real_estate_agent", "property_manager", "principal_agent", "negotiator"], {
    errorMap: () => ({ message: "Please select a member type" })
  }),
  educationLevel: z.enum(["normal_entry", "mature_entry"], {
    errorMap: () => ({ message: "Please select education/entry type" })
  }),

  // Step 3: Residence & Employment
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  nationality: z.string().min(1, "Nationality is required"),
  employmentStatus: z.enum(["self_employed", "employed"], {
    errorMap: () => ({ message: "Please select employment status" })
  }),
  organizationName: z.string().optional(),
}).refine(data => {
  if (data.employmentStatus === "employed" && !data.organizationName?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Organization/firm name is required when employed",
  path: ["organizationName"]
});

type AddMemberFormData = z.infer<typeof addMemberSchema>;

interface MultiStepAddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function MultiStepAddMemberModal({ open, onOpenChange, trigger }: MultiStepAddMemberModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [newMember, setNewMember] = useState<any>(null);
  const { toast } = useToast();

  // Calculate max date (18 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
    trigger: validateField
  } = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      dateOfBirth: "",
      email: "",
      memberType: undefined,
      educationLevel: undefined,
      countryOfResidence: "Zimbabwe",
      nationality: "Zimbabwean",
      employmentStatus: undefined,
      organizationName: "",
    },
  });

  const watchMemberType = watch("memberType");
  const watchEmploymentStatus = watch("employmentStatus");
  const watchEducationLevel = watch("educationLevel");

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const createMemberMutation = useMutation({
    mutationFn: async (data: AddMemberFormData) => {
      try {
        const response = await apiRequest("POST", "/api/admin/members/create-with-clerk", data);

        // Check content type before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response received:", text.substring(0, 200));
          throw new Error("Server returned non-JSON response. Check console for details.");
        }

        return await response.json();
      } catch (error: any) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      setNewMember(data.member);
      onOpenChange(false);
      setIsSuccessOpen(true);
      reset();
      setCurrentStep(1);
    },
    onError: (error: any) => {
      console.error("onError handler:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add member. Please try again.",
        variant: "destructive"
      });
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof AddMemberFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["firstName", "surname", "dateOfBirth", "email"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["memberType", "educationLevel"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["countryOfResidence", "nationality", "employmentStatus"];
      if (watchEmploymentStatus === "employed") {
        fieldsToValidate.push("organizationName");
      }
    }

    const isValid = await validateField(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: AddMemberFormData) => {
    console.log("Form submitted with data:", data);

    // Validate age for mature entry
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() -
      (today.getMonth() < birthDate.getMonth() ||
       (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);

    if (data.educationLevel === "mature_entry" && age < 27) {
      toast({
        title: "Validation Error",
        description: "Mature Entry requires age 27 years and above",
        variant: "destructive"
      });
      setCurrentStep(2);
      return;
    }

    console.log("Calling createMemberMutation.mutate with data");
    createMemberMutation.mutate(data);
  };

  const isPREA = watchMemberType === "principal_agent";

  return (
    <>
      <ModernModal
        open={open}
        onOpenChange={onOpenChange}
        title="Add New Member"
        subtitle={isPREA ? "Creating Principal Agent with dual portal access" : "Create a new member account with email verification"}
        icon={UserPlus}
        colorVariant="blue"
        maxWidth="3xl"
        trigger={trigger}
      >
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs mt-2">
              <span className={currentStep >= 1 ? "text-blue-600 font-semibold" : "text-muted-foreground"}>Personal</span>
              <span className={currentStep >= 2 ? "text-blue-600 font-semibold" : "text-muted-foreground"}>Professional</span>
              <span className={currentStep >= 3 ? "text-blue-600 font-semibold" : "text-muted-foreground"}>Employment</span>
              <span className={currentStep >= 4 ? "text-blue-600 font-semibold" : "text-muted-foreground"}>Review</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Personal Information</h3>
                    <p className="text-sm text-blue-700">Basic details about the member</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      className="border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white shadow-sm hover:border-gray-300 transition-colors"
                      data-testid="input-first-name"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surname" className="text-gray-700 font-medium">Surname *</Label>
                    <Input
                      id="surname"
                      {...register("surname")}
                      className="border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white shadow-sm hover:border-gray-300 transition-colors"
                      data-testid="input-surname"
                    />
                    {errors.surname && (
                      <p className="text-xs text-red-600">{errors.surname.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-blue-800 font-semibold flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Date of Birth *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      max={maxDateString}
                      {...register("dateOfBirth")}
                      className="border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white shadow-sm hover:border-gray-300 transition-colors"
                      data-testid="input-date-of-birth"
                    />
                    {errors.dateOfBirth && (
                      <p className="text-xs text-red-600">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-blue-800 font-semibold flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white shadow-sm hover:border-gray-300 transition-colors"
                      data-testid="input-email"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-100 p-3 rounded-lg border border-blue-300 mt-4">
                  <p className="text-xs text-blue-800">
                    <Mail className="w-3 h-3 inline mr-1" />
                    A welcome email will be sent to verify their email address and set up their password
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">Professional Details</h3>
                    <p className="text-sm text-purple-700">Member type and qualifications</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memberType" className="text-purple-800 font-semibold flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Member Type *
                  </Label>
                  <Select onValueChange={(value) => setValue("memberType", value as any)} value={watchMemberType}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white shadow-sm hover:border-gray-300 transition-colors" data-testid="select-member-type">
                      <SelectValue placeholder="Select member type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real_estate_agent">Real Estate Agent</SelectItem>
                      <SelectItem value="property_manager">Property Manager</SelectItem>
                      <SelectItem value="principal_agent">Principal Agent (PREA)</SelectItem>
                      <SelectItem value="negotiator">Negotiator</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.memberType && (
                    <p className="text-xs text-red-600">{errors.memberType.message}</p>
                  )}
                </div>

                {isPREA && (
                  <div className="bg-purple-100 p-4 rounded-lg border border-purple-300">
                    <div className="flex items-start space-x-2">
                      <Shield className="w-5 h-5 text-purple-700 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-purple-900">Principal Agent (PREA) Account</p>
                        <p className="text-xs text-purple-700 mt-1">
                          This member will receive <strong>dual portal access</strong>:
                        </p>
                        <ul className="text-xs text-purple-700 mt-2 space-y-1 ml-4">
                          <li>• Personal Member Portal</li>
                          <li>• Organization Management Portal</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mt-4">
                  <Label className="text-gray-700 font-medium">Education/Entry Type *</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue("educationLevel", value as any)}
                    value={watchEducationLevel}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 border-2 border-purple-200 rounded-lg bg-white/80 hover:border-purple-400 transition-colors">
                      <RadioGroupItem value="normal_entry" id="normal-entry" />
                      <Label htmlFor="normal-entry" className="flex-1 cursor-pointer">
                        <div className="font-medium text-purple-900">Normal Entry</div>
                        <div className="text-xs text-purple-600">
                          5 O'levels and 2 A'levels (or equivalent qualifications)
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border-2 border-purple-200 rounded-lg bg-white/80 hover:border-purple-400 transition-colors">
                      <RadioGroupItem value="mature_entry" id="mature-entry" />
                      <Label htmlFor="mature-entry" className="flex-1 cursor-pointer">
                        <div className="font-medium text-purple-900">Mature Entry</div>
                        <div className="text-xs text-purple-600">
                          Age 27+ with 5 O'levels (or equivalent experience)
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.educationLevel && (
                    <p className="text-xs text-red-600">{errors.educationLevel.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Residence & Employment */}
            {currentStep === 3 && (
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-900">Residence & Employment</h3>
                    <p className="text-sm text-emerald-700">Location and work details</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="countryOfResidence" className="text-gray-700 font-medium">Country of Residence *</Label>
                    <Select onValueChange={(value) => setValue("countryOfResidence", value)} value={watch("countryOfResidence")}>
                      <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white shadow-sm hover:border-gray-300 transition-colors">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                        <SelectItem value="South Africa">South Africa</SelectItem>
                        <SelectItem value="Botswana">Botswana</SelectItem>
                        <SelectItem value="Namibia">Namibia</SelectItem>
                        <SelectItem value="Zambia">Zambia</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.countryOfResidence && (
                      <p className="text-xs text-red-600">{errors.countryOfResidence.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality" className="text-gray-700 font-medium">Nationality *</Label>
                    <Select onValueChange={(value) => setValue("nationality", value)} value={watch("nationality")}>
                      <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white shadow-sm hover:border-gray-300 transition-colors">
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Zimbabwean">Zimbabwean</SelectItem>
                        <SelectItem value="South African">South African</SelectItem>
                        <SelectItem value="British">British</SelectItem>
                        <SelectItem value="American">American</SelectItem>
                        <SelectItem value="Australian">Australian</SelectItem>
                        <SelectItem value="Canadian">Canadian</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.nationality && (
                      <p className="text-xs text-red-600">{errors.nationality.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <Label className="text-emerald-800 font-semibold flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    Employment Status *
                  </Label>
                  <RadioGroup
                    onValueChange={(value) => setValue("employmentStatus", value as any)}
                    value={watchEmploymentStatus}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 border-2 border-emerald-200 rounded-lg bg-white/80 hover:border-emerald-400 transition-colors">
                      <RadioGroupItem value="self_employed" id="self-employed" />
                      <Label htmlFor="self-employed" className="flex-1 cursor-pointer">
                        <div className="font-medium text-emerald-900">Self-Employed</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border-2 border-emerald-200 rounded-lg bg-white/80 hover:border-emerald-400 transition-colors">
                      <RadioGroupItem value="employed" id="employed" />
                      <Label htmlFor="employed" className="flex-1 cursor-pointer">
                        <div className="font-medium text-emerald-900">Employed</div>
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.employmentStatus && (
                    <p className="text-xs text-red-600">{errors.employmentStatus.message}</p>
                  )}
                </div>

                {watchEmploymentStatus === "employed" && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="organizationName" className="text-gray-700 font-medium">Organization/Firm Name *</Label>
                    <Input
                      id="organizationName"
                      {...register("organizationName")}
                      placeholder="Enter organization or firm name"
                      className="border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white shadow-sm hover:border-gray-300 transition-colors"
                      data-testid="input-organization-name"
                    />
                    {errors.organizationName && (
                      <p className="text-xs text-red-600">{errors.organizationName.message}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {currentStep === 4 && (
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900">Review & Confirm</h3>
                    <p className="text-sm text-amber-700">Please verify all information before submitting</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-3">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Name:</span> {watch("firstName")} {watch("surname")}</div>
                      <div><span className="text-muted-foreground">Email:</span> {watch("email")}</div>
                      <div><span className="text-muted-foreground">Date of Birth:</span> {watch("dateOfBirth")}</div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-3">Professional Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Type:</span> {watch("memberType")?.replace(/_/g, " ")}</div>
                      <div><span className="text-muted-foreground">Education:</span> {watch("educationLevel")?.replace(/_/g, " ")}</div>
                    </div>
                    {isPREA && (
                      <div className="mt-3 p-2 bg-purple-100 rounded border border-purple-200">
                        <p className="text-xs text-purple-800 font-semibold">✓ PREA Account with dual portal access</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-3">Residence & Employment</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Country:</span> {watch("countryOfResidence")}</div>
                      <div><span className="text-muted-foreground">Nationality:</span> {watch("nationality")}</div>
                      <div><span className="text-muted-foreground">Status:</span> {watch("employmentStatus")?.replace(/_/g, " ")}</div>
                      {watch("organizationName") && (
                        <div><span className="text-muted-foreground">Organization:</span> {watch("organizationName")}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-100 p-4 rounded-lg border border-amber-300 mt-4">
                  <p className="text-sm text-amber-900 font-semibold mb-2">What happens next:</p>
                  <ul className="text-xs text-amber-800 space-y-1">
                    <li>✓ Member account will be created in Clerk</li>
                    <li>✓ User account will be generated automatically</li>
                    <li>✓ Welcome email sent with verification link</li>
                    <li>✓ Member can set password and complete profile</li>
                    {isPREA && <li>✓ <strong>Dual portal access enabled</strong> (Member + Organization)</li>}
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  data-testid="button-prev"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto gradient-button text-white border-0"
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createMemberMutation.isPending}
                  className="ml-auto gradient-button text-white border-0"
                  data-testid="button-submit"
                >
                  {createMemberMutation.isPending ? (
                    "Creating Member..."
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Create Member
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </ModernModal>

      {/* Success Modal */}
      <ModernModal
        open={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        title="Member Created Successfully"
        subtitle="The member account has been created and welcome email sent"
        icon={CheckCircle}
        colorVariant="green"
        maxWidth="xl"
      >
        <div className="space-y-4">
          {newMember && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-green-900">Name:</span>
                  <span className="text-green-800">{newMember.firstName} {newMember.surname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-green-900">Email:</span>
                  <span className="text-green-800">{newMember.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-green-900">Member ID:</span>
                  <span className="text-green-800 font-mono">{newMember.membershipNumber}</span>
                </div>
                {newMember.memberType === "principal_agent" && (
                  <div className="mt-3 pt-3 border-t border-green-300">
                    <div className="flex items-center space-x-2 text-purple-700">
                      <Shield className="w-4 h-4" />
                      <span className="font-semibold">PREA Account Type - Dual Portal Access</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Welcome Email Sent
            </h4>
            <p className="text-sm text-blue-800">
              The member will receive an email to:
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4">
              <li>• Verify their email address</li>
              <li>• Set up their password</li>
              <li>• Complete their profile</li>
              <li>• Access their member portal</li>
            </ul>
          </div>

          <Button
            onClick={() => setIsSuccessOpen(false)}
            className="w-full gradient-button text-white border-0"
            data-testid="button-close-success"
          >
            Close
          </Button>
        </div>
      </ModernModal>
    </>
  );
}
