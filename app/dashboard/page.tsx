"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { HealthFactor } from "@/components/dashboard/HealthFactor";
import { AssetTable } from "@/components/dashboard/AssetTable";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { useLanguage } from '@/lib/i18n';
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS, LENDING_POOL_ADDRESS, LENDING_POOL_ABI, ERC20_ABI } from "@/lib/contracts";

export default function DashboardPage() {
    const { t } = useLanguage();
    const { address, isConnected } = useAccount();

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

    // Calculate Health Factor
    // HF = (Collateral * LTV) / Debt
    // Assumption: LTV = 80% (0.8) for all assets in this MVP
    const LIQUIDATION_THRESHOLD = 0.8;
    let healthFactor = 999; // Infinite by default
    if (totalBorrowed > 0) {
        healthFactor = (totalSupplied * LIQUIDATION_THRESHOLD) / totalBorrowed;
    } else if (totalSupplied === 0) {
        healthFactor = 0; // Or standard starting value
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t.dashboard.header.title}</h2>
                    <p className="text-muted-foreground">{t.dashboard.header.subtitle}</p>
                </div>
                <div className="w-full md:w-80 health-factor">
                    <HealthFactor value={healthFactor} />
                </div>
            </div>

            {/* Stats Overview passing calculated data to avoid double fetch */}
            <StatsOverview
                netWorth={netWorth}
                totalSupplied={totalSupplied}
                totalBorrowed={totalBorrowed}
                isConnected={isConnected}
            />

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
                            {totalBorrowed > 0
                                ? <div className="text-2xl font-bold text-orange-400">${totalBorrowed.toLocaleString()}</div>
                                : t.dashboard.assets.no_assets_borrowed
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
