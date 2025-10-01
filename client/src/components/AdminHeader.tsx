import {
  Users, Building2, AlertTriangle, Calendar,
  DollarSign, Settings, UserCog, BarChart3
} from "lucide-react";
import { UnifiedPortalHeader } from "./UnifiedPortalHeader";

interface AdminHeaderProps {
  currentPage: string;
  title?: string;
  subtitle?: string;
}

export function AdminHeader({
  currentPage,
  title = "EACZ Admin Portal",
  subtitle = "Estate Agents Council Administration"
}: AdminHeaderProps) {
  const navigationItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      href: "/admin-dashboard",
      value: "dashboard",
      badge: "New",
      badgeVariant: "destructive" as const
    },
    {
      icon: Users,
      label: "AgentsHUB",
      href: "/admin-dashboard/members",
      value: "members",
      badge: "2,340",
      badgeVariant: "secondary" as const
    },
    {
      icon: Building2,
      label: "FirmsHUB",
      href: "/admin-dashboard/organizations",
      value: "organizations",
      badge: "156",
      badgeVariant: "secondary" as const
    },
    {
      icon: UserCog,
      label: "UsersHUB",
      href: "/admin-dashboard/users",
      value: "users",
      badge: "45",
      badgeVariant: "secondary" as const
    },
    {
      icon: AlertTriangle,
      label: "CasesHUB",
      href: "/case-management",
      value: "cases",
      badge: "8",
      badgeVariant: "destructive" as const
    },
    {
      icon: Calendar,
      label: "EventsHUB",
      href: "/event-management",
      value: "events",
      badge: "12",
      badgeVariant: "default" as const
    },
    {
      icon: DollarSign,
      label: "FinancesHUB",
      href: "/admin-dashboard/finance",
      value: "finance",
      badge: "$2.4M",
      badgeVariant: "outline" as const
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/admin-dashboard/settings",
      value: "settings"
    },
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