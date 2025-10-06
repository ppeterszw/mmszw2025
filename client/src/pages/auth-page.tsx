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
    <div className="min-h-screen bg-white">
      {/* Top Header with Gradient */}
      <header className="bg-gradient-to-r from-egyptian-blue via-powder-blue to-egyptian-blue py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 shadow-md">
                <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Estate Agents Council</h1>
                <p className="text-white/90 text-sm md:text-base">of Zimbabwe</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-egyptian-blue hover:bg-white/90 border-0 font-semibold px-6 shadow-md"
              onClick={() => setLocation("/")}
              data-testid="button-homepage"
            >
              <Home className="w-5 h-5 mr-2" />
              Homepage
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left Column - Login Form */}
          <div className="w-full max-w-xl mx-auto lg:mx-0">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent mb-3">
                Welcome to EAC MemberHUB
              </h2>
              <p className="text-gray-600 text-lg">Sign in to access your account</p>
            </div>

            <Card className="border-2 border-gray-100 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-egyptian-blue/5 to-powder-blue/5 border-b-2 border-gray-100">
                <CardTitle className="text-2xl text-center bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent">
                  Sign In
                </CardTitle>
                <CardDescription className="text-center text-gray-600 text-base">
                  Enter your credentials to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 pb-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 mb-6 bg-gradient-to-r from-egyptian-blue/10 to-powder-blue/10">
                    <TabsTrigger
                      value="login"
                      data-testid="tab-login"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-egyptian-blue data-[state=active]:to-powder-blue data-[state=active]:text-white font-semibold"
                    >
                      Member Sign In
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form
                        onSubmit={loginForm.handleSubmit(onLogin)}
                        className="space-y-5"
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
                              <FormLabel className="text-gray-700 font-semibold text-base">Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Enter your email"
                                  data-testid="input-email"
                                  autoComplete="email"
                                  className="h-12 text-base border-2 border-gray-200 focus:border-egyptian-blue focus:ring-egyptian-blue"
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
                              <FormLabel className="text-gray-700 font-semibold text-base">Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your password"
                                  data-testid="input-password"
                                  autoComplete="current-password"
                                  className="h-12 text-base border-2 border-gray-200 focus:border-egyptian-blue focus:ring-egyptian-blue"
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
                          className="w-full h-12 bg-gradient-to-r from-egyptian-blue to-powder-blue hover:from-egyptian-blue/90 hover:to-powder-blue/90 text-white border-0 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
                    className="text-egyptian-blue hover:text-powder-blue font-semibold"
                    data-testid="link-verify-member"
                  >
                    Verify Member Registration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Service Cards */}
          <div className="w-full">
            <div className="mb-8 text-center lg:text-left">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent mb-3">
                Quick Access
              </h3>
              <p className="text-gray-600 text-lg">Access our services quickly and easily</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="border-2 border-egyptian-blue/20 hover:border-egyptian-blue/40 hover:shadow-xl transition-all duration-200 cursor-pointer bg-gradient-to-br from-egyptian-blue/5 to-powder-blue/5"
                onClick={() => setLocation("/apply/individual")}
                data-testid="card-apply-individual"
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-egyptian-blue to-powder-blue rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <UserPlus className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800">Apply as Individual</h3>
                  <p className="text-gray-600">Submit your individual membership application</p>
                </CardContent>
              </Card>

              <Card
                className="border-2 border-powder-blue/20 hover:border-powder-blue/40 hover:shadow-xl transition-all duration-200 cursor-pointer bg-gradient-to-br from-powder-blue/5 to-egyptian-blue/5"
                onClick={() => setLocation("/apply/firm")}
                data-testid="card-register-firm"
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-powder-blue to-egyptian-blue rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800">Register your Firm</h3>
                  <p className="text-gray-600">Register your organization with EACZ</p>
                </CardContent>
              </Card>

              <Card
                className="border-2 border-egyptian-blue/20 hover:border-egyptian-blue/40 hover:shadow-xl transition-all duration-200 cursor-pointer bg-gradient-to-br from-egyptian-blue/5 to-powder-blue/5"
                onClick={() => setLocation("/verify")}
                data-testid="card-verify-member"
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-egyptian-blue to-powder-blue rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800">Verify Member</h3>
                  <p className="text-gray-600">Check membership status and credentials</p>
                </CardContent>
              </Card>

              <Card
                className="border-2 border-powder-blue/20 hover:border-powder-blue/40 hover:shadow-xl transition-all duration-200 cursor-pointer bg-gradient-to-br from-powder-blue/5 to-egyptian-blue/5"
                onClick={() => setLocation("/track-application")}
                data-testid="card-track-application"
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-powder-blue to-egyptian-blue rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Search className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800">Track Your Application</h3>
                  <p className="text-gray-600">Monitor your membership application progress</p>
                </CardContent>
              </Card>

              <Card
                className="border-2 border-egyptian-blue/20 hover:border-egyptian-blue/40 hover:shadow-xl transition-all duration-200 cursor-pointer bg-gradient-to-br from-egyptian-blue/5 to-powder-blue/5"
                onClick={() => setLocation("/cases/track")}
                data-testid="card-track-case"
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-egyptian-blue to-powder-blue rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800">Track Your Case</h3>
                  <p className="text-gray-600">Follow up on your case proceedings</p>
                </CardContent>
              </Card>

              <Card
                className="border-2 border-powder-blue/20 hover:border-powder-blue/40 hover:shadow-xl transition-all duration-200 cursor-pointer bg-gradient-to-br from-powder-blue/5 to-egyptian-blue/5"
                onClick={() => setLocation("/cases/report")}
                data-testid="card-report-case"
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-powder-blue to-egyptian-blue rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800">Report Case</h3>
                  <p className="text-gray-600">Submit a new case or complaint</p>
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
