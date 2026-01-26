"use client";

import { useState } from "react";
import { BarChart3, Briefcase, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardTabsProps {
    marketsContent: React.ReactNode;
    portfolioContent: React.ReactNode;
    analyticsContent: React.ReactNode;
}

const tabs = [
    { id: "markets", label: "Markets", icon: TrendingUp },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

type TabId = typeof tabs[number]["id"];

export function DashboardTabs({
    marketsContent,
    portfolioContent,
    analyticsContent,
}: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState<TabId>("markets");

    const contentMap: Record<TabId, React.ReactNode> = {
        markets: marketsContent,
        portfolio: portfolioContent,
        analytics: analyticsContent,
    };

    return (
        <div className="w-full space-y-6">
            {/* Animated Tab List */}
            <div className="relative flex items-center gap-1 p-1.5 bg-muted/30 backdrop-blur-sm rounded-xl border border-white/5">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 z-10",
                                isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground/80"
                            )}
                        >
                            {/* Animated Background Pill */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabPill"
                                    className="absolute inset-0 bg-background/80 backdrop-blur-md shadow-lg rounded-lg border border-white/10"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}

                            {/* Icon with scale animation */}
                            <motion.span
                                className="relative z-10"
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    color: isActive ? "rgb(6, 182, 212)" : undefined,
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <Icon className="h-4 w-4" />
                            </motion.span>

                            {/* Label */}
                            <span className="relative z-10">{tab.label}</span>

                            {/* Active indicator dot */}
                            {isActive && (
                                <motion.span
                                    layoutId="activeDot"
                                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Animated Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="space-y-4"
                >
                    {contentMap[activeTab]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}


