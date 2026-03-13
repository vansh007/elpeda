/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        elp: {
          50:  '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        plasma: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        surface: {
          0:   '#030a0a',
          1:   '#061212',
          2:   '#0b1f1f',
          3:   '#0f2b2b',
          4:   '#163636',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(20,184,166,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.04) 1px, transparent 1px)",
        'radial-elp': 'radial-gradient(ellipse at 50% 0%, rgba(20,184,166,0.15) 0%, transparent 65%)',
        'radial-plasma': 'radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'count-up': 'countUp 1s ease-out forwards',
        'scan': 'scan 3s linear infinite',
        'scan-line': 'scanLine 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(20,184,166,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(20,184,166,0.6), 0 0 80px rgba(20,184,166,0.2)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        scanLine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'nova-sm': '0 0 10px rgba(20,184,166,0.3)',
        'nova-md': '0 0 20px rgba(20,184,166,0.4)',
        'nova-lg': '0 0 40px rgba(20,184,166,0.3), 0 0 80px rgba(20,184,166,0.1)',
        'plasma-sm': '0 0 10px rgba(139,92,246,0.3)',
        'inset-nova': 'inset 0 1px 0 rgba(20,184,166,0.2)',
      },
    },
  },
  plugins: [],
}
