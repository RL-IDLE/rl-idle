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
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        prestigeIn: {
          '0%': { opacity: 0, transform: 'scale(3)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        numberUpdate: 'numberUpdate 0.2s linear',
        bigNumberUpdate: 'bigNumberUpdate 0.3s linear',
        fadeIn: 'fadeIn 0.3s linear',
        prestigeIn:
          'prestigeIn 0.4s cubic-bezier(.99,-0.01,.94,.61) 0.5s forwards',
        prestigeOut: 'fadeOut 0.4s cubic-bezier(.85,.24,.88,.62) 0.5s forwards',
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
