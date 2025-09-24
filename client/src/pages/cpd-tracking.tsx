import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormHeader } from "@/components/ui/form-header";
import { MemberHeader } from "@/components/MemberHeader";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FormFooter } from "@/components/ui/form-footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { 
  Plus, Trophy, Calendar, CheckCircle, Clock, 
  BookOpen, Award, Target, TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CpdActivity, Event } from "@shared/schema";

const cpdActivitySchema = z.object({
  activityTitle: z.string().min(5, "Activity title must be at least 5 characters"),
  activityType: z.enum(["workshop", "seminar", "training", "conference", "webinar", "self_study", "professional_meeting"]),
  pointsEarned: z.number().min(1, "Points must be at least 1").max(50, "Points cannot exceed 50 per activity"),
  completionDate: z.string().min(1, "Completion date is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  certificateUrl: z.string().optional()
});

type CpdActivityFormData = z.infer<typeof cpdActivitySchema>;

export default function CpdTracking() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: cpdActivities = [], isLoading } = useQuery<CpdActivity[]>({
    queryKey: ["/api/cpd-activities"],
    enabled: !!user,
  });

  const { data: upcomingEvents = [] } = useQuery<Event[]>({
    queryKey: ["/api/events", "upcoming=true"],
  });

  const form = useForm<CpdActivityFormData>({
    resolver: zodResolver(cpdActivitySchema),
    defaultValues: {
      activityTitle: "",
      activityType: "workshop",
      pointsEarned: 1,
      completionDate: "",
      description: "",
      certificateUrl: ""
    }
  });

  const addActivityMutation = useMutation({
    mutationFn: (data: CpdActivityFormData) => 
      apiRequest("POST", "/api/cpd-activities", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cpd-activities"] });
      toast({
        title: "CPD Activity Added",
        description: "Your CPD activity has been recorded successfully."
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add CPD activity. Please try again.",
        variant: "destructive"
      });
    }
  });

  const totalPoints = cpdActivities.reduce((sum, activity) => sum + (activity.pointsEarned || 0), 0);
  const currentYear = new Date().getFullYear();
  const requiredPoints = 30; // Annual CPD requirement
  const progress = Math.min((totalPoints / requiredPoints) * 100, 100);

  const currentYearActivities = cpdActivities.filter(activity => 
    new Date(activity.completionDate || "").getFullYear() === currentYear
  );

  const onSubmit = (data: CpdActivityFormData) => {
    addActivityMutation.mutate(data);
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case "workshop":
        return <BookOpen className="w-4 h-4" />;
      case "seminar":
        return <Award className="w-4 h-4" />;
      case "training":
        return <Target className="w-4 h-4" />;
      case "conference":
        return <Trophy className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="min-h-screen bg-background">
      <MemberHeader currentPage="cpd" title="EACZ Member Portal" subtitle="CPD Tracking" />
      
      <div className="p-6">
        <PageBreadcrumb items={[
          { label: "Member Portal", href: "/member-portal" },
          { label: "CPD Tracking" }
        ]} className="mb-6" />
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">CPD Tracking</h1>
              <p className="text-muted-foreground">Continuing Professional Development Management</p>
            </div>
        {/* CPD Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total CPD Points ({currentYear})</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalPoints}</div>
              <p className="text-xs text-muted-foreground">
                of {requiredPoints} required points
              </p>
              <Progress value={progress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{currentYearActivities.length}</div>
              <p className="text-xs text-muted-foreground">
                This year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
              <p className="text-xs text-muted-foreground">
                {totalPoints >= requiredPoints ? "Requirements met!" : `${requiredPoints - totalPoints} points needed`}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activities">My CPD Activities</TabsTrigger>
            <TabsTrigger value="opportunities">CPD Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">CPD Activities</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-button text-white border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add CPD Activity</DialogTitle>
                    <DialogDescription>
                      Add a new Continuing Professional Development activity to track your learning progress.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="activityTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter activity title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="activityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Type</FormLabel>
                            <FormControl>
                              <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                {...field}
                              >
                                <option value="workshop">Workshop</option>
                                <option value="seminar">Seminar</option>
                                <option value="training">Training</option>
                                <option value="conference">Conference</option>
                                <option value="webinar">Webinar</option>
                                <option value="self_study">Self Study</option>
                                <option value="professional_meeting">Professional Meeting</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="pointsEarned"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Points Earned</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  max="50"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="completionDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Completion Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the activity and what you learned"
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="certificateUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certificate URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="gradient-button text-white border-0"
                          disabled={addActivityMutation.isPending}
                        >
                          {addActivityMutation.isPending ? "Adding..." : "Add Activity"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading CPD activities...</div>
            ) : currentYearActivities.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentYearActivities.map((activity) => (
                  <Card key={activity.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getActivityTypeIcon(activity.activityType)}
                          <CardTitle className="text-lg">{activity.activityTitle}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(activity.isVerified || false)}>
                          {activity.isVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{activity.activityType}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {activity.pointsEarned} CPD Points
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(activity.completionDate || "").toLocaleDateString()}
                          </span>
                        </div>
                        {activity.certificateUrl && (
                          <a 
                            href={activity.certificateUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            View Certificate
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No CPD Activities Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start tracking your professional development activities to meet your annual requirements.
                  </p>
                  <Button 
                    className="gradient-button text-white border-0"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    Add Your First Activity
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <h2 className="text-2xl font-bold">CPD Opportunities</h2>
            
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge variant="outline">{event.cpdPoints} CPD Points</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(event.startDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="font-medium">
                            ${event.price || 0}
                          </span>
                          <Button size="sm" className="gradient-button text-white border-0">
                            Register
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
                  <p className="text-muted-foreground">
                    Check back later for new CPD opportunities and events.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}