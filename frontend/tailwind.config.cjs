// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "hsl(210, 100%, 55%)", // bright blue
                secondary: "hsl(340, 80%, 65%)", // playful pink
                accent: "hsl(45, 100%, 55%)", // sunny orange
                background: "hsl(210, 30%, 95%)", // light pastel blue
                surface: "hsl(0, 0%, 100%)",
                muted: "hsl(210, 20%, 80%)",
            },
            fontFamily: {
                sans: ["'Inter'", "system-ui", "sans-serif"],
                display: ["'Outfit'", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};
