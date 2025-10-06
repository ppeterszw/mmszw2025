import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { Menu, X, Bell, Search, TrendingUp, Plus, Filter, Download, Upload, RefreshCw, Eye } from "lucide-react";
import logoUrl from "@assets/eaclogo_1756763778691.png";

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  value: string;
  color?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

interface UnifiedPortalHeaderProps {
  currentPage: string;
  title: string;
  subtitle: string;
  navigationItems: NavigationItem[];
}

// Function to get solid active colors for each tab
const getSolidActiveColor = (index: number) => {
  const solidColors = [
    "bg-blue-600",       // Dashboard - Blue
    "bg-emerald-600",    // AgentsHUB - Emerald
    "bg-orange-600",     // FirmsHUB - Orange
    "bg-violet-600",     // UsersHUB - Violet
    "bg-rose-600",       // CasesHUB - Rose
    "bg-cyan-600",       // EventsHUB - Cyan
    "bg-yellow-600",     // FinancesHUB - Yellow
    "bg-indigo-600",     // Settings - Indigo
  ];

  return solidColors[index % solidColors.length];
};

// Function to get Quick Actions for each tab
const getQuickActions = (tabValue: string) => {
  const quickActionsMap: Record<string, Array<{ icon: React.ComponentType<{ className?: string }>, label: string, action: () => void }>> = {
    dashboard: [
      { icon: RefreshCw, label: "Refresh", action: () => window.location.reload() },
      { icon: Download, label: "Export", action: () => console.log("Export dashboard") },
      { icon: Eye, label: "View All", action: () => console.log("View all dashboard items") }
    ],
    members: [
      { icon: Plus, label: "Add Agent", action: () => console.log("Add new agent") },
      { icon: Filter, label: "Filter", action: () => console.log("Filter agents") },
      { icon: Download, label: "Export", action: () => console.log("Export agents") }
    ],
    organizations: [
      { icon: Plus, label: "Add Firm", action: () => console.log("Add new firm") },
      { icon: Filter, label: "Filter", action: () => console.log("Filter firms") },
      { icon: Download, label: "Export", action: () => console.log("Export firms") }
    ],
    users: [
      { icon: Plus, label: "Add User", action: () => console.log("Add new user") },
      { icon: Filter, label: "Filter", action: () => console.log("Filter users") },
      { icon: Download, label: "Export", action: () => console.log("Export users") }
    ],
    cases: [
      { icon: Plus, label: "New Case", action: () => console.log("Create new case") },
      { icon: Filter, label: "Filter", action: () => console.log("Filter cases") },
      { icon: Eye, label: "Urgent", action: () => console.log("View urgent cases") }
    ],
    events: [
      { icon: Plus, label: "New Event", action: () => console.log("Create new event") },
      { icon: Filter, label: "Filter", action: () => console.log("Filter events") },
      { icon: Download, label: "Export", action: () => console.log("Export events") }
    ],
    finance: [
      { icon: Plus, label: "Add Payment", action: () => console.log("Add payment") },
      { icon: Filter, label: "Filter", action: () => console.log("Filter finances") },
      { icon: Download, label: "Export", action: () => console.log("Export financial data") }
    ],
    settings: [
      { icon: RefreshCw, label: "Reset", action: () => console.log("Reset settings") },
      { icon: Upload, label: "Import", action: () => console.log("Import settings") },
      { icon: Download, label: "Backup", action: () => console.log("Backup settings") }
    ]
  };

  return quickActionsMap[tabValue] || [];
};

