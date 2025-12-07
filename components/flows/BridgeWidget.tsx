"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Settings, ChevronDown, Wallet, RefreshCw, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccount, useWriteContract, useSwitchChain } from "wagmi";
import { BRIDGE_ADDRESS, CROSS_CHAIN_BRIDGE_ABI, ERC20_ABI, ARC_TESTNET_CHAIN_ID } from "@/lib/contracts";

export function BridgeWidget() {
    const { address, isConnected } = useAccount();
    const { switchChain } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();

    const [payAmount, setPayAmount] = useState("");
    const [isTransferring, setIsTransferring] = useState(false);

    // Debridge Style: Counterparty Address toggle
    const [useCustomRecipient, setUseCustomRecipient] = useState(false);
    const [customRecipient, setCustomRecipient] = useState("");

    // Chains state
    const [sourceChain, setSourceChain] = useState("ethereum");
    const [destChain, setDestChain] = useState("optimism");

    // Mock Tokens
    const availableTokens = [
        { symbol: "ETH", name: "Ethereum", balance: "1.45" },
        { symbol: "USDC", name: "USD Coin", balance: "1,000.00" },
        { symbol: "USDT", name: "Tether", balance: "500.23" },
        { symbol: "WBTC", name: "Wrapped BTC", balance: "0.05" },
    ];

    const walletTokens = isConnected ? availableTokens.filter(t => parseFloat(t.balance) > 0) : availableTokens;
    const [selectedToken, setSelectedToken] = useState(walletTokens[1]?.symbol || "USDC");

    // Helper: Mock Address Mapper
    const getTokenAddress = (symbol: string) => {
        if (symbol === "USDC") return "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // Placeholder
        return "0x0000000000000000000000000000000000000000";
    };

    const handleTransfer = async () => {
        if (!isConnected) return;
        setIsTransferring(true);

        try {
            // 0. Ensure we are on the right chain (Stub logic for Arc Testnet)
            // switchChain({ chainId: ARC_TESTNET_CHAIN_ID }); 

            const tokenAddress = getTokenAddress(selectedToken);
            const amountObj = BigInt(Number(payAmount) * 1000000); // 6 decimals

            // Determine recipient: Custom address OR self
            const recipient = useCustomRecipient && customRecipient ? customRecipient : address;

            if (!recipient) throw new Error("Invalid Recipient");

            // 1. Approve
            await writeContractAsync({
                address: tokenAddress as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [BRIDGE_ADDRESS, amountObj],
            });

            // 2. Bridge with Recipient
            await writeContractAsync({
                address: BRIDGE_ADDRESS,
                abi: CROSS_CHAIN_BRIDGE_ABI,
                functionName: 'sendCrossChainDeposit',
                args: [BigInt(10), tokenAddress as `0x${string}`, amountObj, recipient as `0x${string}`],
            });

            alert(`Successfully bridged ${payAmount} ${selectedToken} to ${recipient}!`);
            setPayAmount("");
        } catch (error) {
            console.error("Bridge failed:", error);
            alert("Transaction failed. Check console.");
        } finally {
            setIsTransferring(false);
        }
    };

    const handleSwap = () => {
        const temp = sourceChain;
        setSourceChain(destChain);
        setDestChain(temp);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-4 font-sans">
            {/* Top Bar: Tabs & Settings */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex bg-[#2b2b31]/50 p-1 rounded-lg border border-white/5">
                    {/* Only P2P Active as requested */}
                    <button className="px-4 py-1.5 text-sm font-medium text-zinc-500 cursor-not-allowed opacity-50">Market</button>
                    <button className="px-4 py-1.5 text-sm font-medium text-zinc-500 cursor-not-allowed opacity-50">Limit</button>
                    <button className="px-4 py-1.5 text-sm font-medium bg-[#3f3f46] text-white shadow-md rounded-md transition-all">P2P</button>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/5"><Settings className="h-4 w-4" /></Button>
                </div>
            </div>

            {/* Main Widget Container */}
            <div className="space-y-1">
                {/* 1. YOU PAY */}
                <div className="bg-[#1e1e24] rounded-t-2xl rounded-b-lg p-4 border border-white/5 relative z-20">
                    <div className="flex justify-between text-sm text-zinc-400 mb-2">
                        <span>You pay</span>
                        <span>Balance: {isConnected ? "1,000.00" : "0"} {selectedToken}</span>
                    </div>

                    <div className="flex items-center gap-3 bg-[#131316] p-2 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <Select value={selectedToken} onValueChange={setSelectedToken}>
                            <SelectTrigger className="w-[140px] h-10 border-0 bg-transparent focus:ring-0 text-white font-semibold text-lg gap-2 pl-2">
                                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white shrink-0">$</div>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1f] border-zinc-700 text-white">
                                {walletTokens.map(t => (
                                    <SelectItem key={t.symbol} value={t.symbol}>{t.symbol}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            type="number"
                            placeholder="0"
                            className="flex-1 text-right text-3xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 text-white placeholder:text-zinc-700 h-auto"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                        />
                    </div>
                </div>

                {/* Swap Divider */}
                <div className="relative h-2 z-30">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-5">
                        <Button
                            size="icon"
                            className="h-10 w-10 rounded-lg bg-[#2b2b31] border-4 border-[#18181b] text-zinc-400 hover:text-white hover:bg-[#3f3f46] transition-all"
                            onClick={handleSwap}
                        >
                            <ArrowDownUp className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* 2. YOU RECEIVE */}
                <div className="bg-[#1e1e24] rounded-t-lg rounded-b-2xl p-4 border border-white/5 relative z-10 pt-6">
                    <div className="flex justify-between text-sm text-zinc-400 mb-2">
                        <span>You receive</span>
                        <span>Balance: {isConnected ? "0.00" : "0"} {selectedToken}</span>
                    </div>

                    {/* Rate Input (Debridge Style) */}
                    <div className="mb-2">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                            <RefreshCw className="h-3 w-3" /> Buy at rate
                        </div>
                        <div className="bg-[#131316] rounded-lg px-3 py-2 border border-white/5 text-zinc-400 text-sm">
                            1 {selectedToken} = 0.999 {selectedToken} (Est.)
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-[#131316] p-2 rounded-xl border border-white/5 opacity-80 cursor-not-allowed">
                        <div className="flex items-center gap-2 w-[140px] pl-2">
                            <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                                {destChain.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-white font-semibold text-lg">{selectedToken}</span>
                        </div>
                        <Input
                            type="number"
                            placeholder="0"
                            className="flex-1 text-right text-3xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 text-zinc-500 h-auto"
                            value={payAmount}
                            readOnly
                        />
                    </div>
                </div>
            </div>

            {/* 3. SETTINGS / COUNTERPARTY */}
            <div className="space-y-2 pt-2">
                {/* "Trade and Send" Toggle Box */}
                <div className="bg-[#1e1e24] rounded-xl border border-white/5 overflow-hidden">
                    <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => setUseCustomRecipient(!useCustomRecipient)}
                    >
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <div className={`w-8 h-5 rounded-full relative transition-colors ${useCustomRecipient ? 'bg-[#D1F840]' : 'bg-zinc-700'}`}>
                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-black transition-all ${useCustomRecipient ? 'left-4' : 'left-1'}`} />
                            </div>
                            <span>Counterparty address</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${useCustomRecipient ? 'rotate-180' : ''}`} />
                    </div>

                    {useCustomRecipient && (
                        <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                            <label className="text-xs text-zinc-500 block mb-1.5 ml-1">Address in {destChain}</label>
                            <Input
                                placeholder="0x..."
                                className="bg-[#131316] border-white/10 text-white font-mono text-sm h-11 focus-visible:ring-[#D1F840]"
                                value={customRecipient}
                                onChange={(e) => setCustomRecipient(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <Button
                className="w-full bg-[#D1F840] hover:bg-[#bce628] text-black font-bold h-12 text-base rounded-xl transition-all shadow-lg hover:shadow-[#D1F840]/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                onClick={handleTransfer}
                disabled={isTransferring}
            >
                {isConnected
                    ? (isTransferring ? "Processing..." : "Confirm Transfer")
                    : "Connect Wallet"
                }
            </Button>
        </div>
    );
}
