import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrganizationHeader } from "@/components/OrganizationHeader";
import { StatsCard } from "@/components/ui/stats-card";
import { BulkMemberImportDialog } from "@/components/BulkMemberImportDialog";
import { 
  Building2, Users, FileText, Download, Settings, 
  User, Calendar, DollarSign, Shield, TrendingUp,
  Clock, Award, AlertTriangle, CheckCircle
} from "lucide-react";
import { FormFooter } from "@/components/ui/form-footer";
import type { Organization, Member } from "@shared/schema";

export default function OrganizationPortal() {
  const { user } = useAuth();

  const { data: organization } = useQuery<Organization>({
    queryKey: ["/api/organizations/current"],
    enabled: !!user,
  });

  const { data: organizationMembers = [] } = useQuery<Member[]>({
    queryKey: ["/api/organizations", organization?.id, "members"],
    enabled: !!organization?.id,
  });


  return (
    <div className="min-h-screen bg-background">
      <OrganizationHeader currentPage="dashboard" title="EACZ Organization Portal" subtitle="Manage your organization's registration and members" />
      
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {organization?.name || "Organization Dashboard"}
          </h1>
          <p className="text-muted-foreground">Manage your organization's registration and members</p>
        </div>

        {/* Organization Info Card */}
        <Card className="mb-8 bg-white/95 backdrop-blur border-white/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl" data-testid="org-name">
                  {organization?.name}
                </CardTitle>
                <p className="text-muted-foreground" data-testid="org-type">
                  {organization?.type?.replace(/_/g, ' ')}
                </p>
              </div>
              <Badge variant={organization?.membershipStatus === 'active' ? 'default' : 'secondary'}>
                {organization?.membershipStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
                <p className="font-medium" data-testid="org-registration-number">
                  {organization?.registrationNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                <p className="font-medium" data-testid="org-registration-date">
                  {organization?.registrationDate ? 
                    new Date(organization.registrationDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                <p className="font-medium" data-testid="org-expiry-date">
                  {organization?.expiryDate ? 
                    new Date(organization.expiryDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Members</p>
                  <p className="text-3xl font-bold">{organizationMembers.length}</p>
                </div>
                <Users className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Principal Agent</p>
                  <p className="text-lg font-bold">{organization?.principalAgentId ? "Assigned" : "Not Set"}</p>
                </div>
                <Shield className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Status</p>
                  <p className="text-lg font-bold">{organization?.membershipStatus === 'active' ? "Active" : "Pending"}</p>
                </div>
                <FileText className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Annual Fee</p>
                  <p className="text-2xl font-bold">${organization?.annualFee || '0'}</p>
                </div>
                <DollarSign className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Compliance Status */}
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100">Compliance</p>
                  <p className="text-lg font-bold">Up to Date</p>
                </div>
                <CheckCircle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Active Agents */}
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100">Active Agents</p>
                  <p className="text-lg font-bold">{organizationMembers.filter(m => m.membershipStatus === 'active').length}</p>
                </div>
                <Award className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Next Renewal */}
          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100">Next Renewal</p>
                  <p className="text-lg font-bold">{organization?.expiryDate ? new Date(organization.expiryDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Organization Members */}
          <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">Organization Members ({organizationMembers.length})</CardTitle>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => window.location.href = '/organization/agents'}
                  data-testid="link-view-all-members"
                  className="text-blue-600 hover:text-blue-700"
                >
                  View All →
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {organizationMembers.length > 0 ? (
                <div className="space-y-3">
                  {organizationMembers.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-white">
                            {member.firstName?.[0]}{member.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900" data-testid={`member-name-${member.id}`}>
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-sm text-gray-600" data-testid={`member-type-${member.id}`}>
                            {member.memberType?.replace(/_/g, ' ') || 'Agent'}
                          </p>
                          <p className="text-xs text-blue-600">
                            Member: {member.membershipNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={member.membershipStatus === 'active' ? 'default' : 'secondary'}
                          className={member.membershipStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {member.membershipStatus}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          CPD: {member.cpdPoints || 0} pts
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {organizationMembers.length > 5 && (
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-500">
                        +{organizationMembers.length - 5} more members
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No members found</p>
                  <p className="text-gray-500 text-sm">Members will appear here once they join your organization</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start gradient-button text-white border-0"
                  onClick={() => window.location.href = '/organization/certificate'}
                  data-testid="button-download-certificate"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => window.location.href = '/organization/profile'}
                  data-testid="button-update-principal-agent"
                >
                  <User className="w-4 h-4 mr-2" />
                  Update Principal Agent
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => window.location.href = '/organization/documents'}
                  data-testid="button-upload-documents"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Manage Documents
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => window.location.href = '/organization/renewals'}
                  data-testid="button-renew-membership"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Renew Membership
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-orange-200 text-orange-700 hover:bg-orange-50"
                  onClick={() => window.location.href = '/organization/payments'}
                  data-testid="button-view-payments"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Payment History
                </Button>
                
                <BulkMemberImportDialog 
                  endpoint="/api/organizations/current/members/bulk-import"
                  invalidateKeys={["/api/organizations/current/members"]}
                  onSuccess={() => {}} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics and Performance Dashboard */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Organization Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Member Performance */}
            <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Member Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Average CPD Points</p>
                      <p className="text-lg font-semibold text-blue-700">
                        {organizationMembers.length > 0 
                          ? Math.round(organizationMembers.reduce((sum, m) => sum + (m.cpdPoints || 0), 0) / organizationMembers.length)
                          : 0}
                      </p>
                    </div>
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Active Members Rate</p>
                      <p className="text-lg font-semibold text-green-700">
                        {organizationMembers.length > 0 
                          ? Math.round((organizationMembers.filter(m => m.membershipStatus === 'active').length / organizationMembers.length) * 100)
                          : 0}%
                      </p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Principal Agents</p>
                      <p className="text-lg font-semibold text-purple-700">
                        {organizationMembers.filter(m => m.memberType === 'principal_real_estate_agent').length}
                      </p>
                    </div>
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Health */}
            <Card className="bg-white/95 backdrop-blur border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Organization Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Compliance Status</p>
                      <p className="text-lg font-semibold text-green-700">Excellent</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Registration Status</p>
                      <p className="text-lg font-semibold text-blue-700">
                        {organization?.membershipStatus === 'active' ? 'Active' : 'Pending'}
                      </p>
                    </div>
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Days to Renewal</p>
                      <p className="text-lg font-semibold text-amber-700">
                        {organization?.expiryDate 
                          ? Math.max(0, Math.ceil((new Date(organization.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <FormFooter />
    </div>
  );
}
