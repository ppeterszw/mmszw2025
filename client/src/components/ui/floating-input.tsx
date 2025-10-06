import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, type = "text", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value !== "");
      props.onBlur?.(e);
    };

    React.useEffect(() => {
      setHasValue(props.value !== "" && props.value !== undefined);
    }, [props.value]);

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "peer h-14 w-full rounded-lg border-2 border-gray-200 bg-white px-4 pt-6 pb-2 text-base text-gray-900 transition-all duration-200",
            "placeholder-transparent",
            "focus:border-egyptian-blue focus:ring-2 focus:ring-egyptian-blue/20 focus:outline-none",
            "hover:border-gray-300",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            className
          )}
          placeholder={label}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none",
            (isFocused || hasValue)
              ? "top-1.5 text-xs font-medium text-egyptian-blue"
              : "top-4 text-base text-gray-400"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
