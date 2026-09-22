import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-deep/70 backdrop-blur-sm animate-fadeIn sm:items-center sm:p-4">
      <div
        className={cn(
          "w-full rounded-t-3xl bg-surface-100 p-6 shadow-card-hover ring-1 ring-white/10 animate-slideUp sm:rounded-3xl",
          sizes[size]
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="font-display text-xl font-bold text-text">{title}</h3>}
          <button
            onClick={onClose}
            aria-label="Close"
            className="ms-auto flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
