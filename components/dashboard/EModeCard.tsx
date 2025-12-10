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
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Efficiency Mode (E-Mode)</DialogTitle>
                                <DialogDescription>
                                    Maximize capital efficiency for correlated assets
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                {/* Info Alert */}
                                <Alert className="border-blue-500/30 bg-blue-950/20">
                                    <Info className="h-4 w-4 text-blue-400" />
                                    <AlertTitle className="text-blue-400">What is E-Mode?</AlertTitle>
                                    <AlertDescription className="text-sm">
                                        E-Mode allows higher LTV for correlated assets. Enable Stablecoins E-Mode to borrow
                                        up to 97% against USDC, EURC, and USYC collateral.
                                    </AlertDescription>
                                </Alert>

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
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
