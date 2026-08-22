import { cn } from "../../utils/cn";

export default function StatCard({ icon: Icon, label, value, trend, tone = "primary" }) {
  const tones = {
    primary: "bg-primary-100 text-secondary",
    secondary: "bg-secondary-50 text-secondary",
    ink: "bg-ink text-primary",
  };
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
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
      <p className="mt-3 font-display text-2xl font-extrabold text-ink">{value}</p>
      <p className="text-xs font-medium text-ink-soft">{label}</p>
    </div>
  );
}
