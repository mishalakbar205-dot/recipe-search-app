/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3b82f6",   // Tailwind blue-500
          purple: "#8b5cf6", // Tailwind purple-500
          green: "#10b981",  // Tailwind emerald-500
          rose: "#f43f5e",   // Tailwind rose-500
        },
      },
      backgroundImage: {
        // For soft food/kitchen blurred images (you can add your own file later)
        "food-texture": "url('/src/assets/bg-food.jpg')",
        // Gentle gradient option
        "gradient-soft": "linear-gradient(135deg, #c3ecf4 0%, #f5d0fe 100%)",
      },
    },
  },
  plugins: [],
};
