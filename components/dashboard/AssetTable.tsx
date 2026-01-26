"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SupplyModal } from "@/components/flows/SupplyModal";
import { BorrowModal } from "@/components/flows/BorrowModal";
import { WithdrawModal } from "@/components/flows/WithdrawModal";
import { FlashloanModal } from "@/components/flows/FlashloanModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAccount, useReadContract } from "wagmi";
import { USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS, ERC20_ABI } from "@/lib/contracts";
import { formatUnits } from "viem";
import { useLanguage } from '@/lib/i18n';
import { motion } from "framer-motion";

const ASSET_CONFIGS = [
    { id: "usdc", symbol: "USDC", name: "USD Coin", address: USDC_ADDRESS, decimals: 6, apy: "4.5%", variableApy: "5.5%", liquidity: "5M", color: "#2775ca" },
    { id: "eurc", symbol: "EURC", name: "Euro Coin", address: EURC_ADDRESS, decimals: 6, apy: "3.2%", variableApy: "4.2%", liquidity: "2M", color: "#0052b4" },
    { id: "usyc", symbol: "USYC", name: "Yield Coin", address: USYC_ADDRESS, decimals: 6, apy: "5.1%", variableApy: "6.0%", liquidity: "1M", color: "#8b5cf6" },
] as const;

import { useAssetAPY } from '@/lib/useAPY';
import { Sparkline } from '@/components/dashboard/Sparkline';
import { Web3Tooltip } from '@/components/Web3Tooltip';




// Glass card base styles
const glassCard = "backdrop-blur-md bg-card/40 border border-white/10 shadow-xl rounded-xl";

// 1. Define strict interface matching ASSET_CONFIGS
interface AssetConfig {
    id: string;
    symbol: string;
    name: string;
    address: `0x${string}`;
    decimals: number;
    apy: string;
    variableApy: string;
    liquidity: string;
    color: string;
}

// 2. Helper to generate deterministic simulated data based on asset ID
// This ensures "USDC" always looks the same, but different from "ETH"
const generateSparklineData = (assetId: string, type: 'supply' | 'borrow') => {
    const seed = assetId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseAPY = type === 'supply' ? 4.0 : 5.0;
    const volatility = type === 'supply' ? 0.5 : 0.8;

    return Array.from({ length: 10 }).map((_, i) => {
        // Simple pseudo-random generator
        const noise = Math.sin(seed + i) * volatility;
        return Number((baseAPY + noise + (i * 0.1)).toFixed(2));
    });
};

