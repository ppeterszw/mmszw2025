import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { Building2, AlertTriangle, CheckCircle } from "lucide-react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { OrganizationApplicationForm } from "@/components/forms/OrganizationApplicationForm";
import { useToast } from "@/hooks/use-toast";
import { useApplicantAuth } from "@/hooks/use-applicant-auth";

export default function OrganizationApplication() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { applicant } = useApplicantAuth();
  const { toast } = useToast();

  // Redirect if not authenticated or not an organization applicant
  if (!applicant) {
    setLocation("/organization-applicant-login");
    return null;
  }

  if (applicant?.email && !applicant?.emailVerified) {
    toast({
      title: "Access denied",
      description: "This page is for organization applicants only.",
      variant: "destructive",
    });
    setLocation("/");
    return null;
  }

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/organization-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'email': applicant.email,
          'applicantId': applicant.applicantId
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const result = await response.json();

      toast({
        title: "Application submitted successfully!",
        description: "Your organization application has been submitted for review.",
      });

      // Redirect to success page or dashboard
      setLocation("/organization-application-success");
    } catch (error: any) {
      console.error('Application submission error:', error);
      toast({
        title: "Failed to submit application",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FormHeader
        title="Organization Application Form"
        subtitle={`Complete your organization membership application - ${applicant.firstName} ${applicant.surname}`}
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Organization Login", href: "/organization-applicant-login" },
          { label: "Application Form", href: "/organization-application" }
        ]} />

        <div className="mt-8">
          {!applicant.emailVerified && (
            <div className="max-w-4xl mx-auto mb-6">
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Email Verification Required</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please verify your email address before submitting your application.
                        Check your inbox for the verification link.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <OrganizationApplicationForm
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            initialData={{
              companyName: "",
              email: applicant.email || "",
            }}
          />
        </div>
      </div>
      <FormFooter />
    </div>
  );
}