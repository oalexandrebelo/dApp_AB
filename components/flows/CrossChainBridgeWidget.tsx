"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Zap } from "lucide-react";
import { useAccount, useWalletClient, useReadContract } from "wagmi";
import { initBridgeKit, SUPPORTED_CHAINS, calculateBridgeFee, getEstimatedBridgeTime } from "@/lib/bridgeKit";
import { ERC20_ABI, USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS } from "@/lib/contracts";
import { formatUnits } from "viem";
import { NetworkIcon } from "@/components/ui/network-icon";

const TOKENS = [
    { symbol: "USDC", address: USDC_ADDRESS, decimals: 6 },
    { symbol: "EURC", address: EURC_ADDRESS, decimals: 6 },
    { symbol: "USYC", address: USYC_ADDRESS, decimals: 6 },
];

export function CrossChainBridgeWidget() {
    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();

    const [fromChain, setFromChain] = useState("ethereum");
    const [toChain, setToChain] = useState("arc");
    const [selectedToken, setSelectedToken] = useState<"USDC" | "EURC" | "USYC">("USDC");
    const [amount, setAmount] = useState("");
    const [isBridging, setIsBridging] = useState(false);

    const currentToken = TOKENS.find(t => t.symbol === selectedToken)!;

    // Balance Fetching
    const { data: balanceData } = useReadContract({
        address: currentToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address!],
        query: {
            enabled: !!address,
            refetchInterval: 5000
        }
    });

    const formattedBalance = balanceData
        ? formatUnits(balanceData as bigint, currentToken.decimals)
        : "0.00";

    const fee = amount ? calculateBridgeFee(amount) : "0.00";
    const estimatedTime = getEstimatedBridgeTime(fromChain, toChain);
    const netAmount = amount ? (parseFloat(amount) - parseFloat(fee)).toFixed(6) : "0.00";

    const handleBridge = async () => {
        if (!amount || !walletClient || !isConnected) return;

        try {
            setIsBridging(true);
            const bridgeKit = await initBridgeKit(walletClient);

            await new Promise(resolve => setTimeout(resolve, 2000));

            setAmount("");
            setIsBridging(false);
        } catch (error) {
            console.error("Bridge error:", error);
            setIsBridging(false);
        }
    };

    return (
        <Card className="w-full max-w-[480px]">
            <CardContent className="p-6 space-y-5">
                {/* From Chain */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">From Chain</label>
                    <Select value={fromChain} onValueChange={setFromChain}>
                        <SelectTrigger className="h-14 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SUPPORTED_CHAINS.map((chain) => (
                                <SelectItem key={chain.id} value={chain.id}>
                                    <div className="flex items-center gap-3">
                                        <NetworkIcon network={chain.id} className="w-5 h-5" />
                                        <span>{chain.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Amount with Token Selector */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-foreground">Amount</label>
                        <span className="text-xs text-muted-foreground">
                            Balance: {parseFloat(formattedBalance).toFixed(2)} {selectedToken}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Token Selector */}
                        <Select value={selectedToken} onValueChange={(val) => setSelectedToken(val as any)}>
                            <SelectTrigger className="w-[140px] h-14 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TOKENS.map((token) => (
                                    <SelectItem key={token.symbol} value={token.symbol}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                                                {token.symbol[0]}
                                            </div>
                                            {token.symbol}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Amount Input */}
                        <div className="flex-1 relative">
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
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-3 relative z-10">
                    <button
                        onClick={() => {
                            const temp = fromChain;
                            setFromChain(toChain);
                            setToChain(temp);
                        }}
                        className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-white dark:border-gray-900"
                        aria-label="Swap chains"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7 10L12 15L17 10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M17 14L12 9L7 14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* To Chain */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">To Chain</label>
                    <Select value={toChain} onValueChange={setToChain}>
                        <SelectTrigger className="h-14 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SUPPORTED_CHAINS.map((chain) => (
                                <SelectItem key={chain.id} value={chain.id}>
                                    <div className="flex items-center gap-3">
                                        <NetworkIcon network={chain.id} className="w-5 h-5" />
                                        <span>{chain.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Bridge Details */}
                {amount && parseFloat(amount) > 0 && (
                    <div className="space-y-2 p-4 bg-secondary/20 rounded-lg text-sm border border-border/50">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Bridge Fee (0.1%)</span>
                            <span className="font-medium">{fee} {selectedToken}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">You Will Receive</span>
                            <span className="font-bold text-green-400">{netAmount} {selectedToken}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Estimated Time</span>
                            <span className="text-xs text-foreground">{estimatedTime}</span>
                        </div>
                    </div>
                )}

                {/* Bridge Button */}
                <Button
                    onClick={handleBridge}
                    disabled={!amount || parseFloat(amount) <= 0 || isBridging || !isConnected}
                    className="w-full h-12 text-base font-semibold bg-[#5D9CDB] hover:bg-[#4a8ac9] text-white shadow-md"
                >
                    {isBridging ? (
                        <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Bridging...
                        </>
                    ) : (
                        <>
                            <Zap className="h-5 w-5 mr-2" />
                            Bridge & Supply
                        </>
                    )}
                </Button>

                {!isConnected && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                        Connect wallet to bridge assets
                    </p>
                )}
            </CardContent>
        </Card >
    );
}
