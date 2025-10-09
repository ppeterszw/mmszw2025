import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/AdminHeader";
import { QuickActions } from "@/components/QuickActions";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Settings, User, Shield, Bell, Database, Mail, Key, Globe, Save, RefreshCw,
  Users, Building2, FileText, Download, Upload, Trash2, AlertTriangle,
  Calendar, DollarSign, UserPlus, Plus, Activity, BarChart3
} from "lucide-react";

interface SystemSettings {
  // Organization Settings
  organizationName: string;
  contactEmail: string;
  phone: string;
  website: string;

  // Business Settings
  membershipFee: number;
  applicationFee: number;
  renewalDeadline: number;
  cpdRequirement: number;

  // User Management Settings
  maxLoginAttempts: number;
  sessionTimeout: number;
  passwordMinLength: number;
  accountLockout: number;

  // Security Settings
  jwtExpiry: number;
  refreshTokenExpiry: number;
  apiRateLimit: number;

  // Email Settings
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;

  // Notification Preferences
  welcomeEmail: boolean;
  paymentReminder: boolean;
}

export default function AdminSettings() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // State for all settings
  const [settings, setSettings] = useState<SystemSettings>({
    organizationName: "",
    contactEmail: "",
    phone: "",
    website: "",
    membershipFee: 0,
    applicationFee: 0,
    renewalDeadline: 0,
    cpdRequirement: 0,
    maxLoginAttempts: 0,
    sessionTimeout: 0,
    passwordMinLength: 0,
    accountLockout: 0,
    jwtExpiry: 0,
    refreshTokenExpiry: 0,
    apiRateLimit: 0,
    smtpHost: "",
    smtpPort: 0,
    smtpUsername: "",
    welcomeEmail: false,
    paymentReminder: false
  });

  // Fetch settings from API
  const { data: fetchedSettings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/settings");
      return response as SystemSettings;
    }
  });

  // Update local state when data is fetched
  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    }
  }, [fetchedSettings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: SystemSettings) => {
      console.log("Saving settings:", Object.keys(updatedSettings).length, "fields");
      const response = await apiRequest("PUT", "/api/settings", updatedSettings);
      console.log("Save response:", response);
      return response;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });

      if (data.failed && data.failed > 0) {
        toast({
          title: "Partially Saved",
          description: `${data.saved} settings saved, ${data.failed} failed. Check console for details.`,
          variant: "destructive"
        });
        console.error("Failed settings:", data.failures);
      } else {
        toast({
          title: "Settings Saved",
          description: `Successfully saved ${data.count || data.saved} settings to the database.`
        });
      }
    },
    onError: (error: any) => {
      console.error("Settings save error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(settings);
  };

  const handleQuickAction = async (action: string) => {
    try {
      switch (action) {
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
        case 'backup':
          toast({
            title: "Database Backup",
            description: "Database backup functionality will be implemented soon."
          });
          break;
        case 'export-data':
          toast({
            title: "Data Export",
            description: "Data export functionality will be implemented soon."
          });
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
    }
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <QuickActions
              title="Quick Actions"
              description="Commonly used administrative actions"
              actions={[
                {
                  icon: UserPlus,
                  label: "Add Member",
                  action: () => handleQuickAction('add-member'),
                  color: "text-blue-600",
                  bg: "bg-blue-100",
                  testId: "quick-action-add-member"
                },
                {
                  icon: Building2,
                  label: "Add Organization",
                  action: () => handleQuickAction('add-organization'),
                  color: "text-emerald-600",
                  bg: "bg-emerald-100",
                  testId: "quick-action-add-organization"
                },
                {
                  icon: BarChart3,
                  label: "View Reports",
                  action: () => handleQuickAction('view-reports'),
                  color: "text-purple-600",
                  bg: "bg-purple-100",
                  testId: "quick-action-view-reports"
                },
                {
                  icon: Calendar,
                  label: "Manage Events",
                  action: () => handleQuickAction('manage-events'),
                  color: "text-amber-600",
                  bg: "bg-amber-100",
                  testId: "quick-action-manage-events"
                },
                {
                  icon: Database,
                  label: "Backup Database",
                  action: () => handleQuickAction('backup'),
                  color: "text-violet-600",
                  bg: "bg-violet-100",
                  testId: "quick-action-backup"
                },
                {
                  icon: Download,
                  label: "Export Data",
                  action: () => handleQuickAction('export-data'),
                  color: "text-cyan-600",
                  bg: "bg-cyan-100",
                  testId: "quick-action-export-data"
                }
              ]}
            />

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
                        <Input
                          id="organization-name"
                          value={settings.organizationName}
                          onChange={(e) => updateSetting('organizationName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => updateSetting('contactEmail', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={settings.phone}
                          onChange={(e) => updateSetting('phone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={settings.website}
                          onChange={(e) => updateSetting('website', e.target.value)}
                        />
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
                        <Input
                          id="membership-fee"
                          type="number"
                          value={settings.membershipFee}
                          onChange={(e) => updateSetting('membershipFee', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="application-fee">Application Fee (USD)</Label>
                        <Input
                          id="application-fee"
                          type="number"
                          value={settings.applicationFee}
                          onChange={(e) => updateSetting('applicationFee', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="renewal-deadline">Renewal Deadline (Days)</Label>
                        <Input
                          id="renewal-deadline"
                          type="number"
                          value={settings.renewalDeadline}
                          onChange={(e) => updateSetting('renewalDeadline', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpd-requirement">Required CPD Points</Label>
                        <Input
                          id="cpd-requirement"
                          type="number"
                          value={settings.cpdRequirement}
                          onChange={(e) => updateSetting('cpdRequirement', Number(e.target.value))}
                        />
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
                        <Input
                          id="max-login-attempts"
                          type="number"
                          value={settings.maxLoginAttempts}
                          onChange={(e) => updateSetting('maxLoginAttempts', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Session Timeout (Minutes)</Label>
                        <Input
                          id="session-timeout"
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) => updateSetting('sessionTimeout', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-min-length">Minimum Password Length</Label>
                        <Input
                          id="password-min-length"
                          type="number"
                          value={settings.passwordMinLength}
                          onChange={(e) => updateSetting('passwordMinLength', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-lockout">Account Lockout Duration (Minutes)</Label>
                        <Input
                          id="account-lockout"
                          type="number"
                          value={settings.accountLockout}
                          onChange={(e) => updateSetting('accountLockout', Number(e.target.value))}
                        />
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
                        <Input
                          id="jwt-expiry"
                          type="number"
                          value={settings.jwtExpiry}
                          onChange={(e) => updateSetting('jwtExpiry', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="refresh-token-expiry">Refresh Token Expiry (Days)</Label>
                        <Input
                          id="refresh-token-expiry"
                          type="number"
                          value={settings.refreshTokenExpiry}
                          onChange={(e) => updateSetting('refreshTokenExpiry', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="api-rate-limit">API Rate Limit (Requests/Hour)</Label>
                        <Input
                          id="api-rate-limit"
                          type="number"
                          value={settings.apiRateLimit}
                          onChange={(e) => updateSetting('apiRateLimit', Number(e.target.value))}
                        />
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
                        <Input
                          id="smtp-host"
                          value={settings.smtpHost}
                          onChange={(e) => updateSetting('smtpHost', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">SMTP Port</Label>
                        <Input
                          id="smtp-port"
                          type="number"
                          value={settings.smtpPort}
                          onChange={(e) => updateSetting('smtpPort', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-username">SMTP Username</Label>
                        <Input
                          id="smtp-username"
                          value={settings.smtpUsername}
                          onChange={(e) => updateSetting('smtpUsername', e.target.value)}
                        />
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
                        <select
                          id="welcome-email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={settings.welcomeEmail ? "true" : "false"}
                          onChange={(e) => updateSetting('welcomeEmail', e.target.value === "true")}
                        >
                          <option value="true">Enabled</option>
                          <option value="false">Disabled</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment-reminder">Payment Reminders</Label>
                        <select
                          id="payment-reminder"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={settings.paymentReminder ? "true" : "false"}
                          onChange={(e) => updateSetting('paymentReminder', e.target.value === "true")}
                        >
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
                        <Label>Server Status</Label>
                        <p className="text-sm text-green-600">Online</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveSettings}
                disabled={saveSettingsMutation.isPending}
                className="flex items-center gap-2"
              >
                {saveSettingsMutation.isPending ? (
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
