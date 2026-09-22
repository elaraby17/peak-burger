import { cn } from "../../utils/cn";

export default function StatCard({ icon: Icon, label, value, trend, tone = "primary" }) {
  const tones = {
    primary: "bg-surface-100 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    ink: "bg-ink-deep text-primary",
  };
  return (
    <div className="rounded-2xl border border-line bg-surface-50 p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={cn("text-xs font-bold", trend.startsWith("-") ? "text-secondary" : "text-green-600")}>
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold text-text">{value}</p>
      <p className="text-xs font-medium text-text-muted">{label}</p>
    </div>
  );
}
