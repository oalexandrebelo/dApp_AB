"use client";

import Image from 'next/image';
import Link from 'next/link';
import { WalletStatus } from './WalletStatus';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { Menu, X, LayoutDashboard, BarChart3, History, AlertTriangle, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
    onBridgeClick?: () => void;
}

export function Header({ onBridgeClick }: HeaderProps) {
    const { isConnected } = useAccount();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/dashboard/transactions', label: 'Transactions', icon: History },
        { href: '/liquidate', label: 'Liquidate', icon: AlertTriangle },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
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

                    {/* Desktop Navigation - Hidden for now, can add later */}
                    <nav className="hidden lg:flex items-center gap-6 ml-8">
                        {isConnected && navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === link.href
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side */}
                    <div className="ml-auto flex items-center gap-4">
                        <WalletStatus />

                        {/* Mobile Menu Button */}
                        {isConnected && (
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Slide-out Menu */}
                    <div className="fixed top-16 right-0 bottom-0 w-72 bg-card border-l shadow-lg z-50 lg:hidden animate-in slide-in-from-right duration-300">
                        <nav className="flex flex-col p-4 gap-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-accent"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </>
            )}
        </>
    );
}

