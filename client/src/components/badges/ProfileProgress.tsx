import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, Mail, Phone, Calendar, FileText, 
  Building2, Award, CheckCircle, AlertCircle
} from "lucide-react";
import type { Member, Document, Payment, CpdActivity } from "@shared/schema";

interface ProfileProgressProps {
  member: Member;
  documents?: Document[];
  payments?: Payment[];
  cpdActivities?: CpdActivity[];
}

interface ProgressItem {
  label: string;
  completed: boolean;
  icon: React.ComponentType<any>;
  weight: number;
  description: string;
}

export function ProfileProgress({ member, documents = [], payments = [], cpdActivities = [] }: ProfileProgressProps) {
  const progressItems = useMemo((): ProgressItem[] => [
    {
      label: "Basic Info",
      completed: !!(member.firstName && member.lastName && member.email),
      icon: User,
      weight: 15,
      description: "Name and email address"
    },
    {
      label: "Contact Details", 
      completed: !!(member.phone && member.nationalId),
      icon: Phone,
      weight: 10,
      description: "Phone number and National ID"
    },
    {
      label: "Date of Birth",
      completed: !!member.dateOfBirth,
      icon: Calendar,
      weight: 5,
      description: "Age verification for membership eligibility"
    },
    {
      label: "Organization",
      completed: !!member.organizationId,
      icon: Building2,
      weight: 15,
      description: "Associated real estate organization"
    },
    {
      label: "Member Type",
      completed: !!member.memberType,
      icon: Award,
      weight: 10,
      description: "Professional designation and role"
    },
    {
      label: "Documents Uploaded",
      completed: documents.length >= 3, // Require at least 3 documents
      icon: FileText,
      weight: 20,
      description: "Required professional documents and certificates"
    },
    {
      label: "Payment Completed",
      completed: payments.some(p => p.status === "completed"),
      icon: CheckCircle,
      weight: 15,
      description: "Membership or application fees paid"
    },
    {
      label: "CPD Activities",
      completed: (member.cpdPoints || 0) >= 10, // At least 10 CPD points
      icon: Award,
      weight: 10,
      description: "Continuing Professional Development participation"
    }
  ], [member, documents, payments, cpdActivities]);

  const completedItems = progressItems.filter(item => item.completed);
  const totalWeight = progressItems.reduce((sum, item) => sum + item.weight, 0);
  const completedWeight = completedItems.reduce((sum, item) => sum + item.weight, 0);
  const progressPercentage = Math.round((completedWeight / totalWeight) * 100);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressBackground = (percentage: number) => {
    if (percentage >= 90) return "from-green-500 to-green-600";
    if (percentage >= 70) return "from-blue-500 to-blue-600";
    if (percentage >= 50) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-gray-900">Profile Completion</span>
          <Badge 
            variant="secondary" 
            className={`${getProgressColor(progressPercentage)} bg-white`}
          >
            {progressPercentage}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className={`font-semibold ${getProgressColor(progressPercentage)}`}>
              {completedItems.length}/{progressItems.length} completed
            </span>
          </div>
          <div className="relative">
            <Progress value={progressPercentage} className="h-3" />
            <div 
              className={`absolute inset-0 bg-gradient-to-r ${getProgressBackground(progressPercentage)} rounded-full transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Progress Items */}
        <div className="space-y-3">
          {progressItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index}
                className={`
                  flex items-center justify-between p-3 rounded-lg transition-colors
                  ${item.completed 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-gray-50 border border-gray-200"
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-full
                    ${item.completed 
                      ? "bg-green-100 text-green-600" 
                      : "bg-gray-100 text-gray-500"
                    }
                  `}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`font-medium ${item.completed ? "text-green-900" : "text-gray-700"}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${item.completed ? "border-green-300 text-green-600" : "border-gray-300 text-gray-500"}`}
                  >
                    {item.weight}%
                  </Badge>
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Steps */}
        {progressPercentage < 100 && (
          <div className="mt-6 p-4 bg-blue-100 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              {progressItems
                .filter(item => !item.completed)
                .slice(0, 3)
                .map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Complete {item.label.toLowerCase()}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Achievement Message */}
        {progressPercentage === 100 && (
          <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-green-900">Profile Complete!</h4>
            <p className="text-sm text-green-800">
              You've earned the "Profile Master" achievement badge!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function calculateProfileProgress(
  member: Member, 
  documents: Document[] = [], 
  payments: Payment[] = [], 
  cpdActivities: CpdActivity[] = []
): number {
  const checks = [
    !!(member.firstName && member.lastName && member.email), // 15%
    !!(member.phone && member.nationalId), // 10%
    !!member.dateOfBirth, // 5%
    !!member.organizationId, // 15%
    !!member.memberType, // 10%
    documents.length >= 3, // 20%
    payments.some(p => p.status === "completed"), // 15%
    (member.cpdPoints || 0) >= 10 // 10%
  ];
  
  const weights = [15, 10, 5, 15, 10, 20, 15, 10];
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const completedWeight = checks.reduce((sum, completed, index) => 
    sum + (completed ? weights[index] : 0), 0
  );
  
  return Math.round((completedWeight / totalWeight) * 100);
}