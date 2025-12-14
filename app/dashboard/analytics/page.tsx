"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchHistoricalTVL, fetchProtocolVolume, TVLData, VolumeData } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLanguage } from '@/lib/i18n';

export default function AnalyticsPage() {
    const [tvlData, setTvlData] = useState<TVLData[]>([]);
    const [volumeData, setVolumeData] = useState<VolumeData[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            const [tvl, vol] = await Promise.all([fetchHistoricalTVL(), fetchProtocolVolume()]);
            setTvlData(tvl);
            setVolumeData(vol);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/dashboard')}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.analytics_page.title}</h1>
                <p className="text-muted-foreground">{t.dashboard.analytics_page.subtitle}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t.dashboard.analytics_page.tvl_title}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={tvlData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={30} />
                                <YAxis
                                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, "TVL"]}
                                />
                                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t.dashboard.analytics_page.volume_title}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={volumeData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={30} />
                                <YAxis
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Volume"]}
                                />
                                <Bar dataKey="amount" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
