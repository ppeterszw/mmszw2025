import { 
  Users, FileText, Calendar, CreditCard, 
  Award, Building2, User
} from "lucide-react";
import { UnifiedPortalHeader } from "./UnifiedPortalHeader";

interface MemberHeaderProps {
  currentPage: string;
  title?: string;
  subtitle?: string;
}

export function MemberHeader({ currentPage, title = "EACZ Member Portal", subtitle = "Member Dashboard" }: MemberHeaderProps) {
  const navigationItems = [
    { icon: Users, label: "Dashboard", href: "/member-portal", value: "dashboard" },
    { icon: User, label: "Profile", href: "/member/profile", value: "profile" },
    { icon: FileText, label: "Documents", href: "/member/documents", value: "documents" },
    { icon: Calendar, label: "Events", href: "/member/events", value: "events" },
    { icon: CreditCard, label: "Payments", href: "/member/payments", value: "payments" },
    { icon: Award, label: "Certificate", href: "/member/certificate", value: "certificate" },
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