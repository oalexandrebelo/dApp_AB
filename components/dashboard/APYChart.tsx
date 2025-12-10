"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI, USDC_ADDRESS, EURC_ADDRESS, USYC_ADDRESS } from "@/lib/contracts";

interface APYDataPoint {
    timestamp: number;
    date: string;
    USDC_Supply: number;
    USDC_Borrow: number;
    EURC_Supply: number;
    EURC_Borrow: number;
    USYC_Supply: number;
    USYC_Borrow: number;
}

// Local storage for historical data
const STORAGE_KEY = 'arc_lending_apy_history';

function getAPYHistory(): APYDataPoint[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveAPYSnapshot(data: APYDataPoint) {
    if (typeof window === 'undefined') return;
    const history = getAPYHistory();
    history.push(data);
    // Keep only last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const filtered = history.filter(d => d.timestamp > thirtyDaysAgo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function APYChart() {
    const [chartData, setChartData] = useState<APYDataPoint[]>([]);

    // Fetch current rates (per second)
    const { data: usdcSupplyRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getSupplyRate',
        args: [USDC_ADDRESS],
    });

    const { data: usdcBorrowRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getBorrowRate',
        args: [USDC_ADDRESS],
    });

    const { data: eurcSupplyRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getSupplyRate',
        args: [EURC_ADDRESS],
    });

    const { data: eurcBorrowRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getBorrowRate',
        args: [EURC_ADDRESS],
    });

    const { data: usycSupplyRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getSupplyRate',
        args: [USYC_ADDRESS],
    });

    const { data: usycBorrowRate } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getBorrowRate',
        args: [USYC_ADDRESS],
    });

    // Helper function to convert rate per second to APY percentage
    const rateToAPY = (rate: bigint | undefined): number => {
        if (!rate) return 0;
        const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
        // rate is per second in 1e18, convert to APY percentage
        return (Number(rate) * SECONDS_PER_YEAR) / 1e18;
    };

    useEffect(() => {
        // Load historical data
        const history = getAPYHistory();
        setChartData(history);

        // Save current snapshot (once per hour)
        const lastSnapshot = history[history.length - 1];
        const oneHourAgo = Date.now() - (60 * 60 * 1000);

        if (!lastSnapshot || lastSnapshot.timestamp < oneHourAgo) {
            if (usdcSupplyRate && usdcBorrowRate) {
                const snapshot: APYDataPoint = {
                    timestamp: Date.now(),
                    date: new Date().toLocaleDateString(),
                    USDC_Supply: rateToAPY(usdcSupplyRate as bigint),
                    USDC_Borrow: rateToAPY(usdcBorrowRate as bigint),
                    EURC_Supply: rateToAPY(eurcSupplyRate as bigint),
                    EURC_Borrow: rateToAPY(eurcBorrowRate as bigint),
                    USYC_Supply: rateToAPY(usycSupplyRate as bigint),
                    USYC_Borrow: rateToAPY(usycBorrowRate as bigint),
                };
                saveAPYSnapshot(snapshot);
                setChartData([...history, snapshot]);
            }
        }
    }, [usdcSupplyRate, usdcBorrowRate, eurcSupplyRate, eurcBorrowRate, usycSupplyRate, usycBorrowRate]);

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>APY History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No historical data yet. APY snapshots are taken hourly.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>APY History (30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                            label={{ value: 'APY (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="USDC_Supply"
                            stroke="#10b981"
                            name="USDC Supply"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="USDC_Borrow"
                            stroke="#f59e0b"
                            name="USDC Borrow"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="EURC_Supply"
                            stroke="#3b82f6"
                            name="EURC Supply"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="EURC_Borrow"
                            stroke="#ef4444"
                            name="EURC Borrow"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
