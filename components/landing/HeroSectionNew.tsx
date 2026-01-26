"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wallet, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Aurora } from '@/components/react-bits/Aurora';
import { SplitText } from '@/components/react-bits/SplitText';
import { Magnet } from '@/components/react-bits/Magnet';
import { motion } from 'framer-motion';

export function HeroSectionNew() {
    const router = useRouter();

    const handleLaunchApp = () => {
        router.push('/dashboard');
    };

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden">
            <Aurora colors={["#06b6d4", "#8b5cf6", "#3b82f6", "#020617"]}>
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">

                    {/* Floating 3D Logo Effect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <Image
                            src="/logo-full.svg"
                            alt="Nexux Lend"
                            width={220}
                            height={66}
                            priority
                            className="mx-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                        />
                    </motion.div>

                    {/* Headline with ReactBits SplitText */}
                    <div className="mb-6 max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-2 sora-font">
                            <SplitText delay={50} className="inline-block">
                                Instant Liquidity.
                            </SplitText>
                        </h1>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 sora-font">
                            <SplitText delay={100} className="inline-block">
                                Zero Friction.
                            </SplitText>
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
                    >
                        Experience the CCTP standard. Seamlessly bridge and lend USDC across chains with institutional-grade security and finality.
                    </motion.p>

                    {/* Magnetic CTA */}
                    <div className="flex justify-center gap-6">
                        <Magnet padding={50} magnetStrength={3}>
                            <Button
                                size="lg"
                                className="relative group px-8 h-14 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-full text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                                onClick={handleLaunchApp}
                            >
                                <span className="relative z-10 flex items-center">
                                    Launch App <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </Magnet>

                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md"
                        >
                            Learn More
                        </Button>
                    </div>

                    {/* Minimalist Feature Icons */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="mt-20 flex gap-12 justify-center items-center text-gray-400"
                    >
                        <div className="flex flex-col items-center gap-2 group hover:text-cyan-400 transition-colors cursor-pointer">
                            <div className="p-3 rounded-full bg-white/5 group-hover:bg-cyan-500/10 transition-colors">
                                <Wallet className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-medium">Multi-Chain</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group hover:text-purple-400 transition-colors cursor-pointer">
                            <div className="p-3 rounded-full bg-white/5 group-hover:bg-purple-500/10 transition-colors">
                                <Shield className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-medium">Audited</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group hover:text-pink-400 transition-colors cursor-pointer">
                            <div className="p-3 rounded-full bg-white/5 group-hover:bg-pink-500/10 transition-colors">
                                <Zap className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-medium">Instant</span>
                        </div>
                    </motion.div>

                </div>
            </Aurora>
        </div>
    );
}
