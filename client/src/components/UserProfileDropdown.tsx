import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  User, Settings, Lock, LogOut, Mail,
  ChevronDown, Save, Eye, EyeOff, UserCircle
} from "lucide-react";
import { useLocation } from "wouter";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function UserProfileDropdown() {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await apiRequest("PUT", "/api/user/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsProfileDialogOpen(false);
      console.log("About to show toast notification");
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated. A confirmation email has been sent.",
      });
      console.log("Toast notification called");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      const res = await apiRequest("PUT", "/api/user/password", data);
      return await res.json();
    },
    onSuccess: () => {
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
      toast({
        title: "Password Changed",
        description: "Your password has been successfully changed. A confirmation email has been sent.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation("/auth");
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || user?.email?.split('@')[0] || 'User';
  };

  const getRoleDisplay = () => {
    if (!user?.role) return "User";
    return user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-3 h-auto p-2 text-white hover:bg-white/20"
            data-testid="user-profile-dropdown"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-white/20 text-white text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium text-white">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-blue-100">{getRoleDisplay()}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-blue-100" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setLocation("/admin-dashboard/profile")}
            data-testid="view-full-profile-item"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            View Full Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsProfileDialogOpen(true)}
            data-testid="edit-profile-item"
          >
            <User className="mr-2 h-4 w-4" />
            Quick Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsPasswordDialogOpen(true)}
            data-testid="change-password-item"
          >
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 focus:text-red-600"
            disabled={logoutMutation.isPending}
            data-testid="logout-item"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Edit Profile</span>
            </DialogTitle>
          </DialogHeader>
          <Form {...profileForm}>
            <form 
              onSubmit={profileForm.handleSubmit((data) => updateProfileMutation.mutate(data))} 
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-last-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsProfileDialogOpen(false)}
                  data-testid="cancel-profile-button"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  data-testid="save-profile-button"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Change Password</span>
            </DialogTitle>
          </DialogHeader>
          <Form {...passwordForm}>
            <form 
              onSubmit={passwordForm.handleSubmit((data) => changePasswordMutation.mutate(data))} 
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showCurrentPassword ? "text" : "password"} 
                          {...field} 
                          data-testid="input-current-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showNewPassword ? "text" : "password"} 
                          {...field} 
                          data-testid="input-new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
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
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          {...field} 
                          data-testid="input-confirm-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsPasswordDialogOpen(false)}
                  data-testid="cancel-password-button"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={changePasswordMutation.isPending}
                  data-testid="change-password-button"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}