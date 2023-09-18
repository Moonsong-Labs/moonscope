/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx, jsx}"],
  daisyui: {
    themes: ["light", "dark", "autumn"],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}