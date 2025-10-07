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
    <div className="bg-gradient-to-r from-egyptian-blue via-powder-blue to-egyptian-blue text-white shadow-lg">
      {/* Main Header */}
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Estate Agents Council
              </h1>
              <p className="text-white/90 text-xs md:text-sm font-medium">
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
          <h1 className="text-base font-bold text-white">
            Estate Agents Council
          </h1>
          <p className="text-white/90 text-xs">of Zimbabwe</p>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <div className="hidden lg:block px-4 sm:px-6">
        <Tabs value={currentPage} onValueChange={handleTabChange}>
          <TabsList className="h-auto w-full justify-start bg-transparent p-0 gap-1 rounded-none overflow-x-auto scrollbar-hide">
            {enhancedNavigationItems.map((item, index) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={`
                  relative h-12 px-4 lg:px-5 rounded-t-lg border-0 text-white/70 font-semibold text-sm
                  hover:text-white hover:bg-white/10 transition-all duration-300 whitespace-nowrap
                  data-[state=active]:bg-white data-[state=active]:text-gray-800
                  data-[state=active]:shadow-md
                  backdrop-blur-sm
                `}
                data-testid={`tab-${item.value}`}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || "secondary"}
                      className={`ml-1 px-2 py-0.5 text-xs h-5 font-bold ${
                        currentPage === item.value
                          ? 'bg-gray-100 text-gray-700 border-gray-300'
                          : 'bg-white/20 text-white border-white/30'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/5 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {enhancedNavigationItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleTabChange(item.value)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${currentPage === item.value
                    ? 'bg-white text-gray-800 shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }
                `}
                data-testid={`mobile-tab-${item.value}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold flex-1">{item.label}</span>
                {item.badge && (
                  <Badge
                    variant={item.badgeVariant || "secondary"}
                    className={`px-2 py-0.5 text-xs h-5 font-bold ${
                      currentPage === item.value
                        ? 'bg-gray-100 text-gray-700 border-gray-300'
                        : 'bg-white/20 text-white border-white/30'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}