"use client";

import Image from 'next/image';
import Link from 'next/link';
import { WalletStatus } from './WalletStatus';
import { useAccount } from 'wagmi';

interface HeaderProps {
    onBridgeClick?: () => void;
}

export function Header({ onBridgeClick }: HeaderProps) {
    const { isConnected } = useAccount();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4">
                {/* Logo - Only show when connected */}
                {isConnected && (
                    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        {/* Desktop: Full logo */}
                        <Image
                            src="/logo-abr.svg"
                            alt="Nexux Lend"
                            width={100}
                            height={40}
                            className="hidden md:block"
                            priority
                        />
                        {/* Mobile: Icon only */}
                        <Image
                            src="/logo-icon.svg"
                            alt="Nexux"
                            width={32}
                            height={32}
                            className="md:hidden"
                            priority
                        />
                    </Link>
                )}

                {/* Wallet Status - Right */}
                <div className="ml-auto">
                    <WalletStatus />
                </div>
            </div>
        </header>
    );
}
