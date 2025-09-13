/** @type {import('tailwindcss').Config} */
export default {
 
  content: [
    "./index.html",                // Main HTML file
    "./src/**/*.{js,ts,jsx,tsx}",  // All JS/TS/React files inside src/
  ],

  // Enable dark mode using a CSS class (e.g., <html class="dark">)
  darkMode: "class",  

  theme: {
    // Extend default Tailwind theme here (custom colors, fonts, spacing, etc.)
    extend: {},
  },

  // Extra Tailwind plugins can be added here (forms, typography, etc.)
  plugins: [],
}

