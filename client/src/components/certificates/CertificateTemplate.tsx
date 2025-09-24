import { Card } from "@/components/ui/card";
import logoUrl from "@assets/eaclogo_1756763778691.png";

interface CertificateTemplateProps {
  memberName: string;
  memberType: string;
  registrationNumber: string;
  issueDate: string;
  expiryDate: string;
  qrCodeData: string;
}

export function CertificateTemplate({
  memberName,
  memberType,
  registrationNumber,
  issueDate,
  expiryDate,
  qrCodeData,
}: CertificateTemplateProps) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-12 min-h-[600px] print:min-h-0 print:shadow-none" 
         style={{ aspectRatio: '1.414/1' }}>
      <div className="h-full flex flex-col justify-between">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 p-2 border border-gray-300">
            <img src={logoUrl} alt="Estate Agents Council Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2" data-testid="certificate-council-name">
            ESTATE AGENTS COUNCIL
          </h2>
          <h3 className="text-xl font-semibold text-gray-600 mb-6" data-testid="certificate-country">
            OF ZIMBABWE
          </h3>
          <h4 className="text-lg font-medium text-gray-700 mb-8" data-testid="certificate-title">
            CERTIFICATE OF REGISTRATION
          </h4>
        </div>
        
        {/* Certificate Content */}
        <div className="text-center flex-1 flex flex-col justify-center">
          <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
          <h3 className="text-3xl font-bold text-gray-800 mb-4" data-testid="certificate-member-name">
            {memberName}
          </h3>
          <p className="text-lg text-gray-700 mb-2">is a registered</p>
          <h4 className="text-xl font-semibold text-egyptian-blue mb-6" data-testid="certificate-member-type">
            {memberType}
          </h4>
          <p className="text-base text-gray-600 mb-8">under the Estate Agents Act [Chapter 27:04]</p>
          
          <div className="flex justify-between items-end">
            <div className="text-left">
              <p className="text-sm text-gray-600">Registration Number:</p>
              <p className="font-semibold text-gray-800 mb-4" data-testid="certificate-registration-number">
                {registrationNumber}
              </p>
              <p className="text-sm text-gray-600">Valid Until:</p>
              <p className="font-semibold text-gray-800" data-testid="certificate-expiry-date">
                {expiryDate}
              </p>
            </div>
            
            {/* QR Code Placeholder */}
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded" data-testid="certificate-qr-code">
                  {/* QR Code would be generated here */}
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    QR
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Scan to Verify</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <div className="border-t border-gray-300 pt-4">
            <p className="text-sm text-gray-600">
              Issued on: <span data-testid="certificate-issue-date">{issueDate}</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              This certificate is valid only when verified online at www.eacz.co.zw
            </p>
            <div className="mt-4 border-t border-gray-200 pt-2">
              <p className="text-xs text-gray-500">Registrar's Signature</p>
              <div className="w-32 h-8 border-b border-gray-300 mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
