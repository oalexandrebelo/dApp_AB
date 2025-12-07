"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Loader2, CheckCircle2, Flame, ShieldCheck, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CCTPBridge() {
    const [step, setStep] = useState<"burn" | "attest" | "mint" | "complete">("burn");
    const [amount, setAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleBurn = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep("attest");
        }, 2000);
    };

    const handleAttest = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep("mint");
        }, 2000);
    };

    const handleMint = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep("complete");
        }, 2000);
    };

    return (
        <Card className="max-w-md mx-auto w-full bg-card/60 backdrop-blur-xl border-primary/20">
            <CardHeader>
                <CardTitle className="text-center bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent text-2xl">
                    Cross-Chain Bridge
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Progress Stepper */}
                <div className="flex justify-between relative mb-8">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-secondary -z-10" />

                    {["burn", "attest", "mint"].map((s, i) => {
                        const isActive = step === s || step === "complete" || (step === "attest" && i === 0) || (step === "mint" && i <= 1);
                        // Simple logic to show progress
                        const isCompleted = (step === "attest" && i === 0) || (step === "mint" && i <= 1) || step === "complete";
                        const isCurrent = step === s;

                        let Icon = Flame;
                        if (i === 1) Icon = ShieldCheck;
                        if (i === 2) Icon = Coins;

                        return (
                            <div key={s} className="flex flex-col items-center bg-background p-1 z-10 transition-all">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? "bg-green-500 border-green-500 text-white" : isCurrent ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/50" : "bg-card border-muted text-muted-foreground"}`}>
                                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                </div>
                                <span className={`text-xs mt-2 font-medium ${isCurrent ? "text-indigo-400" : "text-muted-foreground"}`}>{s.toUpperCase()}</span>
                            </div>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {step === "burn" && (
                        <motion.div key="burn" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                            <div className="bg-secondary/30 p-4 rounded-xl space-y-2">
                                <label className="text-sm text-muted-foreground">Amount to Bridge (USDC)</label>
                                <Input
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="bg-transparent border-none text-2xl font-bold p-0 shadow-none h-auto focus-visible:ring-0"
                                />
                            </div>
                            <Button
                                onClick={handleBurn}
                                disabled={!amount || isProcessing}
                                className="w-full h-12 text-lg"
                                variant="premium"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : "Burn USDC on Source"}
                            </Button>
                        </motion.div>
                    )}

                    {step === "attest" && (
                        <motion.div key="attest" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 text-center">
                            <div className="bg-secondary/30 p-6 rounded-xl flex flex-col items-center gap-4">
                                <ShieldCheck className="h-12 w-12 text-indigo-400" />
                                <p className="text-sm text-muted-foreground">Wait for Circle attestation service to verify your burn transaction.</p>
                            </div>
                            <Button
                                onClick={handleAttest}
                                disabled={isProcessing}
                                className="w-full h-12 text-lg"
                                variant="secondary"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : "Get Attestation"}
                            </Button>
                        </motion.div>
                    )}

                    {step === "mint" && (
                        <motion.div key="mint" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 text-center">
                            <div className="bg-secondary/30 p-6 rounded-xl flex flex-col items-center gap-4">
                                <Coins className="h-12 w-12 text-green-400" />
                                <p className="text-sm text-muted-foreground">Attestation received! You can now mint your USDC on the destination chain.</p>
                            </div>
                            <Button
                                onClick={handleMint}
                                disabled={isProcessing}
                                className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : "Mint USDC"}
                            </Button>
                        </motion.div>
                    )}

                    {step === "complete" && (
                        <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 text-center py-8">
                            <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Transfer Complete!</h3>
                            <p className="text-muted-foreground">Your USDC has arrived safely.</p>
                            <Button onClick={() => setStep("burn")} variant="outline">Start New Transfer</Button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </CardContent>
        </Card>
    );
}
