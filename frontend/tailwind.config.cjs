module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',
        surface: 'var(--surface)',
        bg: 'var(--bg)',
        text: 'var(--text)',
        muted: 'var(--muted)',
      },
    },
  },
  plugins: [],
};
