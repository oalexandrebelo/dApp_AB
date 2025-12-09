"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ArrowLeftRight, PiggyBank, Receipt, Settings, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export function Sidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const navigation = [
        {
            label: t.dashboard.sidebar.dashboard,
            icon: LayoutDashboard,
            href: "/dashboard",
        },
        {
            label: t.dashboard.sidebar.supply,
            icon: PiggyBank,
            href: "/dashboard/supply",
        },
        {
            label: t.dashboard.sidebar.borrow,
            icon: Receipt,
            href: "/dashboard/borrow",
        },
        {
            label: t.dashboard.sidebar.transactions,
            icon: ArrowLeftRight,
            href: "/dashboard/transactions",
        },
        {
            label: t.dashboard.sidebar.analytics,
            icon: PieChart,
            href: "/dashboard/analytics",
        },
        {
            label: t.dashboard.sidebar.settings,
            icon: Settings,
            href: "/dashboard/settings",
        },
    ];

    return (
        <div className="flex flex-col h-full w-64 bg-card/50 backdrop-blur-xl">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    ArcLend
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground hover:pl-5"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4">
                <div className="bg-secondary/30 rounded-xl p-4 mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Language</p>
                    <LanguageSwitcher />
                </div>
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
                    <h3 className="text-sm font-semibold text-indigo-300 mb-1">Arc Testnet</h3>
                    <p className="text-xs text-indigo-400/80">Block: #5,420,092</p>
                </div>
            </div>
        </div>
    );
}
