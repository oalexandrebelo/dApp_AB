"use client";

import { useRouter } from 'next/navigation';
import { AssetTable } from "@/components/dashboard/AssetTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from '@/lib/i18n';

export default function SupplyPage() {
    const { t } = useLanguage();
    const router = useRouter();

    return (
        <div className="space-y-6">
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
                <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.supply_page.title}</h1>
                <p className="text-muted-foreground">{t.dashboard.supply_page.subtitle}</p>
            </div>
            <AssetTable mode="supply" />
        </div>
    );
}
