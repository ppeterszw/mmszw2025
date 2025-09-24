import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFooter } from "@/components/ui/form-footer";
import { MemberHeader } from "@/components/MemberHeader";
import { 
  Download, Share2, QrCode, 
  User, FileText, Calendar, CreditCard,
  Award, Shield, CheckCircle, FileCheck, Building2, ExternalLink
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function MemberCertificate() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Mock member data
  const mockMember = {
    id: "member-profile-test-id",
    membershipNumber: "EACZ2024001",
    firstName: "John",
    lastName: "Doe",
    email: "member@eacz.org",
    memberType: "principal_real_estate_agent",
    membershipStatus: "active",
    joiningDate: new Date("2024-01-01"),
    expiryDate: new Date("2025-01-01"),
    cpdPoints: 15
  };

  const member = mockMember;


  const getMemberTypeDisplay = (type: string) => {
    switch (type) {
      case "real_estate_agent": return "Real Estate Agent";
      case "property_manager": return "Property Manager";
      case "principal_real_estate_agent": return "Principal Real Estate Agent";
      case "real_estate_negotiator": return "Real Estate Negotiator";
      default: return type.replace(/_/g, " ");
    }
  };

  const downloadCertificate = async () => {
    try {
      // Generate certificate HTML for PDF conversion
      const certificateHTML = generateCertificateHTML();
      
      // Create a blob and download
      const blob = new Blob([certificateHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EACZ_Certificate_${member.membershipNumber}.html`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Certificate Downloaded",
        description: "Your digital certificate has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareCertificate = async () => {
    const shareUrl = `${window.location.origin}/public-verification?member=${member.membershipNumber}`;
    if (navigator.share) {
      await navigator.share({
        title: 'EACZ Membership Certificate',
        text: `${member.firstName} ${member.lastName} - EACZ Member`,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Certificate verification link copied to clipboard.",
      });
    }
  };

  const generateQRCodeData = () => {
    return `${window.location.origin}/public-verification?member=${member.membershipNumber}`;
  };

  const generateCertificateHTML = () => {
    const qrCodeData = generateQRCodeData();
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>EACZ Certificate - ${member.membershipNumber}</title>
        <style>
            body { font-family: 'Times New Roman', serif; margin: 0; padding: 40px; background: white; }
            .certificate { max-width: 800px; margin: 0 auto; border: 3px solid #1e40af; padding: 40px; position: relative; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { width: 80px; height: 80px; margin: 0 auto 20px; }
            .title { font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .subtitle { font-size: 18px; color: #374151; margin-bottom: 30px; }
            .content { text-align: center; line-height: 1.8; }
            .member-name { font-size: 28px; font-weight: bold; color: #1e40af; margin: 20px 0; }
            .details { font-size: 16px; margin: 10px 0; }
            .qr-section { text-align: center; margin-top: 30px; }
            .signature { margin-top: 40px; text-align: right; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="header">
                <div class="logo">🏛️</div>
                <div class="title">ESTATE AGENTS COUNCIL OF ZIMBABWE</div>
                <div class="subtitle">CERTIFICATE OF REGISTRATION</div>
            </div>
            
            <div class="content">
                <p>This is to certify that</p>
                <div class="member-name">${member.firstName} ${member.lastName}</div>
                <p>is a registered ${getMemberTypeDisplay(member.memberType)} with the Estate Agents Council of Zimbabwe</p>
                
                <div class="details">
                    <p><strong>Membership Number:</strong> ${member.membershipNumber}</p>
                    <p><strong>Date of Registration:</strong> ${new Date(member.joiningDate).toLocaleDateString()}</p>
                    <p><strong>Valid Until:</strong> ${new Date(member.expiryDate || new Date(Date.now() + 365*24*60*60*1000)).toLocaleDateString()}</p>
                </div>
                
                <div class="qr-section">
                    <p><strong>Verify this certificate at:</strong></p>
                    <p style="font-family: monospace; font-size: 14px;">${qrCodeData}</p>
                    <div style="border: 2px solid #1e40af; width: 120px; height: 120px; margin: 20px auto; display: flex; align-items: center; justify-content: center;">
                        QR CODE
                    </div>
                </div>
            </div>
            
            <div class="signature">
                <div style="border-top: 2px solid #1e40af; width: 200px; margin-left: auto; padding-top: 10px;">
                    <p><strong>Registrar</strong></p>
                    <p>Estate Agents Council of Zimbabwe</p>
                </div>
            </div>
            
            <div class="footer">
                <p>This certificate is valid only when accompanied by proper identification.</p>
                <p>For verification, visit: ${window.location.origin}/public-verification</p>
            </div>
        </div>
    </body>
    </html>
    `;
  };

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader currentPage="certificate" />
      
      <div className="p-6">
        <main className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Digital Certificate</h1>
            <p className="text-muted-foreground">Download and verify your professional registration certificate</p>
          </div>

          {/* Certificate Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Certificate Status</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <p className="text-xs text-gray-600">Valid until {member.expiryDate.toLocaleDateString()}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Member Type</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-blue-600">{getMemberTypeDisplay(member.memberType)}</div>
                  <p className="text-xs text-gray-600">Professional designation</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Verification</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-purple-600">Verified</div>
                  <p className="text-xs text-gray-600">QR code enabled</p>
                </CardContent>
              </Card>
            </div>

            {/* Digital Certificate */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 text-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
                    <FileCheck className="w-4 h-4 text-white" />
                  </div>
                  Digital Certificate of Registration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border-2 border-blue-200">
                  {/* Certificate Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">
                      Estate Agents Council of Zimbabwe
                    </h2>
                    <p className="text-blue-700 font-medium">
                      Certificate of Registration
                    </p>
                  </div>

                  {/* Certificate Body */}
                  <div className="text-center mb-6">
                    <p className="text-lg text-gray-700 mb-4">
                      This is to certify that
                    </p>
                    <h3 className="text-3xl font-bold text-blue-900 mb-2">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-lg text-gray-700 mb-4">
                      is a registered <strong>{getMemberTypeDisplay(member.memberType)}</strong>
                    </p>
                    <div className="flex justify-center mb-4">
                      <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
                        Registration No: {member.membershipNumber}
                      </Badge>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Date of Registration</p>
                      <p className="font-bold text-gray-900">{member.joiningDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valid Until</p>
                      <p className="font-bold text-gray-900">{member.expiryDate.toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-300">
                      <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">Verification QR</p>
                    </div>
                  </div>

                  {/* Certificate Footer */}
                  <div className="text-center border-t border-blue-200 pt-4">
                    <p className="text-sm text-gray-600">
                      This digital certificate is valid and can be verified at
                    </p>
                    <p className="text-sm font-mono text-blue-600">
                      https://eacz.org/verify/{member.membershipNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={downloadCertificate}
                className="gradient-button text-white border-0"
                data-testid="button-download-certificate"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF Certificate
              </Button>
              
              <Button 
                onClick={shareCertificate}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                data-testid="button-share-certificate"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Certificate
              </Button>
              
              <Button 
                onClick={() => window.open(`https://eacz.org/verify/${member.membershipNumber}`, '_blank')}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                data-testid="button-verify-certificate"
              >
                <Shield className="w-4 h-4 mr-2" />
                Verify Online
              </Button>
            </div>

            {/* Benefits Section */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mt-8">
              <CardHeader>
                <CardTitle className="text-gray-900">Membership Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Professional Recognition</h3>
                    <p className="text-sm text-gray-600">
                      Official recognition as a qualified real estate professional in Zimbabwe
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Education and Development</h3>
                    <p className="text-sm text-gray-600">
                      Access to CPD programs, workshops, and professional development opportunities
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Business Support</h3>
                    <p className="text-sm text-gray-600">
                      Networking opportunities, industry resources, and professional advocacy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
        </main>
      </div>
      
      <FormFooter />
    </div>
  );
}