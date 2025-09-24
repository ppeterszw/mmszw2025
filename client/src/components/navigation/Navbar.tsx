import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, User } from "lucide-react";
import logoUrl from "@assets/eaclogo_1756763778691.png";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export function Navbar({ title = "EACZ Portal", subtitle }: NavbarProps) {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [notifications] = useState(3); // This would come from a notifications query

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation("/auth");
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getRoleDisplay = () => {
    if (!user?.role) return "User";
    return user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side - Title */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-1">
            <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-card-foreground" data-testid="navbar-title">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground" data-testid="navbar-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side - User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                data-testid="notification-count"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2" data-testid="user-menu-trigger">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-egyptian-blue text-white text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-card-foreground" data-testid="user-email">
                    {user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid="user-role">
                    {getRoleDisplay()}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => setLocation("/member-portal/profile")}
                data-testid="menu-profile"
              >
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => setLocation("/admin-dashboard/settings")}
                data-testid="menu-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
                data-testid="menu-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
