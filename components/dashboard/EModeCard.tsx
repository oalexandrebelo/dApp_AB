import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingUp, Info, Zap, Settings2 } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "@/lib/contracts";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface EModeCardProps {
    currentCategory: number;
    onSuccess?: () => void;
}

const EMODE_CATEGORIES = [
    {
        id: 0,
        name: "Standard Mode",
        ltv: "75%",
        liqThreshold: "80%",
        description: "Default parameters",
    },
    {
        id: 1,
        name: "Stablecoins",
        ltv: "97%",
        liqThreshold: "98%",
        description: "Maximum capital efficiency",
    }
];

export function EModeCard({ currentCategory, onSuccess }: EModeCardProps) {
    const [open, setOpen] = useState(false);
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

    if (isSuccess && onSuccess) {
        onSuccess();
        setTimeout(() => setOpen(false), 1000);
    }

    const currentCategoryData = EMODE_CATEGORIES.find(cat => cat.id === currentCategory);
    const isEModeActive = currentCategory === 1;

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className={`h-4 w-4 ${isEModeActive ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className="text-sm font-medium">Efficiency Mode</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {currentCategoryData?.name} • {currentCategoryData?.ltv} LTV
                        </div>
                        {isEModeActive && (
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-950/30 border border-green-500/30">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-green-400 font-medium">Active</span>
                            </div>
                        )}
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Settings2 className="h-4 w-4 mr-2" />
                                Change
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] bg-card bg-gradient-to-b from-card to-card/95 backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Efficiency Mode (E-Mode)</DialogTitle>
                                <DialogDescription className="text-base">
                                    Maximize capital efficiency for correlated assets
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {/* Info Alert */}
                                <Alert className="border-blue-500/50 bg-blue-500/10">
                                    <Info className="h-4 w-4 text-blue-400" />
                                    <AlertTitle className="text-blue-300 font-semibold">What is E-Mode?</AlertTitle>
                                    <AlertDescription className="text-sm text-foreground/90 leading-relaxed">
                                        E-Mode allows higher LTV for correlated assets. Enable Stablecoins E-Mode to borrow
                                        up to 97% against USDC, EURC, and USYC collateral.
                                    </AlertDescription>
                                </Alert>

                                {/* Category Selector - Radio Buttons */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-foreground">Select Mode</label>
                                    <div className="space-y-3">
                                        {EMODE_CATEGORIES.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleCategoryChange(cat.id.toString())}
                                                disabled={isPending || isConfirming}
                                                className={cn(
                                                    "w-full p-4 rounded-lg border-2 transition-all text-left",
                                                    selectedCategory === cat.id.toString()
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border hover:border-primary/50 hover:bg-muted/50",
                                                    (isPending || isConfirming) && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5",
                                                        selectedCategory === cat.id.toString()
                                                            ? "border-primary bg-primary"
                                                            : "border-muted-foreground"
                                                    )}>
                                                        {selectedCategory === cat.id.toString() && (
                                                            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-foreground text-base">{cat.name}</div>
                                                        <div className="text-sm text-muted-foreground mt-1">
                                                            {cat.ltv} LTV • {cat.liqThreshold} Liquidation Threshold
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {cat.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Transaction Status */}
                                {isPending && (
                                    <div className="text-sm text-yellow-500 flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                                        Waiting for wallet approval...
                                    </div>
                                )}
                                {isConfirming && (
                                    <div className="text-sm text-blue-500 flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        Confirming transaction...
                                    </div>
                                )}
                                {isSuccess && (
                                    <div className="text-sm text-green-500 font-medium">
                                        ✅ E-Mode updated successfully!
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
