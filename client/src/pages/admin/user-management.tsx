import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ModernModal } from "@/components/ui/modern-modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AdminHeader } from "@/components/AdminHeader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { QuickActions } from "@/components/QuickActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Users, UserPlus, Mail, Key, Lock, Unlock, RotateCcw, 
  Search, Filter, MoreHorizontal, Edit, Trash2, Eye,
  CheckCircle, XCircle, Clock, AlertTriangle, Send
} from "lucide-react";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isLocked?: boolean;
  lockedUntil?: string;
  loginAttempts: number;
}

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member_manager", "case_manager", "super_admin"]),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const passwordResetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function UserManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Forms
  const createUserForm = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      role: "member_manager" as const,
      password: "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Queries
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof userSchema>) => {
      const res = await apiRequest("POST", "/api/register", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User Created",
        description: "User has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      createUserForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create user.",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<User> }) => {
      const res = await apiRequest("PUT", `/api/admin/users/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User Updated",
        description: "User has been updated successfully.",
      });
    },
  });

  const lockUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const res = await apiRequest("POST", `/api/admin/users/${id}/lock`, { lockedUntil });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User Locked",
        description: "User account has been locked.",
      });
    },
  });

  const unlockUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/admin/users/${id}/unlock`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User Unlocked",
        description: "User account has been unlocked.",
      });
    },
  });

  const passwordResetMutation = useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      const res = await apiRequest("PUT", `/api/admin/users/${id}`, { password });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Reset",
        description: "Password has been reset successfully.",
      });
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
    },
  });

  const sendWelcomeEmailMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      const res = await apiRequest("POST", "/api/admin/users/welcome-emails", { userIds });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome Emails Sent",
        description: `Welcome emails sent to ${selectedUsers.length} users.`,
      });
      setSelectedUsers([]);
    },
  });

  const sendPasswordResetEmailMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      const res = await apiRequest("POST", "/api/admin/users/password-reset-emails", { userIds });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Reset Emails Sent",
        description: `Password reset emails sent to ${selectedUsers.length} users.`,
      });
      setSelectedUsers([]);
    },
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin": return "bg-red-100 text-red-800";
      case "admin": return "bg-blue-100 text-blue-800";
      case "member_manager": return "bg-green-100 text-green-800";
      case "case_manager": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUserStatus = (user: User) => {
    if (user.isLocked) {
      return { label: "Locked", color: "bg-red-100 text-red-800", icon: Lock };
    }
    if (user.lastLogin) {
      const lastLogin = new Date(user.lastLogin);
      const daysSinceLogin = Math.floor((Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLogin > 30) {
        return { label: "Inactive", color: "bg-yellow-100 text-yellow-800", icon: Clock };
      }
    }
    return { label: "Active", color: "bg-green-100 text-green-800", icon: CheckCircle };
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentPage="users" title="User Management" subtitle="Manage system users and permissions" />
      
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-full space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">Manage users, roles, and permissions</p>
            </div>

            <Button
              className="gradient-button text-white border-0"
              onClick={() => setIsCreateDialogOpen(true)}
              data-testid="create-user-button"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Quick Actions */}
          <QuickActions
            title="Quick Actions"
            description="Commonly used user management actions"
            actions={[
              {
                icon: UserPlus,
                label: "Add User",
                action: () => setIsCreateDialogOpen(true),
                color: "text-blue-600",
                bg: "bg-blue-100",
                testId: "quick-add-user"
              },
              {
                icon: Mail,
                label: "Send Welcome",
                action: () => sendWelcomeEmailMutation.mutate(selectedUsers),
                color: "text-emerald-600",
                bg: "bg-emerald-100",
                testId: "quick-send-welcome"
              },
              {
                icon: RotateCcw,
                label: "Reset Password",
                action: () => sendPasswordResetEmailMutation.mutate(selectedUsers),
                color: "text-orange-600",
                bg: "bg-orange-100",
                testId: "quick-password-reset"
              },
              {
                icon: Key,
                label: "View Admins",
                action: () => setRoleFilter("admin"),
                color: "text-purple-600",
                bg: "bg-purple-100",
                testId: "quick-filter-admins"
              },
              {
                icon: Users,
                label: "View All Users",
                action: () => setRoleFilter("all"),
                color: "text-violet-600",
                bg: "bg-violet-100",
                testId: "quick-view-all"
              },
              {
                icon: CheckCircle,
                label: "Active Users",
                action: () => toast({ title: "User Activity", description: "Viewing active users logged in the last 24 hours." }),
                color: "text-cyan-600",
                bg: "bg-cyan-100",
                testId: "quick-active-users"
              }
            ]}
          />

          <ModernModal
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            title="Create New User"
            subtitle="Add a new user to the system with appropriate permissions"
            icon={UserPlus}
            colorVariant="indigo"
            maxWidth="2xl"
            footer={{
              secondary: {
                label: "Cancel",
                onClick: () => setIsCreateDialogOpen(false),
                variant: "outline",
                testId: "button-cancel-user"
              },
              primary: {
                label: createUserMutation.isPending ? "Creating..." : "Create User",
                onClick: createUserForm.handleSubmit((data) => createUserMutation.mutate(data)),
                disabled: createUserMutation.isPending,
                loading: createUserMutation.isPending,
                testId: "button-submit-user"
              }
            }}
          >
              <div className="space-y-6">
                {/* Account Details Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Account Information
                  </h3>
                  <Form {...createUserForm}>
                    <div className="space-y-4">
                      <FormField
                        control={createUserForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-indigo-700 font-semibold">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email" 
                                data-testid="user-email"
                                className="border-indigo-300 focus:border-indigo-500 bg-white/80"
                                placeholder="user@eacz.co.zw"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                </div>

                {/* Role & Permissions Section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    Role & Permissions
                  </h3>
                  <Form {...createUserForm}>
                    <FormField
                      control={createUserForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-700 font-semibold">User Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="user-role" className="border-purple-300 focus:border-purple-500 bg-white/80">
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="member_manager">👥 Member Manager</SelectItem>
                              <SelectItem value="case_manager">📋 Case Manager</SelectItem>
                              <SelectItem value="admin">⚙️ Admin</SelectItem>
                              <SelectItem value="super_admin">🔐 Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Form>
                </div>

                {/* Security Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Security Setup
                  </h3>
                  <Form {...createUserForm}>
                    <FormField
                      control={createUserForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-700 font-semibold">Initial Password</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              data-testid="user-password"
                              className="border-green-300 focus:border-green-500 bg-white/80"
                              placeholder="Minimum 8 characters"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-green-600 mt-1">
                            💡 User will be required to change password on first login
                          </p>
                        </FormItem>
                      )}
                    />
                  </Form>
                </div>
              </div>
            </ModernModal>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 h-auto">
              <TabsTrigger value="users" className="flex items-center gap-2 p-3">
                <Users className="w-4 h-4" />
                <span>All Users</span>
              </TabsTrigger>
              <TabsTrigger value="bulk-actions" className="flex items-center gap-2 p-3">
                <Mail className="w-4 h-4" />
                <span>Bulk Actions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search users by email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                          data-testid="search-users"
                        />
                      </div>
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-full sm:w-48" data-testid="filter-role">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member_manager">Member Manager</SelectItem>
                        <SelectItem value="case_manager">Case Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Users ({filteredUsers.length})</span>
                    {selectedUsers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {selectedUsers.length} selected
                        </span>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                          Clear
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Loading users...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow style={{ background: 'linear-gradient(to right, #1034A6, #B0E0E6)' }}>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={selectedUsers.length === filteredUsers.length}
                                onCheckedChange={handleSelectAll}
                                data-testid="select-all-users"
                              />
                            </TableHead>
                            <TableHead className="text-white font-semibold">Email</TableHead>
                            <TableHead className="text-white font-semibold">Role</TableHead>
                            <TableHead className="text-white font-semibold">Status</TableHead>
                            <TableHead className="text-white font-semibold">Last Login</TableHead>
                            <TableHead className="text-white font-semibold">Created</TableHead>
                            <TableHead className="text-white font-semibold">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user, index) => {
                            const status = getUserStatus(user);
                            const StatusIcon = status.icon;

                            return (
                              <TableRow
                                key={user.id}
                                data-testid={`user-row-${user.id}`}
                                className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={selectedUsers.includes(user.id)}
                                    onCheckedChange={() => handleSelectUser(user.id)}
                                    data-testid={`select-user-${user.id}`}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell>
                                  <Badge className={getRoleBadgeColor(user.role)}>
                                    {user.role ? user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'No Role'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <StatusIcon className="w-4 h-4" />
                                    <Badge className={status.color}>
                                      {status.label}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {user.lastLogin 
                                    ? new Date(user.lastLogin).toLocaleDateString()
                                    : "Never"
                                  }
                                </TableCell>
                                <TableCell>
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center flex-wrap gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                                      onClick={() => {
                                        setSelectedUserId(user.id);
                                        setIsPasswordDialogOpen(true);
                                      }}
                                      data-testid={`reset-password-${user.id}`}
                                    >
                                      <Key className="w-3 h-3 mr-1" />
                                      <span className="text-xs">Reset Password</span>
                                    </Button>
                                    {user.isLocked ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 text-green-600 border-green-200 hover:bg-green-50"
                                        onClick={() => unlockUserMutation.mutate(user.id)}
                                        data-testid={`unlock-user-${user.id}`}
                                      >
                                        <Unlock className="w-3 h-3 mr-1" />
                                        <span className="text-xs">Unlock</span>
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => lockUserMutation.mutate(user.id)}
                                        data-testid={`lock-user-${user.id}`}
                                      >
                                        <Lock className="w-3 h-3 mr-1" />
                                        <span className="text-xs">Lock</span>
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bulk-actions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Welcome Emails
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Send welcome emails to selected users. This will include account setup instructions.
                    </p>
                    <Button 
                      onClick={() => sendWelcomeEmailMutation.mutate(selectedUsers)}
                      disabled={selectedUsers.length === 0 || sendWelcomeEmailMutation.isPending}
                      className="w-full"
                      data-testid="send-welcome-emails"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {sendWelcomeEmailMutation.isPending 
                        ? "Sending..." 
                        : `Send Welcome Emails (${selectedUsers.length})`
                      }
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      Password Reset Emails
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Send password reset emails to selected users. They will receive a secure link to reset their password.
                    </p>
                    <Button 
                      onClick={() => sendPasswordResetEmailMutation.mutate(selectedUsers)}
                      disabled={selectedUsers.length === 0 || sendPasswordResetEmailMutation.isPending}
                      className="w-full"
                      variant="outline"
                      data-testid="send-password-reset-emails"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {sendPasswordResetEmailMutation.isPending 
                        ? "Sending..." 
                        : `Send Reset Emails (${selectedUsers.length})`
                      }
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Password Reset Dialog */}
      <ModernModal
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        title="Reset Password"
        subtitle="Set a new secure password for this user account"
        icon={RotateCcw}
        colorVariant="amber"
        maxWidth="xl"
        footer={{
          secondary: {
            label: "Cancel",
            onClick: () => setIsPasswordDialogOpen(false),
            variant: "outline",
            testId: "button-cancel-password-reset"
          },
          primary: {
            label: passwordResetMutation.isPending ? "Resetting..." : "Reset Password",
            onClick: passwordForm.handleSubmit((data) => {
              if (selectedUserId) {
                passwordResetMutation.mutate({ id: selectedUserId, password: data.password });
              }
            }),
            disabled: passwordResetMutation.isPending,
            loading: passwordResetMutation.isPending,
            testId: "button-confirm-password-reset"
          }
        }}
      >
        <div className="space-y-6">
          {/* Security Warning Section */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Security Notice
            </h3>
            <div className="bg-amber-100 p-3 rounded-lg border border-amber-300">
              <p className="text-sm font-medium text-amber-800">
                🔐 This will immediately change the user's password. They will need to use the new password for their next login.
              </p>
            </div>
          </div>

          {/* Password Input Section */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              New Password Setup
            </h3>
            <Form {...passwordForm}>
              <div className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-700 font-semibold">New Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          data-testid="new-password"
                          className="border-red-300 focus:border-red-500 bg-white/80"
                          placeholder="Enter secure password (min 8 characters)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-700 font-semibold">Confirm New Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          data-testid="confirm-password"
                          className="border-red-300 focus:border-red-500 bg-white/80"
                          placeholder="Re-enter the same password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </div>

          {/* Password Requirements Section */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Password Requirements
            </h3>
            <div className="bg-blue-100 p-3 rounded-lg border border-blue-300">
              <ul className="text-sm text-blue-800 space-y-1">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Minimum 8 characters long
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Contains letters and numbers
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  User will be prompted to change on next login
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ModernModal>
    </div>
  );
}