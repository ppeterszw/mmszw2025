export function FormFooter() {
  return (
    <div className="relative gradient-bg py-8 mt-16 overflow-hidden">
      {/* Cityscape Background Image */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full h-full bg-no-repeat bg-center bg-cover pointer-events-none"
        style={{
          backgroundImage: "url('/assets/images/cityscape-bg.svg')",
          opacity: 0.4,
          backgroundPosition: "center bottom",
          backgroundSize: "cover",
          zIndex: 0
        }}
      />

      {/* Footer Content */}
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-left text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Estate Agents Council of Zimbabwe</h3>
              <div className="space-y-2 text-blue-100">
                <p className="font-medium text-white">Professional Standards • Industry Excellence</p>
                <p className="text-sm">The official regulatory body for estate agents in Zimbabwe, ensuring professional standards and protecting the interests of property buyers, sellers, and tenants.</p>
                <p className="text-sm">Registration Number: NPO/123/2018</p>
                <p className="text-sm">Established under the Estate Agents Act [Chapter 27:05]</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2 text-blue-100">
                <p>Estate Agents Council of Zimbabwe</p>
                <p>18 McChlerry Avenue, Eastlea</p>
                <p>Harare Zimbabwe</p>
                <p>Phone: 746 400 / 746 356</p>
                <p>Email: info@eac.co.zw</p>
                <p>Website: eac.co.zw</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2 text-blue-100">
                <p><a href="/verify" className="hover:text-white transition-colors">Verify Member</a></p>
                <p><a href="/cases/track" className="hover:text-white transition-colors">Track Case</a></p>
                <p><a href="/cases/report" className="hover:text-white transition-colors">Report Case</a></p>
                <p><a href="/auth" className="hover:text-white transition-colors">Member Portal</a></p>
                <p><a href="/" className="hover:text-white transition-colors">Home</a></p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact & Legal</h3>
              <div className="space-y-2 text-blue-100">
                <p>info@eacz.co.zw</p>
                <p>+263 24 2123456</p>
                <p><a href="/certificates/verify" className="hover:text-white transition-colors">Verify Certificates</a></p>
                <p><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></p>
                <p><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></p>
                <p><a href="/complaints" className="hover:text-white transition-colors">Complaints Procedure</a></p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-300 pt-6">
            <p className="text-blue-100 text-left">
              © 2025 Estate Agents Council of Zimbabwe. All rights reserved. | Follow us: @EacZim
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}