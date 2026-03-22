export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },

      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },

      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)',
        hover: '0 4px 12px rgba(0,0,0,0.12)',
      },

      fontSize: {
        h1: ['24px', '32px'],
        h2: ['20px', '28px'],
        body: ['14px', '20px'],
        caption: ['12px', '16px'],
      },
    },
  },
  plugins: [],
};
