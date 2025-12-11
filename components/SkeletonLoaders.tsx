"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function SkeletonCard() {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}

export function HeroMetricsSkeleton() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );
}

export function AssetTableSkeleton() {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[100px]" />
                                        <Skeleton className="h-3 w-[80px]" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-[80px] rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-full" />
                            </div>
                            <Skeleton className="h-9 w-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function ChartSkeleton() {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-[300px] w-full" />
                </div>
            </CardContent>
        </Card>
    );
}
