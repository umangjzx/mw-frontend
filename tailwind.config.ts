import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        background: 'var(--background-color)',
        gray: 'var(--gray-color)',
        white: 'var(--white-color)',
        black: 'var(--black-color)',
        error: {
          DEFAULT: 'var(--error-color)',
          light: 'var(--error-light-color)',
        },
        success: {
          DEFAULT: 'var(--success-color)',
          light: 'var(--success-light-color)',
        },
      },
    },
  },
  plugins: [],
};
export default config;
