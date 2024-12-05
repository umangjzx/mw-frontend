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
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        light: 'var(--font-light)',
        regular: 'var(--font-regular)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
      },
    },
  },
  plugins: [],
};
export default config;
