import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { Building2, AlertCircle, CheckCircle } from "lucide-react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function OrganizationApplication() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <FormHeader 
        title="Organization Application Form"
        subtitle="Complete your organization membership application"
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Organization Login", href: "/organization-applicant-login" },
          { label: "Application Form", href: "/organization-application" }
        ]} />
        
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-800">Organization Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Under Development</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      The complete organization application form is currently being developed. 
                      Your organization registration has been successfully completed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">What's Next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email Verification</p>
                      <p className="text-sm text-muted-foreground">
                        Ensure your organization email is verified before proceeding
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Document Preparation</p>
                      <p className="text-sm text-muted-foreground">
                        Gather required documents: Certificate of Incorporation, Trust Account details, etc.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Application Completion</p>
                      <p className="text-sm text-muted-foreground">
                        Complete the full application form when it becomes available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Contact the Estate Agents Council of Zimbabwe for assistance with your organization application.
                </p>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>📧 Email: info@eacz.co.zw</p>
                  <p>📞 Phone: Contact details to be provided</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setLocation("/organization-applicant-login")}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-back-login"
                >
                  Back to Login
                </Button>
                <Button 
                  onClick={() => setLocation("/")}
                  className="flex-1"
                  data-testid="button-home"
                >
                  Return to Home
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