/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tutu-bg': '#0a0e1a',
        'tutu-gold': '#fbbf24',
        'tutu-emerald': '#34d399',
        'tutu-blue': '#60a5fa',
        'tutu-red': '#f87171',
        'tutu-purple': '#a78bfa',
        'tutu-orange': '#fb923c',
        'tutu-cyan': '#67e8f9',
      },
      fontFamily: {
        'game': ['Tektur', 'sans-serif'],
      },
    },
  },
  plugins: [],
}