/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f5',
          100: '#e8efe9',
          200: '#d1ddd4',
          300: '#afc4b5',
          400: '#8aa894',
          500: '#6d8f7a',
          600: '#5b8a72',
          700: '#476b59',
          800: '#3a5649',
          900: '#31473d',
        },
        teal: {
          500: '#3d8b8b',
          600: '#2f7070',
        },
        warm: {
          50: '#faf9f7',
          100: '#f7f5f2',
          200: '#ebe6df',
          300: '#d9d2c8',
          600: '#6b6560',
          700: '#5a554f',
          800: '#4a4540',
          900: '#2e2b28',
        },
        coral: {
          400: '#e8927c',
          500: '#e07a5f',
          600: '#c96a52',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '14px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(46, 43, 40, 0.06)',
        lift: '0 8px 24px rgba(46, 43, 40, 0.1)',
      },
      maxWidth: {
        app: '1200px',
      },
      transitionDuration: {
        DEFAULT: '250ms',
      },
    },
  },
  plugins: [],
};
