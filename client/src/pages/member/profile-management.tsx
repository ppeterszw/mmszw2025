import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { MemberHeader } from "@/components/MemberHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Edit, Save, Building2, FileText, 
  Camera, Upload, AlertTriangle, CreditCard, Lock, Eye, EyeOff,
  Badge, Award, CheckCircle, Clock, Star, Shield, GraduationCap
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Member, Organization, Document, Payment, CpdActivity } from "@shared/schema";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";
import { BadgeGrid, BadgeShowcase } from "@/components/badges/BadgeDisplay";
import { ProfileProgress } from "@/components/badges/ProfileProgress";
import { BadgeService, defaultAchievementBadges } from "@/services/badgeService";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters").optional().or(z.literal("")),
  dateOfBirth: z.string().optional(),
  nationalId: z.string().min(8, "National ID must be at least 8 characters").optional().or(z.literal("")),
  emergencyContactName: z.string().min(2, "Emergency contact name must be at least 2 characters").optional().or(z.literal("")),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone must be at least 10 digits").optional().or(z.literal("")),
  emergencyContactRelation: z.string().optional(),
});

const professionalSchema = z.object({
  educationLevel: z.string().optional(),
  yearsOfExperience: z.number().min(0, "Years of experience must be 0 or more").optional(),
  currentEmployer: z.string().optional(),
  jobTitle: z.string().optional(),
  specializations: z.string().optional(),
  certifications: z.string().optional(),
  previousEmployment: z.string().optional(),
});

type ProfileData = z.infer<typeof profileSchema>;
type ProfessionalData = z.infer<typeof professionalSchema>;

