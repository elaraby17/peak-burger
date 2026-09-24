import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function FloatingInput({
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  required = false,
  disabled = false,
  dir = "ltr",
  showPasswordToggle = false,
  placeholder = "",
  pattern,
}) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isRTL = dir === "rtl";

  const inputType =
    type === "password" && showPassword ? "text" : type;

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          dir={dir}
          placeholder={
            isFocused && !value
              ? placeholder
              : " "
          }
          {...(pattern ? { pattern } : {})}
          autoComplete={
            type === "password"
              ? "new-password"
              : type === "email"
              ? "email"
              : "off"
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`peer w-full appearance-none border-0 border-b border-white/20 bg-transparent py-4 text-white outline-none ring-0 transition-colors duration-300 placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-0 ${
            isRTL
              ? "pl-10 pr-8 text-right"
              : "pl-8 pr-10 text-left"
          }`}
        />

        {/* Floating Label */}
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
            ${
              isRTL
                ? "right-0 flex-row-reverse"
                : "left-0"
            }
          `}
        >
          {Icon && (
            <Icon
              size={16}
              className="shrink-0"
            />
          )}

          <span>{label}</span>
        </div>

        {/* Password Toggle */}
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            disabled={disabled}
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            className={`absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-text-soft/60 outline-none transition-colors hover:text-primary focus:outline-none ${
              isRTL ? "left-0" : "right-0"
            }`}
          >
            {showPassword ? (
              <FiEyeOff size={20} />
            ) : (
              <FiEye size={20} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}