"use client";

// ... imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useLanguage } from '@/lib/i18n';

interface StatsOverviewProps {
    netWorth: number;
    totalSupplied: number;
    totalBorrowed: number;
    isConnected: boolean;
}

export function StatsOverview({ netWorth, totalSupplied, totalBorrowed, isConnected }: StatsOverviewProps) {
    const { t } = useLanguage();

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Net Worth */}
            <Card className="bg-gradient-to-br from-indigo-900/20 to-indigo-900/10 border-indigo-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t.dashboard.stats.net_worth}</CardTitle>
                    <Wallet className="h-4 w-4 text-indigo-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${isConnected ? netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground">{t.dashboard.stats.from_last_month}</p>
                </CardContent>
            </Card>

            {/* Net APY (Estimated) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t.dashboard.stats.net_apy}</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {totalSupplied > 0 ? "4.8%" : "0.0%"}
                    </div>
                    <p className="text-xs text-muted-foreground">{t.dashboard.stats.weighted_avg}</p>
                </CardContent>
            </Card>

            {/* Total Supplied */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t.dashboard.stats.total_supplied}</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${isConnected ? totalSupplied.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                    </div>
                </CardContent>
            </Card>

            {/* Total Borrowed */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t.dashboard.stats.total_borrowed}</CardTitle>
                    <ArrowDownLeft className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${isConnected ? totalBorrowed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
