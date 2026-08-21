import { Link } from "react-router-dom";
import Button from "./Button";

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/60 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <Icon className="h-8 w-8 text-secondary" />
        </div>
      )}
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-soft">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-2">
          <Button variant="primary" size="md">
            {actionLabel}
          </Button>
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <Button onClick={onAction} variant="primary" size="md" className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
