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

      {/* Main Content with Background */}
      <div className="relative">
        {/* Cityscape Background Image - positioned above footer */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-contain pointer-events-none"
          style={{
            backgroundImage: "url('/assets/images/cityscape-bg.svg')",
            opacity: 0.5,
            backgroundPosition: "center bottom",
            backgroundSize: "contain",
            minHeight: "calc(100vh - 400px)", // Adjust to fit above footer
            zIndex: 0
          }}
        />

        {/* Content wrapper with higher z-index */}
        <div className="relative z-10">
          {children}
        </div>
      </div>

      <FormFooter />
    </div>
  );
}
