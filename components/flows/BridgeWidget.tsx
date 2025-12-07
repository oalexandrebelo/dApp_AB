"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ERC20_ABI, USDC_ADDRESS, EURC_ADDRESS } from "@/lib/contracts";

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
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: lastTxHash,
    });

    const getTokenAddress = () => {
        return selectedToken === "USDC" ? USDC_ADDRESS : EURC_ADDRESS;
    };

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
            const amountObj = BigInt(Number(amount) * 1000000); // Assuming 6 decimals for both

            // Execute ERC20 Transfer
            const txHash = await writeContractAsync({
                address: tokenAddress as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'transfer',
                args: [recipient as `0x${string}`, amountObj],
            });

            setLastTxHash(txHash);
            // Don't clear form immediately so user can see what they sent, or optional.
            // setAmount(""); 
        } catch (error) {
            console.error("Transfer failed:", error);
            alert("Transaction failed. Check console.");
        } finally {
            setIsTransferring(false);
        }
    };

    return (
        <div className="w-full max-w-[480px] mx-auto font-sans bg-white text-black p-6 rounded-3xl shadow-xl border border-zinc-100">

            {/* Token Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => setSelectedToken("USDC")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedToken === "USDC"
                            ? "border-blue-500 bg-blue-50"
                            : "border-zinc-200 hover:border-zinc-300"
                        }`}
                >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs mb-2">
                        $
                    </div>
                    <span className="font-semibold text-sm">USDC</span>
                </button>

                <button
                    onClick={() => setSelectedToken("EURC")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedToken === "EURC"
                            ? "border-blue-500 bg-blue-50"
                            : "border-zinc-200 hover:border-zinc-300"
                        }`}
                >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs mb-2">
                        €
                    </div>
                    <span className="font-semibold text-sm">EURC</span>
                </button>
            </div>

            {/* Network */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Network</label>
                <div className="flex items-center justify-between bg-white border border-zinc-300 rounded-lg p-3 px-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">A</div>
                        <span className="text-sm font-medium">Arc Testnet</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                </div>
            </div>

            {/* Send to */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Send to</label>
                <Input
                    placeholder="Wallet address"
                    className="h-12 border-zinc-300 text-black placeholder:text-zinc-400 bg-white"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
            </div>

            {/* Value */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Value</label>
                <Input
                    type="number"
                    placeholder="0,00"
                    className="h-12 border-zinc-300 text-black placeholder:text-zinc-400 bg-white"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            {/* Status Feedback (Preserved & Adapted for Light Mode) */}
            {lastTxHash && (
                <div className={`mb-4 p-4 rounded-lg flex flex-col gap-2 transition-colors border ${isConfirmed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className="flex items-center gap-2">
                        {isConfirmed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                            <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
                        )}
                        <span className={`font-semibold text-sm ${isConfirmed ? 'text-green-700' : 'text-yellow-700'}`}>
                            {isConfirmed ? "Transfer Completed!" : "Transfer Initiated..."}
                        </span>
                    </div>
                    <a
                        href={`https://testnet.arcscan.app/tx/${lastTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs underline break-all ${isConfirmed ? 'text-green-600 hover:text-green-500' : 'text-yellow-600 hover:text-yellow-500'}`}
                    >
                        View on ArcScan
                    </a>
                </div>
            )}

            {/* Send Button */}
            <Button
                className="w-full h-12 text-base font-semibold bg-[#5D9CDB] hover:bg-[#4a8ac9] text-white shadow-md rounded-xl"
                onClick={handleSend}
                disabled={isTransferring || (!!lastTxHash && !isConfirmed) || !isConnected}
            >
                {isConnected
                    ? (isTransferring ? "Sending..." : "Send")
                    : "Connect Wallet"
                }
            </Button>
        </div>
    );
}
