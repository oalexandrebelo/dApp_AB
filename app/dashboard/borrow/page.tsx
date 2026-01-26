"use client";

import { useRouter } from 'next/navigation';
import { AssetTable } from "@/components/dashboard/AssetTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingDown } from "lucide-react";
import { useLanguage } from '@/lib/i18n';
import { ShinyText } from "@/components/react-bits/ShinyText";
import { motion } from "framer-motion";

export default function BorrowPage() {
    const { t } = useLanguage();
    const router = useRouter();

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Animated Back Button */}
            <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
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

            {/* Header with ShinyText */}
            <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <TrendingDown className="h-6 w-6 text-orange-500" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        <ShinyText
                            text={t.dashboard.borrow_page.title}
                            colors={["#f97316", "#fb923c", "#fdba74"]}
                            duration={4}
                        />
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg pl-[60px]">
                    {t.dashboard.borrow_page.subtitle}
                </p>

                {/* Gradient Divider */}
                <div className="h-px bg-gradient-to-r from-orange-500/50 via-orange-500/20 to-transparent ml-[60px]" />
            </motion.div>

            {/* Asset Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <AssetTable mode="borrow" />
            </motion.div>
        </motion.div>
    );
}

