import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  dateOfBirth: z.string().min(1, "Date of birth is required"),
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
        dateOfBirth: "",
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
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
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
                  <FormLabel>Surname *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your surname" {...field} />
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
                  <FormLabel>National ID *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your national ID" {...field} />
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
                  <FormLabel>Date of Birth *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="+263..." {...field} />
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
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
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
                <FormLabel>Physical Address *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your physical address"
                    className="min-h-[80px]"
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
                <FormLabel>Postal Address *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your postal address"
                    className="min-h-[80px]"
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
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your city" {...field} />
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
                <FormLabel>Current Employer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your current employer (if applicable)" {...field} />
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
                <FormLabel>Work Experience *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your relevant work experience in real estate or related fields"
                    className="min-h-[120px]"
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
                <FormLabel>Professional Qualifications</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any professional qualifications, certifications, or training"
                    className="min-h-[80px]"
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
          <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Document Upload</h3>
          <p className="text-muted-foreground">
            Document upload functionality will be implemented here
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Required Documents:</h4>
          <ul className="text-sm space-y-1">
            <li>• O-Level Certificate</li>
            <li>• A-Level Certificate (if applicable)</li>
            <li>• National ID or Passport</li>
            <li>• Birth Certificate</li>
            <li>• Professional Qualifications (if any)</li>
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
          <CreditCard className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Application Fee Payment</h3>
          <p className="text-muted-foreground">
            Payment processing will be implemented here
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Fee Information:</h4>
          <div className="text-sm space-y-1">
            <p><strong>Application Fee:</strong> $50 USD</p>
            <p><strong>Payment Methods:</strong> PayNow, Bank Transfer, Stripe</p>
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
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Review & Confirm</h3>
          <p className="text-muted-foreground">
            Please review your application details before submitting
          </p>
        </div>

        <div className="space-y-4">
          {completedSteps.has('personal') && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-gray-600 mb-2">Personal Details</h4>
              <p className="text-sm">{applicationData.personal?.firstName} {applicationData.personal?.surname}</p>
            </div>
          )}
          {completedSteps.has('address') && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-gray-600 mb-2">Address</h4>
              <p className="text-sm">{applicationData.address?.city}, {applicationData.address?.province}</p>
            </div>
          )}
          {completedSteps.has('professional') && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm text-gray-600 mb-2">Professional Details</h4>
              <p className="text-sm">Education: {applicationData.professional?.educationLevel}</p>
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
    <div className="min-h-screen bg-background">
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
              <span className="text-sm font-medium">Step {currentStepIndex + 1} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <currentStepInfo.icon className="w-5 h-5" />
                {currentStepInfo.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>

      <FormFooter />
    </div>
  );
}