/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A2540",
          dark: "#061829",
          light: "#1a3a5c",
          muted: "#5a7a9a",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F0D060",
          dark: "#B8941F",
        },
        slate: {
          wash: "#F4F7FB",
        },
        line: "#D8E2EF",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-opensans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1180px",
      },
      borderRadius: {
        pill: "9999px",
        card: "1.25rem",
      },
      boxShadow: {
        card: "0 12px 40px -16px rgba(10, 37, 64, 0.22)",
        glow: "0 0 0 1px rgba(212, 175, 55, 0.35), 0 8px 32px -8px rgba(10, 37, 64, 0.35)",
      },
    },
  },
  plugins: [],
};
