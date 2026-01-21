/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Sacred Administrative - Deep Teal Primary
                primary: {
                    50: '#E6F2F2',
                    100: '#B3D9D9',
                    200: '#80C0C0',
                    300: '#4DA7A7',
                    400: '#268F8F',
                    500: '#0D4F4F',
                    600: '#0A3D3D',
                    700: '#082B2B',
                    800: '#051A1A',
                    900: '#030D0D',
                },
                // Warm Gold Accent
                gold: {
                    50: '#FCF8E8',
                    100: '#F7EFC5',
                    200: '#F0E19F',
                    300: '#E8D278',
                    400: '#D4AF37',
                    500: '#C9A227',
                    600: '#B8941F',
                    700: '#9A7B19',
                    800: '#7C6314',
                    900: '#5E4A0F',
                },
                // Surface colors
                surface: {
                    DEFAULT: '#FAF9F7',
                    50: '#FFFFFF',
                    100: '#FAF9F7',
                    200: '#F5F3F0',
                    300: '#EFEDE8',
                },
            },
            fontFamily: {
                display: ['DM Sans', 'system-ui', 'sans-serif'],
                body: ['Nunito', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'warm-sm': '0 1px 2px 0 rgba(13, 79, 79, 0.05)',
                'warm': '0 1px 3px 0 rgba(13, 79, 79, 0.1), 0 1px 2px 0 rgba(13, 79, 79, 0.06)',
                'warm-md': '0 4px 6px -1px rgba(13, 79, 79, 0.1), 0 2px 4px -1px rgba(13, 79, 79, 0.06)',
                'warm-lg': '0 10px 15px -3px rgba(13, 79, 79, 0.1), 0 4px 6px -2px rgba(13, 79, 79, 0.05)',
                'warm-xl': '0 20px 25px -5px rgba(13, 79, 79, 0.1), 0 10px 10px -5px rgba(13, 79, 79, 0.04)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}
