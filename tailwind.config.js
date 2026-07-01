/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#064e3b",
          dark: "#043125",
          light: "#065f46",
        },
        gold: {
          DEFAULT: "#6ee7b7",
          dark: "#34d399",
        },
        mist: "#F1F5F3",
        line: "#E2E8E4",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-opensans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1200px",
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};
