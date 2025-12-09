"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS, ERC20_ABI, LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "@/lib/contracts";
import { useLanguage } from '@/lib/i18n';

export function StatsOverview() {
    const { address, isConnected } = useAccount();
    const { t } = useLanguage();

    const { data: results } = useReadContracts({
        contracts: [
            // Wallet Balances
            { address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!] },
            { address: EURC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!] },
            { address: USYC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!] },

            // Supplied Balances (Lending Pool)
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, USDC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, EURC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, USYC_ADDRESS] },

            // Borrowed Balances (Lending Pool)
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserDebt', args: [address!, USDC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserDebt', args: [address!, EURC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserDebt', args: [address!, USYC_ADDRESS] },
        ],
        query: {
            enabled: !!address,
            refetchInterval: 5000
        }
    });

    // Helper: Parse BigInt to Number (6 decimals)
    const getVal = (index: number) => {
        if (!results || !results[index] || results[index].status !== "success") return 0;
        return Number(formatUnits(results[index].result as bigint, 6));
    };

    const walletUSDC = getVal(0);
    const walletEURC = getVal(1);
    const walletUSYC = getVal(2);

    const suppliedUSDC = getVal(3);
    const suppliedEURC = getVal(4);
    const suppliedUSYC = getVal(5);

    const borrowedUSDC = getVal(6);
    const borrowedEURC = getVal(7);
    const borrowedUSYC = getVal(8);

    const totalWallet = walletUSDC + walletEURC + walletUSYC;
    const totalSupplied = suppliedUSDC + suppliedEURC + suppliedUSYC;
    const totalBorrowed = borrowedUSDC + borrowedEURC + borrowedUSYC;

    const netWorth = totalWallet + totalSupplied - totalBorrowed;

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
