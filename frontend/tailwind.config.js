const { guessProductionMode } = require("@ngneat/tailwind");
const { colors: defaultColors } = require("tailwindcss/defaultTheme");
const color = require("./src/assets/colors");

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
        bounceHorizontal: {
          "0%, 100%": {
            transform: "translateX(0)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateX(25%)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        fadeInTop: {
          "0%": {
            opacity: 0,
            transform: "translateY(-20%)",
          },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeInTop100: {
          "0%": {
            opacity: 0,
            transform: "translateY(-100%)",
          },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeOutTop100: {
          "0%": {
            opacity: 1,
            height: "20%",
            transform: "translateY(0)",
          },
          "100%": {
            opacity: 0,
            height: "0%",
            transform: "translateY(-100%)",
          },
        },
        fadeInbottom: {
          "0%": {
            opacity: 0,
            transform: "translateY(2%)",
          },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        tiktok: {
          "0%": {
            transform: "scale(2)",
            opacity: 1,
            transform: "translateX(0)",
          },
          "25%": {
            transform: "scale(1)",
            opacity: 0,
            transform: "translate(1rem, -1rem)",
          },
          "50%": {
            transform: "scale(1)",
            opacity: 0,
            transform: "translate(-1rem, 1rem)",
          },
          "51%": {
            transform: "scale(1)",
            opacity: 1,
            transform: "translate(-1rem, 1rem)",
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
            transform: "translate(0)",
          },
        },
        tiktokIn: {
          "0%": {
            transform: "scale(1)",
            opacity: 0,
            transform: "translate(-1rem, 1rem)",
          },
          "100%": {
            transform: "scale(2)",
            opacity: 1,
            transform: "translateX(0)",
          },
        },
        load: {
          "0%": {
            transform: "translate(-2rem, 0)",
            opacity: 0,
          },
          "100%": {
            transform: "translate(0, 0)",
            opacity: 1,
          },
        },
      },
      animation: {
        bounceIn: "bounceIn 500ms",
        bounceHorizontal: "bounceHorizontal 1s infinite",
        fadeInTop: "fadeInTop 300ms",
        fadeInTop100: "fadeInTop100 300ms",
        fadeOutTop100: "fadeOutTop100 300ms",
        fadeInbottom: "fadeInbottom 300ms",
        tiktok: "tiktok 1s",
        tiktokIn: "tiktokIn 1s",
        load: "load 400ms",
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
      textMain300: "#d1d5db",
      textGray200: "#dddfe1",
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
