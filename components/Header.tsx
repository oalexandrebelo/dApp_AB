"use client";

import Image from 'next/image';
import Link from 'next/link';
import { WalletStatus } from './WalletStatus';
import { Button } from './ui/button';
import { ArrowLeftRight } from 'lucide-react';

interface HeaderProps {
    onBridgeClick?: () => void;
}

export function Header({ onBridgeClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    {/* Desktop: Full logo */}
                    <Image
                        src="/logo.svg"
                        alt="Nexux Lend"
                        width={140}
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

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        Dashboard
                    </Link>
                    {onBridgeClick && (
                        <Button
                            onClick={onBridgeClick}
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                            Bridge
                        </Button>
                    )}
                </nav>

                {/* Wallet Status */}
                <WalletStatus />
            </div>
        </header>
    );
}
