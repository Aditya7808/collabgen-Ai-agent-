import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Primary backgrounds
                'space': {
                    DEFAULT: '#0F0F1A',
                    50: '#1A1A2E',
                    100: '#16162A',
                    200: '#121224',
                    300: '#0F0F1A',
                    400: '#0A0A14',
                    500: '#05050A',
                },
                // Accent colors
                'neon': {
                    cyan: '#00D4FF',
                    purple: '#A855F7',
                    pink: '#EC4899',
                    blue: '#3B82F6',
                    emerald: '#10B981',
                    amber: '#F59E0B',
                    orange: '#F97316',
                },
                // Surface colors
                'glass': {
                    light: 'rgba(255, 255, 255, 0.05)',
                    DEFAULT: 'rgba(255, 255, 255, 0.03)',
                    dark: 'rgba(0, 0, 0, 0.3)',
                },
                // Text colors
                'muted': '#8B8B9E',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-mesh': 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #0F0F1A 100%)',
                'glow-cyan': 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
                'glow-purple': 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
            },
            boxShadow: {
                'glow-sm': '0 0 15px -3px rgba(0, 212, 255, 0.3)',
                'glow-md': '0 0 25px -5px rgba(0, 212, 255, 0.4)',
                'glow-lg': '0 0 35px -5px rgba(0, 212, 255, 0.5)',
                'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'flow': 'flow 3s ease-in-out infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                flow: {
                    '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
                    '50%': { opacity: '1', transform: 'scale(1.05)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}

export default config
