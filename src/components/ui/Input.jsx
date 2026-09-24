import { useId } from "react";

export default function FloatingInput({
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  required = false,
  disabled = false,
  dir = "ltr",
}) {
  const id = useId();
  const isRTL = dir === "rtl";

  return (
    <div className="relative">
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          dir={dir}
          placeholder=" "
          className={`peer w-full border-0 border-b border-white/20 bg-transparent py-4 text-white outline-none ring-0 transition-all duration-300 placeholder:text-transparent focus:border-primary focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 ${isRTL ? "pl-2 pr-8 text-right" : "pl-8 pr-2 text-left"
            }`}
        />

        {/* Floating Label + Icon */}
        <div
          className={`pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center gap-2 text-sm text-text-soft/50 transition-all duration-300
            peer-focus:top-0
            peer-focus:-translate-y-1/2
            peer-focus:text-xs
            peer-focus:text-primary

            peer-[:not(:placeholder-shown)]:top-0
            peer-[:not(:placeholder-shown)]:-translate-y-1/2
            peer-[:not(:placeholder-shown)]:text-xs
            peer-[:not(:placeholder-shown)]:text-primary

            ${isRTL
              ? "right-0 flex-row-reverse"
              : "left-0"
            }
          `}
        >
          {Icon && <Icon size={16} />}
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}