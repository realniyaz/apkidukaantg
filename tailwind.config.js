/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // ✅ critical (you are using /app)
    "./pages/**/*.{js,ts,jsx,tsx}", // optional
    "./components/**/*.{js,ts,jsx,tsx}", // optional
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};