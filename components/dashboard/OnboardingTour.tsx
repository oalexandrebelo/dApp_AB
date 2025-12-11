"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronRight } from "lucide-react";

export function OnboardingTour() {
    const [step, setStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has seen tour
        const hasSeenTour = localStorage.getItem("hasSeenArcTour");
        if (!hasSeenTour) {
            // Small delay to show after load
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem("hasSeenArcTour", "true");
    };

    const steps = [
        {
            title: "Welcome to Arc Network",
            description: "Your premium gateway to cross-chain lending and borrowing.",
            target: "body", // Global modal
        },
        {
            title: "Track Your Health",
            description: "Monitor your Health Factor to avoid liquidation risks.",
            target: ".health-factor", // We need to add this class to HealthFactor
        },
        {
            title: "Supply Assets",
            description: "Deposit assets to earn APY and enable borrowing power.",
            target: "sidebar-supply", // Assuming sidebar has IDs or we fake it
        },
    ];

    if (!isVisible) return null;

    const currentStep = steps[step];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed bottom-8 right-8 z-[100] w-80 bg-card border border-primary/20 p-6 rounded-xl shadow-2xl backdrop-blur-xl"
            >
                <button
                    onClick={handleComplete}
                    className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {step + 1}/{steps.length}
                        </span>
                        <h3 className="font-bold text-lg">{currentStep.title}</h3>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {currentStep.description}
                    </p>

                    <div className="flex justify-end pt-2">
                        <Button
                            size="sm"
                            variant="premium"
                            onClick={() => {
                                if (step < steps.length - 1) setStep(step + 1);
                                else handleComplete();
                            }}
                        >
                            {step < steps.length - 1 ? "Next Step" : "Get Started"} <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

