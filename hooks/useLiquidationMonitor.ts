// Hook to monitor health factor and show liquidation alerts
"use client";

import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';

interface UseLiquidationMonitorProps {
    healthFactor: number;
    totalSupplied: number;
    totalBorrowed: number;
}

export function useLiquidationMonitor({ 
    healthFactor, 
    totalSupplied, 
    totalBorrowed 
}: UseLiquidationMonitorProps) {
    const { toast } = useToast();
    const { settings } = useSettings();
    const lastAlertTime = useRef<number>(0);
    const hasShownCritical = useRef(false);

    useEffect(() => {
        // Only monitor if user has positions and alerts enabled
        if (!settings.liquidationAlerts || totalBorrowed === 0) {
            return;
        }

        const now = Date.now();
        const ALERT_COOLDOWN = 5 * 60 * 1000; // 5 minutes

        // Critical: HF < 1.0 (can be liquidated NOW)
        if (healthFactor < 1.0 && healthFactor > 0) {
            if (!hasShownCritical.current) {
                toast({
                    title: "🚨 CRITICAL: Liquidation Risk!",
                    description: `Your position can be liquidated! Health Factor: ${healthFactor.toFixed(2)}. Repay debt or add collateral immediately.`,
                    variant: "destructive",
                    duration: Infinity, // Don't auto-dismiss
                });
                hasShownCritical.current = true;
                lastAlertTime.current = now;
            }
        }
        // High Risk: HF < 1.2
        else if (healthFactor < 1.2 && healthFactor >= 1.0) {
            if (now - lastAlertTime.current > ALERT_COOLDOWN) {
                toast({
                    title: "⚠️ High Liquidation Risk",
                    description: `Your Health Factor is ${healthFactor.toFixed(2)}. Consider repaying debt or adding collateral.`,
                    variant: "destructive",
                    duration: 10000,
                });
                lastAlertTime.current = now;
                hasShownCritical.current = false;
            }
        }
        // Medium Risk: HF < 1.5
        else if (healthFactor < 1.5 && healthFactor >= 1.2) {
            if (now - lastAlertTime.current > ALERT_COOLDOWN) {
                toast({
                    title: "⚡ Moderate Risk",
                    description: `Your Health Factor is ${healthFactor.toFixed(2)}. Monitor your position closely.`,
                    duration: 8000,
                });
                lastAlertTime.current = now;
                hasShownCritical.current = false;
            }
        }
        // Safe: Reset critical flag
        else if (healthFactor >= 1.5) {
            hasShownCritical.current = false;
        }
    }, [healthFactor, totalBorrowed, settings.liquidationAlerts, toast]);
}
