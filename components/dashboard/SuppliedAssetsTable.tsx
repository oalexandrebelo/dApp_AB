"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WithdrawModal } from "@/components/flows/WithdrawModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/lib/i18n';
import { useAssetAPY, useActualBalance, calculateInterestEarned } from '@/lib/useAPY';

interface SuppliedAssetsTableProps {
    suppliedUSDC: number;
    suppliedEURC: number;
    suppliedUSYC: number;
}

const ASSET_CONFIGS = [
    { id: "usdc", symbol: "USDC", name: "USD Coin", address: "0x3600000000000000000000000000000000000000" as `0x${string}`, decimals: 6, apy: "4.5%" },
    { id: "eurc", symbol: "EURC", name: "Euro Coin", address: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a" as `0x${string}`, decimals: 6, apy: "3.2%" },
    { id: "usyc", symbol: "USYC", name: "Yield Coin", address: "0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C" as `0x${string}`, decimals: 6, apy: "5.1%" },
];

export function SuppliedAssetsTable({ suppliedUSDC, suppliedEURC, suppliedUSYC }: SuppliedAssetsTableProps) {
    const { t } = useLanguage();
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const suppliedAmounts = {
        usdc: suppliedUSDC,
        eurc: suppliedEURC,
        usyc: suppliedUSYC,
    };

    const suppliedAssets = ASSET_CONFIGS.filter(asset => suppliedAmounts[asset.id as keyof typeof suppliedAmounts] > 0);

    const openWithdrawModal = (asset: any, suppliedBalance: number) => {
        setSelectedAsset({
            ...asset,
            suppliedBalance: suppliedBalance.toFixed(2),
        });
        setIsWithdrawModalOpen(true);
    };

    const closeWithdrawModal = () => {
        setIsWithdrawModalOpen(false);
        setSelectedAsset(null);
    };

    if (suppliedAssets.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Supplied Assets</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                        No assets supplied
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Supplied Assets</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                        {suppliedAssets.map((asset) => {
                            const suppliedBalance = suppliedAmounts[asset.id as keyof typeof suppliedAmounts];
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const supplyAPY = useAssetAPY(asset.address, 'supply');

                            return (
                                <div key={asset.id} className="grid grid-cols-[1.5fr_1fr_auto] gap-4 items-center p-4 hover:bg-white/5 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400">
                                            {asset.symbol[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold">{asset.symbol}</div>
                                            <div className="text-xs text-muted-foreground">{asset.name}</div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-bold text-green-400">{suppliedBalance.toFixed(2)}</div>
                                        <div className="text-xs text-muted-foreground">{supplyAPY} APY</div>
                                    </div>

                                    <Button
                                        size="sm"
                                        className="rounded-full bg-orange-500 hover:bg-orange-600 text-white min-w-[100px] h-7 text-xs"
                                        onClick={() => openWithdrawModal(asset, suppliedBalance)}
                                    >
                                        Withdraw
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {selectedAsset && (
                <WithdrawModal
                    isOpen={isWithdrawModalOpen}
                    onClose={closeWithdrawModal}
                    asset={selectedAsset}
                />
            )}
        </>
    );
}
