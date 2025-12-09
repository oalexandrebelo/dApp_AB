"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SupplyModal } from "@/components/flows/SupplyModal";
import { BorrowModal } from "@/components/flows/BorrowModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAccount, useReadContract } from "wagmi";
import { USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS, ERC20_ABI } from "@/lib/contracts";
import { formatUnits } from "viem";
import { useLanguage } from '@/lib/i18n';

const ASSET_CONFIGS = [
    { id: "usdc", symbol: "USDC", name: "USD Coin", address: USDC_ADDRESS, decimals: 6, apy: "4.5%", variableApy: "5.5%", liquidity: "5M" },
    { id: "eurc", symbol: "EURC", name: "Euro Coin", address: EURC_ADDRESS, decimals: 6, apy: "3.2%", variableApy: "4.2%", liquidity: "2M" },
    { id: "usyc", symbol: "USYC", name: "Yield Coin", address: USYC_ADDRESS, decimals: 6, apy: "5.1%", variableApy: "6.0%", liquidity: "1M" },
] as const;

function AssetRow({ asset, activeTab, openModal, t }: any) {
    const { address, isConnected } = useAccount();

    const { data: balanceData } = useReadContract({
        address: asset.address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address!],
        query: {
            enabled: !!address,
            // Refresh every 10s
            refetchInterval: 10000
        }
    });

    const walletBalance = isConnected && balanceData
        ? Number(formatUnits(balanceData as bigint, asset.decimals)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "0.00";

    return (
        <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 items-center p-4 hover:bg-white/5 transition border-t border-border/50 first:border-0">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                    {asset.symbol[0]}
                </div>
                <div>
                    <div className="font-bold">{asset.symbol}</div>
                    <div className="text-xs text-muted-foreground">{asset.name}</div>
                </div>
            </div>

            <div className="text-right">
                <div className={cn("font-bold", activeTab === "supply" ? "text-green-400" : "text-orange-400")}>
                    {activeTab === "supply" ? asset.apy : asset.variableApy}
                </div>
                <div className="text-xs text-muted-foreground">{activeTab === "supply" ? t.dashboard.asset_table.apy : "Variable APY"}</div>
            </div>

            <div className="text-right hidden md:block">
                <div className="font-bold">
                    {activeTab === "supply" ? walletBalance : asset.liquidity}
                </div>
                <div className="text-xs text-muted-foreground">
                    {activeTab === "supply" ? t.dashboard.assets.wallet_balance : "Liquidity"}
                </div>
            </div>

            <Button
                size="sm"
                className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white min-w-[100px] h-7 text-xs"
                onClick={() => openModal({ ...asset, balance: walletBalance }, activeTab)}
            >
                {activeTab === "supply" ? t.dashboard.asset_table.supply_btn : t.dashboard.asset_table.borrow_btn}
            </Button>
        </div>
    );
}

export function AssetTable({ mode }: { mode?: "supply" | "borrow" }) {
    const { t } = useLanguage();
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [modalType, setModalType] = useState<"supply" | "borrow" | null>(null);
    const [activeTab, setActiveTab] = useState<"supply" | "borrow">(mode || "supply");

    const openModal = (asset: any, type: "supply" | "borrow") => {
        setSelectedAsset(asset);
        setModalType(type);
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedAsset(null);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t.dashboard.assets.title}</CardTitle>
                    {!mode && (
                        <div className="flex bg-secondary/50 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab("supply")}
                                className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", activeTab === "supply" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                            >
                                {t.dashboard.sidebar.supply}
                            </button>
                            <button
                                onClick={() => setActiveTab("borrow")}
                                className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", activeTab === "borrow" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                            >
                                {t.dashboard.sidebar.borrow}
                            </button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {ASSET_CONFIGS.map((asset) => (
                            <AssetRow
                                key={asset.id}
                                asset={asset}
                                activeTab={activeTab}
                                openModal={openModal}
                                t={t}
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
        </>
    );
}
