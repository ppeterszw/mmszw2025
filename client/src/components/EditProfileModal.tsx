import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ModernModal } from "@/components/ui/modern-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User, Mail, Phone, Building2, MapPin, Calendar,
  Shield, Edit, Camera, X, FileText, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onSuccess?: () => void;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  notes: string;
  profileImageUrl: string;
}

export function EditProfileModal({ open, onOpenChange, user, onSuccess }: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    jobTitle: "",
    notes: "",
    profileImageUrl: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        jobTitle: user.jobTitle || "",
        notes: user.notes || "",
        profileImageUrl: user.profileImageUrl || ""
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiRequest("PUT", `/api/user/${user.id}`, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      if (onSuccess) onSuccess();
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // For demo purposes, we'll create a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setFormData(prev => ({ ...prev, profileImageUrl: dataUrl }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name and last name are required.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      super_admin: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      admin: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
      member_manager: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
      case_manager: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
      staff: "bg-gradient-to-r from-gray-500 to-slate-500 text-white",
      accountant: "bg-gradient-to-r from-yellow-500 to-amber-500 text-white",
      reviewer: "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
    };
    return colors[role as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const departments = [
    "IT Administration",
    "Member Services",
    "Case Management",
    "Finance & Accounting",
    "Human Resources",
    "Legal Affairs",
    "Communications",
    "Operations"
  ];

  return (
    <ModernModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Profile"
      subtitle="Update your personal information and preferences"
      icon={User}
      colorVariant="emerald"
      maxWidth="4xl"
      footer={{
        secondary: {
          label: "Cancel",
          onClick: () => onOpenChange(false),
          disabled: updateProfileMutation.isPending
        },
        primary: {
          label: updateProfileMutation.isPending ? "Saving..." : "Save Changes",
          onClick: handleSave,
          disabled: updateProfileMutation.isPending,
          loading: updateProfileMutation.isPending
        }
      }}
    >
      <div className="space-y-8">
        {/* Profile Image Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Profile Picture
          </h3>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={formData.profileImageUrl} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl font-bold">
                  {getInitials(formData.firstName, formData.lastName)}
                </AvatarFallback>
              </Avatar>

              <label htmlFor="profile-image" className="absolute -bottom-2 -right-2 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-xl font-bold text-emerald-800">
                  {formData.firstName} {formData.lastName}
                </h4>
                <Badge className={getRoleColor(user?.role)}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <p className="text-emerald-600 text-sm mb-3">
                Upload a new profile picture. Supported formats: JPG, PNG, GIF (max 5MB)
              </p>
              {isUploading && (
                <div className="text-sm text-emerald-600">Uploading...</div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-blue-700 font-medium">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-blue-700 font-medium">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                placeholder="Enter your last name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-700 font-medium">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-blue-700 font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                  placeholder="+263 123 456 789"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-6 flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Professional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-purple-700 font-medium">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-200"
                placeholder="Enter your job title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-purple-700 font-medium">
                Department
              </Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-200">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-800 mb-6 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-amber-200">
                <span className="text-amber-700 font-medium">Account Status</span>
                <Badge className="bg-green-500 text-white">
                  {user?.status?.toUpperCase() || 'ACTIVE'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-amber-200">
                <span className="text-amber-700 font-medium">Member Since</span>
                <span className="text-amber-600 font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-amber-200">
                <span className="text-amber-700 font-medium">Email Verified</span>
                <Badge className={user?.emailVerified ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                  {user?.emailVerified ? 'VERIFIED' : 'PENDING'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-amber-200">
                <span className="text-amber-700 font-medium">2FA Enabled</span>
                <Badge className={user?.twoFactorEnabled ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                  {user?.twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
          <h3 className="text-lg font-semibold text-teal-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Additional Notes
          </h3>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-teal-700 font-medium">
              Personal Notes or Bio
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="border-teal-200 focus:border-teal-400 focus:ring-teal-200 min-h-[100px]"
              placeholder="Add any additional information about yourself, your role, or preferences..."
            />
            <p className="text-teal-600 text-sm">
              This information will be visible to other team members and can help with collaboration.
            </p>
          </div>
        </div>
      </div>
    </ModernModal>
  );
}