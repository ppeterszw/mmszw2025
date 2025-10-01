import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/AdminHeader";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Settings, User, Shield, Bell, Database, Mail, Key, Globe, Save, RefreshCw,
  Users, Building2, FileText, Download, Upload, Trash2, AlertTriangle, 
  Calendar, DollarSign, UserPlus, Plus, Activity, BarChart3
} from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Your changes have been successfully saved."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      switch (action) {
        case 'backup':
          toast({
            title: "Database Backup Complete",
            description: "Full database backup created successfully."
          });
          break;
        case 'cache':
          toast({
            title: "Cache Cleared",
            description: "System cache has been cleared successfully."
          });
          break;
        case 'api-keys':
          toast({
            title: "API Keys Regenerated",
            description: "New API keys have been generated and distributed."
          });
          break;
        case 'export-data':
          toast({
            title: "Data Export Started",
            description: "Export process initiated. Download will be ready soon."
          });
          break;
        case 'add-member':
          setLocation('/admin-dashboard/members');
          break;
        case 'add-organization':
          setLocation('/admin-dashboard/organizations');
          break;
        case 'view-reports':
          setLocation('/admin-dashboard/finance');
          break;
        case 'manage-events':
          setLocation('/event-management');
          break;
        default:
          toast({
            title: "Action Completed",
            description: `${action} completed successfully.`
          });
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to complete the action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <AdminHeader currentPage="settings" title="EACZ Admin Settings" subtitle="Manage system configuration and preferences" />
        
        <div className="flex-1 p-4 lg:p-6">
          <div className="max-w-full space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">System Settings</h1>
              <p className="text-muted-foreground">Configure system settings, user preferences, and security options</p>
            </div>

            {/* Quick Actions Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
                  <p className="text-sm text-muted-foreground mt-1">Commonly used administrative actions</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button
                  onClick={() => handleQuickAction('add-member')}
                  disabled={loading}
                  className="group relative h-32 rounded-3xl bg-gradient-to-br from-blue-400 via-blue-300 to-sky-300 hover:from-blue-500 hover:via-blue-400 hover:to-sky-400 border-0 shadow-lg hover:shadow-xl hover:shadow-blue-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
                  data-testid="quick-action-add-member"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent" />
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Add Member</span>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
                </Button>

                <Button
                  onClick={() => handleQuickAction('add-organization')}
                  disabled={loading}
                  className="group relative h-32 rounded-3xl bg-gradient-to-br from-emerald-400 via-emerald-300 to-teal-300 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 border-0 shadow-lg hover:shadow-xl hover:shadow-emerald-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
                  data-testid="quick-action-add-organization"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/10 to-transparent" />
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Building2 className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Add Organization</span>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
                </Button>

                <Button
                  onClick={() => handleQuickAction('view-reports')}
                  disabled={loading}
                  className="group relative h-32 rounded-3xl bg-gradient-to-br from-purple-400 via-purple-300 to-pink-300 hover:from-purple-500 hover:via-purple-400 hover:to-pink-400 border-0 shadow-lg hover:shadow-xl hover:shadow-purple-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
                  data-testid="quick-action-view-reports"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent" />
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">View Reports</span>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
                </Button>

                <Button
                  onClick={() => handleQuickAction('manage-events')}
                  disabled={loading}
                  className="group relative h-32 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-300 hover:from-amber-500 hover:via-orange-400 hover:to-yellow-400 border-0 shadow-lg hover:shadow-xl hover:shadow-amber-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
                  data-testid="quick-action-manage-events"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 to-transparent" />
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Manage Events</span>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
                </Button>

                <Button
                  onClick={() => handleQuickAction('backup')}
                  disabled={loading}
                  className="group relative h-32 rounded-3xl bg-gradient-to-br from-violet-400 via-violet-300 to-fuchsia-300 hover:from-violet-500 hover:via-violet-400 hover:to-fuchsia-400 border-0 shadow-lg hover:shadow-xl hover:shadow-violet-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
                  data-testid="quick-action-backup"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-600/10 to-transparent" />
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Database className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Backup Database</span>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
                </Button>

                <Button
                  onClick={() => handleQuickAction('export-data')}
                  disabled={loading}
                  className="group relative h-32 rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-300 to-blue-300 hover:from-cyan-500 hover:via-sky-400 hover:to-blue-400 border-0 shadow-lg hover:shadow-xl hover:shadow-cyan-300/40 transition-all duration-300 ease-out hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white overflow-hidden"
                  data-testid="quick-action-export-data"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/10 to-transparent" />
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Download className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="relative z-10 text-sm font-semibold text-center leading-tight tracking-wide drop-shadow-sm">Export Data</span>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto">
                <TabsTrigger value="general" className="flex items-center gap-2 p-3">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2 p-3">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2 p-3">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2 p-3">
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2 p-3">
                  <Database className="w-4 h-4" />
                  <span className="hidden sm:inline">System</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Organization Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="organization-name">Organization Name</Label>
                        <Input id="organization-name" defaultValue="Estate Agents Council of Zimbabwe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input id="contact-email" type="email" defaultValue="admin@eacz.org" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+263 4 123456" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" defaultValue="https://eacz.org" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="membership-fee">Annual Membership Fee (USD)</Label>
                        <Input id="membership-fee" type="number" defaultValue="500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="application-fee">Application Fee (USD)</Label>
                        <Input id="application-fee" type="number" defaultValue="100" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="renewal-deadline">Renewal Deadline (Days)</Label>
                        <Input id="renewal-deadline" type="number" defaultValue="30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpd-requirement">Required CPD Points</Label>
                        <Input id="cpd-requirement" type="number" defaultValue="20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      User Management Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                        <Input id="max-login-attempts" type="number" defaultValue="3" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Session Timeout (Minutes)</Label>
                        <Input id="session-timeout" type="number" defaultValue="60" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-min-length">Minimum Password Length</Label>
                        <Input id="password-min-length" type="number" defaultValue="8" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-lockout">Account Lockout Duration (Minutes)</Label>
                        <Input id="account-lockout" type="number" defaultValue="15" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jwt-expiry">JWT Token Expiry (Hours)</Label>
                        <Input id="jwt-expiry" type="number" defaultValue="24" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="refresh-token-expiry">Refresh Token Expiry (Days)</Label>
                        <Input id="refresh-token-expiry" type="number" defaultValue="7" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="encryption-key">Encryption Key</Label>
                        <Input id="encryption-key" type="password" defaultValue="••••••••••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="api-rate-limit">API Rate Limit (Requests/Hour)</Label>
                        <Input id="api-rate-limit" type="number" defaultValue="1000" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Email Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">SMTP Host</Label>
                        <Input id="smtp-host" defaultValue="smtp.gmail.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">SMTP Port</Label>
                        <Input id="smtp-port" type="number" defaultValue="587" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-username">SMTP Username</Label>
                        <Input id="smtp-username" defaultValue="noreply@eacz.org" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-password">SMTP Password</Label>
                        <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="welcome-email">Send Welcome Email</Label>
                        <select id="welcome-email" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option value="true">Enabled</option>
                          <option value="false">Disabled</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment-reminder">Payment Reminders</Label>
                        <select id="payment-reminder" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option value="true">Enabled</option>
                          <option value="false">Disabled</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      System Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>System Version</Label>
                        <p className="text-sm text-gray-600">v2.1.0</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Database Version</Label>
                        <p className="text-sm text-gray-600">PostgreSQL 14.2</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Last Backup</Label>
                        <p className="text-sm text-gray-600">2024-01-15 14:30:00</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Server Status</Label>
                        <p className="text-sm text-green-600">Online</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => handleQuickAction('backup')}
                        disabled={loading}
                        data-testid="system-backup-database"
                      >
                        <Database className="w-4 h-4" />
                        Backup Database
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => handleQuickAction('cache')}
                        disabled={loading}
                        data-testid="system-clear-cache"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Clear Cache
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => handleQuickAction('api-keys')}
                        disabled={loading}
                        data-testid="system-regenerate-api-keys"
                      >
                        <Key className="w-4 h-4" />
                        Regenerate API Keys
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSettings} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}