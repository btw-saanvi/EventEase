/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        vapor: {
          lavender: "#c4b5fd",
          indigo: "#818cf8",
          cyan: "#67e8f9",
          ice: "#a5f3fc",
          pink: "#f0abfc",
          purple: "#a78bfa",
          violet: "#7c3aed",
          dark: "#0a0a0f",
          darker: "#050508",
          card: "rgba(255,255,255,0.04)",
          border: "rgba(196,181,253,0.15)",
        },
      },
      fontFamily: {
        heading: ["Sora", "system-ui", "sans-serif"],
        body: ["Manrope", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "vapor-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "aurora-1": "linear-gradient(135deg, #c4b5fd 0%, #818cf8 25%, #67e8f9 50%, #f0abfc 75%, #c4b5fd 100%)",
        "mesh-dark": "radial-gradient(at 40% 20%, hsla(261,97%,72%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(286,96%,82%,0.1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(240,100%,72%,0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(261,97%,72%,0.1) 0px, transparent 50%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "aurora-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(196,181,253,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(196,181,253,0.6), 0 0 80px rgba(129,140,248,0.3)" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "aurora-shift": "aurora-shift 8s ease infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "slide-in-up": "slide-in-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
