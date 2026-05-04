// tailwind.config.js
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f39f6',
        secondary: '#f7f9fc',
        darkprimary: '#272f41',
        darksecondary: '#111827',
      }
    },
  },
  plugins: [],
}