import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CertificateTemplate } from "@/components/certificates/CertificateTemplate";
import { Download, Share, CheckCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import type { Member } from "@shared/schema";

export default function CertificatePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: member, isLoading } = useQuery<Member>({
    queryKey: ["/api/members/profile"],
    enabled: !!user,
  });

  const handleDownloadPDF = () => {
    // This would generate and download the PDF certificate
    window.print();
  };

  const handleShareCertificate = () => {
    if (navigator.share) {
      navigator.share({
        title: "EACZ Certificate",
        text: "My Estate Agents Council of Zimbabwe Certificate",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleVerifyCertificate = () => {
    setLocation("/verify");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLocation("/member-portal")}
            className="mr-4"
            data-testid="button-back-to-portal"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portal
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Digital Certificate</h1>
            <p className="text-muted-foreground">Estate Agents Council of Zimbabwe</p>
          </div>
        </div>

        {/* Certificate Preview */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <CertificateTemplate
              memberName={member ? `${member.firstName} ${member.lastName}`.toUpperCase() : ""}
              memberType={member?.memberType?.replace(/_/g, ' ').toUpperCase() || ""}
              registrationNumber={member?.membershipNumber || ""}
              issueDate={member?.joiningDate ? new Date(member.joiningDate).toLocaleDateString() : ""}
              expiryDate={member?.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : ""}
              qrCodeData={`${window.location.origin}/verify?member=${member?.membershipNumber}`}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button 
            size="lg"
            className="gradient-button text-white border-0"
            onClick={handleDownloadPDF}
            data-testid="button-download-pdf"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            onClick={handleShareCertificate}
            data-testid="button-share-certificate"
          >
            <Share className="w-5 h-5 mr-2" />
            Share Certificate
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            onClick={handleVerifyCertificate}
            data-testid="button-verify-certificate"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Verify Online
          </Button>
        </div>
      </div>
    </div>
  );
}
