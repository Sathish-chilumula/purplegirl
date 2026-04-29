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
            DEFAULT: '#E91E8C',
            light: '#FCE4F3',
            dark: '#B5146A',
          },
          plum: {
            DEFAULT: '#6B21A8',
            light: '#F3E8FF',
          },
          cream: '#FFF9FB',
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
