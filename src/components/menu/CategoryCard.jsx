import { Beef, Flame, CupSoda, Droplet, Cookie, Sparkles, ArrowRight } from "lucide-react";
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

export default function CategoryCard({ category, active, onClick, variant = "sidebar" }) {
  const { t } = useLanguage();
  const Icon = icons[category.icon] ?? Flame;

  if (variant === "tab") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
          active
            ? "border-primary bg-primary text-text-dark"
            : "border-line bg-surface-50 text-text-muted hover:bg-surface-hover hover:text-text"
        )}
      >
        <Icon className={cn("h-4 w-4", active ? "text-text-dark" : "text-primary")} />
        {t(category.name)}
      </button>
    );
  }

  if (variant === "card") {
    const description = t(category.description);
    return (
      <button
        onClick={onClick}
        className={cn(
          "group relative flex w-full min-h-[150px] flex-col items-start overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111111] p-5 text-start transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-[#181818] sm:min-h-[168px] sm:p-7"
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#181818] text-[#F5B400] transition-all duration-300 group-hover:bg-[#222222] group-hover:shadow-[0_0_20px_rgba(245,180,0,0.25)]">
          <Icon className="h-7 w-7" />
        </div>

        <h3 className="mt-5 font-display text-lg font-bold leading-snug text-white transition-colors duration-300 group-hover:text-[#F5B400] sm:text-xl sm:font-extrabold">
          {t(category.name)}
        </h3>

        {description && (
          <p className="mt-1.5 line-clamp-2 max-w-[80%] text-sm leading-relaxed text-[#A1A1A1]">
            {description}
          </p>
        )}

        <ArrowRight
          className={cn(
            "absolute end-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A1A1A1] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#F5B400] rtl:rotate-180 rtl:group-hover:-translate-x-1"
          )}
        />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-start transition-all",
        active
          ? "border-primary bg-surface-50 shadow-card"
          : "border-line bg-surface-50 hover:bg-surface-hover"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-100",
          active ? "ring-1 ring-primary" : ""
        )}
      >
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-display font-bold text-text">{t(category.name)}</p>
        <p className="truncate text-xs text-text-muted">{t(category.description)}</p>
      </div>
    </button>
  );
}