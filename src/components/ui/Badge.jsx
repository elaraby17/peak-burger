import { cn } from "../../utils/cn";

const tones = {
  primary: "bg-primary text-ink",
  secondary: "bg-secondary text-white",
  ink: "bg-ink text-white",
  outline: "border border-ink/15 text-ink-soft bg-white",
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
