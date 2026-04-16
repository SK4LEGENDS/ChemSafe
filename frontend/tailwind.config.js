/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safe: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
        },
        caution: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
        },
        lab: {
          bg: '#f8fafc',
          text: '#1e293b',
          card: '#ffffff',
          border: '#e2e8f0',
        }
      }
    },
  },
  plugins: [],
}
