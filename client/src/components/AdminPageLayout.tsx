import { ReactNode } from "react";
import { AdminHeader } from "./AdminHeader";
import { FormFooter } from "./ui/form-footer";

interface AdminPageLayoutProps {
  children: ReactNode;
  currentPage: string;
  title?: string;
  subtitle?: string;
}

export function AdminPageLayout({
  children,
  currentPage,
  title,
  subtitle
}: AdminPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      <AdminHeader currentPage={currentPage} title={title} subtitle={subtitle} />

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Cityscape Background Image - positioned at footer with 30% opacity */}
      <div className="relative">
        <div
          className="absolute bottom-0 left-0 right-0 bg-no-repeat bg-center bg-contain pointer-events-none"
          style={{
            backgroundImage: "url('/assets/images/cityscape-bg.svg')",
            opacity: 0.3,
            backgroundPosition: "center bottom",
            backgroundSize: "40% auto", // Reduced by 60%
            height: "300px",
            zIndex: 0
          }}
        />
        <FormFooter />
      </div>
    </div>
  );
}
