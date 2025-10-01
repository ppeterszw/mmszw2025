import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { LogIn, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useApplicantAuth } from "@/hooks/use-applicant-auth";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(1, "Password is required")
    .regex(/^MBR-APP-\d{4}-\d{4}$/, "Password should be your Applicant ID (format: MBR-APP-YYYY-XXXX)"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function ApplicantLogin() {
  const [, setLocation] = useLocation();
  const { loginMutation } = useApplicantAuth();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: LoginData) => {
    // Convert the password (applicant ID) back to the expected format for the API
    const loginData = {
      email: data.email,
      applicantId: data.password // The password is actually the applicant ID
    };

    loginMutation.mutate(loginData, {
      onSuccess: () => {
        // Redirect to member registration form after successful login
        setTimeout(() => {
          setLocation("/member-registration");
        }, 1500);
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <FormHeader 
        title="Continue Your Application"
        subtitle="Log in with your Applicant ID and email address"
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[
          { label: "Individual Application" }, 
          { label: "Login" }
        ]} />
        
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Welcome Back</CardTitle>
              <p className="text-muted-foreground">
                Enter your details to continue your membership application
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                        <p className="text-xs text-muted-foreground">
                          Use the same email address from your registration
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password (Your Applicant ID) *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="MBR-APP-2025-0001"
                            data-testid="input-password"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Use your Applicant ID that was sent to your email as your password
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-green-50 p-3 rounded-lg flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-green-700">Ready to continue?</p>
                      <p className="text-green-600">Once logged in, you'll be able to complete your membership application form with all required documents.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full gradient-button text-white border-0"
                      disabled={loginMutation.isPending}
                      data-testid="button-login"
                    >
                      {loginMutation.isPending ? "Logging in..." : "Continue Application"}
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="mt-6 space-y-3">
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/apply/individual")}
                    className="text-sm"
                    data-testid="button-back-choice"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Options
                  </Button>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-orange-700">Don't have your Applicant ID password?</p>
                      <p className="text-orange-600 mb-2">Check your email for the welcome message we sent when you first registered. Your Applicant ID serves as your password.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation("/applicant-registration")}
                        className="text-orange-600 border-orange-300"
                        data-testid="button-register-instead"
                      >
                        Register Instead
                      </Button>
                    </div>
                  </div>
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