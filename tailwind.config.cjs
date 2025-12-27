/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563eb",
          dark: "#1e40af",
          light: "#60a5fa",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        mono: [
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.1)",
        "card-hover": "0 10px 25px rgba(0,0,0,0.15)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
