import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ModernModal } from "@/components/ui/modern-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2, CheckCircle, Mail, Phone,
  MapPin, FileText, ArrowRight, ArrowLeft, Check, User
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Member } from "@shared/schema";

// Multi-step Add Organization Form Schema
const addOrganizationSchema = z.object({
  // Step 1: Basic Information
  name: z.string().min(2, "Organization name must be at least 2 characters").max(100),
  businessType: z.enum(["real_estate_firm", "property_management_firm", "brokerage_firm", "development_firm"], {
    errorMap: () => ({ message: "Please select organization type" })
  }),
  registrationNumber: z.string().optional(),

  // Step 2: Contact Details
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  physicalAddress: z.string().min(10, "Address must be at least 10 characters"),

  // Step 3: Additional Details
  principalAgentId: z.string().optional(),
  trustAccountDetails: z.string().optional(),
});

type AddOrganizationFormData = z.infer<typeof addOrganizationSchema>;

interface MultiStepAddOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function MultiStepAddOrganizationModal({ open, onOpenChange, trigger }: MultiStepAddOrganizationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [newOrganization, setNewOrganization] = useState<any>(null);
  const { toast } = useToast();

  const { data: allMembers = [] } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  // Filter members to get only principal agents
  const principalAgents = allMembers.filter(member =>
    member.memberType === "principal_real_estate_agent"
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
    trigger: validateField
  } = useForm<AddOrganizationFormData>({
    resolver: zodResolver(addOrganizationSchema),
    defaultValues: {
      name: "",
      businessType: undefined,
      registrationNumber: "",
      email: "",
      phone: "",
      physicalAddress: "",
      principalAgentId: "",
      trustAccountDetails: "",
    },
  });

  const businessType = watch("businessType");
  const principalAgentId = watch("principalAgentId");

  const createOrganizationMutation = useMutation({
    mutationFn: async (data: AddOrganizationFormData) => {
      const res = await apiRequest("POST", "/api/organizations", {
        ...data,
        status: "active", // Set to active by default for admin-created orgs
      });
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organizations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/organizations"] });
      setNewOrganization(data);
      setIsSuccessOpen(true);
      reset();
      setCurrentStep(1);
      setTimeout(() => {
        onOpenChange(false);
        setIsSuccessOpen(false);
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create organization. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof AddOrganizationFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["name", "businessType"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["email", "phone", "physicalAddress"];
    }

    const isValid = await validateField(fieldsToValidate);

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: AddOrganizationFormData) => {
    createOrganizationMutation.mutate(data);
  };

  const progress = (currentStep / 3) * 100;

  const steps = [
    { number: 1, title: "Basic Information", icon: Building2 },
    { number: 2, title: "Contact Details", icon: Mail },
    { number: 3, title: "Additional Details", icon: FileText },
  ];

  return (
    <>
      <ModernModal
        open={open && !isSuccessOpen}
        onOpenChange={(newOpen) => {
          onOpenChange(newOpen);
          if (!newOpen) {
            reset();
            setCurrentStep(1);
          }
        }}
        title="Register New Organization"
        subtitle={`Step ${currentStep} of 3: ${steps[currentStep - 1]?.title}`}
        icon={Building2}
        colorVariant="purple"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center gap-2 ${
                    currentStep >= step.number
                      ? "text-purple-600"
                      : "text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? (
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep === step.number
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <step.icon className="w-4 h-4" />
                    </div>
                  )}
                  <span className="text-sm font-medium hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-purple-800 font-semibold">
                  Organization Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="border-purple-300 focus:border-purple-500"
                  placeholder="Enter organization name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="businessType" className="text-purple-800 font-semibold">
                  Organization Type <span className="text-red-500">*</span>
                </Label>
                <Select value={businessType} onValueChange={(value) => setValue("businessType", value as any)}>
                  <SelectTrigger className="border-purple-300 focus:border-purple-500">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real_estate_firm">Real Estate Firm</SelectItem>
                    <SelectItem value="property_management_firm">Property Management Firm</SelectItem>
                    <SelectItem value="brokerage_firm">Brokerage Firm</SelectItem>
                    <SelectItem value="development_firm">Development Firm</SelectItem>
                  </SelectContent>
                </Select>
                {errors.businessType && (
                  <p className="text-sm text-red-600">{errors.businessType.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="registrationNumber" className="text-purple-800 font-semibold">
                  Registration Number (Optional)
                </Label>
                <Input
                  id="registrationNumber"
                  {...register("registrationNumber")}
                  className="border-purple-300 focus:border-purple-500"
                  placeholder="Auto-generated if left blank"
                />
                <p className="text-xs text-purple-600">Leave blank to auto-generate (EAC-ORG-YYYY-XXXX format)</p>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {currentStep === 2 && (
            <div className="space-y-4 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-blue-800 font-semibold">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="pl-10 border-blue-300 focus:border-blue-500"
                    placeholder="organization@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-blue-800 font-semibold">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <Input
                    id="phone"
                    {...register("phone")}
                    className="pl-10 border-blue-300 focus:border-blue-500"
                    placeholder="+263 XX XXX XXXX"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="physicalAddress" className="text-blue-800 font-semibold">
                  Physical Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
                  <Textarea
                    id="physicalAddress"
                    {...register("physicalAddress")}
                    className="pl-10 border-blue-300 focus:border-blue-500 min-h-[80px]"
                    placeholder="Enter physical address"
                  />
                </div>
                {errors.physicalAddress && (
                  <p className="text-sm text-red-600">{errors.physicalAddress.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <div className="space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="space-y-3">
                <Label htmlFor="principalAgentId" className="text-green-800 font-semibold">
                  Principal Real Estate Agent (Optional)
                </Label>
                <Select value={principalAgentId} onValueChange={(value) => setValue("principalAgentId", value)}>
                  <SelectTrigger className="border-green-300 focus:border-green-500">
                    <SelectValue placeholder="Select principal agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No principal agent</SelectItem>
                    {principalAgents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.firstName} {agent.lastName} ({agent.membershipNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-green-600">Select the principal agent responsible for this organization</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="trustAccountDetails" className="text-green-800 font-semibold">
                  Trust Account Details (Optional)
                </Label>
                <Textarea
                  id="trustAccountDetails"
                  {...register("trustAccountDetails")}
                  className="border-green-300 focus:border-green-500 min-h-[100px]"
                  placeholder="Enter trust account details (bank name, account number, etc.)"
                />
                <p className="text-xs text-green-600">Provide bank details for the trust account</p>
              </div>

              <div className="bg-green-100 border border-green-300 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold mb-1">Ready to Register</p>
                    <p>Review your information and click "Create Organization" to complete registration.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 pt-4 border-t">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="gradient-button text-white flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="gradient-button text-white flex items-center gap-2"
                disabled={createOrganizationMutation.isPending}
              >
                {createOrganizationMutation.isPending ? (
                  <>Creating...</>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Create Organization
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </ModernModal>

      {/* Success Modal */}
      <ModernModal
        open={isSuccessOpen}
        onOpenChange={() => {}}
        title="Organization Created Successfully!"
        subtitle="The organization has been registered in the system"
        icon={CheckCircle}
        colorVariant="green"
        maxWidth="md"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          {newOrganization && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-lg font-semibold text-green-800">{newOrganization.name}</p>
              <p className="text-sm text-green-600 font-mono mt-1">{newOrganization.registrationNumber}</p>
            </div>
          )}
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </ModernModal>
    </>
  );
}
