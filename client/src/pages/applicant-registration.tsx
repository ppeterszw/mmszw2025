import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { CheckCircle, Mail, User, ArrowLeft, Sparkles, Edit, FileText, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function ApplicantRegistration() {
  const [, setLocation] = useLocation();
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<RegistrationData | null>(null);
  const [applicantId, setApplicantId] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      email: "",
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationData) => {
      const response = await apiRequest("POST", "/api/applicants/register", data);
      return await response.json();
    },
    onSuccess: (response) => {
      setApplicantId(response.applicantId);
      setRegistrationComplete(true);
      toast({
        title: "Registration Successful!",
        description: `Your Applicant ID is ${response.applicantId}. Please check your email for verification instructions.`,
      });
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: RegistrationData) => {
    // Show confirmation screen instead of immediately submitting
    setFormData(data);
    setShowConfirmation(true);
  };

  const handleConfirmAndSubmit = () => {
    if (formData) {
      registrationMutation.mutate(formData);
    }
  };

  const handleEdit = () => {
    setShowConfirmation(false);
    // Form data is preserved, so user can edit
  };

  // Confirmation screen - show entered details for review
  if (showConfirmation && formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <FormHeader
          title="Confirm Your Details"
          subtitle="Please review your information before submitting"
        />
        <div className="w-full px-4 py-8 flex-1">
          <PageBreadcrumb items={[
            { label: "Individual Registration", href: "/applicant-registration" },
            { label: "Confirm Details" }
          ]} />

          <div className="max-w-3xl mx-auto space-y-6">
            {/* Review Your Information Card */}
            <Card className="border-2 border-blue-100 shadow-2xl bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-100">
                <CardTitle className="text-2xl bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent flex items-center gap-2">
                  <CheckCircle className="w-7 h-7 text-egyptian-blue" />
                  Review Your Information
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Please confirm that all details are correct before proceeding
                </p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Personal Details */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                    <p className="text-sm text-gray-500 mb-1">First Name</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.firstName}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                    <p className="text-sm text-gray-500 mb-1">Surname</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.surname}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900">{formData.email}</p>
                </div>

                {/* Edit Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    size="lg"
                    className="border-2 border-egyptian-blue text-egyptian-blue hover:bg-egyptian-blue hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Required Documents Checklist */}
            <Card className="border-2 border-orange-100 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b-2 border-orange-100">
                <CardTitle className="text-xl text-orange-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-orange-600" />
                  Required Documents Checklist
                </CardTitle>
                <p className="text-orange-700 text-sm mt-1">
                  You will need these documents to complete your application
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50/50">
                    <div className="w-5 h-5 rounded-full border-2 border-orange-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">National ID or Passport</p>
                      <p className="text-sm text-gray-600">Clear copy of your identification document</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50/50">
                    <div className="w-5 h-5 rounded-full border-2 border-orange-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Educational Certificates</p>
                      <p className="text-sm text-gray-600">5 O-Level subjects including English & Math, 2 A-Level subjects or proof of mature entry</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50/50">
                    <div className="w-5 h-5 rounded-full border-2 border-orange-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Proof of Address</p>
                      <p className="text-sm text-gray-600">Recent utility bill or bank statement (not older than 3 months)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50/50">
                    <div className="w-5 h-5 rounded-full border-2 border-orange-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Professional References</p>
                      <p className="text-sm text-gray-600">Contact details of 2 professional references</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50/50">
                    <div className="w-5 h-5 rounded-full border-2 border-orange-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Passport Photo</p>
                      <p className="text-sm text-gray-600">Recent passport-sized photograph</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      <strong>Important:</strong> These documents will be required in the next steps of your application.
                      Please have them ready in digital format (PDF or image files).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleEdit}
                variant="outline"
                size="lg"
                className="flex-1 h-14 border-2 border-gray-200 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back to Edit
              </Button>
              <Button
                onClick={handleConfirmAndSubmit}
                size="lg"
                className="flex-1 h-14 bg-gradient-to-r from-egyptian-blue to-powder-blue hover:from-egyptian-blue/90 hover:to-powder-blue/90 text-white border-0 font-semibold shadow-lg"
                disabled={registrationMutation.isPending}
              >
                {registrationMutation.isPending ? "Submitting..." : "Confirm & Submit Registration"}
                <CheckCircle className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
        <FormFooter />
      </div>
    );
  }

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <FormHeader
          title="Registration Complete"
          subtitle="Please verify your email to continue with your application"
        />
        <div className="w-full px-4 py-8 flex-1">
          <PageBreadcrumb items={[{ label: "Individual Registration" }, { label: "Complete" }]} />

          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-green-100 shadow-2xl bg-white">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
                    Registration Successful!
                  </h2>
                  <p className="text-gray-600">Welcome to the EACZ community</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl mb-6 border-2 border-blue-100">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Your Applicant ID
                  </h3>
                  <div className="text-3xl font-bold bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent mb-2">
                    {applicantId}
                  </div>
                  <p className="text-sm text-gray-600">Please save this ID for your records</p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/50 border border-blue-100">
                    <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Check Your Email</p>
                      <p className="text-sm text-gray-600">
                        We've sent you a welcome message and a verification email. Please check your inbox and spam folder.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-cyan-50/50 border border-cyan-100">
                    <User className="w-5 h-5 text-cyan-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Verify Your Email</p>
                      <p className="text-sm text-gray-600">
                        Click the verification link in your email to confirm your email address and continue with your application.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Button
                    onClick={() => setLocation("/verify-email")}
                    className="bg-gradient-to-r from-egyptian-blue to-powder-blue hover:from-egyptian-blue/90 hover:to-powder-blue/90 text-white border-0 w-full h-12 text-base font-semibold shadow-lg"
                    data-testid="button-verify-email"
                  >
                    I've Verified My Email - Continue
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setLocation("/")}
                    className="w-full h-12 border-2 border-gray-200 hover:bg-gray-50"
                    data-testid="button-back-home"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <FormFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <FormHeader
        title="Apply as Individual Member"
        subtitle="Register with the Estate Agents Council of Zimbabwe"
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[{ label: "Individual Registration" }]} />

        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-gray-100 shadow-2xl bg-white">
            <CardHeader className="bg-gradient-to-r from-egyptian-blue/5 to-powder-blue/5 border-b-2 border-gray-100">
              <CardTitle className="text-2xl bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent">
                Begin Your Registration
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Please provide your details to begin your individual membership application
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingInput
                              label="First Name *"
                              data-testid="input-firstName"
                              {...field}
                            />
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
                            <FloatingInput
                              label="Surname *"
                              data-testid="input-surname"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingInput
                            type="email"
                            label="Email Address *"
                            data-testid="input-email"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500 mt-2 ml-1">
                          We'll send your Applicant ID and verification instructions to this email
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      What happens next?
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-egyptian-blue font-bold">•</span>
                        <span>You'll receive your unique Applicant ID</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-egyptian-blue font-bold">•</span>
                        <span>A welcome email with your ID will be sent</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-egyptian-blue font-bold">•</span>
                        <span>You'll get a verification email to confirm your address</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-egyptian-blue font-bold">•</span>
                        <span>After verification, you can complete your application form</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/")}
                      className="h-12 border-2 border-gray-200 hover:bg-gray-50"
                      data-testid="button-cancel"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="h-12 bg-gradient-to-r from-egyptian-blue to-powder-blue hover:from-egyptian-blue/90 hover:to-powder-blue/90 text-white border-0 px-8 font-semibold shadow-lg"
                      disabled={registrationMutation.isPending}
                      data-testid="button-register"
                    >
                      {registrationMutation.isPending ? "Registering..." : "Register & Send Verification"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <FormFooter />
    </div>
  );
}
