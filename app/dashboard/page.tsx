"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { HealthFactor } from "@/components/dashboard/HealthFactor";
import { AssetTable } from "@/components/dashboard/AssetTable";
import { useLanguage } from '@/lib/i18n';

export default function DashboardPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t.dashboard.header.title}</h2>
                    <p className="text-muted-foreground">{t.dashboard.header.subtitle}</p>
                </div>
                <div className="w-full md:w-80 health-factor">
                    <HealthFactor value={1.8} />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-indigo-900/20 to-indigo-900/10 border-indigo-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.dashboard.stats.net_worth}</CardTitle>
                        <Wallet className="h-4 w-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                        <p className="text-xs text-muted-foreground">{t.dashboard.stats.from_last_month}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.dashboard.stats.net_apy}</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0.00%</div>
                        <p className="text-xs text-muted-foreground">{t.dashboard.stats.weighted_avg}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.dashboard.stats.total_supplied}</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t.dashboard.stats.total_borrowed}</CardTitle>
                        <ArrowDownLeft className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="col-span-1" id="sidebar-supply">
                    <AssetTable />
                </div>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>{t.dashboard.assets.borrowed_title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-40 text-muted-foreground">
                            {t.dashboard.assets.no_assets_borrowed}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
