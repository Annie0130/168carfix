/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: "#1F2429",
        ink: "#14181C",
        steel: "#3B5A73",
        steellight: "#6C8CA3",
        amber: "#E8A33D",
        paper: "#F7F5F1",
        line: "#D9D4C8",
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
