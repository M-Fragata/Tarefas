/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aqui conectamos as classes do Tailwind às suas variáveis CSS
        'movi-blue': 'var(--movi-blue)',
        'movi-cyan': 'var(--movi-cyan)',
        'movi-success': 'var(--movi-success)',
        'movi-error': 'var(--movi-error)',
        'movi-paper': 'var(--movi-paper)',
        'movi-dark': 'var(--movi-dark-text)',
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}