"use client";

import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    label: string;
    status: 'pending' | 'active' | 'complete' | 'error';
}

interface TransactionStepperProps {
    steps: Step[];
    className?: string;
}

export function TransactionStepper({ steps, className }: TransactionStepperProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        {step.status === 'complete' && (
                            <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </div>
                        )}
                        {step.status === 'active' && (
                            <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                            </div>
                        )}
                        {step.status === 'pending' && (
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                <Circle className="h-3 w-3 text-muted-foreground" />
                            </div>
                        )}
                        {step.status === 'error' && (
                            <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                <Circle className="h-3 w-3 text-red-500" />
                            </div>
                        )}
                    </div>

                    {/* Label */}
                    <div className="flex-1">
                        <p className={cn(
                            "text-sm font-medium",
                            step.status === 'complete' && "text-green-500",
                            step.status === 'active' && "text-blue-500",
                            step.status === 'pending' && "text-muted-foreground",
                            step.status === 'error' && "text-red-500"
                        )}>
                            {step.label}
                        </p>
                    </div>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                        <div className="absolute left-[11px] top-[30px] w-0.5 h-6 bg-border"
                            style={{ marginTop: `${index * 36}px` }} />
                    )}
                </div>
            ))}
        </div>
    );
}
