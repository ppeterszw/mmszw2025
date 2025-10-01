import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { LogIn, UserPlus, Building2, Search, FileText, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import logoUrl from "@assets/eaclogo_1756763778691.png";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await apiRequest("POST", "/api/login", loginData);
      const userData = await res.json();
      
      // Update the auth context with user data
      queryClient.setQueryData(["/api/user"], userData);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Redirect based on user role
      if (userData.role === "admin" || userData.role === "member_manager" || userData.role === "case_manager" || userData.role === "super_admin") {
        setLocation("/admin-dashboard");
      } else {
        setLocation("/member-portal");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

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
      description: "Enter your credentials to access your dashboard.",
      icon: LogIn,
      action: () => setLocation("/auth"),
      buttonText: "Sign In",
      buttonVariant: "default" as const,
      isLoginForm: true
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
    <div className="min-h-screen bg-gradient-to-br from-egyptian-blue via-egyptian-blue/90 to-blue-900">
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
                <p className="text-blue-100 text-sm">of Zimbabwe</p>
              </div>
            </div>
            <Button 
              className="gradient-button text-white border-0"
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
              className="bg-gradient-to-r from-egyptian-blue to-red-600 hover:from-egyptian-blue/90 hover:to-red-700 text-white border-0 font-semibold px-12 py-4 text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={() => setLocation("/auth")}
              data-testid="button-login-main"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </Button>
            {applicationOptions.map((option, index) => (
              <Button
                key={index}
                size="lg"
                className="gradient-button text-white border-0 font-semibold px-8 py-4 text-lg"
                onClick={option.action}
                data-testid={`button-${option.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <option.icon className="w-5 h-5 mr-2" />
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
              <Card key={index} className="bg-white/95 backdrop-blur hover:bg-white transition-all duration-200">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 gradient-button rounded-full flex items-center justify-center mx-auto mb-4">
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{action.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  {action.isLoginForm ? (
                    <div className="space-y-4">
                      <div className="space-y-2 text-left">
                        <Label htmlFor="email">Username</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          data-testid="input-username"
                        />
                      </div>
                      <div className="space-y-2 text-left">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          data-testid="input-password"
                        />
                      </div>
                      <Button 
                        className="w-full gradient-button text-white border-0"
                        onClick={handleLogin}
                        disabled={isLoggingIn || !loginData.email || !loginData.password}
                        data-testid="button-login"
                      >
                        {isLoggingIn ? "Logging In..." : "Login"}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant={action.buttonVariant}
                      className={`w-full ${
                        action.buttonVariant === "default" ? "gradient-button text-white border-0" :
                        action.buttonVariant === "outline" ? "border-powder-blue-300 text-powder-blue-700 hover:gradient-button hover:text-white hover:border-transparent" :
                        action.buttonVariant === "destructive" ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0" :
                        ""
                      }`}
                      onClick={action.action}
                      data-testid={`button-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {action.buttonText}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Links */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-white font-semibold mb-4">Need Help?</h3>
            <div className="space-y-2 text-blue-100">
              <Button 
                variant="link" 
                className="text-blue-100 hover:text-white p-0 h-auto"
                onClick={() => setLocation("/cases/track")}
              >
                Already have a case number? Track it here.
              </Button>
              <br />
              <Button 
                variant="link" 
                className="text-blue-100 hover:text-white p-0 h-auto"
                onClick={() => setLocation("/member-directory")}
              >
                Search our member directory
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur border-t border-white/20 py-8">
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