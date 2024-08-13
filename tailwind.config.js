/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-fast': 'spin .7s linear infinite',
      }
    },
  },
  plugins: [],
}