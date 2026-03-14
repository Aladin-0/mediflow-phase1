import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2563EB",
                success: "#16A34A",
                warning: "#D97706",
                danger: "#DC2626",
                muted: "#64748B",
            },
            fontFamily: {
                mono: ["JetBrains Mono", "monospace"],
            },
        },
    },
    plugins: [],
};
export default config;
