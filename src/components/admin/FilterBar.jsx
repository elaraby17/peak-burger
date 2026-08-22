import Select from "../ui/Select";
import Input from "../ui/Input";
import { Search } from "lucide-react";

// Generic filter row: a search box plus any number of <select> filters.
// `filters` = [{ value, onChange, options: [{value,label}], placeholder }]
export default function FilterBar({ search, onSearchChange, searchPlaceholder, filters = [] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      {onSearchChange && (
        <div className="min-w-[200px] flex-1">
          <Input icon={Search} value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} />
        </div>
      )}
      {filters.map((f, i) => (
        <div key={i} className="w-full sm:w-44">
          <Select value={f.value} onChange={(e) => f.onChange(e.target.value)}>
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      ))}
    </div>
  );
}
