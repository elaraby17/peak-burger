/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F5B400",
          50: "#FFF8E1",
          100: "#FFEDB8",
          200: "#FFE08A",
          300: "#FFD25C",
          400: "#FCC22E",
          500: "#F5B400",
          600: "#D99E00",
          700: "#B37F00",
          800: "#8C6300",
          900: "#664700",
        },
        secondary: {
          DEFAULT: "#D71920",
          50: "#FDECEC",
          100: "#F9C7C8",
          200: "#F19A9C",
          300: "#E86B6E",
          400: "#DF4448",
          500: "#D71920",
          600: "#B7141A",
          700: "#8F1014",
          800: "#680C0F",
          900: "#450709",
        },
        ink: {
          DEFAULT: "#1A1512",
          soft: "#33291F",
        },
        cream: {
          DEFAULT: "#FFFBF3",
          100: "#FFF6E6",
          200: "#FCEACB",
        },
        surface: "#FFFFFF",
      },
      fontFamily: {
        display: ["'Baloo 2'", "'Cairo'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "'Cairo'", "sans-serif"],
        arabic: ["'Cairo'", "'Plus Jakarta Sans'", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(26, 21, 18, 0.06)",
        "card-hover": "0 16px 32px rgba(26, 21, 18, 0.14)",
        pop: "0 10px 24px rgba(215, 25, 32, 0.25)",
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(26,21,18,0.06) 1px, transparent 0)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        popIn: {
          "0%": { transform: "scale(0.85)", opacity: 0 },
          "60%": { transform: "scale(1.06)", opacity: 1 },
          "100%": { transform: "scale(1)" },
        },
        bounceBadge: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out both",
        slideUp: "slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both",
        popIn: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
        badgeBounce: "bounceBadge 0.4s ease-in-out",
        drift: "drift 6s ease-in-out infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
