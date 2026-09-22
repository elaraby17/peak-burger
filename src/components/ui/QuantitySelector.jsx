import { Minus, Plus } from "lucide-react";
import { cn } from "../../utils/cn";

export default function QuantitySelector({ value, onIncrease, onDecrease, min = 1, size = "md", className }) {
  const sizes = {
    sm: "h-9 w-9",
    md: "h-10 w-10",
  };
  return (
    <div className={cn("inline-flex items-center gap-3 rounded-full bg-white/5 p-1", className)}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "flex items-center justify-center rounded-full bg-surface-50 text-text shadow-card transition-transform active:scale-90 disabled:opacity-40",
          sizes[size]
        )}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-5 text-center font-display font-bold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className={cn(
          "flex items-center justify-center rounded-full bg-secondary text-white shadow-card transition-transform active:scale-90",
          sizes[size]
        )}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
