import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './types/**/*.ts',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
