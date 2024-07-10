/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1E1E1E",
        "secondary": "#fff",
        "accent": "#64419D",
        "limeGreen": "#85E19A",
        "flamingo": "#E18585",
        "paperGrey": "#f6f6f6"
      },
      screens: {
        "phone": {"max": "480px"},
        "tablet": {"max": "960px"},
        "desktop": {"min": "1024px"},
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
      }
    },
  },
  plugins: [],
}

