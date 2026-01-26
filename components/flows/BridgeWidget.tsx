"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { ERC20_ABI, USDC_ADDRESS, EURC_ADDRESS } from "@/lib/contracts";
import { formatUnits, parseUnits } from "viem";
import { saveTransaction } from "@/lib/history";
import { cn } from "@/lib/utils";

export function BridgeWidget() {
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();

    // State
    const [selectedToken, setSelectedToken] = useState<"USDC" | "EURC">("USDC");
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [isTransferring, setIsTransferring] = useState(false);
    const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>(undefined);

    // Transaction Monitoring
    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: lastTxHash,
    });

    const getTokenAddress = () => {
        return selectedToken === "USDC" ? USDC_ADDRESS : EURC_ADDRESS;
    };

    // Balance Fetching
    const { data: balanceData, refetch: refetchBalance } = useReadContract({
        address: getTokenAddress() as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address!],
        query: {
            enabled: !!address,
            refetchInterval: 5000
        }
    });

    // Formatting Balance (Standard Circle tokens use 6 decimals)
    const decimals = 6;
    const formattedBalance = balanceData ? formatUnits(balanceData as bigint, decimals) : "0.00";

    const handleSend = async () => {
        if (!isConnected) return;
        if (!recipient || !amount) {
            alert("Please fill in all fields");
            return;
        }

        setIsTransferring(true);
        setLastTxHash(undefined);

        try {
            const tokenAddress = getTokenAddress();
            const sanitizedAmount = amount.replace(',', '.');

            // Use parseUnits for safer conversion than math.floor
            const amountObj = parseUnits(sanitizedAmount, decimals);

            // Execute ERC20 Transfer
            const txHash = await writeContractAsync({
                address: tokenAddress as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'transfer',
                args: [recipient as `0x${string}`, amountObj],
            });

            setLastTxHash(txHash);

            // Save to LocalStorage for History using helper
            if (address) {
                saveTransaction({
                    hash: txHash,
                    type: 'send',
                    token: selectedToken,
                    amount: amount,
                    status: 'success',
                    to: recipient,
                    user: address
                });
            }

            refetchBalance();
        } catch (error) {
            console.error("Transfer failed:", error);
        } finally {
            setIsTransferring(false);
        }
    };

    const handleMax = () => {
        if (formattedBalance) {
            setAmount(formattedBalance);
        }
    };

    return (
        <Card className="w-full max-w-[480px]">
            <CardContent className="p-6 space-y-5">
                {/* Token Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setSelectedToken("USDC")}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                            selectedToken === "USDC"
                                ? "border-cyan-500 bg-cyan-500/10"
                                : "border-border hover:border-cyan-500/50"
                        )}
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mb-2">
                            $
                        </div>
                        <span className="font-semibold text-sm text-foreground">USDC</span>
                    </button>

                    <button
                        onClick={() => setSelectedToken("EURC")}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                            selectedToken === "EURC"
                                ? "border-cyan-500 bg-cyan-500/10"
                                : "border-border hover:border-cyan-500/50"
                        )}
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mb-2">
                            €
                        </div>
                        <span className="font-semibold text-sm text-foreground">EURC</span>
                    </button>
                </div>

                {/* Network */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Network</label>
                    <div className="flex items-center justify-between bg-secondary/50 border border-border rounded-xl p-3 px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">A</div>
                            <span className="text-sm font-medium text-foreground">Arc Testnet</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>

                {/* Send to */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Send to</label>
                    <Input
                        placeholder="Wallet address"
                        className="h-12 border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />
                </div>

                {/* Value */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-foreground">Value</label>
                        <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                            Balance: {Number(formattedBalance).toLocaleString(undefined, { maximumFractionDigits: 6 })} {selectedToken}
                            <button
                                onClick={handleMax}
                                className="text-cyan-400 hover:text-cyan-300 font-bold uppercase text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded-md transition-colors"
                            >
                                Max
                            </button>
                        </div>
                    </div>
                    <Input
                        type="number"
                        placeholder="0.00"
                        className="h-12 border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                {/* Status Feedback */}
                {lastTxHash && (
                    <div className={cn(
                        "p-4 rounded-xl flex flex-col gap-2 transition-colors border",
                        isConfirmed
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-yellow-500/10 border-yellow-500/30'
                    )}>
                        <div className="flex items-center gap-2">
                            {isConfirmed ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                                <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />
                            )}
                            <span className={cn(
                                "font-semibold text-sm",
                                isConfirmed ? 'text-emerald-400' : 'text-yellow-400'
                            )}>
                                {isConfirmed ? "Transfer Completed!" : "Transfer Initiated..."}
                            </span>
                        </div>
                        <a
                            href={`https://testnet.arcscan.app/tx/${lastTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "text-xs underline break-all",
                                isConfirmed ? 'text-emerald-400 hover:text-emerald-300' : 'text-yellow-400 hover:text-yellow-300'
                            )}
                        >
                            View on ArcScan
                        </a>
                    </div>
                )}

                {/* Send Button */}
                <Button
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg rounded-xl"
                    onClick={handleSend}
                    disabled={isTransferring || (!!lastTxHash && !isConfirmed) || !isConnected}
                >
                    {isConnected
                        ? (isTransferring ? "Sending..." : "Send")
                        : "Connect Wallet"
                    }
                </Button>
            </CardContent>
        </Card>
    );
}

