/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './App.tsx', './components/**/*.{ts,tsx}', './utils/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        wood: {
          light: '#d4a574',
          dark: '#292524',
        },
        fret: {
          light: '#a3a3a3',
          dark: '#57534e',
        },
      },
    },
  },
  plugins: [],
};
