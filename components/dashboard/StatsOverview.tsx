"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS, ERC20_ABI } from "@/lib/contracts";
import { useLanguage } from '@/lib/i18n';

export function StatsOverview() {
    const { address, isConnected } = useAccount();
    const { t } = useLanguage();

    const { data: results } = useReadContracts({
        contracts: [
            { address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!] },
            { address: EURC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!] },
            { address: USYC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!] },
        ],
        query: {
            enabled: !!address,
            refetchInterval: 10000
        }
    });

    // Helper to safely parse BigInt results
    const getBalance = (index: number) => {
        if (!results || !results[index] || results[index].status !== "success") return 0;
        return Number(formatUnits(results[index].result as bigint, 6));
    };

    const balUSDC = getBalance(0);
    const balEURC = getBalance(1);
    const balUSYC = getBalance(2);

    // Assuming 1:1 peg for simplicity in this demo
    const totalNetWorth = balUSDC + balEURC + balUSYC;

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
                        ${isConnected ? totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground">{t.dashboard.stats.from_last_month}</p>
                </CardContent>
            </Card>

            {/* Net APY (Mocked - requires Lending Pool) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t.dashboard.stats.net_apy}</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4.20%</div>
                    <p className="text-xs text-muted-foreground">{t.dashboard.stats.weighted_avg}</p>
                </CardContent>
            </Card>

            {/* Total Supplied (Mocked - requires Lending Pool) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t.dashboard.stats.total_supplied}</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$0.00</div>
                </CardContent>
            </Card>

            {/* Total Borrowed (Mocked - requires Lending Pool) */}
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
    );
}
