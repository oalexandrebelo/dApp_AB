"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, TrendingUp, DollarSign, Users } from "lucide-react";
import { LiquidatablePositionsTable } from "@/components/liquidator/LiquidatablePositionsTable";
import { useLiquidatablePositions } from "@/lib/useLiquidatablePositions";

export default function LiquidatorDashboard() {
    const { positions, stats, isLoading } = useLiquidatablePositions();

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Liquidator Dashboard</h1>
                <p className="text-muted-foreground">
                    Monitor and liquidate unhealthy positions to earn liquidation bonuses
                </p>
            </div>

            {/* Info Alert */}
            <Alert className="border-blue-500/30 bg-blue-950/20">
                <Info className="h-4 w-4 text-blue-400" />
                <AlertTitle className="text-blue-400">How Liquidations Work</AlertTitle>
                <AlertDescription className="text-sm">
                    When a user's Health Factor drops below 1.0, their position becomes liquidatable.
                    You can repay up to 50% of their debt (or 100% if HF &lt; 0.95) and receive their
                    collateral plus a <span className="font-bold text-blue-300">5% liquidation bonus</span>.
                </AlertDescription>
            </Alert>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Liquidatable Positions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div className="text-2xl font-bold">
                                {isLoading ? "..." : positions.length}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Debt at Risk</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-red-500" />
                            <div className="text-2xl font-bold text-red-400">
                                ${isLoading ? "..." : stats.totalDebtAtRisk.toLocaleString()}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Potential Profit (5%)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <div className="text-2xl font-bold text-green-400">
                                ${isLoading ? "..." : stats.potentialProfit.toLocaleString()}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Emergency Liquidations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            <div className="text-2xl font-bold text-red-400">
                                {isLoading ? "..." : stats.emergencyCount}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            HF &lt; 0.95 (100% liquidatable)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Liquidatable Positions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Liquidatable Positions</CardTitle>
                    <CardDescription>
                        Positions with Health Factor below 1.0 that can be liquidated
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LiquidatablePositionsTable
                        positions={positions}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
