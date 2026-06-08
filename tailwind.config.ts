import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FBF4EB",
        card: "#FBD9E5",
        primary: {
          DEFAULT: "#C43A4A",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#C56682",
          foreground: "#FFFFFF",
        },
        tertiary: {
          DEFAULT: "#E7A48C",
          foreground: "#2D2D2D",
        },
        foreground: "#2D2D2D",
        "muted-foreground": "#6B6B6B",
        muted: {
          DEFAULT: "#F5E6D8",
          foreground: "#6B6B6B",
        },
        accent: {
          DEFAULT: "#FBD9E5",
          foreground: "#2D2D2D",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#FFFFFF",
        },
        border: "#E5D5C5",
        input: "#E5D5C5",
        ring: "#C43A4A",
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#2D2D2D",
        },
      },
      fontFamily: {
        title: ["Leckerli One", "cursive"],
        body: ["Nunito Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
