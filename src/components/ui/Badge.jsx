import { cn } from "../../utils/cn";

const tones = {
  primary: "bg-primary text-text-dark",
  secondary: "bg-secondary text-white",
  ink: "bg-ink-deep text-white",
  outline: "border border-line text-text-muted bg-surface-50",
};

export default function Badge({ tone = "primary", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
