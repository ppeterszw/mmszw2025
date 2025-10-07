import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { User, Building2, ArrowRight, ArrowLeft } from "lucide-react";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

export default function ApplicationLoginChoice() {
  const [, setLocation] = useLocation();

  const loginTypes = [
    {
      id: "individual",
      title: "Individual Member Login",
      description: "Continue your individual membership application",
      icon: User,
      gradient: "from-blue-600 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
      route: "/applicant-login",
      applicantIdFormat: "APP-MBR-YYYY-XXXX"
    },
    {
      id: "organization",
      title: "Organization Login",
      description: "Continue your organization/firm registration",
      icon: Building2,
      gradient: "from-green-600 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      route: "/organization-applicant-login",
      applicantIdFormat: "APP-ORG-YYYY-XXXX"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <FormHeader
        title="Continue Your Application"
        subtitle="Select your application type to log in"
      />

      <div className="w-full px-4 py-8 flex-1">
        <PageBreadcrumb items={[
          { label: "Apply for Membership", href: "/apply-landing" },
          { label: "Login Choice" }
        ]} />

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent mb-4">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your application type to continue where you left off
            </p>
          </div>

          {/* Login Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {loginTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card
                  key={type.id}
                  className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-gray-100 bg-white shadow-lg hover:-translate-y-1"
                >
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${type.gradient}`} />

                  <CardHeader className={`bg-gradient-to-br ${type.bgGradient} border-b-2 border-gray-100 pb-6`}>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-4 shadow-md`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {type.title}
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-base">
                      {type.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        You'll need:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center">
                          <span className="text-egyptian-blue mr-2">•</span>
                          Your registered email address
                        </li>
                        <li className="flex items-center">
                          <span className="text-egyptian-blue mr-2">•</span>
                          Your Applicant ID ({type.applicantIdFormat})
                        </li>
                      </ul>
                    </div>

                    <Button
                      size="lg"
                      className={`w-full bg-gradient-to-r ${type.gradient} hover:opacity-90 text-white border-0 font-semibold py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
                      onClick={() => setLocation(type.route)}
                    >
                      Continue as {type.id === "individual" ? "Individual" : "Organization"}
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
