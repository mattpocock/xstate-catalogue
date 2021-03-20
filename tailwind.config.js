module.exports = {
  purge: ["./pages/**/**.{ts,tsx,mdx}", "./lib/**/**.{ts,tsx,mdx}"],
  plugins: [require("@tailwindcss/typography")],
};
