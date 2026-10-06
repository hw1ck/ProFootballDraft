/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
      },
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-panel': 'var(--color-bg-panel)',
        'accent-primary': 'var(--color-accent-primary)',
        'accent-primary-hover': 'var(--color-accent-primary-hover)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'border-subtle': 'var(--color-border-subtle)',
        'danger': 'var(--color-danger)',
      }
    },
  },
  plugins: [],
}
