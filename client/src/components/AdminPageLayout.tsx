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

      {/* FormFooter with integrated cityscape background */}
      <FormFooter />
    </div>
  );
}
