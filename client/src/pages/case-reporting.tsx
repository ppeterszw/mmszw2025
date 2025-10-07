import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, AlertTriangle, CheckCircle, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import logoUrl from "@assets/eaclogo_1756763778691.png";

const caseReportSchema = z.object({
  reporterName: z.string().min(2, "Name is required"),
  reporterEmail: z.string().email("Valid email is required"),
  reporterPhone: z.string().optional(),
  caseType: z.enum(["complaint", "violation", "malpractice", "misconduct", "fraud", "breach_of_duty"]),
  respondentType: z.enum(["individual", "firm"]),
  respondentName: z.string().min(2, "Respondent name is required"),
  respondentLicense: z.string().optional(),
  incidentDate: z.string().optional(),
  incidentLocation: z.string().optional(),
  description: z.string().min(50, "Please provide a detailed description (at least 50 characters)"),
  evidence: z.string().optional(),
  witnesses: z.string().optional(),
  previousAction: z.string().optional(),
  expectedOutcome: z.string().optional(),
  agreement: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
  truthfulness: z.boolean().refine(val => val === true, "You must confirm the information is truthful"),
});

type CaseReportData = z.infer<typeof caseReportSchema>;

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  membershipNumber: string;
  memberType: string;
}

interface Organization {
  id: string;
  name: string;
  registrationNumber: string;
}

