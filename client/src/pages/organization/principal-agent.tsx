import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormHeader } from "@/components/ui/form-header";
import { Sidebar } from "@/components/navigation/Sidebar";
import { 
  Building2, Users, FileText, CreditCard, Award,
  User, Shield, Calendar, Star, Settings, UserCheck,
  Phone, Mail, MapPin, Edit, Save, X
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function PrincipalAgentPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Mock principal agent data
  const mockPrincipalAgent = {
    id: "member-1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@primeproperties.co.zw",
    phone: "+263712345678",
    membershipNumber: "EAC-MBR-0001",
    memberType: "principal_real_estate_agent",
    licenseNumber: "PRA-2024-001",
    dateAppointed: new Date("2024-01-01"),
    qualifications: ["BSc Real Estate", "RICS Certified"],
    experience: "10 years",
    status: "active"
  };

  const sidebarItems = [
    { icon: Building2, label: "Dashboard", href: "/organization/dashboard" },
    { icon: User, label: "Principal Agent", href: "/organization/principal", active: true },
    { icon: Users, label: "Agents", href: "/organization/agents" },
    { icon: FileText, label: "Documents", href: "/organization/documents" },
    { icon: Award, label: "Certificate", href: "/organization/certificate" },
    { icon: CreditCard, label: "Payments", href: "/organization/payments" },
    { icon: Calendar, label: "Renewals", href: "/organization/renewals" }
  ];

  const handleSaveChanges = () => {
    toast({
      title: "Success",
      description: "Principal agent information updated successfully."
    });
    setIsEditing(false);
  };

  const handleChangePrincipal = () => {
    toast({
      title: "Change Principal Agent",
      description: "This action requires board approval and EACZ verification."
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      <FormHeader 
        title="EACZ Organization Portal"
        subtitle="Principal Agent Management"
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
              <h1 className="text-3xl font-bold text-white mb-2">Principal Agent Management</h1>
              <p className="text-blue-100">Manage your designated principal real estate agent</p>
            </div>

            {/* Principal Agent Details */}
            <Card className="bg-white/95 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-gray-900">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    Designated Principal Agent
                  </CardTitle>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={handleSaveChanges} className="gradient-button text-white border-0">
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Profile Information */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {mockPrincipalAgent.firstName} {mockPrincipalAgent.lastName}
                        </h3>
                        <Badge className="bg-green-100 text-green-800">{mockPrincipalAgent.status}</Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">First Name</label>
                          <p className="text-gray-900 font-semibold">{mockPrincipalAgent.firstName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Last Name</label>
                          <p className="text-gray-900 font-semibold">{mockPrincipalAgent.lastName}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{mockPrincipalAgent.email}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{mockPrincipalAgent.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900">Professional Details</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Membership Number</label>
                        <p className="text-blue-600 font-semibold">{mockPrincipalAgent.membershipNumber}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">License Number</label>
                        <p className="text-gray-900 font-semibold">{mockPrincipalAgent.licenseNumber}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Date Appointed</label>
                        <p className="text-gray-900">{mockPrincipalAgent.dateAppointed.toLocaleDateString()}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Experience</label>
                        <p className="text-gray-900">{mockPrincipalAgent.experience}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Qualifications</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {mockPrincipalAgent.qualifications.map((qual, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {qual}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities & Requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span>Oversee all real estate transactions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span>Ensure compliance with EACZ regulations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span>Supervise junior agents and staff</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span>Maintain professional standards</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span>Handle client complaints and disputes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                    Requirements Met
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>✓ Valid EACZ membership</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>✓ Minimum 5 years experience</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>✓ Professional qualifications</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>✓ Clean disciplinary record</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>✓ Current CPD compliance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card className="bg-white/95 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-900">Principal Agent Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline"
                    className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    onClick={handleChangePrincipal}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Change Principal Agent
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => setLocation('/organization/documents')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Documents
                  </Button>
                  
                  <Button 
                    className="gradient-button text-white border-0"
                    onClick={() => setLocation('/organization/certificate')}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}