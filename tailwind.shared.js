const tailwindConfig = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './SAMPLE/**/*.{ts,tsx}', '!./SAMPLE/node_modules/**'],
  theme: {
    extend: {
      colors: {
        md3: {
          primary: 'var(--md3-primary)',
          'on-primary': 'var(--md3-on-primary)',
          secondary: 'var(--md3-secondary)',
          surface: 'var(--md3-surface)',
          'surface-variant': 'var(--md3-surface-variant)',
          outline: 'var(--md3-outline)',
          'on-surface': 'var(--md3-on-surface)',
          'on-surface-variant': 'var(--md3-on-surface-variant)'
        }
      },
      borderRadius: {
        md3: 'var(--md3-radius)'
      },
      boxShadow: {
        md3: '0 1px 2px rgba(0,0,0,0.24), 0 4px 18px rgba(0,0,0,0.12)'
      },
      spacing: {
        18: '4.5rem'
      }
    }
  },
  plugins: []
};

module.exports = tailwindConfig;
