const { guessProductionMode } = require("@ngneat/tailwind");
const { colors: defaultColors } = require("tailwindcss/defaultTheme");
const { color } = require("./src/assets/colors");

process.env.TAILWIND_MODE = guessProductionMode() ? "build" : "watch";

module.exports = {
  prefix: "tw-",
  mode: "jit",
  purge: {
    content: ["./src/**/*.{html,ts,css,scss,sass,less,styl}"],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        bounceIn: {
          "0%": {
            opacity: 0,
            transform: "scale(0)",
          },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        bounceIn: "bounceIn 500ms",
      },
    },
    screens: {
      xs: "376px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1336px",
      "2xl": "1920px",
    },
    fontSize: {
      xxs: ["0.5rem", { lineHeight: ".625rem" }],
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1rem" }],
      base: ["1rem", { lineHeight: "1.25rem" }],
      lg: ["1.125rem", { lineHeight: "1.5rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      3.25: ["0.8125rem", { lineHeight: "1.5" }],
    },
    colors: {
      ...defaultColors,
      ...color,
      shark: "#242526",
      grayInput: "#1f2937",
      textMain: "#d1d5db",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};
