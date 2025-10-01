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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center p-1">
                <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-gray-800 font-bold text-lg">Estate Agents Council</h1>
                <p className="text-blue-600 text-sm">of Zimbabwe</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 p-3 shadow-lg">
            <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Apply for Membership
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose your application type to begin your journey with the Estate Agents Council of Zimbabwe
          </p>
          <Badge variant="outline" className="bg-white/80 text-blue-700 border-blue-200 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            Applications processed within 2-6 weeks
          </Badge>
        </div>

        {/* Application Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {applicationTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Card key={type.id} className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 group bg-white/95 backdrop-blur border-0 shadow-xl">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${type.gradient}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {type.fee}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {type.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    {type.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      What You Get
                    </h4>
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="w-5 h-5 text-blue-500 mr-2" />
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {type.requirements.map((req, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Processing Info */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="font-medium">{type.fee}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">{type.processingTime}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    size="lg"
                    className={`w-full bg-gradient-to-r ${type.gradient} hover:opacity-90 text-white border-0 font-semibold py-4 text-lg transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105`}
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
        <div className="text-center">
          <Card className="bg-white/80 backdrop-blur max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Already Started an Application?</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Continue where you left off by logging in with your application credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setLocation("/applicant-login")}
                className="font-semibold"
              >
                Individual Login
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setLocation("/organization-applicant-login")}
                className="font-semibold"
              >
                Organization Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© 2024 Estate Agents Council of Zimbabwe. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>📞 746 400 / 746 356</span>
            <span>✉️ info@eacz.co.zw</span>
          </div>
        </div>
      </footer>
    </div>
  );
}