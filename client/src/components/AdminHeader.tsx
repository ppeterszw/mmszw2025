import { 
  Users, Building2, AlertTriangle, Calendar, 
  DollarSign, Settings, UserCog
} from "lucide-react";
import { UnifiedPortalHeader } from "./UnifiedPortalHeader";

interface AdminHeaderProps {
  currentPage: string;
  title?: string;
  subtitle?: string;
}

export function AdminHeader({ currentPage, title = "EACZ Admin Portal", subtitle = "Administration Dashboard" }: AdminHeaderProps) {
  const navigationItems = [
    { icon: Users, label: "Dashboard", href: "/admin-dashboard", value: "dashboard" },
    { icon: Users, label: "AgentsHUB", href: "/admin-dashboard/members", value: "members" },
    { icon: Building2, label: "FirmsHUB", href: "/admin-dashboard/organizations", value: "organizations" },
    { icon: UserCog, label: "UsersHUB", href: "/admin-dashboard/users", value: "users" },
    { icon: AlertTriangle, label: "CasesHUB", href: "/case-management", value: "cases" },
    { icon: Calendar, label: "EventsHUB", href: "/event-management", value: "events" },
    { icon: DollarSign, label: "FinancesHUB", href: "/admin-dashboard/finance", value: "finance" },
    { icon: Settings, label: "Settings", href: "/admin-dashboard/settings", value: "settings" },
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