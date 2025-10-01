import { useState } from "react";
import { ModernModal } from "@/components/ui/modern-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BulkImportModal } from "./BulkImportModal";
import {
  FileText, Download, Mail, RefreshCw, AlertTriangle,
  Send, Users, Building2, Calendar, Settings, Archive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Review Applications Modal
export function ReviewApplicationsModal({ open, onOpenChange, onSuccess }: ModalProps) {
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const handleReviewAction = (action: string) => {
    toast({
      title: "Application Reviewed",
      description: `Application has been ${action}.`,
    });
    if (onSuccess) onSuccess();
  };

  return (
    <ModernModal
      open={open}
      onOpenChange={onOpenChange}
      title="Review Applications"
      subtitle="Process pending membership applications"
      icon={FileText}
      colorVariant="green"
      maxWidth="5xl"
      footer={{
        secondary: {
          label: "Close",
          onClick: () => onOpenChange(false)
        }
      }}
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-800">Pending Applications</h3>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="initial_review">Initial Review</SelectItem>
                <SelectItem value="document_verification">Document Review</SelectItem>
                <SelectItem value="background_check">Background Check</SelectItem>
                <SelectItem value="committee_review">Committee Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {/* Sample Applications */}
            {[
              { id: 1, name: "John Smith", type: "Individual", status: "initial_review", priority: "high" },
              { id: 2, name: "ABC Real Estate", type: "Organization", status: "document_verification", priority: "medium" },
              { id: 3, name: "Jane Doe", type: "Individual", status: "committee_review", priority: "low" }
            ].map((app) => (
              <div key={app.id} className="bg-white/80 p-4 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      app.type === "Individual" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                    }`}>
                      {app.type === "Individual" ? <Users className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="font-medium text-green-800">{app.name}</div>
                      <div className="text-sm text-green-600">{app.type} Application</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={app.priority === "high" ? "destructive" : app.priority === "medium" ? "default" : "secondary"}>
                      {app.priority} priority
                    </Badge>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      {app.status.replace(/_/g, " ")}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleReviewAction("approved")} className="bg-green-500 hover:bg-green-600 text-white">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReviewAction("rejected")}>
                        Reject
                      </Button>
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModernModal>
  );
}

// Export Data Modal
export function ExportDataModal({ open, onOpenChange, type }: ModalProps & { type: "members" | "organizations" }) {
  const [exportFormat, setExportFormat] = useState("csv");
  const [dateRange, setDateRange] = useState("all");
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${type} data in ${exportFormat.toUpperCase()} format...`,
    });
    onOpenChange(false);
  };

  return (
    <ModernModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Export ${type === "members" ? "Members" : "Organizations"}`}
      subtitle="Download data in various formats"
      icon={Download}
      colorVariant="purple"
      maxWidth="2xl"
      footer={{
        secondary: {
          label: "Cancel",
          onClick: () => onOpenChange(false)
        },
        primary: {
          label: "Export Data",
          onClick: handleExport
        }
      }}
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">Export Configuration</h3>

          <div className="space-y-4">
            <div>
              <Label className="text-purple-700 font-medium">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-purple-700 font-medium">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="last_quarter">Last Quarter</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white/60 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Included Fields:</h4>
              <div className="flex flex-wrap gap-2">
                {(type === "members" ? [
                  "Name", "Email", "Phone", "Member Type", "Status", "Join Date", "CPD Points"
                ] : [
                  "Organization Name", "Email", "Phone", "Type", "Registration", "Status", "Members Count"
                ]).map((field) => (
                  <Badge key={field} variant="outline" className="text-purple-700 border-purple-300">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernModal>
  );
}

// Send Notifications Modal
export function SendNotificationsModal({ open, onOpenChange, onSuccess }: ModalProps) {
  const [notificationType, setNotificationType] = useState("email");
  const [recipients, setRecipients] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSendNotification = () => {
    if (!subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Notifications Sent",
      description: `${notificationType} notifications sent to ${recipients} recipients.`,
    });
    if (onSuccess) onSuccess();
    onOpenChange(false);
  };

  return (
    <ModernModal
      open={open}
      onOpenChange={onOpenChange}
      title="Send Notifications"
      subtitle="Send bulk notifications to members"
      icon={Mail}
      colorVariant="cyan"
      maxWidth="3xl"
      footer={{
        secondary: {
          label: "Cancel",
          onClick: () => onOpenChange(false)
        },
        primary: {
          label: "Send Notifications",
          onClick: handleSendNotification
        }
      }}
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
          <h3 className="text-lg font-semibold text-cyan-800 mb-4">Notification Settings</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-cyan-700 font-medium">Notification Type</Label>
              <Select value={notificationType} onValueChange={setNotificationType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="both">Email + SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-cyan-700 font-medium">Recipients</Label>
              <Select value={recipients} onValueChange={setRecipients}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="active">Active Members Only</SelectItem>
                  <SelectItem value="organizations">Organizations Only</SelectItem>
                  <SelectItem value="individuals">Individual Members Only</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-cyan-700 font-medium">Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter notification subject..."
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-cyan-700 font-medium">Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                className="mt-2 min-h-32"
              />
            </div>

            <div className="bg-white/60 p-4 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cyan-700 font-medium">Estimated Recipients:</span>
                <Badge className="bg-cyan-100 text-cyan-800">
                  {recipients === "all" ? "2,485" : recipients === "active" ? "2,234" : recipients === "organizations" ? "156" : "2,329"} recipients
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernModal>
  );
}

// Manage Renewals Modal
export function ManageRenewalsModal({ open, onOpenChange, onSuccess }: ModalProps) {
  const [renewalType, setRenewalType] = useState("upcoming");
  const { toast } = useToast();

  const handleRenewalAction = (action: string, memberId: string) => {
    toast({
      title: "Renewal Processed",
      description: `Renewal has been ${action} for member ${memberId}.`,
    });
    if (onSuccess) onSuccess();
  };

  return (
    <ModernModal
      open={open}
      onOpenChange={onOpenChange}
      title="Manage Renewals"
      subtitle="Process membership renewals and renewals"
      icon={RefreshCw}
      colorVariant="orange"
      maxWidth="5xl"
      footer={{
        secondary: {
          label: "Close",
          onClick: () => onOpenChange(false)
        }
      }}
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-orange-800">Membership Renewals</h3>
            <Select value={renewalType} onValueChange={setRenewalType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming Renewals</SelectItem>
                <SelectItem value="overdue">Overdue Renewals</SelectItem>
                <SelectItem value="completed">Recently Completed</SelectItem>
                <SelectItem value="pending_payment">Pending Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 p-4 rounded-lg text-center border border-orange-200">
              <div className="text-2xl font-bold text-orange-800">234</div>
              <div className="text-sm text-orange-600">Due This Month</div>
            </div>
            <div className="bg-white/80 p-4 rounded-lg text-center border border-red-200">
              <div className="text-2xl font-bold text-red-800">45</div>
              <div className="text-sm text-red-600">Overdue</div>
            </div>
            <div className="bg-white/80 p-4 rounded-lg text-center border border-green-200">
              <div className="text-2xl font-bold text-green-800">189</div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="bg-white/80 p-4 rounded-lg text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-800">67</div>
              <div className="text-sm text-blue-600">Pending Payment</div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { id: "MBR-001", name: "John Smith", dueDate: "2024-01-15", status: "due_soon", amount: "$150" },
              { id: "MBR-002", name: "Jane Doe", dueDate: "2024-01-10", status: "overdue", amount: "$150" },
              { id: "MBR-003", name: "ABC Real Estate", dueDate: "2024-01-20", status: "pending_payment", amount: "$500" }
            ].map((renewal) => (
              <div key={renewal.id} className="bg-white/80 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-orange-800">{renewal.name}</div>
                      <div className="text-sm text-orange-600">{renewal.id} • Due: {renewal.dueDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-orange-100 text-orange-800">{renewal.amount}</Badge>
                    <Badge variant={renewal.status === "overdue" ? "destructive" : "outline"}>
                      {renewal.status.replace(/_/g, " ")}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleRenewalAction("processed", renewal.id)}>
                        Process
                      </Button>
                      <Button size="sm" variant="outline">
                        Send Reminder
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModernModal>
  );
}

// Compliance Check Modal
export function ComplianceCheckModal({ open, onOpenChange, onSuccess }: ModalProps) {
  const [complianceType, setComplianceType] = useState("all");
  const { toast } = useToast();

  const handleComplianceAction = (action: string) => {
    toast({
      title: "Compliance Action",
      description: `${action} compliance check initiated.`,
    });
    if (onSuccess) onSuccess();
  };

  return (
    <ModernModal
      open={open}
      onOpenChange={onOpenChange}
      title="Compliance Monitoring"
      subtitle="Monitor and enforce regulatory compliance"
      icon={AlertTriangle}
      colorVariant="red"
      maxWidth="4xl"
      footer={{
        secondary: {
          label: "Close",
          onClick: () => onOpenChange(false)
        },
        primary: {
          label: "Generate Report",
          onClick: () => handleComplianceAction("Report generated")
        }
      }}
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Compliance Overview</h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/80 p-4 rounded-lg text-center border border-green-200">
              <div className="text-2xl font-bold text-green-800">2,156</div>
              <div className="text-sm text-green-600">Compliant</div>
            </div>
            <div className="bg-white/80 p-4 rounded-lg text-center border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-800">89</div>
              <div className="text-sm text-yellow-600">Warning</div>
            </div>
            <div className="bg-white/80 p-4 rounded-lg text-center border border-red-200">
              <div className="text-2xl font-bold text-red-800">12</div>
              <div className="text-sm text-red-600">Non-Compliant</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-red-700 font-medium">Compliance Check Type</Label>
              <Select value={complianceType} onValueChange={setComplianceType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Compliance Areas</SelectItem>
                  <SelectItem value="cpd">CPD Requirements</SelectItem>
                  <SelectItem value="licensing">License Validity</SelectItem>
                  <SelectItem value="insurance">Insurance Coverage</SelectItem>
                  <SelectItem value="trust_accounts">Trust Account Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {[
                { type: "CPD Shortfall", member: "John Smith", severity: "high", description: "Missing 8 CPD points for 2024" },
                { type: "License Expiry", member: "ABC Real Estate", severity: "medium", description: "License expires in 30 days" },
                { type: "Insurance Gap", member: "Jane Doe", severity: "high", description: "Professional indemnity insurance expired" }
              ].map((issue, index) => (
                <div key={index} className="bg-white/80 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-red-800">{issue.type}</div>
                      <div className="text-sm text-red-600">{issue.member} • {issue.description}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={issue.severity === "high" ? "destructive" : "secondary"}>
                        {issue.severity} priority
                      </Badge>
                      <Button size="sm" onClick={() => handleComplianceAction("Investigation started")}>
                        Investigate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModernModal>
  );
}