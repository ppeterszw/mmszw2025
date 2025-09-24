import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ModernModal } from "@/components/ui/modern-modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Filter, Eye, Edit, AlertTriangle, FileText, Users, Clock, CheckCircle, User, Settings, Trash2, Download, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { AdminHeader } from "@/components/AdminHeader";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { FormFooter } from "@/components/ui/form-footer";
import type { Case } from "@shared/schema";
import { insertCaseSchema } from "@shared/schema";

type CaseFormData = z.infer<typeof insertCaseSchema>;

export default function CaseManagement() {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    type: ""
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isPriorityQueueOpen, setIsPriorityQueueOpen] = useState(false);
  const [isBulkResolveDialogOpen, setIsBulkResolveDialogOpen] = useState(false);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [viewingCase, setViewingCase] = useState<Case | null>(null);
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

  const { data: cases = [], isLoading, refetch } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });

  // Query for staff users for case assignment
  const { data: staffUsers = [] } = useQuery({
    queryKey: ["/api/cases/staff"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/cases/staff");
      return await res.json();
    },
  });

  // Query for priority cases
  const { data: priorityCases = [] } = useQuery<Case[]>({
    queryKey: ["/api/cases", { priority: "high" }],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/cases?priority=high");
      return await res.json();
    },
    enabled: isPriorityQueueOpen,
  });

  const form = useForm<CaseFormData>({
    resolver: zodResolver(insertCaseSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "complaint",
      priority: "medium",
      submittedBy: "",
      submittedByEmail: "",
    },
  });

  const createCaseMutation = useMutation({
    mutationFn: async (data: CaseFormData) => {
      const res = await apiRequest("POST", "/api/cases", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Case Created",
        description: "New case has been successfully created.",
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

  // Case assignment mutation
  const assignCaseMutation = useMutation({
    mutationFn: async ({ caseId, assignedTo }: { caseId: string; assignedTo?: string }) => {
      const res = await apiRequest("PUT", `/api/cases/${caseId}/assign`, { assignedTo });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      setIsAssignDialogOpen(false);
      toast({
        title: "Case Assigned",
        description: "Case has been successfully assigned.",
      });
    },
  });

  // Bulk operations mutation
  const bulkActionMutation = useMutation({
    mutationFn: async (data: { caseIds: string[]; action: string; assignedTo?: string; resolution?: string }) => {
      const res = await apiRequest("POST", "/api/cases/bulk-action", data);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      setSelectedCases([]);
      setIsBulkResolveDialogOpen(false);
      toast({
        title: "Bulk Action Completed",
        description: `Successfully ${variables.action}ed ${variables.caseIds.length} cases.`,
      });
    },
  });

  // Case status update mutation  
  const updateCaseStatusMutation = useMutation({
    mutationFn: async ({ caseId, updates }: { caseId: string; updates: Partial<Case> }) => {
      const res = await apiRequest("PUT", `/api/cases/${caseId}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      toast({
        title: "Case Updated",
        description: "Case status has been updated successfully.",
      });
    },
  });

  // Wrapper mutations for better UX
  const bulkAssignCasesMutation = {
    isPending: bulkActionMutation.isPending,
    mutate: (params: { caseIds: string[]; assignedTo: string }) => 
      bulkActionMutation.mutate({ 
        action: 'assign', 
        caseIds: params.caseIds, 
        assignedTo: params.assignedTo 
      })
  };

  const bulkResolveCasesMutation = {
    isPending: bulkActionMutation.isPending,
    mutate: (params: { caseIds: string[]; resolution: string }) => 
      bulkActionMutation.mutate({ 
        action: 'resolve', 
        caseIds: params.caseIds, 
        resolution: params.resolution 
      })
  };

  const onSubmit = (data: CaseFormData) => {
    createCaseMutation.mutate(data);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'in_progress': return 'secondary';
      case 'resolved': return 'outline';
      case 'closed': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredCases = cases.filter(caseItem => {
    return (!filters.status || caseItem.status === filters.status) &&
           (!filters.priority || caseItem.priority === filters.priority) &&
           (!filters.type || caseItem.type === filters.type);
  });

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentPage="cases" />
      
      <div className="p-6">
        <PageBreadcrumb items={[
          { label: "Admin Dashboard", href: "/admin-dashboard" },
          { label: "Case Management" }
        ]} className="mb-6" />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Case Management</h1>
          <p className="text-muted-foreground">Manage complaints and helpdesk cases</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="h-24 flex flex-col items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 border-0"
              data-testid="button-create-case"
            >
              <Plus className="w-6 h-6 mb-2" />
              <span className="text-sm">Create Case</span>
            </Button>
            <Button
              onClick={() => setIsAssignDialogOpen(true)}
              disabled={selectedCases.length === 0}
              className="h-24 flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 border-0 disabled:opacity-50"
              data-testid="button-assign-cases"
            >
              <UserPlus className="w-6 h-6 mb-2" />
              <span className="text-sm">Assign Cases</span>
            </Button>
            <Button
              onClick={async () => {
                const res = await apiRequest("GET", "/api/cases/reports/export?format=csv");
                const csvData = await res.text();
                const blob = new Blob([csvData], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cases-export.csv';
                a.click();
                window.URL.revokeObjectURL(url);
                toast({ title: "Report Generated", description: "Cases report has been downloaded." });
              }}
              className="h-24 flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 text-green-700 border-0"
              data-testid="button-case-reports"
            >
              <Download className="w-6 h-6 mb-2" />
              <span className="text-sm">Generate Reports</span>
            </Button>
            <Button
              onClick={() => setIsPriorityQueueOpen(true)}
              className="h-24 flex flex-col items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-700 border-0"
              data-testid="button-priority-queue"
            >
              <AlertTriangle className="w-6 h-6 mb-2" />
              <span className="text-sm">Priority Queue</span>
            </Button>
            <Button
              onClick={() => {
                if (viewingCase) {
                  toast({ 
                    title: "Case Timeline", 
                    description: `${viewingCase.title} - Status: ${viewingCase.status} - Created: ${new Date(viewingCase.createdAt!).toLocaleDateString()}` 
                  });
                } else {
                  toast({ title: "Case Timeline", description: "Select a case to view its timeline." });
                }
              }}
              className="h-24 flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-700 border-0"
              data-testid="button-case-timeline"
            >
              <Clock className="w-6 h-6 mb-2" />
              <span className="text-sm">Case Timeline</span>
            </Button>
            <Button
              onClick={() => setIsBulkResolveDialogOpen(true)}
              disabled={selectedCases.length === 0}
              className="h-24 flex flex-col items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-0 disabled:opacity-50"
              data-testid="button-bulk-resolve"
            >
              <CheckCircle className="w-6 h-6 mb-2" />
              <span className="text-sm">Bulk Resolve</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Case Dashboard</h2>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="gradient-button text-white border-0"
                data-testid="button-create-case"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Case
              </Button>
            </DialogTrigger>
          </Dialog>

          <ModernModal
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            title="Create New Case"
            subtitle="Add a new case to the system for tracking and management"
            icon={Plus}
            colorVariant="red"
            maxWidth="xl"
            footer={{
              secondary: {
                label: "Cancel",
                onClick: () => setIsCreateDialogOpen(false),
                variant: "outline",
                testId: "button-cancel-case"
              },
              primary: {
                label: createCaseMutation.isPending ? "Creating..." : "Create Case",
                onClick: form.handleSubmit(onSubmit),
                disabled: createCaseMutation.isPending,
                loading: createCaseMutation.isPending,
                testId: "button-submit-case"
              }
            }}
          >
            <div className="space-y-6">
              {/* Case Details Section */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Case Details
                </h3>
                <Form {...form}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-700 font-semibold">Case Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter case title" 
                              data-testid="input-case-title"
                              className="border-red-300 focus:border-red-500 bg-white/80"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-700 font-semibold">Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the case details..."
                              rows={4}
                              data-testid="textarea-case-description"
                              className="border-red-300 focus:border-red-500 bg-white/80"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </div>

              {/* Case Classification Section */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Classification & Priority
                </h3>
                <Form {...form}>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-orange-700 font-semibold">Case Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-case-type" className="border-orange-300 focus:border-orange-500 bg-white/80">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="complaint">Complaint</SelectItem>
                              <SelectItem value="inquiry">Inquiry</SelectItem>
                              <SelectItem value="dispute">Dispute</SelectItem>
                              <SelectItem value="violation">Violation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-orange-700 font-semibold">Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger data-testid="select-case-priority" className="border-orange-300 focus:border-orange-500 bg-white/80">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </div>

              {/* Contact Information Section */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Contact Information (Optional)
                </h3>
                <Form {...form}>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="submittedBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-700 font-semibold">Submitted By</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Name of person" 
                              data-testid="input-submitted-by"
                              className="border-blue-300 focus:border-blue-500 bg-white/80"
                              value={field.value || ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="submittedByEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-700 font-semibold">Contact Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="contact@email.com" 
                              data-testid="input-submitted-email"
                              className="border-blue-300 focus:border-blue-500 bg-white/80"
                              value={field.value || ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </div>
            </div>
          </ModernModal>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Status</label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger data-testid="filter-status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Priority</label>
                <Select 
                  value={filters.priority} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger data-testid="filter-priority">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Case Type</label>
                <Select 
                  value={filters.type} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger data-testid="filter-type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="inquiry">Inquiry</SelectItem>
                    <SelectItem value="dispute">Dispute</SelectItem>
                    <SelectItem value="violation">Violation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  className="w-full gradient-button text-white border-0"
                  onClick={() => refetch()}
                  data-testid="button-apply-filters"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Cases ({filteredCases.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-secondary rounded-lg h-16"></div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCases(filteredCases.map(c => c.id));
                          } else {
                            setSelectedCases([]);
                          }
                        }}
                        data-testid="checkbox-select-all"
                      />
                    </TableHead>
                    <TableHead>Case #</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCases.includes(caseItem.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCases([...selectedCases, caseItem.id]);
                            } else {
                              setSelectedCases(selectedCases.filter(id => id !== caseItem.id));
                            }
                          }}
                          data-testid={`checkbox-select-case-${caseItem.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium" data-testid={`case-number-${caseItem.id}`}>
                        {caseItem.caseNumber}
                      </TableCell>
                      <TableCell data-testid={`case-title-${caseItem.id}`}>
                        {caseItem.title}
                      </TableCell>
                      <TableCell data-testid={`case-type-${caseItem.id}`}>
                        {caseItem.type}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(caseItem.priority || 'medium')} data-testid={`case-priority-${caseItem.id}`}>
                          {caseItem.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(caseItem.status || 'open')} data-testid={`case-status-${caseItem.id}`}>
                          {caseItem.status}
                        </Badge>
                      </TableCell>
                      <TableCell data-testid={`case-submitted-by-${caseItem.id}`}>
                        {caseItem.submittedBy || "Anonymous"}
                      </TableCell>
                      <TableCell data-testid={`case-created-at-${caseItem.id}`}>
                        {new Date(caseItem.createdAt!).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => setViewingCase(caseItem)}
                            data-testid={`button-view-case-${caseItem.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => assignCaseMutation.mutate({ caseId: caseItem.id, assignedTo: user?.id })}
                            data-testid={`button-assign-case-${caseItem.id}`}
                          >
                            <User className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 text-orange-600 border-orange-200 hover:bg-orange-50"
                            onClick={() => updateCaseStatusMutation.mutate({ 
                              caseId: caseItem.id, 
                              updates: { status: caseItem.status === 'open' ? 'in_progress' : 'resolved' } 
                            })}
                            data-testid={`button-status-case-${caseItem.id}`}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to close this case?')) {
                                updateCaseStatusMutation.mutate({ 
                                  caseId: caseItem.id, 
                                  updates: { status: 'closed' } 
                                });
                              }
                            }}
                            data-testid={`button-close-case-${caseItem.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {!isLoading && filteredCases.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No cases found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <FormFooter />
      
      {/* Case Details Modal */}
      <ModernModal
        open={!!viewingCase}
        onOpenChange={() => setViewingCase(null)}
        title={`Case Details - ${viewingCase?.caseNumber || ""}`}
        subtitle={viewingCase?.title}
        icon={Eye}
        colorVariant="blue"
        maxWidth="3xl"
      >
          
        {viewingCase && (
          <div className="space-y-6">
            {/* Case Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Case Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-1 block">Case Number</label>
                    <p className="text-sm font-medium bg-blue-100 p-2 rounded border border-blue-300">{viewingCase.caseNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-1 block">Title</label>
                    <p className="text-sm font-medium bg-blue-100 p-2 rounded border border-blue-300">{viewingCase.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-1 block">Type & Priority</label>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">{viewingCase.type}</Badge>
                      <Badge variant={getPriorityColor(viewingCase.priority || 'medium')}>
                        {viewingCase.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-1 block">Status</label>
                    <Badge variant={getStatusColor(viewingCase.status || 'open')} className="text-sm p-2">
                      {viewingCase.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-1 block">Created</label>
                    <p className="text-sm font-medium bg-blue-100 p-2 rounded border border-blue-300">{new Date(viewingCase.createdAt!).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-1 block">Submitted By</label>
                    <p className="text-sm font-medium bg-blue-100 p-2 rounded border border-blue-300">{viewingCase.submittedBy || "Anonymous"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Case Description */}
            {viewingCase.description && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Case Description
                </h3>
                <div className="bg-purple-100 p-4 rounded-lg border border-purple-300">
                  <p className="text-sm text-purple-800 whitespace-pre-wrap font-medium">{viewingCase.description}</p>
                </div>
              </div>
            )}
            
            {/* Case Actions */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    assignCaseMutation.mutate({ caseId: viewingCase.id, assignedTo: user?.id });
                    setViewingCase(null);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Assign to Me
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    updateCaseStatusMutation.mutate({ 
                      caseId: viewingCase.id, 
                      updates: { status: viewingCase.status === 'open' ? 'in_progress' : 'resolved' } 
                    });
                    setViewingCase(null);
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Change Status
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to close this case?')) {
                      updateCaseStatusMutation.mutate({ 
                        caseId: viewingCase.id, 
                        updates: { status: 'closed' } 
                      });
                      setViewingCase(null);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Close Case
                </Button>
              </div>
            </div>
          </div>
        )}
      </ModernModal>

      {/* Priority Queue Dialog */}
      <ModernModal
        open={isPriorityQueueOpen}
        onOpenChange={setIsPriorityQueueOpen}
        title="Priority Queue"
        subtitle="High Priority Cases requiring immediate attention"
        icon={AlertTriangle}
        colorVariant="amber"
        maxWidth="3xl"
      >
        <div className="space-y-4">
          {filteredCases
            .filter(c => ['high', 'critical'].includes(c.priority || ''))
            .sort((a, b) => {
              const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
              return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
            })
            .map((caseItem) => (
              <div 
                key={caseItem.id} 
                className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 space-y-3"
                data-testid={`priority-case-${caseItem.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={getPriorityColor(caseItem.priority || 'medium')}
                      className="text-xs font-bold px-3 py-1"
                    >
                      🚨 {caseItem.priority?.toUpperCase()}
                    </Badge>
                    <h3 className="font-bold text-amber-800">{caseItem.title}</h3>
                  </div>
                  <Badge variant={getStatusColor(caseItem.status || 'open')} className="font-semibold">
                    {caseItem.status}
                  </Badge>
                </div>
                <div className="bg-amber-100 p-3 rounded-lg border border-amber-300">
                  <p className="text-sm font-medium text-amber-700 mb-1">Case #{caseItem.caseNumber}</p>
                  <p className="text-sm text-amber-800">{caseItem.description}</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => {
                      assignCaseMutation.mutate({ caseId: caseItem.id, assignedTo: user?.id });
                      setIsPriorityQueueOpen(false);
                    }}
                    data-testid={`button-assign-priority-${caseItem.id}`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Assign to Me
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => {
                      setViewingCase(caseItem);
                      setIsPriorityQueueOpen(false);
                    }}
                    data-testid={`button-view-priority-${caseItem.id}`}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          
          {filteredCases.filter(c => ['high', 'critical'].includes(c.priority || '')).length === 0 && (
            <div className="text-center py-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-green-800 text-lg mb-2">All Clear!</h3>
              <p className="text-green-700">No high priority cases requiring immediate attention</p>
            </div>
          )}
        </div>
      </ModernModal>

      {/* Assign Cases Dialog */}
      <ModernModal
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        title="Assign Cases"
        subtitle={`Assign ${selectedCases.length} selected cases to a staff member`}
        icon={UserPlus}
        colorVariant="green"
        maxWidth="2xl"
        footer={{
          secondary: {
            label: "Cancel",
            onClick: () => setIsAssignDialogOpen(false),
            variant: "outline",
            testId: "button-cancel-assignment"
          },
          primary: {
            label: bulkAssignCasesMutation.isPending ? "Assigning..." : "Assign Cases",
            onClick: () => {
              const form = document.getElementById('assign-cases-form') as HTMLFormElement;
              if (form) {
                const formData = new FormData(form);
                const assignedTo = formData.get('assignedTo') as string;
                
                bulkAssignCasesMutation.mutate({
                  caseIds: selectedCases,
                  assignedTo
                });
              }
            },
            disabled: bulkAssignCasesMutation.isPending,
            loading: bulkAssignCasesMutation.isPending,
            testId: "button-confirm-assignment"
          }
        }}
      >
        <form id="assign-cases-form">
          <div className="space-y-6">
            {/* Assignment Details Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Assignment Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-green-700 mb-2 block">Assign to Staff Member</label>
                  <select 
                    name="assignedTo" 
                    required
                    className="w-full p-3 border border-green-300 rounded-lg bg-white/80 focus:border-green-500 text-green-800 font-medium"
                    data-testid="select-staff-assignment"
                  >
                    <option value="">Select staff member...</option>
                    <option value={user?.id}>{user?.firstName} {user?.lastName} (Me)</option>
                    <option value="admin@eacz.com">System Administrator</option>
                    <option value="case.manager@eacz.com">Case Manager</option>
                    <option value="staff@eacz.com">Staff Member</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-green-700 mb-2 block">Assignment Note (Optional)</label>
                  <textarea 
                    name="note"
                    className="w-full p-3 border border-green-300 rounded-lg bg-white/80 focus:border-green-500 text-green-800"
                    rows={3}
                    placeholder="Add any notes about this assignment..."
                    data-testid="textarea-assignment-note"
                  />
                </div>
              </div>
            </div>
            
            {/* Selected Cases Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Selected Cases ({selectedCases.length})
              </h3>
              <div className="bg-blue-100 p-3 rounded-lg border border-blue-300 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {selectedCases.map(caseId => {
                    const caseItem = cases.find(c => c.id === caseId);
                    return caseItem ? (
                      <div key={caseId} className="bg-white p-2 rounded border border-blue-200">
                        <p className="text-sm font-bold text-blue-800">{caseItem.caseNumber}</p>
                        <p className="text-xs text-blue-700">{caseItem.title}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </form>
      </ModernModal>

      {/* Bulk Resolve Dialog */}
      <ModernModal
        open={isBulkResolveDialogOpen}
        onOpenChange={setIsBulkResolveDialogOpen}
        title="Bulk Resolve Cases"
        subtitle={`Mark ${selectedCases.length} selected cases as resolved`}
        icon={CheckCircle}
        colorVariant="emerald"
        maxWidth="2xl"
        footer={{
          secondary: {
            label: "Cancel",
            onClick: () => setIsBulkResolveDialogOpen(false),
            variant: "outline",
            testId: "button-cancel-bulk-resolve"
          },
          primary: {
            label: bulkResolveCasesMutation.isPending ? "Resolving..." : "Resolve Cases",
            onClick: () => {
              const form = document.getElementById('bulk-resolve-form') as HTMLFormElement;
              if (form) {
                const formData = new FormData(form);
                const resolution = formData.get('resolution') as string;
                
                bulkResolveCasesMutation.mutate({
                  caseIds: selectedCases,
                  resolution: resolution || "Cases resolved via bulk action"
                });
              }
            },
            disabled: bulkResolveCasesMutation.isPending,
            loading: bulkResolveCasesMutation.isPending,
            testId: "button-confirm-bulk-resolve"
          }
        }}
      >
        <form id="bulk-resolve-form">
          <div className="space-y-6">
            {/* Resolution Details Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Resolution Details
              </h3>
              <div>
                <label className="text-sm font-semibold text-emerald-700 mb-2 block">Resolution Summary</label>
                <textarea 
                  name="resolution"
                  className="w-full p-3 border border-emerald-300 rounded-lg bg-white/80 focus:border-emerald-500 text-emerald-800"
                  rows={4}
                  placeholder="Enter a summary of how these cases were resolved..."
                  data-testid="textarea-bulk-resolution"
                />
              </div>
            </div>
            
            {/* Cases to Resolve Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Cases to be Resolved ({selectedCases.length})
              </h3>
              <div className="bg-blue-100 p-3 rounded-lg border border-blue-300 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {selectedCases.map(caseId => {
                    const caseItem = cases.find(c => c.id === caseId);
                    return caseItem ? (
                      <div key={caseId} className="bg-white p-2 rounded border border-blue-200 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-blue-800">{caseItem.caseNumber}</p>
                          <p className="text-xs text-blue-700">{caseItem.title}</p>
                        </div>
                        <Badge variant={getPriorityColor(caseItem.priority || 'medium')} className="text-xs">
                          {caseItem.priority}
                        </Badge>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
            
            {/* Warning Section */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Important Notice
              </h3>
              <div className="bg-amber-100 p-3 rounded-lg border border-amber-300">
                <p className="text-sm font-medium text-amber-800">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  This action will mark all selected cases as resolved. This cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </form>
      </ModernModal>
    </div>
  );

}
