import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { CheckCircle, Mail, AlertCircle, ArrowLeft, User, Building2 } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const verificationSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

const applicantLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  applicantId: z.string().min(1, "Applicant ID is required"),
});

type VerificationData = z.infer<typeof verificationSchema>;
type ApplicantLoginData = z.infer<typeof applicantLoginSchema>;

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [applicantData, setApplicantData] = useState<any>(null);
  const { toast } = useToast();

  const tokenForm = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      token: "",
    },
  });

  const loginForm = useForm<ApplicantLoginData>({
    resolver: zodResolver(applicantLoginSchema),
    defaultValues: {
      email: "",
      applicantId: "",
    },
  });

  // Check for token in URL params on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      tokenForm.setValue('token', tokenFromUrl);
      handleTokenVerification({ token: tokenFromUrl });
    }
  }, []);

  const verificationMutation = useMutation({
    mutationFn: async (data: VerificationData) => {
      const response = await apiRequest("POST", "/api/applicants/verify-email", data);
      return await response.json();
    },
    onSuccess: (response) => {
      setApplicantData(response);
      setVerificationComplete(true);
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified. You can now continue with your application.",
      });
    },
    onError: (error: any) => {
      console.error("Verification error:", error);
      let errorMessage = "An error occurred during verification. Please try again.";

      if (error.message?.includes("Invalid verification token")) {
        errorMessage = "Invalid verification token. Please check your email for the correct link.";
      } else if (error.message?.includes("expired")) {
        errorMessage = "Verification token has expired. Please contact support to resend the verification email.";
      } else if (error.message?.includes("already verified")) {
        errorMessage = "Email already verified. You can proceed to the application form.";
      }

      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: ApplicantLoginData) => {
      const response = await apiRequest("POST", "/api/applicants/login", data);
      return await response.json();
    },
    onSuccess: (response) => {
      setApplicantData(response);
      setVerificationComplete(true);
      toast({
        title: "Login Successful!",
        description: "You have successfully logged in with your Applicant ID. You can now continue with your application.",
      });
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      let errorMessage = "An error occurred during login. Please try again.";

      if (error.message?.includes("Invalid credentials")) {
        errorMessage = "Invalid email or Applicant ID. Please check your credentials.";
      } else if (error.message?.includes("Email not verified")) {
        errorMessage = "Your email address has not been verified. Please check your email for the verification link.";
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleTokenVerification = (data: VerificationData) => {
    verificationMutation.mutate(data);
  };

  const handleApplicantLogin = (data: ApplicantLoginData) => {
    loginMutation.mutate(data);
  };

  const handleTokenSubmit = (data: VerificationData) => {
    handleTokenVerification(data);
  };

  const handleLoginSubmit = (data: ApplicantLoginData) => {
    handleApplicantLogin(data);
  };

  if (verificationComplete) {
    return (
      <div className="min-h-screen bg-background">
        <FormHeader 
          title="Email Verified"
          subtitle="Continue with your individual membership application"
        />
        <div className="w-full px-4 py-8 flex-1">
          <PageBreadcrumb items={[{ label: "Email Verification" }, { label: "Complete" }]} />
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-700 mb-2">Email Successfully Verified!</h2>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg mb-6">
                  <p className="text-green-800">
                    Your email address has been confirmed. You can now continue with your {applicantData?.applicantType} membership application.
                  </p>
                  {applicantData && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-green-600">Applicant ID: <strong>{applicantData.applicantId}</strong></p>
                      <p className="text-sm text-green-600">Name: <strong>{applicantData.name}</strong></p>
                      <p className="text-sm text-green-600">Type: <strong>{applicantData.applicantType}</strong></p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You're now ready to complete your application form, including personal details, business experience, and document uploads.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <Button
                    onClick={() => {
                      const redirectPath = applicantData?.applicantType === 'organization'
                        ? "/organization-application"
                        : "/apply/individual";
                      setLocation(redirectPath);
                    }}
                    className="gradient-button text-white border-0 w-full"
                    data-testid="button-continue-application"
                  >
                    Continue to {applicantData?.applicantType === 'organization' ? 'Organization' : 'Individual'} Application Form
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/")}
                    className="w-full"
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
    <div className="min-h-screen bg-background">
      <FormHeader 
        title="Verify Your Email"
        subtitle="Complete email verification to continue your application"
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[{ label: "Email Verification" }]} />
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Verification & Login
              </CardTitle>
              <p className="text-muted-foreground">
                Verify your email using a verification token or login with your Applicant ID
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="token" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="token" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Token
                  </TabsTrigger>
                  <TabsTrigger value="login" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Applicant Login
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="token" className="mt-6">
                  <div className="mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Check Your Email
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        We've sent a verification email to your registered email address. Please check your inbox and spam folder for an email from EACZ.
                      </p>
                    </div>
                  </div>

                  <Form {...tokenForm}>
                    <form onSubmit={tokenForm.handleSubmit(handleTokenSubmit)} className="space-y-6">
                      <FormField
                        control={tokenForm.control}
                        name="token"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Verification Token</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter verification token from email"
                                data-testid="input-verification-token"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-sm text-muted-foreground">
                              If you can't find the email, you can manually enter the verification token here
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setLocation("/applicant-registration")}
                          data-testid="button-back"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Registration
                        </Button>
                        <Button
                          type="submit"
                          className="gradient-button text-white border-0"
                          disabled={verificationMutation.isPending}
                          data-testid="button-verify"
                        >
                          {verificationMutation.isPending ? "Verifying..." : "Verify Email"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="login" className="mt-6">
                  <div className="mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Login with Applicant ID
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        If you already have your Applicant ID, you can login directly using your email and Applicant ID as password.
                      </p>
                    </div>
                  </div>

                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-6">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter your registered email"
                                data-testid="input-login-email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="applicantId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Applicant ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your Applicant ID (e.g., APP-IND-2024-001)"
                                data-testid="input-applicant-id"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-sm text-muted-foreground">
                              Your Applicant ID was sent to your email after registration
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setLocation("/")}
                          data-testid="button-back-home"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Home
                        </Button>
                        <Button
                          type="submit"
                          className="gradient-button text-white border-0"
                          disabled={loginMutation.isPending}
                          data-testid="button-login"
                        >
                          {loginMutation.isPending ? "Logging in..." : "Login"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div>
                    <h5 className="font-medium mb-2 flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      Individual Applicants
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Use your personal email and Applicant ID for individual membership applications.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2 flex items-center justify-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Organization Applicants
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Use your organization email and Applicant ID for organization membership applications.
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Need help? Contact support at{" "}
                    <a href="mailto:support@eacz.co.zw" className="text-blue-600 hover:underline">
                      support@eacz.co.zw
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <FormFooter />
    </div>
  );
}