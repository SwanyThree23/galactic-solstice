/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            colors: {
                yliv: {
                    deep: '#050505',
                    dark: '#0a0a0a',
                    card: '#121212',
                    red: '#ff3b30',
                    orange: '#ff9500',
                },
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            backgroundImage: {
                'radial-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
