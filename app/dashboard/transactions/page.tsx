"use client";

import { useLanguage } from '@/lib/i18n';

import { BridgeWidget } from '@/components/flows/BridgeWidget';
import { History } from 'lucide-react';

export default function TransactionsPage() {
    const { t } = useLanguage();

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col items-center space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Quick Transfer</h1>
                    <p className="text-muted-foreground">Swap & Bridge tokens instantly across chains.</p>
                </div>
                <BridgeWidget />
            </div>

            <div className="border-t border-border pt-8">
                <div className="flex items-center gap-2 mb-6">
                    <History className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-xl font-bold">{t.dashboard.transactions_page.title}</h2>
                </div>

                {/* Placeholder History List */}
                <div className="bg-card/50 rounded-xl border border-border/50 p-8 text-center space-y-4">
                    <div className="flex justify-center text-muted-foreground">
                        <History className="h-12 w-12 opacity-20" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium text-foreground">{t.dashboard.transactions_page.subtitle}</p>
                        <p className="text-sm text-muted-foreground">No recent transactions found.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
