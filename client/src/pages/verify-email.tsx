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
import { CheckCircle, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

const verificationSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

type VerificationData = z.infer<typeof verificationSchema>;

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [applicantId, setApplicantId] = useState<string>("");
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
      const response = await apiRequest("POST", "/api/applicants/verify-email", data);
      return await response.json();
    },
    onSuccess: (response) => {
      setApplicantId(response.applicantId);
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

  const handleVerification = (data: VerificationData) => {
    verificationMutation.mutate(data);
  };

  const handleSubmit = (data: VerificationData) => {
    handleVerification(data);
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
                    Your email address has been confirmed. You can now continue with your individual membership application.
                  </p>
                  {applicantId && (
                    <div className="mt-3">
                      <p className="text-sm text-green-600">Applicant ID: <strong>{applicantId}</strong></p>
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
                    onClick={() => setLocation("/member-registration")}
                    className="gradient-button text-white border-0 w-full"
                    data-testid="button-continue-application"
                  >
                    Continue to Application Form
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
                Email Verification
              </CardTitle>
              <p className="text-muted-foreground">
                Please check your email and click the verification link, or enter the verification token below
              </p>
            </CardHeader>
            <CardContent>
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