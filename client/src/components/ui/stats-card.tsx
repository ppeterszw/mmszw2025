import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend?: string;
  trendText?: string;
  iconColor?: string;
  iconBg?: string;
  className?: string;
  "data-testid"?: string;
}

export function StatsCard({ 
  icon: Icon, 
  title, 
  value, 
  trend, 
  trendText, 
  iconColor = "text-primary", 
  iconBg = "bg-primary/10",
  className,
  "data-testid": testId,
  ...props 
}: StatsCardProps) {
  return (
    <Card className={className} data-testid={testId} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground" data-testid={`${testId}-value`}>
              {value}
            </p>
          </div>
          <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
            <Icon className={`${iconColor} text-xl w-6 h-6`} />
          </div>
        </div>
        {(trend || trendText) && (
          <div className="mt-4 flex items-center">
            {trend && (
              <span className={`text-sm font-medium ${
                trend.includes('↗') ? 'text-green-600' : 
                trend.includes('↘') ? 'text-red-600' : 'text-orange-600'
              }`}>
                {trend}
              </span>
            )}
            {trendText && (
              <span className="text-muted-foreground text-sm ml-2">{trendText}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
