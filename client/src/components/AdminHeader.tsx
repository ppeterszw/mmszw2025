import { useQuery } from "@tanstack/react-query";
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

interface DashboardStats {
  totalMembers: number;
  totalOrganizations: number;
  pendingApplications: number;
  openCases: number;
  totalRevenue: number;
  totalUsers: number;
  upcomingEvents: number;
}

export function AdminHeader({
  currentPage,
  title = "EACZ Admin Portal",
  subtitle = "Estate Agents Council Administration"
}: AdminHeaderProps) {
  // Fetch live dashboard statistics
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

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
      badge: stats?.totalMembers?.toString() || "0",
      badgeVariant: "secondary" as const
    },
    {
      icon: Building2,
      label: "FirmsHUB",
      href: "/admin-dashboard/organizations",
      value: "organizations",
      badge: stats?.totalOrganizations?.toString() || "0",
      badgeVariant: "secondary" as const
    },
    {
      icon: UserCog,
      label: "UsersHUB",
      href: "/admin-dashboard/users",
      value: "users",
      badge: stats?.totalUsers?.toString() || "0",
      badgeVariant: "secondary" as const
    },
    {
      icon: AlertTriangle,
      label: "CasesHUB",
      href: "/case-management",
      value: "cases",
      badge: stats?.openCases?.toString() || "0",
      badgeVariant: "destructive" as const
    },
    {
      icon: Calendar,
      label: "EventsHUB",
      href: "/event-management",
      value: "events",
      badge: stats?.upcomingEvents?.toString() || "0",
      badgeVariant: "default" as const
    },
    {
      icon: DollarSign,
      label: "FinancesHUB",
      href: "/admin-dashboard/finance",
      value: "finance",
      badge: stats?.totalRevenue ? formatCurrency(stats.totalRevenue) : "$0",
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
