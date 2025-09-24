import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormHeader } from "@/components/ui/form-header";
import { Sidebar } from "@/components/navigation/Sidebar";
import { BulkMemberImportDialog } from "@/components/BulkMemberImportDialog";
import { 
  Building2, Users, FileText, CreditCard, Award,
  User, Plus, Search, Filter, MoreHorizontal,
  Phone, Mail, Calendar, CheckCircle, Clock
} from "lucide-react";
import { useLocation } from "wouter";
import type { Member } from "@shared/schema";

export default function AgentsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch organization members
  const { data: agents = [], isLoading, error } = useQuery<Member[]>({
    queryKey: ["/api/organizations/current/members"],
    enabled: !!user,
  });

  const sidebarItems = [
    { icon: Building2, label: "Dashboard", href: "/organization/dashboard" },
    { icon: User, label: "Principal Agent", href: "/organization/principal" },
    { icon: Users, label: "Agents", href: "/organization/agents", active: true },
    { icon: FileText, label: "Documents", href: "/organization/documents" },
    { icon: Award, label: "Certificate", href: "/organization/certificate" },
    { icon: CreditCard, label: "Payments", href: "/organization/payments" },
    { icon: Calendar, label: "Renewals", href: "/organization/renewals" }
  ];

  const getMemberTypeDisplay = (type: string) => {
    switch (type) {
      case "real_estate_agent": return "Real Estate Agent";
      case "property_manager": return "Property Manager";
      case "principal_real_estate_agent": return "Principal Real Estate Agent";
      case "real_estate_negotiator": return "Real Estate Negotiator";
      default: return type.replace(/_/g, " ");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (agent.membershipNumber && agent.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === "all" || agent.membershipStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen gradient-bg">
      <FormHeader 
        title="EACZ Organization Portal"
        subtitle="Agent Management"
      />
      
      <div className="flex min-h-screen">
        <Sidebar 
          items={sidebarItems}
          title="Organization Portal"
          subtitle="Manage your organization"
        />
        
        <main className="flex-1 p-6 pt-6 ml-64">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Agent Management</h1>
              <p className="text-blue-100">Manage your organization's registered agents</p>
              
              {/* Summary Cards */}
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
                        <p className="text-sm font-medium text-gray-600">Active</p>
                        <p className="text-2xl font-bold text-green-600">{agents.filter(a => a.membershipStatus === 'active').length}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{agents.filter(a => a.membershipStatus === 'pending').length}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95 backdrop-blur border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg CPD Points</p>
                        <p className="text-2xl font-bold text-purple-600">{agents.length > 0 ? Math.round(agents.reduce((acc: number, a: Member) => acc + (a.cpdPoints || 0), 0) / agents.length) : 0}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Search and Filter */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search agents by name, email, or membership number..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <Button className="gradient-button text-white border-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Agent
                    </Button>
                    <BulkMemberImportDialog 
                      endpoint="/api/organizations/current/members/bulk-import"
                      invalidateKeys={["/api/organizations/current/members"]}
                      onSuccess={() => {}} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agents List */}
            <Card className="bg-white/95 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-900">Registered Agents ({filteredAgents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAgents.map((agent) => (
                    <div key={agent.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{agent.firstName} {agent.lastName}</h3>
                            <p className="text-sm text-gray-600">{getMemberTypeDisplay(agent.memberType)}</p>
                            <p className="text-xs text-blue-600">Member: {agent.membershipNumber}</p>
                          </div>
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-6">
                          <div className="text-sm">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">{agent.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">{agent.phone}</span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-center">
                            <p className="text-gray-600">CPD Points</p>
                            <p className="font-semibold text-purple-600">{agent.cpdPoints}</p>
                          </div>
                          
                          <div className="text-sm text-center">
                            <p className="text-gray-600">Joined</p>
                            <p className="font-semibold">{agent.joiningDate ? new Date(agent.joiningDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(agent.membershipStatus || 'pending')}>
                            {(agent.membershipStatus || 'pending').charAt(0).toUpperCase() + (agent.membershipStatus || 'pending').slice(1)}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Mobile view details */}
                      <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Email: {agent.email}</p>
                            <p className="text-gray-600">Phone: {agent.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">CPD Points: <span className="font-semibold text-purple-600">{agent.cpdPoints}</span></p>
                            <p className="text-gray-600">Joined: {agent.joiningDate ? new Date(agent.joiningDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredAgents.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm || filterStatus !== "all" 
                          ? "Try adjusting your search or filter criteria." 
                          : "Get started by adding your first agent to the organization."}
                      </p>
                      <Button className="gradient-button text-white border-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Agent
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}