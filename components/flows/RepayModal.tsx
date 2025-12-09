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
import { saveTransaction } from "@/lib/history";

interface RepayModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset: {
        symbol: string;
        borrowedBalance: string;
        variableApy: string;
        address: `0x${string}`;
        decimals: number;
    };
}

export function RepayModal({ isOpen, onClose, asset }: RepayModalProps) {
    const { t } = useLanguage();
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"input" | "approving" | "approved_waiting" | "repaying" | "success">("input");

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const handleApprove = () => {
        setStep("approving");
        writeContract({
            address: asset.address,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [LENDING_POOL_ADDRESS, BigInt(parseFloat(amount) * Math.pow(10, asset.decimals) || 0)],
        });
    };

    const handleRepay = () => {
        setStep("repaying");
        writeContract({
            address: LENDING_POOL_ADDRESS,
            abi: LENDING_POOL_ABI,
            functionName: 'repay',
            args: [
                asset.address,
                BigInt(parseFloat(amount) * Math.pow(10, asset.decimals) || 0),
                address! // Repay for user's address
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
                setStep("approved_waiting");
            } else if (step === "repaying" && hash && address) {
                setStep("success");
                saveTransaction({
                    hash: hash,
                    type: 'repay',
                    token: asset.symbol,
                    amount: amount,
                    status: 'success',
                    to: LENDING_POOL_ADDRESS,
                    user: address
                });
            }
        }
    }, [isConfirmed, step, hash, amount, asset.symbol, address]);

    const handleMax = () => {
        setAmount(asset.borrowedBalance);
    };

    return (
        <Modal isOpen={isOpen} onClose={reset} title={`Repay ${asset?.symbol}`}>
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
                                    <span>Amount to Repay</span>
                                    <button onClick={handleMax} className="text-indigo-400 hover:text-indigo-300 font-medium">
                                        MAX: {asset.borrowedBalance}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="text-2xl font-bold bg-transparent border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                                    />
                                    <span className="text-2xl font-bold text-muted-foreground">{asset.symbol}</span>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Borrowed Balance</span>
                                    <span className="font-medium text-orange-400">{asset.borrowedBalance} {asset.symbol}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Variable APY</span>
                                    <span className="font-medium text-orange-400">{asset.variableApy}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleApprove}
                                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(asset.borrowedBalance)}
                                className="w-full"
                            >
                                Approve & Repay
                            </Button>
                        </motion.div>
                    )}

                    {(step === "approving" || step === "approved_waiting") && (
                        <motion.div
                            key="approving"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8"
                        >
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-500" />
                            <h3 className="text-lg font-semibold mb-2">
                                {step === "approving" ? "Approving..." : "Approval Confirmed"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {step === "approving" ? "Confirm approval in your wallet" : "Waiting for next step..."}
                            </p>
                            {step === "approved_waiting" && (
                                <Button onClick={handleRepay} className="w-full">
                                    Continue to Repay
                                </Button>
                            )}
                        </motion.div>
                    )}

                    {step === "repaying" && (
                        <motion.div
                            key="repaying"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8"
                        >
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-500" />
                            <h3 className="text-lg font-semibold mb-2">Repaying...</h3>
                            <p className="text-sm text-muted-foreground">Confirm transaction in your wallet</p>
                        </motion.div>
                    )}

                    {step === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Repayment Successful!</h3>
                            <p className="text-muted-foreground mb-6">
                                {amount} {asset.symbol} repaid
                            </p>
                            <Button onClick={reset} className="w-full">
                                Close
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Modal>
    );
}
