"use client";

import { useState } from "react";
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
import { CommandPalette } from '@/components/CommandPalette';
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS, LENDING_POOL_ADDRESS, LENDING_POOL_ABI, ERC20_ABI } from "@/lib/contracts";
import { parseBalances } from "@/lib/contractHelpers";
import { calculateHealthFactor } from "@/lib/healthFactor";
import { HeroMetricsSkeleton, AssetTableSkeleton } from "@/components/SkeletonLoaders";
import { Header } from "@/components/Header";
import { EarningsChart } from "@/components/analytics/EarningsChart";
import { AssetDistribution } from "@/components/analytics/AssetDistribution";
import { HealthFactorHistory } from "@/components/analytics/HealthFactorHistory";

export default function DashboardPage() {
    const { t } = useLanguage();
    const { address, isConnected } = useAccount();
    const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"markets" | "portfolio" | "analytics">("markets");
    const [commandOpen, setCommandOpen] = useState(false);

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

    // Parse balances using helper
    const balances = results ? parseBalances(results.slice(0, 9).map(r => r)) : [];
    const [usdcWalletBalance, eurcWalletBalance, usycWalletBalance] = balances.slice(0, 3);
    const [usdcSupplied, eurcSupplied, usycSupplied] = balances.slice(3, 6);
    const [usdcBorrowed, eurcBorrowed, usycBorrowed] = balances.slice(6, 9);

    const eModeCategory = results?.[9]?.result ? Number(results[9].result) : 0;

    // Calculate totals
    const totalSupplied = usdcSupplied + eurcSupplied + usycSupplied;
    const totalBorrowed = usdcBorrowed + eurcBorrowed + usycBorrowed;
    const netWorth = totalSupplied - totalBorrowed;

    // Calculate Health Factor using helper
    const healthFactor = calculateHealthFactor(totalSupplied, totalBorrowed, eModeCategory);

    // Loading state
    const isLoading = !results && isConnected;

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
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings Chart */}
                <EarningsChart />

                {/* Asset Distribution */}
                <AssetDistribution />
            </div>

            {/* Health Factor History - Full Width */}
            <HealthFactorHistory />

            {/* Existing Components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* APY Chart */}
                <APYChart />

                {/* Transaction History */}
                <TransactionHistory />
            </div>
        </div>
    );

    return (
        <>
            {/* Header with Logo */}
            <Header onBridgeClick={() => setIsBridgeModalOpen(true)} />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Loading State */}
                {isLoading ? (
                    <>
                        <HeroMetricsSkeleton />
                        <AssetTableSkeleton />
                    </>
                ) : (
                    <>
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
                    </>
                )}

                {/* Bridge Modal */}
                <BridgeModal
                    isOpen={isBridgeModalOpen}
                    onClose={() => setIsBridgeModalOpen(false)}
                />

                {/* Command Palette */}
                <CommandPalette
                    open={commandOpen}
                    onOpenChange={setCommandOpen}
                    onNavigate={(tab) => setActiveTab(tab as any)}
                    onAction={(action) => {
                        if (action === "bridge") setIsBridgeModalOpen(true);
                    }}
                />

                {/* Keyboard Shortcut Hint */}
                <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full shadow-lg">
                    Press <kbd className="px-1.5 py-0.5 bg-background rounded border">⌘K</kbd> or <kbd className="px-1.5 py-0.5 bg-background rounded border">Ctrl+K</kbd> for commands
                </div>
            </div>
        </>
    );
}
