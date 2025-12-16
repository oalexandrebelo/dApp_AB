"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, AlertCircle } from "lucide-react";
import { useAccount, useWalletClient, useReadContract, usePublicClient } from "wagmi";
import { ERC20_ABI, USDC_ADDRESS } from "@/lib/contracts";
import { formatUnits } from "viem";
import { NetworkIcon } from "@/components/ui/network-icon";
import ChainLogos from "@/components/ui/ChainLogos";
import { useToast } from "@/hooks/use-toast";
import {
    getCCTPChains,
    getChainMetadata,
    executeCCTPBridge,
    estimateBridgeFees,
    validateBridgeInputs,
    getAllWarnings,
    addToHistory,
    getWarningSeverityColor,
    getWarningSeverityIcon,
    type BridgeWarning,
} from "@/lib/bridge";

export function CrossChainBridgeWidget() {
    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const { toast } = useToast();

    // Get CCTP chains
    const cctpChains = getCCTPChains();

    const [fromChainId, setFromChainId] = useState(cctpChains[0]?.chainId || 11155111);
    const [toChainId, setToChainId] = useState(cctpChains[1]?.chainId || 43113);
    const [amount, setAmount] = useState("");
    const [isBridging, setIsBridging] = useState(false);
    const [bridgeStep, setBridgeStep] = useState<string>("");
    const [warnings, setWarnings] = useState<BridgeWarning[]>([]);

    // Balance Fetching
    const { data: balanceData } = useReadContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address!],
        query: {
            enabled: !!address,
            refetchInterval: 5000
        }
    });

    const formattedBalance = balanceData
        ? formatUnits(balanceData as bigint, 6)
        : "0.00";

    // Get chain metadata
    const fromChainConfig = getChainMetadata(fromChainId);
    const toChainConfig = getChainMetadata(toChainId);

    // Calculate fees
    const fees = amount && fromChainConfig && toChainConfig
        ? estimateBridgeFees(amount, fromChainId, toChainId)
        : { cctpFee: "0.00", gasFee: "0.00", totalFee: "0.00", feePercentage: 0.1 };

    const netAmount = amount ? (parseFloat(amount) - parseFloat(fees.cctpFee)).toFixed(6) : "0.00";

    // Update warnings when inputs change
    useEffect(() => {
        if (amount && fromChainId && toChainId) {
            const newWarnings = getAllWarnings({
                fromChainId,
                toChainId,
                amount,
                feePercentage: fees.feePercentage,
            });
            setWarnings(newWarnings);
        } else {
            setWarnings([]);
        }
    }, [amount, fromChainId, toChainId, fees.feePercentage]);

    const handleBridge = async () => {
        if (!amount || !walletClient || !isConnected || !address || !publicClient) {
            toast({
                title: "Connection Required",
                description: "Please connect your wallet to bridge tokens.",
                variant: "destructive",
            });
            return;
        }

        // Validate inputs
        const validation = validateBridgeInputs({
            fromChainId,
            toChainId,
            amount,
            recipientAddress: address,
        });

        if (!validation.valid) {
            toast({
                title: "Validation Error",
                description: validation.errors[0] || "Invalid bridge parameters",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsBridging(true);
            setBridgeStep("Starting bridge...");

            const result = await executeCCTPBridge({
                walletClient,
                publicClient,
                fromChainId,
                toChainId,
                amount,
                recipientAddress: address,
                onProgress: (progress) => {
                    setBridgeStep(progress.message);
                    toast({
                        title: "Bridge Progress",
                        description: progress.message,
                    });
                },
            });

            // Add to history
            addToHistory({
                fromChainId,
                toChainId,
                amount,
                burnTxHash: result.burnTxHash,
                messageHash: result.messageHash,
                status: result.status === 'ready_to_mint' ? 'ready_to_mint' : 'pending',
                recipientAddress: address,
            });

            toast({
                title: "Bridge Initiated! 🎉",
                description: `Burn tx: ${result.burnTxHash.slice(0, 10)}... Switch to ${toChainConfig?.name} to complete minting.`,
            });

            setAmount("");
            setBridgeStep("");

        } catch (error: any) {
            console.error("Bridge error:", error);
            toast({
                title: "Bridge Failed",
                description: error.message || "Failed to bridge tokens. Please try again.",
                variant: "destructive",
            });
            setBridgeStep("");
        } finally {
            setIsBridging(false);
        }
    };

    return (
        <Card className="w-full max-w-[480px]">
            <CardContent className="p-6 space-y-5">
                {/* From Chain */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">From Chain</label>
                    <Select value={fromChainId.toString()} onValueChange={(val) => setFromChainId(parseInt(val))}>
                        <SelectTrigger className="h-14 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {cctpChains.map((chain) => {
                                const chainKey = chain.shortName.toLowerCase();
                                const LogoComponent = ChainLogos[chainKey] || (() => <NetworkIcon network={chainKey} className="w-6 h-6" />);
                                return (
                                    <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
                                        <div className="flex items-center gap-3">
                                            <LogoComponent className="w-6 h-6" />
                                            <span>{chain.name}</span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-foreground">Amount</label>
                        <span className="text-xs text-muted-foreground">
                            Balance: {parseFloat(formattedBalance).toFixed(2)} USDC
                        </span>
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="h-14 text-2xl font-bold border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 focus:border-blue-400 dark:focus:border-blue-600 pr-16"
                        />
                        <button
                            onClick={() => setAmount(formattedBalance)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                            MAX
                        </button>
                    </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-3 relative z-10">
                    <button
                        onClick={() => {
                            const temp = fromChainId;
                            setFromChainId(toChainId);
                            setToChainId(temp);
                        }}
                        className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-white dark:border-gray-900"
                        aria-label="Swap chains"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M17 14L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* To Chain */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">To Chain</label>
                    <Select value={toChainId.toString()} onValueChange={(val) => setToChainId(parseInt(val))}>
                        <SelectTrigger className="h-14 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {cctpChains.map((chain) => {
                                const chainKey = chain.shortName.toLowerCase();
                                const LogoComponent = ChainLogos[chainKey] || (() => <NetworkIcon network={chainKey} className="w-6 h-6" />);
                                return (
                                    <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
                                        <div className="flex items-center gap-3">
                                            <LogoComponent className="w-6 h-6" />
                                            <span>{chain.name}</span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Warnings */}
                {warnings.length > 0 && (
                    <div className="space-y-2">
                        {warnings.map((warning, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${warning.severity === 'high'
                                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                                    : warning.severity === 'medium'
                                        ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
                                        : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    <span className="text-lg">{getWarningSeverityIcon(warning.severity)}</span>
                                    <p className={`text-sm ${getWarningSeverityColor(warning.severity)}`}>
                                        {warning.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bridge Details */}
                {amount && parseFloat(amount) > 0 && (
                    <div className="space-y-2 p-4 bg-secondary/20 rounded-lg text-sm border border-border/50">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Bridge Fee ({fees.feePercentage}%)</span>
                            <span className="font-medium">{fees.cctpFee} USDC</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">You Will Receive</span>
                            <span className="font-bold text-green-400">{netAmount} USDC</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Estimated Time</span>
                            <span className="text-xs text-foreground">
                                {fromChainId === 11155111 || toChainId === 11155111 ? '~15-20 min' : '~5-10 min'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Bridge Button */}
                <Button
                    onClick={handleBridge}
                    disabled={!amount || isBridging || !isConnected || warnings.some(w => w.severity === 'high')}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    {isBridging ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>{bridgeStep || "Processing..."}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            <span>Bridge USDC</span>
                        </div>
                    )}
                </Button>

                {!isConnected && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                        Connect wallet to bridge assets
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
