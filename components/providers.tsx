"use client";

import React from 'react';
import { WagmiProvider, State } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { LanguageProvider, useLanguage } from '@/lib/i18n';
import { config } from '@/lib/wagmi';

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

export function Providers({
    children,
    initialState
}: {
    children: React.ReactNode;
    initialState?: State;
}) {
    return (
        <WagmiProvider config={config} initialState={initialState}>
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
