import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff8f1",
          100: "#feeedc",
          200: "#fcd9b7",
          300: "#f9bc87",
          400: "#f59453",
          500: "#f27329",
          600: "#e3561e",
          700: "#bc3f19",
          800: "#95341c",
          900: "#792d1a",
          950: "#41140b",
        },
        amber: {
          450: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(242, 115, 41, 0.4)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        elevated: "0 20px 40px -15px rgba(0, 0, 0, 0.12)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slight": "bounce 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
