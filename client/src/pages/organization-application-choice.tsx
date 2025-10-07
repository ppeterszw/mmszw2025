import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Building2, UserCheck, UserPlus } from "lucide-react";
import { useLocation } from "wouter";

export default function OrganizationApplicationChoice() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-egyptian-blue to-powder-blue py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Register Your Organization
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join the Estate Agents Council of Zimbabwe as a registered real estate firm or organization
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                className="bg-white text-egyptian-blue hover:bg-white/90 border-0 font-semibold"
                onClick={() => setLocation("/organization-applicant-registration")}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Start Registration
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                onClick={() => setLocation("/organization-applicant-login")}
              >
                Continue Existing Application
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[{ label: "Register Your Firm" }]} />
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Have you already started your organization registration?</CardTitle>
              <p className="text-muted-foreground">
                Please choose the option that applies to you
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Yes - Already Registered */}
                <Card className="border-2 hover:border-blue-500 transition-colors cursor-pointer" 
                      onClick={() => setLocation("/organization-applicant-login")}>
                  <CardContent className="p-6 text-center">
                    <UserCheck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Yes, I've started</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      I have an Organization Applicant ID and want to continue my registration
                    </p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
                      data-testid="button-continue-organization-application"
                    >
                      Continue Registration
                    </Button>
                  </CardContent>
                </Card>

                {/* No - Need to Register */}
                <Card className="border-2 hover:border-green-500 transition-colors cursor-pointer"
                      onClick={() => setLocation("/organization-applicant-registration")}>
                  <CardContent className="p-6 text-center">
                    <UserPlus className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No, I need to start</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      I'm new and need to get an Organization Applicant ID first
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-green-500 text-green-700 hover:bg-green-50"
                      data-testid="button-start-organization-registration"
                    >
                      Start Registration
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-900">What you'll need for organization registration:</h4>
                </div>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Company name and contact details</li>
                  <li>• Valid business email address</li>
                  <li>• Certificate of incorporation</li>
                  <li>• Trust account details</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <FormFooter />
    </div>
  );
}