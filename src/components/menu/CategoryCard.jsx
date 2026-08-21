import { Beef, Flame, CupSoda, Droplet, Cookie, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { cn } from "../../utils/cn";

const icons = {
  beef: Beef,
  flame: Flame,
  "cup-soda": CupSoda,
  droplet: Droplet,
  cookie: Cookie,
  sparkles: Sparkles,
};

export default function CategoryCard({ category, active, onClick, variant = "card" }) {
  const { t } = useLanguage();
  const Icon = icons[category.icon] ?? Flame;

  if (variant === "tab") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
          active ? "border-secondary bg-secondary text-white" : "border-ink/10 bg-white text-ink-soft"
        )}
      >
        <Icon className="h-4 w-4" />
        {t(category.name)}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-start transition-all",
        active
          ? "border-secondary bg-secondary/5 shadow-card"
          : "border-transparent bg-white hover:border-ink/10 hover:shadow-card"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          active ? "bg-secondary text-white" : "bg-primary-100 text-secondary"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-display font-bold text-ink">{t(category.name)}</p>
        <p className="truncate text-xs text-ink-soft">{t(category.description)}</p>
      </div>
    </button>
  );
}
