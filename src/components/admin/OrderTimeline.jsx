import { CheckCircle2, Circle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { ORDER_STATUSES, statusLabels, statusStepIndex } from "../../utils/orderStatus";
import { cn } from "../../utils/cn";

export default function OrderTimeline({ status }) {
  const { t } = useLanguage();
  const currentStep = statusStepIndex(status);
  if (status === "cancelled") return null;

  return (
    <div className="rounded-2xl border border-line bg-surface-50 p-6 shadow-card">
      <ol className="flex flex-col gap-0 sm:flex-row sm:items-start">
        {ORDER_STATUSES.map((s, index) => {
          const reached = index <= currentStep;
          const isLast = index === ORDER_STATUSES.length - 1;
          return (
            <li key={s} className="flex flex-1 flex-row items-start gap-3 sm:flex-col sm:items-center sm:text-center">
              <div className="flex items-center sm:w-full">
                {reached ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-secondary" />
                ) : (
                  <Circle className="h-6 w-6 shrink-0 text-white/20" />
                )}
                {!isLast && (
                  <div className={cn("hidden h-0.5 flex-1 sm:block", index < currentStep ? "bg-secondary" : "bg-white/10")} />
                )}
              </div>
              <p className={cn("pb-4 text-xs font-semibold sm:pt-2", reached ? "text-text" : "text-text-muted/50")}>
                {t(statusLabels[s])}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
