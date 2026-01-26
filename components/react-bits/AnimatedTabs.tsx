"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabConfig {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface AnimatedTabsProps {
    tabs: TabConfig[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    className?: string;
    children?: React.ReactNode;
    /** Render function for tab content */
    renderContent?: (activeTab: string) => React.ReactNode;
}

export function AnimatedTabs({
    tabs,
    defaultTab,
    onChange,
    className,
    renderContent,
}: AnimatedTabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    return (
        <div className={cn("w-full", className)}>
            {/* Tab List */}
            <div className="relative flex items-center gap-1 p-1 bg-muted/50 rounded-xl backdrop-blur-sm">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={cn(
                                "relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                                isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground/80"
                            )}
                        >
                            {/* Animated Background Pill */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabBackground"
                                    className="absolute inset-0 bg-background shadow-sm rounded-lg"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}

                            {/* Tab Content */}
                            <span className="relative z-10 flex items-center gap-2">
                                {tab.icon && (
                                    <motion.span
                                        initial={false}
                                        animate={{
                                            scale: isActive ? 1.1 : 1,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {tab.icon}
                                    </motion.span>
                                )}
                                <span>{tab.label}</span>
                            </span>

                            {/* Active Indicator Line */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full"
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

            {/* Tab Content with Animation */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-6"
            >
                {renderContent?.(activeTab)}
            </motion.div>
        </div>
    );
}
