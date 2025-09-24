import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormHeader } from "@/components/ui/form-header";
import { User, Building2, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function LoginChoice() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect if user is not a principal agent
    if (user && user.memberType !== "principal_real_estate_agent") {
      setLocation("/member-portal");
    }
  }, [user, setLocation]);

  if (!user || user.memberType !== "principal_real_estate_agent") {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <FormHeader 
        title="EACZ Portal Access" 
        subtitle="Choose Your Portal"
      />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome, {user.firstName} {user.lastName}
            </h1>
            <p className="text-blue-100">
              As a Principal Real Estate Agent, you have access to both portals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Individual Member Portal */}
            <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Individual Member Portal</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  Access your personal membership details, CPD tracking, certificates, and individual member benefits.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Personal Profile Management</li>
                  <li>• CPD Points Tracking</li>
                  <li>• Digital Certificate Download</li>
                  <li>• Event Registration</li>
                  <li>• Payment History</li>
                </ul>
                <Button 
                  className="w-full gradient-button text-white border-0 mt-6"
                  onClick={() => setLocation("/member-portal")}
                  data-testid="button-member-portal"
                >
                  Access Member Portal
                </Button>
              </CardContent>
            </Card>

            {/* Company Portal */}
            <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Company Portal</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  Manage your registered firm, supervise agents, handle organizational compliance and operations.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Agent Management</li>
                  <li>• Company Documents</li>
                  <li>• Compliance Monitoring</li>
                  <li>• Organizational Payments</li>
                  <li>• Firm Registration Details</li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 mt-6"
                  onClick={() => setLocation("/organization-portal")}
                  data-testid="button-company-portal"
                >
                  Access Company Portal
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-blue-100 text-sm">
              You can switch between portals at any time using the navigation menu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}