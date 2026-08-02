/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bullsye: {
          emerald: '#10b981',
          bg: '#09090b',
          surface: '#18181b',
        },
      },
    },
  },
  plugins: [],
};
