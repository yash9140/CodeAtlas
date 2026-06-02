/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#030303', // Deep Vercel/Linear black
        },
        card: {
          light: '#f9fafb',
          dark: '#09090b', // Sleek card gray
        },
        border: {
          light: '#e5e7eb',
          dark: '#1f1f23', // Subtle linear-style border
        },
        accent: {
          primary: '#6366f1', // Indigo
          secondary: '#3b82f6', // Blue
          success: '#10b981', // Emerald
          warning: '#f59e0b', // Amber
          error: '#ef4444', // Red
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glow-primary': '0 0 20px -5px rgba(99, 102, 241, 0.15)',
        'glow-secondary': '0 0 20px -5px rgba(59, 130, 246, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
