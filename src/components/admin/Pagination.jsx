import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../ui/Button";

export default function Pagination({ page, totalPages, onChange }) {
  const { lang } = useLanguage();
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 pt-4">
      <p className="text-xs text-text-muted">
        {lang === "ar" ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}
