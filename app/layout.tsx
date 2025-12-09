import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/lib/wagmi';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Arc Network',
    description: 'Premium DeFi Lending & Borrowing',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookie = headers().get('cookie');
    const initialState = cookieToInitialState(config, cookie);

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers initialState={initialState}>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
