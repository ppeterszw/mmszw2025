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
import { CheckCircle, Mail, User, ArrowLeft } from "lucide-react";
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
    registrationMutation.mutate(data);
  };

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-background">
        <FormHeader 
          title="Registration Complete"
          subtitle="Please verify your email to continue with your application"
        />
        <div className="w-full px-4 py-8 flex-1">
          <PageBreadcrumb items={[{ label: "Individual Registration" }, { label: "Complete" }]} />
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-700 mb-2">Registration Successful!</h2>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="font-medium mb-2">Your Applicant ID</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{applicantId}</div>
                  <p className="text-sm text-muted-foreground">Please save this ID for your records</p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Check Your Email</p>
                      <p className="text-sm text-muted-foreground">
                        We've sent you a welcome message and a verification email. Please check your inbox and spam folder.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Verify Your Email</p>
                      <p className="text-sm text-muted-foreground">
                        Click the verification link in your email to confirm your email address and continue with your application.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Button
                    onClick={() => setLocation("/verify-email")}
                    className="gradient-button text-white border-0 w-full"
                    data-testid="button-verify-email"
                  >
                    I've Verified My Email - Continue
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
        title="Apply as Individual Member"
        subtitle="Register with the Estate Agents Council of Zimbabwe"
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[{ label: "Individual Registration" }]} />
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
              <p className="text-muted-foreground">
                Please provide your details to begin your individual membership application
              </p>
            </CardHeader>
            <CardContent>
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
                            <Input
                              placeholder="Enter your first name"
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
                          <FormLabel>Surname *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your surname"
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
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            data-testid="input-email"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          We'll send your Applicant ID and verification instructions to this email
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">What happens next?</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• You'll receive your unique Applicant ID</li>
                      <li>• A welcome email with your ID will be sent</li>
                      <li>• You'll get a verification email to confirm your address</li>
                      <li>• After verification, you can complete your application form</li>
                    </ul>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/")}
                      data-testid="button-cancel"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="gradient-button text-white border-0"
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