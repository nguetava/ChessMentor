import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17231f",
        paper: "#fbfaf6",
        sage: "#63776b",
        mint: "#dbeadd",
        brass: "#b58b32",
        coral: "#d76d57",
        night: "#111817"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23,35,31,.12)"
      }
    }
  },
  plugins: []
};

export default config;
