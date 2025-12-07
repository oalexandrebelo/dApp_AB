"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Settings, ChevronDown, Wallet, RefreshCw, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccount, useWriteContract, useSwitchChain } from "wagmi";
import { BRIDGE_ADDRESS, CROSS_CHAIN_BRIDGE_ABI, ERC20_ABI, ARC_TESTNET_CHAIN_ID, USDC_ADDRESS } from "@/lib/contracts";

export function BridgeWidget() {
    const { address, isConnected } = useAccount();
    const { switchChain } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();

    const [payAmount, setPayAmount] = useState("");
    const [isTransferring, setIsTransferring] = useState(false);

    // Debridge features
    const [isTradeAndSend, setIsTradeAndSend] = useState(false); // Checkbox state
    const [useCustomRecipient, setUseCustomRecipient] = useState(false); // Expanded/Collapsed state
    const [customRecipient, setCustomRecipient] = useState("");

    // Chains state (Static for now as per requirements)
    const [destChain, setDestChain] = useState("optimism");

    // Token Locked to USDC
    const selectedToken = "USDC";

    // Helper: Address Mapper
    const getTokenAddress = () => {
        return USDC_ADDRESS;
    };

    const handleTransfer = async () => {
        if (!isConnected) return;
        setIsTransferring(true);

        try {
            // 0. Ensure we are on the right chain (Stub logic for Arc Testnet)
            // switchChain({ chainId: ARC_TESTNET_CHAIN_ID }); 

            const tokenAddress = getTokenAddress();
            const amountObj = BigInt(Number(payAmount) * 1000000); // 6 decimals for USDC

            // Determine recipient
            // If "Counterparty address" is open AND filled, use it.
            // OR if "Trade and Send to Another Address" logic implies it.
            // For this implementation, we use customRecipient if provided, else user address.
            const recipient = (useCustomRecipient && customRecipient) ? customRecipient : address;

            if (!recipient) throw new Error("Invalid Recipient");

            // 1. Approve
            await writeContractAsync({
                address: tokenAddress as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [BRIDGE_ADDRESS, amountObj],
            });

            // 2. Bridge
            const txHash = await writeContractAsync({
                address: BRIDGE_ADDRESS,
                abi: CROSS_CHAIN_BRIDGE_ABI,
                functionName: 'sendCrossChainDeposit',
                args: [BigInt(10), tokenAddress as `0x${string}`, amountObj, recipient as `0x${string}`],
            });

            const userConfirmed = confirm(`Transaction Sent! \nTx Hash: ${txHash}\n\nClick OK to view on ArcScan, or Cancel to stay.`);

            if (userConfirmed) {
                window.open(`https://testnet.arcscan.app/tx/${txHash}`, '_blank');
            }

            setPayAmount("");
        } catch (error) {
            console.error("Bridge failed:", error);
            alert("Transaction failed or rejected. Check console for details.");
        } finally {
            setIsTransferring(false);
        }
    };

    return (
        <div className="w-full max-w-[480px] mx-auto font-sans">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex bg-[#0f121a] p-1 rounded-lg border border-white/5">
                    {/* Visual only tabs as requested - "Limit" and "Market" disabled style */}
                    <button className="px-5 py-2 text-sm font-medium text-zinc-500 cursor-not-allowed">Market</button>
                    <button className="px-5 py-2 text-sm font-medium text-zinc-500 cursor-not-allowed">Limit</button>
                    <button className="px-5 py-2 text-sm font-medium bg-[#1d212b] text-white rounded-md shadow-sm">P2P</button>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-white/5"><Settings className="h-4 w-4" /></Button>
                </div>
            </div>

            {/* Widget Box */}
            <div className="space-y-2">

                {/* 1. YOU PAY */}
                <div className="bg-[#0b101b] rounded-t-xl rounded-b-lg p-5 border border-white/5 relative">
                    <div className="flex justify-between text-sm text-zinc-400 mb-3">
                        <span className="font-medium text-white">You pay</span>
                        <span className="text-zinc-500">Balance: {isConnected ? "1,000.00" : "0"} USDC</span>
                    </div>

                    <div className="flex items-center gap-4 bg-[#131823] p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 bg-[#1d212b] px-3 py-1.5 rounded-full border border-white/5 min-w-[110px]">
                            <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white shrink-0">$</div>
                            <span className="font-semibold text-white">USDC</span>
                            <ChevronDown className="h-3 w-3 text-zinc-500 ml-auto" />
                        </div>

                        <Input
                            type="number"
                            placeholder="0"
                            className="flex-1 text-right text-2xl font-medium bg-transparent border-none focus-visible:ring-0 p-0 text-white placeholder:text-zinc-600 h-auto"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                        />
                    </div>
                </div>

                {/* Swap Icon Divider */}
                <div className="relative h-2 z-10">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-5">
                        <div className="bg-[#0b101b] p-1 rounded-lg border border-white/10">
                            <Button
                                size="icon"
                                className="h-8 w-8 rounded-md bg-[#1d212b] text-zinc-400 hover:text-white transition-all"
                            >
                                <ArrowDownUp className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. YOU RECEIVE */}
                <div className="bg-[#0b101b] rounded-t-lg rounded-b-xl p-5 border border-white/5 pt-6">
                    <div className="flex justify-between text-sm text-zinc-400 mb-2">
                        <span className="font-medium text-white">You receive</span>
                        <span className="text-zinc-500">Balance: {isConnected ? "0.00" : "0"} USDC</span>
                    </div>

                    <div className="mb-3 text-xs text-zinc-500 flex items-center gap-2">
                        <span>Buy at the rate</span>
                        <ArrowDownUp className="h-3 w-3 text-[#D1F840] rotate-90" />
                    </div>

                    <div className="flex items-center gap-2 text-zinc-600 text-sm mb-3">
                        <div className="bg-[#131823] px-3 py-2 rounded-md w-full border border-white/5">0</div>
                    </div>

                    <div className="flex items-center gap-4 bg-[#131823] p-3 rounded-lg border border-white/5 opacity-90">
                        <div className="flex items-center gap-2 bg-[#1d212b] px-3 py-1.5 rounded-full border border-white/5 min-w-[110px]">
                            <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white shrink-0">$</div>
                            <span className="font-semibold text-white">USDC</span>
                            <ChevronDown className="h-3 w-3 text-zinc-500 ml-auto" />
                        </div>
                        <Input
                            type="number"
                            placeholder="0"
                            className="flex-1 text-right text-2xl font-medium bg-transparent border-none focus-visible:ring-0 p-0 text-zinc-600 h-auto"
                            value={payAmount}
                            readOnly
                        />
                    </div>
                </div>

                {/* 3. Trade and Send / Routing Options */}
                <div className="bg-[#0b101b] p-4 rounded-xl border border-white/5 space-y-4">
                    {/* "Trade and Send" Checkbox row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsTradeAndSend(!isTradeAndSend)}>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isTradeAndSend ? 'bg-[#D1F840] border-[#D1F840]' : 'border-zinc-600 bg-transparent'}`}>
                                {isTradeAndSend && <div className="w-2 h-2 bg-black rounded-sm" />}
                            </div>
                            <span className="text-sm text-zinc-300">Trade and Send to Another Address</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                            Routing <ChevronDown className="h-3 w-3" />
                        </div>
                    </div>
                </div>

                {/* 4. Counterparty Address Section */}
                <div className="bg-[#0b101b] p-4 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            {/* Toggle Switch */}
                            <div
                                className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${useCustomRecipient ? 'bg-zinc-200' : 'bg-zinc-700'}`}
                                onClick={() => setUseCustomRecipient(!useCustomRecipient)}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all shadow-sm ${useCustomRecipient ? 'left-5' : 'left-1'}`} />
                            </div>
                            <span className="text-sm font-medium text-white flex items-center gap-2">
                                Counterparty address <Info className="h-3 w-3 text-zinc-600" />
                            </span>
                        </div>
                        <span className="text-xs text-zinc-500 flex items-center gap-1 cursor-pointer hover:text-zinc-300">
                            Counterparties book <ChevronDown className="h-3 w-3" />
                        </span>
                    </div>

                    {useCustomRecipient ? (
                        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                            <Input
                                placeholder="Address in Optimism *"
                                className="bg-[#131823] border-white/10 text-white font-mono text-sm h-12 focus-visible:ring-[#D1F840] placeholder:text-zinc-600"
                                value={customRecipient}
                                onChange={(e) => setCustomRecipient(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-6 border border-dashed border-white/5 rounded-lg bg-[#131823]/50">
                            <div className="text-sm text-zinc-500 mb-3">You don't have any addresses added yet</div>
                            <button
                                className="text-sm text-white flex items-center justify-center gap-1 mx-auto hover:text-[#D1F840] transition-colors"
                                onClick={() => setUseCustomRecipient(true)}
                            >
                                <span className="text-lg leading-none">+</span> Add address
                            </button>
                        </div>
                    )}
                </div>

                {/* 5. Connect / Action Button */}
                <Button
                    className="w-full bg-[#D1F840] hover:bg-[#bce628] text-black font-bold h-12 text-base rounded-lg mt-2 disabled:opacity-50"
                    onClick={handleTransfer}
                    disabled={isTransferring}
                >
                    {isConnected
                        ? (isTransferring ? "Processing..." : "Confirm")
                        : "Connect wallet"
                    }
                </Button>

            </div>
        </div>
    );
}
