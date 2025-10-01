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
  colorVariant?: "blue" | "green" | "purple" | "red" | "amber" | "indigo" | "emerald" | "orange" | "cyan";
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
      disabled?: boolean;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
      testId?: string;
    };
  };
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

const colorVariants = {
  blue: {
    header: "bg-white/95 backdrop-blur-xl border border-gray-200/60",
    avatar: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30",
    title: "text-gray-900",
    border: "border-gray-200/60",
    button: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
  },
  green: {
    header: "bg-white/95 backdrop-blur-xl border border-gray-200/60",
    avatar: "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30",
    title: "text-gray-900",
    border: "border-gray-200/60",
    button: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
  },
  purple: {
    header: "bg-white/95 backdrop-blur-xl border border-gray-200/60",
    avatar: "bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30",
    title: "text-gray-900",
    border: "border-gray-200/60",
    button: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
  },
  red: {
    header: "bg-white/95 backdrop-blur-xl border border-gray-200/60",
    avatar: "bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/30",
    title: "text-gray-900",
    border: "border-gray-200/60",
    button: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
  },
  amber: {
    header: "bg-white/95 backdrop-blur-xl border border-gray-200/60",
    avatar: "bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/30",
    title: "text-gray-900",
    border: "border-gray-200/60",
    button: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
  },
  indigo: {
    header: "bg-white/95 backdrop-blur-xl border border-gray-200/60",
    avatar: "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30",
    title: "text-gray-900",
    border: "border-gray-200/60",
    button: "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
  },
  emerald: {
    header: "bg-white/95 backdrop-blur-xl border border-gray-200/60",
    avatar: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30",
    title: "text-gray-900",
    border: "border-gray-200/60",
    button: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
  },
  orange: {
    header: "bg-white/95 backdrop-blur-xl border border-gray-200/60",
    avatar: "bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30",
    title: "text-gray-900",
    border: "border-gray-200/60",
    button: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
  },
  cyan: {
    header: "bg-white/95 backdrop-blur-xl border border-gray-200/60",
    avatar: "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30",
    title: "text-gray-900",
    border: "border-gray-200/60",
    button: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
  }
};

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl"
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
  const colors = colorVariants[colorVariant] || colorVariants.blue;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidthClasses[maxWidth]} ${colors.header} rounded-2xl shadow-xl`}>
        <DialogHeader className={`pb-5 border-b ${colors.border}`}>
          <div className="flex items-center space-x-4">
            {Icon && (
              <div className={`w-14 h-14 ${colors.avatar} rounded-2xl flex items-center justify-center text-white`}>
                <Icon className="w-7 h-7" />
              </div>
            )}
            <div className="flex-1">
              <DialogTitle className={`text-2xl font-semibold ${colors.title} tracking-tight`}>
                {title}
              </DialogTitle>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="py-5 max-h-[calc(90vh-200px)] overflow-y-auto">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200/60">
            {footer.secondary && (
              <Button
                variant={footer.secondary.variant || "outline"}
                onClick={footer.secondary.onClick}
                disabled={footer.secondary.disabled}
                data-testid={footer.secondary.testId}
                className="rounded-xl border-gray-300 hover:bg-gray-50 transition-colors"
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
                className={`${colors.button} text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200`}
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