"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Web3Tooltip } from "@/components/Web3Tooltip";
import { CountUp } from "@/components/react-bits/CountUp";
import { motion } from "framer-motion";

interface HeroMetricsProps {
    netWorth: number;
    totalSupplied: number;
    totalBorrowed: number;
    healthFactor: number;
    isConnected: boolean;
}

// Glass card with gradient border
const glassCard = cn(
    "backdrop-blur-md bg-card/40",
    "border border-white/10",
    "shadow-xl hover:shadow-2xl",
    "transition-all duration-300",
    "rounded-xl overflow-hidden"
);

// Stagger animation variants
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" }
    },
};

// Mini Health Factor indicator
function MiniHealthGauge({ value }: { value: number }) {
    const getColor = () => {
        if (value >= 1.5) return "#22c55e"; // green
        if (value >= 1.2) return "#eab308"; // yellow
        if (value >= 1.0) return "#f97316"; // orange
        return "#ef4444"; // red
    };

    const getStatus = () => {
        if (value >= 1.5) return "Safe";
        if (value >= 1.2) return "Moderate";
        if (value >= 1.0) return "Risky";
        return "At Risk";
    };

    const percentage = Math.min((value / 3) * 100, 100);

    return (
        <div className="space-y-2">
            {/* Value display */}
            <div className="flex items-baseline gap-1">
                <span
                    className="text-4xl font-bold tracking-tight"
                    style={{ color: getColor() }}
                >
                    {value.toFixed(2)}
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: getColor() }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>

            {/* Status label */}
            <p
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: getColor() }}
            >
                {getStatus()}
            </p>
        </div>
    );
}

export function HeroMetrics({
    netWorth,
    totalSupplied,
    totalBorrowed,
    healthFactor,
    isConnected,
}: HeroMetricsProps) {
    if (!isConnected) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className={cn(glassCard, "border-dashed border-cyan-500/30")}>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Wallet className="h-16 w-16 text-cyan-400/60 mb-6" />
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                            Connect Your Wallet
                        </h3>
                        <p className="text-sm text-muted-foreground text-center max-w-md leading-relaxed">
                            Connect your wallet to view your positions, supply assets, and start earning yield.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    const showHealthFactor = totalBorrowed > 0;

    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Net Worth */}
            <motion.div variants={item}>
                <Card className={cn(
                    glassCard,
                    "relative group",
                    "before:absolute before:inset-0 before:rounded-xl before:p-px",
                    "before:bg-gradient-to-br before:from-cyan-500/30 before:via-transparent before:to-violet-500/30",
                    "before:-z-10"
                )}>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20">
                                <Wallet className="h-4 w-4 text-cyan-400" />
                            </div>
                            <Web3Tooltip term="Net Worth">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider cursor-help">
                                    Net Worth
                                </p>
                            </Web3Tooltip>
                        </div>
                        <p className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                            <CountUp value={netWorth} prefix="$" duration={1.2} />
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 opacity-70">
                            Total portfolio value
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Total Supplied */}
            <motion.div variants={item}>
                <Card className={cn(
                    glassCard,
                    "group hover:border-emerald-500/30"
                )}>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                                <TrendingUp className="h-4 w-4 text-emerald-400" />
                            </div>
                            <Web3Tooltip term="Collateral">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider cursor-help">
                                    Supplied
                                </p>
                            </Web3Tooltip>
                        </div>
                        <p className="text-4xl font-bold text-emerald-400 tracking-tight">
                            <CountUp value={totalSupplied} prefix="$" duration={1.4} />
                        </p>
                        <p className="text-xs text-emerald-500/70 mt-2 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Earning yield
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Total Borrowed */}
            <motion.div variants={item}>
                <Card className={cn(
                    glassCard,
                    "group hover:border-orange-500/30"
                )}>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                                <TrendingDown className="h-4 w-4 text-orange-400" />
                            </div>
                            <Web3Tooltip term="Borrow">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider cursor-help">
                                    Borrowed
                                </p>
                            </Web3Tooltip>
                        </div>
                        <p className="text-4xl font-bold text-orange-400 tracking-tight">
                            <CountUp value={totalBorrowed} prefix="$" duration={1.6} />
                        </p>
                        <p className="text-xs text-orange-500/70 mt-2 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            Accruing interest
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Health Factor - Always show 4th card */}
            <motion.div variants={item}>
                <Card className={cn(
                    glassCard,
                    "group",
                    showHealthFactor ? (
                        healthFactor >= 1.5 ? "border-emerald-500/20" :
                            healthFactor >= 1.2 ? "border-yellow-500/20" :
                                "border-red-500/20"
                    ) : "border-white/5"
                )}>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className={cn(
                                "p-2 rounded-lg transition-colors",
                                showHealthFactor
                                    ? "bg-violet-500/10 group-hover:bg-violet-500/20"
                                    : "bg-white/5"
                            )}>
                                <Activity className={cn(
                                    "h-4 w-4",
                                    showHealthFactor ? "text-violet-400" : "text-muted-foreground"
                                )} />
                            </div>
                            <Web3Tooltip term="Health Factor">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider cursor-help">
                                    Health Factor
                                </p>
                            </Web3Tooltip>
                        </div>

                        {showHealthFactor ? (
                            <MiniHealthGauge value={healthFactor} />
                        ) : (
                            <div className="space-y-2">
                                <p className="text-4xl font-bold text-muted-foreground/50 tracking-tight">
                                    —
                                </p>
                                <p className="text-xs text-muted-foreground/50">
                                    No active borrows
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}



