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

// Define gradient color schemes based on icon background
const getGradientColors = (iconBg?: string) => {
  if (iconBg?.includes('blue')) {
    return {
      cardGradient: 'from-blue-50 via-cyan-50 to-white',
      borderGradient: 'border-blue-200/60',
      iconGradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-200/50',
    };
  } else if (iconBg?.includes('green')) {
    return {
      cardGradient: 'from-emerald-50 via-green-50 to-white',
      borderGradient: 'border-emerald-200/60',
      iconGradient: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-200/50',
    };
  } else if (iconBg?.includes('orange')) {
    return {
      cardGradient: 'from-orange-50 via-amber-50 to-white',
      borderGradient: 'border-orange-200/60',
      iconGradient: 'from-orange-500 to-amber-500',
      shadowColor: 'shadow-orange-200/50',
    };
  } else if (iconBg?.includes('red')) {
    return {
      cardGradient: 'from-red-50 via-rose-50 to-white',
      borderGradient: 'border-red-200/60',
      iconGradient: 'from-red-500 to-rose-500',
      shadowColor: 'shadow-red-200/50',
    };
  }
  return {
    cardGradient: 'from-gray-50 via-slate-50 to-white',
    borderGradient: 'border-gray-200/60',
    iconGradient: 'from-gray-500 to-slate-500',
    shadowColor: 'shadow-gray-200/50',
  };
};

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
  const colors = getGradientColors(iconBg);

  return (
    <Card
      className={`relative overflow-hidden border-2 ${colors.borderGradient} bg-gradient-to-br ${colors.cardGradient} shadow-xl ${colors.shadowColor} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] ${className}`}
      data-testid={testId}
      {...props}
    >
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-3xl -mr-16 -mt-16"></div>

      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
            <p className="text-4xl md:text-5xl font-black text-gray-800 leading-none" data-testid={`${testId}-value`}>
              {value}
            </p>
          </div>
          <div className={`w-16 h-16 bg-gradient-to-br ${colors.iconGradient} rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300`}>
            <Icon className="text-white w-8 h-8" />
          </div>
        </div>

        {(trend || trendText) && (
          <div className="mt-4 pt-4 border-t-2 border-gray-100/80 flex items-center gap-2">
            {trend && (
              <span className={`text-sm font-extrabold px-2 py-1 rounded-lg ${
                trend.includes('↗') ? 'text-emerald-700 bg-emerald-100/80' :
                trend.includes('↘') ? 'text-red-700 bg-red-100/80' :
                'text-orange-700 bg-orange-100/80'
              }`}>
                {trend}
              </span>
            )}
            {trendText && (
              <span className="text-gray-600 text-sm font-semibold">{trendText}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
