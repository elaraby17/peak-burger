import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-line bg-surface-50 px-6 py-16 text-center">
      <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15">
        <AlertTriangle className="h-8 w-8 text-secondary" />
      </div>
      <h3 className="font-display text-xl font-bold text-text">{title}</h3>
      {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="md" className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
