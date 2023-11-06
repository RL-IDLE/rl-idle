/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        //? Make the text grow and blur
        numberUpdate: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.15)', opacity: 0.8 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        bigNumberUpdate: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.35)', opacity: 0.9 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        numberUpdate: 'numberUpdate 0.2s linear',
        bigNumberUpdate: 'bigNumberUpdate 0.3s linear',
      },
      colors: {
        background: 'hsl(var(--background-hsl))',
        'gradient-dark': 'var(--gradient-dark)',
        'gradient-light': 'var(--gradient-light)',
      },
    },
  },
  plugins: [],
};
