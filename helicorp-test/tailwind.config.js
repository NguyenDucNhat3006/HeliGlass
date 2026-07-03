/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Dòng này bắt buộc phải có để điều khiển dark mode qua class của thẻ html
  theme: {
    extend: {},
  },
  plugins: [],
}