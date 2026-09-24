import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Loading({ className, label }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-text-muted", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );
}
