"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
    data: number[];
    color?: string;
    width?: number;
    height?: number;
}

export function Sparkline({ data, color = "#22c55e", width = 100, height = 40 }: SparklineProps) {
    const chartData = data.map((val, i) => ({ i, val }));

    return (
        <div style={{ width, height }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <Line
                        type="monotone"
                        dataKey="val"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false} // Performance optimization for tables
                    />
                    {/* Hide Axis for clean sparkline look */}
                    <YAxis domain={['auto', 'auto']} hide />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
