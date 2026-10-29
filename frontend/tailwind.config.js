/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#17365D',
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d8eb',
          300: '#94bbe0',
          400: '#5e9ad1',
          500: '#387dc1',
          600: '#2763a3',
          700: '#1f4e82',
          800: '#1c426e',
          900: '#17365D',
          950: '#0f243f',
        },
        accent: {
          DEFAULT: '#168C86',
          50: '#f0fdfc',
          100: '#ccfbf7',
          200: '#99f6ee',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#168C86',
          700: '#116d68',
          800: '#115754',
          900: '#134745',
        },
        surface: {
          DEFAULT: '#F7F8FA',
          card: '#FFFFFF',
        },
        charcoal: {
          DEFAULT: '#202938',
          light: '#2d3748',
        },
        muted: {
          DEFAULT: '#667085',
          light: '#98a2b3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
