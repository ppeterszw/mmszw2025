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
    <Card
      className={`border-2 border-gray-100 bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
      data-testid={testId}
      {...props}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent" data-testid={`${testId}-value`}>
              {value}
            </p>
          </div>
          <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center shadow-md`}>
            <Icon className={`${iconColor} w-7 h-7`} />
          </div>
        </div>
        {(trend || trendText) && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center">
            {trend && (
              <span className={`text-sm font-bold ${
                trend.includes('↗') ? 'text-green-600' :
                trend.includes('↘') ? 'text-red-600' : 'text-orange-600'
              }`}>
                {trend}
              </span>
            )}
            {trendText && (
              <span className="text-gray-600 text-sm ml-2 font-medium">{trendText}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
