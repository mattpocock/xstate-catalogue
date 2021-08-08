module.exports = {
  darkMode: 'class',
  purge: ['./pages/**/**.{ts,tsx,mdx}', './lib/**/**.{ts,tsx,mdx}'],
  plugins: [require('@tailwindcss/typography')],
};
