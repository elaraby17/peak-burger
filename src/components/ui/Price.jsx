import { useLanguage } from "../../context/LanguageContext";
import { formatPrice } from "../../utils/format";
import { cn } from "../../utils/cn";

export default function Price({ value, from = false, className }) {
  const { lang } = useLanguage();
  return (
    <span className={cn("font-display font-bold tabular-nums", className)}>
      {from && value !== null && (lang === "ar" ? "من " : "From ")}
      {formatPrice(value, { lang })}
    </span>
  );
}
