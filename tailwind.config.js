/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./app.vue",
      "./error.vue",
    ],
    theme: {
      extend: {
        colors: {
          'mtg-blue': '#1565c0',
          'mtg-green': '#2e7d32',
          'mtg-red': '#c62828',
          'mtg-black': '#212121',
          'mtg-white': '#f5f5f5',
        },
      },
    },
    plugins: [],
  }