/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4f46e5',
                secondary: '#1e1b4b',
                accent: '#8b5cf6',
            },
        },
    },
    plugins: [],
}
