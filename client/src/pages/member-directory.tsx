import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Sidebar } from "@/components/navigation/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, Building2, AlertTriangle, Calendar, GraduationCap, RefreshCw,
  Search, MapPin, Phone, Mail, User, Filter, Download, CheckCircle
} from "lucide-react";
import { useLocation } from "wouter";
import type { Member, Organization } from "@shared/schema";

interface MemberWithOrganization extends Member {
  organization?: Organization;
}

export default function MemberDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [memberTypeFilter, setMemberTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const { data: members = [], isLoading } = useQuery<MemberWithOrganization[]>({
    queryKey: isAdmin ? ["/api/members", { 
      search: searchQuery, 
      type: memberTypeFilter !== "all" ? memberTypeFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      location: locationFilter !== "all" ? locationFilter : undefined
    }] : ["/api/public/members"],
  });

  const { data: organizations = [] } = useQuery<Organization[]>({
    queryKey: isAdmin ? ["/api/organizations"] : ["/api/public/organizations"],
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchQuery || 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.membershipNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.organization?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = memberTypeFilter === "all" || member.memberType === memberTypeFilter;
    const matchesStatus = statusFilter === "all" || member.membershipStatus === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredOrganizations = organizations.filter(org =>
    !searchQuery || org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMemberTypeDisplay = (type: string) => {
    switch (type) {
      case "real_estate_agent":
        return "Real Estate Agent";
      case "property_manager":
        return "Property Manager";
      case "principal_agent":
        return "Principal Agent";
      case "negotiator":
        return "Negotiator";
      default:
        return type.replace(/_/g, " ");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "standby":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "revoked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportDirectory = () => {
    const csvContent = [
      ["Name", "Membership Number", "Type", "Status", "Organization", "Contact"].join(","),
      ...filteredMembers.map(member => [
        `"${member.firstName} ${member.lastName}"`,
        member.membershipNumber || "",
        getMemberTypeDisplay(member.memberType),
        member.membershipStatus || "",
        member.organization?.name || "",
        member.email || ""
      ].join(","))
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eacz-member-directory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sidebarItems = [
    { icon: Users, label: "Dashboard", href: "/admin-dashboard" },
    { 
      icon: Users, 
      label: "Members", 
      href: "/admin-dashboard/members",
      children: [
        { label: "All Members", href: "/admin-dashboard/members" },
        { label: "Applications", href: "/admin-dashboard/applications" },
        { label: "Document Verification", href: "/admin-dashboard/documents" }
      ]
    },
    { 
      icon: Building2, 
      label: "Organizations", 
      href: "/admin-dashboard/organizations",
      children: [
        { label: "All Organizations", href: "/admin-dashboard/organizations" },
        { label: "Register Organization", href: "/organization-registration" }
      ]
    },
    { 
      icon: AlertTriangle, 
      label: "Cases", 
      href: "/case-management",
      children: [
        { label: "All Cases", href: "/case-management" },
        { label: "Pending Cases", href: "/case-management?status=open" }
      ]
    },
    { icon: Calendar, label: "Events", href: "/event-management" },
    { icon: GraduationCap, label: "CPD Management", href: "/cpd-tracking" },
    { icon: RefreshCw, label: "Renewals", href: "/renewals" },
    { icon: Users, label: "Member Directory", href: "/member-directory", active: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {isAdmin && <Sidebar items={sidebarItems} title="EACZ Admin" subtitle="Management System" />}
      
      <div className={isAdmin ? "ml-64" : ""}>
        <FormHeader 
        title="EACZ Member Directory"
        subtitle="Find registered estate agents and firms in Zimbabwe"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <PageBreadcrumb items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "Member Directory" }
        ]} className="mb-6" />
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search Directory
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportDirectory}
                disabled={filteredMembers.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search by name, membership number, or organization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  data-testid="input-search"
                />
              </div>
              
              <Select value={memberTypeFilter} onValueChange={setMemberTypeFilter}>
                <SelectTrigger data-testid="select-member-type">
                  <SelectValue placeholder="Member Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="real_estate_agent">Real Estate Agent</SelectItem>
                  <SelectItem value="property_manager">Property Manager</SelectItem>
                  <SelectItem value="principal_real_estate_agent">Principal Real Estate Agent</SelectItem>
                  <SelectItem value="real_estate_negotiator">Real Estate Negotiator</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="standby">Standby</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Individual Members</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Individual Members ({filteredMembers.length})
              </h2>
              <Button 
                variant="outline"
                onClick={() => setLocation("/verify")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Member
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading members...</div>
            ) : filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {member.firstName} {member.lastName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {member.membershipNumber}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(member.membershipStatus || "")}>
                          {member.membershipStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="w-4 h-4 mr-2 text-muted-foreground" />
                          {getMemberTypeDisplay(member.memberType)}
                        </div>
                        
                        {member.organization && (
                          <div className="flex items-center text-sm">
                            <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                            {member.organization.name}
                          </div>
                        )}

                        {member.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                            <a 
                              href={`mailto:${member.email}`}
                              className="text-primary hover:underline"
                            >
                              {member.email}
                            </a>
                          </div>
                        )}

                        {member.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                            <a 
                              href={`tel:${member.phone}`}
                              className="text-primary hover:underline"
                            >
                              {member.phone}
                            </a>
                          </div>
                        )}

                        {/* CPD Points tracking coming soon */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Members Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Registered Organizations ({filteredOrganizations.length})
              </h2>
            </div>

            {filteredOrganizations.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredOrganizations.map((organization) => (
                  <Card key={organization.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{organization.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {organization.registrationNumber}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(organization.membershipStatus || "")}>
                          {organization.membershipStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                          {organization.type.replace(/_/g, " ")}
                        </div>

                        {organization.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                            <a 
                              href={`mailto:${organization.email}`}
                              className="text-primary hover:underline"
                            >
                              {organization.email}
                            </a>
                          </div>
                        )}

                        {organization.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                            <a 
                              href={`tel:${organization.phone}`}
                              className="text-primary hover:underline"
                            >
                              {organization.phone}
                            </a>
                          </div>
                        )}

                        {organization.address && (
                          <div className="flex items-start text-sm">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground" />
                            <span>{organization.address}</span>
                          </div>
                        )}

                        {organization.registrationDate && (
                          <div className="pt-2 border-t text-sm text-muted-foreground">
                            Registered: {new Date(organization.registrationDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Organizations Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        </div>
      </div>
      
      <FormFooter />
    </div>
  );
}