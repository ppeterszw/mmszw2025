import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernModal } from "@/components/ui/modern-modal";
import { OrganizationHeader } from "@/components/OrganizationHeader";
import { StatsCard } from "@/components/ui/stats-card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Building2, Users, FileText, Download, Settings,
  User, Calendar, DollarSign, Shield, TrendingUp,
  Clock, Award, AlertTriangle, CheckCircle, Plus,
  Edit, Trash2, UserCheck, Mail, Phone, MapPin
} from "lucide-react";
import type { Organization, Member, Director } from "@shared/schema";

interface OrganizationWithDetails extends Organization {
  directors: Director[];
  members: Member[];
  preaMember: Member | null;
  isPREA: boolean;
  canManage: boolean;
}

export default function OrganizationPortal() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [addDirectorModalOpen, setAddDirectorModalOpen] = useState(false);
  const [editDirectorModalOpen, setEditDirectorModalOpen] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
  const [directorForm, setDirectorForm] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    email: "",
    phone: "",
    position: "",
    appointedDate: ""
  });

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    setLocation("/auth");
    return null;
  }

  // Show loading while checking authentication
  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  // Query organization details by member email
  const { data: organization, isLoading, refetch } = useQuery<OrganizationWithDetails>({
    queryKey: ["/api/organization-portal/member", user?.email],
    enabled: !!user?.email,
  });

  // Add Director mutation
  const addDirectorMutation = useMutation({
    mutationFn: async (data: typeof directorForm) => {
      if (!organization?.id) throw new Error("Organization ID not found");
      return apiRequest("POST", `/api/organization-portal/${organization.id}/directors`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organization-portal/member", user?.email] });
      toast({
        title: "Success",
        description: "Director added successfully"
      });
      setAddDirectorModalOpen(false);
      setDirectorForm({
        firstName: "",
        lastName: "",
        nationalId: "",
        email: "",
        phone: "",
        position: "",
        appointedDate: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add director",
        variant: "destructive"
      });
    }
  });

  // Delete Director mutation
  const deleteDirectorMutation = useMutation({
    mutationFn: async (directorId: string) => {
      if (!organization?.id) throw new Error("Organization ID not found");
      return apiRequest("DELETE", `/api/organization-portal/${organization.id}/directors/${directorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organization-portal/member", user?.email] });
      toast({
        title: "Success",
        description: "Director removed successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove director",
        variant: "destructive"
      });
    }
  });

  const handleAddDirector = () => {
    addDirectorMutation.mutate(directorForm);
  };

  const handleDeleteDirector = (directorId: string) => {
    if (confirm("Are you sure you want to remove this director?")) {
      deleteDirectorMutation.mutate(directorId);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading organization details...</div>
    </div>;
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardHeader>
            <CardTitle>No Organization Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You are not currently associated with any organization.
            </p>
            <Button onClick={() => setLocation("/member-portal")}>
              Go to Member Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OrganizationHeader
        currentPage="dashboard"
        title="EACZ Organization Portal"
        subtitle={organization.name}
      />

      <div className="p-6">
        {/* Header with PREA Badge */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {organization.name}
            </h1>
            <p className="text-muted-foreground">{organization.businessType?.replace(/_/g, ' ')}</p>
          </div>
          {organization.isPREA && (
            <Badge className="bg-green-600 text-white px-4 py-2">
              <UserCheck className="w-4 h-4 mr-2" />
              Principal Real Estate Agent
            </Badge>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="directors">Directors</TabsTrigger>
            <TabsTrigger value="members">Members/Agents</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Organization Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
                    <p className="font-medium">{organization.registrationNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={organization.status === 'active' ? 'default' : 'secondary'}>
                      {organization.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </p>
                    <p className="font-medium">{organization.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone
                    </p>
                    <p className="font-medium">{organization.phone || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Physical Address
                    </p>
                    <p className="font-medium">{organization.physicalAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Principal Real Estate Agent</p>
                    <p className="font-medium">
                      {organization.preaMember
                        ? `${organization.preaMember.firstName} ${organization.preaMember.lastName}`
                        : 'Not Assigned'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                icon={Users}
                title="Total Members"
                value={organization.members.length.toString()}
                iconColor="text-blue-600"
                iconBg="bg-blue-100"
              />
              <StatsCard
                icon={User}
                title="Directors"
                value={organization.directors.length.toString()}
                iconColor="text-green-600"
                iconBg="bg-green-100"
              />
              <StatsCard
                icon={CheckCircle}
                title="Status"
                value={organization.status}
                iconColor="text-purple-600"
                iconBg="bg-purple-100"
              />
            </div>
          </TabsContent>

          {/* Directors Tab */}
          <TabsContent value="directors" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Directors</CardTitle>
                  {organization.canManage && (
                    <Button onClick={() => setAddDirectorModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Director
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {organization.directors.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No directors registered</p>
                ) : (
                  <div className="space-y-4">
                    {organization.directors.map((director) => (
                      <Card key={director.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{director.firstName} {director.lastName}</h3>
                              <p className="text-sm text-muted-foreground">{director.position || 'Director'}</p>
                              <div className="mt-2 space-y-1 text-sm">
                                {director.nationalId && (
                                  <p className="text-muted-foreground">ID: {director.nationalId}</p>
                                )}
                                {director.email && (
                                  <p className="text-muted-foreground">
                                    <Mail className="w-3 h-3 inline mr-1" />
                                    {director.email}
                                  </p>
                                )}
                                {director.phone && (
                                  <p className="text-muted-foreground">
                                    <Phone className="w-3 h-3 inline mr-1" />
                                    {director.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                            {organization.canManage && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteDirector(director.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Members/Agents</CardTitle>
              </CardHeader>
              <CardContent>
                {organization.members.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No members registered</p>
                ) : (
                  <div className="space-y-4">
                    {organization.members.map((member) => (
                      <Card key={member.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{member.firstName} {member.lastName}</h3>
                                {member.id === organization.preaMemberId && (
                                  <Badge variant="default" className="text-xs">PREA</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {member.memberType?.replace(/_/g, ' ')}
                              </p>
                              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Membership #</p>
                                  <p className="font-medium">{member.membershipNumber || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Status</p>
                                  <Badge variant={member.membershipStatus === 'active' ? 'default' : 'secondary'}>
                                    {member.membershipStatus}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Email</p>
                                  <p className="font-medium text-xs">{member.email}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Phone</p>
                                  <p className="font-medium">{member.phone || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Document management coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Director Modal */}
      <ModernModal
        open={addDirectorModalOpen}
        onOpenChange={setAddDirectorModalOpen}
        title="Add Director"
        description="Add a new director to your organization"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={directorForm.firstName}
                onChange={(e) => setDirectorForm({ ...directorForm, firstName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={directorForm.lastName}
                onChange={(e) => setDirectorForm({ ...directorForm, lastName: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="nationalId">National ID</Label>
            <Input
              id="nationalId"
              value={directorForm.nationalId}
              onChange={(e) => setDirectorForm({ ...directorForm, nationalId: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={directorForm.email}
              onChange={(e) => setDirectorForm({ ...directorForm, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={directorForm.phone}
              onChange={(e) => setDirectorForm({ ...directorForm, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              placeholder="e.g., Chairman, Director, Secretary"
              value={directorForm.position}
              onChange={(e) => setDirectorForm({ ...directorForm, position: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="appointedDate">Appointed Date</Label>
            <Input
              id="appointedDate"
              type="date"
              value={directorForm.appointedDate}
              onChange={(e) => setDirectorForm({ ...directorForm, appointedDate: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setAddDirectorModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDirector} disabled={addDirectorMutation.isPending}>
              {addDirectorMutation.isPending ? "Adding..." : "Add Director"}
            </Button>
          </div>
        </div>
      </ModernModal>
    </div>
  );
}
