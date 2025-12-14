import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/lib/wagmi';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "Nexux Lend - DeFi Lending Protocol",
    description: "Supply, borrow, and earn with Nexux Lend - Premier DeFi lending protocol",
    manifest: '/manifest.json',
    themeColor: '#7F201C',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Nexux Lend',
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
        shortcut: '/icon-32x32.png',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const cookie = headersList.get('cookie');
    const initialState = cookieToInitialState(config, cookie);

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers initialState={initialState}>
                    {children}
                </Providers>
                <Toaster />
            </body>
        </html>
    );
}
