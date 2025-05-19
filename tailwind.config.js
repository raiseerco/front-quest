/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        reading: {
          bg: '#f5ecd8',
          text: '#3b2f2f',
          DEFAULT: '#3b2f2f', // Añade un color DEFAULT para usar solo `reading`
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
}

export default config
