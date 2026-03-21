/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: "#0e1320",
                accent: "#00c6ff",
                accent2: "#0072ff",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Poppins', 'sans-serif'],
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { textShadow: '0 0 15px rgba(0,198,255,0.45), 0 0 40px rgba(0,198,255,0.15)' },
                    '50%': { textShadow: '0 0 30px rgba(0,198,255,0.8), 0 0 80px rgba(0,198,255,0.3)' },
                },
                'float-up': {
                    '0%': { transform: 'translateY(0)', opacity: '1' },
                    '100%': { transform: 'translateY(-48px)', opacity: '0' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
                'live-blink': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.2' },
                },
                'glow-border': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,198,255,0)' },
                    '50%': { boxShadow: '0 0 0 3px rgba(0,198,255,0.18), 0 0 20px rgba(0,198,255,0.12)' },
                },
                'entry-slide': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
                'float-up': 'float-up 1.2s cubic-bezier(0.22,1,0.36,1) forwards',
                shimmer: 'shimmer 2s linear infinite',
                'live-blink': 'live-blink 1.5s ease-in-out infinite',
                'glow-border': 'glow-border 2.5s ease-in-out infinite',
                'entry-slide': 'entry-slide 0.5s ease-out both',
            },
        },
    },
    plugins: [],
}
