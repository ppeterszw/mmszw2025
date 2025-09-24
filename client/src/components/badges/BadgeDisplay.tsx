import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Medal, Award, Star, Crown, Shield,
  User, FileText, GraduationCap, Calendar,
  CheckCircle, Target, Sparkles
} from "lucide-react";

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  type: string;
  difficulty: "bronze" | "silver" | "gold" | "platinum";
  icon: string;
  color: string;
  criteria: string;
  points: number;
  isActive: boolean;
  earnedAt?: Date;
  progress?: number;
  isVisible?: boolean;
}

interface BadgeDisplayProps {
  badge: AchievementBadge;
  earned?: boolean;
  progress?: number;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  onClick?: () => void;
}

const iconMap = {
  Trophy, Medal, Award, Star, Crown, Shield,
  User, FileText, GraduationCap, Calendar,
  CheckCircle, Target, Sparkles
};

export function BadgeDisplay({ 
  badge, 
  earned = false, 
  progress = 0, 
  size = "md", 
  showProgress = false,
  onClick 
}: BadgeDisplayProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getDifficultyColors = (difficulty: string) => {
    switch (difficulty) {
      case "bronze":
        return {
          bg: "from-amber-600 to-amber-800",
          border: "border-amber-500",
          glow: "shadow-amber-500/20"
        };
      case "silver":
        return {
          bg: "from-gray-400 to-gray-600", 
          border: "border-gray-400",
          glow: "shadow-gray-400/20"
        };
      case "gold":
        return {
          bg: "from-yellow-400 to-yellow-600",
          border: "border-yellow-400",
          glow: "shadow-yellow-400/20"
        };
      case "platinum":
        return {
          bg: "from-blue-400 to-blue-600",
          border: "border-blue-400", 
          glow: "shadow-blue-400/20"
        };
      default:
        return {
          bg: "from-gray-500 to-gray-700",
          border: "border-gray-500",
          glow: "shadow-gray-500/20"
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return {
          container: "w-16 h-16",
          icon: "w-8 h-8",
          text: "text-xs"
        };
      case "lg":
        return {
          container: "w-24 h-24",
          icon: "w-12 h-12", 
          text: "text-base"
        };
      default:
        return {
          container: "w-20 h-20",
          icon: "w-10 h-10",
          text: "text-sm"
        };
    }
  };

  const colors = getDifficultyColors(badge.difficulty);
  const sizeClasses = getSizeClasses(size);
  const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award;

  return (
    <div className="relative group">
      <div
        className={`
          ${sizeClasses.container} 
          rounded-full 
          border-4 
          ${colors.border}
          ${earned ? `bg-gradient-to-br ${colors.bg}` : "bg-gray-300"}
          ${earned ? `shadow-lg ${colors.glow}` : ""}
          ${earned && isHovered ? "scale-110" : "scale-100"}
          transition-all duration-300 ease-in-out
          cursor-pointer
          flex items-center justify-center
          relative
          overflow-hidden
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Sparkle animation for earned badges */}
        {earned && (
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-60"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full opacity-40"></div>
            <div className="absolute top-3 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
          </div>
        )}
        
        <IconComponent 
          className={`
            ${sizeClasses.icon} 
            ${earned ? "text-white" : "text-gray-500"}
            transition-all duration-300
          `}
        />
        
        {/* Progress overlay for partially completed badges */}
        {!earned && showProgress && progress > 0 && (
          <div className="absolute inset-0 rounded-full border-4 border-transparent">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-300"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-blue-600"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
              />
            </svg>
          </div>
        )}
      </div>

      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            <div className="font-semibold">{badge.name}</div>
            <div className="text-gray-300">{badge.description}</div>
            {badge.points > 0 && (
              <div className="text-yellow-400 mt-1">{badge.points} points</div>
            )}
            {!earned && progress > 0 && (
              <div className="text-blue-400 mt-1">{progress}% complete</div>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

interface BadgeGridProps {
  badges: AchievementBadge[];
  earnedBadges?: string[];
  badgeProgress?: Record<string, number>;
  onBadgeClick?: (badge: AchievementBadge) => void;
}

export function BadgeGrid({ badges, earnedBadges = [], badgeProgress = {}, onBadgeClick }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-4">
      {badges.map((badge) => (
        <BadgeDisplay
          key={badge.id}
          badge={badge}
          earned={earnedBadges.includes(badge.id)}
          progress={badgeProgress[badge.id] || 0}
          showProgress={!earnedBadges.includes(badge.id)}
          onClick={() => onBadgeClick?.(badge)}
        />
      ))}
    </div>
  );
}

interface BadgeShowcaseProps {
  badges: AchievementBadge[];
  title?: string;
  maxDisplay?: number;
}

export function BadgeShowcase({ badges, title = "Recent Achievements", maxDisplay = 5 }: BadgeShowcaseProps) {
  const displayBadges = badges.slice(0, maxDisplay);
  
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {badges.length} earned
          </Badge>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {displayBadges.map((badge) => (
            <div key={badge.id} className="flex-shrink-0">
              <BadgeDisplay badge={badge} earned={true} size="lg" />
            </div>
          ))}
          
          {badges.length > maxDisplay && (
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full border-4 border-dashed border-gray-300 text-gray-500">
              <div className="text-center">
                <div className="text-lg font-bold">+{badges.length - maxDisplay}</div>
                <div className="text-xs">more</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}