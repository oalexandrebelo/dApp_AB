import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingUp, Info, Zap } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "@/lib/contracts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EModeSelectorProps {
    currentCategory: number;
    onSuccess?: () => void;
}

const EMODE_CATEGORIES = [
    {
        id: 0,
        name: "Standard Mode",
        ltv: "75%",
        liqThreshold: "80%",
        description: "Default parameters for all assets",
        color: "blue"
    },
    {
        id: 1,
        name: "Stablecoins E-Mode",
        ltv: "97%",
        liqThreshold: "98%",
        description: "USDC, EURC, USYC - Maximum capital efficiency",
        color: "green"
    }
];

export function EModeSelector({ currentCategory, onSuccess }: EModeSelectorProps) {
    const [selectedCategory, setSelectedCategory] = useState(currentCategory.toString());

    const { data: hash, writeContract, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);

        writeContract({
            address: LENDING_POOL_ADDRESS,
            abi: LENDING_POOL_ABI,
            functionName: 'setUserEMode',
            args: [Number(categoryId)],
        });
    };

    // Call onSuccess when transaction confirms
    if (isSuccess && onSuccess) {
        onSuccess();
    }

    const currentCategoryData = EMODE_CATEGORIES.find(cat => cat.id === Number(selectedCategory));
    const isEModeActive = Number(selectedCategory) === 1;

    return (
        <Card className="border-2 border-primary/20">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle>Efficiency Mode (E-Mode)</CardTitle>
                </div>
                <CardDescription>
                    Maximize capital efficiency for correlated assets
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Category Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select Mode</label>
                    <Select
                        value={selectedCategory}
                        onValueChange={handleCategoryChange}
                        disabled={isPending || isConfirming}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select E-Mode category" />
                        </SelectTrigger>
                        <SelectContent>
                            {EMODE_CATEGORIES.map(cat => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    <div className="flex flex-col">
                                        <div className="font-bold">{cat.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {cat.ltv} LTV • {cat.description}
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Current Category Info */}
                {currentCategoryData && (
                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Max LTV:</span>
                            <span className="font-bold">{currentCategoryData.ltv}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Liquidation Threshold:</span>
                            <span className="font-bold">{currentCategoryData.liqThreshold}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Assets:</span>
                            <span className="font-medium text-xs">
                                {isEModeActive ? "USDC, EURC, USYC" : "All"}
                            </span>
                        </div>
                    </div>
                )}

                {/* E-Mode Active Alert */}
                {isEModeActive && (
                    <Alert className="border-green-500 bg-green-950/20">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <AlertTitle className="text-green-400">E-Mode Active! 🚀</AlertTitle>
                        <AlertDescription className="text-sm">
                            You can now borrow up to <span className="font-bold text-green-400">97% LTV</span> with stablecoins.
                            That's <span className="font-bold">30% more capital efficient</span> than standard mode!
                        </AlertDescription>
                    </Alert>
                )}

                {/* Info Alert */}
                {!isEModeActive && (
                    <Alert className="border-blue-500/30 bg-blue-950/20">
                        <Info className="h-4 w-4 text-blue-400" />
                        <AlertTitle className="text-blue-400">What is E-Mode?</AlertTitle>
                        <AlertDescription className="text-sm">
                            E-Mode allows higher LTV for correlated assets. Enable Stablecoins E-Mode to borrow
                            up to 97% against USDC, EURC, and USYC collateral.
                        </AlertDescription>
                    </Alert>
                )}

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
                        ✅ E-Mode updated successfully!
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
