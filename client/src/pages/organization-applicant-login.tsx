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
import { LogIn, ArrowLeft, AlertTriangle, CheckCircle, Building2 } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").transform(val => val.trim().toLowerCase()),
  password: z.string()
    .min(1, "Password is required")
    .regex(/^ORG-APP-\d{4}-\d{4}$/, "Password should be your Organization Applicant ID (format: ORG-APP-YYYY-XXXX)")
    .transform(val => val.trim().toUpperCase()),
});

type LoginData = z.infer<typeof loginSchema>;

// Type for organization applicant response
interface OrganizationApplicantResponse {
  applicantId: string;
  companyName: string;
  email: string;
  emailVerified: boolean;
  status: string;
}

export default function OrganizationApplicantLogin() {
  const [, setLocation] = useLocation();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [organizationData, setOrganizationData] = useState<OrganizationApplicantResponse | null>(null);
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      // Convert the password (applicant ID) to the expected API format
      const loginData = {
        email: data.email,
        applicantId: data.password // The password is actually the applicant ID
      };
      const response = await apiRequest("POST", "/api/organization-applicants/login", loginData);
      return await response.json();
    },
    onSuccess: (response: OrganizationApplicantResponse) => {
      // Validate response shape before using
      if (response && response.applicantId && response.companyName && response.email) {
        setOrganizationData(response);
        setLoginSuccess(true);
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${response.companyName}!`,
        });
        
        // Redirect to organization application form after a short delay
        setTimeout(() => {
          setLocation("/organization-application");
        }, 2000);
      } else {
        throw new Error("Invalid response format from server");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please check your Organization Applicant ID and email address.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  if (loginSuccess && organizationData) {
    return (
      <div className="min-h-screen bg-background">
        <FormHeader 
          title="Login Successful"
          subtitle="Redirecting to your organization application..."
        />
        <div className="w-full px-4 py-8 flex-1">
          <PageBreadcrumb items={[
            { label: "Organization Login", href: "/organization-applicant-login" },
            { label: "Login Successful" }
          ]} />
          
          <div className="max-w-md mx-auto mt-8">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-800">Welcome Back!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <p className="font-semibold" data-testid="text-company-name">{organizationData.companyName}</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-applicant-id">{organizationData.applicantId}</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-email">{organizationData.email}</p>
                </div>
                
                {!organizationData.emailVerified && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-700 font-medium">Email verification required</p>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">
                      Please check your email and verify your address to continue.
                    </p>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground">
                  Redirecting to your organization application...
                </p>
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
        title="Continue Your Organization Application"
        subtitle="Log in with your Organization Applicant ID and email address"
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[
          { label: "Organization Login" }
        ]} />
        
        <div className="max-w-md mx-auto mt-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Organization Login</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your Organization Applicant ID and email to continue
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                        <p className="text-xs text-muted-foreground">
                          Use the same email address from your registration
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password (Your Organization Applicant ID)</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="ORG-APP-YYYY-XXXX"
                            {...field}
                            data-testid="input-password"
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Use your Organization Applicant ID that was sent to your email as your password
                        </p>
                      </FormItem>
                    )}
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Use your Organization Applicant ID from your registration email as your password</li>
                      <li>• Ensure your email address is verified before logging in</li>
                      <li>• Contact support if you've forgotten your Organization Applicant ID password</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                      data-testid="button-login"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Don't have an Organization Applicant ID?
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setLocation("/organization-applicant-registration")}
                        className="w-full"
                        data-testid="button-register"
                      >
                        Start Organization Application
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => setLocation("/")}
                      className="w-full"
                      data-testid="button-home"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Home
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