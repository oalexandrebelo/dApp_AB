"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI, ERC20_ABI } from "@/lib/contracts";
import { useLanguage } from '@/lib/i18n';

interface SupplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset: {
        symbol: string;
        balance: string;
        apy: string;
        address: `0x${string}`;
        decimals: number;
    };
}

export function SupplyModal({ isOpen, onClose, asset }: SupplyModalProps) {
    const { t } = useLanguage();
    const { isConnected } = useAccount();
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"input" | "review" | "approving" | "supplying" | "success">("input");
    const [slippage, setSlippage] = useState("0.5");

    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const handleReview = () => {
        setStep("review");
    };

    const handleApprove = () => {
        setStep("approving");
        writeContract({
            address: asset.address,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [LENDING_POOL_ADDRESS, BigInt(parseFloat(amount) * Math.pow(10, asset.decimals) || 0)],
        });
    };

    const handleSupply = () => {
        setStep("supplying");
        writeContract({
            address: LENDING_POOL_ADDRESS,
            abi: LENDING_POOL_ABI,
            functionName: 'supply',
            args: [
                asset.address,
                BigInt(parseFloat(amount) * Math.pow(10, asset.decimals) || 0),
                "0x0000000000000000000000000000000000000000",
                0
            ],
        });
    };

    const reset = () => {
        setStep("input");
        setAmount("");
        onClose();
    };

    useEffect(() => {
        if (isConfirmed) {
            if (step === "approving") {
                setStep("supplying");
            } else if (step === "supplying") {
                setStep("success");
            }
        }
    }, [isConfirmed, step]);

    return (
        <Modal isOpen={isOpen} onClose={reset} title={`${t.modals.supply.title}: ${asset?.symbol}`}>
            <div className="space-y-6 py-4">
                <AnimatePresence mode="wait">
                    {step === "input" && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            {/* ... Existing Input UI ... */}
                            <div className="bg-secondary/30 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{t.modals.supply.amount_label}</span>
                                    <span>Balance: {asset.balance}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="text-2xl font-bold bg-transparent border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setAmount(asset.balance.replace(/,/g, ''))}
                                        className="text-xs text-indigo-400 hover:text-indigo-300"
                                    >
                                        MAX
                                    </Button>
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                variant="premium"
                                size="lg"
                                onClick={handleReview}
                                disabled={!amount || parseFloat(amount) <= 0}
                            >
                                Review Supply
                            </Button>
                        </motion.div>
                    )}

                    {step === "review" && (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="bg-secondary/20 p-4 rounded-lg space-y-3 border border-indigo-500/20">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Transaction Review</h3>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Action</span>
                                    <span className="font-bold text-indigo-400">Supply {asset.symbol}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-bold text-xl">{amount} {asset.symbol}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Contract</span>
                                    <div className="flex items-center gap-1 text-xs bg-black/20 px-2 py-1 rounded font-mono text-green-400">
                                        <CheckCircle2 className="h-3 w-3" />
                                        {LENDING_POOL_ADDRESS.slice(0, 6)}...{LENDING_POOL_ADDRESS.slice(-4)} (Verified)
                                    </div>
                                </div>
                                <div className="h-px bg-white/5 my-2" />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Max Slippage</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Tolerance:</span>
                                        <Input
                                            value={slippage}
                                            onChange={(e) => setSlippage(e.target.value)}
                                            className="w-16 h-6 text-right text-xs bg-black/20 border-none"
                                        />
                                        <span className="text-xs">%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" onClick={() => setStep("input")}>
                                    Back
                                </Button>
                                <Button className="w-full" variant="premium" onClick={handleApprove}>
                                    Confirm & Verify
                                </Button>
                            </div>

                            <p className="text-[10px] text-center text-muted-foreground">
                                By signing, you confirm that you are interacting with the official ArcLend Protocol.
                            </p>
                        </motion.div>
                    )}

                    {(step === "approving" || step === "supplying") && (
                        // ... (Existing Loading UI)
                        <motion.div
                            key="confirming"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center py-8 space-y-4"
                        >
                            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
                            <div className="text-center">
                                <h3 className="font-bold text-lg">Confirming Transaction</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isConfirming ? "Waiting for confirmation..." : "Please sign the request in your wallet..."}
                                </p>
                                {hash && <p className="text-xs text-muted-foreground truncate w-64 mx-auto mt-2">Tx: {hash}</p>}
                            </div>
                        </motion.div>
                    )}

                    {step === "success" && (
                        // ... (Existing Success UI)
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-8 space-y-4"
                        >
                            <div className="h-12 w-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg">Unstoppable!</h3>
                                <p className="text-sm text-muted-foreground">You have successfully supplied {amount} {asset.symbol}</p>
                            </div>
                            <Button onClick={reset} className="w-full" variant="outline">
                                Close
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Modal>
    );
}
