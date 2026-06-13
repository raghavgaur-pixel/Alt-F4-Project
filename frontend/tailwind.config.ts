import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "rgba(148, 163, 184, 0.18)",
        input: "rgba(148, 163, 184, 0.16)",
        ring: "#22d3ee",
        background: "#020617",
        foreground: "#e2e8f0",
        primary: {
          DEFAULT: "#22d3ee",
          foreground: "#020617"
        },
        secondary: {
          DEFAULT: "#1e293b",
          foreground: "#e2e8f0"
        },
        muted: {
          DEFAULT: "#0f172a",
          foreground: "#94a3b8"
        },
        accent: {
          DEFAULT: "#8b5cf6",
          foreground: "#f8fafc"
        },
        card: {
          DEFAULT: "rgba(15, 23, 42, 0.7)",
          foreground: "#e2e8f0"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.18), 0 16px 40px rgba(15,23,42,0.35)",
        neon: "0 0 40px rgba(34,211,238,0.18)"
      },
      backdropBlur: {
        xs: "2px"
      },
      backgroundImage: {
        "cyber-grid":
          "radial-gradient(circle at top, rgba(34,211,238,0.16), transparent 32%), linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)"
      },
      backgroundSize: {
        grid: "100% 100%, 32px 32px, 32px 32px"
      }
    }
  },
  plugins: []
} satisfies Config;

