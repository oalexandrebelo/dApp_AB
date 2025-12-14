"use client";

import { useLanguage } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { BridgeWidget } from '@/components/flows/BridgeWidget';
import { CrossChainBridgeWidget } from '@/components/flows/CrossChainBridgeWidget';
import { History, ArrowLeft } from 'lucide-react';
import { TransactionHistoryTable } from '@/components/dashboard/TransactionHistoryTable';
import { Button } from '@/components/ui/button';

export default function TransactionsPage() {
    const { t } = useLanguage();
    const router = useRouter();

    return (
        <div className="space-y-8">
            {/* Back Button */}
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

            {/* Two Widgets Side by Side - Both Always Visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Transfer Widget */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Quick Transfer</h2>
                        <p className="text-muted-foreground">Transfer tokens instantly on Arc Testnet.</p>
                    </div>
                    <BridgeWidget />
                </div>

                {/* Cross-Chain Bridge Widget - Always Visible */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Cross-Chain Bridge</h2>
                        <p className="text-muted-foreground">Transfer tokens instantly across networks via CCTP.</p>
                    </div>
                    <CrossChainBridgeWidget />
                </div>
            </div>

            {/* Transaction History */}
            <div className="border-t border-border pt-8">
                <div className="flex items-center gap-2 mb-6">
                    <History className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-xl font-bold">{t.dashboard.transactions_page.title}</h2>
                </div>

                <TransactionHistoryTable />
            </div>
        </div>
    );
}
