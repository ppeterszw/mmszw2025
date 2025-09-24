import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormHeader } from "@/components/ui/form-header";
import { OrganizationHeader } from "@/components/OrganizationHeader";
import { 
  Building2, Users, FileText, CreditCard, Award,
  Download, Share2, QrCode, CheckCircle, Calendar,
  MapPin, Phone, Mail, Shield, User
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function OrganizationCertificatePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Mock organization data
  const mockOrganization = {
    id: "org-1",
    name: "Prime Properties Real Estate",
    type: "real_estate_firm",
    registrationNumber: "EAC-ORG-0001",
    email: "info@primeproperties.co.zw",
    phone: "+263712345678",
    address: "123 Main Street, Harare, Zimbabwe",
    principalAgent: "Sarah Johnson",
    membershipStatus: "active",
    registrationDate: new Date("2024-01-01"),
    expiryDate: new Date("2025-01-01"),
    certificateNumber: "CERT-ORG-2024-0001"
  };


  const getOrganizationTypeDisplay = (type: string) => {
    switch (type) {
      case "real_estate_firm": return "Real Estate Firm";
      case "property_management_firm": return "Property Management Firm";
      case "brokerage_firm": return "Brokerage Firm";
      case "real_estate_development_firm": return "Real Estate Development Firm";
      default: return type.replace(/_/g, " ");
    }
  };

  const handleDownloadCertificate = () => {
    toast({
      title: "Download Started",
      description: "Your organization certificate is being downloaded..."
    });
  };

  const handleShareCertificate = () => {
    toast({
      title: "Share Link Generated",
      description: "Certificate verification link copied to clipboard."
    });
  };

  const verificationUrl = `${window.location.origin}/verify/organization/${mockOrganization.registrationNumber}`;

  return (
    <div className="min-h-screen bg-background">
      <OrganizationHeader currentPage="certificate" />
      
      <div className="p-6">
        <main className="w-full">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Organization Certificate</h1>
              <p className="text-muted-foreground">Download and share your official EACZ organization certificate</p>
            </div>

            {/* Certificate Preview */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 text-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  Digital Certificate of Registration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg border-2 border-blue-200">
                  {/* Certificate Header */}
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Estate Agents Council of Zimbabwe</h2>
                    <h3 className="text-xl font-semibold text-blue-800">Certificate of Organization Registration</h3>
                  </div>

                  {/* Certificate Content */}
                  <div className="text-center mb-8">
                    <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{mockOrganization.name}</h2>
                    <p className="text-lg text-gray-700 mb-2">
                      is a registered <strong>{getOrganizationTypeDisplay(mockOrganization.type)}</strong>
                    </p>
                    <p className="text-lg text-gray-700 mb-6">
                      under the Estate Agents Council of Zimbabwe
                    </p>
                  </div>

                  {/* Certificate Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Registration Number</p>
                        <p className="text-lg font-bold text-blue-800">{mockOrganization.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Certificate Number</p>
                        <p className="text-lg font-bold text-blue-800">{mockOrganization.certificateNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Principal Agent</p>
                        <p className="text-gray-900 font-semibold">{mockOrganization.principalAgent}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Registration Date</p>
                        <p className="text-gray-900 font-semibold">{mockOrganization.registrationDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Valid Until</p>
                        <p className="text-gray-900 font-semibold">{mockOrganization.expiryDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* QR Code and Verification */}
                  <div className="flex justify-center mb-6">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
                        <QrCode className="w-20 h-20 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">Scan to verify certificate</p>
                      <p className="text-xs text-gray-500 mt-1">Certificate ID: {mockOrganization.certificateNumber}</p>
                    </div>
                  </div>

                  {/* Certificate Footer */}
                  <div className="text-center border-t border-gray-300 pt-6">
                    <p className="text-sm text-gray-600">
                      This certificate is valid and can be verified at 
                      <a href={verificationUrl} className="text-blue-600 hover:underline ml-1">
                        {verificationUrl}
                      </a>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Issued by Estate Agents Council of Zimbabwe • {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Benefits */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-gray-900">Organization Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Legal Recognition</h3>
                    <p className="text-sm text-gray-600">Official recognition as a registered real estate organization in Zimbabwe</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Professional Network</h3>
                    <p className="text-sm text-gray-600">Access to EACZ professional network and industry resources</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Industry Standards</h3>
                    <p className="text-sm text-gray-600">Compliance with industry standards and professional practices</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white/95 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-900">Certificate Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="gradient-button text-white border-0"
                    onClick={handleDownloadCertificate}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={handleShareCertificate}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Certificate
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => window.open(verificationUrl, '_blank')}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Verify Online
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}