import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ModernModal } from "@/components/ui/modern-modal";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { 
  Calendar, Plus, Users, GraduationCap, 
  MapPin, Clock, DollarSign, User, Presentation, FileText, Mail
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { AdminHeader } from "@/components/AdminHeader";
import { FormFooter } from "@/components/ui/form-footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import type { Event } from "@shared/schema";

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["workshop", "seminar", "training", "conference"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  location: z.string().min(5, "Location is required"),
  address: z.string().min(10, "Address is required"),
  instructor: z.string().min(2, "Instructor name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  cost: z.number().min(0, "Cost must be non-negative"),
  cpdPoints: z.number().min(0, "CPD points must be non-negative"),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

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

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: upcomingEvents = [] } = useQuery<Event[]>({
    queryKey: ["/api/events", "upcoming=true"],
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "workshop",
      startDate: "",
      endDate: "",
      location: "",
      address: "",
      instructor: "",
      capacity: 50,
      cost: 0,
      cpdPoints: 0,
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      };
      const res = await apiRequest("POST", "/api/events", formattedData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Event Created",
        description: "New event has been successfully created.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EventFormData) => {
    createEventMutation.mutate(data);
  };

  const eventStats = {
    workshops: events.filter(e => e.type === 'workshop').length,
    seminars: events.filter(e => e.type === 'seminar').length,
    cpdEvents: events.filter(e => e.cpdPoints && e.cpdPoints > 0).length,
    thisMonth: events.filter(e => {
      const eventDate = new Date(e.startDate);
      const now = new Date();
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentPage="events" />
      
      <div className="p-6">
        <PageBreadcrumb items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "Event Management" }
        ]} className="mb-6" />
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
            <p className="text-muted-foreground">Manage CPD events, workshops, and seminars</p>
          </div>
          
          <Button 
            className="gradient-button text-white border-0"
            onClick={() => setIsCreateDialogOpen(true)}
            data-testid="button-create-event"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="h-24 flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 border-0"
              data-testid="button-quick-create-event"
            >
              <Calendar className="w-6 h-6 mb-2" />
              <span className="text-sm">Create Event</span>
            </Button>
            <Button
              onClick={() => setLocation("/admin-dashboard/agents-applications")}
              className="h-24 flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 text-green-700 border-0"
              data-testid="button-quick-register-member"
            >
              <User className="w-6 h-6 mb-2" />
              <span className="text-sm">Register Member</span>
            </Button>
            <Button
              onClick={() => toast({ title: "Feature Coming Soon", description: "Event analytics feature will be available soon." })}
              className="h-24 flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-700 border-0"
              data-testid="button-event-analytics"
            >
              <FileText className="w-6 h-6 mb-2" />
              <span className="text-sm">Event Analytics</span>
            </Button>
            <Button
              onClick={() => toast({ title: "Feature Coming Soon", description: "Bulk email to attendees feature will be available soon." })}
              className="h-24 flex flex-col items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-700 border-0"
              data-testid="button-email-attendees"
            >
              <Mail className="w-6 h-6 mb-2" />
              <span className="text-sm">Email Attendees</span>
            </Button>
            <Button
              onClick={() => toast({ title: "Feature Coming Soon", description: "Schedule recurring events feature will be available soon." })}
              className="h-24 flex flex-col items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-0"
              data-testid="button-schedule-recurring"
            >
              <Clock className="w-6 h-6 mb-2" />
              <span className="text-sm">Schedule Recurring</span>
            </Button>
            <Button
              onClick={() => toast({ title: "Feature Coming Soon", description: "Event reports feature will be available soon." })}
              className="h-24 flex flex-col items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 border-0"
              data-testid="button-event-reports"
            >
              <Presentation className="w-6 h-6 mb-2" />
              <span className="text-sm">Event Reports</span>
            </Button>
          </div>
        </div>

        <ModernModal
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          title="Create New Event"
          subtitle="Set up workshops, seminars, training sessions, and conferences"
          icon={Calendar}
          colorVariant="orange"
          maxWidth="2xl"
          footer={{
            primary: {
              label: createEventMutation.isPending ? "Creating..." : "Create Event",
              onClick: () => form.handleSubmit(onSubmit)(),
              loading: createEventMutation.isPending,
              disabled: createEventMutation.isPending,
              testId: "button-submit-event"
            },
            secondary: {
              label: "Cancel",
              onClick: () => setIsCreateDialogOpen(false),
              variant: "outline" as const,
              testId: "button-cancel-event"
            }
          }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter event title" 
                          data-testid="input-event-title"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-event-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="seminar">Seminar</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                          <Textarea 
                            placeholder="Describe the event..."
                            rows={3}
                            data-testid="textarea-event-description"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date & Time *</FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local"
                              data-testid="input-start-date"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date & Time</FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local"
                              data-testid="input-end-date"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Harare Convention Centre" 
                              data-testid="input-location"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="instructor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructor/Speaker *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter instructor name" 
                              data-testid="input-instructor"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter complete address with directions" 
                            rows={2}
                            data-testid="textarea-event-address"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="Max attendees" 
                              data-testid="input-capacity"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost (USD)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              step="0.01"
                              placeholder="0.00" 
                              data-testid="input-cost"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cpdPoints"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPD Points *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="Points awarded" 
                              data-testid="input-cpd-points"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                </form>
              </Form>
          </ModernModal>

        {/* Event Categories Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Presentation}
            title="Workshops"
            value={eventStats.workshops.toString()}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
            data-testid="stat-workshops"
          />
          
          <StatsCard
            icon={Users}
            title="Seminars"
            value={eventStats.seminars.toString()}
            iconColor="text-green-600"
            iconBg="bg-green-100"
            data-testid="stat-seminars"
          />
          
          <StatsCard
            icon={GraduationCap}
            title="CPD Events"
            value={eventStats.cpdEvents.toString()}
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
            data-testid="stat-cpd-events"
          />
          
          <StatsCard
            icon={Calendar}
            title="This Month"
            value={eventStats.thisMonth.toString()}
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
            data-testid="stat-this-month"
          />
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-secondary rounded-lg h-32"></div>
                ))}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Badge 
                              variant="secondary" 
                              className="bg-blue-100 text-blue-700"
                              data-testid={`event-type-${event.id}`}
                            >
                              {event.type}
                            </Badge>
                            {event.cpdPoints && event.cpdPoints > 0 && (
                              <Badge 
                                variant="secondary" 
                                className="bg-green-100 text-green-700"
                                data-testid={`event-cpd-points-${event.id}`}
                              >
                                {event.cpdPoints} CPD Points
                              </Badge>
                            )}
                          </div>
                          
                          <h4 className="text-xl font-semibold text-card-foreground mb-2" data-testid={`event-title-${event.id}`}>
                            {event.title}
                          </h4>
                          <p className="text-muted-foreground mb-4" data-testid={`event-description-${event.id}`}>
                            {event.description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-primary mr-2" />
                              <span data-testid={`event-date-${event.id}`}>
                                {new Date(event.startDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-primary mr-2" />
                              <span data-testid={`event-time-${event.id}`}>
                                {new Date(event.startDate).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 text-primary mr-2" />
                              <span data-testid={`event-location-${event.id}`}>
                                {event.location}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 text-primary mr-2" />
                              <span data-testid={`event-price-${event.id}`}>
                                ${event.price}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-primary mr-2" />
                              <span data-testid={`event-capacity-${event.id}`}>
                                0/{event.capacity} registered
                              </span>
                            </div>
                            <div className="flex items-center">
                              <User className="w-4 h-4 text-primary mr-2" />
                              <span data-testid={`event-instructor-${event.id}`}>
                                {event.instructor}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 text-right">
                          <div className="text-2xl font-bold text-card-foreground mb-2">0</div>
                          <div className="text-sm text-muted-foreground mb-4">registrations</div>
                          <Button 
                            size="sm"
                            className="gradient-button text-white border-0"
                            data-testid={`button-manage-event-${event.id}`}
                          >
                            Manage Event
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming events</p>
                <Button 
                  className="mt-4 bg-egyptian-blue hover:bg-egyptian-blue/90"
                  onClick={() => setIsCreateDialogOpen(true)}
                  data-testid="button-create-first-event"
                >
                  Create Your First Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <FormFooter />
      </div>
    </div>
  );
}
