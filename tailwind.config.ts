import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B717F',
          hover: '#235F6B',
          dark: '#2B9CAD',
        },
        surface: { light: '#FFFFFF', dark: '#1E293B' },
        bg: { light: '#F7F6F3', dark: '#0F172A' },
        border: { light: '#E2E8F0', dark: '#334155' },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          'primary-dark': '#F1F5F9',
          'secondary-dark': '#94A3B8',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#6366F1',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1)',
        'card-dark': '0 1px 3px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
