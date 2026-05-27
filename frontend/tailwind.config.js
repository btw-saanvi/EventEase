/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        oatly: {
          bg: "#F9F5F0", // Creamy off-white
          text: "#1E1E1E", // Soft black
          pink: "#FFB0C2", // Vibrant pastel pink
          blue: "#A7D7E8", // Light sky blue
          yellow: "#FFD933", // Bright yellow
          brown: "#5C4033", // Dark chocolate brown
          green: "#A4CBA3", // Soft pastel green
          border: "#1E1E1E", // Chunky borders
        },
      },
      fontFamily: {
        heading: ["'Titan One'", "system-ui", "sans-serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(30, 30, 30, 1)',
        'brutal-lg': '8px 8px 0px 0px rgba(30, 30, 30, 1)',
        'brutal-hover': '2px 2px 0px 0px rgba(30, 30, 30, 1)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
