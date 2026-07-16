module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#030303',
        'secondary-bg': '#0a0a0a',
        'card-bg': 'rgba(255,255,255,0.03)',
        'gold': '#E6C687',
        'gold-hover': '#F5DCA8',
        'gold-dark': '#B59554',
        'border': 'rgba(255,255,255,0.08)',
        'text-light': '#CFCFCF',
        'text-medium': '#8F8F8F',
      },
      borderRadius: {
        '12': '12px',
        '20': '20px',
        '24': '24px',
      },
    },
  },
  plugins: [],
}
