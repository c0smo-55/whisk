import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: "#FFE3F0",
        petal: "#FF9EC7",
        rose: "#E26AA5",
        lavender: "#B79CED",
        periwinkle: "#8FB8FF",
        sky: "#D6E9FF",
        plum: "#4B3059",
        butter: "#FFD68A",
        cream: "#FFF8FB",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        pixel: "4px 4px 0 0 rgba(75, 48, 89, 0.25)",
        "pixel-lg": "6px 6px 0 0 rgba(75, 48, 89, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
