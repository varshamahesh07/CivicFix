/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          navy: {
            DEFAULT: '#0f233a',
            50: '#f0f4f8',
            100: '#d9e2ec',
            200: '#bcccdc',
            300: '#9fb3c8',
            400: '#829ab1',
            500: '#627d98',
            600: '#486581',
            700: '#334e68',
            800: '#1f426b',
            900: '#0f233a',
            950: '#091624',
          },
          teal: {
            DEFAULT: '#0d7675',
            50: '#f0fdfc',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d7675',
            700: '#0f5b5b',
            800: '#114a4a',
            900: '#0d3b3b',
          },
          sand: {
            50: '#fcfbf9',
            100: '#f8f6f1',
            200: '#efece4',
            300: '#e3dfd4',
            400: '#c8c2b3',
          },
          charcoal: {
            DEFAULT: '#1c2430',
            50: '#f8f9fa',
            100: '#f1f3f5',
            200: '#e4e7eb',
            300: '#cbd2d9',
            400: '#9aa5b1',
            500: '#616e7c',
            600: '#47525d',
            700: '#323f4b',
            800: '#242f3d',
            900: '#1c2430',
          }
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 28s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
