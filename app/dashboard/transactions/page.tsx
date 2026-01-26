"use client";

import { useLanguage } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { BridgeWidget } from '@/components/flows/BridgeWidget';
import { CrossChainBridgeWidget } from '@/components/flows/CrossChainBridgeWidget';
import { History, ArrowLeft, Zap, Globe } from 'lucide-react';
import { TransactionHistoryTable } from '@/components/dashboard/TransactionHistoryTable';
import { Button } from '@/components/ui/button';
import { ShinyText } from '@/components/react-bits/ShinyText';
import { motion } from 'framer-motion';

export default function TransactionsPage() {
    const { t } = useLanguage();
    const router = useRouter();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Back Button */}
            <motion.div className="flex items-center gap-4" variants={item}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/dashboard')}
                    className="gap-2 hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>
            </motion.div>

            {/* Two Widgets Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Transfer Widget */}
                <motion.div
                    className="flex flex-col space-y-4"
                    variants={item}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                            <Zap className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">
                                <ShinyText
                                    text="Quick Transfer"
                                    colors={["#06b6d4", "#22d3ee", "#67e8f9"]}
                                    duration={3}
                                />
                            </h2>
                            <p className="text-sm text-muted-foreground">Transfer tokens instantly on Arc Testnet.</p>
                        </div>
                    </div>
                    <BridgeWidget />
                </motion.div>

                {/* Cross-Chain Bridge Widget */}
                <motion.div
                    className="flex flex-col space-y-4"
                    variants={item}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                            <Globe className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">
                                <ShinyText
                                    text="Cross-Chain Bridge"
                                    colors={["#8b5cf6", "#a78bfa", "#c4b5fd"]}
                                    duration={3}
                                />
                            </h2>
                            <p className="text-sm text-muted-foreground">Transfer tokens across networks via CCTP.</p>
                        </div>
                    </div>
                    <CrossChainBridgeWidget />
                </motion.div>
            </div>

            {/* Transaction History */}
            <motion.div
                className="pt-4"
                variants={item}
            >
                {/* Gradient Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-6" />

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <History className="h-5 w-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold">
                        <ShinyText
                            text={t.dashboard.transactions_page.title}
                            colors={["#6366f1", "#818cf8", "#a5b4fc"]}
                            duration={4}
                        />
                    </h2>
                </div>

                <TransactionHistoryTable />
            </motion.div>
        </motion.div>
    );
}


