import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { UserProfileDropdown } from "./UserProfileDropdown";
import logoUrl from "@assets/eaclogo_1756763778691.png";

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  value: string;
}

interface UnifiedPortalHeaderProps {
  currentPage: string;
  title: string;
  subtitle: string;
  navigationItems: NavigationItem[];
}

export function UnifiedPortalHeader({ 
  currentPage, 
  title, 
  subtitle, 
  navigationItems 
}: UnifiedPortalHeaderProps) {
  const [, setLocation] = useLocation();

  const handleTabChange = (value: string) => {
    const item = navigationItems.find(item => item.value === value);
    if (item) {
      setLocation(item.href);
    }
  };


  return (
    <div className="gradient-bg text-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 p-2">
              <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{title}</h1>
              <p className="text-blue-100 text-sm">{subtitle}</p>
            </div>
          </div>

          {/* User Profile Dropdown */}
          <UserProfileDropdown />
        </div>
      </div>

      {/* Horizontal Navigation Tabs */}
      <div className="px-6 pb-2">
        <Tabs value={currentPage} onValueChange={handleTabChange}>
          <TabsList className="h-12 w-full justify-start bg-transparent p-0 border-b border-white/20 rounded-none">
            {navigationItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="h-12 px-6 rounded-none border-b-2 border-transparent text-blue-100 hover:text-white hover:bg-white/10 data-[state=active]:border-white data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none"
                data-testid={`tab-${item.value}`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}