"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI, ERC20_ABI } from "@/lib/contracts";
import { useLanguage } from '@/lib/i18n';

interface SupplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset: {
        symbol: string;
        balance: string;
        apy: string;
        address: `0x${string}`;
        decimals: number;
    };
}

export function SupplyModal({ isOpen, onClose, asset }: SupplyModalProps) {
    const { t } = useLanguage();
    const { isConnected } = useAccount();
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"input" | "review" | "approving" | "approved_waiting" | "supplying" | "success">("input");
    const [slippage, setSlippage] = useState("0.5");

    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    // ... (handlers)

    useEffect(() => {
        if (isConfirmed) {
            if (step === "approving") {
                setStep("approved_waiting"); // Move to intermediate step
            } else if (step === "supplying") {
                setStep("success");
            }
        }
    }, [isConfirmed, step]);

    // ... (UI Render)

    {
        step === "approved_waiting" && (
            <motion.div
                key="approved_waiting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 text-center py-6"
            >
                <div className="h-12 w-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">Approval Successful!</h3>
                <p className="text-sm text-muted-foreground">
                    You have approved the protocol. Now please confirm the supply transaction to deposit funds.
                </p>

                <Button
                    className="w-full mt-4"
                    variant="premium"
                    size="lg"
                    onClick={handleSupply}
                >
                    Confirm Deposit (2/2)
                </Button>
            </motion.div>
        )
    }

    {
        (step === "approving" || step === "supplying") && (
            <motion.div
                key="confirming"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-8 space-y-4"
            >
                <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
                <div className="text-center">
                    <h3 className="font-bold text-lg">
                        {step === "approving" ? "Approving Token (1/2)" : "Supplying Assets (2/2)"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {isConfirming ? "Waiting for blockchain confirmation..." : "Please sign the request in your wallet..."}
                    </p>
                    {hash && <p className="text-xs text-muted-foreground truncate w-64 mx-auto mt-2">Tx: {hash}</p>}
                </div>
            </motion.div>
        )
    }

    {
        step === "success" && (
            // ... (Existing Success UI)
            <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 space-y-4"
            >
                <div className="h-12 w-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="text-center">
                    <h3 className="font-bold text-lg">Unstoppable!</h3>
                    <p className="text-sm text-muted-foreground">You have successfully supplied {amount} {asset.symbol}</p>
                </div>
                <Button onClick={reset} className="w-full" variant="outline">
                    Close
                </Button>
            </motion.div>
        )
    }
                </AnimatePresence >
            </div >
        </Modal >
    );
}
