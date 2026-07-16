module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#0B0B0D',
        'secondary-bg': '#161616',
        'card-bg': 'rgba(255,255,255,0.05)',
        'gold': '#D4AF37',
        'gold-hover': '#F5C84C',
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
