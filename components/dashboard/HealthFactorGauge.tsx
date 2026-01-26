"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HealthFactorGaugeProps {
    value: number; // e.g., 1.5
    maxValue?: number; // e.g., 3.0
    className?: string;
}

export function HealthFactorGauge({ value, maxValue = 3, className }: HealthFactorGaugeProps) {
    // Normalize value to 0-1 range (capped at 1)
    const normalizedValue = Math.min(value / maxValue, 1);

    // Determine color based on health factor risk
    let color = "#ef4444"; // red-500
    let statusLabel = "At Risk";

    if (value >= 1.5) {
        color = "#22c55e"; // green-500
        statusLabel = "Safe";
    } else if (value >= 1.2) {
        color = "#eab308"; // yellow-500
        statusLabel = "Moderate";
    } else if (value >= 1.0) {
        color = "#f97316"; // orange-500
        statusLabel = "Risky";
    }

    return (
        <div
            className={cn("relative flex flex-col items-center justify-center", className)}
            role="meter"
            aria-label="Health Factor"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={maxValue}
            aria-valuetext={`${value.toFixed(2)} - ${statusLabel}`}
        >
            {/* SVG Arc */}
            <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible" aria-hidden="true">
                {/* Background Track */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#1e293b" // slate-800
                    strokeWidth="15"
                    strokeLinecap="round"
                />

                {/* Progress Value */}
                <motion.path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={color}
                    strokeWidth="15"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: normalizedValue }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ strokeDasharray: "1 1" }}
                />
            </svg>

            {/* Center Text */}
            <div className="absolute bottom-4 flex flex-col items-center">
                <span className="text-4xl font-bold tracking-tighter" style={{ color }}>
                    {value.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Health Factor</span>
            </div>

            {/* Risk Labels */}
            <div className="w-full flex justify-between px-4 mt-[-10px] text-[10px] text-muted-foreground font-mono" aria-hidden="true">
                <span>0.0</span>
                <span>1.5</span>
                <span>3.0+</span>
            </div>
        </div>
    );
}
