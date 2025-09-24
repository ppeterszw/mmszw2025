import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, CheckCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Simplified Add Member Form Schema
const addMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  surname: z.string().min(1, "Surname is required").max(50, "Surname must be less than 50 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine(date => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 80;
  }, "Age must be between 18 and 80 years"),
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  nationality: z.string().min(1, "Nationality is required"),
  email: z.string().email("Invalid email address"),
  memberType: z.enum(["real_estate_agent", "property_manager", "principal_agent", "negotiator"], {
    errorMap: () => ({ message: "Please select a member type" })
  }),
  educationLevel: z.enum(["normal_entry", "mature_entry"], {
    errorMap: () => ({ message: "Please select education/entry type" })
  }),
  employmentStatus: z.enum(["self_employed", "employed"], {
    errorMap: () => ({ message: "Please select employment status" })
  }),
  organizationName: z.string().optional(),
}).refine(data => {
  // If employed, organization name is required
  if (data.employmentStatus === "employed" && !data.organizationName?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Organization/firm name is required when employed",
  path: ["organizationName"]
});

type AddMemberFormData = z.infer<typeof addMemberSchema>;

interface SimplifiedAddMemberFormProps {
  onSuccess?: () => void;
}

export function SimplifiedAddMemberForm({ onSuccess }: SimplifiedAddMemberFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [newMember, setNewMember] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      dateOfBirth: "",
      countryOfResidence: "Zimbabwe",
      nationality: "Zimbabwean",
      email: "",
      memberType: undefined,
      educationLevel: undefined,
      employmentStatus: undefined,
      organizationName: "",
    },
  });

  const createMemberMutation = useMutation({
    mutationFn: async (data: AddMemberFormData) => {
      return apiRequest("POST", "/api/admin/members/simplified-add", data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      setNewMember(response.member);
      setIsOpen(false);
      setIsSuccessOpen(true);
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add member. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = async (data: AddMemberFormData) => {
    // Calculate age to validate entry type
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() - 
      (today.getMonth() < birthDate.getMonth() || 
       (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);

    // Validate mature entry age requirement
    if (data.educationLevel === "mature_entry" && age < 27) {
      form.setError("educationLevel", {
        message: "Mature Entry requires age 27 years and above"
      });
      return;
    }

    createMemberMutation.mutate(data);
  };

  const watchEmploymentStatus = form.watch("employmentStatus");

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="h-24 flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 border-0"
            data-testid="button-simplified-add-member"
          >
            <UserPlus className="w-6 h-6 mb-2" />
            <span className="text-sm">Add Member</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Individual Member</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Create a new member profile. An email notification will be sent for verification and profile completion.
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-first-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surname *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-surname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-date-of-birth" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="countryOfResidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of Residence *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-country">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                            <SelectItem value="South Africa">South Africa</SelectItem>
                            <SelectItem value="Botswana">Botswana</SelectItem>
                            <SelectItem value="Namibia">Namibia</SelectItem>
                            <SelectItem value="Zambia">Zambia</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-nationality">
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Zimbabwean">Zimbabwean</SelectItem>
                            <SelectItem value="South African">South African</SelectItem>
                            <SelectItem value="British">British</SelectItem>
                            <SelectItem value="American">American</SelectItem>
                            <SelectItem value="Australian">Australian</SelectItem>
                            <SelectItem value="Canadian">Canadian</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Information</h3>
                
                <FormField
                  control={form.control}
                  name="memberType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-member-type">
                            <SelectValue placeholder="Select member type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="real_estate_agent">Real Estate Agent</SelectItem>
                          <SelectItem value="property_manager">Property Manager</SelectItem>
                          <SelectItem value="principal_agent">Principal Agent</SelectItem>
                          <SelectItem value="negotiator">Negotiator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education/Entry Type *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3"
                          data-testid="radio-education-level"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="normal_entry" id="normal-entry" />
                            <Label htmlFor="normal-entry" className="flex-1">
                              <div className="font-medium">Normal Entry</div>
                              <div className="text-sm text-muted-foreground">
                                Has 5 O'levels and 2 A'levels (or equivalent qualifications)
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mature_entry" id="mature-entry" />
                            <Label htmlFor="mature-entry" className="flex-1">
                              <div className="font-medium">Mature Entry</div>
                              <div className="text-sm text-muted-foreground">
                                Age 27 years and above with 5 O'levels (or equivalent experience)
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Status *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2"
                          data-testid="radio-employment-status"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="self_employed" id="self-employed" />
                            <Label htmlFor="self-employed">Self-Employed</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="employed" id="employed" />
                            <Label htmlFor="employed">Employed</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchEmploymentStatus === "employed" && (
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization/Firm Name *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Enter organization or firm name"
                            data-testid="input-organization-name" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMemberMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-add-member"
                >
                  {createMemberMutation.isPending ? "Adding Member..." : "Add Member"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Member Added Successfully</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {newMember && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm"><strong>Name:</strong> {newMember.firstName} {newMember.surname}</p>
                <p className="text-sm"><strong>Email:</strong> {newMember.email}</p>
                <p className="text-sm"><strong>Member ID:</strong> {newMember.membershipNumber}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              A verification email has been sent to the member. They can now verify their email and complete their profile with additional details and documents.
            </p>
            <Button
              onClick={() => setIsSuccessOpen(false)}
              className="w-full"
              data-testid="button-close-success"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}