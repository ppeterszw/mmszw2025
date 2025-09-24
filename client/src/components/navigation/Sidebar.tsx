import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, LogOut } from "lucide-react";
import logoUrl from "@assets/eaclogo_1756763778691.png";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  children?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
}

interface SidebarProps {
  items: SidebarItem[];
  title: string;
  subtitle: string;
}

export function Sidebar({ items, title, subtitle }: SidebarProps) {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation("/auth");
  };

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
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
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-sidebar-border">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center mr-3 p-1">
            <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground" data-testid="sidebar-title">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground" data-testid="sidebar-subtitle">
              {subtitle}
            </p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {items.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <Collapsible 
                  open={expandedItems.has(item.label)}
                  onOpenChange={() => toggleExpanded(item.label)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between text-sm font-medium",
                        item.active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
                      )}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 mt-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.label}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sm pl-12",
                          child.active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
                        )}
                        onClick={() => setLocation(child.href)}
                        data-testid={`nav-child-${child.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {child.label}
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm font-medium",
                    item.active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
                  )}
                  onClick={() => setLocation(item.href)}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              )}
            </div>
          ))}
        </nav>
        
        {/* User Menu */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center">
            <Avatar className="w-8 h-8 mr-3">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground" data-testid="sidebar-user-email">
                {user?.email}
              </p>
              <p className="text-xs text-muted-foreground" data-testid="sidebar-user-role">
                {getRoleDisplay()}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-sidebar-foreground"
              data-testid="button-sidebar-logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
