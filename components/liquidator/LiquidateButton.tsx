import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI, USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS } from "@/lib/contracts";
import { parseUnits } from "viem";
import { AlertTriangle } from "lucide-react";

interface Position {
    user: string;
    healthFactor: number;
    collateralUSD: number;
    debtUSD: number;
    maxLiquidatable: number;
    profit: number;
    isEmergency: boolean;
}

interface LiquidateButtonProps {
    position: Position;
}

export function LiquidateButton({ position }: LiquidateButtonProps) {
    const [open, setOpen] = useState(false);
    const [debtAmount, setDebtAmount] = useState(position.maxLiquidatable.toString());
    const [selectedDebtAsset, setSelectedDebtAsset] = useState<`0x${string}`>(USDC_ADDRESS);
    const [selectedCollateralAsset, setSelectedCollateralAsset] = useState<`0x${string}`>(USDC_ADDRESS);

    const { data: hash, writeContract, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const handleLiquidate = () => {
        const amount = parseUnits(debtAmount, 6); // USDC/EURC/USYC all have 6 decimals

        writeContract({
            address: LENDING_POOL_ADDRESS,
            abi: LENDING_POOL_ABI,
            functionName: 'liquidate',
            args: [
                selectedCollateralAsset,
                selectedDebtAsset,
                position.user as `0x${string}`,
                amount,
                false // receiveAToken
            ],
        });
    };

    if (isSuccess) {
        setTimeout(() => {
            setOpen(false);
            window.location.reload(); // Refresh to update positions
        }, 2000);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={position.isEmergency ? "destructive" : "default"}
                    size="sm"
                >
                    {position.isEmergency && <AlertTriangle className="h-4 w-4 mr-1" />}
                    Liquidate
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Liquidate Position</DialogTitle>
                    <DialogDescription>
                        Liquidate unhealthy position and earn {position.profit.toFixed(2)} USDC profit
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Position Info */}
                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">User:</span>
                            <span className="font-mono">{position.user.slice(0, 10)}...{position.user.slice(-8)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Health Factor:</span>
                            <span className="font-bold text-red-400">{position.healthFactor.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Debt:</span>
                            <span className="font-bold">${position.debtUSD.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Max Liquidatable:</span>
                            <span className="font-bold text-green-400">${position.maxLiquidatable.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Debt Amount Input */}
                    <div className="space-y-2">
                        <Label htmlFor="debtAmount">Debt to Repay (USDC)</Label>
                        <Input
                            id="debtAmount"
                            type="number"
                            value={debtAmount}
                            onChange={(e) => setDebtAmount(e.target.value)}
                            max={position.maxLiquidatable}
                            step="0.01"
                        />
                        <p className="text-xs text-muted-foreground">
                            Max: ${position.maxLiquidatable.toFixed(2)} ({position.isEmergency ? "100%" : "50%"} of debt)
                        </p>
                    </div>

                    {/* Profit Calculation */}
                    <div className="p-3 rounded-lg bg-green-950/20 border border-green-500/30">
                        <div className="text-sm text-green-400">
                            <div className="font-bold mb-1">Your Profit:</div>
                            <div className="text-lg">${(Number(debtAmount) * 0.05).toFixed(2)} USDC</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                5% liquidation bonus
                            </div>
                        </div>
                    </div>

                    {/* Transaction Status */}
                    {isPending && (
                        <div className="text-sm text-muted-foreground">
                            Waiting for wallet approval...
                        </div>
                    )}
                    {isConfirming && (
                        <div className="text-sm text-muted-foreground">
                            Confirming transaction...
                        </div>
                    )}
                    {isSuccess && (
                        <div className="text-sm text-green-500">
                            ✅ Liquidation successful! Refreshing...
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleLiquidate}
                        disabled={isPending || isConfirming || isSuccess}
                        className="w-full"
                    >
                        {isPending || isConfirming ? "Processing..." : "Confirm Liquidation"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
