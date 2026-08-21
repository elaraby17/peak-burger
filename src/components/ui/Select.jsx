import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

const Select = forwardRef(({ label, error, className, id, children, ...props }, ref) => {
  const selectId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-ink-soft">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-12 w-full appearance-none rounded-xl border-2 border-ink/10 bg-white px-4 pe-10 text-ink transition-colors focus:border-primary",
            error && "border-secondary focus:border-secondary",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-soft/50" />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-secondary">{error}</p>}
    </div>
  );
});
Select.displayName = "Select";

export default Select;
