import { useState } from "react";
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
import { CheckCircle, Mail, Building2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

const registrationSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function OrganizationApplicantRegistration() {
  const [, setLocation] = useLocation();
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [applicantId, setApplicantId] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      companyName: "",
      email: "",
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationData) => {
      const response = await apiRequest("POST", "/api/organization-applicants/register", data);
      return await response.json();
    },
    onSuccess: (response) => {
      setApplicantId(response.applicantId);
      setRegistrationComplete(true);
      toast({
        title: "Registration Successful!",
        description: `Your Organization Applicant ID is ${response.applicantId}. Please check your email for verification instructions.`,
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
    registrationMutation.mutate(data);
  };

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-background">
        <FormHeader 
          title="Registration Complete"
          subtitle="Please verify your email to continue with your organization application"
        />
        <div className="w-full px-4 py-8 flex-1">
          <PageBreadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Organization Application", href: "/organization-applicant-registration" },
            { label: "Registration Complete", href: "#" }
          ]} />
          
          <div className="max-w-2xl mx-auto mt-8">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">Registration Successful!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">Your Organization Applicant ID</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-2xl font-mono font-bold text-blue-800" data-testid="text-applicant-id">
                      {applicantId}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please save this ID for future reference. You'll need it to log in.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <h4 className="font-semibold text-yellow-800">Email Verification Required</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        We've sent a verification email to your registered email address. Please click the verification link to activate your account before proceeding with your organization application.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => setLocation("/organization-applicant-login")}
                    className="w-full"
                    data-testid="button-continue-login"
                  >
                    Continue to Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setLocation("/")}
                    className="w-full"
                    data-testid="button-home"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
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
        title="Start Your Organization Application"
        subtitle="Register your organization with the Estate Agents Council of Zimbabwe"
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Organization Application", href: "/organization-applicant-registration" }
        ]} />
        
        <div className="max-w-lg mx-auto mt-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Organization Registration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your organization's details to start the application process
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your company name" 
                            {...field}
                            data-testid="input-company-name"
                          />
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="company@example.com" 
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• You'll receive an Organization Applicant ID (ORG-APP-YYYY-XXXX format)</li>
                      <li>• We'll send an email verification link to your email address</li>
                      <li>• After verification, you can complete your organization application</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registrationMutation.isPending}
                      data-testid="button-register"
                    >
                      {registrationMutation.isPending ? "Registering..." : "Start Organization Application"}
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Already have an Organization Applicant ID?
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setLocation("/organization-applicant-login")}
                        className="w-full"
                        data-testid="button-login"
                      >
                        Login to Continue Application
                      </Button>
                    </div>
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