"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Settings, ChevronDown, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccount, useWriteContract } from "wagmi";
import { BRIDGE_ADDRESS, CROSS_CHAIN_BRIDGE_ABI, ERC20_ABI } from "@/lib/contracts";

export function BridgeWidget() {
    const { address, isConnected } = useAccount();
    const [payAmount, setPayAmount] = useState("");
    const [isTransferring, setIsTransferring] = useState(false);

    // Chains state
    const [sourceChain, setSourceChain] = useState("ethereum");
    const [destChain, setDestChain] = useState("optimism");

    // Mocking "Available Tokens" logic since we don't have an indexer API
    const availableTokens = [
        { symbol: "ETH", name: "Ethereum", balance: "1.45" },
        { symbol: "USDC", name: "USD Coin", balance: "1,000.00" },
        { symbol: "USDT", name: "Tether", balance: "500.23" },
        { symbol: "WBTC", name: "Wrapped BTC", balance: "0.05" },
        { symbol: "DAI", name: "Dai Stablecoin", balance: "0.00" },
        { symbol: "LINK", name: "Chainlink", balance: "0.00" },
            </div >

        {/* You Receive Section */ }
        < div className = "bg-[#1e1e24] shadow-xl rounded-2xl p-4 border border-white/5 space-y-2 z-0" >
                <div className="flex justify-between text-sm text-zinc-400">
                    <span>You receive</span>
                    <span>Balance: {isConnected ? "0.00" : "0"} {selectedToken}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="shrink-0 w-[150px]">
                        <Select value={destChain} onValueChange={setDestChain}>
                            <SelectTrigger className="h-10 border-0 bg-[#2b2b31] hover:bg-[#32323a] focus:ring-0 gap-2 font-medium text-white shadow-inner">
                                <div className="h-5 w-5 rounded-full bg-purple-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                                    {destChain.substring(0, 2).toUpperCase()}
                                </div>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] bg-[#2b2b31] border-zinc-700 text-white" align="start">
                                <SelectItem value="ethereum">Ethereum</SelectItem>
                                <SelectItem value="optimism">Optimism</SelectItem>
                                <SelectItem value="arbitrum">Arbitrum</SelectItem>
                                <SelectItem value="base">Base</SelectItem>
                                <SelectItem value="polygon">Polygon</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Input
                        type="number"
                        placeholder="0"
                        className="flex-1 text-right text-3xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 text-zinc-500"
                        value={payAmount}
                        readOnly
                    />
                </div>
                <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2 text-sm bg-[#2b2b31] px-3 py-1.5 rounded-full text-zinc-300 border border-white/5">
                        <span className="font-semibold">{selectedToken}</span>
                    </div>
                    <div className="text-xs text-zinc-500">~${payAmount || "0.00"}</div>
                </div>
            </div >

        {/* Details */ }
        < div className = "flex items-center justify-between text-xs px-3 py-2 bg-yellow-500/5 text-yellow-600 rounded-lg border border-yellow-500/10" >
                <span className="font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                    Best Route
                </span>
                <span className="flex items-center gap-1">ETA: ~20s <ChevronDown className="h-3 w-3" /></span>
            </div >

        {/* Action Button */ }
        < Button
    className = "w-full bg-[#D1F840] hover:bg-[#bce628] text-black font-bold h-12 text-base rounded-xl transition-all shadow-lg hover:shadow-[#D1F840]/20 disabled:opacity-50 disabled:cursor-not-allowed"
    onClick = { handleTransfer }
    disabled = { isTransferring }
        >
    {
        isConnected
            ?(isTransferring? "Transferring..." : "Confirm Transfer")
            : "Connect Wallet"
    }
            </Button >

        {/* Chainlist Feature Footer */ }
        < div className = "flex justify-center pt-2" >
            <button
                onClick={addToWallet}
                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors"
            >
                <Wallet className="h-3 w-3" />
                Add {selectedToken} to Metamask
            </button>
            </div >
        </div >
    );
}
