/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#04070d",
          bgLight: "#080e18",
          card: "#060b14",
          cardHover: "#0a1322",
          border: "#132338",
          borderCyan: "#00f0ff33",
          borderCyanBright: "#00f0ff88",
          cyan: "#00f0ff",
          cyanDim: "#00b4d8",
          cyanGlow: "#00f0ff40",
          text: "#f1f5f9",
          textMuted: "#788ea6",
          textDim: "#42556b",
          accentGreen: "#10b981",
          accentAmber: "#f59e0b",
          accentRed: "#ef4444",
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'cyan-sm': '0 0 10px rgba(0, 240, 255, 0.2)',
        'cyan-md': '0 0 20px rgba(0, 240, 255, 0.35)',
        'cyan-lg': '0 0 35px rgba(0, 240, 255, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse': 'spin-rev 25s linear infinite',
        'scanline': 'scanline 6s linear infinite',
      },
      keyframes: {
        'spin-rev': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
