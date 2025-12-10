"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Loader2, CheckCircle2, AlertTriangle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "@/lib/contracts";
import { useLanguage } from '@/lib/i18n';

interface FlashloanModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset: {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    };
}

export function FlashloanModal({ isOpen, onClose, asset }: FlashloanModalProps) {
    const { t } = useLanguage();
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState("");
    const [receiverAddress, setReceiverAddress] = useState("");
    const [step, setStep] = useState<"input" | "confirming" | "success">("input");

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isConfirmed && hash) {
            setStep("success");
        }
    }, [isConfirmed, hash]);

    useEffect(() => {
        if (isPending) {
            setStep("confirming");
        }
    }, [isPending]);

    const handleFlashloan = () => {
        if (!amount || !receiverAddress) return;

        const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 10 ** asset.decimals));

        writeContract({
            address: LENDING_POOL_ADDRESS,
            abi: LENDING_POOL_ABI,
            functionName: 'flashLoan' as any, // Type assertion for new function
            args: [
                receiverAddress as `0x${string}`,
                asset.address,
                amountBigInt,
                "0x" as `0x${string}` // empty params
            ] as any, // Type assertion for args
        });
    };

    const handleClose = () => {
        setAmount("");
        setReceiverAddress("");
        setStep("input");
        onClose();
    };

    const premium = amount ? (parseFloat(amount) * 0.0009).toFixed(6) : "0.00";
    const totalRepayment = amount ? (parseFloat(amount) * 1.0009).toFixed(6) : "0.00";

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Flashloan: ${asset.symbol}`}>
            <AnimatePresence mode="wait">
                {step === "input" && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount</label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="text-3xl font-bold h-16 pr-20"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    {asset.symbol}
                                </div>
                            </div>
                        </div>

                        {/* Receiver Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Receiver Contract Address</label>
                            <Input
                                type="text"
                                placeholder="0x..."
                                value={receiverAddress}
                                onChange={(e) => setReceiverAddress(e.target.value)}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Contract must implement IFlashLoanReceiver interface
                            </p>
                        </div>

                        {/* Fee Info */}
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Flash Loan Amount</span>
                                <span className="font-medium">{amount || "0.00"} {asset.symbol}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Premium (0.09%)</span>
                                <span className="font-medium text-orange-500">{premium} {asset.symbol}</span>
                            </div>
                            <div className="h-px bg-border my-2" />
                            <div className="flex justify-between text-sm font-bold">
                                <span>Total Repayment</span>
                                <span>{totalRepayment} {asset.symbol}</span>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-yellow-500">
                                <p className="font-semibold">Advanced Feature</p>
                                <p className="text-xs mt-1 text-yellow-500/80">
                                    Flash loans must be repaid in the same transaction. Ensure your receiver contract
                                    implements the required interface and has sufficient funds to repay.
                                </p>
                            </div>
                        </div>

                        {/* Execute Button */}
                        <Button
                            onClick={handleFlashloan}
                            disabled={!amount || !receiverAddress || !isConnected}
                            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            <Zap className="mr-2 h-5 w-5" />
                            Execute Flash Loan
                        </Button>
                    </motion.div>
                )}

                {step === "confirming" && (
                    <motion.div
                        key="confirming"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="py-12 text-center space-y-4"
                    >
                        <div className="flex justify-center">
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                {isPending ? "Waiting for confirmation..." : "Confirming transaction..."}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                {isPending ? "Please confirm in your wallet" : "Transaction is being processed"}
                            </p>
                        </div>
                    </motion.div>
                )}

                {step === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="py-12 text-center space-y-6"
                    >
                        <div className="flex justify-center">
                            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-green-500" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Flash Loan Executed!</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Your flash loan of {amount} {asset.symbol} was successful
                            </p>
                        </div>
                        <Button onClick={handleClose} className="w-full">
                            Close
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
}
