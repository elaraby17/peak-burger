import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(({ label, error, className, id, icon: Icon, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink-soft">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute start-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-soft/50" />
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-12 w-full rounded-xl border-2 border-ink/10 bg-white px-4 text-ink placeholder:text-ink-soft/40 transition-colors focus:border-primary",
            Icon && "ps-10",
            error && "border-secondary focus:border-secondary",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-secondary">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";

export default Input;
