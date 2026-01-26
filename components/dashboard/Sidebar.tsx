"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ArrowLeftRight, PiggyBank, Receipt, Settings, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { motion } from 'framer-motion';

export function Sidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const navigation = [
        {
            label: t.dashboard.sidebar.dashboard,
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "#6366f1",
        },
        {
            label: t.dashboard.sidebar.supply,
            icon: PiggyBank,
            href: "/dashboard/supply",
            color: "#22c55e",
        },
        {
            label: t.dashboard.sidebar.borrow,
            icon: Receipt,
            href: "/dashboard/borrow",
            color: "#f97316",
        },
        {
            label: t.dashboard.sidebar.transactions,
            icon: ArrowLeftRight,
            href: "/dashboard/transactions",
            color: "#06b6d4",
        },
        {
            label: t.dashboard.sidebar.analytics,
            icon: PieChart,
            href: "/dashboard/analytics",
            color: "#8b5cf6",
        },
        {
            label: t.dashboard.sidebar.settings,
            icon: Settings,
            href: "/dashboard/settings",
            color: "#64748b",
        },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 },
    };

    return (
        <div className="flex flex-col h-full w-64 bg-card/30 backdrop-blur-xl border-r border-white/5">
            <motion.nav
                className="flex-1 px-4 py-6 space-y-1"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {navigation.map((navItem) => {
                    const isActive = pathname === navItem.href;
                    const Icon = navItem.icon;

                    return (
                        <motion.div key={navItem.href} variants={item}>
                            <Link
                                href={navItem.href}
                                className={cn(
                                    "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                    isActive
                                        ? "text-white"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {/* Active Background Gradient */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNavBackground"
                                        className="absolute inset-0 rounded-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${navItem.color}30, ${navItem.color}10)`,
                                            border: `1px solid ${navItem.color}40`,
                                        }}
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                {/* Hover Background */}
                                {!isActive && (
                                    <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors duration-200" />
                                )}

                                {/* Icon with animation */}
                                <motion.div
                                    className={cn(
                                        "relative z-10 p-2 rounded-lg transition-colors",
                                        isActive
                                            ? ""
                                            : "group-hover:bg-white/10"
                                    )}
                                    style={{
                                        backgroundColor: isActive ? `${navItem.color}20` : undefined,
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Icon
                                        className="h-5 w-5"
                                        style={{ color: isActive ? navItem.color : undefined }}
                                    />
                                </motion.div>

                                {/* Label */}
                                <span className={cn(
                                    "relative z-10 font-medium transition-all duration-200",
                                    isActive ? "font-semibold" : "group-hover:translate-x-1"
                                )}>
                                    {navItem.label}
                                </span>

                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <motion.span
                                        layoutId="activeNavDot"
                                        className="absolute right-3 w-2 h-2 rounded-full"
                                        style={{ backgroundColor: navItem.color }}
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 30,
                                        }}
                                    />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.nav>

            {/* Language Switcher with Glass Effect */}
            <div className="p-4">
                <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Language</p>
                    <LanguageSwitcher />
                </motion.div>
            </div>
        </div>
    );
}


