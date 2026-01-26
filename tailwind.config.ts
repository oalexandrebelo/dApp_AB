import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
    	extend: {
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			success: {
    				'50': '#f0fdf4',
    				'100': '#dcfce7',
    				'500': '#10b981',
    				'700': '#047857'
    			},
    			warning: {
    				'50': '#fffbeb',
    				'100': '#fef3c7',
    				'500': '#f59e0b',
    				'700': '#b45309'
    			},
    			error: {
    				'50': '#fef2f2',
    				'100': '#fee2e2',
    				'500': '#ef4444',
    				'700': '#b91c1c'
    			},
    			info: {
    				'50': '#eff6ff',
    				'100': '#dbeafe',
    				'500': '#3b82f6',
    				'700': '#1d4ed8'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		fontSize: {
    			display: [
    				'3.5rem',
    				{
    					lineHeight: '1.1',
    					fontWeight: '700'
    				}
    			],
    			h1: [
    				'2.5rem',
    				{
    					lineHeight: '1.2',
    					fontWeight: '700'
    				}
    			],
    			h2: [
    				'2rem',
    				{
    					lineHeight: '1.3',
    					fontWeight: '600'
    				}
    			],
    			h3: [
    				'1.5rem',
    				{
    					lineHeight: '1.4',
    					fontWeight: '600'
    				}
    			]
    		},
    		boxShadow: {
    			'elevation-1': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    			'elevation-2': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    			'elevation-3': '0 10px 15px -3px rgb(0 0 0 / 0.1)'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
