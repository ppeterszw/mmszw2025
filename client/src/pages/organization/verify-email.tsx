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
import { CheckCircle, Building2, AlertCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

const verificationSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

type VerificationData = z.infer<typeof verificationSchema>;

interface OrganizationVerificationResponse {
  success: boolean;
  message: string;
  applicantId: string;
  companyName: string;
  email: string;
  emailVerified: boolean;
  status: string;
}

export default function OrganizationVerifyEmail() {
  const [, setLocation] = useLocation();
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [organizationData, setOrganizationData] = useState<OrganizationVerificationResponse | null>(null);
  const { toast } = useToast();

  const form = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      token: "",
    },
  });

  // Check for token in URL params on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      form.setValue('token', tokenFromUrl);
      handleVerification({ token: tokenFromUrl });
    }
  }, []);

  const verificationMutation = useMutation({
    mutationFn: async (data: VerificationData) => {
      const response = await apiRequest("POST", "/api/organization-applicants/verify-email", data);
      return await response.json();
    },
    onSuccess: (response: OrganizationVerificationResponse) => {
      if (response && response.applicantId && response.companyName) {
        setOrganizationData(response);
        setVerificationComplete(true);
        toast({
          title: "Email Verified!",
          description: `${response.companyName} email verification completed successfully.`,
        });
      } else {
        throw new Error("Invalid response format from server");
      }
    },
    onError: (error: any) => {
      console.error("Verification error:", error);
      let errorMessage = "An error occurred during verification. Please try again.";
      
      if (error.message?.includes("Invalid verification token") || error.message?.includes("Invalid or expired")) {
        errorMessage = "Invalid verification token. Please check your email for the correct link.";
      } else if (error.message?.includes("expired")) {
        errorMessage = "Verification token has expired. Please contact support to resend the verification email.";
      } else if (error.message?.includes("already verified")) {
        errorMessage = "Email already verified. You can proceed to login.";
      }

      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleVerification = (data: VerificationData) => {
    verificationMutation.mutate(data);
  };

  const handleSubmit = (data: VerificationData) => {
    handleVerification(data);
  };

  if (verificationComplete && organizationData) {
    return (
      <div className="min-h-screen bg-background">
        <FormHeader 
          title="Email Verified"
          subtitle="Continue with your organization membership application"
        />
        <div className="w-full px-4 py-8 flex-1">
          <PageBreadcrumb items={[{ label: "Organization Email Verification" }, { label: "Complete" }]} />
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-700 mb-2">Email Successfully Verified!</h2>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">{organizationData.companyName}</h3>
                  </div>
                  <p className="text-green-800 mb-3">
                    Your organization email address has been confirmed. You can now continue with your membership application.
                  </p>
                  <div className="text-sm text-green-600 space-y-1">
                    <p><strong>Organization Applicant ID:</strong> {organizationData.applicantId}</p>
                    <p><strong>Email:</strong> {organizationData.email}</p>
                    <p><strong>Status:</strong> {organizationData.status}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You're now ready to complete your organization application form, including company details, 
                    principal agent information, and required document uploads.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <Button
                    onClick={() => setLocation("/organization-applicant-login")}
                    className="gradient-button text-white border-0 w-full"
                    data-testid="button-continue-login"
                  >
                    Continue to Login
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
        title="Verify Organization Email"
        subtitle="Complete email verification to continue your organization application"
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[{ label: "Organization Email Verification" }]} />
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organization Email Verification
              </CardTitle>
              <p className="text-muted-foreground">
                Please check your organization email and click the verification link, or enter the verification token below
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Check Your Organization Email
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification email to your organization's registered email address. 
                    Please check your inbox and spam folder for an email from EACZ.
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
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
                      onClick={() => setLocation("/organization-applicant-registration")}
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

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive the email? Please check your spam folder or contact support at{" "}
                  <a href="mailto:support@eacz.co.zw" className="text-blue-600 hover:underline">
                    support@eacz.co.zw
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <FormFooter />
    </div>
  );
}