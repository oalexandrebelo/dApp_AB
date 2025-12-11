"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export function HealthFactorHistory() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Mock data - replace with real historical data
        const mockData = Array.from({ length: 30 }, (_, i) => ({
            day: `Day ${i + 1}`,
            healthFactor: Math.random() * 3 + 1.5, // Random between 1.5 and 4.5
        }));

        setData(mockData);
    }, []);

    const currentHF = data[data.length - 1]?.healthFactor || 0;
    const status = currentHF >= 2 ? "safe" : currentHF >= 1.2 ? "moderate" : "risk";

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Health Factor History</CardTitle>
                    <div className="flex items-center gap-2">
                        {status === "safe" ? (
                            <CheckCircle2 className="h-5 w-5 text-success-500" />
                        ) : (
                            <AlertTriangle className="h-5 w-5 text-warning-500" />
                        )}
                        <span className={`text-sm font-semibold ${status === "safe" ? "text-success-500" :
                                status === "moderate" ? "text-warning-500" :
                                    "text-error-500"
                            }`}>
                            {status.toUpperCase()}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Health Factor</span>
                        <span className={`text-2xl font-bold ${status === "safe" ? "text-success-500" :
                                status === "moderate" ? "text-warning-500" :
                                    "text-error-500"
                            }`}>
                            {currentHF.toFixed(2)}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {status === "safe" && "Your position is safe from liquidation"}
                        {status === "moderate" && "Monitor your position carefully"}
                        {status === "risk" && "⚠️ High liquidation risk!"}
                    </p>
                </div>

                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="day"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            domain={[0, 5]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                            }}
                        />
                        {/* Danger zone */}
                        <ReferenceLine y={1} stroke="hsl(var(--error-500))" strokeDasharray="3 3" label="Liquidation" />
                        {/* Warning zone */}
                        <ReferenceLine y={1.2} stroke="hsl(var(--warning-500))" strokeDasharray="3 3" label="Warning" />
                        {/* Safe zone */}
                        <ReferenceLine y={2} stroke="hsl(var(--success-500))" strokeDasharray="3 3" label="Safe" />

                        <Line
                            type="monotone"
                            dataKey="healthFactor"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-error-500" />
                        <span className="text-muted-foreground">&lt; 1.2 Risk</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-warning-500" />
                        <span className="text-muted-foreground">1.2-2.0 Moderate</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-success-500" />
                        <span className="text-muted-foreground">&gt; 2.0 Safe</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
