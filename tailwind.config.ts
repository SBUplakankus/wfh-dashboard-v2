import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        md3: {
          primary: 'var(--md3-primary)',
          onPrimary: 'var(--md3-on-primary)',
          secondary: 'var(--md3-secondary)',
          surface: 'var(--md3-surface)',
          surfaceVariant: 'var(--md3-surface-variant)',
          outline: 'var(--md3-outline)',
          onSurface: 'var(--md3-on-surface)',
          onSurfaceVariant: 'var(--md3-on-surface-variant)'
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

export default config;
