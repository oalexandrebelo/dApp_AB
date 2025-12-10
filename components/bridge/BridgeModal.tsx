"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, AlertTriangle, ArrowRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useWalletClient } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI, USDC_ADDRESS } from "@/lib/contracts";
import { initBridgeKit, SUPPORTED_CHAINS, calculateBridgeFee, getEstimatedBridgeTime, FEE_RECIPIENT_ADDRESS } from "@/lib/bridgeKit";
import { useLanguage } from '@/lib/i18n';
import { parseUnits } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

interface BridgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    autoSupply?: boolean; // Se true, faz auto-supply após bridge
}

export function BridgeModal({ isOpen, onClose, autoSupply = true }: BridgeModalProps) {
    const { t } = useLanguage();
    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();

    const [fromChain, setFromChain] = useState("ethereum");
    const [toChain, setToChain] = useState("arc");
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"input" | "bridging" | "supplying" | "success">("input");
    const [bridgeHash, setBridgeHash] = useState<string>("");
    const [error, setError] = useState<string>("");

    // Auto-supply hooks
    const { data: supplyHash, writeContract: supply, isPending: isSupplyPending } = useWriteContract();
    const { isLoading: isSupplyConfirming, isSuccess: isSupplySuccess } = useWaitForTransactionReceipt({
        hash: supplyHash,
    });

    const fee = amount ? calculateBridgeFee(amount) : "0.00";
    const estimatedTime = getEstimatedBridgeTime(fromChain, toChain);
    const netAmount = amount ? (parseFloat(amount) - parseFloat(fee)).toFixed(6) : "0.00";

    const handleBridge = async () => {
        if (!amount || !walletClient) return;

        try {
            setError("");
            setStep("bridging");

            const kit = initBridgeKit(walletClient);

            const result = await kit.bridge({
                from: {
                    adapter: walletClient,
                    chain: fromChain,
                },
                to: {
                    adapter: walletClient,
                    chain: toChain,
                },
                amount: amount,
                fee: {
                    amount: fee,
                    recipient: FEE_RECIPIENT_ADDRESS,
                }
            });

            setBridgeHash(result.transactionHash);

            // Aguardar conclusão do bridge
            await result.wait();

            // Se auto-supply está ativado e destino é Arc, fazer supply
            if (autoSupply && toChain === "arc") {
                setStep("supplying");
                await handleAutoSupply();
            } else {
                setStep("success");
            }

        } catch (err: any) {
            console.error('Bridge error:', err);
            setError(err.message || "Bridge failed");
            setStep("input");
        }
    };

    const handleAutoSupply = async () => {
        try {
            const amountBigInt = parseUnits(netAmount, 6); // USDC has 6 decimals

            supply({
                address: LENDING_POOL_ADDRESS,
                abi: LENDING_POOL_ABI,
                functionName: 'supply',
                args: [
                    USDC_ADDRESS,
                    amountBigInt,
                    address!,
                    0 // referralCode
                ],
            });
        } catch (err: any) {
            console.error('Auto-supply error:', err);
            setError(err.message || "Auto-supply failed");
        }
    };

    useEffect(() => {
        if (isSupplySuccess && step === "supplying") {
            setStep("success");
        }
    }, [isSupplySuccess, step]);

    const handleClose = () => {
        setAmount("");
        setStep("input");
        setError("");
        setBridgeHash("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Cross-Chain Bridge">
            <AnimatePresence mode="wait">
                {step === "input" && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* From Chain */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">From Chain</label>
                            <Select value={fromChain} onValueChange={setFromChain}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUPPORTED_CHAINS.filter(c => c.id !== toChain).map(chain => (
                                        <SelectItem key={chain.id} value={chain.id}>
                                            {chain.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount (USDC)</label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="text-3xl font-bold h-16 pr-20"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    USDC
                                </div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center">
                            <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </div>

                        {/* To Chain */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">To Chain</label>
                            <Select value={toChain} onValueChange={setToChain}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUPPORTED_CHAINS.filter(c => c.id !== fromChain).map(chain => (
                                        <SelectItem key={chain.id} value={chain.id}>
                                            {chain.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Fee Info */}
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Bridge Amount</span>
                                <span className="font-medium">{amount || "0.00"} USDC</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Bridge Fee (0.1%)</span>
                                <span className="font-medium text-orange-500">{fee} USDC</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Estimated Time</span>
                                <span className="font-medium">{estimatedTime}</span>
                            </div>
                            <div className="h-px bg-border my-2" />
                            <div className="flex justify-between text-sm font-bold">
                                <span>You Will Receive</span>
                                <span>{netAmount} USDC</span>
                            </div>
                            {autoSupply && toChain === "arc" && (
                                <div className="text-xs text-green-500 mt-2">
                                    ✓ Will auto-supply to lending pool
                                </div>
                            )}
                        </div>

                        {/* Warning */}
                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-red-500">{error}</div>
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <Zap className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-500">
                                <p className="font-semibold">Powered by Circle CCTP</p>
                                <p className="text-xs mt-1 text-blue-500/80">
                                    Secure, fast cross-chain transfers using Circle's Cross-Chain Transfer Protocol
                                </p>
                            </div>
                        </div>

                        {/* Bridge Button */}
                        <Button
                            onClick={handleBridge}
                            disabled={!amount || !isConnected}
                            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <Zap className="mr-2 h-5 w-5" />
                            Bridge {autoSupply && toChain === "arc" ? "& Supply" : "USDC"}
                        </Button>
                    </motion.div>
                )}

                {(step === "bridging" || step === "supplying") && (
                    <motion.div
                        key="processing"
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
                                {step === "bridging" ? "Bridging USDC..." : "Supplying to Pool..."}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                {step === "bridging"
                                    ? `Transferring ${amount} USDC from ${fromChain} to ${toChain}`
                                    : "Auto-supplying to lending pool"
                                }
                            </p>
                            {bridgeHash && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    TX: {bridgeHash.slice(0, 10)}...{bridgeHash.slice(-8)}
                                </p>
                            )}
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
                            <h3 className="text-xl font-bold">Bridge Successful!</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                {autoSupply && toChain === "arc"
                                    ? `Bridged and supplied ${netAmount} USDC to lending pool`
                                    : `Bridged ${netAmount} USDC to ${toChain}`
                                }
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
