import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0B0C0E",
        surface: "#131519",
        "surface-elevated": "#1A1D24",
        ink: "#F5F6F8",
        muted: "#9499A3",
        border: "#242830",
        accent: "#DDF247",
        "accent-ink": "#0B0C0E",
        "hero-bronze": "#8C7765",
        "hero-slate": "#3B424C",
        "status-transit": "#F59E0B",
        "status-sold": "#71717A",
        "admin-bg": "#FAFAFA",
        "admin-surface": "#FFFFFF",
        "admin-border": "#E5E7EB",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sharp: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
