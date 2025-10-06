import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { CheckCircle, User, MapPin, Briefcase, Upload, CreditCard, CheckSquare, ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

// Application steps
const APPLICATION_STEPS = [
  { id: 'personal', title: 'Personal Details', icon: User },
  { id: 'address', title: 'Address', icon: MapPin },
  { id: 'professional', title: 'Professional Details', icon: Briefcase },
  { id: 'documents', title: 'Documents', icon: Upload },
  { id: 'payment', title: 'Payment', icon: CreditCard },
  { id: 'confirmation', title: 'Confirmation', icon: CheckSquare },
] as const;

type ApplicationStep = typeof APPLICATION_STEPS[number]['id'];

// Schema for each step
const personalDetailsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  nationalId: z.string().min(10, "National ID must be at least 10 characters"),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
});

const addressDetailsSchema = z.object({
  physicalAddress: z.string().min(10, "Physical address must be at least 10 characters"),
  postalAddress: z.string().min(5, "Postal address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
});

const professionalDetailsSchema = z.object({
  educationLevel: z.enum(['o_level', 'a_level', 'bachelors', 'hnd', 'masters', 'doctorate']),
  employmentStatus: z.string().min(2, "Employment status is required"),
  currentEmployer: z.string().optional(),
  workExperience: z.string().min(10, "Work experience description is required"),
  professionalQualifications: z.string().optional(),
});

type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;
type AddressDetailsData = z.infer<typeof addressDetailsSchema>;
type ProfessionalDetailsData = z.infer<typeof professionalDetailsSchema>;

export default function IndividualApplication() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('personal');
  const [completedSteps, setCompletedSteps] = useState<Set<ApplicationStep>>(new Set());
  const [applicationData, setApplicationData] = useState<any>({});
  const { toast } = useToast();

  // Get current step info
  const currentStepIndex = APPLICATION_STEPS.findIndex(step => step.id === currentStep);
  const currentStepInfo = APPLICATION_STEPS[currentStepIndex];

  // Progress calculation
  const totalSteps = APPLICATION_STEPS.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  // Navigation functions
  const goToNextStep = () => {
    if (currentStepIndex < APPLICATION_STEPS.length - 1) {
      setCurrentStep(APPLICATION_STEPS[currentStepIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(APPLICATION_STEPS[currentStepIndex - 1].id);
    }
  };

  const goToStep = (stepId: ApplicationStep) => {
    setCurrentStep(stepId);
  };

  const markStepComplete = (stepId: ApplicationStep, data: any) => {
    setCompletedSteps((prev: Set<ApplicationStep>) => new Set(Array.from(prev).concat(stepId)));
    setApplicationData((prev: any) => ({ ...prev, [stepId]: data }));
  };

  // Step components
  const PersonalDetailsStep = () => {
    const form = useForm<PersonalDetailsData>({
      resolver: zodResolver(personalDetailsSchema),
      defaultValues: applicationData.personal || {
        firstName: "",
        surname: "",
        nationalId: "",
        dateOfBirth: undefined,
        phoneNumber: "",
        email: "",
      },
    });

    const handleSubmit = (data: PersonalDetailsData) => {
      markStepComplete('personal', data);
      goToNextStep();
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput label="First Name *" data-testid="input-firstName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput label="Surname *" data-testid="input-surname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput label="National ID *" data-testid="input-nationalId" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DatePicker
                      label="Date of Birth *"
                      value={field.value}
                      onChange={field.onChange}
                      minAge={18}
                      maxAge={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput label="Phone Number *" data-testid="input-phoneNumber" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput type="email" label="Email Address *" data-testid="input-email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="gradient-button text-white border-0">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  const AddressDetailsStep = () => {
    const form = useForm<AddressDetailsData>({
      resolver: zodResolver(addressDetailsSchema),
      defaultValues: applicationData.address || {
        physicalAddress: "",
        postalAddress: "",
        city: "",
        province: "",
      },
    });

    const handleSubmit = (data: AddressDetailsData) => {
      markStepComplete('address', data);
      goToNextStep();
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="physicalAddress"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingTextarea
                    label="Physical Address *"
                    data-testid="input-physicalAddress"
                    {...field}
                  />
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
                <FormControl>
                  <FloatingTextarea
                    label="Postal Address *"
                    data-testid="input-postalAddress"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput label="City *" data-testid="input-city" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="harare">Harare</SelectItem>
                        <SelectItem value="bulawayo">Bulawayo</SelectItem>
                        <SelectItem value="manicaland">Manicaland</SelectItem>
                        <SelectItem value="mashonaland-central">Mashonaland Central</SelectItem>
                        <SelectItem value="mashonaland-east">Mashonaland East</SelectItem>
                        <SelectItem value="mashonaland-west">Mashonaland West</SelectItem>
                        <SelectItem value="matabeleland-north">Matabeleland North</SelectItem>
                        <SelectItem value="matabeleland-south">Matabeleland South</SelectItem>
                        <SelectItem value="midlands">Midlands</SelectItem>
                        <SelectItem value="masvingo">Masvingo</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button type="submit" className="gradient-button text-white border-0">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  const ProfessionalDetailsStep = () => {
    const form = useForm<ProfessionalDetailsData>({
      resolver: zodResolver(professionalDetailsSchema),
      defaultValues: applicationData.professional || {
        educationLevel: undefined,
        employmentStatus: "",
        currentEmployer: "",
        workExperience: "",
        professionalQualifications: "",
      },
    });

    const handleSubmit = (data: ProfessionalDetailsData) => {
      markStepComplete('professional', data);
      goToNextStep();
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="educationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Level *</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="o_level">O-Level</SelectItem>
                        <SelectItem value="a_level">A-Level</SelectItem>
                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                        <SelectItem value="hnd">HND</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="doctorate">Doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status *</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self_employed">Self-Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="currentEmployer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput label="Current Employer (Optional)" data-testid="input-currentEmployer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workExperience"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingTextarea
                    label="Work Experience *"
                    data-testid="input-workExperience"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professionalQualifications"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingTextarea
                    label="Professional Qualifications (Optional)"
                    data-testid="input-professionalQualifications"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button type="submit" className="gradient-button text-white border-0">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  const DocumentsStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-egyptian-blue/10 to-powder-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-egyptian-blue/20">
            <Upload className="w-10 h-10 text-egyptian-blue" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Document Upload</h3>
          <p className="text-gray-600">
            Document upload functionality will be implemented here
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-3">Required Documents:</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-egyptian-blue font-bold">•</span>
              <span>O-Level Certificate</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-egyptian-blue font-bold">•</span>
              <span>A-Level Certificate (if applicable)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-egyptian-blue font-bold">•</span>
              <span>National ID or Passport</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-egyptian-blue font-bold">•</span>
              <span>Birth Certificate</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-egyptian-blue font-bold">•</span>
              <span>Professional Qualifications (if any)</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => {
              markStepComplete('documents', {});
              goToNextStep();
            }}
            className="gradient-button text-white border-0"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const PaymentStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-green-200">
            <CreditCard className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Application Fee Payment</h3>
          <p className="text-gray-600">
            Payment processing will be implemented here
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-100">
          <h4 className="font-semibold text-gray-800 mb-3">Fee Information:</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <p className="flex items-start gap-2">
              <span className="font-semibold text-green-600">Application Fee:</span>
              <span>$50 USD</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-semibold text-green-600">Payment Methods:</span>
              <span>PayNow, Bank Transfer, Stripe</span>
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => {
              markStepComplete('payment', {});
              goToNextStep();
            }}
            className="gradient-button text-white border-0"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const ConfirmationStep = () => {
    const submitApplication = useMutation({
      mutationFn: async () => {
        // This would submit the complete application
        const response = await apiRequest("POST", "/api/applications/submit", {
          ...applicationData,
          applicationType: 'individual'
        });
        return await response.json();
      },
      onSuccess: () => {
        toast({
          title: "Application Submitted!",
          description: "Your application has been submitted successfully.",
        });
        setLocation("/application-tracking");
      },
      onError: () => {
        toast({
          title: "Submission Failed",
          description: "An error occurred while submitting your application.",
          variant: "destructive",
        });
      },
    });

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
            Review & Confirm
          </h3>
          <p className="text-gray-600">
            Please review your application details before submitting
          </p>
        </div>

        <div className="space-y-3">
          {completedSteps.has('personal') && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-100">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Personal Details</h4>
              <p className="text-sm text-gray-800">{applicationData.personal?.firstName} {applicationData.personal?.surname}</p>
            </div>
          )}
          {completedSteps.has('address') && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-100">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Address</h4>
              <p className="text-sm text-gray-800">{applicationData.address?.city}, {applicationData.address?.province}</p>
            </div>
          )}
          {completedSteps.has('professional') && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-100">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Professional Details</h4>
              <p className="text-sm text-gray-800">Education: {applicationData.professional?.educationLevel}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => submitApplication.mutate()}
            disabled={submitApplication.isPending}
            className="gradient-button text-white border-0"
          >
            {submitApplication.isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalDetailsStep />;
      case 'address':
        return <AddressDetailsStep />;
      case 'professional':
        return <ProfessionalDetailsStep />;
      case 'documents':
        return <DocumentsStep />;
      case 'payment':
        return <PaymentStep />;
      case 'confirmation':
        return <ConfirmationStep />;
      default:
        return <PersonalDetailsStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <FormHeader
        title="Individual Membership Application"
        subtitle="Complete your application in 6 simple steps"
      />

      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[
          { label: "Individual Application" },
          { label: currentStepInfo.title }
        ]} />

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Step {currentStepIndex + 1} of {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-egyptian-blue to-powder-blue h-2.5 rounded-full transition-all duration-300 shadow-md"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {APPLICATION_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(step.id);
                const isCurrent = step.id === currentStep;
                const isClickable = index <= currentStepIndex;

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => isClickable && goToStep(step.id)}
                      disabled={!isClickable}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-colors
                        ${isCompleted ? 'bg-green-500 text-white' :
                          isCurrent ? 'bg-blue-500 text-white' :
                          isClickable ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' :
                          'bg-gray-100 text-gray-400'}
                      `}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </button>
                    {index < APPLICATION_STEPS.length - 1 && (
                      <div className={`w-8 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-2 border-gray-100 shadow-2xl bg-white">
            <CardHeader className="bg-gradient-to-r from-egyptian-blue/5 to-powder-blue/5 border-b-2 border-gray-100">
              <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent">
                <currentStepInfo.icon className="w-6 h-6 text-egyptian-blue" />
                {currentStepInfo.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>

      <FormFooter />
    </div>
  );
}