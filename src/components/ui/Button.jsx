import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-secondary text-white hover:bg-secondary-600 shadow-pop active:scale-[0.98]",
  gold: "bg-primary text-ink hover:bg-primary-600 shadow-pop active:scale-[0.98]",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-white",
  ghost: "text-ink hover:bg-ink/5",
  white: "bg-white text-ink hover:bg-cream-100 shadow-card",
  danger: "bg-secondary-700 text-white hover:bg-secondary-800",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
  icon: "h-11 w-11",
};

const Button = forwardRef(
  ({ variant = "primary", size = "md", className, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
