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

    // Fetch current APYs
    const { data: usdcSupplyAPY } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getSupplyAPY' as any,
        args: [USDC_ADDRESS],
    });

    const { data: usdcBorrowAPY } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getBorrowAPY' as any,
        args: [USDC_ADDRESS],
    });

    const { data: eurcSupplyAPY } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getSupplyAPY' as any,
        args: [EURC_ADDRESS],
    });

    const { data: eurcBorrowAPY } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getBorrowAPY' as any,
        args: [EURC_ADDRESS],
    });

    const { data: usycSupplyAPY } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getSupplyAPY' as any,
        args: [USYC_ADDRESS],
    });

    const { data: usycBorrowAPY } = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: 'getBorrowAPY' as any,
        args: [USYC_ADDRESS],
    });

    useEffect(() => {
        // Load historical data
        const history = getAPYHistory();
        setChartData(history);

        // Save current snapshot (once per hour)
        const lastSnapshot = history[history.length - 1];
        const oneHourAgo = Date.now() - (60 * 60 * 1000);

        if (!lastSnapshot || lastSnapshot.timestamp < oneHourAgo) {
            if (usdcSupplyAPY && usdcBorrowAPY) {
                const snapshot: APYDataPoint = {
                    timestamp: Date.now(),
                    date: new Date().toLocaleDateString(),
                    USDC_Supply: Number(usdcSupplyAPY) / 100,
                    USDC_Borrow: Number(usdcBorrowAPY) / 100,
                    EURC_Supply: Number(eurcSupplyAPY || 0) / 100,
                    EURC_Borrow: Number(eurcBorrowAPY || 0) / 100,
                    USYC_Supply: Number(usycSupplyAPY || 0) / 100,
                    USYC_Borrow: Number(usycBorrowAPY || 0) / 100,
                };
                saveAPYSnapshot(snapshot);
                setChartData([...history, snapshot]);
            }
        }
    }, [usdcSupplyAPY, usdcBorrowAPY, eurcSupplyAPY, eurcBorrowAPY, usycSupplyAPY, usycBorrowAPY]);

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
