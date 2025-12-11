"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthFactor } from "@/components/dashboard/HealthFactor";
import { AssetTable } from "@/components/dashboard/AssetTable";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { BorrowedAssetsTable } from "@/components/dashboard/BorrowedAssetsTable";
import { SuppliedAssetsTable } from "@/components/dashboard/SuppliedAssetsTable";
import { LiquidationAlert } from "@/components/dashboard/LiquidationAlert";
import { EModeCard } from "@/components/dashboard/EModeCard";
import { ProtocolStats } from "@/components/dashboard/ProtocolStats";
import { BridgeModal } from "@/components/bridge/BridgeModal";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { APYChart } from "@/components/dashboard/APYChart";
import { useLanguage } from '@/lib/i18n';
import { useNetAPY } from '@/lib/useNetAPY';
import { WalletStatus } from '@/components/WalletStatus';
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS, LENDING_POOL_ADDRESS, LENDING_POOL_ABI, ERC20_ABI } from "@/lib/contracts";

export default function DashboardPage() {
    const { t } = useLanguage();
    const { address, isConnected } = useAccount();
    const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);

    const { data: results, refetch, isRefetching } = useReadContracts({
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

            // E-Mode Category
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'userEModeCategory', args: [address!] },
        ],
        query: {
            enabled: !!address,
            refetchInterval: 30000 // ✅ Changed from 10000 (30s instead of 10s)
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

    const userEModeCategory = results?.[9]?.status === "success" ? Number(results[9].result) : 0;

    const totalWallet = walletUSDC + walletEURC + walletUSYC;
    const totalSupplied = suppliedUSDC + suppliedEURC + suppliedUSYC;
    const totalBorrowed = borrowedUSDC + borrowedEURC + borrowedUSYC;

    // ✅ Memoized calculations
    const netWorth = useMemo(() =>
        totalWallet + totalSupplied - totalBorrowed,
        [totalWallet, totalSupplied, totalBorrowed]
    );

    const LIQUIDATION_THRESHOLD = 0.8;
    const healthFactor = useMemo(() => {
        if (totalBorrowed === 0) return 999;
        const calculatedHF = (totalSupplied * LIQUIDATION_THRESHOLD) / totalBorrowed;
        return Math.min(calculatedHF, 999);
    }, [totalSupplied, totalBorrowed]);

    const netAPY = useNetAPY(
        suppliedUSDC,
        suppliedEURC,
        suppliedUSYC,
        borrowedUSDC,
        borrowedEURC,
        borrowedUSYC
    );

    const handleRefresh = () => {
        if (refetch) refetch();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.header.title}</h2>
                    <p className="text-sm text-muted-foreground">{t.dashboard.header.subtitle}</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefetching}
                    className={`p-2 rounded-full hover:bg-muted transition-colors ${isRefetching ? 'animate-spin opacity-50' : ''}`}
                    title="Refresh Data"
                >
                    <ArrowUpRight className={`h-5 w-5 ${isRefetching ? '' : 'rotate-45'}`} />
                </button>
            </div>

            {/* Liquidation Alert - Dismissible, top of page */}
            {isConnected && totalBorrowed > 0 && healthFactor < 1.2 && (
                <LiquidationAlert healthFactor={healthFactor} />
            )}

            {/* Protocol Stats - Global metrics */}
            <ProtocolStats />

            {/* Cross-Chain Bridge Button */}
            <div className="flex justify-center">
                <Button
                    onClick={() => setIsBridgeModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                    <ArrowLeftRight className="mr-2 h-5 w-5" />
                    Cross-Chain Bridge
                </Button>
            </div>

            {/* Key Metrics - Stats Overview */}
            <StatsOverview
                netWorth={netWorth}
                totalSupplied={totalSupplied}
                totalBorrowed={totalBorrowed}
                netAPY={netAPY}
                isConnected={isConnected}
            />

            {/* Health Factor + E-Mode - 2 column grid */}
            {isConnected && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                        <HealthFactor value={healthFactor} />
                    </div>
                    <EModeCard
                        currentCategory={userEModeCategory}
                        onSuccess={refetch}
                    />
                </div>
            )}

            {/* Supply/Borrow Tables - 2 column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SuppliedAssetsTable
                    suppliedUSDC={suppliedUSDC}
                    suppliedEURC={suppliedEURC}
                    suppliedUSYC={suppliedUSYC}
                />
                <BorrowedAssetsTable
                    borrowedUSDC={borrowedUSDC}
                    borrowedEURC={borrowedEURC}
                    borrowedUSYC={borrowedUSYC}
                />
            </div>

            {/* Available Markets */}
            <AssetTable />

            {/* Transaction History */}
            <TransactionHistory />

            {/* APY History Chart */}
            <APYChart />

            {/* Bridge Modal */}
            <BridgeModal
                isOpen={isBridgeModalOpen}
                onClose={() => setIsBridgeModalOpen(false)}
                autoSupply={true}
            />
        </div>
    );
}
