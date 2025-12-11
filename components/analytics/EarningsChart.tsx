"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

export function EarningsChart() {
    const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("7d");
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Mock data - replace with real data from contract
        const mockData = {
            "24h": Array.from({ length: 24 }, (_, i) => ({
                time: `${i}:00`,
                earnings: Math.random() * 10 + 50,
            })),
            "7d": Array.from({ length: 7 }, (_, i) => ({
                time: `Day ${i + 1}`,
                earnings: Math.random() * 50 + 200,
            })),
            "30d": Array.from({ length: 30 }, (_, i) => ({
                time: `Day ${i + 1}`,
                earnings: Math.random() * 100 + 500,
            })),
        };

        setData(mockData[timeframe]);
    }, [timeframe]);

    const totalEarnings = data.reduce((sum, item) => sum + item.earnings, 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Cumulative Earnings</CardTitle>
                    <div className="flex gap-2">
                        {(["24h", "7d", "30d"] as const).map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                className={`px-3 py-1 text-xs rounded-md transition-colors ${timeframe === tf
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80"
                                    }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-success-500" />
                        <span className="text-2xl font-bold text-success-500">
                            ${totalEarnings.toFixed(2)}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Total earnings in {timeframe}
                    </p>
                </div>

                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="time"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="earnings"
                            stroke="hsl(var(--success-500))"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