function AssetRow({ asset, activeTab, openModal, t, index }: { asset: AssetConfig, activeTab: "supply" | "borrow", openModal: any, t: any, index: number }) {
    const { address, isConnected } = useAccount();

    const supplyAPY = useAssetAPY(asset.address, 'supply');
    const borrowAPY = useAssetAPY(asset.address, 'borrow');

    const { data: balanceData } = useReadContract({
        address: asset.address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address!],
        query: {
            enabled: !!address,
            refetchInterval: 30000
        }
    });

    const walletBalance = isConnected && balanceData
        ? Number(formatUnits(balanceData as bigint, asset.decimals)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "0.00";

    // Generate distinct data for this asset
    const sparklineData = generateSparklineData(asset.id, activeTab);
    const sparklineColor = activeTab === "supply" ? "#4ade80" : "#fb923c";

    return (
        <motion.div
            className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 items-center p-4 transition-all duration-200 border-t border-border/30 first:border-0 group rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{
                scale: 1.01,
                backgroundColor: "rgba(6, 182, 212, 0.05)",
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.1)"
            }}
        >
            <div className="flex items-center gap-3">
                {/* Enhanced Asset Icon */}
                <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg transition-transform group-hover:scale-110"
                    style={{
                        background: `linear-gradient(135deg, ${asset.color}40, ${asset.color}20)`,
                        border: `1px solid ${asset.color}50`,
                        color: asset.color,
                    }}
                >
                    {asset.symbol[0]}
                </div>
                <div>
                    <div className="font-bold text-foreground">{asset.symbol}</div>
                    <div className="text-xs text-muted-foreground">{asset.name}</div>
                </div>
            </div>

            <div className="text-right">
                <div className={cn("font-bold text-lg", activeTab === "supply" ? "text-success-400" : "text-orange-400")}>
                    {activeTab === "supply" ? supplyAPY : borrowAPY}
                </div>
                <div className="flex justify-end items-center gap-2">
                    <Sparkline
                        data={sparklineData}
                        color={sparklineColor}
                        width={60}
                        height={20}
                    />
                    <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                        <Web3Tooltip term={activeTab === "supply" ? "Supply APY" : "Variable APY"}>
                            <span className="border-b border-dotted border-muted-foreground/50 cursor-help">
                                {activeTab === "supply" ? t.dashboard.asset_table.apy : "Variable APY"}
                            </span>
                        </Web3Tooltip>
                    </div>
                </div>
            </div>

            <div className="text-right hidden md:block">
                <div className="font-bold">
                    {activeTab === "supply" ? walletBalance : asset.liquidity}
                </div>
                <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <Web3Tooltip term={activeTab === "supply" ? "Wallet Balance" : "Liquidity"}>
                        <span className="border-b border-dotted border-muted-foreground/50 cursor-help">
                            {activeTab === "supply" ? t.dashboard.assets.wallet_balance : "Liquidity"}
                        </span>
                    </Web3Tooltip>
                </div>
            </div>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    size="sm"
                    className={cn(
                        "rounded-full min-w-[100px] h-8 text-xs font-medium shadow-lg transition-all",
                        activeTab === "supply"
                            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-emerald-500/20"
                            : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20"
                    )}
                    onClick={() => openModal({ ...asset, balance: walletBalance }, activeTab)}
                >
                    {activeTab === "supply" ? t.dashboard.asset_table.supply_btn : t.dashboard.asset_table.borrow_btn}
                </Button>
            </motion.div>
        </motion.div>
    );
}

export function AssetTable({ mode }: { mode?: "supply" | "borrow" }) {
    const { t } = useLanguage();
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [modalType, setModalType] = useState<"supply" | "borrow" | "withdraw" | "flashloan" | null>(null);
    const [activeTab, setActiveTab] = useState<"supply" | "borrow">(mode || "supply");

    const openModal = (asset: any, type: "supply" | "borrow" | "withdraw" | "flashloan") => {
        setSelectedAsset(asset);
        setModalType(type);
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedAsset(null);
    };

    return (
        <>
            <Card className={glassCard}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">{t.dashboard.assets.title}</CardTitle>
                        {!mode && (
                            <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActiveTab("supply")}
                                    className={cn(
                                        "transition-all rounded-md px-4",
                                        activeTab === "supply"
                                            ? "bg-success-500/20 text-success-400 hover:bg-success-500/30"
                                            : "hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    {t.dashboard.sidebar.supply}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActiveTab("borrow")}
                                    className={cn(
                                        "transition-all rounded-md px-4",
                                        activeTab === "borrow"
                                            ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                                            : "hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    {t.dashboard.sidebar.borrow}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div>
                        {ASSET_CONFIGS.map((asset, index) => (
                            <AssetRow
                                key={asset.id}
                                asset={asset}
                                activeTab={activeTab}
                                openModal={openModal}
                                t={t}
                                index={index}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {selectedAsset && modalType === "supply" && (
                <SupplyModal
                    isOpen={true}
                    onClose={closeModal}
                    asset={selectedAsset}
                />
            )}

            {selectedAsset && modalType === "borrow" && (
                <BorrowModal
                    isOpen={true}
                    onClose={closeModal}
                    asset={selectedAsset}
                />
            )}

            {selectedAsset && modalType === "withdraw" && (
                <WithdrawModal
                    isOpen={true}
                    onClose={closeModal}
                    asset={selectedAsset}
                />
            )}

            {selectedAsset && modalType === "flashloan" && (
                <FlashloanModal
                    isOpen={true}
                    onClose={closeModal}
                    asset={selectedAsset}
                />
            )}
        </>
    );
}

