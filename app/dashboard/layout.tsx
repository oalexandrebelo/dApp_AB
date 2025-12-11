"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { OnboardingTour } from "@/components/dashboard/OnboardingTour";
import { motion } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-xl h-16 flex items-center px-6 justify-end">
                <div className="flex items-center gap-4">
                    <ConnectButton
                        accountStatus={{
                            smallScreen: 'avatar',
                            largeScreen: 'full',
                        }}
                    />
                </div>
            </nav>

            {/* Main Layout Area */}
            <div className="flex pt-16">
                <div className="hidden lg:block w-64 fixed h-[calc(100vh-4rem)]">
                    <Sidebar />
                </div>

                <main className="flex-1 lg:pl-64 p-6 overflow-y-auto min-h-[calc(100vh-4rem)]">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>
                <OnboardingTour />
            </div>
        </div>
    );
}
