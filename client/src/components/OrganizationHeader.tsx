import { 
  Building2, Users, FileText, CreditCard, 
  Award, RefreshCw, Settings, UserCheck
} from "lucide-react";
import { UnifiedPortalHeader } from "./UnifiedPortalHeader";

interface OrganizationHeaderProps {
  currentPage: string;
  title?: string;
  subtitle?: string;
}

export function OrganizationHeader({ currentPage, title = "EACZ Organization Portal", subtitle = "Organization Dashboard" }: OrganizationHeaderProps) {
  const navigationItems = [
    { icon: Building2, label: "Dashboard", href: "/organization-portal", value: "dashboard" },
    { icon: UserCheck, label: "Principal", href: "/organization/principal", value: "principal" },
    { icon: Users, label: "Agents", href: "/organization/agents", value: "agents" },
    { icon: FileText, label: "Documents", href: "/organization/documents", value: "documents" },
    { icon: Award, label: "Certificate", href: "/organization/certificate", value: "certificate" },
    { icon: CreditCard, label: "Payments", href: "/organization/payments", value: "payments" },
    { icon: RefreshCw, label: "Renewals", href: "/organization/renewals", value: "renewals" },
    { icon: Settings, label: "Profile", href: "/organization/profile", value: "profile" },
  ];

  return (
    <UnifiedPortalHeader
      currentPage={currentPage}
      title={title}
      subtitle={subtitle}
      navigationItems={navigationItems}
    />
  );
}