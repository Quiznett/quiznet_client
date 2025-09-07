/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // 👈 scan all React files
  ],
  darkMode: "class",  // 👈 enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
}
