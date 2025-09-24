import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Shield, Search, FileText, AlertTriangle, Building2, UserPlus, Users } from "lucide-react";
import logoUrl from "@assets/eaclogo_1756763778691.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { FormFooter } from "@/components/ui/form-footer";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  if (user) {
    setTimeout(() => {
      if (user.role === "admin" || user.role === "case_manager" || user.role === "super_admin") {
        setLocation("/admin-dashboard");
      } else if (user.role === "member_manager") {
        setLocation("/member-portal");
      } else {
        setLocation("/member-portal");
      }
    }, 100);
    return null;
  }

  const onLogin = async (data: LoginData) => {
    try {
      await loginMutation.mutateAsync(data);
      
      // The mutation will handle setting user data via queryClient.setQueryData
      // We can access the updated user from the auth context after the mutation
    } catch (error) {
      console.error("Login failed:", error);
    }
  };


  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <PageBreadcrumb items={[{ label: "Sign In" }]} className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen">
          {/* Left Column - Forms */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 p-1">
                <img src={logoUrl} alt="Estate Agents Council Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Estate Agents Council</h1>
              <p className="text-blue-100">of Zimbabwe</p>
            </div>

            <Card className="bg-white/95 backdrop-blur">
              <CardHeader className="text-center">
                <CardTitle>Welcome to EAC MemberHUB</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="login" data-testid="tab-login">Sign In</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form 
                        onSubmit={loginForm.handleSubmit(onLogin)} 
                        className="space-y-4"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !loginMutation.isPending) {
                            e.preventDefault();
                            loginForm.handleSubmit(onLogin)();
                          }
                        }}
                      >
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Enter your email" 
                                  data-testid="input-email"
                                  autoComplete="email"
                                  {...field} 
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const passwordField = document.querySelector('[data-testid="input-password"]') as HTMLInputElement;
                                      if (passwordField) passwordField.focus();
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Enter your password" 
                                  data-testid="input-password"
                                  autoComplete="current-password"
                                  {...field} 
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !loginMutation.isPending) {
                                      e.preventDefault();
                                      loginForm.handleSubmit(onLogin)();
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full gradient-button text-white border-0"
                          disabled={loginMutation.isPending}
                          data-testid="button-login"
                        >
                          {loginMutation.isPending ? "Signing in..." : "Sign In"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                </Tabs>

                <div className="mt-6 text-center">
                  <Button 
                    variant="link" 
                    onClick={() => setLocation("/verify")}
                    className="text-egyptian-blue hover:text-powder-blue-600"
                    data-testid="link-verify-member"
                  >
                    Verify Member Registration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Service Cards */}
          <div className="text-center lg:text-left text-white">
            <div className="mb-6">
              <Button 
                size="lg" 
                className="bg-white text-egyptian-blue hover:bg-gray-100 font-semibold px-8 mb-8"
                onClick={() => setLocation("/")}
                data-testid="button-homepage"
              >
                <Home className="w-5 h-5 mr-2" />
                Homepage
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => setLocation("/apply/individual")}
                data-testid="card-apply-individual"
              >
                <CardContent className="p-6">
                  <UserPlus className="w-8 h-8 text-pastel-blue mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Apply as Individual</h3>
                  <p className="text-sm text-blue-100">Submit your individual membership application</p>
                </CardContent>
              </Card>
              
              <Card 
                className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => setLocation("/apply/firm")}
                data-testid="card-register-firm"
              >
                <CardContent className="p-6">
                  <Building2 className="w-8 h-8 text-pastel-blue mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Register your Firm</h3>
                  <p className="text-sm text-blue-100">Register your organization with EACZ</p>
                </CardContent>
              </Card>
              
              <Card 
                className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => setLocation("/verify")}
                data-testid="card-verify-member"
              >
                <CardContent className="p-6">
                  <Shield className="w-8 h-8 text-pastel-blue mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Verify Member</h3>
                  <p className="text-sm text-blue-100">Check membership status and credentials</p>
                </CardContent>
              </Card>
              
              <Card 
                className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => setLocation("/track-application")}
                data-testid="card-track-application"
              >
                <CardContent className="p-6">
                  <Search className="w-8 h-8 text-pastel-blue mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Track Your Application</h3>
                  <p className="text-sm text-blue-100">Monitor your membership application progress</p>
                </CardContent>
              </Card>
              
              <Card 
                className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => setLocation("/cases/track")}
                data-testid="card-track-case"
              >
                <CardContent className="p-6">
                  <FileText className="w-8 h-8 text-pastel-blue mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Track Your Case</h3>
                  <p className="text-sm text-blue-100">Follow up on your case proceedings</p>
                </CardContent>
              </Card>
              
              <Card 
                className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => setLocation("/cases/report")}
                data-testid="card-report-case"
              >
                <CardContent className="p-6">
                  <AlertTriangle className="w-8 h-8 text-pastel-blue mb-3" />
                  <h3 className="font-semibold mb-2 text-white">Report Case</h3>
                  <p className="text-sm text-blue-100">Submit a new case or complaint</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <FormFooter />
    </div>
  );
}
