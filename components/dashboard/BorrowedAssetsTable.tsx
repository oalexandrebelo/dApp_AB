"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RepayModal } from "@/components/flows/RepayModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/lib/i18n';

interface BorrowedAssetsTableProps {
    borrowedUSDC: number;
    borrowedEURC: number;
    borrowedUSYC: number;
}

const ASSET_CONFIGS = [
    { id: "usdc", symbol: "USDC", name: "USD Coin", address: "0x3600000000000000000000000000000000000000" as `0x${string}`, decimals: 6, variableApy: "5.5%" },
    { id: "eurc", symbol: "EURC", name: "Euro Coin", address: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a" as `0x${string}`, decimals: 6, variableApy: "4.2%" },
    { id: "usyc", symbol: "USYC", name: "Yield Coin", address: "0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C" as `0x${string}`, decimals: 6, variableApy: "6.0%" },
];

export function BorrowedAssetsTable({ borrowedUSDC, borrowedEURC, borrowedUSYC }: BorrowedAssetsTableProps) {
    const { t } = useLanguage();
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);

    const borrowedAmounts = {
        usdc: borrowedUSDC,
        eurc: borrowedEURC,
        usyc: borrowedUSYC,
    };

    const borrowedAssets = ASSET_CONFIGS.filter(asset => borrowedAmounts[asset.id as keyof typeof borrowedAmounts] > 0);

    const openRepayModal = (asset: any, borrowedBalance: number) => {
        setSelectedAsset({
            ...asset,
            borrowedBalance: borrowedBalance.toFixed(2),
        });
        setIsRepayModalOpen(true);
    };

    const closeRepayModal = () => {
        setIsRepayModalOpen(false);
        setSelectedAsset(null);
    };

    if (borrowedAssets.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t.dashboard.assets.borrowed_title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                        {t.dashboard.assets.no_assets_borrowed}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{t.dashboard.assets.borrowed_title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {borrowedAssets.map((asset) => {
                            const borrowedBalance = borrowedAmounts[asset.id as keyof typeof borrowedAmounts];
                            return (
                                <div key={asset.id} className="grid grid-cols-[1.5fr_1fr_auto] gap-4 items-center p-4 hover:bg-white/5 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400">
                                            {asset.symbol[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold">{asset.symbol}</div>
                                            <div className="text-xs text-muted-foreground">{asset.name}</div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-bold text-orange-400">{borrowedBalance.toFixed(2)}</div>
                                        <div className="text-xs text-muted-foreground">{asset.variableApy} APY</div>
                                    </div>

                                    <Button
                                        size="sm"
                                        className="rounded-full bg-green-500 hover:bg-green-600 text-white min-w-[100px] h-7 text-xs"
                                        onClick={() => openRepayModal(asset, borrowedBalance)}
                                    >
                                        Repay
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {selectedAsset && (
                <RepayModal
                    isOpen={isRepayModalOpen}
                    onClose={closeRepayModal}
                    asset={selectedAsset}
                />
            )}
        </>
    );
}
