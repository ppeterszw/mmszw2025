import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { LogIn, UserPlus, ArrowRight, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

export default function ApplyLanding() {
  const [, setLocation] = useLocation();

  const options = [
    {
      id: "continue",
      title: "Continue Your Application",
      description: "Already registered? Log in to complete your membership application",
      icon: LogIn,
      gradient: "from-egyptian-blue to-powder-blue",
      bgGradient: "from-blue-50 to-cyan-50",
      benefits: [
        "Resume where you left off",
        "All your progress is saved",
        "Complete remaining sections",
        "Track application status"
      ],
      action: () => setLocation("/application-login-choice"),
      buttonText: "Log In to Continue",
      badge: "Returning Applicant"
    },
    {
      id: "register",
      title: "Start New Application",
      description: "New to EACZ? Begin your membership registration process",
      icon: UserPlus,
      gradient: "from-emerald-600 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      benefits: [
        "Quick registration process",
        "Email verification",
        "Receive your Applicant ID",
        "Begin application immediately"
      ],
      action: () => setLocation("/application-type-choice"),
      buttonText: "Register Now",
      badge: "New Applicant"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <FormHeader
        title="Apply for Membership"
        subtitle="Estate Agents Council of Zimbabwe"
      />

      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[{ label: "Apply for Membership" }]} />

        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent mb-4">
              Welcome to EACZ Membership Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Join Zimbabwe's leading professional body for estate agents and property practitioners
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="bg-white/80 text-blue-700 border-blue-200 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Professional Registration
              </Badge>
              <Badge variant="outline" className="bg-white/80 text-green-700 border-green-200 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                CPD Opportunities
              </Badge>
              <Badge variant="outline" className="bg-white/80 text-purple-700 border-purple-200 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Industry Recognition
              </Badge>
            </div>
          </div>

          {/* Main Choice Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {options.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card
                  key={option.id}
                  className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-gray-100 bg-white shadow-xl"
                >
                  {/* Top gradient bar */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${option.gradient}`} />

                  <CardHeader className={`bg-gradient-to-br ${option.bgGradient} border-b-2 border-gray-100 pb-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-white/90 text-gray-700 font-semibold">
                        {option.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-base">
                      {option.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 text-egyptian-blue mr-2" />
                        Requirements
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center">
                          <span className="text-egyptian-blue mr-2">•</span>
                          National ID or Passport
                        </li>
                        <li className="flex items-center">
                          <span className="text-egyptian-blue mr-2">•</span>
                          Educational Certificates
                        </li>
                        <li className="flex items-center">
                          <span className="text-egyptian-blue mr-2">•</span>
                          Proof of Address
                        </li>
                        <li className="flex items-center">
                          <span className="text-egyptian-blue mr-2">•</span>
                          Professional References
                        </li>
                      </ul>
                    </div>

                    {/* Types of Membership */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {option.id === "continue" || option.id === "register" ? "Types of Membership" : "Membership Categories"}
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium text-gray-800 mb-2">Individual Members:</p>
                          <ul className="space-y-1 text-sm text-gray-700 ml-4">
                            <li className="flex items-center">
                              <span className="text-egyptian-blue mr-2">→</span>
                              Real Estate Agent
                            </li>
                            <li className="flex items-center">
                              <span className="text-egyptian-blue mr-2">→</span>
                              Property Manager
                            </li>
                            <li className="flex items-center">
                              <span className="text-egyptian-blue mr-2">→</span>
                              Principal Real Estate Agent
                            </li>
                            <li className="flex items-center">
                              <span className="text-egyptian-blue mr-2">→</span>
                              Real Estate Negotiator
                            </li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 mb-2">Organizational Members:</p>
                          <ul className="space-y-1 text-sm text-gray-700 ml-4">
                            <li className="flex items-center">
                              <span className="text-egyptian-blue mr-2">→</span>
                              Real Estate Firm
                            </li>
                            <li className="flex items-center">
                              <span className="text-egyptian-blue mr-2">→</span>
                              Property Management Firm
                            </li>
                            <li className="flex items-center">
                              <span className="text-egyptian-blue mr-2">→</span>
                              Brokerage Firm
                            </li>
                            <li className="flex items-center">
                              <span className="text-egyptian-blue mr-2">→</span>
                              Real Estate Development Firm
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      size="lg"
                      className={`w-full bg-gradient-to-r ${option.gradient} hover:opacity-90 text-white border-0 font-semibold py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
                      onClick={option.action}
                    >
                      {option.buttonText}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Important Information */}
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-orange-900 mb-2">Before You Begin</h3>
                  <p className="text-orange-800 mb-3">
                    Please ensure you have the following documents ready to complete your application:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-orange-700">
                    <li className="flex items-center">
                      <span className="text-orange-600 mr-2">•</span>
                      National ID or Passport
                    </li>
                    <li className="flex items-center">
                      <span className="text-orange-600 mr-2">•</span>
                      Educational Certificates
                    </li>
                    <li className="flex items-center">
                      <span className="text-orange-600 mr-2">•</span>
                      Proof of Address
                    </li>
                    <li className="flex items-center">
                      <span className="text-orange-600 mr-2">•</span>
                      Professional References
                    </li>
                  </ul>
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
