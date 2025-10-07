import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface QuickAction {
  icon: LucideIcon;
  label: string;
  action: () => void;
  color: string;
  bg: string;
  testId?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  description?: string;
}

export function QuickActions({
  actions,
  title = "Quick Actions",
  description = "Frequently used operations and tasks"
}: QuickActionsProps) {
  return (
    <Card className="border-2 border-gray-100 bg-gradient-to-br from-white to-cyan-50/30 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-egyptian-blue/5 to-powder-blue/5 border-b-2 border-gray-100">
        <CardTitle className="text-xl bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent">
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap sm:flex-nowrap gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto flex-col items-center p-6 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 flex-1 min-w-0 border-2 border-gray-200 hover:border-egyptian-blue hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              onClick={action.action}
              data-testid={action.testId || `quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className={`w-14 h-14 ${action.bg} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                <action.icon className={`w-7 h-7 ${action.color}`} />
              </div>
              <span className="text-sm font-semibold text-center text-gray-700">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