export default function CaseReporting() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<CaseReportData>({
    resolver: zodResolver(caseReportSchema),
    defaultValues: {
      reporterName: "",
      reporterEmail: "",
      reporterPhone: "",
      caseType: "complaint",
      respondentType: "individual",
      respondentName: "",
      respondentLicense: "",
      incidentDate: "",
      incidentLocation: "",
      description: "",
      evidence: "",
      witnesses: "",
      previousAction: "",
      expectedOutcome: "",
      agreement: false,
      truthfulness: false,
    },
  });

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["/api/members"],
    enabled: form.watch("respondentType") === "individual",
  });

  const { data: organizations = [] } = useQuery<Organization[]>({
    queryKey: ["/api/organizations"],
    enabled: form.watch("respondentType") === "firm",
  });

  const submitCaseMutation = useMutation({
    mutationFn: async (data: CaseReportData) => {
      const res = await apiRequest("POST", "/api/cases/report", data);
      return await res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      toast({
        title: "Case Reported Successfully",
        description: "Your case has been submitted and assigned a tracking number.",
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

  const onSubmit = (data: CaseReportData) => {
    submitCaseMutation.mutate(data);
  };

  const getCaseTypeDisplay = (type: string) => {
    switch (type) {
      case "complaint":
        return "General Complaint";
      case "violation":
        return "Regulatory Violation";
      case "malpractice":
        return "Professional Malpractice";
      case "misconduct":
        return "Professional Misconduct";
      case "fraud":
        return "Fraud/Deception";
      case "breach_of_duty":
        return "Breach of Fiduciary Duty";
      default:
        return type;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="gradient-bg py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
                  <img src={logoUrl} alt="EACZ Logo" className="w-full h-full object-contain" />
                </div>
                <div className="text-white">
                  <h1 className="text-xl font-bold">Estate Agents Council</h1>
                  <p className="text-blue-100 text-sm">of Zimbabwe</p>
                </div>
              </div>
              <Button 
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                onClick={() => setLocation("/")}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Case Submitted Successfully</h1>
            <div className="bg-white border shadow-lg rounded-lg p-8 mb-6">
              <p className="text-gray-700 mb-4">
                Thank you for submitting your case. Your report has been received and assigned a case number.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">What happens next?</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Your case will be reviewed by our team within 5 business days</li>
                  <li>We may contact you for additional information if needed</li>
                  <li>You'll receive updates via email as your case progresses</li>
                  <li>A formal response will be provided within 30 days</li>
                </ol>
              </div>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => setLocation("/cases/track")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Track Your Case
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/")}
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-egyptian-blue to-powder-blue py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Lodge a Complaint
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Report professional misconduct, violations, or file a complaint against a registered estate agent or firm
            </p>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-white text-egyptian-blue hover:bg-white/90 border-0 font-semibold"
                onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
              >
                <FileText className="w-4 h-4 mr-2" />
                File a Complaint
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                onClick={() => setLocation("/")}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto">
          <PageBreadcrumb items={[
            { label: "Case Management", href: "/case-management" },
            { label: "Report a Case" }
          ]} className="mb-6" />
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 p-2">
              <img src={logoUrl} alt="Estate Agents Council Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Case</h1>
            <p className="text-gray-600">
              Submit a complaint or report misconduct against a registered estate agent or firm.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} mr-2`}>1</div>
                <span className="text-sm">Reporter Info</span>
              </div>
              <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} mr-2`}>2</div>
                <span className="text-sm">Case Details</span>
              </div>
              <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} mr-2`}>3</div>
                <span className="text-sm">Review & Submit</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="bg-white border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    {step === 1 && "Reporter Information"}
                    {step === 2 && "Case Details"}
                    {step === 3 && "Review & Confirmation"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="reporterName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" data-testid="input-reporter-name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reporterEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email address" data-testid="input-reporter-email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reporterPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" data-testid="input-reporter-phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="caseType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type of Case *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-case-type">
                                  <SelectValue placeholder="Select case type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="complaint">General Complaint</SelectItem>
                                <SelectItem value="violation">Regulatory Violation</SelectItem>
                                <SelectItem value="malpractice">Professional Malpractice</SelectItem>
                                <SelectItem value="misconduct">Professional Misconduct</SelectItem>
                                <SelectItem value="fraud">Fraud/Deception</SelectItem>
                                <SelectItem value="breach_of_duty">Breach of Fiduciary Duty</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="respondentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type of Respondent *</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="individual" id="individual" />
                                  <Label htmlFor="individual">Individual Agent</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="firm" id="firm" />
                                  <Label htmlFor="firm">Estate Agency Firm</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="respondentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {form.watch("respondentType") === "individual" ? "Agent Name" : "Firm Name"} *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={`Enter ${form.watch("respondentType") === "individual" ? "agent" : "firm"} name`}
                                data-testid="input-respondent-name"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="respondentLicense"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License/Registration Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter license or registration number if known"
                                data-testid="input-respondent-license"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="incidentDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Incident Date</FormLabel>
                              <FormControl>
                                <Input type="date" data-testid="input-incident-date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="incidentLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Incident Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Where did this occur?" data-testid="input-incident-location" {...field} />
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
                            <FormLabel>Detailed Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide a detailed description of the incident, including what happened, when, and any relevant circumstances..."
                                rows={6}
                                data-testid="textarea-case-description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="evidence"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Evidence/Documentation</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe any evidence you have (documents, emails, photos, etc.)..."
                                rows={3}
                                data-testid="textarea-evidence"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="witnesses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Witnesses</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List any witnesses to the incident, including their contact information if available..."
                                rows={3}
                                data-testid="textarea-witnesses"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expectedOutcome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Outcome</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="What resolution are you seeking? (e.g., apology, compensation, disciplinary action, etc.)"
                                rows={3}
                                data-testid="textarea-expected-outcome"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      {/* Review Summary */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Case Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div><strong>Type:</strong> {getCaseTypeDisplay(form.watch("caseType"))}</div>
                          <div><strong>Respondent:</strong> {form.watch("respondentName")} ({form.watch("respondentType")})</div>
                          <div><strong>Reporter:</strong> {form.watch("reporterName")} ({form.watch("reporterEmail")})</div>
                        </div>
                      </div>

                      {/* Declarations */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="truthfulness"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-truthfulness"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Declaration of Truthfulness *</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  I declare that the information provided is true and accurate to the best of my knowledge.
                                </p>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="agreement"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-agreement"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Terms and Conditions *</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  I agree to the terms and conditions and understand that false reporting may result in legal action.
                                </p>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Important:</strong> Your case will be reviewed by the Estate Agents Council. 
                          You may be contacted for additional information. False or malicious reports may result in legal consequences.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(Math.max(1, step - 1))}
                      disabled={step === 1}
                    >
                      Previous
                    </Button>
                    
                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={() => setStep(Math.min(3, step + 1))}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={submitCaseMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        data-testid="button-submit-case"
                      >
                        {submitCaseMutation.isPending ? "Submitting..." : "Submit Case"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}