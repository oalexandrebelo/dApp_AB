"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useAssetDistribution } from "@/lib/useAssetDistribution";

const COLORS = {
    USDC: "hsl(var(--info-500))",
    EURC: "hsl(var(--success-500))",
    USYC: "hsl(var(--warning-500))",
};

export function AssetDistribution() {
    const data = useAssetDistribution();
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Asset Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                            }}
                            formatter={(value: number) => `$${value.toFixed(2)}`}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }}
                                />
                                <span className="text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm font-semibold">
                                ${item.value.toFixed(2)} ({totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0}%)
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Total Value</span>
                        <span className="text-lg font-bold">${totalValue.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
