import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

export interface ModernModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  colorVariant?: "blue" | "green" | "purple" | "red" | "amber" | "indigo" | "emerald" | "orange";
  children: ReactNode;
  footer?: {
    primary?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
      loading?: boolean;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
      testId?: string;
    };
    secondary?: {
      label: string;
      onClick: () => void;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
      testId?: string;
    };
  };
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

const colorVariants = {
  blue: {
    header: "bg-gradient-to-br from-white via-blue-50/30 to-blue-100/30 border-2 border-blue-200/50",
    avatar: "bg-gradient-to-br from-blue-500 to-blue-600",
    title: "bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent",
    border: "border-blue-200",
    button: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
  },
  green: {
    header: "bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 border-2 border-green-200/50",
    avatar: "bg-gradient-to-br from-green-500 to-emerald-600",
    title: "bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent",
    border: "border-green-200",
    button: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
  },
  purple: {
    header: "bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 border-2 border-purple-200/50",
    avatar: "bg-gradient-to-br from-purple-500 to-pink-600",
    title: "bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent",
    border: "border-purple-200",
    button: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
  },
  red: {
    header: "bg-gradient-to-br from-white via-red-50/30 to-pink-50/30 border-2 border-red-200/50",
    avatar: "bg-gradient-to-br from-red-500 to-pink-600",
    title: "bg-gradient-to-r from-red-700 to-pink-700 bg-clip-text text-transparent",
    border: "border-red-200",
    button: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
  },
  amber: {
    header: "bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/30 border-2 border-amber-200/50",
    avatar: "bg-gradient-to-br from-amber-500 to-yellow-600",
    title: "bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent",
    border: "border-amber-200",
    button: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
  },
  indigo: {
    header: "bg-gradient-to-br from-white via-indigo-50/30 to-violet-50/30 border-2 border-indigo-200/50",
    avatar: "bg-gradient-to-br from-indigo-500 to-violet-600",
    title: "bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent",
    border: "border-indigo-200",
    button: "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
  },
  emerald: {
    header: "bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 border-2 border-emerald-200/50",
    avatar: "bg-gradient-to-br from-emerald-500 to-teal-600",
    title: "bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent",
    border: "border-emerald-200",
    button: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
  },
  orange: {
    header: "bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 border-2 border-orange-200/50",
    avatar: "bg-gradient-to-br from-orange-500 to-red-600",
    title: "bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent",
    border: "border-orange-200",
    button: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
  }
};

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl"
};

export function ModernModal({
  open,
  onOpenChange,
  title,
  subtitle,
  icon: Icon,
  colorVariant = "blue",
  children,
  footer,
  maxWidth = "2xl"
}: ModernModalProps) {
  const colors = colorVariants[colorVariant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidthClasses[maxWidth]} ${colors.header} shadow-2xl`}>
        <DialogHeader className={`pb-6 border-b ${colors.border}`}>
          <div className="flex items-center space-x-4">
            {Icon && (
              <div className={`w-12 h-12 ${colors.avatar} rounded-full flex items-center justify-center text-white`}>
                <Icon className="w-6 h-6" />
              </div>
            )}
            <div>
              <DialogTitle className={`text-2xl font-bold ${colors.title}`}>
                {title}
              </DialogTitle>
              {subtitle && (
                <p className="text-sm text-gray-600 font-medium mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-6">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {footer.secondary && (
              <Button
                variant={footer.secondary.variant || "outline"}
                onClick={footer.secondary.onClick}
                data-testid={footer.secondary.testId}
              >
                {footer.secondary.label}
              </Button>
            )}
            {footer.primary && (
              <Button
                variant={footer.primary.variant || "default"}
                onClick={footer.primary.onClick}
                disabled={footer.primary.disabled || footer.primary.loading}
                data-testid={footer.primary.testId}
                className={`${colors.button} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                {footer.primary.loading ? "Loading..." : footer.primary.label}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}