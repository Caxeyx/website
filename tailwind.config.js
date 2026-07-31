/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0c10',
        surface: 'rgba(20, 22, 28, 0.72)',
      },
    },
  },
  plugins: [],
}
