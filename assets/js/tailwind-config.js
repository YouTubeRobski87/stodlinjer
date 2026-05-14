// Tailwind CDN configuration for Athletics font
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Athletics"',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        display: ['"Athletics"', 'system-ui', 'sans-serif'],
        body: ['"Athletics"', 'system-ui', 'sans-serif'],
        mono: ['"GT Pressura"', '"Athletics"', 'system-ui', 'monospace']
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '500', // Athletics has no 600, map to medium
        bold: '700',
        extrabold: '800',
        black: '900'
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.02em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em'
      },
      lineHeight: {
        tight: '1.2',
        snug: '1.35',
        normal: '1.55',
        relaxed: '1.6',
        loose: '1.75'
      },
      boxShadow: {
        glow: '0 10px 50px rgba(79,70,229,0.3)'
      }
    }
  }
};
