/** @type {import('tailwindcss').Config} */
const shade = (n) => `rgb(var(--brand-${n}) / <alpha-value>)`;

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // The customer app's accent colour. Values come from CSS variables so a restaurant's
      // colour can be applied at runtime (see contexts/BrandContext.js); defaults are in index.css.
      colors: {
        brand: Object.fromEntries([50, 100, 200, 300, 500, 600, 700].map((n) => [n, shade(n)])),
      },
    },
  },
  plugins: [],
}
