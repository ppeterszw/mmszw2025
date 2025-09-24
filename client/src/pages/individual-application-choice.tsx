import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { UserCheck, UserPlus, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

export default function IndividualApplicationChoice() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <FormHeader 
        title="Individual Membership Application"
        subtitle="Estate Agents Council of Zimbabwe"
      />
      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[{ label: "Individual Application" }]} />
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Have you already registered?</CardTitle>
              <p className="text-muted-foreground">
                Please choose the option that applies to you
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Yes - Already Registered */}
                <Card className="border-2 hover:border-blue-500 transition-colors cursor-pointer" 
                      onClick={() => setLocation("/applicant-login")}>
                  <CardContent className="p-6 text-center">
                    <UserCheck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Yes, I'm registered</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      I have an Applicant ID and want to continue my application
                    </p>
                    <Button 
                      className="w-full gradient-button text-white border-0"
                      data-testid="button-continue-application"
                    >
                      Continue Application
                    </Button>
                  </CardContent>
                </Card>

                {/* No - Need to Register */}
                <Card className="border-2 hover:border-green-500 transition-colors cursor-pointer"
                      onClick={() => setLocation("/applicant-registration")}>
                  <CardContent className="p-6 text-center">
                    <UserPlus className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No, I need to register</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      I'm new and need to get an Applicant ID first
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full border-green-500 text-green-600 hover:bg-green-50"
                      data-testid="button-new-registration"
                    >
                      Start Registration
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">What's the difference?</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <UserCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Already registered:</span> You have received an Applicant ID (like MBR-APP-2025-XXXX) and verified your email address
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <UserPlus className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Need to register:</span> You're applying for the first time and need to get your Applicant ID
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
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