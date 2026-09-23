import EmptyState from "../ui/EmptyState";
import { useLanguage } from "../../context/LanguageContext";

// Generic admin table. columns: [{ key, header, render?(row) }]
export default function DataTable({ columns, rows, keyField = "id", emptyTitle, emptyDescription }) {
  const { lang } = useLanguage();

  if (!rows || rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || (lang === "ar" ? "مفيش نتايج" : "No results")}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface-50 shadow-card">
      <table className="w-full min-w-[720px] text-start text-sm">
        <thead>
          <tr className="border-b border-line text-xs font-bold uppercase tracking-wide text-text-muted">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 text-start">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row) => (
            <tr key={row[keyField]} className="transition-colors hover:bg-surface-hover">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-text">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
