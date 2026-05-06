import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pg: {
          rose: {
            DEFAULT: '#E1A49B', // Rose Gold
            light: '#FDECEF',   // Soft Blush
            dark: '#C88077',    // Deep Rose
          },
          plum: {
            DEFAULT: '#581C87', // Deep Premium Plum
            light: '#FAF5FF',   // Extremely soft plum bg
            dark: '#3B0764',
          },
          gold: {
            DEFAULT: '#D97706', // Warm Gold
            light: '#FEF3C7',
          },
          cream: '#FFF1F2',     // Very soft blush cream
          white: '#FFFFFF',
          gray: {
            100: '#F5F5F5',
            300: '#D1D5DB',
            500: '#6B7280',
            700: '#374151',
            900: '#111827',
          },
          success: '#059669',
          warning: '#D97706',
        }
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
      maxWidth: {
        'content': '1200px',
        'article': '780px',
      }
    },
  },
  plugins: [],
};
export default config;
