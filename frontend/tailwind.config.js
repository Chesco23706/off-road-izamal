/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FFC300",
          black: "#000000",
          gray: "#1C1C1C",
          surface: "#111111",
          green: "#22c55e",
          red: "#ef4444"
        }
      },
      fontFamily: {
        display: ["Teko", "sans-serif"],
        body: ["Barlow", "sans-serif"]
      },
      boxShadow: {
        panel: "0 20px 50px rgba(0, 0, 0, 0.45)",
        glow: "0 0 24px rgba(255, 195, 0, 0.35)"
      },
      backgroundImage: {
        grit:
          "radial-gradient(circle at 20% 20%, rgba(255, 195, 0, 0.14), transparent 22%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.06), transparent 18%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 28%), linear-gradient(120deg, #0b0b0b 0%, #1a1a1a 100%)"
      }
    }
  },
  plugins: []
};
