import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormHeader } from "@/components/ui/form-header";
import { FormFooter } from "@/components/ui/form-footer";
import { OrganizationHeader } from "@/components/OrganizationHeader";
import { 
  Building2, Users, FileText, CreditCard, Award,
  User, Shield, Download, Calendar, MapPin, Phone, Mail,
  Star, CheckCircle, Clock, UserCheck, Settings
} from "lucide-react";
import { useLocation } from "wouter";

export default function OrganizationDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Mock organization data
  const mockOrganization = {
    id: "org-1",
    name: "Prime Properties Real Estate",
    type: "real_estate_firm",
    registrationNumber: "EAC-ORG-0001",
    email: "info@primeproperties.co.zw",
    phone: "+263712345678",
    address: "123 Main Street, Harare, Zimbabwe",
    principalAgentId: "member-1",
    membershipStatus: "active",
    registrationDate: new Date("2024-01-01"),
    expiryDate: new Date("2025-01-01"),
    annualFee: "2500.00"
  };

  const mockPrincipalAgent = {
    id: "member-1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@primeproperties.co.zw",
    membershipNumber: "EAC-MBR-0001",
    memberType: "principal_real_estate_agent"
  };

  const mockAgents = [
    {
      id: "agent-1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@primeproperties.co.zw",
      membershipNumber: "EAC-MBR-0002",
      memberType: "real_estate_agent",
      status: "active",
      joiningDate: new Date("2024-02-01")
    },
    {
      id: "agent-2", 
      firstName: "Mary",
      lastName: "Williams",
      email: "mary.williams@primeproperties.co.zw",
      membershipNumber: "EAC-MBR-0003",
      memberType: "property_manager",
      status: "active",
      joiningDate: new Date("2024-03-01")
    }
  ];

  const organization = mockOrganization;
  const principalAgent = mockPrincipalAgent;
  const agents = mockAgents;


  const getOrganizationTypeDisplay = (type: string) => {
    switch (type) {
      case "real_estate_firm": return "Real Estate Firm";
      case "property_management_firm": return "Property Management Firm";
      case "brokerage_firm": return "Brokerage Firm";
      case "real_estate_development_firm": return "Real Estate Development Firm";
      default: return type.replace(/_/g, " ");
    }
  };

  const getMemberTypeDisplay = (type: string) => {
    switch (type) {
      case "real_estate_agent": return "Real Estate Agent";
      case "property_manager": return "Property Manager";
      case "principal_real_estate_agent": return "Principal Real Estate Agent";
      case "real_estate_negotiator": return "Real Estate Negotiator";
      default: return type.replace(/_/g, " ");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <OrganizationHeader currentPage="dashboard" />
      
      <div className="p-6">
        <main className="w-full">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Organization Dashboard</h1>
              <p className="text-muted-foreground">Manage your organization, agents, and compliance</p>
              
              {/* Status Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Agents</p>
                        <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Principal Agent</p>
                        <p className="text-2xl font-bold text-green-600">Active</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Registration</p>
                        <p className="text-2xl font-bold text-purple-600">Valid</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Annual Fee</p>
                        <p className="text-2xl font-bold text-orange-600">${organization.annualFee}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Organization Overview */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  {organization.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Organization Type</p>
                    <p className="font-semibold text-gray-900">{getOrganizationTypeDisplay(organization.type)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Registration Number</p>
                    <p className="font-semibold text-gray-900">{organization.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className="bg-green-100 text-green-800">
                      {organization.membershipStatus.charAt(0).toUpperCase() + organization.membershipStatus.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valid Until</p>
                    <p className="font-semibold text-gray-900">{organization.expiryDate.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-700">{organization.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-700">{organization.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-700">{organization.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Total Agents</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{agents.length}</div>
                  <p className="text-xs text-gray-600">Registered agents</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Active Agents</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{agents.filter(a => a.status === 'active').length}</div>
                  <p className="text-xs text-gray-600">Currently active</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Compliance</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">Good</div>
                  <p className="text-xs text-gray-600">All requirements met</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">Next Renewal</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-purple-600">{organization.expiryDate.toLocaleDateString()}</div>
                  <p className="text-xs text-gray-600">Annual renewal due</p>
                </CardContent>
              </Card>
            </div>

            {/* Company Directors Section */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                    <UserCheck className="w-3 h-3 text-white" />
                  </div>
                  Company Directors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Director 1 */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Michael Roberts</h4>
                        <p className="text-sm text-gray-600">Managing Director</p>
                        <p className="text-xs text-blue-600">m.roberts@primeproperties.co.zw</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  {/* Director 2 */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Jennifer Thompson</h4>
                        <p className="text-sm text-gray-600">Operations Director</p>
                        <p className="text-xs text-blue-600">j.thompson@primeproperties.co.zw</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  {/* Director 3 */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">David Wilson</h4>
                        <p className="text-sm text-gray-600">Finance Director</p>
                        <p className="text-xs text-blue-600">d.wilson@primeproperties.co.zw</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => setLocation('/organization/directors')}
                    data-testid="button-manage-directors"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Manage Directors
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Principal Agent & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Principal Agent */}
              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-2">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                    Designated Principal Agent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{principalAgent.firstName} {principalAgent.lastName}</h3>
                      <p className="text-sm text-gray-600">{principalAgent.email}</p>
                      <p className="text-xs text-blue-600">Member: {principalAgent.membershipNumber}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation('/organization/principal')}
                      data-testid="button-manage-principal"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <p><strong>License Type:</strong> {getMemberTypeDisplay(principalAgent.memberType)}</p>
                      <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Active & Compliant</span></p>
                      <p><strong>Last Renewal:</strong> {organization.registrationDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start gradient-button text-white border-0"
                      onClick={() => setLocation('/organization/certificate')}
                      data-testid="button-download-certificate"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Organization Certificate
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => setLocation('/organization/agents')}
                      data-testid="button-manage-agents"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Agents
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => setLocation('/organization/renewals')}
                      data-testid="button-renew-membership"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Renew Membership
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Agents */}
            <Card className="bg-white/95 backdrop-blur border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-gray-900">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-2">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                    Registered Agents
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation('/organization/agents')}
                    data-testid="button-view-all-agents"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{agent.firstName} {agent.lastName}</h4>
                          <p className="text-sm text-gray-600">{getMemberTypeDisplay(agent.memberType)}</p>
                          <p className="text-xs text-blue-600">{agent.membershipNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800 mb-1">
                          {agent.status}
                        </Badge>
                        <p className="text-xs text-gray-600">Joined {agent.joiningDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <FormFooter />
    </div>
  );
}