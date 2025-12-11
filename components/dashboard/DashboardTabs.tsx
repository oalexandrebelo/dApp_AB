"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Briefcase, TrendingUp } from "lucide-react";

interface DashboardTabsProps {
    marketsContent: React.ReactNode;
    portfolioContent: React.ReactNode;
    analyticsContent: React.ReactNode;
}

export function DashboardTabs({
    marketsContent,
    portfolioContent,
    analyticsContent,
}: DashboardTabsProps) {
    return (
        <Tabs defaultValue="markets" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="markets" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Markets</span>
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Portfolio</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="markets" className="space-y-4">
                {marketsContent}
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
                {portfolioContent}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
                {analyticsContent}
            </TabsContent>
        </Tabs>
    );
}
