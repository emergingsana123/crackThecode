/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['Press Start 2P', 'monospace'],
        'retro': ['VT323', 'monospace'],
      },
      colors: {
        'neon-blue': '#4D96FF',
        'neon-purple': '#FF6B6B',
        'neon-pink': '#FF6B6B',
        'dark-bg': '#FFF8E7',
        'dark-surface': '#FFFFFF',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typewriter': 'typewriter 3s steps(40, end) forwards',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #4D96FF, 0 0 10px #4D96FF, 0 0 15px #4D96FF' },
          '100%': { boxShadow: '0 0 10px #4D96FF, 0 0 20px #4D96FF, 0 0 30px #4D96FF' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
