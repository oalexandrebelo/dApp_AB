"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "@/lib/contracts";
import { useLanguage } from '@/lib/i18n';

interface BorrowModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset: {
        symbol: string;
        variableApy?: string;
        stableApy?: string;
        liquidity: string;
        address: `0x${string}`;
        decimals: number;
    };
}

export function BorrowModal({ isOpen, onClose, asset }: BorrowModalProps) {
    const { t } = useLanguage();
    const { isConnected } = useAccount();
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"input" | "confirming" | "success">("input");

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isConfirmed) {
            setStep("success");
        }
    }, [isConfirmed]);

    const handleBorrow = async () => {
        setStep("confirming");
        writeContract({
            address: LENDING_POOL_ADDRESS,
            abi: LENDING_POOL_ABI,
            functionName: 'borrow',
            args: [
                asset.address,
                BigInt(parseFloat(amount) * Math.pow(10, asset.decimals) || 0),
                BigInt(2), // Variable Interest
                0,
                "0x0000000000000000000000000000000000000000"
            ],
        });
    };

    const reset = () => {
        setStep("input");
        setAmount("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t.modals.borrow.title}: ${asset?.symbol}`}>
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
                            <div className="bg-secondary/30 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{t.modals.borrow.amount_label}</span>
                                    <span>Available: 1,500.00</span>
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
                                        onClick={() => setAmount("1500.00")}
                                        className="text-xs text-indigo-400 hover:text-indigo-300"
                                    >
                                        MAX
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center bg-card/50 p-3 rounded-lg border border-primary/10">
                                    <span className="text-sm">Variable APY</span>
                                    <span className="text-orange-400 font-bold">{asset.variableApy || "5.5%"}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded-lg">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>{t.dashboard.health_factor.liquidation_warning || "Borrowing increases liquidation risk"}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                variant="premium"
                                size="lg"
                                onClick={handleBorrow}
                                disabled={!amount || parseFloat(amount) <= 0}
                            >
                                {isPending ? <Loader2 className="animate-spin" /> : (t.modals.borrow.confirm_btn || "Confirm Borrow")}
                            </Button>
                        </motion.div>
                    )}

                    {step === "confirming" && (
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
                                <h3 className="font-bold text-lg">Funds Received!</h3>
                                <p className="text-sm text-muted-foreground">You have successfully borrowed {amount} {asset.symbol}</p>
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
