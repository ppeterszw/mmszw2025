import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { User, Building2, ArrowRight, FileText, DollarSign, Clock, CheckCircle } from "lucide-react";
import logoUrl from "@assets/eaclogo_1756763778691.png";

export default function ApplicationChoicePage() {
  const [, setLocation] = useLocation();

  const applicationTypes = [
    {
      id: "individual",
      title: "Individual Membership Application",
      description: "Apply for individual estate agent registration",
      icon: User,
      features: [
        "Personal estate agent license",
        "Access to EACZ member benefits",
        "CPD training opportunities",
        "Professional certification"
      ],
      requirements: [
        "5 O-Level subjects (including English & Math)",
        "2 A-Level subjects OR mature entry (27+ years)",
        "Valid ID/Passport",
        "Relevant work experience"
      ],
      fee: "$150 USD",
      processingTime: "2-4 weeks",
      route: "/apply/individual",
      color: "bg-blue-500",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      id: "organization",
      title: "Organization Registration",
      description: "Register your real estate firm with EACZ",
      icon: Building2,
      features: [
        "Company/firm registration",
        "Principal agent designation",
        "Multi-agent management",
        "Corporate compliance"
      ],
      requirements: [
        "Valid company registration",
        "Principal Real Estate Agent (PREA)",
        "Trust account verification",
        "Tax clearance certificate"
      ],
      fee: "$500 USD",
      processingTime: "3-6 weeks",
      route: "/apply/firm",
      color: "bg-green-500",
      gradient: "from-green-500 to-green-600"
    }
  ];

  const handleApplicationChoice = (type: string) => {
    if (type === "individual") {
      setLocation("/apply/individual");
    } else {
      setLocation("/apply/firm");
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-white flex flex-col">
      {/* Header with Egyptian Blue and Powder Blue Gradient */}
      <header className="bg-gradient-to-r from-egyptian-blue via-powder-blue/80 to-egyptian-blue shadow-lg py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-md">
                <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl sm:text-2xl">Estate Agents Council</h1>
                <p className="text-white/90 text-sm sm:text-base font-medium">of Zimbabwe</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent mb-4">
              Apply for Membership
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 max-w-3xl mx-auto font-medium">
              Choose your application type to begin your journey with the Estate Agents Council of Zimbabwe
            </p>
            <Badge variant="outline" className="bg-gradient-to-r from-egyptian-blue/10 to-powder-blue/10 text-egyptian-blue border-egyptian-blue/30 px-4 py-2 font-semibold">
              <Clock className="w-4 h-4 mr-2" />
              Applications processed within 2-6 weeks
            </Badge>
          </div>

          {/* Application Type Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {applicationTypes.map((type) => {
              const IconComponent = type.icon;
              const cardGradient = type.id === "individual"
                ? "from-egyptian-blue/5 to-powder-blue/5"
                : "from-powder-blue/5 to-egyptian-blue/5";
              const headerGradient = type.id === "individual"
                ? "from-egyptian-blue to-powder-blue"
                : "from-powder-blue to-egyptian-blue";

              return (
                <Card key={type.id} className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-egyptian-blue/20 shadow-lg bg-gradient-to-br ${cardGradient}`}>
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${headerGradient}`} />
                  <CardHeader className="pb-4 pt-6">
                    <div className="flex items-start justify-between">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${headerGradient} flex items-center justify-center mb-4 shadow-xl`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <Badge className={`bg-gradient-to-r ${headerGradient} text-white border-0 font-semibold`}>
                        {type.fee}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent mb-2">
                      {type.title}
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-base font-medium">
                      {type.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {/* Features */}
                    <div>
                      <h4 className="font-bold text-egyptian-blue mb-3 flex items-center text-sm">
                        <CheckCircle className="w-5 h-5 text-powder-blue mr-2" />
                        WHAT YOU GET
                      </h4>
                      <ul className="space-y-2">
                        {type.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-800 font-medium text-sm">
                            <div className="w-2 h-2 bg-egyptian-blue rounded-full mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-bold text-egyptian-blue mb-3 flex items-center text-sm">
                        <FileText className="w-5 h-5 text-powder-blue mr-2" />
                        REQUIREMENTS
                      </h4>
                      <ul className="space-y-2">
                        {type.requirements.map((req, index) => (
                          <li key={index} className="flex items-center text-gray-800 font-medium text-sm">
                            <div className="w-2 h-2 bg-powder-blue rounded-full mr-3 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Processing Info */}
                    <div className={`flex items-center justify-between p-4 bg-gradient-to-r ${headerGradient} bg-opacity-10 rounded-xl border border-egyptian-blue/20`}>
                      <div className="flex items-center text-egyptian-blue font-semibold">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>{type.fee}</span>
                      </div>
                      <div className="flex items-center text-egyptian-blue font-semibold">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{type.processingTime}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      size="lg"
                      className={`w-full bg-gradient-to-r ${headerGradient} hover:opacity-90 text-white border-0 font-bold py-6 text-base transition-all duration-200 shadow-xl hover:shadow-2xl group-hover:scale-105`}
                      onClick={() => handleApplicationChoice(type.id)}
                    >
                      Begin Application
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Already Registered Section */}
          <div className="text-center pb-8">
            <Card className="max-w-2xl mx-auto border-2 border-egyptian-blue/20 shadow-lg bg-gradient-to-br from-egyptian-blue/5 to-powder-blue/5">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent">
                  Already Started an Application?
                </CardTitle>
                <CardDescription className="text-base text-gray-700 font-medium">
                  Continue where you left off by logging in with your application credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setLocation("/applicant-login")}
                  className="font-semibold border-2 border-egyptian-blue text-egyptian-blue hover:bg-egyptian-blue hover:text-white transition-all"
                >
                  Individual Login
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setLocation("/organization-applicant-login")}
                  className="font-semibold border-2 border-powder-blue text-powder-blue hover:bg-powder-blue hover:text-white transition-all"
                >
                  Organization Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-egyptian-blue to-powder-blue text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-3 font-medium">© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-sm text-white/90 font-medium">
            <span>📞 746 400 / 746 356</span>
            <span>✉️ info@eacz.co.zw</span>
          </div>
        </div>
      </footer>
    </div>
  );
}