// Enhanced navigation items with colors and badges
const getEnhancedNavigationItem = (item: NavigationItem, index: number) => {
  const colors = [
    {
      bg: "hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20",
      active: "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400",
      icon: "text-blue-300"
    },
    {
      bg: "hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-teal-500/20",
      active: "bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border-emerald-400",
      icon: "text-emerald-300"
    },
    {
      bg: "hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20",
      active: "bg-gradient-to-r from-orange-500/30 to-red-500/30 border-orange-400",
      icon: "text-orange-300"
    },
    {
      bg: "hover:bg-gradient-to-r hover:from-violet-500/20 hover:to-purple-500/20",
      active: "bg-gradient-to-r from-violet-500/30 to-purple-500/30 border-violet-400",
      icon: "text-violet-300"
    },
    {
      bg: "hover:bg-gradient-to-r hover:from-rose-500/20 hover:to-pink-500/20",
      active: "bg-gradient-to-r from-rose-500/30 to-pink-500/30 border-rose-400",
      icon: "text-rose-300"
    },
    {
      bg: "hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20",
      active: "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-400",
      icon: "text-cyan-300"
    },
    {
      bg: "hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-orange-500/20",
      active: "bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-yellow-400",
      icon: "text-yellow-300"
    },
    {
      bg: "hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20",
      active: "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border-indigo-400",
      icon: "text-indigo-300"
    }
  ];

  return {
    ...item,
    colorScheme: colors[index % colors.length]
  };
};

export function UnifiedPortalHeader({
  currentPage,
  title,
  subtitle,
  navigationItems
}: UnifiedPortalHeaderProps) {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const enhancedNavigationItems = navigationItems.map((item, index) =>
    getEnhancedNavigationItem(item, index)
  );

  const handleTabChange = (value: string) => {
    const item = enhancedNavigationItems.find(item => item.value === value);
    if (item) {
      setLocation(item.href);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-gradient-to-r from-egyptian-blue via-powder-blue to-egyptian-blue text-white shadow-2xl border-b border-white/10">
      {/* Main Header */}
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-white/50 to-white/20 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                Estate Agents Council
              </h1>
              <p className="text-white/90 text-sm md:text-base font-medium">
                of Zimbabwe
              </p>
            </div>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <UserProfileDropdown />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <UserProfileDropdown />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/10 transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Title - Shown when logo area is small */}
        <div className="sm:hidden mt-2">
          <h1 className="text-lg font-bold text-white">
            Estate Agents Council
          </h1>
          <p className="text-white/90 text-xs">of Zimbabwe</p>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <div className="hidden lg:block px-4 sm:px-6 pb-1">
        <Tabs value={currentPage} onValueChange={handleTabChange}>
          <TabsList className="h-18 w-full justify-start bg-transparent p-0 border-b border-white/10 rounded-none overflow-x-auto">
            {enhancedNavigationItems.map((item, index) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={`
                  relative h-16 px-4 lg:px-6 border-b-3 border-transparent text-slate-300
                  hover:text-slate-800 hover:bg-slate-200/90 transition-all duration-300 whitespace-nowrap
                  ${item.colorScheme.bg}
                  data-[state=active]:${getSolidActiveColor(index)}
                  data-[state=active]:text-white
                  data-[state=active]:shadow-lg
                  data-[state=active]:transform
                  data-[state=active]:scale-105
                  data-[state=active]:shadow-none
                `}
                data-testid={`tab-${item.value}`}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className={`w-4 h-4 transition-colors ${item.colorScheme.icon}`} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || "secondary"}
                      className="ml-2 px-2 py-0.5 text-xs h-5 bg-white/20 text-white border-white/30"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                {/* Active indicator */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 data-[state=active]:w-3/4"></div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="px-4 py-4 space-y-2">
            {enhancedNavigationItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleTabChange(item.value)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${currentPage === item.value
                    ? `${item.colorScheme.active} text-white shadow-lg`
                    : `text-blue-200 hover:text-white ${item.colorScheme.bg}`
                  }
                `}
                data-testid={`mobile-tab-${item.value}`}
              >
                <item.icon className={`w-5 h-5 ${item.colorScheme.icon}`} />
                <span className="font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <Badge
                    variant={item.badgeVariant || "secondary"}
                    className="px-2 py-0.5 text-xs h-5 bg-white/20 text-white border-white/30"
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}

            {/* Mobile Quick Actions */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 hover:text-blue-100 transition-all duration-200 flex-1"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 hover:text-blue-100 transition-all duration-200 relative flex-1"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  <Badge className="ml-2 h-4 w-4 p-0 text-xs bg-red-500 border-0">
                    3
                  </Badge>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}