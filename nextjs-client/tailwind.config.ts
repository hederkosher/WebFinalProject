import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f5ff',
          100: '#c3e3ff',
          200: '#93c9ff',
          300: '#5aaaff',
          400: '#2e8ef5',
          500: '#1a72e0',
          600: '#1058bb',
          700: '#0d4494',
          800: '#0a3270',
          900: '#08234f',
        },
        accent: {
          50: '#edfff4',
          100: '#cffce3',
          200: '#9ef8c8',
          300: '#5ef0a4',
          400: '#22e07e',
          500: '#05c760',
          600: '#00a14e',
          700: '#007e3e',
          800: '#006333',
          900: '#00512b',
        },
        terrain: {
          950: '#060d09',
          900: '#0b1512',
          850: '#0e1b16',
          800: '#111f19',
          750: '#14251e',
          700: '#182b23',
          650: '#1c312a',
          600: '#203830',
          500: '#284539',
          400: '#325646',
          300: '#3f6c58',
          200: '#50836c',
          100: '#659b81',
        },
        sand: {
          50: '#fdfbf5',
          100: '#f6efda',
          200: '#ecdcb5',
          300: '#dfc78e',
          400: '#ceaa65',
          500: '#b88d42',
          600: '#9a7030',
          700: '#7c5722',
          800: '#5e4018',
          900: '#402c0e',
        },
      },
      fontFamily: {
        hebrew: ['Heebo', 'Arial', 'sans-serif'],
        mono: ['"Space Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 24px rgba(5, 199, 96, 0.22)',
        'glow-sm': '0 0 12px rgba(5, 199, 96, 0.15)',
        'glow-amber': '0 0 24px rgba(206, 170, 101, 0.25)',
        'glow-blue': '0 0 20px rgba(46, 142, 245, 0.2)',
        'terrain': '0 2px 12px rgba(0,0,0,0.45)',
        'terrain-lg': '0 8px 40px rgba(0,0,0,0.6)',
        'inner-glow': 'inset 0 0 32px rgba(5, 199, 96, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
