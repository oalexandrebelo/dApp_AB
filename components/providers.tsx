"use client";

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, base, arbitrum, polygon, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { LanguageProvider, useLanguage } from '@/lib/i18n';

const arcTestnet = {
    id: 5042002,
    name: 'Arc Testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
    },
    blockExplorers: {
        default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
    },
} as const;

const config = getDefaultConfig({
    appName: 'Arc Network',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    chains: [sepolia, arcTestnet, mainnet, base, arbitrum, polygon],
    ssr: true,
    transports: {
        [sepolia.id]: http(),
        [arcTestnet.id]: http(),
        [mainnet.id]: http(),
        [base.id]: http(),
        [arbitrum.id]: http(),
        [polygon.id]: http(),
    },
});

const queryClient = new QueryClient();

const localeMap: Record<string, string> = {
    'en': 'en-US',
    'pt': 'pt-BR',
    'es': 'es-419'
};

function RainbowKitLocalizer({ children }: { children: React.ReactNode }) {
    const { language } = useLanguage();

    return (
        <RainbowKitProvider
            locale={localeMap[language] as any}
            theme={darkTheme({
                accentColor: '#7b3fe4', // Purple accent
                accentColorForeground: 'white',
                borderRadius: 'medium',
                overlayBlur: 'large',
            })}
        >
            {children}
        </RainbowKitProvider>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <LanguageProvider>
                    <RainbowKitLocalizer>
                        {children}
                    </RainbowKitLocalizer>
                </LanguageProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
