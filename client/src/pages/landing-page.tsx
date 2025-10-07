import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { LogIn, UserPlus, Building2, Search, FileText, Phone, Mail, MapPin } from "lucide-react";
import logoUrl from "@assets/eaclogo_1756763778691.png";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const quickActions = [
    {
      title: "Verify Agent",
      description: "Check if an agent is registered and in good standing with the EACZ.",
      icon: Search,
      action: () => setLocation("/verify"),
      buttonText: "Verify",
      buttonVariant: "outline" as const
    },
    {
      title: "Member Login",
      description: "Access your member dashboard and manage your account.",
      icon: LogIn,
      action: () => setLocation("/auth"),
      buttonText: "Sign In",
      buttonVariant: "default" as const
    },
    {
      title: "Report a Case",
      description: "Submit a complaint against a registered agent or firm.",
      icon: FileText,
      action: () => setLocation("/cases/report"),
      buttonText: "Proceed to Report Case",
      buttonVariant: "destructive" as const
    }
  ];

  const applicationOptions = [
    {
      title: "Apply for Membership",
      description: "Individual or Organization Registration",
      icon: UserPlus,
      action: () => setLocation("/apply"),
      featured: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-egyptian-blue via-powder-blue to-egyptian-blue">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-white font-bold text-[16px]">Estate Agents Council of Zimbabwe</h1>
                <p className="text-blue-100 text-sm">Regulating Excellence in Real Estate</p>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-egyptian-blue to-powder-blue hover:from-egyptian-blue/90 hover:to-powder-blue/90 text-white border-0 shadow-lg"
              onClick={() => setLocation("/auth")}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 p-3">
            <img src={logoUrl} alt="Estate Agents Council Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Estate Agents Council of Zimbabwe
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join a community of certified professionals dedicated to upholding the highest standards in the real estate industry of Zimbabwe.
          </p>

          {/* Buttons Row */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-egyptian-blue to-powder-blue hover:from-egyptian-blue/90 hover:to-powder-blue/90 text-white border-0 font-semibold px-12 py-6 text-lg transition-all duration-200 shadow-xl hover:shadow-2xl"
              onClick={() => setLocation("/auth")}
              data-testid="button-login-main"
            >
              <LogIn className="w-6 h-6 mr-2" />
              Login to Member Portal
            </Button>
            {applicationOptions.map((option, index) => (
              <Button
                key={index}
                size="lg"
                className="bg-gradient-to-r from-egyptian-blue to-powder-blue hover:from-egyptian-blue/90 hover:to-powder-blue/90 text-white border-0 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={option.action}
                data-testid={`button-${option.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <option.icon className="w-6 h-6 mr-2" />
                {option.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">What would you like to do?</h2>
            <p className="text-blue-100 text-lg">Access our services quickly and easily.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {quickActions.map((action, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur hover:bg-white hover:shadow-2xl transition-all duration-300 border-2 border-white/50">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-egyptian-blue to-powder-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">{action.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <Button
                    className="w-full h-12 font-semibold text-base shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-egyptian-blue to-powder-blue hover:from-egyptian-blue/90 hover:to-powder-blue/90 text-white border-0"
                    onClick={action.action}
                    data-testid={`button-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {action.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Links */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 max-w-md mx-auto border border-white/20">
            <h3 className="text-white font-semibold mb-4 text-lg">Need Help?</h3>
            <div className="space-y-2 text-blue-100">
              <Button
                variant="link"
                className="text-blue-100 hover:text-white p-0 h-auto font-medium"
                onClick={() => setLocation("/cases/track")}
              >
                Already have a case number? Track it here.
              </Button>
              <br />
              <Button
                variant="link"
                className="text-blue-100 hover:text-white p-0 h-auto font-medium"
                onClick={() => setLocation("/member-directory")}
              >
                Search our member directory
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur border-t border-white/20 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-blue-100">
            <p className="mb-4">
              © 2025 Estate Agents Council of Zimbabwe. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                746 400 / 746 356
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                info@eac.co.zw
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
