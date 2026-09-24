import { cn } from "../../utils/cn";

const tones = {
  primary: "bg-primary text-ink",
  secondary: "bg-secondary text-white",
  ink: "bg-ink text-white",
  outline: "border border-ink/15 text-ink-soft bg-white",
  // Order-status tones (used by orderStatus.js -> statusTone)
  warning: "border border-white/15 bg-white/10 text-[#D4D4D4]",
  info: "border border-[#F5B400]/30 bg-[#F5B400]/15 text-[#F5B400]",
  success: "bg-[#F5B400] text-[#050505]",
  danger: "border border-[#D71920]/30 bg-[#D71920]/15 text-[#D71920]",
};

export default function Badge({ tone = "primary", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        tones[tone] ?? tones.outline,
        className
      )}
    >
      {children}
    </span>
  );
}