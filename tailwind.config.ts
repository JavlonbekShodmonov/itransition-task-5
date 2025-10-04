import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",   // App Router
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // If you have /pages
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Components
    "./src/**/*.{js,ts,jsx,tsx,mdx}",   // If you use /src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
