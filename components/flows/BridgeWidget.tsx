"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Settings, ChevronDown, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccount } from "wagmi";

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
    ];

    // Filter to only show tokens with balance > 0
    const walletTokens = isConnected ? availableTokens.filter(t => parseFloat(t.balance) > 0) : availableTokens;
    const [selectedToken, setSelectedToken] = useState(walletTokens[1]?.symbol || "USDC");

    const handleTransfer = async () => {
        if (!isConnected) return;

        setIsTransferring(true);
        // Simulate network delay for demo
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsTransferring(false);
        setPayAmount("");
        alert(`Successfully transferred ${payAmount} ${selectedToken} from ${sourceChain} to ${destChain}!`);
    };

    const handleSwap = () => {
        const temp = sourceChain;
        setSourceChain(destChain);
        setDestChain(temp);
    };

    const addToWallet = async () => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC Mainnet
                        symbol: 'USDC',
                        decimals: 6,
                        image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
                    },
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex bg-secondary/80 p-1 rounded-lg">
                    <button className="px-4 py-1.5 text-sm font-medium bg-background shadow-md rounded-md transition-all">Market</button>
                    <button className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">Limit</button>
                    <button className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">P2P</button>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-secondary/80 hover:bg-secondary"><Settings className="h-4 w-4" /></Button>
                </div>
            </div>

            {/* You Pay Section */}
            <div className="bg-[#1e1e24] shadow-xl rounded-2xl p-4 border border-white/5 space-y-2 relative group z-20">
                <div className="flex justify-between text-sm text-zinc-400">
                    <span>You pay</span>
                    <span>Balance: {isConnected ? "1,000.00" : "0"} {selectedToken}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="shrink-0 w-[150px]">
                        {/* Custom Select for Token + Chain */}
                        <Select value={sourceChain} onValueChange={setSourceChain}>
                            <SelectTrigger className="h-10 border-0 bg-[#2b2b31] hover:bg-[#32323a] focus:ring-0 gap-2 font-medium text-white shadow-inner">
                                <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                                    {sourceChain.substring(0, 2).toUpperCase()}
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
                        className="flex-1 text-right text-3xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 text-white placeholder:text-zinc-600"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                    />
                </div>
                <div className="flex justify-between items-center mt-3">
                    {/* Token Selector - Simulating 'Wallet Tokens' */}
                    <Select value={selectedToken} onValueChange={setSelectedToken}>
                        <SelectTrigger className="w-auto h-8 gap-2 border-0 bg-[#2b2b31] text-xs pill-shape rounded-full text-white">
                            <div className="h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center text-[8px] text-white">$</div>
                            <span>{selectedToken}</span>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1f] border-zinc-700 text-white min-w-[180px]">
                            {/* Header for Dropdown */}
                            <div className="px-2 py-1.5 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                                Wallet Tokens
                            </div>
                            {walletTokens.map((token) => (
                                <SelectItem key={token.symbol} value={token.symbol} className="focus:bg-zinc-800 focus:text-white cursor-pointer">
                                    <div className="flex items-center justify-between w-full gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-bold">
                                                {token.symbol[0]}
                                            </div>
                                            <span className="font-medium">{token.symbol}</span>
                                        </div>
                                        <span className="text-xs text-zinc-400">{token.balance}</span>
                                    </div>
                                </SelectItem>
                            ))}
                            <div className="border-t border-zinc-800 my-1"></div>
                            <SelectItem value="add_custom" className="text-xs text-indigo-400 focus:bg-zinc-800">
                                + Import Token
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="text-xs text-zinc-500">~${payAmount || "0.00"}</div>
                </div>
            </div>

            {/* Swap Trigger */}
            <div className="relative h-4 z-10">
                <div className="absolute left-1/2 -translate-x-1/2 -top-4">
                    <Button
                        size="icon"
                        className="h-8 w-8 rounded-lg bg-[#2b2b31] border border-[#3f3f46] hover:bg-[#32323a] shadow-lg transition-transform hover:scale-110"
                        onClick={handleSwap}
                    >
                        <ArrowDownUp className="h-4 w-4 text-zinc-400" />
                    </Button>
                </div>
            </div>

            {/* You Receive Section */}
            <div className="bg-[#1e1e24] shadow-xl rounded-2xl p-4 border border-white/5 space-y-2 z-0">
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
            </div>

            {/* Details */}
            <div className="flex items-center justify-between text-xs px-3 py-2 bg-yellow-500/5 text-yellow-600 rounded-lg border border-yellow-500/10">
                <span className="font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                    Best Route
                </span>
                <span className="flex items-center gap-1">ETA: ~20s <ChevronDown className="h-3 w-3" /></span>
            </div>

            {/* Action Button */}
            <Button
                className="w-full bg-[#D1F840] hover:bg-[#bce628] text-black font-bold h-12 text-base rounded-xl transition-all shadow-lg hover:shadow-[#D1F840]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleTransfer}
                disabled={isTransferring}
            >
                {isConnected
                    ? (isTransferring ? "Transferring..." : "Confirm Transfer")
                    : "Connect Wallet"
                }
            </Button>

            {/* Chainlist Feature Footer */}
            <div className="flex justify-center pt-2">
                <button
                    onClick={addToWallet}
                    className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors"
                >
                    <Wallet className="h-3 w-3" />
                    Add {selectedToken} to Metamask
                </button>
            </div>
        </div>
    );
}
