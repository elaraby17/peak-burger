/** @type {import('tailwindcss').Config} */

export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],

    darkMode: "class",

    theme: {
        extend: {
            colors: {
                // 🟡 Primary — Brand Yellow
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

                // 🔴 Secondary — Accent / Hot / Spicy / Sale
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

                // 🖤 Dark Brand System
                ink: {
                    DEFAULT: "#1A1512",
                    soft: "#33291F",
                    deep: "#0D0A08",
                    muted: "#6B625B",
                },

                // 🤍 Warm Light / Text
                cream: {
                    DEFAULT: "#FFFBF3",
                    100: "#FFF6E6",
                    200: "#FCEACB",
                },

                // 🌑 Dark Surfaces
                surface: {
                    DEFAULT: "#14110F",
                    50: "#211C18",
                    100: "#2A231D",
                    200: "#332B24",
                    300: "#40362D",
                },

                // 📝 Text colors
                text: {
                    DEFAULT: "#FFFBF3",
                    muted: "#A69D94",
                    soft: "#C9C0B8",
                    dark: "#1A1512",
                },

                // 🔲 Borders
                border: {
                    DEFAULT: "rgba(255, 251, 243, 0.08)",
                    light: "rgba(255, 251, 243, 0.14)",
                    strong: "rgba(255, 251, 243, 0.20)",
                },
            },

            fontFamily: {
                display: ["'Baloo 2'", "'Cairo'", "sans-serif"],
                body: ["'Plus Jakarta Sans'", "'Cairo'", "sans-serif"],
                arabic: ["'Cairo'", "'Plus Jakarta Sans'", "sans-serif"],
            },

            boxShadow: {
                // Dark UI card
                card: "0 4px 16px rgba(0, 0, 0, 0.25)",

                // Card hover
                "card-hover": "0 18px 40px rgba(0, 0, 0, 0.40)",

                // Yellow glow
                primary: "0 10px 28px rgba(245, 180, 0, 0.22)",

                // Red accent glow
                pop: "0 10px 24px rgba(215, 25, 32, 0.22)",

                // Header
                header: "0 8px 30px rgba(0, 0, 0, 0.28)",

                // Strong dark depth
                "dark-xl": "0 25px 60px rgba(0, 0, 0, 0.45)",
            },

            backgroundImage: {
                // Subtle grain for dark sections
                grain: "radial-gradient(circle at 1px 1px, rgba(255,251,243,0.035) 1px, transparent 0)",

                // Hero top overlay
                "hero-top": "linear-gradient(to bottom, rgba(13,10,8,0.78) 0%, rgba(13,10,8,0.35) 55%, rgba(13,10,8,0) 100%)",

                // Hero content overlay
                "hero-content": "linear-gradient(90deg, rgba(13,10,8,0.92) 0%, rgba(13,10,8,0.68) 38%, rgba(13,10,8,0.18) 75%, rgba(13,10,8,0.30) 100%)",

                // Bottom cinematic fade
                "hero-bottom": "linear-gradient(to top, rgba(13,10,8,0.82) 0%, rgba(13,10,8,0) 55%)",

                // Dark section gradient
                "dark-gradient": "linear-gradient(180deg, #0D0A08 0%, #14110F 100%)",

                // Yellow subtle glow
                "yellow-glow": "radial-gradient(circle, rgba(245,180,0,0.12) 0%, rgba(245,180,0,0) 70%)",
            },

            keyframes: {
                fadeIn: {
                    "0%": {
                        opacity: 0,
                        transform: "translateY(8px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                },

                slideUp: {
                    "0%": {
                        opacity: 0,
                        transform: "translateY(24px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                },

                popIn: {
                    "0%": {
                        transform: "scale(0.85)",
                        opacity: 0,
                    },
                    "60%": {
                        transform: "scale(1.06)",
                        opacity: 1,
                    },
                    "100%": {
                        transform: "scale(1)",
                    },
                },

                bounceBadge: {
                    "0%, 100%": {
                        transform: "scale(1)",
                    },
                    "50%": {
                        transform: "scale(1.3)",
                    },
                },

                drift: {
                    "0%, 100%": {
                        transform: "translateY(0) rotate(0deg)",
                    },
                    "50%": {
                        transform: "translateY(-12px) rotate(3deg)",
                    },
                },

                // Subtle image zoom for Hero
                heroZoom: {
                    "0%": {
                        transform: "scale(1)",
                    },
                    "100%": {
                        transform: "scale(1.04)",
                    },
                },
            },

            animation: {
                fadeIn: "fadeIn 0.5s ease-out both",

                slideUp: "slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both",

                popIn: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",

                badgeBounce: "bounceBadge 0.4s ease-in-out",

                drift: "drift 6s ease-in-out infinite",

                heroZoom: "heroZoom 8s ease-out forwards",
            },

            borderRadius: {
                xl2: "1.25rem",
            },
        },
    },

    plugins: [],
};
