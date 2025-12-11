import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, XCircle, Shield } from "lucide-react";

interface LiquidationAlertProps {
    healthFactor: number;
}

export function LiquidationAlert({ healthFactor }: LiquidationAlertProps) {
    // Critical: HF < 1.0 (liquidatable)
    if (healthFactor < 1.0) {
        return (
            <Alert variant="destructive" className="border-red-500 bg-red-950/50">
                <XCircle className="h-5 w-5" />
                <AlertTitle className="text-lg font-bold">🚨 CRITICAL - Liquidation Risk!</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                    <p className="font-semibold">
                        Your Health Factor is <span className="text-red-400">{healthFactor.toFixed(3)}</span>
                    </p>
                    <p>
                        You can be liquidated at any moment! Liquidators can seize up to{" "}
                        <span className="font-bold">
                            {healthFactor < 0.95 ? "100%" : "50%"}
                        </span>{" "}
                        of your debt.
                    </p>
                    <div className="mt-3 p-3 bg-red-900/30 rounded border border-red-500/30">
                        <p className="font-bold mb-2">⚡ Immediate Actions Required:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Deposit more collateral to increase your Health Factor</li>
                            <li>Repay part of your debt to reduce risk</li>
                            <li>Close risky positions before liquidation</li>
                        </ul>
                    </div>
                    {healthFactor < 0.95 && (
                        <div className="mt-2 p-2 bg-red-950 rounded border border-red-400">
                            <p className="text-xs font-bold text-red-300">
                                ⚠️ EMERGENCY MODE: Health Factor below 0.95 - Up to 100% of your position can be liquidated!
                            </p>
                        </div>
                    )}
                </AlertDescription>
            </Alert>
        );
    }

    // Warning: HF between 1.0 and 1.2
    if (healthFactor >= 1.0 && healthFactor < 1.2) {
        return (
            <Alert variant="default" className="border-yellow-500 bg-yellow-950/30">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <AlertTitle className="text-lg font-bold text-yellow-400">⚠️ WARNING - Close to Liquidation</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                    <p>
                        Your Health Factor is <span className="text-yellow-400 font-semibold">{healthFactor.toFixed(3)}</span>
                    </p>
                    <p className="text-sm">
                        You are close to the liquidation threshold (1.0). A small price movement could put you at risk.
                    </p>
                    <div className="mt-3 p-3 bg-yellow-900/20 rounded border border-yellow-500/30">
                        <p className="font-bold mb-2 text-yellow-300">💡 Recommended Actions:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Consider adding more collateral</li>
                            <li>Reduce your borrowed amount</li>
                            <li>Monitor your position closely</li>
                        </ul>
                    </div>
                </AlertDescription>
            </Alert>
        );
    }

    // Safe: HF >= 1.2
    if (healthFactor >= 1.2 && healthFactor < 999) {
        return (
            <Alert variant="default" className="border-success-500/30 bg-success-950/20">
                <Shield className="h-5 w-5 text-success-500" />
                <AlertTitle className="text-lg font-bold text-success-400">✅ Healthy Position</AlertTitle>
                <AlertDescription className="mt-2">
                    <p>
                        Your Health Factor is <span className="text-success-400 font-semibold">{healthFactor.toFixed(3)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Your position is safe. Keep monitoring market conditions.
                    </p>
                </AlertDescription>
            </Alert>
        );
    }

    // Extremely safe: HF >= 999 (capped)
    return (
        <Alert variant="default" className="border-success-500/30 bg-success-950/20">
            <Shield className="h-5 w-5 text-success-500" />
            <AlertTitle className="text-lg font-bold text-success-400">✅ Extremely Safe Position</AlertTitle>
            <AlertDescription className="mt-2">
                <p>
                    Your Health Factor is <span className="text-success-400 font-semibold">999+ (Excellent)</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                    Your position has very low liquidation risk.
                </p>
            </AlertDescription>
        </Alert>
    );
}

