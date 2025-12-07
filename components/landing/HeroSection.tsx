"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wallet, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useLanguage } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function HeroSection() {
    const router = useRouter();
    const { openConnectModal } = useConnectModal();
    const { isConnected } = useAccount();
    const { t } = useLanguage();

    const handleLaunchApp = () => {
        if (isConnected) {
            router.push('/dashboard');
        } else {
            router.push('/dashboard');
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-background selection:bg-purple-500/30">
            {/* Language Switcher Absolute Top Right */}
            <div className="absolute top-6 right-6 z-50">
                <LanguageSwitcher />
            </div>

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center space-y-8"
            >
                <motion.div variants={itemVariants} className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-black mb-6">
                        {t.landing.hero.title_start} <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {t.landing.hero.title_highlight}
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto">
                        {t.landing.hero.subtitle}
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                    <Button
                        size="lg"
                        variant="premium"
                        className="text-base px-8 h-12"
                        onClick={handleLaunchApp}
                    >
                        {t.landing.hero.launch_app} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-base px-8 h-12 border-white/10 hover:bg-white/5"
                        onClick={() => window.open('https://docs.arc.network', '_blank')}
                    >
                        {t.landing.hero.docs}
                    </Button>
                </motion.div>

                {/* Feature Cards */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left w-full max-w-5xl"
                >
                    <FeatureCard
                        icon={<Wallet className="h-8 w-8 text-purple-400" />}
                        title={t.landing.features.cross_chain_title}
                        description={t.landing.features.cross_chain_desc}
                    />
                    <FeatureCard
                        icon={<Shield className="h-8 w-8 text-indigo-400" />}
                        title={t.landing.features.institutional_title}
                        description={t.landing.features.institutional_desc}
                    />
                    <FeatureCard
                        icon={<Zap className="h-8 w-8 text-pink-400" />}
                        title={t.landing.features.instant_title}
                        description={t.landing.features.instant_desc}
                    />
                </motion.div>
            </motion.div >
        </div >
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="group p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/10 transition-all duration-300">
            <div className="mb-4 p-3 bg-white/5 w-fit rounded-xl group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
