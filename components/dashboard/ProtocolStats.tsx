"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Activity } from "lucide-react";
import { useReadContracts } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI, USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS, ERC20_ABI } from "@/lib/contracts";
import { formatUnits } from "viem";
import { useMemo } from "react";

export function ProtocolStats() {
    // Fetch all protocol data
    const { data: results } = useReadContracts({
        contracts: [
            // Total Supplied
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'totalSupplied' as any, args: [USDC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'totalSupplied' as any, args: [EURC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'totalSupplied' as any, args: [USYC_ADDRESS] },

            // Total Borrowed
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'totalBorrowed' as any, args: [USDC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'totalBorrowed' as any, args: [EURC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'totalBorrowed' as any, args: [USYC_ADDRESS] },
        ],
        query: {
            refetchInterval: 30000 // 30 seconds
        }
    });

    const stats = useMemo(() => {
        if (!results) return { tvl: 0, supplied: 0, borrowed: 0, utilization: 0 };

        const getVal = (index: number) => {
            if (!results[index] || results[index].status !== "success") return 0;
            return Number(formatUnits(results[index].result as bigint, 6));
        };

        const suppliedUSDC = getVal(0);
        const suppliedEURC = getVal(1);
        const suppliedUSYC = getVal(2);

        const borrowedUSDC = getVal(3);
        const borrowedEURC = getVal(4);
        const borrowedUSYC = getVal(5);

        const totalSupplied = suppliedUSDC + suppliedEURC + suppliedUSYC;
        const totalBorrowed = borrowedUSDC + borrowedEURC + borrowedUSYC;
        const tvl = totalSupplied; // TVL = total supplied
        const utilization = totalSupplied > 0 ? (totalBorrowed / totalSupplied) * 100 : 0;

        return {
            tvl,
            supplied: totalSupplied,
            borrowed: totalBorrowed,
            utilization
        };
    }, [results]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
        if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
        return `$${num.toFixed(2)}`;
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Value Locked */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(stats.tvl)}</div>
                    <p className="text-xs text-muted-foreground">
                        Total assets supplied
                    </p>
                </CardContent>
            </Card>

            {/* Total Supplied */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Supplied</CardTitle>
                    <TrendingUp className="h-4 w-4 text-success-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(stats.supplied)}</div>
                    <p className="text-xs text-muted-foreground">
                        Across all assets
                    </p>
                </CardContent>
            </Card>

            {/* Total Borrowed */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                    <Activity className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(stats.borrowed)}</div>
                    <p className="text-xs text-muted-foreground">
                        Active debt
                    </p>
                </CardContent>
            </Card>

            {/* Utilization Rate */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.utilization.toFixed(2)}%</div>
                    <p className="text-xs text-muted-foreground">
                        Borrowed / Supplied
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

