import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormFooter } from "@/components/ui/form-footer";
import { MemberHeader } from "@/components/MemberHeader";
import { 
  Calendar, MapPin, Clock, Users, 
  User, FileText, CreditCard, UserCheck,
  BookOpen, Star, ChevronRight, Building2
} from "lucide-react";
import { useLocation } from "wouter";

export default function MemberEvents() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Mock events data matching actual schema
  const mockEvents = [
    {
      id: "event-1",
      title: "CPD Workshop: Real Estate Valuations",
      description: "Comprehensive workshop on modern real estate valuation techniques and market analysis",
      startDate: new Date("2024-03-15T09:00:00"),
      endDate: new Date("2024-03-15T17:00:00"),
      address: "EACZ Conference Center, Harare",
      capacity: 50,
      registeredCount: 35,
      cpdPoints: 8,
      price: "150.00",
      type: "workshop",
      status: "upcoming",
      instructor: "John Smith",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "event-2", 
      title: "Annual General Meeting",
      description: "EACZ Annual General Meeting - All members are encouraged to attend",
      startDate: new Date("2024-04-20T10:00:00"),
      endDate: new Date("2024-04-20T16:00:00"),
      address: "Rainbow Towers Hotel, Harare",
      capacity: 200,
      registeredCount: 120,
      cpdPoints: 4,
      price: "0.00",
      type: "conference",
      status: "upcoming",
      instructor: "EACZ Board",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "event-3",
      title: "Ethics and Professional Conduct Seminar",
      description: "Seminar on professional ethics and conduct in real estate practice",
      startDate: new Date("2024-02-10T14:00:00"),
      endDate: new Date("2024-02-10T18:00:00"),
      address: "Online Webinar",
      capacity: 100,
      registeredCount: 85,
      cpdPoints: 6,
      price: "75.00",
      type: "seminar",
      status: "completed",
      instructor: "Jane Doe",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const upcomingEvents = mockEvents.filter(event => event.status === "upcoming");
  const pastEvents = mockEvents.filter(event => event.status === "completed");


  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader currentPage="events" />
      
      <div className="p-6">
        <main className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Events & Training</h1>
            <p className="text-muted-foreground">View upcoming events and track your CPD progress</p>
          </div>

            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="bg-white/10 backdrop-blur border-white/20">
                <TabsTrigger value="upcoming" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-900">
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger value="past" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-900">
                  Past Events
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="bg-white/95 backdrop-blur border-white/20 hover:bg-white transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl text-gray-900">{event.title}</CardTitle>
                          <p className="text-gray-600 leading-relaxed">{event.description}</p>
                        </div>
                        <Badge className={getEventStatusColor(event.status)}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">{event.address}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Users className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">{event.registeredCount}/{event.capacity} registered</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {event.cpdPoints && event.cpdPoints > 0 && (
                            <div className="flex items-center text-green-700">
                              <Star className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{event.cpdPoints} CPD Points</span>
                            </div>
                          )}
                          <div className="text-sm text-gray-600">
                            Fee: <span className="font-medium">${event.price}</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="gradient-button text-white border-0"
                          data-testid={`button-register-${event.id}`}
                        >
                          Register Now
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="bg-white/95 backdrop-blur border-white/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl text-gray-900">{event.title}</CardTitle>
                          <p className="text-gray-600 leading-relaxed">{event.description}</p>
                        </div>
                        <Badge className={getEventStatusColor(event.status)}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">{event.address}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Users className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">{event.registeredCount}/{event.capacity} attended</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {event.cpdPoints && event.cpdPoints > 0 && (
                            <div className="flex items-center text-green-700">
                              <Star className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{event.cpdPoints} CPD Points Earned</span>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          data-testid={`button-view-${event.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <FormFooter />
    </div>
  );
}