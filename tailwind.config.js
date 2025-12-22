/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{njk,md,html,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Recursive',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        display: ['Recursive', 'system-ui', 'sans-serif'],
        body: ['Recursive', 'system-ui', 'sans-serif'],
        mono: ['Recursive', 'ui-monospace', '"SFMono-Regular"', 'Menlo', 'monospace']
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900'
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em'
      },
      lineHeight: {
        tight: '1.2',
        snug: '1.35',
        normal: '1.5',
        relaxed: '1.6',
        loose: '1.7'
      },
      boxShadow: {
        glow: '0 12px 30px rgba(79,70,229,0.16)'
      }
    }
  },
  plugins: []
};
