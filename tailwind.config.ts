import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        monad: {
          50: '#f4e8ff',
          400: '#b562ff',
          500: '#9538ff',
          900: '#13061f'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(181,98,255,.35), 0 0 24px rgba(149,56,255,.35)'
      }
    }
  },
  plugins: []
};

export default config;
