"use client";

import { AssetTable } from "@/components/dashboard/AssetTable";
import { useLanguage } from '@/lib/i18n';

export default function SupplyPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.supply_page.title}</h1>
                <p className="text-muted-foreground">{t.dashboard.supply_page.subtitle}</p>
            </div>
            <AssetTable />
        </div>
    );
}
