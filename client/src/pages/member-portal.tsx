import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MemberHeader } from "@/components/MemberHeader";
import { StatsCard } from "@/components/ui/stats-card";
import { Badge } from "@/components/ui/badge";
import { 
  User, GraduationCap, Calendar, Building2, 
  Download, RefreshCw, AlertTriangle, Edit,
  CheckCircle, Clock, FileText
} from "lucide-react";
import { useLocation } from "wouter";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { FormFooter } from "@/components/ui/form-footer";
import type { Member, Event } from "@shared/schema";

export default function MemberPortal() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: member, isLoading: memberLoading } = useQuery<Member>({
    queryKey: ["/api/members/profile"],
    enabled: !!user,
  });

  const { data: upcomingEvents = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events?upcoming=true"],
    enabled: !!user,
  });


  const quickActions = [
    {
      icon: Download,
      label: "Download Certificate",
      action: () => setLocation("/certificate"),
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      icon: RefreshCw,
      label: "Renew Membership",
      action: () => setLocation("/renewals"),
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      icon: GraduationCap,
      label: "CPD Tracking",
      action: () => setLocation("/cpd-tracking"),
      color: "text-indigo-600",
      bg: "bg-indigo-100"
    },
    {
      icon: AlertTriangle,
      label: "Lodge Complaint",
      action: () => setLocation("/case-management"),
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    {
      icon: Edit,
      label: "Update Profile",
      action: () => setLocation("/member/profile"),
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  if (memberLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader currentPage="dashboard" title="EACZ Member Portal" subtitle="Manage your membership and professional growth" />
      
      <div className="p-6">
        {/* Modern Header with Animation */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <div className="w-2 h-12 bg-gradient-to-b from-primary to-primary/80 rounded-full mr-4 shadow-lg"></div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Welcome back, {member?.firstName || user?.email || "Member"}!
              </h1>
              <p className="text-muted-foreground text-lg mt-2">Manage your membership and accelerate your professional growth</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center space-x-3 mt-6">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-medium shadow-lg">
              <CheckCircle className="w-4 h-4 mr-2" />
              {member?.membershipStatus === "active" ? "Active Member" : "Pending Verification"}
            </Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 px-4 py-2">
              ID: {member?.membershipNumber || "Loading..."}
            </Badge>
          </div>
        </div>

        {/* Modern Colorful Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Membership Status Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-1">Membership Status</p>
                  <p className="text-2xl font-bold capitalize" data-testid="stat-membership-status">
                    {member?.membershipStatus || "Active"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
            </CardContent>
          </Card>

          {/* CPD Points Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">CPD Progress</p>
                  <p className="text-2xl font-bold" data-testid="stat-cpd-points">
                    {member?.cpdPoints || 35}/50
                  </p>
                  <div className="w-full bg-blue-400/30 rounded-full h-2 mt-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((member?.cpdPoints || 35) / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
            </CardContent>
          </Card>

          {/* Renewal Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium mb-1">Next Renewal</p>
                  <p className="text-xl font-bold" data-testid="stat-next-renewal">
                    {member?.expiryDate ? new Date(member.expiryDate).toLocaleDateString('en-GB') : "Jan 2025"}
                  </p>
                  <p className="text-xs text-amber-100 mt-1">90 days remaining</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
            </CardContent>
          </Card>

          {/* Organization Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100 text-sm font-medium mb-1">Organization</p>
                  <p className="text-lg font-bold" data-testid="stat-organization">
                    {member?.organizationId ? "Linked" : "Individual"}
                  </p>
                  <p className="text-xs text-violet-100 mt-1">Member Type</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Upcoming Events - Larger Card */}
          <Card className="xl:col-span-2 border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming CPD Events
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {eventsLoading ? (
                <div className="space-y-4">
                  <div className="animate-pulse bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl h-24"></div>
                  <div className="animate-pulse bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl h-24"></div>
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 3).map((event, index) => (
                    <div key={event.id} className={`flex items-center justify-between p-4 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                      index === 0 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
                      index === 1 ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200' :
                      'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200'
                    }`}>
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                          index === 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                          index === 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                          'bg-gradient-to-br from-purple-500 to-violet-600'
                        }`}>
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900" data-testid={`event-title-${event.id}`}>
                            {event.title}
                          </h4>
                          <p className="text-sm text-slate-600" data-testid={`event-date-${event.id}`}>
                            {new Date(event.startDate).toLocaleDateString('en-GB')} • {new Date(event.startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <Badge variant="outline" className="text-xs mt-1">15 CPD Points</Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-md"
                        data-testid={`button-register-${event.id}`}
                      >
                        Register
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No upcoming events</p>
                  <p className="text-sm text-slate-400 mt-1">Check back soon for new opportunities</p>
                </div>
              )}
              
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => setLocation("/event-management")}
                  data-testid="link-view-all-events"
                >
                  View all events →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions - Modernized */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start p-4 h-auto hover:scale-102 transition-all duration-200 group"
                    onClick={action.action}
                    data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className={`w-10 h-10 ${action.bg} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <span className="font-medium text-slate-700 group-hover:text-slate-900">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-card-foreground" data-testid="activity-payment">
                    Payment received for annual membership renewal
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-card-foreground" data-testid="activity-event">
                    Registered for Property Law Workshop
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-card-foreground" data-testid="activity-certificate">
                    Certificate downloaded
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <FormFooter />
    </div>
  );
}
