import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/AdminHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import {
  User, Mail, Phone, MapPin, Calendar, Shield, Lock, Bell, Monitor,
  Edit, Save, Camera, Upload, CheckCircle, AlertTriangle, Clock,
  Activity, FileText, Settings, Eye, EyeOff, Smartphone, Globe,
  Briefcase, Building2, Key, LogOut, RefreshCw, Trash2
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import type { User as UserType, UserSession, AuditLog } from "@shared/schema";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";
import { Separator } from "@/components/ui/separator";

// Form Schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  notes: z.string().optional(),
});

const preferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  inAppNotifications: z.boolean().default(true),
  dashboardView: z.string().default("default"),
  timezone: z.string().default("Africa/Harare"),
  language: z.string().default("en"),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type PreferencesData = z.infer<typeof preferencesSchema>;

export default function UserProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);

  // Fetch user profile data
  const { data: profile, isLoading } = useQuery<UserType>({
    queryKey: ["/api/user/profile"],
    enabled: !!user,
  });

  // Fetch user sessions
  const { data: sessions } = useQuery<UserSession[]>({
    queryKey: ["/api/user/sessions"],
    enabled: !!user,
  });

  // Fetch recent activity
  const { data: recentActivity } = useQuery<AuditLog[]>({
    queryKey: ["/api/user/activity"],
    enabled: !!user,
  });

  const personalForm = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      department: profile?.department || "",
      jobTitle: profile?.jobTitle || "",
      notes: profile?.notes || "",
    },
  });

  const preferencesForm = useForm<PreferencesData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      inAppNotifications: true,
      dashboardView: "default",
      timezone: "Africa/Harare",
      language: "en",
    },
  });

  const updatePersonalMutation = useMutation({
    mutationFn: async (data: PersonalInfoData) => {
      const response = await apiRequest("PUT", "/api/user/profile", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully."
      });
      setIsEditingPersonal(false);
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: PreferencesData) => {
      const response = await apiRequest("PUT", "/api/user/preferences", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Preferences updated successfully."
      });
      setIsEditingPreferences(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update preferences.",
        variant: "destructive"
      });
    }
  });

  const terminateSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      await apiRequest("DELETE", `/api/user/sessions/${sessionId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Session terminated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/sessions"] });
    },
  });

  const onPersonalSubmit = (data: PersonalInfoData) => {
    updatePersonalMutation.mutate(data);
  };

  const onPreferencesSubmit = (data: PreferencesData) => {
    updatePreferencesMutation.mutate(data);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle avatar upload logic here
      toast({
        title: "Upload Started",
        description: "Profile picture upload functionality coming soon."
      });
    }
  };

  if (!user) {
    setLocation("/auth");
    return null;
  }

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "super_admin": return "bg-red-100 text-red-800 border-red-200";
      case "admin": return "bg-purple-100 text-purple-800 border-purple-200";
      case "member_manager": return "bg-blue-100 text-blue-800 border-blue-200";
      case "case_manager": return "bg-orange-100 text-orange-800 border-orange-200";
      case "accountant": return "bg-green-100 text-green-800 border-green-200";
      case "staff": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "inactive": return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspended": return "bg-red-100 text-red-800 border-red-200";
      case "locked": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentPage="profile" title="My Profile" subtitle="Manage your account settings and preferences" />

      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>

                  {/* User Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-slate-600">{user.jobTitle || user.role?.replace(/_/g, " ").toUpperCase()}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role?.replace(/_/g, " ").toUpperCase()}
                      </Badge>
                      <Badge className={getStatusBadgeColor(user.status)}>
                        {user.status?.toUpperCase()}
                      </Badge>
                      {user.emailVerified && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-700">
                      {profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleDateString() : "N/A"}
                    </div>
                    <div className="text-xs text-slate-600 uppercase">Last Login</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-700">
                      {sessions?.length || 0}
                    </div>
                    <div className="text-xs text-slate-600 uppercase">Active Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-700">
                      {profile?.loginAttempts || 0}
                    </div>
                    <div className="text-xs text-slate-600 uppercase">Login Attempts</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white border border-slate-200 rounded-xl p-1 grid w-full grid-cols-5 shadow-sm">
              <TabsTrigger value="personal" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="professional" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Briefcase className="w-4 h-4 mr-2" />
                Professional
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Activity className="w-4 h-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-900">Personal Information</h3>
                <Button
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                  variant={isEditingPersonal ? "outline" : "default"}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditingPersonal ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              <Form {...personalForm}>
                <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={personalForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditingPersonal}
                                  className={!isEditingPersonal ? "bg-slate-50" : ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditingPersonal}
                                  className={!isEditingPersonal ? "bg-slate-50" : ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  disabled={!isEditingPersonal}
                                  className={!isEditingPersonal ? "bg-slate-50" : ""}
                                />
                              </FormControl>
                              <FormDescription>
                                {user.emailVerified ? (
                                  <span className="text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Verified
                                  </span>
                                ) : (
                                  <span className="text-orange-600">Not verified</span>
                                )}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditingPersonal}
                                  className={!isEditingPersonal ? "bg-slate-50" : ""}
                                  placeholder="+263..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Work Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={personalForm.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <Select
                                disabled={!isEditingPersonal}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className={!isEditingPersonal ? "bg-slate-50" : ""}>
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="administration">Administration</SelectItem>
                                  <SelectItem value="finance">Finance</SelectItem>
                                  <SelectItem value="legal">Legal</SelectItem>
                                  <SelectItem value="operations">Operations</SelectItem>
                                  <SelectItem value="hr">Human Resources</SelectItem>
                                  <SelectItem value="it">Information Technology</SelectItem>
                                  <SelectItem value="member_services">Member Services</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalForm.control}
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditingPersonal}
                                  className={!isEditingPersonal ? "bg-slate-50" : ""}
                                  placeholder="e.g., Senior Case Manager"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={personalForm.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio / Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                disabled={!isEditingPersonal}
                                className={!isEditingPersonal ? "bg-slate-50" : ""}
                                rows={4}
                                placeholder="Add a brief bio or notes about yourself..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isEditingPersonal && (
                        <Button
                          type="submit"
                          className="w-full md:w-auto"
                          disabled={updatePersonalMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {updatePersonalMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </TabsContent>

            {/* Professional Details Tab */}
            <TabsContent value="professional" className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900">Professional Details</h3>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-600">User ID</Label>
                      <div className="p-2 border rounded bg-slate-50 font-mono text-sm">
                        {user.id}
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-600">User Role</Label>
                      <div className="p-2 border rounded bg-slate-50">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role?.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-600">Account Status</Label>
                      <div className="p-2 border rounded bg-slate-50">
                        <Badge className={getStatusBadgeColor(user.status)}>
                          {user.status?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-600">Member Since</Label>
                      <div className="p-2 border rounded bg-slate-50">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-600">Last Password Change</Label>
                      <div className="p-2 border rounded bg-slate-50">
                        {profile?.passwordChangedAt
                          ? new Date(profile.passwordChangedAt).toLocaleDateString()
                          : "Never"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-600">Two-Factor Auth</Label>
                      <div className="p-2 border rounded bg-slate-50">
                        <Badge className={user.twoFactorEnabled ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                          {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Permissions</CardTitle>
                  <CardDescription>Your assigned system permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions ? (
                      JSON.parse(user.permissions as string).map((permission: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">No specific permissions assigned. Using role-based permissions.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900">Security & Privacy</h3>

              {/* Password Change */}
              <PasswordChangeForm />

              {/* Active Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Monitor className="w-5 h-5 mr-2" />
                      Active Sessions
                    </span>
                    <Badge variant="secondary">{sessions?.length || 0} Active</Badge>
                  </CardTitle>
                  <CardDescription>Manage your active login sessions across devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sessions && sessions.length > 0 ? (
                      sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Monitor className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">
                                {session.deviceType || "Unknown Device"}
                              </div>
                              <div className="text-sm text-slate-600">
                                {session.ipAddress} • {session.location || "Unknown Location"}
                              </div>
                              <div className="text-xs text-slate-500">
                                Last active: {session.lastActivity ? new Date(session.lastActivity).toLocaleString() : "N/A"}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => terminateSessionMutation.mutate(session.id)}
                          >
                            <LogOut className="w-4 h-4 mr-1" />
                            Terminate
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm text-center py-4">No active sessions found</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <span className="text-sm">Email Verification</span>
                    </div>
                    <Badge className={user.emailVerified ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                      {user.emailVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-slate-600" />
                      <span className="text-sm">Two-Factor Authentication</span>
                    </div>
                    <Badge className={user.twoFactorEnabled ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                      {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-slate-600" />
                      <span className="text-sm">Failed Login Attempts</span>
                    </div>
                    <Badge variant="outline">{user.loginAttempts || 0}</Badge>
                  </div>
                  {user.lockedUntil && new Date(user.lockedUntil) > new Date() && (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-900">Account Locked Until</span>
                      </div>
                      <span className="text-sm text-red-700">
                        {new Date(user.lockedUntil).toLocaleString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Tips */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Security Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                      <span>Use a strong, unique password with at least 12 characters</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                      <span>Enable two-factor authentication for extra security</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                      <span>Review active sessions regularly and terminate suspicious ones</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                      <span>Never share your login credentials with anyone</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                      <span>Always log out when using shared or public devices</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-900">Preferences & Settings</h3>
                <Button
                  onClick={() => setIsEditingPreferences(!isEditingPreferences)}
                  variant={isEditingPreferences ? "outline" : "default"}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditingPreferences ? "Cancel" : "Edit Preferences"}
                </Button>
              </div>

              <Form {...preferencesForm}>
                <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bell className="w-5 h-5 mr-2" />
                        Notification Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={preferencesForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!isEditingPreferences}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={preferencesForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">SMS Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications via SMS
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!isEditingPreferences}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={preferencesForm.control}
                        name="inAppNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">In-App Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications within the application
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!isEditingPreferences}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Application Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={preferencesForm.control}
                        name="dashboardView"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dashboard Default View</FormLabel>
                            <Select
                              disabled={!isEditingPreferences}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={!isEditingPreferences ? "bg-slate-50" : ""}>
                                  <SelectValue placeholder="Select default view" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="default">Default Dashboard</SelectItem>
                                <SelectItem value="analytics">Analytics View</SelectItem>
                                <SelectItem value="list">List View</SelectItem>
                                <SelectItem value="compact">Compact View</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferencesForm.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <Select
                              disabled={!isEditingPreferences}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={!isEditingPreferences ? "bg-slate-50" : ""}>
                                  <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Africa/Harare">Africa/Harare (CAT)</SelectItem>
                                <SelectItem value="Africa/Johannesburg">Africa/Johannesburg (SAST)</SelectItem>
                                <SelectItem value="UTC">UTC</SelectItem>
                                <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                                <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferencesForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select
                              disabled={!isEditingPreferences}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={!isEditingPreferences ? "bg-slate-50" : ""}>
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="sn">Shona</SelectItem>
                                <SelectItem value="nd">Ndebele</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isEditingPreferences && (
                        <Button
                          type="submit"
                          className="w-full md:w-auto"
                          disabled={updatePreferencesMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {updatePreferencesMutation.isPending ? "Saving..." : "Save Preferences"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900">Recent Activity</h3>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Activity Log
                  </CardTitle>
                  <CardDescription>Your recent actions and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity && recentActivity.length > 0 ? (
                      recentActivity.slice(0, 10).map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Activity className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-slate-900">{activity.action}</p>
                              <span className="text-xs text-slate-500">
                                {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : "N/A"}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{activity.description}</p>
                            {activity.ipAddress && (
                              <p className="text-xs text-slate-500 mt-1">IP: {activity.ipAddress}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No recent activity found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
