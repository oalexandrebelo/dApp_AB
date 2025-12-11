"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, AlertOctagon } from "lucide-react";
import { useLanguage } from '@/lib/i18n';

interface HealthFactorProps {
    value: number;
}

export function HealthFactor({ value }: HealthFactorProps) {
    const { t } = useLanguage();
    let status: "healthy" | "warning" | "critical" = "healthy";
    if (value < 1.1) status = "critical";
    else if (value < 1.5) status = "warning";

    const colorMap = {
        healthy: "text-success-500",
        warning: "text-yellow-500",
        critical: "text-red-500",
    };

    const bgMap = {
        healthy: "bg-success-500/10 border-success-500/20",
        warning: "bg-yellow-500/10 border-yellow-500/20",
        critical: "bg-red-500/10 border-red-500/20",
    };

    const iconMap = {
        healthy: CheckCircle,
        warning: AlertTriangle,
        critical: AlertOctagon,
    };

    const Icon = iconMap[status];

    return (
        <div className={cn("rounded-xl border p-4 flex items-center justify-between", bgMap[status])}>
            <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full bg-background/50 backdrop-blur-sm", colorMap[status])}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground font-medium">{t.dashboard.health_factor.title}</p>
                    <div className={cn("text-2xl font-bold tracking-tight", colorMap[status])}>
                        {value.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className="h-2.5 w-24 bg-background/50 border border-muted-foreground/20 rounded-full overflow-hidden">
                    <motion.div
                        className={cn("h-full", status === "healthy" ? "bg-success-500" : status === "warning" ? "bg-yellow-500" : "bg-red-500")}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(value * 20, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
                <span className="text-xs text-muted-foreground">
                    {status === "healthy" ? t.dashboard.health_factor.status_safe : status === "warning" ? t.dashboard.health_factor.status_risk : t.dashboard.health_factor.liquidation_warning}
                </span>
            </div>
        </div>
    );
}

