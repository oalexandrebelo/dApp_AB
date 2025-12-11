"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Web3Tooltip } from "@/components/Web3Tooltip";

interface HeroMetricsProps {
    netWorth: number;
    totalSupplied: number;
    totalBorrowed: number;
    healthFactor: number;
    isConnected: boolean;
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
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                        Connect your wallet to view your positions, supply assets, and start earning yield.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const getHealthFactorColor = (hf: number) => {
        if (hf >= 2) return "text-success-500";
        if (hf >= 1.2) return "text-yellow-500";
        return "text-red-500";
    };

    const getHealthFactorStatus = (hf: number) => {
        if (hf >= 2) return "Safe";
        if (hf >= 1.2) return "Moderate";
        return "At Risk";
    };

    return (
        <div className="space-y-4">
            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Net Worth - Primary */}
                <Card className="md:col-span-1 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-2">Net Worth</p>
                        <p className="text-4xl font-bold tracking-tight">
                            ${netWorth.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Across all assets
                        </p>
                    </CardContent>
                </Card>

                {/* Total Supplied */}
                <Card className="hover:shadow-elevation-2 transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-muted-foreground">📈 Total Supplied</p>
                        </div>
                        <p className="text-3xl font-bold text-success-500">
                            ${totalSupplied.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Earning yield
                        </p>
                    </CardContent>
                </Card>

                {/* Total Borrowed */}
                <Card className="p-4 hover:shadow-elevation-2 transition-shadow">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-muted-foreground">📉 Total Borrowed</p>
                        </div>
                        <p className="text-3xl font-bold text-error-500">
                            ${totalBorrowed.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Accruing interest
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Health Factor - Only show if user has borrowed */}
            {totalBorrowed > 0 && (
                <Card className={cn(
                    "border-2",
                    healthFactor >= 2 ? "border-success-500/20 bg-success-500/5" :
                        healthFactor >= 1.2 ? "border-yellow-500/20 bg-yellow-500/5" :
                            "border-red-500/20 bg-red-500/5"
                )}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Web3Tooltip term="Health Factor">
                                    <span className="text-sm font-medium">Health Factor</span>
                                </Web3Tooltip>
                                <span className={cn(
                                    "text-xs px-2 py-1 rounded-full",
                                    healthFactor >= 2 ? "bg-success-500/20 text-success-700" :
                                        healthFactor >= 1.2 ? "bg-yellow-500/20 text-yellow-700" :
                                            "bg-red-500/20 text-red-700"
                                )}>
                                    {getHealthFactorStatus(healthFactor)}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className={cn("text-3xl font-bold", getHealthFactorColor(healthFactor))}>
                                    {healthFactor.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {healthFactor < 1 ? "⚠️ Liquidation risk" : "Above 1.0 is safe"}
                                </p>
                            </div>
                        </div>

                        {/* Health Factor Progress Bar */}
                        <div className="mt-4">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full transition-all",
                                        healthFactor >= 2 ? "bg-success-500" :
                                            healthFactor >= 1.2 ? "bg-yellow-500" :
                                                "bg-red-500"
                                    )}
                                    style={{ width: `${Math.min((healthFactor / 3) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>0</span>
                                <span>1.0</span>
                                <span>2.0</span>
                                <span>3.0+</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

