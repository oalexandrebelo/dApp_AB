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
    const { isConnected } = useAccount(); // Added useAccount hook to get isConnected status

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4">
                {/* Logo - Left */}
                height={32}
                className="md:hidden"
                priority
                    />
            </Link>

            {/* Wallet Status - Right */}
            <div className="ml-auto">
                <WalletStatus />
            </div>
        </div>
        </header >
    );
}
