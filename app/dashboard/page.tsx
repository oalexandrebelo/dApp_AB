"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroMetrics } from "@/components/dashboard/HeroMetrics";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { AssetTable } from "@/components/dashboard/AssetTable";
import { SuppliedAssetsTable } from "@/components/dashboard/SuppliedAssetsTable";
import { BorrowedAssetsTable } from "@/components/dashboard/BorrowedAssetsTable";
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
    const [activeTab, setActiveTab] = useState<"markets" | "portfolio" | "analytics">("markets");

    const { data: results, refetch, isRefetching } = useReadContracts({
        contracts: [
            // Wallet Balances
            { address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!] },
            { address: EURC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!] },
            { address: USYC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [address!] },

            // Supplied Balances
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, USDC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, EURC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserBalance', args: [address!, USYC_ADDRESS] },

            // Borrowed Balances
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserDebt', args: [address!, USDC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserDebt', args: [address!, EURC_ADDRESS] },
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'getUserDebt', args: [address!, USYC_ADDRESS] },

            // E-Mode Category
            { address: LENDING_POOL_ADDRESS, abi: LENDING_POOL_ABI, functionName: 'userEModeCategory', args: [address!] },
        ],
        query: {
            enabled: !!address,
            refetchInterval: 30000,
        },
    });

    // Parse balances
    const usdcWalletBalance = results?.[0]?.result ? Number(formatUnits(results[0].result as bigint, 6)) : 0;
    const eurcWalletBalance = results?.[1]?.result ? Number(formatUnits(results[1].result as bigint, 6)) : 0;
    const usycWalletBalance = results?.[2]?.result ? Number(formatUnits(results[2].result as bigint, 6)) : 0;

    const usdcSupplied = results?.[3]?.result ? Number(formatUnits(results[3].result as bigint, 6)) : 0;
    const eurcSupplied = results?.[4]?.result ? Number(formatUnits(results[4].result as bigint, 6)) : 0;
    const usycSupplied = results?.[5]?.result ? Number(formatUnits(results[5].result as bigint, 6)) : 0;

    const usdcBorrowed = results?.[6]?.result ? Number(formatUnits(results[6].result as bigint, 6)) : 0;
    const eurcBorrowed = results?.[7]?.result ? Number(formatUnits(results[7].result as bigint, 6)) : 0;
    const usycBorrowed = results?.[8]?.result ? Number(formatUnits(results[8].result as bigint, 6)) : 0;

    const eModeCategory = results?.[9]?.result ? Number(results[9].result) : 0;

    // Calculate totals
    const totalSupplied = usdcSupplied + eurcSupplied + usycSupplied;
    const totalBorrowed = usdcBorrowed + eurcBorrowed + usycBorrowed;
    const netWorth = totalSupplied - totalBorrowed;

    // Calculate Health Factor
    const healthFactor = useMemo(() => {
        if (totalBorrowed === 0) return 999;
        const ltv = eModeCategory === 1 ? 0.97 : 0.75;
        const maxBorrow = totalSupplied * ltv;
        return maxBorrow / totalBorrowed;
    }, [totalSupplied, totalBorrowed, eModeCategory]);

    const handleRefresh = () => {
        refetch();
    };

    const handleGoToMarkets = () => {
        setActiveTab("markets");
    };

    // Markets Tab Content
    const marketsContent = (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Supply Markets */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Supply Markets</h3>
                    <AssetTable mode="supply" />
                </div>

                {/* Borrow Markets */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Borrow Markets</h3>
                    <AssetTable mode="borrow" />
                </div>
            </div>

            {/* E-Mode Card */}
            <EModeCard
                currentCategory={eModeCategory}
                onSuccess={refetch}
            />

            {/* Protocol Stats */}
            <ProtocolStats />
        </div>
    );

    // Portfolio Tab Content
    const portfolioContent = (
        <div className="space-y-6">
            {/* Liquidation Alert */}
            {isConnected && totalBorrowed > 0 && healthFactor < 1.2 && (
                <LiquidationAlert healthFactor={healthFactor} />
            )}

            {/* E-Mode Card */}
            <EModeCard
                currentCategory={eModeCategory}
                onSuccess={refetch}
            />

            {/* Supplied Assets */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Your Supplied Assets</h3>
                {totalSupplied > 0 ? (
                    <SuppliedAssetsTable
                        suppliedUSDC={usdcSupplied}
                        suppliedEURC={eurcSupplied}
                        suppliedUSYC={usycSupplied}
                    />
                ) : (
                    <EmptyState type="supply" onAction={handleGoToMarkets} />
                )}
            </div>

            {/* Borrowed Assets */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Your Borrowed Assets</h3>
                {totalBorrowed > 0 ? (
                    <BorrowedAssetsTable
                        borrowedUSDC={usdcBorrowed}
                        borrowedEURC={eurcBorrowed}
                        borrowedUSYC={usycBorrowed}
                    />
                ) : (
                    <EmptyState type="borrow" onAction={handleGoToMarkets} />
                )}
            </div>
        </div>
    );

    // Analytics Tab Content
    const analyticsContent = (
        <div className="space-y-6">
            {/* APY Chart */}
            <APYChart />

            {/* Transaction History */}
            <TransactionHistory />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header with Wallet Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.header.title}</h2>
                        <p className="text-sm text-muted-foreground">{t.dashboard.header.subtitle}</p>
                    </div>
                    <WalletStatus />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setIsBridgeModalOpen(true)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <ArrowLeftRight className="h-4 w-4" />
                        Bridge
                    </Button>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefetching}
                        className={`p-2 rounded-full hover:bg-muted transition-colors ${isRefetching ? 'animate-spin opacity-50' : ''}`}
                        title="Refresh Data"
                    >
                        <ArrowUpRight className={`h-5 w-5 ${isRefetching ? '' : 'rotate-45'}`} />
                    </button>
                </div>
            </div>

            {/* Hero Metrics */}
            <HeroMetrics
                netWorth={netWorth}
                totalSupplied={totalSupplied}
                totalBorrowed={totalBorrowed}
                healthFactor={healthFactor}
                isConnected={isConnected}
            />

            {/* Tabbed Interface */}
            <DashboardTabs
                marketsContent={marketsContent}
                portfolioContent={portfolioContent}
                analyticsContent={analyticsContent}
            />

            {/* Bridge Modal */}
            <BridgeModal
                isOpen={isBridgeModalOpen}
                onClose={() => setIsBridgeModalOpen(false)}
            />
        </div>
    );
}
