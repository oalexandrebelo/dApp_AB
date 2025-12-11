import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                // Semantic colors for DeFi
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#10b981', // Earning/Positive
                    700: '#047857',
                },
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    500: '#f59e0b', // Attention
                    700: '#b45309',
                },
                error: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    500: '#ef4444', // Cost/Danger
                    700: '#b91c1c',
                },
                info: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6', // Neutral
                    700: '#1d4ed8',
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontSize: {
                'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
                'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
                'h2': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
                'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
            },
            boxShadow: {
                'elevation-1': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                'elevation-2': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                'elevation-3': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            },
        },
    },
    plugins: [],
};
export default config;