export default function ProfileManagement() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Mock member data for now since API is having issues
  const mockMember: Member = {
    id: "member-profile-test-id",
    userId: "member-test-user-id",
    membershipNumber: "EACZ2024001",
    firstName: "John",
    lastName: "Doe",
    email: "member@eacz.org",
    phone: "+263712345678",
    dateOfBirth: new Date("1985-06-15"),
    nationalId: "ID123456789",
    memberType: "principal_real_estate_agent",
    membershipStatus: "active",
    joiningDate: new Date("2024-01-01"),
    expiryDate: new Date("2025-01-01"),
    cpdPoints: 35,
    annualFee: "500.00",
    isMatureEntry: false,
    organizationId: "org-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date()
  };

  // Mock documents data
  const mockDocuments: Document[] = [
    {
      id: "doc-1",
      memberId: "member-profile-test-id",
      organizationId: null,
      applicationId: null,
      documentType: "qualification_certificate",
      fileName: "degree.pdf",
      filePath: "/documents/degree.pdf",
      fileSize: 2048000,
      mimeType: "application/pdf",
      isVerified: true,
      verifiedBy: "admin-1",
      verificationDate: new Date("2024-01-15"),
      createdAt: new Date("2024-01-10")
    },
    {
      id: "doc-2",
      memberId: "member-profile-test-id",
      organizationId: null,
      applicationId: null,
      documentType: "identity_document",
      fileName: "id_copy.pdf",
      filePath: "/documents/id_copy.pdf",
      fileSize: 1024000,
      mimeType: "application/pdf",
      isVerified: true,
      verifiedBy: "admin-1",
      verificationDate: new Date("2024-01-15"),
      createdAt: new Date("2024-01-10")
    },
    {
      id: "doc-3",
      memberId: "member-profile-test-id",
      organizationId: null,
      applicationId: null,
      documentType: "professional_certificate",
      fileName: "certification.pdf",
      filePath: "/documents/certification.pdf",
      fileSize: 1536000,
      mimeType: "application/pdf",
      isVerified: true,
      verifiedBy: "admin-1",
      verificationDate: new Date("2024-01-20"),
      createdAt: new Date("2024-01-15")
    }
  ];

  // Mock payments data
  const mockPayments: any[] = [
    {
      id: "pay-1",
      memberId: "member-profile-test-id",
      organizationId: null,
      amount: "500.00",
      currency: "USD",
      paymentMethod: "paynow_ecocash",
      status: "completed",
      purpose: "membership",
      referenceNumber: "PAY-001-2024",
      transactionId: "TXN-123456789",
      paymentDate: new Date("2024-01-10"),
      createdAt: new Date("2024-01-10")
    }
  ];

  // Mock CPD activities
  const mockCpdActivities: CpdActivity[] = [
    {
      id: "cpd-1",
      memberId: "member-profile-test-id",
      eventId: "event-1",
      activityTitle: "Real Estate Law Workshop",
      activityType: "workshop",
      pointsEarned: 15,
      completionDate: new Date("2024-02-15"),
      certificateUrl: "/certificates/cpd1.pdf",
      verifiedBy: "admin-1",
      isVerified: true,
      createdAt: new Date("2024-02-15")
    },
    {
      id: "cpd-2",
      memberId: "member-profile-test-id",
      eventId: "event-2",
      activityTitle: "Property Valuation Seminar",
      activityType: "seminar",
      pointsEarned: 20,
      completionDate: new Date("2024-03-10"),
      certificateUrl: "/certificates/cpd2.pdf",
      verifiedBy: "admin-1",
      isVerified: true,
      createdAt: new Date("2024-03-10")
    }
  ];

  // Mock earned badges
  const earnedBadgeIds = [
    "badge-1", // Getting Started
    "badge-2", // Profile Master
    "badge-3", // Document Collector
    "badge-4", // Verified Professional
    "badge-5"  // Learning Enthusiast
  ];

  // Create achievement badges with IDs
  const achievementBadges = defaultAchievementBadges.map((badge, index) => ({
    ...badge,
    id: `badge-${index + 1}`,
    createdAt: new Date()
  })) as any[];

  // Calculate badge progress
  const badgeProgress = BadgeService.calculateBadgeProgress(
    achievementBadges,
    earnedBadgeIds,
    mockMember,
    mockDocuments,
    mockPayments,
    mockCpdActivities,
    2 // Event attendance count
  );

  // Get earned badges
  const earnedBadges = achievementBadges.filter(badge => 
    earnedBadgeIds.includes(badge.id)
  );

  const { data: member, isLoading } = useQuery({
    queryKey: ["/api/members/profile"],
    enabled: !!user,
    initialData: mockMember
  });

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: member?.firstName || "",
      lastName: member?.lastName || "",
      email: member?.email || "",
      phone: member?.phone || "",
      address: "",
      dateOfBirth: member?.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : "",
      nationalId: member?.nationalId || "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
    },
  });

  const professionalForm = useForm<ProfessionalData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      educationLevel: "",
      yearsOfExperience: 0,
      currentEmployer: "",
      jobTitle: "",
      specializations: "",
      certifications: "",
      previousEmployment: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileData) => {
      const response = await apiRequest("PUT", "/api/members/profile", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully."
      });
      setIsEditingProfile(false);
      queryClient.invalidateQueries({ queryKey: ["/api/members/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
    }
  });

  const updateProfessionalMutation = useMutation({
    mutationFn: async (data: ProfessionalData) => {
      const response = await apiRequest("PUT", "/api/members/professional", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Professional details updated successfully."
      });
      setIsEditingProfessional(false);
      queryClient.invalidateQueries({ queryKey: ["/api/members/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update professional details.",
        variant: "destructive"
      });
    }
  });

  const onProfileSubmit = (data: ProfileData) => {
    updateProfileMutation.mutate(data);
  };

  const onProfessionalSubmit = (data: ProfessionalData) => {
    updateProfessionalMutation.mutate(data);
  };


  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader currentPage="profile" />
      <div className="flex-1">
        <div className="p-8">
          {/* Professional Header */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    My Profile
                  </h1>
                  <p className="text-slate-600 text-lg">Manage your personal and professional information</p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <User className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-2xl font-bold text-slate-900 mb-1">85%</div>
                  <div className="text-xs text-slate-600 uppercase tracking-wider">Profile Complete</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-700 mb-1">Active</div>
                  <div className="text-xs text-slate-600 uppercase tracking-wider">Status</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-700 mb-1">1 Year</div>
                  <div className="text-xs text-slate-600 uppercase tracking-wider">Member Since</div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Profile Completion */}
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Profile Completion</h3>
                    <p className="text-slate-600 text-sm">Complete your profile information</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-slate-900">85%</span>
                    <span className="text-slate-500 text-sm">15% remaining</span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 rounded-full h-2 transition-all duration-500" 
                      style={{width: '85%'}}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Member Status */}
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Member Status</h3>
                    <p className="text-slate-600 text-sm">Verified & Active Member</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
                    ✓ ACTIVE MEMBER
                  </Badge>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">All documents verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Membership Duration */}
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Membership Journey</h3>
                    <p className="text-slate-600 text-sm">Member ID: EAC-MBR-0001</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-slate-900">1 Year</div>
                  <div className="text-slate-600 text-sm">
                    Member since January 2024
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Star className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Professional Member</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-6xl mx-auto space-y-6">
            {/* Professional Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-white border border-slate-200 rounded-xl p-1 grid w-full grid-cols-4 shadow-sm">
                <TabsTrigger 
                  value="profile" 
                  className="text-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  Personal Details
                </TabsTrigger>
                <TabsTrigger 
                  value="professional" 
                  className="text-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Professional Details
                </TabsTrigger>
                <TabsTrigger 
                  value="achievements" 
                  className="text-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Achievements
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="text-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Security Settings
                </TabsTrigger>
              </TabsList>

              {/* Personal Details Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                  <Button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    variant={isEditingProfile ? "outline" : "default"}
                    className={isEditingProfile ? "bg-white/90 text-gray-900 hover:bg-white" : "gradient-button text-white border-0"}
                    data-testid="button-edit-profile"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
                  </Button>
                </div>

                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Contact Information */}
                      <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center text-gray-900">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            Contact Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {/* Profile Picture Section */}
                          <div className="flex items-center space-x-6 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="relative">
                              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {member?.firstName?.[0]}{member?.lastName?.[0]}
                              </div>
                              <Button
                                size="sm"
                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                                data-testid="button-upload-photo"
                              >
                                <Camera className="w-4 h-4" />
                              </Button>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{member?.firstName} {member?.lastName}</h3>
                              <p className="text-gray-600 capitalize">{member?.memberType?.replace(/_/g, " ")}</p>
                              <p className="text-sm text-gray-500">Member ID: {member?.membershipNumber}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={!isEditingProfile}
                                      className={!isEditingProfile ? "bg-gray-50" : ""}
                                      data-testid="input-first-name"
                                    />
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
                                    <Input
                                      {...field}
                                      disabled={!isEditingProfile}
                                      className={!isEditingProfile ? "bg-gray-50" : ""}
                                      data-testid="input-last-name"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="email"
                                      disabled={!isEditingProfile}
                                      className={!isEditingProfile ? "bg-gray-50" : ""}
                                      data-testid="input-email"
                                    />
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
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={!isEditingProfile}
                                      className={!isEditingProfile ? "bg-gray-50" : ""}
                                      placeholder="+263..."
                                      data-testid="input-phone"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Emergency Contact */}
                      <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center text-gray-900">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                              <Phone className="w-4 h-4 text-white" />
                            </div>
                            Emergency Contact
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <FormField
                              control={profileForm.control}
                              name="emergencyContactName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={!isEditingProfile}
                                      className={!isEditingProfile ? "bg-gray-50" : ""}
                                      placeholder="Full name"
                                      data-testid="input-emergency-name"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="emergencyContactPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Phone</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={!isEditingProfile}
                                      className={!isEditingProfile ? "bg-gray-50" : ""}
                                      placeholder="+263..."
                                      data-testid="input-emergency-phone"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="emergencyContactRelation"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Relationship</FormLabel>
                                  <Select disabled={!isEditingProfile} onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className={!isEditingProfile ? "bg-gray-50" : ""}>
                                        <SelectValue placeholder="Select relationship" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="spouse">Spouse</SelectItem>
                                      <SelectItem value="parent">Parent</SelectItem>
                                      <SelectItem value="sibling">Sibling</SelectItem>
                                      <SelectItem value="child">Child</SelectItem>
                                      <SelectItem value="friend">Friend</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Additional Information */}
                    <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center text-gray-900">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          Additional Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="date" 
                                    disabled={!isEditingProfile}
                                    className={!isEditingProfile ? "bg-gray-50" : ""}
                                    data-testid="input-date-of-birth" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="nationalId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>National ID</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    disabled={!isEditingProfile}
                                    className={!isEditingProfile ? "bg-gray-50" : ""}
                                    data-testid="input-national-id" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  disabled={!isEditingProfile}
                                  className={!isEditingProfile ? "bg-gray-50" : ""}
                                  rows={3} 
                                  data-testid="textarea-address" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {isEditingProfile && (
                          <Button 
                            type="submit" 
                            className="gradient-button text-white border-0"
                            disabled={updateProfileMutation.isPending}
                            data-testid="button-save-personal"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </form>
                </Form>
              </TabsContent>

              {/* Professional Details Tab */}
              <TabsContent value="professional" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Professional Information</h2>
                  <Button
                    onClick={() => setIsEditingProfessional(!isEditingProfessional)}
                    variant={isEditingProfessional ? "outline" : "default"}
                    className={isEditingProfessional ? "bg-white/90 text-gray-900 hover:bg-white" : "gradient-button text-white border-0"}
                    data-testid="button-edit-professional"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditingProfessional ? "Cancel Edit" : "Edit Professional"}
                  </Button>
                </div>

                <Form {...professionalForm}>
                  <form onSubmit={professionalForm.handleSubmit(onProfessionalSubmit)} className="space-y-6">
                    <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center text-gray-900">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="w-4 h-4 text-white" />
                          </div>
                          Professional Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Member Type</Label>
                            <div className="p-2 border rounded bg-gray-50 capitalize">
                              {member?.memberType?.replace(/_/g, " ")}
                            </div>
                          </div>
                          <div>
                            <Label>Membership Number</Label>
                            <div className="p-2 border rounded bg-gray-50 font-mono">
                              {member?.membershipNumber}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={professionalForm.control}
                            name="educationLevel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Education Level</FormLabel>
                                <Select disabled={!isEditingProfessional} onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className={!isEditingProfessional ? "bg-gray-50" : ""}>
                                      <SelectValue placeholder="Select education level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="certificate">Certificate</SelectItem>
                                    <SelectItem value="diploma">Diploma</SelectItem>
                                    <SelectItem value="bachelors_degree">Bachelor's Degree</SelectItem>
                                    <SelectItem value="masters_degree">Master's Degree</SelectItem>
                                    <SelectItem value="doctorate">Doctorate</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={professionalForm.control}
                            name="yearsOfExperience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    min="0"
                                    disabled={!isEditingProfessional}
                                    className={!isEditingProfessional ? "bg-gray-50" : ""}
                                    data-testid="input-years-experience"
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={professionalForm.control}
                            name="currentEmployer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Employer</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={!isEditingProfessional}
                                    className={!isEditingProfessional ? "bg-gray-50" : ""}
                                    placeholder="Current company name"
                                    data-testid="input-current-employer"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={professionalForm.control}
                            name="jobTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={!isEditingProfessional}
                                    className={!isEditingProfessional ? "bg-gray-50" : ""}
                                    placeholder="Your current position"
                                    data-testid="input-job-title"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={professionalForm.control}
                          name="specializations"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specializations</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  disabled={!isEditingProfessional}
                                  className={!isEditingProfessional ? "bg-gray-50" : ""}
                                  rows={3}
                                  placeholder="Describe your areas of specialization..."
                                  data-testid="textarea-specializations"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={professionalForm.control}
                          name="certifications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Certifications</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  disabled={!isEditingProfessional}
                                  className={!isEditingProfessional ? "bg-gray-50" : ""}
                                  rows={3}
                                  placeholder="List your professional certifications..."
                                  data-testid="textarea-certifications"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={professionalForm.control}
                          name="previousEmployment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Previous Employment</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  disabled={!isEditingProfessional}
                                  className={!isEditingProfessional ? "bg-gray-50" : ""}
                                  rows={4}
                                  placeholder="Describe your previous work experience..."
                                  data-testid="textarea-previous-employment"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {isEditingProfessional && (
                          <Button
                            type="submit"
                            className="gradient-button text-white border-0"
                            disabled={updateProfessionalMutation.isPending}
                            data-testid="button-save-professional"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {updateProfessionalMutation.isPending ? "Saving..." : "Save Professional Details"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </form>
                </Form>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Achievements & Badges</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Profile Progress */}
                  <div className="space-y-6">
                    <ProfileProgress 
                      member={mockMember}
                      documents={mockDocuments}
                      payments={mockPayments}
                      cpdActivities={mockCpdActivities}
                    />
                  </div>

                  {/* Recent Badges Showcase */}
                  <div className="space-y-6">
                    <BadgeShowcase 
                      badges={earnedBadges}
                      title="Recent Achievements"
                      maxDisplay={4}
                    />

                    {/* Achievement Stats */}
                    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold text-purple-600">{earnedBadges.length}</div>
                            <div className="text-sm text-gray-600">Badges Earned</div>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold text-blue-600">
                              {earnedBadges.reduce((sum, badge) => sum + (badge.points || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Points</div>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold text-green-600">{mockMember.cpdPoints}</div>
                            <div className="text-sm text-gray-600">CPD Points</div>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold text-orange-600">
                              {Math.round((earnedBadges.length / achievementBadges.length) * 100)}%
                            </div>
                            <div className="text-sm text-gray-600">Completion</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* All Badges Grid */}
                <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      All Achievement Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BadgeGrid 
                      badges={achievementBadges}
                      earnedBadges={earnedBadgeIds}
                      badgeProgress={badgeProgress}
                      onBadgeClick={(badge) => {
                        toast({
                          title: badge.name,
                          description: badge.description,
                          duration: 3000
                        });
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Upcoming Badges */}
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      Upcoming Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {achievementBadges
                        .filter(badge => !earnedBadgeIds.includes(badge.id))
                        .slice(0, 3)
                        .map((badge) => (
                          <div key={badge.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Award className="w-6 h-6 text-gray-500" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{badge.name}</div>
                                <div className="text-sm text-gray-600">{badge.description}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-orange-600">
                                {badgeProgress[badge.id] || 0}% complete
                              </div>
                              <div className="text-xs text-gray-500">{badge.points} points</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings Tab */}
              <TabsContent value="security" className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                
                <PasswordChangeForm />
                
                {/* Account Security Info */}
                <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Account Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-green-900">Account Status</h4>
                        <p className="text-sm text-green-700">Your account is secure and verified</p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Email Verification</span>
                        <span className="text-green-600 font-medium">Verified</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Two-Factor Authentication</span>
                        <span className="text-orange-600 font-medium">Not Enabled</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Last Password Change</span>
                        <span className="text-gray-500">Never</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">Security Tips</h5>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Use a strong, unique password</li>
                        <li>• Change your password regularly</li>
                        <li>• Never share your login credentials</li>
                        <li>• Log out from shared devices</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}