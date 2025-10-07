import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { User, Building2, ArrowRight, CheckCircle, FileText, DollarSign, Clock, ArrowLeft } from "lucide-react";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

export default function ApplicationTypeChoice() {
  const [, setLocation] = useLocation();

  const applicationTypes = [
    {
      id: "individual",
      title: "Individual Membership",
      description: "Apply for individual estate agent registration",
      icon: User,
      gradient: "from-blue-600 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
      features: [
        "Personal estate agent license",
        "Access to EACZ member benefits",
        "CPD training opportunities",
        "Professional certification"
      ],
      requirements: [
        "5 O-Level subjects (including English & Math)",
        "2 A-Level subjects OR mature entry (27+ years)",
        "Valid National ID or Passport",
        "Proof of Address",
        "Educational Certificates"
      ],
      fee: "$150 USD",
      processingTime: "2-4 weeks",
      route: "/applicant-registration"
    },
    {
      id: "organization",
      title: "Organization Registration",
      description: "Register your real estate firm with EACZ",
      icon: Building2,
      gradient: "from-green-600 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      features: [
        "Company/firm registration",
        "Principal agent designation",
        "Multi-agent management",
        "Corporate compliance"
      ],
      requirements: [
        "Valid company registration certificate",
        "Principal Real Estate Agent (PREA)",
        "Trust account verification",
        "Tax clearance certificate",
        "Company directors information"
      ],
      fee: "$500 USD",
      processingTime: "3-6 weeks",
      route: "/organization-registration"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <FormHeader
        title="Choose Application Type"
        subtitle="Select Individual or Organization membership"
      />

      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[
          { label: "Apply for Membership", href: "/apply-landing" },
          { label: "Application Type" }
        ]} />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent mb-4">
              Select Your Membership Type
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the membership category that best suits your professional needs
            </p>
          </div>

          {/* Application Type Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {applicationTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card
                  key={type.id}
                  className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-gray-100 bg-white shadow-xl"
                >
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${type.gradient}`} />

                  <CardHeader className={`bg-gradient-to-br ${type.bgGradient} border-b-2 border-gray-100 pb-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-white/90 text-gray-700 font-semibold px-3 py-1">
                        {type.fee}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {type.title}
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-base">
                      {type.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        What You'll Get
                      </h4>
                      <ul className="space-y-2">
                        {type.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <div className="w-2 h-2 bg-egyptian-blue rounded-full mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="w-5 h-5 text-orange-500 mr-2" />
                        Required Documents
                      </h4>
                      <ul className="space-y-2">
                        {type.requirements.map((req, index) => (
                          <li key={index} className="flex items-start text-gray-700 text-sm">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Processing Info */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Application Fee</p>
                          <p className="font-bold">{type.fee}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Processing Time</p>
                          <p className="font-bold">{type.processingTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      size="lg"
                      className={`w-full bg-gradient-to-r ${type.gradient} hover:opacity-90 text-white border-0 font-semibold py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
                      onClick={() => setLocation(type.route)}
                    >
                      Register as {type.id === "individual" ? "Individual" : "Organization"}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation("/apply-landing")}
              className="border-2 border-gray-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Options
            </Button>
          </div>
        </div>
      </div>

      <FormFooter />
    </div>
  );
}
